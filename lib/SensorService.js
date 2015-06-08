module.exports = function(conf) {
	var sensors = conf.sensors;

	function handleMsg(topic, msg) {
		//topic: thermosmart/temperature/<id>
		//msg: { t: 20.5, d:"" }
		if (topic.substr(0, 24) != "thermosmart/temperature/") return;

		var id = topic.substr(topic.lastIndexOf('/') + 1);
		var sensor = getSensor(id);
		if (sensor) {
			if (msg) {
				sensor.t = msg.t;
				sensor.d = msg.d;
			} else {
				delete sensor.t;
				delete sensor.d;
			}
		}
	}

	function getList() {
		return sensors;
	}

	function getSensor(sensorId) {
		for (var i = 0; i < sensors.length; i++) {
			var sensor = sensors[i];
			if (sensor.sensorId == sensorId) {
				return sensor;
			}
		}
	}

	return {
		getList: getList,
		handleMsg: handleMsg
	}
};