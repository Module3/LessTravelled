'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
Backbone.$ = $;

var map = require('../map');
var ControlsView = require('../views/controlsView');

module.exports = Backbone.Router.extend({
  routes: {
    "": "index"
  },
  initialize: function(){
    console.log('router initialized');
  },
  index: function(){
    console.log('index route called');
    var controls = new ControlsView();
  }
});

