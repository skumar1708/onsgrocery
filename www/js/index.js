/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
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
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        launchStore('http://www.onsgrocery.com/');
    }
};

function launchStore(url){
	if(navigator.onLine){
		ref = cordova.InAppBrowser.open(url, '_blank','location=no,zoom=no,disallowoverscroll=yes,clearsessioncache=yes,hidden=yes');
		ref.addEventListener('loadstart', function(event) {
		let href = document.location.href;	
		  if(!navigator.onLine){
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
            }
		});
		ref.addEventListener('loadstop', function(event) {
			//iniDiv.style.display = "none";
			ref.show();
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
											launchStore('home');
										});
		});
	}
	else{
		alert('No internet');
	}
}   
