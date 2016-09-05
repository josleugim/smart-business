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
        else
            data.location_id = jwtValidation.getLocationId(req.query.token);

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
        if(req.body.sim)
            data.sim = req.body.sim;
        if(req.body.description)
            data.description = req.body.description;

        var product = new Product(data);
        product.save(function(err, collection) {
            if(err) {
                console.log(err);
                res.status(500).json({success: false});
                res.end();
            } else {
               res.status(201).json({success: true});
               res.end();
            }
        })
    }
}

exports.get = function(req, res) {
    console.log('GET Product');
    
    if(req.query.token) {
        var query = {
            isActive: true
        };
        
        query.location_id = jwtValidation.getLocationId(req.query.token);

        if(req.query.searchType == 'byName') {
            if(req.query.name)
                query.name = {$regex: req.query.name, $options: 'i'};
        }

        if(req.query.searchType == 'byBarcode') {
            query.barcode = req.query.barcode;
        }

        console.log(query);

        Product.find(query)
        .sort({name: 1})
        .exec(function (err, products) {
            if(err) {
                console.log(err);
                res.status(500).json({success: false});
                res.end();
            }

            console.log(products);
            var objectProduct = [];

            products.forEach(function(values) {
                var product = values.toObject();
                delete product.isActive;
                delete product.__v;
                delete product.createdAt;
                delete product.updatedAt;
                objectProduct.push(product);
            })
            if(req.query.searchType == 'byBarcode') {
                res.status(200).json(objectProduct[0]);
                res.end();
            } else {
                res.status(200).json(objectProduct);
                res.end();
            }
        });
    } else {
        res.status(500).json({success: false});
        res.end();
    }
}    