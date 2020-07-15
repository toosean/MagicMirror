var NodeHelper = require("node_helper");
const { json } = require("express");

module.exports = NodeHelper.create({

    start: function() {
        this.expressApp.use(json());

        this.expressApp.post('/piradioplayer/playSource', (req, res) => {
            this.sendSocketNotification("PLAYER_SOURCE",req.body);
            res.send('PLAYER_SOURCE: ' + JSON.stringify(req.body));
        });

        this.expressApp.get('/piradioplayer/pause', (req, res) => {
            this.sendSocketNotification("PAUSE");
            res.send('PAUSE');
        });
        this.expressApp.get('/piradioplayer/resume', (req, res) => {
            this.sendSocketNotification("RESUME");
            res.send('RESUME');
        });
        this.expressApp.post('/piradioplayer/volume', (req, res) => {
            this.sendSocketNotification("VOLUME",req.body.volume);
            res.send('VOLUME: ' + JSON.stringify(req.body));
        });
	},

	// Override socketNotificationReceived method.
	socketNotificationReceived: function(notification, payload) {        
    },
    
});