"use strict";
var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp');

var ProductSchema = mongoose.Schema({
    location_id: {type: String},
    brand_id: {type: String},
    name: {
        type: String,
        required: 'Nombre requerido',
        unique: true
    },
    slug: {type: String},
    image: {type: String},
    price: {type: Number},
    description: {type: String},
    barcode: [{type: String}],
    isActive: {
    	type: Boolean,
    	default: true
    }
});

ProductSchema.plugin(timestamps);
module.exports = mongoose.model('Product', ProductSchema);