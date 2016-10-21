var mongoose = require('mongoose'),
    Product = mongoose.model('Product'),
    Location = mongoose.model('Location'),
    Category = mongoose.model('Category'),
    Brand = mongoose.model('Brand'),
    jwtValidation = require('../../services/jwtValidation'),
    getSlug = require('speakingurl'),
    moment = require('moment');

exports.post = function(req, res) {
    console.log('POST Product');

    var data = {};
    if(req.query.token) {
        if(req.body.location_id)
            data.location_id = req.body.location_id;
        else
            data.location_id = jwtValidation.getLocationId(req.query.token);

        if(req.body.category_id)
            data.category_id = req.body.category_id;
        if(req.body.brand_id)
            data.brand_id = req.body.brand_id;
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
                res.status(500).json({success: false, error: err});
                res.end();
            } else {
               res.status(201).json({success: true});
               res.end();
            }
        })
    }
};

exports.get = function(req, res) {
    console.log('GET Product');
    
    if(req.query.token) {
        var query = {
            isActive: true
        };

        // get all the products depending of the location
        if(req.query.searchType == 'byLocation') {

            if(jwtValidation.getLocationId(req.query.token) != undefined)
                query.location_id = jwtValidation.getLocationId(req.query.token);
            else
                query.location_id = req.query.location_id;

            findProducts(query);

        } else if(req.query.searchType == 'byName') {
            console.log('Searching product by name....');
            if(req.query.name)
                query.name = {$regex: req.query.name, $options: 'i'};

            findProducts(query);
            // this condition returns just one product
        } else if(req.query.searchType == 'byBarcode') {
            console.log('Searching product by barcode...');
            query.barcode = req.query.barcode;

            findProducts(query);
        } else {
            query._id = req.query._id;
            findProducts(query)
        }

        function findProducts(query) {
            console.log(query);
            Product.find(query)
                .sort({createdAt: 1})
                .exec(function (err, products) {
                    if(err) {
                        console.log(err);
                        res.status(500).json({success: false});
                        res.end();
                    }
                    var objectProduct = [];
                    var waiting = products.length;

                    if(waiting > 0) {
                        products.forEach(function(values) {
                            // get the location name
                            Location.findOne({_id: values.location_id}, function(err, loc) {
                                if(loc) {
                                    // get the category
                                    Category.findOne({_id: values.category_id}, function (err, cat) {
                                        if(cat) {

                                            // get brand name
                                            Brand.findOne({_id: values.brand_id}, function (err, br) {
                                                if(br) {
                                                    var product = values.toObject();

                                                    delete product.isActive;
                                                    delete product.__v;
                                                    delete product.updatedAt;
                                                    if(product.soldOut)
                                                        product.soldOut = 'Vendido';
                                                    else
                                                        product.soldOut = 'No';
                                                    product.locationName = loc.name;
                                                    product.categoryName = cat.name;
                                                    product.brandName = br.name;
                                                    product.createdAt = moment(product.createdAt).locale('es').format("dddd, MMMM Do YYYY");
                                                    objectProduct.push(product);
                                                }
                                                if(err)
                                                    console.log(err);

                                                waiting--;

                                                if(waiting == 0) {
                                                    res.status(200).json(objectProduct);
                                                    res.end();
                                                }
                                            })
                                        }
                                        if(err)
                                            console.log(err);
                                    });
                                }
                                if(err)
                                    console.log(err);
                            });
                        });
                    } else {
                        res.status(404).json({message: 'No existen productos'});
                        res.end();
                    }
                });
        }


    } else {
        res.status(401).json({success: false});
        res.end();
    }
};

exports.del = function(req, res) {
    console.log('DELETE Product');

    if(req.query.token) {
        var data = {
            isActive: false
        };

        var query = {
            _id: req.query._id
        };

        Product.update(query, {$set: data}, function (err) {
            if (err) {
                console.log(err);
                res.status(500).json({success: false, error: err});
            } else {
                res.status(201).json({success: true});
                res.end();
            }
        });
    } else {
        res.status(401).json({success: false});
        res.end();
    }
};

exports.put = function (req, res) {
    console.log('PUT Product');
    if(req.query.token) {
        var query = {
            _id: req.query._id
        };
        console.log(req.body);
        var data = {};

        if(req.body.location_id)
            data.location_id = req.body.location_id;
        if(req.body.category_id)
            data.category_id = req.body.category_id;
        if(req.body.brand_id)
            data.brand_id = req.body.brand_id;
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

        console.log(data);

        Product.update(query, {$set: data}, function (err) {
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
    }
};