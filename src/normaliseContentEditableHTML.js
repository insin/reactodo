'use strict';

var trim = require('trim')

var brs = /<br ?\/?>/g
var ieSpans = /<\/?span[^>]*>/g
var ieEmptyParas = /^(?:<p>(?:\s|&nbsp;)<\/p>)+$/

function normaliseContentEditableHTML(html) {
  // Convert <br> to linebreaks
  html = html.replace(brs, '\n')

  if (typeof window.isIE9 != 'undefined') {
    html = html
      // Strip out spans which hold styling carried over from copy & pasting
      .replace(ieSpans, '')
      // Result should be empty if IE has a string of <p>s with only whitespace
      // or NBSP as their content.
      .replace(ieEmptyParas, '')
  }

  // Trimming removes a trailing linebreak caused by the extra <br> Firefox
  // generates at the end.
  return trim(html)
}

module.exports = normaliseContentEditableHTML