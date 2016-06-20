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
client.on('connect', function () {
    console.log('Connected to broker');
});

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'production';

var app = express();
var config = require('./server/config/configuration')[env];
require('./server/config/express')(app, config);
require('./server/config/mongoose')(config);
require('./server/config/routes')(app, config, client);

app.listen(config.port, function () {
    console.log('Gulp is running smart business on PORT: ' + config.port);
});