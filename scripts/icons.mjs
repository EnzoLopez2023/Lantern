import { createHash } from 'node:crypto'
import {
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { inflateSync } from 'node:zlib'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = join(ROOT, 'public')
const MASTER_PATH = join(PUBLIC, 'lantern-icon-1024.png')
const APPLE_TOUCH_PATH = join(PUBLIC, 'apple-touch-icon.png')
const FAVICON_PATH = join(PUBLIC, 'favicon.ico')
const MASTER_SHA256 = '91e58c529d5bb58c42d559961ed0285a7516ed00c756a5be557f2e1d47615847'
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
const FAVICON_SIZES = [16, 32, 48]

const CRC_TABLE = Array.from({ length: 256 }, (_, value) => {
  let crc = value
  for (let bit = 0; bit < 8; bit += 1) {
    crc = (crc & 1) === 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1
  }
  return crc >>> 0
})

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex')
}

function crc32(buffer) {
  let crc = 0xffffffff
  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type, 'ascii')
  const chunk = Buffer.alloc(12 + data.length)
  chunk.writeUInt32BE(data.length, 0)
  typeBuffer.copy(chunk, 4)
  data.copy(chunk, 8)
  chunk.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 8 + data.length)
  return chunk
}

function parsePng(buffer, label) {
  if (buffer.length < 33 || !buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error(`${label} is not a valid PNG`)
  }

  let offset = 8
  let header
  let hasTransparency = false
  let reachedEnd = false
  const imageData = []

  while (offset < buffer.length) {
    if (offset + 12 > buffer.length) throw new Error(`${label} has a truncated PNG chunk`)
    const length = buffer.readUInt32BE(offset)
    const chunkEnd = offset + 12 + length
    if (chunkEnd > buffer.length) throw new Error(`${label} has a truncated PNG chunk`)

    const typeBuffer = buffer.subarray(offset + 4, offset + 8)
    const type = typeBuffer.toString('ascii')
    const data = buffer.subarray(offset + 8, offset + 8 + length)
    const recordedCrc = buffer.readUInt32BE(offset + 8 + length)
    if (crc32(Buffer.concat([typeBuffer, data])) !== recordedCrc) {
      throw new Error(`${label} has an invalid ${type} checksum`)
    }

    if (type === 'IHDR') {
      if (header || length !== 13) throw new Error(`${label} has an invalid PNG header`)
      header = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        bitDepth: data[8],
        colorType: data[9],
        compression: data[10],
        filter: data[11],
        interlace: data[12],
      }
    } else if (type === 'IDAT') {
      imageData.push(data)
    } else if (type === 'tRNS') {
      hasTransparency = true
    } else if (type === 'IEND') {
      reachedEnd = true
      offset = chunkEnd
      break
    }

    offset = chunkEnd
  }

  if (!header || !reachedEnd || offset !== buffer.length || imageData.length === 0) {
    throw new Error(`${label} has an incomplete PNG structure`)
  }
  if (header.bitDepth !== 8 || ![2, 6].includes(header.colorType) ||
      header.compression !== 0 || header.filter !== 0 || header.interlace !== 0) {
    throw new Error(`${label} must be a non-interlaced 8-bit RGB or RGBA PNG`)
  }
  if (hasTransparency) throw new Error(`${label} must not contain transparency`)

  const channels = header.colorType === 2 ? 3 : 4
  const stride = header.width * channels
  const inflated = inflateSync(Buffer.concat(imageData))
  if (inflated.length !== header.height * (stride + 1)) {
    throw new Error(`${label} has an unexpected decoded size`)
  }

  const pixels = Buffer.alloc(header.width * header.height * 3)
  const previous = Buffer.alloc(stride)
  const current = Buffer.alloc(stride)
  let sourceOffset = 0
  let targetOffset = 0

  for (let y = 0; y < header.height; y += 1) {
    const filter = inflated[sourceOffset]
    sourceOffset += 1
    if (filter > 4) throw new Error(`${label} uses an invalid PNG filter`)

    for (let x = 0; x < stride; x += 1) {
      const raw = inflated[sourceOffset + x]
      const left = x >= channels ? current[x - channels] : 0
      const above = previous[x]
      const upperLeft = x >= channels ? previous[x - channels] : 0
      let predictor = 0

      if (filter === 1) predictor = left
      if (filter === 2) predictor = above
      if (filter === 3) predictor = Math.floor((left + above) / 2)
      if (filter === 4) predictor = paeth(left, above, upperLeft)
      current[x] = (raw + predictor) & 0xff
    }

    for (let x = 0; x < header.width; x += 1) {
      const pixelOffset = x * channels
      pixels[targetOffset] = current[pixelOffset]
      pixels[targetOffset + 1] = current[pixelOffset + 1]
      pixels[targetOffset + 2] = current[pixelOffset + 2]
      if (channels === 4 && current[pixelOffset + 3] !== 255) {
        throw new Error(`${label} must be fully opaque`)
      }
      targetOffset += 3
    }

    current.copy(previous)
    sourceOffset += stride
  }

  return { ...header, pixels }
}

