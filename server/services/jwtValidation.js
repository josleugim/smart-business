var jwt = require('jsonwebtoken');

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