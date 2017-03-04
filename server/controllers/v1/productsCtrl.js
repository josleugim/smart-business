'use strict';

var mongoose = require('mongoose'),
    Product = mongoose.model('Product'),
    Location = mongoose.model('Location'),
    Category = mongoose.model('Category'),
    Brand = mongoose.model('Brand'),
    jwtValidation = require('../../services/jwtValidation'),
    getSlug = require('speakingurl'),
    moment = require('moment'),
    lodash = require('lodash'),
    Q = require('q');

exports.post = function(req, res) {
    console.log('POST Product');
    var token = req.headers['x-access-token'];

    var data = {};
    if(req.body.location_id)
        data.location_id = req.body.location_id;
    else
        data.location_id = jwtValidation.getLocationId(token);

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

    var nProducts = Number(req.body.count);

    var waitting = 0;
    if(nProducts > 0) {
        for(var i = 0; i < nProducts; i++) {

            var product = new Product(data);
            product.save(function(err, collection) {
                if(err)
                    console.log(err);
                if (collection)
                    console.log('Product created');
            });
            waitting++;
            console.log(waitting);
        }

        if(waitting == nProducts) {
            res.status(200).json({success: true});
            res.end();
        }
    } else {
        console.log('Just creating 1 product');
        var oneProduct = new Product(data);
        oneProduct.save(function(err, collection) {
            if(err) {
                console.log(err);
            } else {
                res.status(200).json({success: true});
                res.end();
            }
        })
    }
};

exports.get = function(req, res) {
    var token = req.headers['x-access-token'];

    var query = {
        isActive: true
    };

    // get all the products depending of the location
    if(req.query.searchType == 'byLocation') {
        if(jwtValidation.getLocationId(token) != undefined)
            query.location_id = jwtValidation.getLocationId(token);
        else
            query.location_id = req.query.location_id;

        if(req.query.lastId)
            query._id = {$gt: req.query.lastId};

        if(req.query.last_id)
            query._id = {$gt: req.query.last_id};

        if(req.query.category_id)
            query.category_id = req.query.category_id;

        if(req.query.name)
            query.name = {$regex: req.query.name, $options: 'i'};
        if(req.query.barcode)
            query.barcode = {$regex: req.query.barcode, $options: 'i'};

        findProducts(query);

    } else if(req.query.searchType == 'byName') {
        console.log('Searching product by name....');
        if(req.query.name) {
            query.name = {$regex: req.query.name, $options: 'i'};
            query._id = {$nin: req.query.products_id};
            query.location_id = jwtValidation.getLocationId(token);
        }
        findProducts(query);
        // this condition returns just one product
    } else if(req.query.searchType == 'byBarcode') {
        console.log('Searching product by barcode...');
        query.barcode = req.query.barcode;
        query.location_id = jwtValidation.getLocationId(token);
        query._id = {$nin: req.query.products_id};

        findProducts(query);
    } else {
        query._id = req.query._id;
        findProducts(query)
    }

    function findProducts(query) {
        Product.find(query)
            .sort({_id: 1})
            .limit(50)
            .exec(function (err, products) {
                if(err)
                    console.log(err);
                if(products.length >= 0 && products[0]) {
                    // get the total amount of the prices
                    var sum = lodash.reduce(products, function (sum, n) {
                        return sum + Number(n.price);
                    }, 0);
                    var inventory = [];

                    for(var i = 0; i < products.length; i++) {
                        var customProduct = {
                            _id: products[i]._id,
                            location_id: products[i].location_id,
                            category_id: products[i].category_id,
                            brand_id: products[i].brand_id,
                            name: products[i].name,
                            price: products[i].price,
                            description: products[i].description,
                            barcode: products[i].barcode,
                            sim: products[i].sim,
                            createdAt: moment(products[i].createdAt).locale('es').format('LL')
                        };
                        (function (productData, index) {
                            Q.all([
                                findLocation(productData)
                                    .then(findCategory(productData))
                                    .then(findBrand(productData))
                                    .then(function (productData) {
                                        inventory.push(productData);
                                    })
                                    .done(function () {
                                        if(index == Number(products.length -1)) {
                                            var objResponse = {
                                                total: sum,
                                                productCount: products.length,
                                                inventory: inventory
                                            };

                                            res.status(200).json(objResponse);
                                            res.end();
                                        }
                                    })
                            ]);
                        })(customProduct, i);

                    }
                } else {
                    res.status(404).json({success: false});
                    res.end();
                }
            });
    }

    function findLocation(productData) {
        var dfd = Q.defer();
        Location.findOne({_id: productData.location_id}, function (err, location) {
            if(err)
                console.log(err);
            if(location) {
                productData.locationName = location.name;
                dfd.resolve(productData);
            } else
                dfd.reject();
        });

        return dfd.promise;
    }

    function findCategory(productData) {
        var dfd = Q.defer();
        Category.findOne({_id: productData.category_id}, function (err, category) {
            if(err)
                console.log(err);
            if(category) {
                productData.categoryName = category.name;
                dfd.resolve(productData);
            } else
                dfd.reject();
        });

        return dfd.promise;
    }

    function findBrand(productData) {
        var dfd = Q.defer();
        Brand.findOne({_id: productData.brand_id}, function (err, brand) {
            if(err)
                console.log(err);
            if(brand) {
                productData.brandName = brand.name;
                dfd.resolve(productData);
            } else
                dfd.reject();
        });

        return dfd.promise;
    }
};

exports.del = function(req, res) {
    console.log('DELETE Product');

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
};

exports.put = function (req, res) {
    var query = {
        _id: req.query._id
    };

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

    Product.update(query, {$set: data}, function (err) {
        if (err) {
            console.log(err);
            res.status(401).json({success: false, error: err});
        } else {
            res.status(201).json({success: true});
            res.end();
        }
    });
};

exports.count = function (req, res) {
    Product.count({isActive: true}, function (err, docs) {
        if(err) {
            console.log(err);
            res.status(500).json({success: false});
            res.end();
        }

        if(docs) {
            var totalPage = Math.round((docs + 50 - 1) / 50);
            res.status(200).json(totalPage);
            res.end();
        }
    })
};