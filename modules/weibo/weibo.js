Module.register("weibo", {

	// Default module config.
	defaults: {
		text: "Hello  World!",
		tableClass: "small",
		updateInterval: 60000 //1 min
	},

	start:function(){
		this.titles = [];
		this.request();
		setInterval(this.request.bind(this), this.config.updateInterval);
	},
	request:function(){
		this.sendSocketNotification('WEIBO_FETCH',{});
	},

	// Override dom generator.
	getDom: function () {


		var wrapper = document.createElement("table");

		var titles = this.titles;

		if(titles.length == 0){

			wrapper.innerHTML = "读取中...";
			wrapper.className = this.config.tableClass + " dimmed";

		}else{

			var maxLength = 20;
			var startFade = 15;

			for(var i = 0;i<titles.length;i++)
			{
				var tr = document.createElement("tr");
				tr.style.fontSize = '15px';
				tr.style.lineHeight = '22px';

				var tdicon = document.createElement("td");
				tdicon.innerHTML = "<i class=\"fa fa-info-circle\"></i>";
				tr.appendChild(tdicon);

				var td = document.createElement("td");
				td.className = "small";
				td.innerHTML = titles[i];
				td.style.paddingLeft = "6px";
				tr.appendChild(td);

				if(i > 10){
					tr.style.opacity = 1 - (1 * (i - startFade) / (maxLength - startFade));
				}

				wrapper.appendChild(tr);

				if(i >= maxLength) break;

			}

		}


		return wrapper;

	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "WEIBO_FETCHED") {
			this.titles = payload.titles;
			this.updateDom();
		}
    }

});
