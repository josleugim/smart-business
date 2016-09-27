var mongoose = require('mongoose'),
    Brand = mongoose.model('Brand'),
    jwtValidation = require('../../services/jwtValidation'),
    getSlug = require('speakingurl');

exports.post = function(req, res) {
	console.log('Brand POST');
	var data = {};

	if(req.body.name) {
		data.name = req.body.name;
		data.slug = getSlug(req.body.name, {lang: 'es'});
	}

	var brand = new Brand(data);
	brand.save(function(err, doc) {
		if(err) {
			res.status(500).json({success:false});
			res.end();
		} else {
			res.status(201).json({success: true});
        	res.end();
		}
	});
};

exports.put = function(req, res) {
	console.log('Brand PUT');

	if(req.query.token) {
		var data = {};
		var query = {
			_id: req.query._id
		};

		if(req.body.name)
			data.name = req.body.name;

		Brand.update(query, {$set: data}, function (err) {
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

exports.get = function(req, res) {
	if(req.query.token) {
		var query = {
			_id: req.query._id,
			isActive: true
		};

		if(req.query._id) {
			console.log('Brand GET by _id');
			Brand.findOne(query, function(err, doc) {
				if(doc) {
					delete doc.__v;
					delete doc.createdAt;
					delete doc.updatedAt;

					res.status(200).json(doc);
					res.end();
                };
            });
		} else {
			console.log('Brand GET');
			Brand.find({isActive: true})
			.sort({name: 1})
			.exec(function (err, brands) {
				if(err) {
					res.status(500).json({success: false});
					res.end();
				}

				var objectBrand = [];

				brands.forEach(function(values) {
					var brand = values.toObject();
					delete brand.__v;
					delete brand.createdAt;
					delete brand.updatedAt;
					objectBrand.push(brand);
				})

				res.status(200).json(objectBrand);
				res.end();
			});
		}
	} else {
		res.status(401).json({success: false});
		res.end();
	};
}

exports.del = function(req, res) {
	console.log('Brand DELETE');

	if(req.query.token) {
		var data = {
			isActive: false
		};

		var query = {
			_id: req.query._id
		};

		Brand.update(query, {$set: data}, function (err) {
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