/** @jsx React.DOM */

'use strict';

var Constants = require('Constants')

var Welcome = React.createClass({
  render: function() {
    return <div>
      <h2>[WELCOME]</h2>
      <p>Reactodo is a TODO list app with 3 fixed categories - DOING, TODO and DONE - and multiple TODO lists, or projects.</p>
      <p>To set up some projects, click the <span className="control" title="Settings" onClick={this.props.onShowSettings}>{Constants.SETTINGS}</span> icon, here or over in the corner.</p>
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