function paeth(left, above, upperLeft) {
  const estimate = left + above - upperLeft
  const leftDistance = Math.abs(estimate - left)
  const aboveDistance = Math.abs(estimate - above)
  const upperLeftDistance = Math.abs(estimate - upperLeft)
  if (leftDistance <= aboveDistance && leftDistance <= upperLeftDistance) return left
  return aboveDistance <= upperLeftDistance ? above : upperLeft
}

function resizeSquare(source, size) {
  if (source.width !== source.height) throw new Error('Canonical icon must be square')
  const target = Buffer.alloc(size * size * 3)
  const denominator = source.width * source.height

  for (let targetY = 0; targetY < size; targetY += 1) {
    const top = targetY * source.height
    const bottom = (targetY + 1) * source.height
    const sourceYStart = Math.floor(top / size)
    const sourceYEnd = Math.ceil(bottom / size)

    for (let targetX = 0; targetX < size; targetX += 1) {
      const left = targetX * source.width
      const right = (targetX + 1) * source.width
      const sourceXStart = Math.floor(left / size)
      const sourceXEnd = Math.ceil(right / size)
      const totals = [0, 0, 0]

      for (let sourceY = sourceYStart; sourceY < sourceYEnd; sourceY += 1) {
        const yWeight = Math.min(bottom, (sourceY + 1) * size) -
          Math.max(top, sourceY * size)
        for (let sourceX = sourceXStart; sourceX < sourceXEnd; sourceX += 1) {
          const xWeight = Math.min(right, (sourceX + 1) * size) -
            Math.max(left, sourceX * size)
          const weight = xWeight * yWeight
          const sourceOffset = (sourceY * source.width + sourceX) * 3
          totals[0] += source.pixels[sourceOffset] * weight
          totals[1] += source.pixels[sourceOffset + 1] * weight
          totals[2] += source.pixels[sourceOffset + 2] * weight
        }
      }

      const targetOffset = (targetY * size + targetX) * 3
      target[targetOffset] = Math.floor((totals[0] + denominator / 2) / denominator)
      target[targetOffset + 1] = Math.floor((totals[1] + denominator / 2) / denominator)
      target[targetOffset + 2] = Math.floor((totals[2] + denominator / 2) / denominator)
    }
  }

  return target
}

function adler32(buffer) {
  let first = 1
  let second = 0
  for (const byte of buffer) {
    first = (first + byte) % 65521
    second = (second + first) % 65521
  }
  return ((second << 16) | first) >>> 0
}

function uncompressedZlib(buffer) {
  const blocks = []
  for (let offset = 0; offset < buffer.length; offset += 65535) {
    const data = buffer.subarray(offset, Math.min(offset + 65535, buffer.length))
    const header = Buffer.alloc(5)
    header[0] = offset + data.length === buffer.length ? 1 : 0
    header.writeUInt16LE(data.length, 1)
    header.writeUInt16LE((~data.length) & 0xffff, 3)
    blocks.push(header, data)
  }

  const checksum = Buffer.alloc(4)
  checksum.writeUInt32BE(adler32(buffer))
  return Buffer.concat([Buffer.from([0x78, 0x01]), ...blocks, checksum])
}

