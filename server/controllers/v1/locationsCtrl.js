/**
 * Created by Mordekaiser on 06/06/16.
 */
var mongoose = require('mongoose'),
    Location = mongoose.model('Location'),
    jwtValidation = require('../../services/jwtValidation');

exports.post = function (req, res) {
	console.log('Location POST');
	var data = {};

	if(req.query.token) {
		data.user_id = jwtValidation.getUserId(req.query.token);
		if(req.body.name)
			data.name = req.body.name;
		if(req.body.description)
			data.description = req.body.description;

		var location = new Location(data);
		location.save(function(err, doc) {
			if(err) {
				res.status(500).json({success:false});
				res.end();
			}

			res.status(201).json({success: true});
        	res.end();
		});
	} else {
		res.status(500).json({success:false});
	}
};