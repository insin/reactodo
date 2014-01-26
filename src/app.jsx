/** @jsx React.DOM */

'use strict';

var Reactodo = require('Reactodo')

var sessionMatch = /^\?([\w\s\d]+)/.exec(decodeURIComponent(window.location.search))
var session = (sessionMatch != null ? sessionMatch[1] : '')

React.renderComponent(<Reactodo session={session}/>, document.getElementById('reactodo'))