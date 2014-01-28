/** @jsx React.DOM */

'use strict';

var Constants = require('Constants')

var $c = require('classNames')
var normaliseContentEditableHTML = require('normaliseContentEditableHTML')

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
      var newText = normaliseContentEditableHTML(this.refs.text.getDOMNode().innerHTML)
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
    e.nativeEvent.dataTransfer.setData('text', '' + this.props.index)
    this.setState({dragging: true})
  }

, handleDragEnd: function(e) {
    this.setState({dragging: false})
    this.props.onDragEnd()
  }

  /** Indicates that this TODO is a drop target. */
, handleDragEnter: function(e) {
    e.preventDefault()
  }

  /** Sets the drop effect for this TODO. */
, handleDragOver: function(e) {
    e.preventDefault()
    e.nativeEvent.dataTransfer.dropEffect = 'move'
    this.props.onDragOver(this.props.todo)
  }

  /** Handles another TODO being dropped on this one. */
, handleDrop: function(e) {
    e.preventDefault()
    var fromIndex = e.nativeEvent.dataTransfer.getData('text')
    this.props.onMoveTodo(fromIndex, this.props.index)
  }

  /**
   * IE9 doesn't support draggable="true" on <span>s. This hack manually starts
   * the drag & drop process onMouseDown. The setTimeout not only bothers me but
   * doesn't always seem to work - without it, the classes which set style for
   * the item being dragged and dropzones being dragged over aren't applied.
   */
, handleIE9DragHack: function(e) {
    e.preventDefault()
    if (window.event.button === 1) {
      var target = e.nativeEvent.target
      setTimeout(function() { target.dragDrop() }, 50)
    }
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
          onMouseDown={typeof window.isIE9 != 'undefined' && this.handleIE9DragHack}
        >{Constants.DRAG_HANDLE}</span>
      </div>
    }

    // onDrop is handled by the [DOING] dropZone if that's where this TODO is
    // being displayed.
    return <div
             className={todoItemClassName}
             onDragEnter={this.handleDragEnter}
             onDragOver={this.handleDragOver}
             onDragLeave={!this.props.doing && this.props.onDragLeave}
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