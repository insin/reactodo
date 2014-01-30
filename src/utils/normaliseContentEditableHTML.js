'use strict';

// Leading and trailing whitespace, <br>s, &nbsp;s and empty <p>s
var trimWhitespace = /^(?:\s|&nbsp;|<br>|<p>(?:\s|&nbsp;|<br>)*<\/p>)*|(?:\s|&nbsp;|<br>|<p>(?:\s|&nbsp;|<br>)*<\/p>)*$/g

// Opening and closing <span>s
var spans = /<\/?span[^>]*>/g

// Leading and trailing <br> withing first and last <p>
var ieLeadingBrs = /^<p>(?:<br>)+/
var ieTrailingBrs = /(?:<br>)+<\/p>$/

/**
 * Normalises contentEditable innerHTML to a degree, cross-browser. We retain
 * <br>s and <p>s inserted when editing a contentEditable for line-breaking in
 * order to avoid using whitespace: pre so that long lines will wrap.
 */
function normaliseContentEditableHTML(html) {
  // Remove spans carrying any copy & pasted style
  html = html.replace(spans, '')

  if (typeof window.isIE9 != 'undefined') {
    html = html
      // Leading <br>s within first <p>
      .replace(ieLeadingBrs, '<p>')
      // Trailing <br>s within last <p>
      .replace(ieTrailingBrs, '</p>')
  }

  // Trimming also removes a trailing <br> Firefox always generates at the end
  html = html.replace(trimWhitespace, '')

  return html
}

module.exports = normaliseContentEditableHTML