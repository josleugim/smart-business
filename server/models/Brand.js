"use strict";
var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp');

var BrandSchema = mongoose.Schema({
    name: {
        type: String,
        required: 'Nombre requerido'
    },
    slug: {type: String},
    isActive: {
    	type: Boolean,
    	default: true
    }
});

BrandSchema.plugin(timestamps);
module.exports = mongoose.model('Brand', BrandSchema);