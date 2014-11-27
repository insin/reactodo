'use strict';

var React = require('react')

var Page = require('Page')
var Project = require('Project')
var Settings = require('Settings')
var Welcome = require('Welcome')

var $c = require('classNames')
var extend = require('extend')
var partial = require('partial')
var uuid = require('uuid')

var {LOCALSTORAGE_PREFIX, SETTINGS, TRIANGLE_DOWN, TRIANGLE_UP} = require('Constants')

var Reactodo = React.createClass({
  getInitialState() {
    return this.getStateForSession(this.props.session)
  },

  /**
   * Gets state for the named session, loading from localStorage if available.
   */
  getStateForSession(session) {
    var storedJSON = localStorage[LOCALSTORAGE_PREFIX + session]
    var storedState = storedJSON ? JSON.parse(storedJSON) : {}
    var state =  extend({
      activeProjectId: null
    , editTodoId: null
    , projects: []
    , showingSessionMenu: false
    }, storedState)
    state.page =
      (state.projects.length && state.activeProjectId !== null
       ? Page.TODO_LISTS
       : Page.WELCOME)
    return state
  },

  componentDidMount() {
    this.updateWindowTitle()
  },

  /**
   * Reloads state if the session name has changed.
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.session !== nextProps.session) {
      var sessionState = this.getStateForSession(nextProps.session)
      if (nextProps.keepPage) {
        // If the new session doesn't have any TODO lists, don't send it to the
        // TODO lists page, or the user will get an empty screen. If the new
        // session does have TODO lists and we're on the Welcome page, don't
        // stay on the Welcome page.
        if (!(sessionState.page === Page.WELCOME && this.state.page === Page.TODO_LISTS) &&
            !(sessionState.page === Page.TODO_LISTS && this.state.page === Page.WELCOME)) {
          sessionState.page = this.state.page
        }
      }
      this.setState(sessionState)
    }
  },

  /**
   * Stores session state when there's been a state change. Ensures the window
   * title is updated if the session changed as part of the update.
   */
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.session !== this.props.session) {
      this.updateWindowTitle()
    }
    localStorage[LOCALSTORAGE_PREFIX + this.props.session] = JSON.stringify({
      activeProjectId: this.state.activeProjectId
    , projects: this.state.projects
    })
  },

  updateWindowTitle() {
    if (this.props.session) {
      document.title = this.props.session + ' - reactodo'
    }
    else {
      document.title = 'reactodo'
    }
  },

  /**
   * Switches to another named session on the fly. If a keepPage option is
   * passed and is truthy, the current page state will be retained.
   */
  switchSession(session, options) {
    options = extend({keepPage: false}, options)
    if (typeof history !== 'undefined' && history.replaceState) {
      history.replaceState(session, session + ' - reactodo', '?' + encodeURIComponent(session))
    }
    this.setProps({session: session, keepPage: options.keepPage})
  },

  /**
   * Determines session names present in localStorage.
   */
  getSessions() {
    return Object.keys(localStorage)
      .filter(function(p) { return p.indexOf(LOCALSTORAGE_PREFIX) === 0 })
      .map(function(p) { return p.substring(LOCALSTORAGE_PREFIX.length) })
  },

  /** Adds a new session without switching to it. */
  addSession(sessionName) {
    localStorage[LOCALSTORAGE_PREFIX + sessionName] = JSON.stringify({
      activeProjectId: null
    , projects: []
    })
    this.forceUpdate()
  },

  /**
   * Copies session state from one name to another and deletes the original. If
   * the original was the active session, switches to it.
   */
  editSessionName(session, newName) {
    localStorage[LOCALSTORAGE_PREFIX + newName] =
      localStorage[LOCALSTORAGE_PREFIX + session]
    this.deleteSession(session)
    if (this.props.session === session) {
      this.switchSession(newName, {keepPage: true})
    }
  },

  deleteSession(sessionName) {
    delete localStorage[LOCALSTORAGE_PREFIX + sessionName]
    this.forceUpdate()
  },

  setPage(page) {
    this.setState({page: page})
  },

  /**
   * Sets the given project id as active and switches to displaying its TODOs if
   * currently on another screen.
   */
  setActiveProject(projectId) {
    this.setState({
      activeProjectId: projectId
    , page: Page.TODO_LISTS
    })
  },

  addProject(projectName) {
    var id = uuid()
    this.state.projects.push({id: id, name: projectName, doing: null, todos: []})
    this.setState({projects: this.state.projects})
  },

  editProjectName(project, projectName) {
    project.name = projectName
    this.setState({projects: this.state.projects})
  },

  moveProjectUp(project, index) {
    this.state.projects.splice(index - 1, 0, this.state.projects.splice(index, 1)[0])
    this.setState({projects: this.state.projects})
  },

  moveProjectDown(project, index) {
    this.state.projects.splice(index + 1, 0, this.state.projects.splice(index, 1)[0])
    this.setState({projects: this.state.projects})
  },

  toggleProjectVisible(project) {
    project.hidden = !project.hidden
    this.setState({projects: this.state.projects})
  },

  /**
   * Deletes a project and sets the next adjacent project as active if there are
   * any.
   */
  deleteProject(project, index) {
    this.state.projects.splice(index, 1)
    var activeProjectId = this.state.activeProjectId
    if (this.state.projects.length === 0) {
      activeProjectId = null
    }
    else if (activeProjectId === project.id) {
      if (index <= this.state.projects.length - 1) {
        activeProjectId = this.state.projects[index].id
      }
      else {
        activeProjectId = this.state.projects[index - 1].id
      }
    }
    this.setState({
      activeProjectId: activeProjectId
    , projects: this.state.projects
    })
  },

  addTodo(project) {
    var id = uuid()
    project.todos.unshift({id: id , done: false, text: ''})
    this.setState({
      editTodoId: id
    , projects: this.state.projects
    })
  },

  editTodo(project, todo, newText) {
    todo.text = newText
    this.setState({
      editTodoId: null
    , projects: this.state.projects
    })
  },

  moveTodo(project, fromIndex, toIndex) {
    var fromTodo = project.todos[fromIndex]
      , toTodo = project.todos[toIndex]
    if (fromTodo.done !== toTodo.done) {
      fromTodo.done = toTodo.done
    }
    project.todos.splice(toIndex, 0, project.todos.splice(fromIndex, 1)[0])
    this.setState({projects: this.state.projects})
  },

  toggleTodo(project, todo) {
    todo.done = !todo.done
    if (project.doing === todo.id) {
      project.doing = null
    }
    this.setState({projects: this.state.projects})
  },

  doTodo(project, todo) {
    project.doing = todo.id
    if (todo.done) {
      todo.done = false
    }
    this.setState({projects: this.state.projects})
  },

  stopDoingTodo(project) {
    project.doing = null
    this.setState({projects: this.state.projects})
  },

  deleteTodo(project, todo) {
    for (var i = 0, l = project.todos.length; i < l; i++) {
      if (project.todos[i].id === todo.id) {
        project.todos.splice(i, 1)
        if (project.doing === todo.id) {
          project.doing = null
        }
        return this.setState({projects: this.state.projects})
      }
    }
  },

  deleteDoneTodos(project) {
    project.todos = project.todos.filter(function(todo) { return !todo.done })
    this.setState({projects: this.state.projects})
  },

  showSessionMenu() {
    this.setState({showingSessionMenu: true})
  },

  pickSession(session, e) {
    e.preventDefault()
    e.stopPropagation()
    this.hideSessionMenu()
    this.switchSession(session, {keepPage: true})
  },

  hideSessionMenu() {
    this.setState({showingSessionMenu: false})
  },

  render() {
    var tabs = []
    var content

    if (this.state.page === Page.WELCOME) {
      content = <Welcome
                  session={this.props.session}
                  getSessions={this.getSessions}
                  onSwitchSession={this.switchSession}
                  onShowSettings={partial(this.setPage, Page.SETTINGS)}
                />
    }
    else if (this.state.page === Page.SETTINGS) {
      content = <Settings
                  projects={this.state.projects}
                  session={this.props.session}
                  getSessions={this.getSessions}
                  onSwitchSession={this.switchSession}
                  onAddProject={this.addProject}
                  onAddSession={this.addSession}
                  onEditProjectName={this.editProjectName}
                  onEditSessionName={this.editSessionName}
                  onMoveProjectUp={this.moveProjectUp}
                  onMoveProjectDown={this.moveProjectDown}
                  onToggleProjectVisible={this.toggleProjectVisible}
                  onDeleteProject={this.deleteProject}
                  onDeleteSession={this.deleteSession}
                />
    }

    // Always display project tabs when available
    this.state.projects.forEach(project => {
      if (project.hidden) { return }
      var isActiveProject = (this.state.page === Page.TODO_LISTS &&
                             this.state.activeProjectId === project.id)
      tabs.push(<li key={project.id}
        className={$c({active: isActiveProject})}
        onClick={!isActiveProject && partial(this.setActiveProject, project.id)}>
        {project.name}
      </li>)
      if (isActiveProject) {
        content = <Project
                    project={project}
                    editTodoId={this.state.editTodoId}
                    onAddTodo={this.addTodo}
                    onEditTodo={this.editTodo}
                    onToggleTodo={this.toggleTodo}
                    onDoTodo={this.doTodo}
                    onStopDoingTodo={this.stopDoingTodo}
                    onDeleteTodo={this.deleteTodo}
                    onDeleteDoneTodos={this.deleteDoneTodos}
                    onMoveTodo={this.moveTodo}
                  />
      }
    })

    // Ensure there's something in tabs so its display isn't collapsed (Chrome)
    if (!tabs.length) { tabs.push(' ') }

    var sessions = this.getSessions()
    var multipleSessions = sessions.length > 1
    var activeSession
    var sessionMenu
    if (!this.state.showingSessionMenu) {
      var sessionName = this.props.session
      if (multipleSessions) {
        sessionName += ' ' + TRIANGLE_DOWN
      }
      activeSession = <span className={$c({control: multipleSessions})} onClick={multipleSessions && this.showSessionMenu}>
        {sessionName}
      </span>
    }
    else {
      activeSession = <span className="control" onClick={this.hideSessionMenu}>
        {this.props.session + ' ' + TRIANGLE_UP}
      </span>

      sessions.sort()
      sessions.splice(sessions.indexOf(this.props.session), 1)

      var menuItems = sessions.map((session, index) => {
        var sessionName = session || '(Default)'
        return <div className="menu-item" onClick={partial(this.pickSession, session)}>
          {sessionName}
        </div>
      })

      sessionMenu = <div className="menu">{menuItems}</div>
    }

    return <div onClick={this.state.showingSessionMenu && this.hideSessionMenu}>
      <h1>
        <span className="control" onClick={partial(this.setPage, Page.WELCOME)}>reactodo</span>{' '}
        <small className="menu-container">{activeSession}{sessionMenu}</small>
      </h1>
      <div className="tab-bar">
        <ul className="tabs project-tabs">{tabs}</ul>
        <ul className="tabs app-tabs">
          <li
            className={$c({active: this.state.page === Page.SETTINGS})}
            onClick={partial(this.setPage, Page.SETTINGS)}
            title="Settings"
          >{SETTINGS}</li>
        </ul>
      </div>
      <div className="panel">
        {content}
      </div>
    </div>
  }
})

module.exports = Reactodo