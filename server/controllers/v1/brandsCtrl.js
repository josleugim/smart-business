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

exports.get = function(req, res) {
	console.log('Brand GET');
	var query = {};
	Brand.find(query)
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
		})
}