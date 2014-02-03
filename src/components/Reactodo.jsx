/** @jsx React.DOM */

'use strict';

var Constants = require('Constants')
var Page = require('Page')
var Project = require('Project')
var Settings = require('Settings')
var Welcome = require('Welcome')

var $c = require('classNames')
var extend = require('extend')
var partial = require('partial')
var uuid = require('uuid')

var Reactodo = React.createClass({
  getInitialState: function() {
    var storedJSON = localStorage[Constants.LOCALSTORAGE_PREFIX + this.props.session]
    var storedState = storedJSON ? JSON.parse(storedJSON) : {}
    var initialState =  extend({
      activeProjectId: null
    , editTodoId: null
    , projects: []
    }, storedState)
    initialState.page =
      (initialState.projects.length && initialState.activeProjectId !== null
       ? Page.TODO_LISTS
       : Page.WELCOME)
    return initialState
  }

, componentDidMount: function() {
    if (this.props.session) {
      document.title = this.props.session + ' - ' + document.title
    }
  }

, componentDidUpdate: function() {
    localStorage[Constants.LOCALSTORAGE_PREFIX + this.props.session] = JSON.stringify({
      activeProjectId: this.state.activeProjectId
    , projects: this.state.projects
    })
  }

, getSessions: function() {
    return Object.keys(localStorage)
      .filter(function(p) { return p.indexOf(Constants.LOCALSTORAGE_PREFIX) === 0 })
      .map(function(p) { return p.substring(Constants.LOCALSTORAGE_PREFIX.length) })
  }

, setPage: function(page) {
    this.setState({page: page})
  }

, setActiveProject: function(projectId) {
    this.setState({
      activeProjectId: projectId
    , page: Page.TODO_LISTS
    })
  }

, addProject: function(projectName) {
    var id = uuid()
    this.state.projects.push({id: id, name: projectName, doing: null, todos: []})
    this.setState({projects: this.state.projects})
  }

, editProjectName: function(project, projectName) {
    project.name = projectName
    this.setState({projects: this.state.projects})
  }

, moveProjectUp: function(project, index) {
    this.state.projects.splice(index - 1, 0, this.state.projects.splice(index, 1)[0])
    this.setState({projects: this.state.projects})
  }

, moveProjectDown: function(project, index) {
    this.state.projects.splice(index + 1, 0, this.state.projects.splice(index, 1)[0])
    this.setState({projects: this.state.projects})
  }

, toggleProjectVisible: function(project) {
    project.hidden = !project.hidden
    this.setState({projects: this.state.projects})
  }

, deleteProject: function(project, index) {
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
  }

, addTodo: function(project) {
    var id = uuid()
    project.todos.unshift({id: id , done: false, text: ''})
    this.setState({
      editTodoId: id
    , projects: this.state.projects
    })
  }

, editTodo: function(project, todo, newText) {
    todo.text = newText
    this.setState({
      editTodoId: null
    , projects: this.state.projects
    })
  }

, moveTodo: function(project, fromIndex, toIndex) {
    var fromTodo = project.todos[fromIndex]
      , toTodo = project.todos[toIndex]
    if (fromTodo.done !== toTodo.done) {
      fromTodo.done = toTodo.done
    }
    project.todos.splice(toIndex, 0, project.todos.splice(fromIndex, 1)[0])
    this.setState({projects: this.state.projects})
  }

, toggleTodo: function(project, todo) {
    todo.done = !todo.done
    if (project.doing === todo.id) {
      project.doing = null
    }
    this.setState({projects: this.state.projects})
  }

, doTodo: function(project, todo) {
    project.doing = todo.id
    if (todo.done) {
      todo.done = false
    }
    this.setState({projects: this.state.projects})
  }

, stopDoingTodo: function(project) {
    project.doing = null
    this.setState({projects: this.state.projects})
  }

, deleteTodo: function(project, todo) {
    for (var i = 0, l = project.todos.length; i < l; i++) {
      if (project.todos[i].id === todo.id) {
        project.todos.splice(i, 1)
        if (project.doing === todo.id) {
          project.doing = null
        }
        return this.setState({projects: this.state.projects})
      }
    }
  }

, deleteDoneTodos: function(project) {
    project.todos = project.todos.filter(function(todo) { return !todo.done })
    this.setState({projects: this.state.projects})
  }

, render: function() {
    var tabs = []
    var content

    if (this.state.page === Page.WELCOME) {
      content = <Welcome
                  session={this.props.session}
                  getSessions={this.getSessions}
                  onShowSettings={partial(this.setPage, Page.SETTINGS)}
                />
    }
    else if (this.state.page === Page.SETTINGS) {
      content = <Settings
                  projects={this.state.projects}
                  onAddProject={this.addProject}
                  onEditProjectName={this.editProjectName}
                  onMoveProjectUp={this.moveProjectUp}
                  onMoveProjectDown={this.moveProjectDown}
                  onToggleProjectVisible={this.toggleProjectVisible}
                  onDeleteProject={this.deleteProject}
                />
    }

    // Always display project tabs when available
    this.state.projects.forEach(function(project) {
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
    }.bind(this))

    // Ensure there's something in tabs so its display isn't collapsed (Chrome)
    if (!tabs.length) { tabs.push(' ') }

    return <div>
      <h1>
        <span className="control" onClick={partial(this.setPage, Page.WELCOME)}>reactodo</span>
        {' '}
        <small>{this.props.session}</small>
      </h1>
      <div className="tab-bar">
        <ul className="tabs project-tabs">{tabs}</ul>
        <ul className="tabs app-tabs">
          <li
            className={$c({active: this.state.page === Page.SETTINGS})}
            onClick={partial(this.setPage, Page.SETTINGS)}
            title="Settings"
          >{Constants.SETTINGS}</li>
        </ul>
      </div>
      <div className="panel">
        {content}
      </div>
    </div>
  }
})

module.exports = Reactodo