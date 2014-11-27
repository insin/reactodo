'use strict';

var slice = Array.prototype.slice

function partial(fn) {
  var args = slice.call(arguments, 1)
  return function() {
    return fn.apply(this, args.concat(slice.call(arguments)))
  }
}

module.exports = partial