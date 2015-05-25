var should = require('should');

var zoneService = require('../lib/ZoneService.js');

describe('ZoneService', function() {

	describe('computeZoneTemperature()', function() {
		var sensors = { 'jee-80': {t: 19.7}, 'jee-88': {t: 20.5}, 'wu-b248x': {t: 20.2} };
		var zone = { sensors: ['jee-80', 'jee-88', 'wu-b248x'] };

		it('any case', function(done) {
			zone.sensorReachMode = "any";

			var temp = zoneService.computeZoneTemperature(zone, sensors);

			temp.should.be.equal(20.5);
			done();
		});

		it('all case', function(done) {
			zone.sensorReachMode = "all";

			var temp = zoneService.computeZoneTemperature(zone, sensors);

			temp.should.be.equal(19.7);
			done();
		});

		it('average case', function(done) {
			zone.sensorReachMode = "average";

			var temp = zoneService.computeZoneTemperature(zone, sensors);

			temp.should.be.equal(20.1);
			done();
		});

		it('no res case', function(done) {
			zone.sensorReachMode = "all";

			var temp = zoneService.computeZoneTemperature(zone, {});

			should(temp).be.undefined;
			done();
		});
	});

});