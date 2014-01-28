/** @jsx React.DOM */

'use strict';

var Constants = require('Constants')

var partial = require('partial')
var trim = require('trim')

var Settings = React.createClass({
  getInitialState: function() {
    return {
      addingProject: false
    , editingProjectName: null
    }
  }

, componentDidUpdate: function(prevProps, prevState) {
    if (this.state.addingProject && !prevState.addingProject) {
      this.refs.projectName.getDOMNode().focus()
    }
    if (this.state.editingProjectName && !prevState.editingProjectName) {
      this.refs.editProjectName.getDOMNode().focus()
    }
  }

, addProject: function() {
    if (!this.state.addingProject) {
      this.setState({addingProject: true})
    }
    else {
      var projectName = trim(this.refs.projectName.getDOMNode().value)
      if (projectName) {
        this.setState({addingProject: false})
        this.props.onAddProject(projectName)
      }
    }
  }

, cancelAddProject: function() {
    this.setState({addingProject: false})
  }

, editProjectName: function(project) {
    if (this.state.editingProjectName === null) {
      this.setState({editingProjectName: project.id})
    }
    else {
      var projectName = trim(this.refs.editProjectName.getDOMNode().value)
      if (projectName) {
        this.setState({editingProjectName: null})
        this.props.onEditProjectName(project, projectName)
      }
    }
  }

, cancelEditProjectName: function() {
    this.setState({editingProjectName: null})
  }

, handleAddProjectKeyDown: function(e) {
    if (e.which === Constants.ENTER_KEY) {
      this.addProject()
    }
    else if (e.which === Constants.ESCAPE_KEY) {
      this.cancelAddProject()
    }
  }

, handleEditProjectNameKeyDown: function(project, e) {
    if (e.which === Constants.ENTER_KEY) {
      this.editProjectName(project)
    }
    else if (e.which === Constants.ESCAPE_KEY) {
      this.cancelEditProjectName()
    }
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
        {' '}
        <span className="button" onClick={this.cancelAddProject}>Cancel</span>
      </span>
    }
    else {
      addProject = <span className="control" onClick={this.addProject} title="Add Project">+</span>
    }

    var projects = this.props.projects.map(this.renderProject)

    return <div className="settings">
      <h2>[PROJECTS] {addProject}</h2>
      <p>Click on a project name to edit it.</p>
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
      <span className="control" onClick={partial(this.moveProjectUp, project, i)}>{Constants.UP_ARROW}</span>
    )
    var down = (last ? <span>{Constants.NBSP}</span> :
      <span className="control" onClick={partial(this.moveProjectDown, project, i)}>{Constants.DOWN_ARROW}</span>
    )
    var projectName
    if (this.state.editingProjectName === project.id) {
      projectName = <span>
        <input
          type="text"
          size="15"
          defaultValue={project.name}
          ref="editProjectName"
          onKeyDown={partial(this.handleEditProjectNameKeyDown, project)}
        />
        {' '}
        <span className="button" onClick={partial(this.editProjectName, project)}>Edit</span>
        {' '}
        <span className="button" onClick={this.cancelEditProjectName}>Cancel</span>
      </span>
    }
    else {
      projectName = <span className="control" onClick={partial(this.editProjectName, project)}>{project.name}</span>
    }

    return <tr key={project.id}>
      <td>{projectName}</td>
      <td>{up}{Constants.NBSP}{down}</td>
      <td>
        <span className="control" onClick={partial(this.toggleProjectVisible, project)}>[{project.hidden ? Constants.NBSP : Constants.CHECK}]</span>
      </td>
      <td>
        <span className="button" onClick={partial(this.deleteProject, project, i)}>Delete</span>
      </td>
    </tr>
  }
})

module.exports = Settings