/** @jsx React.DOM */

'use strict';

var ENTER_KEY = 13

var Settings = React.createClass({
  getInitialState: function() {
    return {
      addingProject: false
    }
  }

, componentDidUpdate: function(prevProps, prevState) {
    if (this.state.addingProject && ! prevState.addingProject) {
      this.refs.projectName.getDOMNode().focus()
    }
  }

, addProject: function() {
    if (!this.state.addingProject) {
      this.setState({addingProject: true})
    }
    else {
      var projectName = this.refs.projectName.getDOMNode().value
      if (projectName) {
        this.setState({addingProject: false})
        this.props.onAddProject(projectName)
      }
    }
  }

, handleAddProjectKeyDown: function(e) {
    if (e.which !== ENTER_KEY) { return }
    this.addProject()
  }

, render: function() {
    var addProject
    if (this.state.addingProject) {
      addProject = <span>
        <input
          type="text"
          size="15"
          ref="projectName"
          onKeyDown={this.handleAddProjectKeyDown}
        />
        {' '}
        <span className="button" onClick={this.addProject}>Add</span>
      </span>
    }
    else {
      addProject = <span className="control" onClick={this.addProject}>+</span>
    }

    var projects = this.props.projects.map(function(project) {
      return <div>{project.name}</div>
    })

    return <div className="settings">
      <h2>[PROJECTS] {addProject}</h2>
      {projects}
    </div>
  }
})

module.exports = Settings