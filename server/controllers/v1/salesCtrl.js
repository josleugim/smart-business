var mongoose = require('mongoose'),
    Checkout = mongoose.model('Checkout'),
    Product = mongoose.model('Product'),
    jwtValidation = require('../../services/jwtValidation'),
    moment = require('moment');

exports.get = function (req, res) {
	console.log('GET Sales');
	var query = {};

	if(req.query.token) {
		//query.location_id = jwtValidation.getLocationId(req.query.token);

		if(req.query.from)
		    query.createdAt = {'$gte': req.query.from};

		Checkout.find(query)
        .sort({createdAt: 1})
        .exec(function (err, docs) {
            if(err) {
                res.status(500).json({success: false});
                res.end();
            }

            var waiting = docs.length;
            var objectCheckout = [];

            if(waiting > 0) {
                // loop the checkout documents
                docs.forEach(function(values) {

                    var doc = values.toObject();
                    delete doc.isActive;
                    delete doc.__v;
                    delete doc.updatedAt;
                    doc.product = [];
                    doc.createdAt = moment(doc.createdAt).locale('es').format("dddd, MMMM Do YYYY");

                    var waitingProducts = values.products.length;

                    //loop the products to find its data
                    if(waitingProducts > 0) {
                        values.products.forEach(function (prod) {

                            Product.findOne({_id: prod}, function (err, collection) {
                                if(collection) {
                                    var data = {
                                        product_id: collection._id,
                                        productName: collection.name,
                                        productPrice: collection.price,
                                        productBarcode: collection.barcode,
                                        productSim: collection.sim
                                    };
                                    doc.product.push(data);
                                } else {
                                    var dataError = {
                                        productName: 'Producto no encontrado'
                                    };

                                    doc.product.push(dataError);
                                    console.log('Producto no encontrado');
                                }

                                waitingProducts--;
                                if(waitingProducts == 0) {
                                    objectCheckout.push(doc);
                                    waiting--;
                                }

                                if(waiting == 0) {
                                    res.status(200).json(objectCheckout);
                                    res.end();
                                }
                            });
                        })
                    }
                });
            }
        });
	}
};