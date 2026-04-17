import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const prismaCli = resolve(root, 'node_modules/prisma/build/index.js')

const argv = process.argv.slice(2)
if (argv.length === 0) {
  console.error('usage: node scripts/run-prisma.mjs <prisma args…>')
  process.exit(1)
}

const joined = argv.join(' ').toLowerCase()
const needsRealDirectUrl =
  joined.includes('migrate') ||
  joined.includes('db push') ||
  joined.includes('db pull') ||
  joined.startsWith('studio') ||
  joined.includes(' studio')

if (!process.env.DIRECT_URL?.trim() && process.env.DATABASE_URL?.trim()) {
  if (!needsRealDirectUrl) {
    process.env.DIRECT_URL = process.env.DATABASE_URL
  }
}

const r = spawnSync(process.execPath, [prismaCli, ...argv], {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
})

process.exit(r.status ?? 1)
