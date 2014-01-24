/** @jsx React.DOM */

'use strict';

var TodoItem = React.createClass({
  render: function() {
    return <div className="todo-item">
      <span className="checkbox" >[{this.props.todo.done ? 'x' : ' '}]</span>
      <div className="todo-item-text">{this.props.todo.text}</div>
    </div>
  }
})

module.exports = TodoItem