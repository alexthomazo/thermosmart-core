module.exports = function(conf, client) {

	function setSwitch(zone, value) {
		zone.devices.forEach(function(device) {
			var v = { v: (value ? "on" : "off") };

			client.publish("thermosmart/zwave/" + device.node +"/" + device.instance + "/set", JSON.stringify(v));
		});
	}


	return {
		setSwitch: setSwitch
	}
};