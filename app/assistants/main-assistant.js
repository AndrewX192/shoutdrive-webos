function MainAssistant() {
/* this is the creator function for your scene assistant object. It will be passed all the
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

MainAssistant.prototype.setup = function() {
    /* this function is for setup tasks that have to happen when the scene is first created */
		
    /* use Mojo.View.render to render view templates and add them to the scene, if needed */
	
    /* setup widgets here */
	
    this.updateNowPlaying();


    this.buttonAttributes = {};
    this.BoardButtonModel = {
        "label"       : "Visit the ShoutDrive Board",
        "buttonClass" : "",
        "disabled"    : false
    };
    this.controller.setupWidget("ShoutDriveBoardButton", this.buttonAttributes, this.BoardButtonModel);

    this.ListenLiveButtonModel = {
        "label"       : "Listen Live",
        "buttonClass" : "",
        "disabled"    : false
    };
    this.controller.setupWidget("ListenLiveButton", this.buttonAttributes, this.ListenLiveButtonModel);
    
    this.MyDJSButtonModel = {
        "label"       : "My DJs",
        "buttonClass" : "",
        "disabled"    : false
    };
    this.controller.setupWidget("MyDJSButton", this.buttonAttributes, this.MyDJSButtonModel);

    this.ShoutDriveAboutButtonModel = {
        "label"       : "About ShoutDrive",
        "buttonClass" : "",
        "disabled"    : false
    };
    this.controller.setupWidget("ShoutDriveAboutButton", this.buttonAttributes, this.ShoutDriveAboutButtonModel);
    
    /* add event handlers to listen to events from widgets */
    Mojo.Event.listen(this.controller.get("ShoutDriveBoardButton"), Mojo.Event.tap,
        this.handleShoutDriveBoardButton.bind(this));
    Mojo.Event.listen(this.controller.get("ListenLiveButton"), Mojo.Event.tap,
        this.handleListenLiveButton.bind(this));
    Mojo.Event.listen(this.controller.get("MyDJSButton"), Mojo.Event.tap,
        this.handleShoutDriveDJListButton.bind(this));
    Mojo.Event.listen(this.controller.get("ShoutDriveAboutButton"), Mojo.Event.tap,
        this.handleShoutDriveAboutButton.bind(this));
        
    /** Automatically Update the NowPlaying section and recently played. **/
    setInterval(this.updateNowPlaying.bind(this), 7000);
};

MainAssistant.prototype.activate = function(event) {
    /* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

MainAssistant.prototype.deactivate = function(event) {
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

MainAssistant.prototype.cleanup = function(event) {
    /* this function should do any cleanup needed before the scene is destroyed as
	   a result of being popped off the scene stack */
};
MainAssistant.prototype.handleListenLiveButton = function(event) {
    this.controller.serviceRequest('palm://com.palm.applicationManager', {
        method: 'open',
        parameters: {
            id: 'com.palm.app.browser',
            params: {
                target: "http://www.shoutdrive.com/playlists/ShoutDRIVE.pls"
            }
        }
    });
};

MainAssistant.prototype.handleShoutDriveBoardButton = function(event) {
    this.controller.serviceRequest('palm://com.palm.applicationManager', {
        method: 'open',
        parameters: {
            id: 'com.palm.app.browser',
            params: {
                target: "http://www.shoutdrive.com/mb/"
            }
        }
    });
};

MainAssistant.prototype.handleShoutDriveDJListButton = function(event) {
    Mojo.Controller.stageController.pushScene("djlist");
};

MainAssistant.prototype.handleShoutDriveAboutButton = function(event) {
    Mojo.Controller.stageController.pushScene("about");
};

MainAssistant.prototype.updateNowPlayingCallback = function(status, response) {
    if('success' == status) {
        this.controller.get("NowPlayingText").update(response.responseJSON.currentSong);
        if(response.responseJSON.artwork != 'false') {
            this.controller.get("ArtworkContainer").update('<p class="nomargin nopadding"><img src="' + response.responseJSON.artwork + '"/></p>');
        } else {
            this.controller.get("ArtworkContainer").update('');
        }
        html = '';
        for(i = 0; i < response.responseJSON.recentlyPlayed.length; i++) {
            html += "<div class='palm-row grid-cell'>";
            html += '<div class="label left songlisttime" id="RPTime' + i + '"></div><br />';
            html += '<div class="title songlisttitle" id="RPTitle' + i +'"></div>';
            html += '</div>';
        }

        this.controller.get("RecentlyPlayedList").update(html);
        for(i = 0; i < response.responseJSON.recentlyPlayed.length; i++) {
            this.controller.get("RPTime" + i).update(response.responseJSON.recentlyPlayed[i].time);
            this.controller.get("RPTitle" + i).update(response.responseJSON.recentlyPlayed[i].artist + ' - ' + response.responseJSON.recentlyPlayed[i].title);
        }
        
    } else {
        this.controller.get("NowPlayingText").update("An error has occured");
    }
};

MainAssistant.prototype.updateNowPlaying = function() {
    url = "http://www.localcoast.net/sd/shoutdrive.json";
    var request = new Ajax.Request(url, {
        method:   'get',
        evalJSON: 'true',
        onSuccess: this.updateNowPlayingCallback.bind(this, 'success'),
        onFailure: this.updateNowPlayingCallback.bind(this, 'failure')
    });
}
