import assert from 'node:assert/strict'
import test from 'node:test'
import { ensureSecureDirectoryChain } from '../../scripts/secure-files.mjs'

function descriptorAdapter() {
  let nextInode = 1
  let nextDescriptor = 10
  const operations = []
  const directory = (mode = 0o755) => ({
    type: 'directory',
    mode,
    inode: nextInode++,
    children: new Map(),
  })
  const symlink = (target) => ({
    type: 'symlink',
    mode: 0o777,
    inode: nextInode++,
    target,
  })
  const root = directory()
  let mkdirRace

  function stat(node) {
    return {
      dev: 1,
      ino: node.inode,
      mode: node.mode,
      isDirectory: () => node.type === 'directory',
      isSymbolicLink: () => node.type === 'symlink',
    }
  }

  function identity(node, path) {
    return {
      path,
      inode: stat(node),
      descriptor: nextDescriptor++,
      node,
      descriptorRelative: true,
      closed: false,
    }
  }

  const adapter = {
    root,
    operations,
    directory,
    symlink,
    setMkdirRace(callback) {
      mkdirRace = callback
    },
    openRoot(path) {
      operations.push({ operation: 'openRoot', path })
      return identity(root, path)
    },
    validateIdentity(item) {
      operations.push({ operation: 'fstat', descriptor: item.descriptor })
      if (item.closed || item.inode.ino !== item.node.inode) {
        throw new Error(`Directory identity changed: ${item.path}`)
      }
    },
    lstat() {
      throw new Error('native descriptor walk attempted an absolute-path lstat')
    },
    lstatChild(parent, name) {
      operations.push({ operation: 'lstatChild', parent: parent.descriptor, name })
      const node = parent.node.children.get(name)
      if (!node) {
        const error = new Error('missing')
        error.code = 'ENOENT'
        throw error
      }
      return stat(node)
    },
    mkdirChild(parent, name) {
      operations.push({ operation: 'mkdirChild', parent: parent.descriptor, name })
      if (mkdirRace) return mkdirRace(parent.node, name)
      parent.node.children.set(name, directory(0o700))
    },
    openChild(parent, name, path) {
      operations.push({ operation: 'openChild', parent: parent.descriptor, name })
      const node = parent.node.children.get(name)
      if (!node || node.type !== 'directory') {
        const error = new Error('O_NOFOLLOW rejected child')
        error.code = 'ELOOP'
        throw error
      }
      return identity(node, path)
    },
    close(item) {
      item.closed = true
    },
  }
  return adapter
}

test('descriptor directory walker stays on retained inode after ancestor replacement', () => {
  const adapter = descriptorAdapter()
  const owned = adapter.directory()
  const attacker = adapter.directory()
  adapter.root.children.set('secured', owned)

  const result = ensureSecureDirectoryChain('/secured/nested', {
    descriptorAdapter: adapter,
    hooks: {
      beforeSegment: ({ index }) => {
        if (index === 1) adapter.root.children.set('secured', attacker)
      },
    },
  })
  assert.equal(attacker.children.size, 0)
  assert.equal(owned.children.has('nested'), true)
  assert.equal(result.node, owned.children.get('nested'))
  adapter.close(result)
  assert.equal(
    adapter.operations.filter(({ operation }) => operation === 'openRoot').length,
    1,
  )
  assert.equal(
    adapter.operations.some(({ operation }) => operation === 'lstat'),
    false,
  )
})

test('descriptor directory walker rejects symlink children without opening them', () => {
  const adapter = descriptorAdapter()
  adapter.root.children.set('linked', adapter.symlink())

  assert.throws(
    () => ensureSecureDirectoryChain('/linked/child', {
      descriptorAdapter: adapter,
    }),
    /Unsafe non-directory or symlink/,
  )
  assert.equal(
    adapter.operations.some(({ operation, name }) =>
      operation === 'openChild' && name === 'linked'),
    false,
  )
})

test('descriptor directory walker rejects an ancestor symlink to the same directory', () => {
  const adapter = descriptorAdapter()
  const target = adapter.directory()
  adapter.root.children.set('target', target)
  adapter.root.children.set('alias', adapter.symlink(target))

  assert.throws(
    () => ensureSecureDirectoryChain('/alias/child', {
      descriptorAdapter: adapter,
    }),
    /Unsafe non-directory or symlink/,
  )
  assert.equal(target.children.size, 0)
})

test('descriptor directory walker validates an EEXIST mkdir race relatively', () => {
  const adapter = descriptorAdapter()
  adapter.setMkdirRace((parent, name) => {
    parent.children.set(name, adapter.directory(0o700))
    const error = new Error('raced')
    error.code = 'EEXIST'
    throw error
  })

  const result = ensureSecureDirectoryChain('/raced', {
    descriptorAdapter: adapter,
  })
  assert.equal(result.path, '/raced')
  adapter.close(result)
  assert.deepEqual(
    adapter.operations
      .map(({ operation }) => operation)
      .filter((operation) => operation !== 'fstat'),
    ['openRoot', 'lstatChild', 'mkdirChild', 'lstatChild', 'openChild'],
  )
  for (const operation of adapter.operations.filter(({ operation }) =>
    operation.endsWith('Child'))) {
    assert.equal(operation.name.includes('/'), false)
    assert.equal(typeof operation.parent, 'number')
  }
})

test('descriptor directory walker rejects unsafe mkdir race mode', () => {
  const adapter = descriptorAdapter()
  adapter.setMkdirRace((parent, name) => {
    parent.children.set(name, adapter.directory(0o777))
    const error = new Error('raced')
    error.code = 'EEXIST'
    throw error
  })

  assert.throws(
    () => ensureSecureDirectoryChain('/raced', {
      descriptorAdapter: adapter,
    }),
    /Directory changed or is unsafe/,
  )
})
