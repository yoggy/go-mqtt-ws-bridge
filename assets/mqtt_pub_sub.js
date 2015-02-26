//
//	mqtt_sub.js
//
var path = "/ws";        // http://hostname:port/path
var topic = "test_topic"

var clientID = "mqtt_sub-" + (new Date()).getTime();
var client;

function t() {
	var t = (new Date()).toLocaleTimeString();
	return t;
}

var logs = [];

function append_log(str) {
	logs.push(str);
	if (logs.length > 10) {
		logs.shift();
	}

	var html = "";
	for (var i = 0; i < logs.length; i++) {
		html += $('<div/>').text(logs[i]).html();
		html += "<br/>";
	}
	$('#log').html(html);
}

function log(f, msg) {
	var str = t() + " D : " + f + " : " + msg;
	console.log(str);
	append_log(str);
}

function error(f, msg) {
	var str = t() + " : E : " + f + " : " + msg;
	console.log(str);
	append_log(str);
	alert(str);
}

function onConnectionLost(err) {
  if (err.errorCode !== 0) {
    error("onConnectionLost()", "err=" + JSON.stringify(err));
  }
}

function onFailure(err) {
    error("onFailure()", "err=" + JSON.stringify(err));
}

function onConnect() {
  log("onConnect()", "subscribe topic="+topic);
  client.subscribe(topic);

  $("#publish_button").click(onSendMessage);

  $("#publish_message").removeAttr("disabled");
  $("#publish_button").removeAttr("disabled");
}

function onSendMessage() {
  	var text = $('#publish_message').val();
  	//log("onSendMessage", text);
  	var msg = new Paho.MQTT.Message(text);
  	msg.destinationName = topic;
  	client.send(msg);
}

function onMessageArrived(message) {
  log("onMessageArrived()", message.payloadString);
}

function init() {
	client = new Paho.MQTT.Client(location.hostname, Number(location.port), path, clientID);
	client.onConnectionLost = onConnectionLost;
	client.onMessageArrived = onMessageArrived;
	client.connect({
		timeout : 30,
		mqttVersion : 3,
		cleanSession : true,
		onSuccess : onConnect,
		onFailure : onFailure
	});
}

$(document).ready(function() {
	init();
});
