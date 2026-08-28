import { createHash } from 'node:crypto'
import {
  chmodSync,
  closeSync,
  constants,
  fstatSync,
  fsyncSync,
  linkSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmdirSync,
  unlinkSync,
  writeSync,
} from 'node:fs'
import { basename, dirname, join, parse, resolve, sep } from 'node:path'

const NO_FOLLOW = constants.O_NOFOLLOW ?? 0
const DIRECTORY = constants.O_DIRECTORY ?? 0

export function supportsDescriptorRelativeChildOperations() {
  if (process.platform !== 'linux') return false
  let descriptor
  try {
    descriptor = openSync('.', constants.O_RDONLY | DIRECTORY | NO_FOLLOW)
    const opened = fstatSync(descriptor)
    const throughDescriptor = lstatSync(`/proc/self/fd/${descriptor}/.`)
    return opened.isDirectory() &&
      throughDescriptor.isDirectory() &&
      sameInode(opened, throughDescriptor)
  } catch {
    return false
  } finally {
    if (descriptor !== undefined) closeSync(descriptor)
  }
}

const DESCRIPTOR_RELATIVE_PATHS = supportsDescriptorRelativeChildOperations()

export function requireSecureRecoveryFilesystem({
  allowTestOnlyPathFallback = false,
  nodeEnv,
} = {}) {
  if (DESCRIPTOR_RELATIVE_PATHS) {
    return { descriptorRelative: true, testOnlyPathFallback: false }
  }
  if (allowTestOnlyPathFallback && nodeEnv === 'test') {
    return { descriptorRelative: false, testOnlyPathFallback: true }
  }
  throw new Error(
    'Secure recovery requires Linux /proc/self/fd descriptor-relative child operations; ' +
    'pathname fallback is test-only and requires NODE_ENV=test with the explicit ' +
    'allowTestOnlyPathFallback function option',
  )
}

function sameInode(left, right) {
  return left.dev === right.dev && left.ino === right.ino
}

