/** @jsx React.DOM */

'use strict';

var TodoItem = React.createClass({
  render: function() {
    return <div className="todo-item">
      <div className="todo-item-toolbar">
        <span className="checkbox" onClick={this.props.onToggle.bind(null, this.props.todo)}>[{this.props.todo.done ? 'x' : ' '}]</span>
      </div>
      <div className="todo-item-text">
        {this.props.todo.text}
      </div>
    </div>
  }
})

module.exports = TodoItem