module.exports = function() {
	var sensors = {};

	/**
	 * Update sensor value to sensors list
	 * @param id Id of the sensors
	 * @param value up to date value or null to delete value
	 */
	function update(id, value) {
		if (value) {
			sensors[id] = value;
		} else if (sensors[id]) {
			delete sensors[id];
		}
	}


	function getList() {
		return sensors;
	}

	return {
		update: update,
		getList: getList
	}
};