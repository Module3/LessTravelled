'use strict'

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
Backbone.$ = $;

var Controls = require('./views/controlsView');

$(function(){

  var controls = new Controls();
  console.log('app started.');

});

