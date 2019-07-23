Module.register("btcchart", {

	// Default module config.
	defaults: {
        tableClass: "small",
        granularity: 3600,
        productId: "BTC-USD", //https://api.pro.coinbase.com/products/
	},

	start:function(){
        this.payload = null;
        this.sendSocketNotification('BTC_CHART_FETCH',{
            productId : this.config.productId,
            granularity : this.config.granularity
        });
        
    },


    getScripts: function() {
		return [
            "moment.js",
            this.file('node_modules/chart.js/dist/Chart.js')
        ];
	},

    // Override dom generator.
	getDom: function () {

        var wrapper = document.createElement("div");
        
        if(this.payload instanceof Array){

            var newst = this.payload[0];

            var lable = document.createElement('div');
            lable.innerHTML = "$" + newst.close;
            wrapper.appendChild(lable);
            
            var canvas  = document.createElement('canvas');
            wrapper.appendChild(canvas);

            var labels = [];
            var datasets = [];

            for(var i = this.payload.length-1;i>=0;i--){
                var time = moment.unix(this.payload[i].time);
                labels.push(time.format('HH:mm'));
                datasets.push(this.payload[i].close);
            }

            var ctx = canvas.getContext('2d');
            var chart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'line',
            
                // The data for our dataset
                data: {
                    labels: labels,
                    datasets: [{
                        backgroundColor: 'rgb(0, 0, 0)',
                        borderColor: 'rgb(200, 200, 200)',
                        pointRadius : 0,
                        data: datasets
                    }]
                },
            
                // Configuration options go here
                options: {
                    legend :{
                        display:false
                    }
                }
            });

        }else{

            var lable = document.createElement('div');
            lable.innerHTML = "查询中...";
            lable.className = "small";
            wrapper.appendChild(lable);

        }

		return wrapper;

	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "BTC_CHART_FETCHED") {
			this.payload = JSON.parse(payload);
			this.updateDom();
		}
    }
});