var NodeHelper = require("node_helper");
const { json } = require("express");

module.exports = NodeHelper.create({

    start: function() {


        this.volume = 1;

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

        this.expressApp.get('/piradioplayer/volume', (req, res) => {
            res.send(JSON.stringify({ volume : this.volume }));
        });

        this.expressApp.post('/piradioplayer/volume', (req, res) => {
            this.volume = req.body.volume * 0.01;
            this.sendSocketNotification("VOLUME",req.body.volume);
            res.send('VOLUME: ' + JSON.stringify(req.body));
        });

	},

	// Override socketNotificationReceived method.
	socketNotificationReceived: function(notification, payload) {        
    },
    
});