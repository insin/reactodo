'use strict';

var React = require('react')

var Reactodo = require('Reactodo')

var trim = require('trim')

var sessionMatch = /^\?(.+)/.exec(trim(decodeURIComponent(window.location.search)))
var session = (sessionMatch != null ? sessionMatch[1] : '')

React.render(<Reactodo session={session}/>, document.getElementById('reactodo'))