module.exports = {

	/**
	 * @param zone Zone zone to compute temperature
	 * @param sensors Sensors reading, key = sensor id, value = temperature
	 * @return {number} Zone temperature
	 */
	computeZoneTemperature: function(zone, sensors) {
		var res;
		var nbSensors = 0;

		zone.sensors.forEach(function(sensor) {
			if (sensors[sensor]) {
				var sTemp = sensors[sensor].t;
				switch (zone.sensorReachMode) {
					case 'any':
						//we take the sensor with the highest temp
						if (res === undefined) res = 0;
						if (sTemp > res) res = sTemp;
						break;

					case 'all':
						//we take the sensor with the lowest temp
						if (res === undefined) {
							res = sTemp;
						} else if (sTemp < res) {
							res = sTemp;
						}
						break;

					case 'average':
						//we do the average of all sensors
						if (res === undefined) res = 0;
						res += sTemp;
						nbSensors++;
						break;
				}
			}
		});

		if (nbSensors > 0) res = Math.round(res / nbSensors * 10) / 10;

		return res;
	}
};