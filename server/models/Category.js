"use strict";
var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp');

var CategorySchema = mongoose.Schema({
    name: {
    	type: String,
    	required: 'Category name required',
    	unique: true
    },
    slug: {type: String},
    description: {type: String},
    isActive: {
    	type: Boolean,
    	default: true
    }
});

CategorySchema.plugin(timestamps);
module.exports = mongoose.model('Category', CategorySchema);