'use strict'

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
Backbone.$ = $;

var map = require('../map');
var controlsView = require('./controlsView');



module.exports = Backbone.View.extend({
  el: '#controls',
  initialize: function(mapResult, mapInput){
    console.log('initialize mapInput= ' + mapInput);
    this.render(mapResult, mapInput);
  },
  render: function(mapResult, mapInput){
    var route = mapResult;
    var origin = route.routes[0].legs[0].start_address;
    var destination = route.routes[0].legs[0].end_address;
    var template = require('./templates/results.hbs');
    $('#controls').html(template({result1: origin, result2: destination, userInput: mapInput}));
    return this;
  },
  events: {
    "click #submit" : "newSearch"
  },
  newSearch: function(e){
    e.preventDefault();
    map.route();
    $('body').removeClass('welcome');
  }
});