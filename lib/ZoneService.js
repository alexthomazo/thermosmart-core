var re = new RegExp('([^/]+)/?');

module.exports = function(conf, client) {
	var zones = conf.zones;

	for (var i = 0; i < zones.length; i++) {
		var zone = zones[i];
		zone.sensors = zone.sensors.map(function(sId) { return getObjById(conf.sensors, sId) });
		zone.devices = zone.devices.map(function(sId) { return getObjById(conf.devices, sId) });
	}

	function init() {
		//adding zone not present into mqtt (with no setpoint)
		zones.forEach(function(zone) {
			if (!zone.setPoint) {
				var id = zone.id;
				client.publish("thermosmart/zones/" + id, JSON.stringify(zone), { retain: true });
				client.publish("thermosmart/zones/" + id + "/setpoint", '16', { retain: true });
			}
		});
	}

	function handleMsg(topic, msg) {
		//topic: thermosmart/zones/<name>/setpoint
		//msg: 20.2
		if (!msg) return;
		var tp = topic.split(re);
		if (!(tp[1] == "thermosmart" && tp[3] == "zones")) return;

		var id = tp[5];
		if (tp[7] == "setpoint") {
			//received setpoint update
			var zone = getObjById(zones, id);
			if (zone) {
				zone.setPoint = msg;
			} else {
				console.log("zone " + id + " not found, removing");
				client.publish("thermosmart/zones/" + id, null, { retain: true });
				client.publish("thermosmart/zones/" + id + "/setpoint", null, { retain: true });
			}
		}
	}

	/**
	 * @param zone Zone zone to compute temperature
	 * @param sensors Sensors reading, key = sensor id, value = temperature
	 * @return {number} Zone temperature
	 */
	function computeZoneTemperature(zone, sensors) {
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

	function getObjById(objects, id) {
		for (var i = 0; i < objects.length; i++) {
			var obj = objects[i];
			if (obj.id == id) return obj;
		}
	}

	return {
		init: function() { setTimeout(init, 1000); }, //time to read mqtt messages
		handleMsg: handleMsg,
		computeZoneTemperature: computeZoneTemperature
	}
};