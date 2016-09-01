/**
 * Created by Mordekaiser on 06/06/16.
 */
var mongoose = require('mongoose'),
    userModel = require('../models/User'),
    locationModel = require('../models/Location'),
    brandModel = require('../models/Brand'),
    productModel = require('../models/Product'),
    checkoutModel = require('../models/Checkout');

module.exports = function (config) {
    mongoose.connect(config.db);
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback() {
        console.log('Smart business db opened');
    });

    userModel.createDefaultUsers();
};