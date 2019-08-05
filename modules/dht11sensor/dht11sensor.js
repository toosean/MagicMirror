Module.register("dht11sensor", {

	// Default module config.
	defaults: {
        mqttServer:null,
        mqttTopic: "home/liveroom/dht11",
        updateInterval : 30000 //30sec
	},

	start:function(){
        this.payload = null;
        this.request();
    },

    request:function(){
        this.sendSocketNotification('SENSOR_READ_FROM_MQTT',{
            mqttServer : this.config.mqttServer,
            mqttTopic: this.config.mqttTopic
        });
    },

    getStyles: function() {
		return [
            this.file('node_modules/@fortawesome/fontawesome-free/css/all.min.css')
        ];
    },
    
    getScripts: function() {
		return [];
	},

    // Override dom generator.
	getDom: function () {

        var wrapper = document.createElement("div");

        if(this.payload != null && this.payload.temperature && this.payload.humidity){

            wrapper.className = "small";

            var span = document.createElement("span");
            span.innerHTML = "室内温度:" + this.payload.temperature + "℃";
            span.style.marginRight = "0.3em";
            wrapper.appendChild(span);


            var span = document.createElement("span");
            span.innerHTML = "湿度:" + this.payload.humidity + "%";
            span.style.marginRight = "0.3em";
            wrapper.appendChild(span);

            var icon = "";

            if(this.payload.humidity >= 45 && this.payload.humidity.humidity <= 65 && this.payload.temperature >= 18 && this.payload.temperature <= 26){
                icon = "far fa-smile-wink"
            }else if(this.payload.humidity >= 45 && this.payload.humidity.humidity <= 65 && this.payload.temperature >= 16 && this.payload.temperature <= 28){
                icon = "far fa-meh";
            }else{
                icon = "far fa-tired";
            }

            var i = document.createElement("i");
            i.className = icon;            
            wrapper.appendChild(i);

        }else{

            var lable = document.createElement('div');
            lable.innerHTML = "查询中...";
            lable.className = "small";
            wrapper.appendChild(lable);

        }

		return wrapper;

	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "SENSOR_READED_FROM_MQTT") {
            this.payload = JSON.parse(payload);
			this.updateDom();
		}
    }
});