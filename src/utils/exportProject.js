'use strict';

var Constants = require('Constants')

function exportProject(project) {
  var doing = ['[DOING]'], todos = ['[TODO]'], dones = ['[DONE]']
  project.todos.forEach(function(todo) {
    var exportedTODO = exportTODO(todo)
    if (project.doing === todo.id) {
      doing.push(exportedTODO)
    }
    else if (todo.done) {
      dones.push(exportedTODO)
    }
    else {
      todos.push(exportedTODO)
    }
  })
  return doing.concat(todos).concat(dones).join('\n\n')
}

var openP = /<p>/g
var spaces = /&nbsp;/g
var breaks = /<br[^>]*>|<\/p>/g
var newlines = /\n/g
var allTags = /<\/?[^>]+>\s*/g
var lt = /&lt;/g
var gt = /&gt;/g
var amp = /&amp;/g

function exportTODO(todo) {
  var checkbox = '[' + (todo.done ? Constants.CHECK : ' ') + '] '
  var text = todo.text.replace(openP, '')
                      .replace(spaces, ' ')
                      .replace(breaks, '\n')
                      .replace(newlines, '\n    ')
                      .replace(allTags, '')
                      .replace(lt, '<')
                      .replace(gt, '>')
                      .replace(amp, '&')
  return checkbox + text
}

module.exports = exportProject