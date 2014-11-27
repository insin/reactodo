'use strict';

var React = require('react')

var {ENTER_KEY, ESCAPE_KEY} = require('Constants')

var trim = require('trim')

/**
 * A text <input> with submit and cancel buttons, which can also be submitted or
 * cancelled using the keyboard.
 */
var EditInput = React.createClass({
  propTypes: {
    onCancel: React.PropTypes.func.isRequired
  , onSubmit: React.PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      autoFocus: true
    , button: 'Submit'
    , defaultValue: ''
    , size: 15
    , required: true
    , trim: true
    }
  },

  componentDidMount() {
    if (this.props.autoFocus) {
      this.refs.input.getDOMNode().focus()
    }
  },

  submit() {
    var value = this.refs.input.getDOMNode().value
    if (this.props.trim) {
      value = trim(value)
    }
    if (this.props.required && !value) {
      return
    }
    this.props.onSubmit(value)
  },

  cancel() {
    this.props.onCancel()
  },

  handleKeyDown(e) {
    if (e.which === ENTER_KEY) {
      this.submit()
    }
    else if (e.which === ESCAPE_KEY) {
      this.cancel()
    }
  },

  render() {
    return <span>
      <input
        type="text"
        size={this.props.size}
        defaultValue={this.props.defaultValue}
        ref="input"
        onKeyDown={this.handleKeyDown}
      />{' '}
      <span className="button" onClick={this.submit}>{this.props.button}</span>{' '}
      <span className="button" onClick={this.cancel}>Cancel</span>
    </span>
  }
})

module.exports = EditInput