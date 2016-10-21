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

		if(req.query.from && req.query.to) {

		    // how to correct compare dates
            // increment one day in the lesser than date, so it finds records
		    //http://stackoverflow.com/questions/15347589/moment-js-format-date-in-a-specific-timezone
            // http://stackoverflow.com/questions/3674539/incrementing-a-date-in-javascript
            // http://stackoverflow.com/questions/8835757/return-query-based-on-date
            query.createdAt = {$gte: moment(req.query.from).utcOffset(60).format('YYYY-MM-DD'), $lt: moment(req.query.to).add(1, 'day').utcOffset(60).format('YYYY-MM-DD')};
        }

        //console.log(query);
		Checkout.find(query)
        .sort({createdAt: 1})
        .exec(function (err, docs) {
            if(err) {
                console.log(err);
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
                    doc.createdAt = moment(doc.createdAt).locale('es').format('YYYY-MM-DD');

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
            } else {
                res.status(404).json({success: false});
                res.end();
            }
        });
	}
};