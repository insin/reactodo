/** @jsx React.DOM */

'use strict';

var TodoItem = require('TodoItem')

var Project = React.createClass({
  getInitialState: function() {
    return {
      dragoverTodoId: null
    }
  }

, addTodo: function() {
    this.props.onAddTodo(this.props.project)
  }

, deleteDoneTodos: function() {
    if (confirm('Are you sure you want to delete all completed TODOs in ' + this.props.project.name + '?')) {
      this.props.onDeleteDoneTodos(this.props.project)
    }
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

, onDeleteTodo: function(todo) {
    this.props.onDeleteTodo(this.props.project, todo)
  }

, onDragOverTodo: function(todo) {
    if (this.state.dragoverTodoId != todo.id) {
      this.setState({dragoverTodoId: todo.id})
    }
  }

, onDragEndTodo: function() {
    this.setState({dragoverTodoId: null})
  }

, onMoveTodo: function(fromIndex, toIndex) {
    this.props.onMoveTodo(this.props.project, fromIndex, toIndex)
  }

, render: function() {
    var doing, todos = [], dones = []
    this.props.project.todos.forEach(function(todo, index) {
      var currentlyDoing = (this.props.project.doing === todo.id)
      var todoItem = <TodoItem
                       key={todo.id}
                       todo={todo}
                       index={index}
                       dragover={this.state.dragoverTodoId === todo.id}
                       initialEdit={this.props.editTodoId === todo.id}
                       doing={currentlyDoing}
                       onEdit={this.onEditTodo}
                       onToggle={this.onToggleTodo}
                       onDo={this.onDoTodo}
                       onDelete={this.onDeleteTodo}
                       onDragOver={this.onDragOverTodo}
                       onDragEnd={this.onDragEndTodo}
                       onMoveTodo={this.onMoveTodo}
                     />
      if (currentlyDoing) {
        doing = todoItem
      }
      else {
        ;(todo.done ? dones : todos).push(todoItem)
      }
    }.bind(this))

    var deleteDone
    if (dones.length > 0) {
      deleteDone = <span className="control" title="Delete all completed TODOs" onClick={this.deleteDoneTodos}>-</span>
    }

    return <div className="project">
      <h2>[DOING]</h2>
      {doing}
      <h2>[TODO] <span className="control" title="Add TODO" onClick={this.addTodo}>+</span></h2>
      {todos}
      <h2>[DONE] {deleteDone}</h2>
      {dones}
    </div>
  }
})

module.exports = Project