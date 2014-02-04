/** @jsx React.DOM */

'use strict';

var Constants = require('Constants')
var EditInput = require('EditInput')

var partial = require('partial')

var Settings = React.createClass({
  getInitialState: function() {
    return {
      addingProject: false
    , editingProjectName: null
    }
  }

, addProject: function(projectName) {
    if (!this.state.addingProject) {
      this.setState({addingProject: true})
    }
    else {
      this.setState({addingProject: false})
      this.props.onAddProject(projectName)
    }
  }

, cancelAddProject: function() {
    this.setState({addingProject: false})
  }

, editProjectName: function(project, projectName) {
    if (this.state.editingProjectName !== project.id) {
      this.setState({editingProjectName: project.id})
    }
    else {
      this.setState({editingProjectName: null})
      this.props.onEditProjectName(project, projectName)
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
      addProject = <EditInput
                     button="Add"
                     onSubmit={this.addProject}
                     onCancel={this.cancelAddProject}
                   />
    }
    else {
      addProject = <span className="control" onClick={this.addProject} title="Add a project">+</span>
    }

    var projects
    if (this.props.projects.length) {
      projects = <div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Order</th>
              <th>Show?</th>
              <th>{Constants.NBSP}</th>
            </tr>
          </thead>
          <tbody>
            {this.props.projects.map(this.renderProject)}
          </tbody>
        </table>
        <p>Click on a project's name to edit it.</p>
      </div>
    }

    return <div className="settings">
      <h2>[PROJECTS] {addProject}</h2>
      {projects}
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
      projectName = <EditInput
                      defaultValue={project.name}
                      button="Edit"
                      onSubmit={partial(this.editProjectName, project)}
                      onCancel={this.cancelEditProjectName}
                    />
    }
    else {
      projectName = <span className="control" onClick={partial(this.editProjectName, project)}>{project.name}</span>
    }

    return <tr key={project.id}>
      <td>{projectName}</td>
      <td className="project-order">{up}{Constants.NBSP}{down}</td>
      <td className="project-show">
        <span className="control" onClick={partial(this.toggleProjectVisible, project)}>[{project.hidden ? Constants.NBSP : Constants.CHECK}]</span>
      </td>
      <td>
        <span className="button" onClick={partial(this.deleteProject, project, i)}>Delete</span>
      </td>
    </tr>
  }
})

module.exports = Settings