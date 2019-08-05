var NodeHelper = require("node_helper");
var mqtt = require("mqtt");

module.exports = NodeHelper.create({

    start: function() {
        this.mqttClient = null;
        this.mqttTopic = null;
		console.log("Starting node helper for: " + this.name);
	},

	// Override socketNotificationReceived method.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "SENSOR_READ_FROM_MQTT") {
            this.mqttTopic = payload.mqttTopic;
            this.startRead(payload.mqttServer);
		}
    },
    
    startRead: function(mqttServer){

        if(this.mqttClient == null){
            this.mqttClient = mqtt.connect(mqttServer);
            this.mqttClient.on('connect',this.mqttClientConnect.bind(this));
            this.mqttClient.on('message',this.mqttClientMessage.bind(this));
            this.mqttClient.on('close',this.mqttClientClose.bind(this));
        }

        if(!this.mqttClient.connected){
            this.mqttClient.reconnect();
        }


    },

    mqttClientConnect:function(){
        this.mqttClient.subscribe(this.mqttTopic);
    },

    mqttClientMessage:function(topic, message, packet){
        this.sendSocketNotification('SENSOR_READED_FROM_MQTT', message.toString());
    },

    mqttClientClose:function(){
        this.mqttClient.reconnect();
    }


});