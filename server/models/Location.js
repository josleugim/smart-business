/**
 * Created by Mordekaiser on 06/06/16.
 */
"use strict";
var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp');

var LocationSchema = mongoose.Schema({
    user_id: {type: String},
    name: {
        type: String,
        required: 'Nombre requerido'
    },
    description: {type: String}
});

LocationSchema.plugin(timestamps);
module.exports = mongoose.model('Location', LocationSchema);