var jwt = require('jsonwebtoken'),
    config = require('../config/configuration');

exports.getUserId = function(token) {
	if(token) {
		var decoded = jwt.decode(token, {complete: true});

    	if(decoded.payload) {
        	return decoded.payload.user_id;
    	}
	}
};

exports.getLocationId = function(token) {
	if(token) {
		var decoded = jwt.decode(token, {complete: true});
		if (decoded.payload) {
			return decoded.payload.location_id;
		}
	}
};

exports.isOwner = function(token) {
	if(token) {
		var decoded = jwt.decode(token, {complete: true});
		if (decoded.payload) {
			if(decoded.payload.roles.indexOf('owner') === -1)
				return false;
			else
				return true;
		}
	}
};

exports.validateToken = function(req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		// verifies secret and checks exp
		// https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
		jwt.verify(token, config.development.tokenSecret, function(err, decoded) {
			if (err) {
				console.log(err);
				res.status(500).json({ success: false, message: 'Failed to authenticate token.' });
				res.end();
			} else {
				// if everything is good, save to request for use in other routes
				next();
			}
		});

	} else {
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});

	}
};