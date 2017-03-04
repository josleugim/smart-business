/**
 * Created by Latin on 3/3/2017.
 */
'use strict';
const jwt = require('jsonwebtoken');

// get the location depending of the user role
exports.getLocationId = function (token, location_id) {
    if (!token) {
        if (location_id)
            return location_id;
    } else {
        var decoded = jwt.decode(token, {complete: true});
        if (decoded.payload) {
            return decoded.payload.location_id;
        }
    }

    return '';
};