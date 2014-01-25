/** @jsx React.DOM */

'use strict';

var TodoItem = require('TodoItem')

var Project = React.createClass({
  onToggleTodo: function(todo) {
    this.props.onToggleTodo(this.props.project, todo)
  }

, onDoTodo: function(todo) {
    this.props.onDoTodo(this.props.project, todo)
  }

, render: function() {
    var doing, todos = [], dones = []
    this.props.project.todos.forEach(function(todo) {
      var currentlyDoing = (this.props.project.doing === todo.id)
      var todoItem = <TodoItem
                       todo={todo}
                       doing={currentlyDoing}
                       onToggle={this.onToggleTodo}
                       onDo={this.onDoTodo}
                     />
      if (currentlyDoing) {
        doing = todoItem
      }
      else {
        ;(todo.done ? dones : todos).push(todoItem)
      }
    }.bind(this))

    return <div className="project">
      <h2 className="category-label">[DOING]</h2>
      {doing}
      <h2 className="category-label">[TODO]</h2>
      {todos}
      <h2 className="category-label">[DONE]</h2>
      {dones}
    </div>
  }
})

module.exports = Project