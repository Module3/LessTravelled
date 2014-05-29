'use strict'

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
Backbone.$ = $;

var map = require('../map');
var ResultsView = require('./resultsView');



module.exports = Backbone.View.extend({
  el: '#controls',
  initialize: function(){
    this.render();
    map.initialize();
  },
  render: function(){
    var template = require('./templates/controls.hbs');
    $('#controls').html(template());
    return this;
  },
  events: {
    "click #submit" : "submit",
    "click .advanced-button": "advanced"
  },
  submit: function(e){
    e.preventDefault();
    if ($('#from').val()==='Start:' || ''){
      alert('Please enter a "Start:" location');
      return false;
    }
    if($('#to').val()==='End:' || ''){
      alert('Please enter an "End:" location');
      return false;
    }
    map.route();
    $('body').removeClass('welcome');
  },
  advanced: function(){
    $('body').removeClass('welcome');
    $('.advanced-controls').toggleClass('hidden');
    $('advanced-button').toggleClass('hidden');
  }
});
