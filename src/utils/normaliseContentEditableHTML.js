'use strict';

// Leading and trailing whitespace, <br>s, &nbsp;s and empty <p>s
var trimWhitespace = /^(?:\s|&nbsp;|<br>|<p>(?:\s|&nbsp;|<br>)*<\/p>)*|(?:\s|&nbsp;|<br>|<p>(?:\s|&nbsp;|<br>)*<\/p>)*$/g

// Opening and closing <span>s
var spans = /<\/?span[^>]*>/g

// Leading and trailing whitespace within first and last non-empty <p>
var ieLeadingWS = /^(?:<p>(?:\s|&nbsp;|<br>)*<\/p>)*<p>(?:\s|&nbsp;|<br>)+/
var ieTrailingWS = /(?:\s|&nbsp;|<br>)+<\/p>(?:<p>(?:\s|&nbsp;|<br>)*<\/p>)*$/

/**
 * Normalises contentEditable innerHTML to a degree and trims leading and
 * trailing whitespace. We retain <br>s and <p>s inserted when editing a
 * contentEditable for line-breaking in order to avoid using whitespace: pre, so
 * long lines will wrap.
 */
function normaliseContentEditableHTML(html) {
  // Remove spans carrying any copy & pasted style
  html = html.replace(spans, '')

  // Length pre-trimming of anything which causes whitespace
  var originalLength = html.length

  if (typeof window.isIE9 != 'undefined') {
    html = html
      .replace(ieLeadingWS, '<p>')
      .replace(ieTrailingWS, '</p>')
  }

  // Trimming also removes a trailing <br> Firefox always generates at the end
  html = html.replace(trimWhitespace, '')

  return {
    text: html
  , isTrimmed: originalLength !== html.length
  }
}

module.exports = normaliseContentEditableHTML