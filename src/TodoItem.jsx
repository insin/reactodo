/** @jsx React.DOM */

'use strict';

var Constants = require('Constants')

var $c = require('classNames')
var trim = require('trim')

var TodoItem = React.createClass({
  getInitialState: function() {
    return {
      editing: this.props.initialEdit || false
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

, render: function() {
    var doText = (this.props.doing ? 'STOP'
                  : (this.props.todo.done? 'REDO' : 'DO'))

    var todoItemClassName = $c('todo-item', {
      'is-todo': !this.props.todo.done
    , 'is-done': this.props.todo.done
    , 'is-doing': this.props.doing
    })

    return <div className={todoItemClassName}>
      <div className="todo-item-toolbar">
        <span className="control" onClick={this.props.onToggle.bind(null, this.props.todo)}>[{this.props.todo.done ? Constants.CHECK : Constants.NBSP}]</span>
      </div>
      <div className="todo-item-text" ref="text" onClick={this.handleTextClick} onBlur={this.handleTextBlur} contentEditable={this.state.editing}>
        {this.props.todo.text || ' '}
      </div>
      <div className="todo-item-dobar">
        <span className="control" onClick={this.props.onDo.bind(null, this.props.todo)}>{doText}</span>
      </div>
    </div>
  }
})

module.exports = TodoItem