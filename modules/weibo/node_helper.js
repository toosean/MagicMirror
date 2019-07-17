var NodeHelper = require("node_helper");
var request = require("request");

var jsdom = require("jsdom");
var jquery = require("jquery");

module.exports = NodeHelper.create({

    start: function() {
		console.log("Starting node helper for: " + this.name);
	},

	// Override socketNotificationReceived method.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "WEIBO_FETCH") {
            this.startFetching();
		}
    },
    
    startFetching: function(){
        var self = this;
        request('https://s.weibo.com/top/summary',function(error, response, body){

            const { JSDOM } = jsdom;
            const dom = new JSDOM(body);
            const $ = require('jquery')(dom.window);

            var titles = [];
            $('.td-02 a').each(function(index,e){
                titles.push($(e).text().trim());
            });

            self.sendSocketNotification('WEIBO_FETCHED',{
                titles:titles
            });
    

        });
    }

});