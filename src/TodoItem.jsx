/** @jsx React.DOM */

'use strict';

var $c = require('classNames')

var TodoItem = React.createClass({
  getInitialState: function() {
    return {
      editing: false
    }
  }

, handleTextClick: function() {
    if (!this.state.editing) {
      this.setState({editing: true})
    }
  }

, handleTextBlur: function() {
    if (this.state.editing) {
      var newText = this.refs.text.getDOMNode().innerHTML.replace(/<br ?\/?>/g, '\n')
      this.setState({editing: false})
      this.props.onEdit(this.props.todo, newText)
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
        <span className="control" onClick={this.props.onToggle.bind(null, this.props.todo)}>[{this.props.todo.done ? 'x' : ' '}]</span>
      </div>
      <div className="todo-item-text" ref="text" onClick={this.handleTextClick} onBlur={this.handleTextBlur} contentEditable={this.state.editing}>
        {this.props.todo.text}
      </div>
      <div className="todo-item-dobar">
        <span className="control" onClick={this.props.onDo.bind(null, this.props.todo)}>{doText}</span>
      </div>
    </div>
  }
})

module.exports = TodoItem