'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
Backbone.$ = $;

var map = require('../map');
var ControlsView = require('../views/controlsView');

module.exports = Backbone.Router.extend({
  routes: {
    "": "index",
    "search": "search"
  },
  initialize: function(){
  },
  index: function(){
    var controls = new ControlsView();
  },
  search: function(){
    if ($('#from').val()==='Start:' || ''){
      alert('Please enter a "Start:" location');// jshint ignore:line
      return false;
    }
    if($('#to').val()==='End:' || ''){
      alert('Please enter an "End:" location');// jshint ignore:line
      return false;
    }
    map.route();
    $('body').removeClass('welcome');
  }

});

