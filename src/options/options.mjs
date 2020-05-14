const input = document.getElementById('blacklist')
const saveBtn = document.getElementById('save-btn')
// Taken from https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch08s15.html
const domainRegex = /^(\*\.)?((?:(?=[a-z0-9-]{1,63}\.)(?:xn--)?[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,63})$/i

function parse(raw) {
  const lines = raw.split(/[\r\n]+/)
  const parsed = lines.map(line => {
    line = line.trim()
    // Skip comment lines
    if (line[0] === '#') return null
    // Regex matches (*.)example.com
    const match = line.match(domainRegex)
    // Doesn't match domain format
    if (!match) return null
    // Validate/normalize domain
    const domain = new URL(`https://${match[2]}`).hostname
    return {
      domain,
      subdomains: match[1] === '*.'
    }
  })
  // Remove invalid values
  return parsed.filter(v => v)
}

saveBtn.addEventListener('click', function save() {
  const blacklist = input.value
  browser.storage.local.set({
    blacklistRaw: blacklist,
    blacklistParsed: parse(blacklist)
  })
})

browser.storage.local.get({ blacklistRaw: '' }).then(function load({ blacklistRaw }) {
  input.value = blacklistRaw
})
