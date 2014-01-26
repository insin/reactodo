/** @jsx React.DOM */

'use strict';

var Constants = require('Constants')
var TodoItem = require('TodoItem')

var $c = require('classNames')

var Project = React.createClass({
  getInitialState: function() {
    return {
      dragoverTodoId: null
    , dragoverDoing: false
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

, handleDragOverDoing: function(e) {
    e.preventDefault()
    e.nativeEvent.dataTransfer.dropEffect = 'move'
    if (!this.state.dragoverDoing) {
      this.setState({
        dragoverTodoId: null
      , dragoverDoing: true
      })
    }
  }

, cancelDragOverDoing: function(e) {
    if (this.state.dragoverDoing) {
      this.setState({dragoverDoing: false})
    }
  }

, handleDropDoing: function(e) {
    var index = e.nativeEvent.dataTransfer.getData('index')
    if (this.state.dragoverDoing) {
      this.setState({
        dragoverTodoId: null
      , dragoverDoing: false
      })
    }
    this.props.onDoTodo(this.props.project, this.props.project.todos[index])
  }

, onToggleTodo: function(todo) {
    this.props.onToggleTodo(this.props.project, todo)
  }

, onDoTodo: function(todo) {
    this.props.onDoTodo(this.props.project, todo)
  }

, stopDoingTodo: function() {
    this.props.onStopDoingTodo(this.props.project)
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

, onCancelDragOverTodo: function() {
    this.setState({dragoverTodoId: null})
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
                       onCancelDragOver={this.onCancelDragOverTodo}
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

    var doneHeading
    if (dones.length > 0) {
      doneHeading = <h2>[DONE] <span className="control" title="Delete all completed TODOs" onClick={this.deleteDoneTodos}>-</span></h2>
    }

    var stopDoing
    if (doing) {
      stopDoing = <span className="control" title="Stop doing this" onClick={this.stopDoingTodo}>{Constants.STOP}</span>
    }

    return <div className="project">
      <h2>[DOING] {stopDoing}</h2>
      <div
        className={$c('dropzone doing-dropzone', {empty: this.props.project.doing === null, dragover: this.state.dragoverDoing})}
        onDragOver={this.handleDragOverDoing}
        onDrop={this.handleDropDoing}
        onDragLeave={this.cancelDragOverDoing}
      >
        {doing || "Drop a TODO here when it's in progress"}
      </div>
      <h2>[TODO] <span className="control" title="Add TODO" onClick={this.addTodo}>+</span></h2>
      {todos}
      {doneHeading}
      {dones}
    </div>
  }
})

module.exports = Project