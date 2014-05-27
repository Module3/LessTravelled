'use strict'

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
Backbone.$ = $;

var map = require ('../map');



module.exports = Backbone.View.extend({
  el: '#controls',
  initialize: function(){
    this.render();
    map.initialize();
  },
  render: function(){
    var template = require('./templates/controls.hbs');
    $('#controls').html(template());
    console.log('controls rendered');
    return this;
  },
  events: {
    "click #submit" : "submit",
    "click .advanced-button": "advanced"
  },
  submit: function(e){
    e.preventDefault();
    console.log('Submit clicked');
    map.route();
  },
  advanced: function(){
    console.log('Advanced clicked');
  }
});
