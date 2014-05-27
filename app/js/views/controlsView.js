var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
Backbone.$ = $;



module.exports = Backbone.View.extend({
  el: '.controls',
  initialize: function(){
    this.render();
  },
  render: function(){
    var template = require('./templates/controls.hbs');
    $('#controls').html(template());
    console.log('controls rendered');
    return this;
  },
  events: {
    "click .submit" : "submit",
    "click .advanced-button": "advanced"
  },
  submit: function(){
    console.log('click');
  },
  advanced: function(){
    console.log('click');
  }
});
