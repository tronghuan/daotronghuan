/**
 * Encrypt protected blog posts using staticrypt.
 * Run after `npm run build`. Finds posts with `protected: true` in frontmatter
 * inside cuoc-song/ and encrypts their built HTML with the PROTECTED_PASSWORD env var.
 */
import { readFileSync, readdirSync, existsSync } from 'fs'
import { join, basename, dirname } from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

// Load .env nếu tồn tại (local dev), còn CI thì env var đã được set sẵn
const envFile = join(ROOT, '.env')
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) process.env[match[1].trim()] = match[2].trim()
  }
}

const SRC_DIR = join(ROOT, 'cuoc-song')
const BUILD_DIR = join(ROOT, 'build', 'cuoc-song')
const PASSWORD = process.env.PROTECTED_PASSWORD

if (!PASSWORD) {
  console.error('Error: PROTECTED_PASSWORD environment variable is not set.')
  console.error('Create a .env file with PROTECTED_PASSWORD=your_password and try again.')
  process.exit(1)
}

function isProtected(content) {
  const match = content.match(/^---[\r\n]([\s\S]*?)[\r\n]---/)
  return match ? /^protected:\s*true\s*$/m.test(match[1]) : false
}

function getSlug(content, filename) {
  const match = content.match(/^---[\r\n]([\s\S]*?)[\r\n]---/)
  if (match) {
    const slugLine = match[1].match(/^slug:\s*(.+)$/m)
    if (slugLine) return slugLine[1].trim()
  }
  return filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.mdx?$/, '')
}

function collectMdFiles(dir) {
  const files = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const idx = join(dir, entry.name, 'index.md')
      if (existsSync(idx)) files.push(idx)
      const idxMdx = join(dir, entry.name, 'index.mdx')
      if (existsSync(idxMdx)) files.push(idxMdx)
    } else if (/\.mdx?$/.test(entry.name) && entry.name !== 'authors.yml' && entry.name !== 'tags.yml') {
      files.push(join(dir, entry.name))
    }
  }
  return files
}

const mdFiles = collectMdFiles(SRC_DIR)
let encrypted = 0
let skipped = 0

for (const filePath of mdFiles) {
  const content = readFileSync(filePath, 'utf8')
  if (!isProtected(content)) { skipped++; continue }

  const slug = getSlug(content, basename(filePath))
  const htmlPath = join(BUILD_DIR, slug, 'index.html')
  const outDir = join(BUILD_DIR, slug)

  if (!existsSync(htmlPath)) {
    console.warn(`Warning: built file not found for slug "${slug}" — skipping`)
    continue
  }

  console.log(`Encrypting /cuoc-song/${slug}/`)
  // --short skips the interactive password-length prompt; use a 14+ char password in production
  execSync(
    `npx staticrypt "${htmlPath}" --password "${PASSWORD}" --directory "${outDir}" --short`,
    { stdio: 'inherit', cwd: ROOT }
  )
  encrypted++
}

console.log(`\nDone. Encrypted: ${encrypted}, skipped (not protected): ${skipped}`)
