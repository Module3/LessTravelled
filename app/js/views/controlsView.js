var backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var hbs = require('handlebars');
var Backbone.$ = $;



var Controls = Backbone.View.extend({
  el: '.controls',
  initialize: function(){
    this.render();
  },
  render: function(){
    var template = require('./templates/controlsViewTemplate');
    $('#controls').html(template());
    return this;
  },
  events: {
    "click #submit" : "submit",
    "click #advanced": "advanced"
  },
  submit: function(){

  },
  advanced: function(){

  }
});

module.exports = Controls;