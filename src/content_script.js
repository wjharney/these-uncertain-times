import phrases from './phrases.json'
const theseTimes = /\b(in|during) these(?: (very))?(?: ([a-z-]*?))? times\b/gi
// Avoid scripts/styles to avoid messing up the page
const skipElements = new Set(['SCRIPT', 'STYLE'])
const filter = {
  acceptNode(node) {
    const parent = node.parentNode && node.parentNode.nodeName
    return skipElements.has(parent) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
  }
}

/**
 * Chooses a random phrase from the phrase list and ensures it matches the case of the source string
 * @param str The source string to match case against
 * @return A random phrase
 */
function getRandomPhrase(str) {
  const phrase = phrases[Math.floor(Math.random() * phrases.length)]
  // Modify phrase case to match source case
  const start = str[0] === 'i' || str[0] === 'd' ? phrase[0].toLowerCase() : phrase[0].toUpperCase()
  return start + phrase.slice(1)
}

/**
 * Replaces occurrences of "in these times" and similar strings with random phrases
 * @param str The string to modify
 * @returns The modified string
 */
function replaceText(str) {
  return str.replace(theseTimes, getRandomPhrase)
}

/**
 * Updates the text of a given node and all its children
 * @param root The root node to modify
 */
function updateNode(root) {
  const ni = document.createNodeIterator(root, NodeFilter.SHOW_TEXT, filter)
  let node
  while ((node = ni.nextNode())) {
    const original = node.nodeValue
    const replaced = replaceText(original)
    if (replaced !== original) {
      node.nodeValue = replaced
    }
  }
}

/**
 * Updates the text of new or modified nodes
 * @param {MutationRecord} mutations The mutations to parse for new or modified nodes
 */
function updateMutations(mutations) {
  for (const mut of mutations) {
    for (const node of mut.addedNodes) {
      updateNode(node)
    }
  }
}

// Update page title
document.title = replaceText(document.title)
// Update page text
updateNode(document.body)
// Watch page for changes to text
const obs = new MutationObserver(updateMutations)
obs.observe(document.body, {
  childList: true,
  subtree: true
})
