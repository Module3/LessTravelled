var ControlsView = require('../../../app/js/views/controlsView');


describe("Controls View", function() {
    var controls;
    before(function(){
	   controls = new ControlsView();
       console.log(controls);
    });
    it("should exist", function(){
	   expect(controls).to.be.ok;
    });

    it("el should be #controls", function () {
        expect(controls.$el.selector).to.be.eql("#controls");
    });

    it("should be instance of Controls", function() {
        expect(controls).to.be.instanceof(ControlsView);
        //expect(controls.render()).to.be.ok;
    });


});
