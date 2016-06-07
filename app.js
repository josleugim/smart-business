/**
 * Created by Mordekaiser on 03/06/16.
 */
var express = require('express');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();
var config = require('./server/config/configuration')[env];
require('./server/config/express')(app, config);
require('./server/config/mongoose')(config);
require('./server/config/routes')(app, config);

app.listen(config.port, function () {
    console.log('Gulp is running smart business on PORT: ' + config.port);
});