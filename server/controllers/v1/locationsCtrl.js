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

exports.put = function (req, res) {
	console.log('Location PUT');
	if(req.query.token) {
		var data = {};
		var query = {
			_id: req.query._id
		};

		if(req.body.name)
			data.name = req.body.name;
		if(req.body.description)
			data.description = req.body.description;

		Location.update(query, {$set: data}, function (err) {
			if (err) {
				console.log(err);
				res.status(401).json({success: false, error: err});
			} else {
				res.status(201).json({success: true});
				res.end();
			}
		});
	} else {
		res.status(401).json({success: false});
		res.end();
	};
};

exports.get = function (req, res) {
	var query = {
		user_id: jwtValidation.getUserId(req.query.token)
	};

	if(req.query.token) {
		if(req.query._id) {
			console.log('Location GET By _id');
			Location.findOne({_id: req.query._id}, function(err, doc) {
				if(doc) {
					delete doc.user_id;
					delete doc.__v;
					delete doc.createdAt;
					delete doc.updatedAt;

					res.status(200).json(doc);
					res.end();
                };
            });
		} else {
			console.log('Location GET');
			Location.find(query)
			.sort({name: 1})
			.exec(function (err, locations) {
				if(err) {
					res.status(500).json({success: false});
					res.end();
				}

				var objectLocation = [];

				locations.forEach(function(values) {
					var location = values.toObject();
					delete location.user_id;
					delete location.__v;
					delete location.createdAt;
					delete location.updatedAt;
					objectLocation.push(location);
				})

				res.status(200).json(objectLocation);
				res.end();
			});
		}
	} else {
		res.status(500).json({success: false});
		res.end();
	}
}