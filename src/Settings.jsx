/** @jsx React.DOM */

'use strict';

var Constants = require('Constants')

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
    if (e.which !== Constants.ENTER_KEY) { return }
    this.addProject()
  }

, moveProjectUp: function(project, index) {
    this.props.onMoveProjectUp(project, index)
  }

, moveProjectDown: function(project, index) {
    this.props.onMoveProjectDown(project, index)
  }

, deleteProject: function(project, index) {
    if (confirm('Are you sure you want to delete "' + project.name + '"?')) {
      this.props.onDeleteProject(project, index)
    }
  }

, toggleProjectVisible: function(project) {
    this.props.onToggleProjectVisible(project)
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

    var projects = this.props.projects.map(this.renderProject)

    return <div className="settings">
      <h2>[PROJECTS] {addProject}</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Order</th>
            <th>Show?</th>
            <th>Delete!</th>
          </tr>
        </thead>
        <tbody>
          {projects}
        </tbody>
      </table>
    </div>
  }

, renderProject: function(project, i, projects) {
    var first = (i === 0)
    var last = (i == projects.length - 1)
    var up = (first ? <span>{Constants.NBSP}</span> :
      <span className="control" onClick={this.moveProjectUp.bind(null, project, i)}>{Constants.UP_ARROW}</span>
    )
    var down = (last ? <span>{Constants.NBSP}</span> :
      <span className="control" onClick={this.moveProjectDown.bind(null, project, i)}>{Constants.DOWN_ARROW}</span>
    )

    return <tr key={project.id}>
      <td>{project.name}</td>
      <td>{up}{Constants.NBSP}{down}</td>
      <td>
        <span className="control" onClick={this.toggleProjectVisible.bind(null, project)}>[{project.hidden ? Constants.NBSP : Constants.CHECK}]</span>
      </td>
      <td>
        <span className="button" onClick={this.deleteProject.bind(null, project, i)}>Delete</span>
      </td>
    </tr>
  }
})

module.exports = Settings