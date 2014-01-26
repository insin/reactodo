/** @jsx React.DOM */

'use strict';

var Constants = require('Constants')
var Project = require('Project')
var Settings = require('Settings')

var $c = require('classNames')
var extend = require('extend')
var uuid = require('uuid')

var LOCALSTORAGE_STATE = 'reactodo-state'

var Reactodo = React.createClass({
  getInitialState: function() {
    var stateJSON = localStorage[LOCALSTORAGE_STATE]
    var state = stateJSON ? JSON.parse(stateJSON) : {}
    return extend({
      activeProjectId: null
    , editTodoId: null
    , showingSettings: false
    , projects: []
    }, state)
  }

, componentDidUpdate: function() {
    localStorage[LOCALSTORAGE_STATE] = JSON.stringify({
      activeProjectId: this.state.activeProjectId
    , projects: this.state.projects
    })
  }

, setActiveProject: function(projectId) {
    this.setState({
      activeProjectId: projectId
    , showingSettings: false
    })
  }

, showSettings: function() {
    if (!this.state.showingSettings) {
      this.setState({showingSettings: true})
    }
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
    this.setState({projects: this.state.projects})
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

, toggleTodo: function(project, todo) {
    todo.done = !todo.done
    if (project.doing === todo.id) {
      project.doing = null
    }
    this.setState({projects: this.state.projects})
  }

, doTodo: function(project, todo) {
    if (project.doing === todo.id) {
      project.doing = null
    }
    else {
      project.doing = todo.id
      if (todo.done) {
        todo.done = false
      }
    }
    this.setState({projects: this.state.projects})
  }

, deleteTodo: function(project, todo) {
    for (var i = 0, l = project.todos.length; i < l; i++) {
      if (project.todos[i].id === todo.id) {
        project.todos.splice(i, 1)
        return this.setState({projects: this.state.projects})
      }
    }
  }

, deleteDoneTodos: function(project) {
    project.todos = project.todos.filter(function(todo) { return !todo.done })
    this.setState({projects: this.state.projects})
  }

, render: function() {
    var tabs = [], content

    this.state.projects.forEach(function(project) {
      if (project.hidden) { return }
      var isActiveProject = (!this.state.showingSettings &&
                             this.state.activeProjectId === project.id)
      tabs.push(<li key={project.id}
        className={$c({active: isActiveProject})}
        onClick={!isActiveProject && this.setActiveProject.bind(this, project.id)}>
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
                    onDeleteTodo={this.deleteTodo}
                    onDeleteDoneTodos={this.deleteDoneTodos}
                  />
      }
    }.bind(this))

    if (this.state.showingSettings) {
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

    return <div>
      <h1>reactodo</h1>
      <div className="tab-bar">
        <ul className="tabs project-tabs">{tabs}</ul>
        <ul className="tabs app-tabs">
          <li
            className={$c({active: this.state.showingSettings})}
            onClick={this.showSettings}
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