var fs = require('fs'),
    mqtt = require('mqtt'),
    moment = require('moment');

var mqtt_base_topic = 'thermosmart/';
var conf = JSON.parse(fs.readFileSync('config.json'));

//setup mqtt communication
var client  = mqtt.connect('mqtt://192.168.0.102');

var sensorService = require('./lib/SensorService.js')(conf),
    zoneService = require('./lib/ZoneService.js')(conf, client),
    deviceService = require('./lib/DeviceService.js')(conf, client);

// ----------------------------------------------------------------------------------
// --------------                  MQTT PART                   ----------------------
// ----------------------------------------------------------------------------------
client.on('connect', function () {
    console.log("MQTT Connected");
    monitor();

    //read previous state persisted into mqtt broker
    client.subscribe(mqtt_base_topic + 'temperature/#');
    client.subscribe(mqtt_base_topic + 'zones/#');

    //init services
    zoneService.init();
    setTimeout(computeHeating, 2000);
});


client.on('message', function (topic, message) {
    var msg = message.length != 0 ? JSON.parse(message.toString()) : null;
    sensorService.handleMsg(topic, msg);
    zoneService.handleMsg(topic, msg);
});

function monitor() {
    //publish each 30s that the server is still alive
    client.publish("thermosmart/monitor/core", JSON.stringify(new Date().toISOString()));
    setTimeout(monitor, 30000);
}

//main function
function computeHeating() {
    var zones = zoneService.getList();

    zones.forEach(function(zone) {
        var temperature = zoneService.computeZoneTemperature(zone, sensorService.getList());
        var doHeating = zoneService.doHeating(zone, temperature);

        deviceService.setSwitch(zone, doHeating);

        console.log(zone.name + ": " + temperature + " - " + zone.setPoint + " " +
            (doHeating ? "HEAT" : "") );
    });

    setTimeout(computeHeating, 5000);
}