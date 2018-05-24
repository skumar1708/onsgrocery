var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
		let ref = null;
    },
    onOffline:function(){
        swal("You are offine!!");
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);

        console.log('Received Event: ' + id);
        document.addEventListener("offline", app.onOffline, false);
        launchStore('http://www.onsgrocery.com/');
    }
};

function launchStore(url){
		ref = cordova.InAppBrowser.open(url, '_blank','location=no,zoom=no,disallowoverscroll=yes,clearsessioncache=yes,hidden=yes');
		let href = document.location.href;	
		ref.addEventListener('loadstart', function(event) {
			if(!navigator.onLine){
				swal("You are offine!!");
				return history.go(-1);
			}
		/* 	if(!navigator.onLine){
                let div = document.createElement('div');
                let btn = document.createElement('button');
                btn.innerHTML ="Retry";
                btn.addEventListener('click',retry);

                // var img = document.createElement('img');
                // img.src = "/img/woops.png";
                div.classList.add('no-internet');
                div.innerHTML = "<p>You are offline, please check your internet conection and</p>"
                //div.append(img);
                div.append(btn)
                document.body.append(div);
            }
            function retry(){
                    if(navigator.onLine){
                        let child = document.querySelector('.no-internet');
                        document.body.removeChild(child);
                         launchStore(href);
                      }
            } */
		});
		ref.addEventListener('loadstop', function(event) {
			//iniDiv.style.display = "none";
            ref.show();
            setupPush();
		});
		ref.addEventListener('exit', function(event) {
							swal({
										title: '',
										text: "Do you really want to exit?",
										type: 'success',
										showCancelButton: true,
										confirmButtonColor: '#3085d6',
										cancelButtonColor: '#d33',
										confirmButtonText: 'Yes',
										cancelButtonText: 'No',
										confirmButtonClass: 'btn btn-success',
										cancelButtonClass: 'btn btn-danger',
										buttonsStyling: true
										}).then(function () {
										navigator.app.exitApp();
										}, function (dismiss) {
											launchStore('http://www.onsgrocery.com/');
										});
		});
}   

function setupPush() {
    alert('calling push init');
    var push = PushNotification.init({
        "android": {
            "icon":'cart',
            "senderID": "20215523485"
        },
        "browser": {},
        "ios": {
            "sound": true,
            "vibration": true,
            "badge": true
        },
        "windows": {}
    });
    push.on('registration', function(data) {
        //alert('registration event: ' + data.registrationId);

        var oldRegId = localStorage.getItem('registrationId');
        if (oldRegId !== data.registrationId) {
            // Save new registration ID
            localStorage.setItem('registrationId', data.registrationId);
        
            // unsubscribe and resubscribe
            push.unsubscribe("all", function () {
               // alert("unsubscribed to all");
                push.subscribe("onsgrocery-offers", function successSubscribe () {
                    // success ...
                   // alert("resubscribed to all");
                }, function errorSubscribe () {
                    // error ...
                    //alert("error subscribing to all");
                });
            });
        }

        var parentElement = document.getElementById('registration');
        var listeningElement = parentElement.querySelector('.waiting');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
    });

    push.on('error', function(e) {
        //alert("push error = " + e.message);
    });

    push.on('notification', function(data) {
        // alert('notification event');
        // navigator.notification.alert(
        //     data.message,         // message
        //     null,                 // callback
        //     data.title,           // title
        //     'Ok'                  // buttonName
        // );
   });
}
