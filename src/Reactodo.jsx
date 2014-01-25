/** @jsx React.DOM */

'use strict';

var Project = require('Project')
var Settings = require('Settings')

var $c = require('classNames')

var projectIdSeed = 3
var todoIdSeed = 7

var Reactodo = React.createClass({
  getInitialState: function() {
    return {
      activeProjectId: 2
    , editTodoId: null
    , showingSettings: false
    , projects: [
        {id: 1, name: 'ABC', doing: null, todos: [
          {id: 1, done: true,  text: 'Test 1'}
        , {id: 2, done: false, text: 'Test 2'}
        , {id: 3, done: false, text: 'Test 3'}
        ]}
      , {id: 2, name: 'DEF', doing: 5, todos: [
           {id: 4, done: true,  text: 'Test 4'}
         , {id: 5, done: false, text: 'Test 5\n\nNew line'}
         , {id: 6, done: false, text: 'Test 6'}
        ]}
      ]
    }
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
    var id = projectIdSeed++
    this.state.projects.push({id: id, name: projectName, doing: null, todos: []})
    this.setState({projects: this.state.projects})
  }

, addTodo: function(project) {
    var id = todoIdSeed++
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

, render: function() {
    var tabs = [], content

    this.state.projects.forEach(function(project) {
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
                  />
      }
    }.bind(this))

    if (this.state.showingSettings) {
      content = <Settings
                  projects={this.state.projects}
                  onAddProject={this.addProject}
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
            dangerouslySetInnerHTML={{__html: '&#9776;'}}
          />
        </ul>
      </div>
      <div className="panel">
        {content}
      </div>
    </div>
  }
})

module.exports = Reactodo