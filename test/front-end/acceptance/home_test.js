'use strict';
/*global casper*/

casper.test.begin('home page', 4, function suite(test) {

  casper.start('http://localhost:3000/', function() {
    test.assertHttpStatus(200);
  });

  casper.then(function(){
    test.assertTitle('LessTravelled', 'title is LessTravelled');
  });

  casper.then(function() {
    test.assertSelectorHasText('p','How many miles');
  });

  casper.then(function() {
    test.assertExists('.advanced-button');
  });

  casper.run(function(){
    test.done();
  });

});