var NodeHelper = require("node_helper");
var request = require("request");
var moment = require("moment");


module.exports = NodeHelper.create({

    start: function() {
		console.log("Starting node helper for: " + this.name);
	},

	// Override socketNotificationReceived method.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "BTC_CHART_FETCH") {
            this.startFetching(payload.productId,payload.granularity);
		}
    },
    
    startFetching: function(productId,granularity){
        var self = this;

        var start = moment().subtract(1,'d').toISOString();
        var end = moment().toISOString();

        var url = "https://api.pro.coinbase.com/products/" +
                  productId + "/" +
                  "candles?start=" + start +
                  "&end=" + end +
                  "&granularity=" + granularity;

        request({
            url:url,
            headers:{
                "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        },function(error, response, body){
            
            var data = JSON.parse(body);
            var payload = [];
            for(var i = 0;i<data.length;i++){
                payload.push({
                    time : data[i][0],
                    low : data[i][1],
                    high : data[i][2],
                    open : data[i][3],
                    close : data[i][4],
                    volume : data[i][5]
                });
            }

            self.sendSocketNotification('BTC_CHART_FETCHED', JSON.stringify(payload));
        });
    }

});