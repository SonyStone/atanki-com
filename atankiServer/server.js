var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use("/javascript", express.static(__dirname + '/javascript'));
app.use("/stylesheets",  express.static(__dirname + '/stylesheets'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/Tank.html');
});

io.on('connection', function (socket) {
	console.log('a user connected');

	socket.on('tank', function (msg) {
		console.log('message: ' + msg);
		io.emit('tank', msg);
	});

	// socket.on('disconnect', function () {
	// 	console.log('user disconected');
	// });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});