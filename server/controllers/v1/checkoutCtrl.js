var mongoose = require('mongoose'),
    Checkout = mongoose.model('Checkout'),
    Product = mongoose.model('Product'),
    jwtValidation = require('../../services/jwtValidation'),
    User = mongoose.model('User');

exports.post = function(req, res) {
	console.log('POST Checkout');
	var token = req.headers['x-access-token'];

	var data = {};
	data.location_id = jwtValidation.getLocationId(token);

	if(req.body.products)
		data.products = req.body.products;
	if(req.body.total)
		data.total = req.body.total;

	User.findOne({_id: jwtValidation.getUserId(token)}, function (err, user) {
		if(err) {
			console.log(err);
			res.status(500).json({success: false, error: err});
			res.end();
		}
		if(user) {
			data.username = user.name;
			var checkout = new Checkout(data);
			checkout.save(function(err, doc) {
				if(err) {
					res.status(500).json({success:false, error: err});
					res.end();
				} else {
					deleteProducts(data.products);
					res.status(201).json({success: true});
					res.end();
				}
			});
		}
	});

	function deleteProducts(products) {
		products.forEach(function(item) {
			var query = {
				_id: item._id
			};

			var data = {
				isActive: false,
				soldOut: true
			};

			Product.update(query, data, function (err, numAffected) {
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
};