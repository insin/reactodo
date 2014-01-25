/** @jsx React.DOM */

'use strict';

var TodoItem = require('TodoItem')

var Project = React.createClass({
  handleAddTodo: function() {
    this.props.onAddTodo(this.props.project)
  }

, onToggleTodo: function(todo) {
    this.props.onToggleTodo(this.props.project, todo)
  }

, onDoTodo: function(todo) {
    this.props.onDoTodo(this.props.project, todo)
  }

, onEditTodo: function(todo, newText) {
    this.props.onEditTodo(this.props.project, todo, newText)
  }

, render: function() {
    var doing, todos = [], dones = []
    this.props.project.todos.forEach(function(todo) {
      var currentlyDoing = (this.props.project.doing === todo.id)
      var todoItem = <TodoItem
                       key={todo.id}
                       todo={todo}
                       initialEdit={this.props.editTodoId === todo.id}
                       doing={currentlyDoing}
                       onEdit={this.onEditTodo}
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
      <h2 className="category-label">[TODO] <span className="control" title="Add TODO" onClick={this.handleAddTodo}>+</span></h2>
      {todos}
      <h2 className="category-label">[DONE]</h2>
      {dones}
    </div>
  }
})

module.exports = Project