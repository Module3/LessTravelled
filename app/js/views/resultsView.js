'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
Backbone.$ = $;

var map = require('../map');
var controlsView = require('./controlsView');



module.exports = Backbone.View.extend({
  el: '#controls',
  initialize: function(mapResult, mapInput){
    this.render(mapResult, mapInput);
  },
  render: function(mapResult, mapInput){
    var route = mapResult;
    var origin = route.routes[0].legs[0].start_address;
    var destination = route.routes[0].legs[0].end_address;
    var template = require('./templates/results.hbs');
    $('.advanced-controls').addClass('hidden');
    $('#controls').html(template({result1: origin, result2: destination, userInput: mapInput, id: this.counter}));
    return this;
  },
  events: {
    "click #submit" : "newSearch"
  },
  newSearch: function(e){
    e.preventDefault();
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