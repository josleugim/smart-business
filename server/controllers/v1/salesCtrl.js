var mongoose = require('mongoose'),
    Checkout = mongoose.model('Checkout'),
    Product = mongoose.model('Product'),
    jwtValidation = require('../../services/jwtValidation'),
    moment = require('moment'),
    _ = require('lodash'),
    locationHelpers = require('../../services/locationHelpers');

exports.get = function (req, res) {
	var query = {};
    var token = req.headers['x-access-token'];

    query.location_id = locationHelpers.getLocationId(token, req.query.location_id);

    if(req.query.from && req.query.to) {
        // how to correct compare dates
        // increment one day in the lesser than date, so it finds records
        //http://stackoverflow.com/questions/15347589/moment-js-format-date-in-a-specific-timezone
        // http://stackoverflow.com/questions/3674539/incrementing-a-date-in-javascript
        // http://stackoverflow.com/questions/8835757/return-query-based-on-date
        var from = moment(req.query.from).utcOffset(60).format('YYYY-MM-DD');
        var to = moment(req.query.to).add(1, 'day').utcOffset(60).format('YYYY-MM-DD');

        query.createdAt = {$gte: from, $lt: to};
    }

    console.log(query);
    Checkout.find(query)
        .sort({createdAt: 1})
        .exec(function (err, docs) {
            if(err) {
                console.log(err);
                res.status(500).json({success: false});
                res.end();
            }
            var waiting = docs.length;
            var resObj = {
                sales: [],
                total: 0
            };

            if(waiting > 0) {
                // loop the checkout documents
                docs.forEach(function(values) {
                    var docObj = {
                        createdAt: moment(values.createdAt).utcOffset(60).format('LL'),
                        userName: values.username,
                        products: []
                    };

                    var prodQuery = {
                        _id: {$in: values.products}
                    };
                    Product.find(prodQuery)
                        .sort({name: 1})
                        .exec(function (err, products) {
                            var totalCheck = _.reduce(products, function(sum, n) {
                                return sum + n.price;
                            }, 0);
                            resObj.total = resObj.total + totalCheck;
                            docObj.products.push.apply(docObj.products, products);

                            // push the sale with all their fields
                            resObj.sales.push(docObj);

                            waiting--;

                            if(waiting == 0) {
                                res.status(200).json(resObj);
                                res.end();
                            }

                        });
                });
            } else {
                res.status(404).json({success: false});
                res.end();
            }
        });
};