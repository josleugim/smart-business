"use strict";
var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp');

var CheckoutSchema = mongoose.Schema({
	location_id: {type: String},
    username: {type: String},
    products: [{type: String}],
    total: {type: Number},
    isActive: {
    	type: Boolean,
    	default: true
    }
});

CheckoutSchema.plugin(timestamps);
module.exports = mongoose.model('Checkout', CheckoutSchema);