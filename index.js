var fs = require('fs'),
    mqtt = require('mqtt');

var mqtt_base_topic = 'thermosmart/';
var conf = JSON.parse(fs.readFileSync('config.json'));

//setup mqtt communication
var client  = mqtt.connect('mqtt://localhost');

var sensorService = require('./lib/SensorService.js')(conf),
    zoneService = require('./lib/ZoneService.js')(conf, client);

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
});


client.on('message', function (topic, message) {
    var msg = message.length != 0 ? JSON.parse(message.toString()) : null;
    sensorService.handleMsg(topic, msg);
    zoneService.handleMsg(topic, msg);
});

function monitor() {
    //publish each 30s that the server is still alive
    client.publish("thermosmart/monitor/core", JSON.stringify(new Date().toISOString()), { retain: true });
    setTimeout(monitor, 30000);
}

function printSensors() {
    //console.log(sensorService.getList());
    setTimeout(printSensors, 5000);
}
printSensors();