function existingEntry(path) {
  try {
    return lstatSync(path)
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

function openDirectoryIdentity(path, { descriptorRelative = false } = {}) {
  const descriptor = openSync(path, constants.O_RDONLY | DIRECTORY | NO_FOLLOW)
  const inode = fstatSync(descriptor)
  if (!inode.isDirectory()) {
    closeSync(descriptor)
    throw new Error(`Unsafe non-directory path: ${path}`)
  }
  return { path, inode, descriptor, descriptorRelative, closed: false }
}

function descriptorPath(identity, name) {
  return DESCRIPTOR_RELATIVE_PATHS
    ? `/proc/self/fd/${identity.descriptor}/${name}`
    : join(identity.path, name)
}

function duplicateDirectoryIdentity(identity) {
  assertDirectoryIdentity(identity, 'Directory')
  const duplicate = openDirectoryIdentity(descriptorPath(identity, '.'), {
    descriptorRelative: identity.descriptorRelative,
  })
  duplicate.path = identity.path
  if (!sameInode(identity.inode, duplicate.inode)) {
    closeDirectoryIdentity(duplicate)
    throw new Error('Directory changed while retaining its descriptor')
  }
  assertDirectoryIdentity(duplicate, 'Directory')
  return duplicate
}

function assertDirectoryIdentity(identity, label) {
  if (!identity || identity.closed) throw new Error(`${label} descriptor is closed`)
  const descriptorEntry = fstatSync(identity.descriptor)
  const descriptorChanged = !descriptorEntry.isDirectory() ||
    !sameInode(identity.inode, descriptorEntry) ||
    (identity.inode.mode & 0o7777) !== (descriptorEntry.mode & 0o7777)
  if (identity.descriptorRelative) {
    if (descriptorChanged) throw new Error(`${label} changed or is unsafe`)
    return
  }
  const pathEntry = lstatSync(identity.path)
  if (descriptorChanged ||
      !pathEntry.isDirectory() ||
      pathEntry.isSymbolicLink() ||
      !sameInode(identity.inode, pathEntry) ||
      (identity.inode.mode & 0o7777) !== (pathEntry.mode & 0o7777)) {
    throw new Error(`${label} changed or is unsafe`)
  }
}

export function closeDirectoryIdentity(identity) {
  if (!identity || identity.closed) return
  closeSync(identity.descriptor)
  identity.closed = true
}

export function assertPathAbsent(path, label = 'Output') {
  const absolute = resolve(path)
  if (existingEntry(absolute)) throw new Error(`${label} already exists: ${absolute}`)
  return absolute
}

function ensureSecureDirectoryChainFallback(directory, { createMissing = true } = {}) {
  const requested = resolve(directory)
  const root = parse(requested).root
  const segments = requested.slice(root.length).split(sep).filter(Boolean)
  const verified = []
  let current = root
  for (const segment of segments) {
    const parent = lstatSync(current)
    if (!parent.isDirectory() || parent.isSymbolicLink()) {
      throw new Error(`Unsafe non-directory or symlink path segment: ${current}`)
    }
    const next = join(current, segment)
    let entry = existingEntry(next)
    let created = false
    if (!entry) {
      if (!createMissing) throw new Error(`Backup directory does not exist: ${next}`)
      try {
        mkdirSync(next, { mode: 0o700 })
        created = true
      } catch (error) {
        if (error.code !== 'EEXIST') throw error
      }
      entry = lstatSync(next)
    }
    const parentAfter = lstatSync(current)
    if (!sameInode(parent, parentAfter)) {
      throw new Error(`Directory path changed during secure creation: ${current}`)
    }
    if (!entry.isDirectory() || entry.isSymbolicLink()) {
      throw new Error(`Unsafe non-directory or symlink path segment: ${next}`)
    }
    if (created && (entry.mode & 0o777) !== 0o700) {
      throw new Error(`Created backup directory has unsafe mode: ${next}`)
    }
    verified.push({ path: next, inode: entry })
    current = next
  }
  for (const item of verified) {
    const currentEntry = lstatSync(item.path)
    if (!sameInode(item.inode, currentEntry) ||
        !currentEntry.isDirectory() ||
        currentEntry.isSymbolicLink()) {
      throw new Error(`Directory path changed during secure creation: ${item.path}`)
    }
  }
  const identity = openDirectoryIdentity(requested)
  try {
    assertDirectoryIdentity(identity, 'Backup parent')
    return identity
  } catch (error) {
    closeDirectoryIdentity(identity)
    throw error
  }
}

function nativeDescriptorWalker() {
    return {
      openRoot(path) {
        return openDirectoryIdentity(path, { descriptorRelative: true })
      },
      validateIdentity(identity) {
        assertDirectoryIdentity(identity, 'Backup directory')
      },
      lstatChild(parent, name) {
        return lstatSync(descriptorPath(parent, name))
      },
      mkdirChild(parent, name) {
        mkdirSync(descriptorPath(parent, name), { mode: 0o700 })
      },
      openChild(parent, name, path) {
        const descriptor = openSync(
          descriptorPath(parent, name),
          constants.O_RDONLY | DIRECTORY | NO_FOLLOW,
        )
        const inode = fstatSync(descriptor)
        return { path, inode, descriptor, descriptorRelative: true, closed: false }
      },
      close(identity) {
        closeDirectoryIdentity(identity)
      },
    }
  }

function missingEntry(error) {
    return error?.code === 'ENOENT'
  }

export function walkSecureDirectoryChain(requestedDirectory, adapter, {
    beforeSegment = () => {},
    afterMkdir = () => {},
    createMissing = true,
  } = {}) {
    const requested = resolve(requestedDirectory)
    const root = parse(requested).root
    const segments = requested.slice(root.length).split(sep).filter(Boolean)
    let parent = adapter.openRoot(root)
    let currentPath = root
    try {
      adapter.validateIdentity(parent)
      for (const [index, segment] of segments.entries()) {
        beforeSegment({ index, segment, parent, path: currentPath })
        adapter.validateIdentity(parent)
        let entry
        let created = false
        let mustBePrivate = false
        try {
          entry = adapter.lstatChild(parent, segment)
        } catch (error) {
          if (!missingEntry(error)) throw error
          if (!createMissing) {
            throw new Error(`Backup directory does not exist: ${join(currentPath, segment)}`)
          }
          mustBePrivate = true
          try {
            adapter.mkdirChild(parent, segment)
            created = true
          } catch (mkdirError) {
            if (mkdirError.code !== 'EEXIST') throw mkdirError
          }
          afterMkdir({ index, segment, parent, path: currentPath, created })
          adapter.validateIdentity(parent)
          entry = adapter.lstatChild(parent, segment)
        }
        adapter.validateIdentity(parent)
        if (!entry.isDirectory() || entry.isSymbolicLink()) {
          throw new Error(`Unsafe non-directory or symlink path segment: ${join(currentPath, segment)}`)
        }
        const childPath = join(currentPath, segment)
        const child = adapter.openChild(parent, segment, childPath)
        try {
          if (!child.inode.isDirectory() ||
              !sameInode(entry, child.inode) ||
              (mustBePrivate && (child.inode.mode & 0o777) !== 0o700)) {
            throw new Error(`Directory changed or is unsafe: ${childPath}`)
          }
          adapter.validateIdentity(child)
        } catch (error) {
          adapter.close(child)
          throw error
        }
        adapter.close(parent)
        parent = child
        currentPath = childPath
      }
      adapter.validateIdentity(parent)
      return parent
    } catch (error) {
      adapter.close(parent)
      throw error
    }
  }

export function ensureSecureDirectoryChain(directory, {
    descriptorAdapter,
    hooks,
    createMissing = true,
  } = {}) {
    const walkOptions = { ...hooks, createMissing }
    if (descriptorAdapter) {
      return walkSecureDirectoryChain(directory, descriptorAdapter, walkOptions)
    }
    if (DESCRIPTOR_RELATIVE_PATHS) {
      return walkSecureDirectoryChain(directory, nativeDescriptorWalker(), walkOptions)
    }
    return ensureSecureDirectoryChainFallback(directory, { createMissing })
  }
export function createPrivateStage(targetPath, prefix, {
  parentIdentity,
  recoveryFilesystem,
} = {}) {
  const requested = resolve(targetPath)
  const requestedParent = dirname(requested)
  let parent = parentIdentity
  try {
    if (!parent) {
      const canonicalParent = realpathSync(requestedParent)
      parent = openDirectoryIdentity(canonicalParent)
    } else if (parent.path !== requestedParent) {
      throw new Error('Staging parent changed or is unsafe')
    }
    assertDirectoryIdentity(parent, 'Staging parent')
    const descriptorPrefix = descriptorPath(parent, prefix)
    const createdPath = mkdtempSync(descriptorPrefix)
    const name = basename(createdPath)
    const path = join(parent.path, name)
    assertDirectoryIdentity(parent, 'Staging parent')
    chmodSync(descriptorPath(parent, name), 0o700)
    assertDirectoryIdentity(parent, 'Staging parent')
    const stage = openDirectoryIdentity(descriptorPath(parent, name), {
      descriptorRelative: parent.descriptorRelative,
    })
    stage.path = path
    stage.name = name
    stage.parent = parent
    stage.recoveryFilesystem = recoveryFilesystem ?? {
      descriptorRelative: DESCRIPTOR_RELATIVE_PATHS,
      testOnlyPathFallback: false,
    }
    try {
      assertPrivateStage(stage)
      return stage
    } catch (error) {
      closeDirectoryIdentity(stage)
      throw error
    }
  } catch (error) {
    closeDirectoryIdentity(parent)
    throw error
  }
}

export function assertPrivateStage(stage) {
  assertDirectoryIdentity(stage.parent, 'Staging parent')
  assertDirectoryIdentity(stage, 'Private stage')
  const current = fstatSync(stage.descriptor)
  if (dirname(stage.path) !== stage.parent.path ||
      basename(stage.path) !== stage.name ||
      (current.mode & 0o777) !== 0o700) {
    throw new Error('Private stage changed or is unsafe')
  }
}

export function privateStageChild(stage, name) {
  if (basename(name) !== name || name === '.' || name === '..') {
    throw new Error('Staging child name must be a basename')
  }
  assertPrivateStage(stage)
  return descriptorPath(stage, name)
}

export function closePrivateStage(stage) {
  if (!stage) return
  closeDirectoryIdentity(stage)
  closeDirectoryIdentity(stage.parent)
}

export function cleanupPrivateStage(stage) {
  try {
    assertPrivateStage(stage)
    const stageAccess = descriptorPath(stage, '.')
    const entries = readdirSync(stageAccess, { withFileTypes: true })
    assertPrivateStage(stage)
    for (const entry of entries) {
      if (entry.isDirectory()) {
        throw new Error(`Refusing to recursively remove unexpected staging directory: ${entry.name}`)
      }
      assertPrivateStage(stage)
      unlinkSync(descriptorPath(stage, entry.name))
      assertPrivateStage(stage)
    }
    assertPrivateStage(stage)
    const namedStage = lstatSync(descriptorPath(stage.parent, stage.name))
    if (!namedStage.isDirectory() ||
        namedStage.isSymbolicLink() ||
        !sameInode(namedStage, stage.inode)) {
      return false
    }
    rmdirSync(descriptorPath(stage.parent, stage.name))
    const current = existingEntry(descriptorPath(stage.parent, stage.name))
    if (current && sameInode(current, stage.inode)) {
      throw new Error('Private stage remained after cleanup')
    }
    fsyncSync(stage.parent.descriptor)
    return true
  } catch (error) {
    if (error.code === 'ENOENT') return false
    throw error
  } finally {
    closePrivateStage(stage)
  }
}

export function fsyncFile(path) {
  chmodSync(path, 0o600)
  const descriptor = openSync(path, constants.O_RDONLY | NO_FOLLOW)
  try {
    fsyncSync(descriptor)
  } finally {
    closeSync(descriptor)
  }
}

export function fsyncPrivateStageFile(stage, name) {
  const path = privateStageChild(stage, name)
  chmodSync(path, 0o600)
  assertPrivateStage(stage)
  const descriptor = openSync(path, constants.O_RDONLY | NO_FOLLOW)
  try {
    const opened = fstatSync(descriptor)
    const current = lstatSync(path)
    assertPrivateStage(stage)
    if (!opened.isFile() || current.isSymbolicLink() || !sameInode(opened, current)) {
      throw new Error('Private staged file changed while it was opened')
    }
    fsyncSync(descriptor)
    assertPrivateStage(stage)
  } finally {
    closeSync(descriptor)
  }
}

export function fsyncDirectory(path) {
  const descriptor = openSync(path, constants.O_RDONLY)
  try {
    fsyncSync(descriptor)
  } finally {
    closeSync(descriptor)
  }
}

export function publishNoReplace(stagedPath, destination) {
  const staged = lstatSync(stagedPath)
  if (!staged.isFile()) throw new Error('Staged publication is not a regular file')
  const requested = assertPathAbsent(destination)
  linkSync(stagedPath, requested)
  const published = lstatSync(requested)
  if (!sameInode(staged, published)) {
    throw new Error('Published file inode does not match staged file')
  }
  fsyncDirectory(dirname(requested))
  return { path: requested, inode: published }
}

export function publishPrivateStageNoReplace(stage, stagedName, destination, {
  afterLink = () => {},
  afterInodeValidation = () => {},
  fsyncParent = fsyncSync,
} = {}) {
  if (!stage.recoveryFilesystem?.descriptorRelative &&
      !stage.recoveryFilesystem?.testOnlyPathFallback) {
    throw new Error(
      'Secure publication requires Linux /proc/self/fd descriptor-relative child operations',
    )
  }
  const requested = resolve(destination)
  if (dirname(requested) !== stage.parent.path) {
    throw new Error('Publication destination is outside the verified staging parent')
  }
  assertPrivateStage(stage)
  const stagedPath = privateStageChild(stage, stagedName)
  const staged = lstatSync(stagedPath)
  assertPrivateStage(stage)
  if (!staged.isFile() || staged.isSymbolicLink()) {
    throw new Error('Staged publication is not a regular file')
  }
  if (existingEntry(descriptorPath(stage.parent, basename(requested)))) {
    throw new Error(`Output already exists: ${requested}`)
  }
  assertPrivateStage(stage)
  let publication
  try {
    linkSync(stagedPath, descriptorPath(stage.parent, basename(requested)))
    publication = { path: requested, inode: staged }
    afterLink({ publication, stagedName, destination: requested })
    const published = lstatSync(descriptorPath(stage.parent, basename(requested)))
    assertPrivateStage(stage)
    if (!sameInode(staged, published)) {
      throw new Error('Published file inode does not match staged file')
    }
    afterInodeValidation({ publication, stagedName, destination: requested })
    fsyncParent(stage.parent.descriptor)
    assertPrivateStage(stage)
    return publication
  } catch (error) {
    if (!publication) throw error
    try {
      unlinkIfSame(publication, {
        parentIdentity: stage.parent,
        recoveryFilesystem: stage.recoveryFilesystem,
      })
    } catch (cleanupError) {
      throw new AggregateError(
        [error, cleanupError],
        `Secure publication failed and rollback could not remove its exact inode: ${error.message}`,
        { cause: error },
      )
    }
    throw error
  }
}

export function unlinkIfSame(publication, {
  afterValidation = () => {},
  afterMove = () => {},
  parentIdentity,
  recoveryFilesystem,
} = {}) {
  if (parentIdentity) {
    if (dirname(resolve(publication.path)) !== parentIdentity.path) {
      throw new Error('Cleanup publication is outside the verified parent')
    }
    assertDirectoryIdentity(parentIdentity, 'Publication parent')
  }
  const quarantineParent = parentIdentity
    ? duplicateDirectoryIdentity(parentIdentity)
    : undefined
  const quarantine = createPrivateStage(publication.path, '.lantern-quarantine-', {
    parentIdentity: quarantineParent,
    recoveryFilesystem,
  })
  const quarantinedPath = join(quarantine.path, 'publication')
  const publicationPath = parentIdentity
    ? descriptorPath(parentIdentity, basename(publication.path))
    : publication.path
  const quarantinedAccessPath = privateStageChild(quarantine, 'publication')
  let keepQuarantine = false
  try {
    afterValidation()
    try {
      if (parentIdentity) assertDirectoryIdentity(parentIdentity, 'Publication parent')
      assertPrivateStage(quarantine)
      renameSync(publicationPath, quarantinedAccessPath)
      if (parentIdentity) assertDirectoryIdentity(parentIdentity, 'Publication parent')
      assertPrivateStage(quarantine)
    } catch (error) {
      if (error.code === 'ENOENT') return false
      throw error
    }
    const moved = lstatSync(quarantinedAccessPath)
    afterMove({ quarantinedPath, moved })
    if (sameInode(moved, publication.inode)) {
      assertPrivateStage(quarantine)
      unlinkSync(quarantinedAccessPath)
      if (parentIdentity) {
        assertDirectoryIdentity(parentIdentity, 'Publication parent')
        fsyncSync(parentIdentity.descriptor)
      } else {
        fsyncDirectory(dirname(publication.path))
      }
      return true
    }

    try {
      if (parentIdentity) assertDirectoryIdentity(parentIdentity, 'Publication parent')
      assertPrivateStage(quarantine)
      linkSync(quarantinedAccessPath, publicationPath)
      const restored = lstatSync(publicationPath)
      if (!sameInode(restored, moved)) {
        throw new Error('Restored replacement inode does not match quarantine')
      }
      unlinkSync(quarantinedAccessPath)
      if (parentIdentity) {
        fsyncSync(parentIdentity.descriptor)
        assertDirectoryIdentity(parentIdentity, 'Publication parent')
      } else {
        fsyncDirectory(dirname(publication.path))
      }
      throw new Error(`Cleanup refused to delete a replacement at ${publication.path}; it was restored`)
    } catch (error) {
      const quarantinedEntry = existingEntry(quarantinedAccessPath)
      if (error.code !== 'EEXIST' && !quarantinedEntry) throw error
      keepQuarantine = true
      const failure = new Error(
        `Cleanup preserved a raced replacement in quarantine: ${quarantinedPath}`,
      )
      failure.quarantinePath = quarantinedPath
      failure.cause = error
      throw failure
    }
  } finally {
    if (!keepQuarantine) cleanupPrivateStage(quarantine)
    else closePrivateStage(quarantine)
  }
}

export function stageVerifiedFile(sourcePath, stage, stagedName, {
  expectedSize,
  expectedSha256,
} = {}) {
  const requested = resolve(sourcePath)
  const stagedPath = privateStageChild(stage, basename(stagedName))
  let sourceDescriptor
  let targetDescriptor
  const hash = createHash('sha256')
  let bytes = 0
  try {
    const pathBefore = lstatSync(requested)
    if (!pathBefore.isFile() || pathBefore.isSymbolicLink()) {
      throw new Error('Source must be a regular non-symlink file')
    }
    sourceDescriptor = openSync(requested, constants.O_RDONLY | NO_FOLLOW)
    const descriptorBefore = fstatSync(sourceDescriptor)
    if (!descriptorBefore.isFile() || !sameInode(pathBefore, descriptorBefore)) {
      throw new Error('Source path changed while it was opened')
    }
    targetDescriptor = openSync(
      stagedPath,
      constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | NO_FOLLOW,
      0o600,
    )
    const buffer = Buffer.allocUnsafe(1024 * 1024)
    while (true) {
      const count = readSync(sourceDescriptor, buffer, 0, buffer.length, null)
      if (count === 0) break
      hash.update(buffer.subarray(0, count))
      let written = 0
      while (written < count) {
        written += writeSync(targetDescriptor, buffer, written, count - written)
      }
      bytes += count
    }
    fsyncSync(targetDescriptor)
    const descriptorAfter = fstatSync(sourceDescriptor)
    const pathAfter = lstatSync(requested)
    if (!sameInode(descriptorBefore, descriptorAfter) ||
        !sameInode(descriptorAfter, pathAfter) ||
        descriptorBefore.size !== descriptorAfter.size ||
        descriptorBefore.mtimeMs !== descriptorAfter.mtimeMs ||
        descriptorBefore.ctimeMs !== descriptorAfter.ctimeMs ||
        descriptorAfter.size !== pathAfter.size ||
        descriptorAfter.mtimeMs !== pathAfter.mtimeMs ||
        descriptorAfter.ctimeMs !== pathAfter.ctimeMs) {
      throw new Error('Source path changed while it was staged')
    }
    const sha256 = hash.digest('hex')
    if (expectedSize !== undefined && bytes !== expectedSize) {
      throw new Error(`Source size ${bytes} does not match ${expectedSize}`)
    }
    if (expectedSha256 !== undefined && sha256 !== expectedSha256) {
      throw new Error(`Source SHA-256 ${sha256} does not match ${expectedSha256}`)
    }
    return {
      requestedPath: requested,
      stagedPath,
      size: bytes,
      sha256,
      sourceInode: descriptorAfter,
    }
  } finally {
    if (targetDescriptor !== undefined) closeSync(targetDescriptor)
    if (sourceDescriptor !== undefined) closeSync(sourceDescriptor)
  }
}