function encodePng(pixels, size) {
  const header = Buffer.alloc(13)
  header.writeUInt32BE(size, 0)
  header.writeUInt32BE(size, 4)
  header[8] = 8
  header[9] = 2

  const scanlines = Buffer.alloc(size * (size * 3 + 1))
  for (let row = 0; row < size; row += 1) {
    const scanlineOffset = row * (size * 3 + 1)
    pixels.copy(scanlines, scanlineOffset + 1, row * size * 3, (row + 1) * size * 3)
  }

  return Buffer.concat([
    PNG_SIGNATURE,
    pngChunk('IHDR', header),
    pngChunk('IDAT', uncompressedZlib(scanlines)),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

function encodeIco(frames) {
  const directory = Buffer.alloc(6 + frames.length * 16)
  directory.writeUInt16LE(0, 0)
  directory.writeUInt16LE(1, 2)
  directory.writeUInt16LE(frames.length, 4)
  let dataOffset = directory.length

  frames.forEach(({ size, png }, index) => {
    const offset = 6 + index * 16
    directory[offset] = size === 256 ? 0 : size
    directory[offset + 1] = size === 256 ? 0 : size
    directory.writeUInt16LE(1, offset + 4)
    directory.writeUInt16LE(24, offset + 6)
    directory.writeUInt32LE(png.length, offset + 8)
    directory.writeUInt32LE(dataOffset, offset + 12)
    dataOffset += png.length
  })

  return Buffer.concat([directory, ...frames.map(({ png }) => png)])
}

function buildDerivatives(master) {
  const appleTouch = encodePng(resizeSquare(master, 180), 180)
  const faviconFrames = FAVICON_SIZES.map((size) => ({
    size,
    png: encodePng(resizeSquare(master, size), size),
  }))
  return {
    appleTouch,
    favicon: encodeIco(faviconFrames),
  }
}

function htmlFiles(directory) {
  const files = []
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (['.git', 'coverage', 'dist', 'node_modules'].includes(entry.name)) continue
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...htmlFiles(path))
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(path)
  }
  return files
}

function tagAttributes(tag) {
  const attributes = {}
  const pattern = /([^\s=<>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g
  for (const match of tag.matchAll(pattern)) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4]
  }
  return attributes
}

function checkReferences() {
  const activeLinks = []
  for (const path of htmlFiles(ROOT)) {
    const html = readFileSync(path, 'utf8')
    for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
      const attributes = tagAttributes(match[0])
      const relationships = (attributes.rel ?? '').toLowerCase().split(/\s+/)
      if (relationships.includes('manifest')) {
        throw new Error(`Alternate icon manifest is active in ${relative(ROOT, path)}`)
      }
      if (relationships.includes('icon') || relationships.some((value) => value.endsWith('-icon'))) {
        activeLinks.push({ path: relative(ROOT, path), ...attributes })
      }
    }
  }

  const expected = [
    {
      path: 'index.html',
      rel: 'icon',
      href: '/favicon.ico',
      sizes: '16x16 32x32 48x48',
    },
    {
      path: 'index.html',
      rel: 'icon',
      type: 'image/png',
      href: '/lantern-icon-1024.png',
      sizes: '1024x1024',
    },
    {
      path: 'index.html',
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
  ]

  if (JSON.stringify(activeLinks) !== JSON.stringify(expected)) {
    throw new Error('Active icon references must match the canonical Lantern icon set')
  }
}

function assertExact(path, expected, label) {
  const actual = readFileSync(path)
  if (!actual.equals(expected)) {
    throw new Error(`${label} has drifted; run npm run icons`)
  }
}

function loadMaster() {
  const buffer = readFileSync(MASTER_PATH)
  const digest = sha256(buffer)
  if (digest !== MASTER_SHA256) {
    throw new Error(`Canonical icon checksum mismatch: expected ${MASTER_SHA256}, received ${digest}`)
  }
  const image = parsePng(buffer, 'Canonical icon')
  if (image.width !== 1024 || image.height !== 1024) {
    throw new Error('Canonical icon must be exactly 1024x1024')
  }
  return image
}

function main() {
  const args = process.argv.slice(2)
  if (args.some((arg) => arg !== '--check') || args.length > 1) {
    throw new Error('Usage: node scripts/icons.mjs [--check]')
  }

  const checking = args[0] === '--check'
  const master = loadMaster()
  const derivatives = buildDerivatives(master)

  if (checking) {
    assertExact(APPLE_TOUCH_PATH, derivatives.appleTouch, 'Apple touch icon')
    assertExact(FAVICON_PATH, derivatives.favicon, 'Favicon')
    checkReferences()
    console.log(`Icon assets verified from canonical SHA-256 ${MASTER_SHA256}`)
    return
  }

  writeFileSync(APPLE_TOUCH_PATH, derivatives.appleTouch)
  writeFileSync(FAVICON_PATH, derivatives.favicon)
  console.log(`Generated ${relative(ROOT, APPLE_TOUCH_PATH)} (${sha256(derivatives.appleTouch)})`)
  console.log(`Generated ${relative(ROOT, FAVICON_PATH)} (${sha256(derivatives.favicon)})`)
}

main()
