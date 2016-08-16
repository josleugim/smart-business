var jwt = require('jsonwebtoken'),
	jwtSecret = require('../config/configuration');

exports.getUserId = function(token) {
	if(token) {
		var decoded = jwt.decode(token, {complete: true});

    	if(decoded.payload) {
        	return decoded.payload.user_id;
    	}
	}
}	