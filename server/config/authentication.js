/**
 * Created by Latin on 2/21/2017.
 */
"use strict";
var jwt = require('jsonwebtoken'),
    config = require('./configuration'),
    jwtValidate = require('../services/jwtValidation');

exports.requiresRole = function (role) {
    return function (req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        var userRole = jwtValidate.getUserRol(token);
        var auth = false;

        userRole.forEach(function (usrRole) {
            if(role.indexOf(usrRole) !== -1)
                auth = true;
        });

        if(!auth) {
            res.status(403);
            res.end();
        } else {
            next();
        }
    }
};