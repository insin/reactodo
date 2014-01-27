/** @jsx React.DOM */

'use strict';

var Constants = require('Constants')

var $c = require('classNames')
var trim = require('trim')

var TodoItem = React.createClass({
  getInitialState: function() {
    return {
      dragging: false
    , editing: this.props.initialEdit || false
    }
  }

, componentDidMount: function() {
    if (this.props.initialEdit) {
      this.refs.text.getDOMNode().focus()
    }
  }

, componentDidUpdate: function (prevProps, prevState) {
    if (this.state.editing && !prevState.editing) {
      this.refs.text.getDOMNode().focus()
    }
  }

, handleTextClick: function() {
    if (!this.state.editing) {
      this.setState({editing: true})
    }
  }

, handleTextBlur: function() {
    if (this.state.editing) {
      // Trimming removes a trailing linebreak caused by the extra <br> Firefox
      // generates in contentEditable innerHTML.
      var newText = trim(this.refs.text.getDOMNode().innerHTML.replace(/<br ?\/?>/g, '\n'))
      this.setState({editing: false})
      if (!newText) {
        this.props.onDelete(this.props.todo)
      }
      else {
        this.props.onEdit(this.props.todo, newText)
      }
    }
  }

, handleDragStart: function(e) {
    e.nativeEvent.dataTransfer.setData('index', this.props.index)
    this.setState({dragging: true})
  }

, handleDragEnd: function(e) {
    this.setState({dragging: false})
    this.props.onDragEnd()
  }

, handleDragOver: function(e) {
    e.preventDefault()
    e.nativeEvent.dataTransfer.dropEffect = 'move'
    this.props.onDragOver(this.props.todo)
  }

, handleDrop: function(e) {
    e.preventDefault()
    var fromIndex = e.nativeEvent.dataTransfer.getData('index')
    this.props.onMoveTodo(fromIndex, this.props.index)
  }

, render: function() {
    var todoItemClassName = $c('todo-item', {
      'is-todo': !this.props.todo.done
    , 'is-done': this.props.todo.done
    , 'is-doing': this.props.doing
    , 'dropzone': !this.props.doing
    , 'dragging': this.state.dragging
    , 'dragover': this.props.dragover
    })

    var dragHandle
    if (!this.props.doing) {
      dragHandle = <div className="todo-item-handle">
        <span
          className="handle"
          draggable="true"
          onDragStart={this.handleDragStart}
          onDragEnd={this.handleDragEnd}
        >{Constants.DRAG_HANDLE}</span>
      </div>
    }

    // onDrop is handled by the [DOING] dropZone if that's where this TODO is
    // being displayed.
    return <div
             className={todoItemClassName}
             onDragOver={this.handleDragOver}
             onDragLeave={!this.props.doing && this.props.onCancelDragOver}
             onDrop={!this.props.doing && this.handleDrop}
           >
      <div className="todo-item-toolbar">
        <span className="control" onClick={this.props.onToggle.bind(null, this.props.todo)}>[{this.props.todo.done ? Constants.CHECK : Constants.NBSP}]</span>
      </div>
      <div
        className="todo-item-text"
        ref="text"
        onClick={this.handleTextClick}
        onBlur={this.handleTextBlur}
        contentEditable={this.state.editing}
        dangerouslySetInnerHTML={{__html: this.props.todo.text || ' '}}
      />
      {dragHandle}
    </div>
  }
})

module.exports = TodoItem