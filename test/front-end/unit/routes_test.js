var Routes = require('../../../app/js/routes/routes');
var ControlsView = require('../../../app/js/views/controlsView');


describe("Routes", function() {
    var routes;

    before(function(){
	   routes = new Routes();
       //console.log(routes);
    });
    it("should exist", function(){
	   expect(routes).to.be.ok;
    });

    it("should have routes", function () {
        expect(routes.routes).to.be.ok;
    });

    it("should have a Search route", function () {
        expect(routes.routes.search).to.be.ok;
    });

    it("should have an Index route", function () {
        expect(routes.routes['']).to.be.ok;
    });

    it("index route should create a control view", function() {
        //expect(controls).to.be.instanceof(ControlsView);
        routes.index();
        console.log('controls:');
        console.log(controls);
        expect(controls).to.be.ok;
    });


});
