Module.register("piradioplayer", {

    radioSource : null,
    howlPlayer: null,
    isPause : true,
    isStreamLoaded:false,
    

	// Default module config.
	defaults: {},

	start:function(){
        this.sendSocketNotification('INIT',{});
    },
    getStyles: function() {
		return [
            this.file('node_modules/@fortawesome/fontawesome-free/css/all.min.css')
        ];
    },
    
    getScripts: function() {
		return [
            this.file("/node_modules/howler/dist/howler.core.min.js")
        ];
	},

    // Override dom generator.
	getDom: function () {

        var wrapper = document.createElement("div");

        if(this.radioSource && this.radioSource.Title && this.howlPlayer !== null){
            if(this.isPause){
                wrapper.innerHTML =  '<i class="fa fa-pause-circle fa-fw"></i> ' + this.radioSource.Title;
            }else if(this.isStreamLoaded){
                wrapper.innerHTML =  '<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> ' + this.radioSource.Title;
            }else{
                wrapper.innerHTML =  '<i class="fa fa-spinner fa-pulse fa-fw"></i> ' + this.radioSource.Title;
            }
        }else{
            wrapper.innerHTML = '<i class="fa fa-stop-circle fa-fw"></i> ' + "STOP";
        }

		return wrapper;

	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "PLAYER_SOURCE") {

            this.radioSource = payload.RadioSource;

            if(this.howlPlayer !== null){
                this.howlPlayer.unload();
            }

            console.debug("radioSource.Uri",this.radioSource.Uri);

            this.howlPlayer = new Howl({
                src:[this.radioSource.Uri],
                html5 : true
            });

            this.isPause = false;
            this.isStreamLoaded = false;
            
            this.howlPlayer.on("load",() => { this.isStreamLoaded = true; this.updateDom() });
            this.howlPlayer.on("pause",() => { this.isPause = true; this.updateDom() });
            this.howlPlayer.on("play",() => { this.isPause = false; this.updateDom() });
            this.howlPlayer.on("playerror",(id,msg)=> { console.error("playerror",id,msg) });
            this.howlPlayer.on("loaderror",(id,msg)=> { console.error("loaderror",id,msg) });

            this.howlPlayer.play();

            if(payload.SlowingFadeIn){
                this.howlPlayer.fade(0,1,1000*60);
            }else{
                this.howlPlayer.fade(0,1,1000);
            }
            
            this.updateDom();
            
		}else if(notification == "PAUSE"){
            if(this.howlPlayer !== null){
                this.howlPlayer.pause();
            }
        }else if(notification == "RESUME"){
            if(this.howlPlayer !== null){
                this.howlPlayer.play();
            }
        }else if(notification == "VOLUME"){
            if(this.howlPlayer !== null){
                this.howlPlayer.volume(payload);
            }
        }
    }
});
