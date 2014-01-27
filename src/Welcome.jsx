/** @jsx React.DOM */

'use strict';

var Constants = require('Constants')

var trim = require('trim')

var Welcome = React.createClass({
  switchSession: function() {
    var sessionName = trim(this.refs.sessionName.getDOMNode().value)
    if (sessionName) {
      window.location.search = sessionName
    }
  }

, onSessionNameKeyDown: function(e) {
    if (e.which === Constants.ENTER_KEY) {
      this.switchSession()
    }
  }

, render: function() {
    var currentSession
    if (!this.props.session) {
      currentSession = <div>
        <p>You are currently using the default session.</p>
        <p>
          If you'd like to switch to a named session which describes your TODOs
          (e.g. "work projects" or "personal projects"), enter the named you'd
          like to use below:
        </p>
      </div>
    }
    else {
      currentSession = <div>
        <p>
          You are currently using a named session - "{this.props.session}" -
          bookmark the current address to easily return to this session again
          later.
        </p>
        <p>
          If you'd like to switch to another named session enter a name below:
        </p>
      </div>
    }

    return <div>
      <h2>[WELCOME]</h2>
      <p>Reactodo is a TODO app with 3 fixed categories - DOING, TODO and DONE - and multiple TODO lists, or projects.</p>
      <p>TODO lists you create are stored locally, so will only be available on this machine and browser.</p>
      <p>To set up some projects, click the <span className="control" title="Settings" onClick={this.props.onShowSettings}>{Constants.SETTINGS}</span> icon, here or over in the corner.</p>
      <h2>[SESSIONS]</h2>
      <p>Reactodo allows you to have multiple, independent sessions with their own TODO lists.</p>
      {currentSession}
      <p>
        <input type="text" ref="sessionName" onKeyDown={this.onSessionNameKeyDown}/>{' '}
        <span className="button" onClick={this.switchSession}>Switch</span>
      </p>
      <h2>[TIPS]</h2>
      <ul>
        <li><p>To <strong>add a TODO</strong>, click the <strong>+</strong> control beside a project's <strong>[TODO]</strong> heading.</p></li>
        <li><p>To <strong>edit a TODO</strong>, click on its text.</p></li>
        <li><p>To <strong>delete a single TODO</strong>, delete all of its text.</p></li>
        <li><p>To <strong>delete completed TODOs</strong>, click the <strong>-</strong> control beside a project's <strong>[DONE]</strong> heading.</p></li>
      </ul>
    </div>
  }
})

module.exports = Welcome