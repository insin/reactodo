'use strict';

var React = require('react')

var EditInput = require('EditInput')

var exportProject = require('exportProject')
var exportTextFile = require('exportTextFile')
var partial = require('partial')

var {CHECK, DOWN_ARROW, NBSP, UP_ARROW} = require('Constants')

var Settings = React.createClass({
  getInitialState() {
    return {
      addingProject: false
    , addingSession: false
    , editingProjectName: null
    , editingSessionName: null
    }
  },

  addProject(projectName) {
    if (!this.state.addingProject) {
      this.setState({addingProject: true})
    }
    else {
      this.setState({addingProject: false})
      this.props.onAddProject(projectName)
    }
  },

  cancelAddProject() {
    this.setState({addingProject: false})
  },

  editProjectName(project, projectName) {
    if (this.state.editingProjectName !== project.id) {
      this.setState({editingProjectName: project.id})
    }
    else {
      this.setState({editingProjectName: null})
      this.props.onEditProjectName(project, projectName)
    }
  },

  cancelEditProjectName() {
    this.setState({editingProjectName: null})
  },

  deleteProject(project, index) {
    if (confirm('Are you sure you want to delete "' + project.name + '"?')) {
      this.props.onDeleteProject(project, index)
    }
  },

  sessionNameAlreadyExists(name) {
    return (this.props.getSessions().indexOf(name) != -1)
  },

  addSession(sessionName) {
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
  },

  cancelAddSession() {
    this.setState({addingSession: false})
  },

  editSessionName(session, newName) {
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
  },

  cancelEditSessionName() {
    this.setState({editingSessionName: null})
  },

  deleteSession(session) {
    if (confirm('Are you sure you want to delete "' + session +
                '"? All Projects and TODOs will be lost.')) {
      this.props.onDeleteSession(session)
    }
    this.forceUpdate()
  },

  toggleProjectVisible(project) {
    this.props.onToggleProjectVisible(project)
  },

  exportProject(project) {
    exportTextFile(exportProject(project), project.name + '.todo.txt')
  },

  render() {
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
              <th>{NBSP}</th>
              <th>{NBSP}</th>
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
            <th>{NBSP}</th>
            <th>{NBSP}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.getSessions().map(this.renderSession)}
        </tbody>
      </table>
      <p>Click on a session's name to edit it.</p>
    </div>

    return <div className="settings">
      <h2>[PROJECTS] {addProject}</h2>
      {projects}
      <h2>[SESSIONS] {addSession}</h2>
      {sessions}
    </div>
  },

  renderProject(project, i, projects) {
    var first = (i === 0)
    var last = (i == projects.length - 1)
    var up = (first ? <span>{NBSP}</span> :
      <span className="control" onClick={partial(this.props.onMoveProjectUp, project, i)}>
        {UP_ARROW}
      </span>
    )
    var down = (last ? <span>{NBSP}</span> :
      <span className="control" onClick={partial(this.props.onMoveProjectDown, project, i)}>
        {DOWN_ARROW}
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
      <td className="project-order">{up}{NBSP}{down}</td>
      <td className="project-show">
        <span className="control" onClick={partial(this.props.onToggleProjectVisible, project)}>
          [{project.hidden ? NBSP : CHECK}]
        </span>
      </td>
      <td>
        <span className="button" onClick={partial(this.exportProject, project)}>Export</span>
      </td>
      <td>
        <span className="button" onClick={partial(this.deleteProject, project, i)}>Delete</span>
      </td>
    </tr>
  },

  renderSession(session) {
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
    var switchSession = NBSP
    var deleteSession = NBSP
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
      <td className="session-current">{isActiveSession ? '[' + CHECK + ']' : NBSP}</td>
      <td>{switchSession}</td>
      <td>{deleteSession}</td>
    </tr>
  }
})

module.exports = Settings