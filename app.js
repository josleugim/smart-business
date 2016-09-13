/**
 * Created by Mordekaiser on 03/06/16.
 */
var express = require('express'),
    mqtt = require('mqtt');

var options = {
    username: 'josleugim',
    password: 'secret'
};

var client = mqtt.connect('mqtt://159.203.162.152', options);
// Subscription to current sensor
client.subscribe('josleugim/test/current');
client.subscribe('josleugim/test/currenteffective');
client.subscribe('josleugim/test/power');

client.on('connect', function () {
    console.log('Connected to broker');
});

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var config = require('./server/config/configuration')[env];
require('./server/config/express')(app, config);
require('./server/config/mongoose')(config);
require('./server/config/routes')(app, config, client);

io.on('connection', function(socket){
	client.on('message', function (topic, message) {
		io.emit('current', {topicName: topic, message: message.toString()});
        //console.log(topic + " : " + message.toString());
        //client.end();
    })

    // when the user emits a message, this function listens and executes
    socket.on('sendMessage', function (data) {
        io.sockets.in(socket.room).emit('updateConversation', socket.username, data.message);
    });

    // when the user disconnects
    socket.on('disconnect', function () {
        socket.broadcast.emit('updateConversation', 'Server', socket.username + ' has disconnected');
        socket.leave(socket.room);
    })
});

// port listening setup
http.listen(config.port, function () {
    console.log('Gulp is running smart business on PORT: ' + config.port);
});