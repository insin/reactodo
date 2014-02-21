'use strict';

var Base64 = require('Base64')

function exportTextFile(text, filename) {
  var a = document.createElement('a')
  if ('download' in a) {
    a.href = 'data:text/plain;base64,' + Base64.encode(text)
    a.download = filename
    var event = document.createEvent('MouseEvents')
    event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0,
                         false, false, false, false, 0, null)
    a.dispatchEvent(event)
  }
  else {
    if (typeof window.isIE9 !== 'undefined') {
      // TODO IE9 only supports data URIs for <img> - do something else for it
      return alert('Not supported in this browser yet :-/')
    }
    window.location.href =
      'data:application/octet-stream;base64,' + Base64.encode(text)
  }
}

module.exports = exportTextFile