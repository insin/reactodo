/** @jsx React.DOM */

'use strict';

var Constants = require('Constants')

var trim = require('trim')

/**
 * A text <input> with submit and cancel buttons, which can also be submitted or
 * cancelled using the keyboard.
 */
var EditInput = React.createClass({
  propTypes: {
    onCancel: React.PropTypes.func.isRequired
  , onSubmit: React.PropTypes.func.isRequired
  }

, getDefaultProps: function() {
    return {
      autoFocus: true
    , button: 'Submit'
    , defaultValue: ''
    , size: 15
    , required: true
    , trim: true
    }
  }

, componentDidMount: function() {
    if (this.props.autoFocus) {
      this.refs.input.getDOMNode().focus()
    }
  }

, submit: function() {
    var value = this.refs.input.getDOMNode().value
    if (this.props.trim) {
      value = trim(value)
    }
    if (this.props.required && !value) {
      return
    }
    this.props.onSubmit(value)
  }

, cancel: function() {
    this.props.onCancel()
  }

, handleKeyDown: function(e) {
    if (e.which === Constants.ENTER_KEY) {
      this.submit()
    }
    else if (e.which === Constants.ESCAPE_KEY) {
      this.cancel()
    }
  }

, render: function() {
    return <span>
      <input
        type="text"
        size={this.props.size}
        defaultValue={this.props.defaultValue}
        ref="input"
        onKeyDown={this.handleKeyDown}
      />
      {' '}
      <span className="button" onClick={this.submit}>{this.props.button}</span>
      {' '}
      <span className="button" onClick={this.cancel}>Cancel</span>
    </span>
  }
})

module.exports = EditInput