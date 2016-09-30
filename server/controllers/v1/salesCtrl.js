var mongoose = require('mongoose'),
    Checkout = mongoose.model('Checkout'),
    jwtValidation = require('../../services/jwtValidation'),
    getSlug = require('speakingurl');

exports.get = function (req, res) {
	console.log('GET Sales');
	var query = {};

	if(req.query.token) {
		//query.location_id = jwtValidation.getLocationId(req.query.token);

		if(req.query.from)
		    query.createdAt = {'$gte': req.query.from};

		console.log(query);

		Checkout.find(query)
        .sort({createdAt: 1})
        .exec(function (err, docs) {
            if(err) {
                res.status(500).json({success: false});
                res.end();
            }

            var objectCheckout = [];

            docs.forEach(function(values) {
                var doc = values.toObject();
                delete doc.isActive;
                delete doc.__v;
                delete doc.createdAt;
                delete doc.updatedAt;
                objectCheckout.push(doc);
            });

            res.status(200).json(objectCheckout);
            res.end();
        });
	}
}