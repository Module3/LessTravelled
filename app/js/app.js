'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
Backbone.$ = $;

var Controls = require('./views/controlsView');
var Router = require('./routes/routes');

$(function(){

  var router = new Router();

  Backbone.history.start();

});

