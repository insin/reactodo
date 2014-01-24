/** @jsx React.DOM */

'use strict';

var TodoItem = require('TodoItem')

var Project = React.createClass({
  render: function() {
    var doing, todos = [], dones = []
    this.props.project.todos.forEach(function(todo) {
      var todoItem = <TodoItem todo={todo}/>
      if (this.props.project.doing === todo.id) {
        doing = todoItem
      }
      else {
        ;(todo.done ? dones : todos).push(todoItem)
      }
    }.bind(this))

    return <div className="project">
      <h2>[DOING]</h2>
      {doing}
      <h2>[TODO]</h2>
      {todos}
      <h2>[DONE]</h2>
      {dones}
    </div>
  }
})

module.exports = Project