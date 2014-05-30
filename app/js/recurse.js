module.exports.recurseSuperFast = function() {
	var r1 = {};
	r1.recurseSuperFast = function(num, max, callback) {
		if (num >= max) {
			return false;
		}

		var that = this;
		setTimeout(function() {
		  callback(num);
		  num += 8;
		  that.recurseSuperFast(num, max, callback)
		}, 0);
	};
	return r1;
};

module.exports.recurseFast = function() {
	var r2 = new Object;
	r2.recurseFast = function(num, max, callback) {
		if (num >= max) {
			return false;
		}

		var that = this;
		setTimeout(function() {
		  callback(num);
		  num += 2;
		  that.recurseFast(num, max, callback)
		}, 0);
	};
return r2;
};