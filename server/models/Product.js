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
        unique: false
    },
    sim: {
        type: String,
        unique: false
    },
    isActive: {
    	type: Boolean,
    	default: true
    },
    soldOut: {
        type: Boolean,
        default: false
    }
});

ProductSchema.plugin(timestamps);
module.exports = mongoose.model('Product', ProductSchema);