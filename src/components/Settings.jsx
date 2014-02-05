/** @jsx React.DOM */

'use strict';

var Constants = require('Constants')
var EditInput = require('EditInput')

var partial = require('partial')

var Settings = React.createClass({
  getInitialState: function() {
    return {
      addingProject: false
    , addingSession: false
    , editingProjectName: null
    , editingSessionName: null
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

, deleteProject: function(project, index) {
    if (confirm('Are you sure you want to delete "' + project.name + '"?')) {
      this.props.onDeleteProject(project, index)
    }
  }

, sessionNameAlreadyExists: function(name) {
    return (this.props.getSessions().indexOf(name) != -1)
  }

, addSession: function(sessionName) {
    if (!this.state.addingSession) {
      this.setState({addingSession: true})
    }
    else {
      if (this.sessionNameAlreadyExists(sessionName)) {
        return alert('A session named "' + sessionName + '" already exists.')
      }
      this.setState({addingSession: false})
      this.props.onAddSession(sessionName)
    }
  }

, cancelAddSession: function() {
    this.setState({addingSession: false})
  }

, editSessionName: function(session, newName) {
    if (this.state.editingSessionName !== session) {
      this.setState({editingSessionName: session})
    }
    else {
      if (this.sessionNameAlreadyExists(newName) && newName !== session) {
        return alert('A session named "' + newName + '" already exists.')
      }
      this.setState({editingSessionName: null})
      if (newName !== session) {
        this.props.onEditSessionName(session, newName)
      }
    }
  }

, cancelEditSessionName: function() {
    this.setState({editingSessionName: null})
  }

, deleteSession: function(session) {
    if (confirm('Are you sure you want to delete "' + session +
                '"? All Projects and TODOs will be lost.')) {
      this.props.onDeleteSession(session)
    }
    this.forceUpdate()
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

    var addSession
    if (this.state.addingSession) {
      addSession = <EditInput
                     button="Add"
                     onSubmit={this.addSession}
                     onCancel={this.cancelAddSession}
                   />
    }
    else {
      addSession = <span className="control" onClick={this.addSession} title="Add a session">+</span>
    }

    var sessions = <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Current?</th>
            <th>{Constants.NBSP}</th>
            <th>{Constants.NBSP}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.getSessions().map(this.renderSession)}
        </tbody>
      </table>
      <p>Click on a session's name to switch to it.</p>
    </div>

    return <div className="settings">
      <h2>[PROJECTS] {addProject}</h2>
      {projects}
      <h2>[SESSIONS] {addSession}</h2>
      {sessions}
    </div>
  }

, renderProject: function(project, i, projects) {
    var first = (i === 0)
    var last = (i == projects.length - 1)
    var up = (first ? <span>{Constants.NBSP}</span> :
      <span className="control" onClick={partial(this.props.onMoveProjectUp, project, i)}>
        {Constants.UP_ARROW}
      </span>
    )
    var down = (last ? <span>{Constants.NBSP}</span> :
      <span className="control" onClick={partial(this.props.onMoveProjectDown, project, i)}>
        {Constants.DOWN_ARROW}
      </span>
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
      projectName = <span className="control" onClick={partial(this.editProjectName, project)}>
        {project.name}
      </span>
    }

    return <tr key={project.id}>
      <td>{projectName}</td>
      <td className="project-order">{up}{Constants.NBSP}{down}</td>
      <td className="project-show">
        <span className="control" onClick={partial(this.props.onToggleProjectVisible, project)}>
          [{project.hidden ? Constants.NBSP : Constants.CHECK}]
        </span>
      </td>
      <td>
        <span className="button" onClick={partial(this.deleteProject, project, i)}>Delete</span>
      </td>
    </tr>
  }

, renderSession: function(session) {
    var displayName = (session === '' ? '(Default)' : session)
    var isActiveSession = (session === this.props.session)
    var sessionName
    if (this.state.editingSessionName === session) {
      sessionName = <EditInput
                      defaultValue={session}
                      button="Edit"
                      onSubmit={partial(this.editSessionName, session)}
                      onCancel={this.cancelEditSessionName}
                    />
    }
    else {
      sessionName = <span className="control" onClick={partial(this.editSessionName, session)}>
        {displayName}
      </span>
    }
    var switchSession = Constants.NBSP
    var deleteSession = Constants.NBSP
    if (!isActiveSession) {
      switchSession = <span className="button" onClick={partial(this.props.onSwitchSession, session, {keepPage: true})}>
        Switch
      </span>
      deleteSession = <span className="button" onClick={partial(this.deleteSession, session)}>
        Delete
      </span>
    }

    return <tr key={session}>
      <td>{sessionName}</td>
      <td className="session-current">{isActiveSession ? '[' + Constants.CHECK + ']' : Constants.NBSP}</td>
      <td>{switchSession}</td>
      <td>{deleteSession}</td>
    </tr>
  }
})

module.exports = Settings