function DjlistAssistant() {
/* this is the creator function for your scene assistant object. It will be passed all the
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

DjlistAssistant.prototype.setup = function() {
    /* this function is for setup tasks that have to happen when the scene is first created */

    /* use Mojo.View.render to render view templates and add them to the scene, if needed */

    /* setup widgets here */
    this.listDjs();

/* add event handlers to listen to events from widgets */
};

DjlistAssistant.prototype.activate = function(event) {
    /* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
    };

DjlistAssistant.prototype.deactivate = function(event) {
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
    };

DjlistAssistant.prototype.cleanup = function(event) {
    /* this function should do any cleanup needed before the scene is destroyed as
	   a result of being popped off the scene stack */
    };
DjlistAssistant.prototype.addDjsToListCallback = function(status, response) {
    if('success' == status) {
        if(response.responseJSON.currentDjs) {
            html = '';
            for(i = 0; i < response.responseJSON.currentDjs.length; i++) {
                html += "<div class='palm-row grid-cell dj-item'>";
                html += '<div class="label djnames" id="DJName' + i + '"></div>';
                html += '<div class="title djtiles" id="DJTitle' + i +'"></div>';
                html += '<div class="djheadshots left" id="DJHS' + i + '"></div>';
                html += '</div>';

            }
            this.controller.get("CurrentDjs").update(html);
            for(i = 0; i < response.responseJSON.currentDjs.length; i++) {
                this.controller.get("DJName" + i).update(response.responseJSON.currentDjs[i].Name);
                this.controller.get("DJHS" + i).update('<img class="dj-headshot" height="55" width="55" src="' + response.responseJSON.currentDjs[i].HeadShot + '" />');
                this.controller.get("DJTitle" + i).update(response.responseJSON.currentDjs[i].Title + '<br />' + response.responseJSON.currentDjs[i].Location);
            }
        }
    } else {
        this.controller.get("CurrentDjs").update("An error has occured");
    }
};

DjlistAssistant.prototype.listDjs = function() {
    url = "http://www.localcoast.net/sd/djs.json";
    var request = new Ajax.Request(url, {
        method:   'get',
        evalJSON: 'true',
        onSuccess: this.addDjsToListCallback.bind(this, 'success'),
        onFailure: this.addDjsToListCallback.bind(this, 'failure')
    });
}