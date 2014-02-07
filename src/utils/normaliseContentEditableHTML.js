'use strict';

var openBreaks = /<p[^>]*>|<div[^>]*>/g
var breaks = /<br[^>]*>|<\/p>|<\/div>/g
var allTags = /<\/?[^>]+>\s*/g
var newlines = /\n/g

// Leading and trailing whitespace, <br>s, &nbsp;s
var trimWhitespace = /^(?:\s|&nbsp;|<br[^>]*>)*|(?:\s|&nbsp;|<br[^>]*>)*$/g

/**
 * Normalises contentEditable innerHTML, stripping all tags except <br> and trim
 * leading and trailing whitespace and elements which cause whitespace.
 * The resulting normalisd HTML uses <br> for line breaks.
 */
function normaliseContentEditableHTML(html) {
  html = html.replace(openBreaks, '')
             .replace(breaks, '\n')
             .replace(allTags, '')
             .replace(newlines, '<br>')
             .replace(trimWhitespace, '')

  return html
}

module.exports = normaliseContentEditableHTML