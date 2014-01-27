'use strict';

var trim = require('trim')

var br = /<br ?\/?>/g
var pNbspEmpty = /^(?:<p>(?:\s|&nbsp;)<\/p>)+$/

function normaliseContentEditableHTML(html) {
  // Trimming removes a trailing linebreak caused by the extra <br> Firefox
  // generates in contentEditable innerHTML.
  return trim(
    html
      // Convert <br> to linebreaks
      .replace(br, '\n')
      // Should be empty if IE has a string of <p>s with only whitespace or NBSP
      .replace(pNbspEmpty, '')
  )
}

module.exports = normaliseContentEditableHTML