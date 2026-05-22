const fs = require('fs')
const path = require('path')

function readFileSyncSafe(file) {
  try { return fs.readFileSync(file, 'utf8') } catch (e) { return '' }
}

function walk(dir) {
  const res = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) res.push(...walk(p))
    else if (/\.(js|jsx|ts|tsx)$/.test(e.name)) res.push(p)
  }
  return res
}

function extractKeysFromCode(root) {
  const files = walk(root)
  const keySet = new Set()
  const keyRegex = /(?:\b|\W)(?:t|i18n\.t)\(['\"]([^'\"]+)['\"]\)/g
  for (const f of files) {
    const content = readFileSyncSafe(f)
    let m
    while ((m = keyRegex.exec(content))) {
      keySet.add(m[1])
    }
  }
  return [...keySet].sort()
}

function flatten(obj, prefix = '') {
  const res = {}
  for (const k of Object.keys(obj)) {
    const v = obj[k]
    const p = prefix ? prefix + '.' + k : k
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(res, flatten(v, p))
    } else {
      res[p] = v
    }
  }
  return res
}

function main() {
  const frontendSrc = path.join(__dirname, '..', 'frontend', 'src')
  if (!fs.existsSync(frontendSrc)) {
    console.error('frontend/src not found')
    process.exit(1)
  }

  const keys = extractKeysFromCode(frontendSrc)
  const localesPath = path.join(__dirname, '..', 'frontend', 'src', 'i18n', 'locales')
  const locales = {}
  for (const locale of ['en', 'es']) {
    const file = path.join(localesPath, locale, 'common.json')
    const data = JSON.parse(readFileSyncSafe(file) || '{}')
    locales[locale] = flatten(data)
  }

  const missing = { en: [], es: [] }
  for (const key of keys) {
    // we only care about settings.* and common top-level keys
    if (!locales.en[key]) missing.en.push(key)
    if (!locales.es[key]) missing.es.push(key)
  }

  console.log('Total keys used in code:', keys.length)
  console.log('\nMissing in en:', missing.en.length)
  console.log(missing.en.join('\n'))
  console.log('\nMissing in es:', missing.es.length)
  console.log(missing.es.join('\n'))
}

main()
