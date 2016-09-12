"use strict";
var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp');

var ProductSchema = mongoose.Schema({
    location_id: {type: String},
    brand_id: {type: String},
    category_id: {type: String},
    name: {
        type: String,
        required: 'Product name required'
    },
    slug: {type: String},
    image: {type: String},
    price: {
        type: Number,
        required: 'Price required'
    },
    description: {type: String},
    barcode: {
        type: String,
        required: 'Barcode required',
        unique: true
    },
    sim: {type: String},
    isActive: {
    	type: Boolean,
    	default: true
    }
});

ProductSchema.plugin(timestamps);
module.exports = mongoose.model('Product', ProductSchema);