var should = require('should');

var sensorSrvFact = require('../lib/SensorService.js');

describe('SensorService', function() {

	it('handle message', function(done) {
		var sensors = [{ "id": "jee-chambre", "name": "Chambre", "type": "jeenode", "sensorId": "80" }];
		var sensorSrv = sensorSrvFact({ sensors: sensors });

		sensorSrv.handleMsg('thermosmart/temperature/80', {t: 20.5, d: "2015-06-08T19:00:34.209Z"});

		var sensor = sensorSrv.getList()[0];
		sensor.should.have.property('t', 20.5);
		sensor.should.have.property('d',  "2015-06-08T19:00:34.209Z");
		done();
	});
});