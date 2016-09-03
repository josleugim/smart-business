var mongoose = require('mongoose'),
    Checkout = mongoose.model('Checkout'),
    Product = mongoose.model('Product')
    jwtValidation = require('../../services/jwtValidation');

exports.post = function(req, res) {
	console.log('POST Checkout');

	if(req.query.token) {
		var data = {};
		data.location_id = jwtValidation.getLocationId(req.query.token);

		if(req.body.products)
			data.products = req.body.products;
		if(req.body.total)
			data.total = req.body.total;

		var checkout = new Checkout(data);
		checkout.save(function(err, doc) {
			if(err) {
				res.status(500).json({success:false});
				res.end();
			} else {
				deleteProducts(data.products);
				res.status(201).json({success: true});
				res.end();
			}
		});
	} else {
		res.status(403).json({success: false});
		res.end();
	}

	function deleteProducts(products) {
		products.forEach(function(item) {
			var query = {
				_id: item._id
			};

			Product.update(query, {isActive: false}, function (err, numAffected) {
				if (err) {
					console.log(err);
				}

				if(numAffected.nModified > 0) {
					console.log('Productos dados de baja');
				} else {
					console.log('Los productos no se dieron de baja');
				}
			});
		});
	}
}