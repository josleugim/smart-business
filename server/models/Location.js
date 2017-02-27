/**
 * Created by Mordekaiser on 06/06/16.
 */
"use strict";
var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp');

var LocationSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: 'user_id is required'
    },
    name: {
        type: String,
        required: 'Location name required'
    },
    description: {type: String},
    isActive: {
    	type: Boolean,
    	default: true
    }
});

LocationSchema.plugin(timestamps);
module.exports = mongoose.model('Location', LocationSchema);