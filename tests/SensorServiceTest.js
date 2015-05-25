var should = require('should');

var sensorSrvFact = require('../lib/SensorService.js');

describe('SensorService', function() {

	it('update new value', function(done) {
		var sensorSrv = sensorSrvFact();

		sensorSrv.update('jee-80', {t: 20.5});

		sensorSrv.getList().should.have.property('jee-80').with.property('t', 20.5);
		done();
	});

	it('update existing value', function(done) {
		var sensorSrv = sensorSrvFact();

		sensorSrv.update('jee-80', {t: 20.5});
		sensorSrv.update('jee-80', {t: 22.5});

		sensorSrv.getList().should.have.property('jee-80').with.property('t', 22.5);
		done();
	});

	it('dalete existing value', function(done) {
		var sensorSrv = sensorSrvFact();

		sensorSrv.update('jee-80', {t: 20.5});
		sensorSrv.update('jee-80', null);

		sensorSrv.getList().should.have.not.property('jee-80');
		done();
	});
});