var mongoose = require('mongoose'),
    Product = mongoose.model('Product'),
    jwtValidation = require('../../services/jwtValidation'),
    getSlug = require('speakingurl');

    exports.post = function(req, res) {
    	console.log('POST Product');

    	var data = {};
    	if(req.query.token) {

    		if(req.body.location_id)
    			data.location_id = req.body.location_id
    		if(req.body.brand_id)
    			data.brand_id = req.body.brand_id
    		if(req.body.name) {
    			data.name = req.body.name;
    			data.slug = getSlug(req.body.name, {lang: 'es'});
    		}
    		if(req.file)
    			data.image = req.file.filename;
    		if(req.body.price)
    			data.price = req.body.price;
    		if(req.body.barcode)
    			data.barcode = req.body.barcode;
			if(req.body.description)
				data.description = req.body.description;

			console.log(data);

			var product = new Product(data);
			product.save(function(err, collection) {
				if(err) {
					res.status(500).json({success: false});
					res.end();
				} else {
					res.status(201).json({success: true});
					res.end();
				}
			})
    	}
    }