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

        var nSkip = 0;

        if(req.query.lastId)
            query._id = {$gt: req.query.lastId};

        /*if(req.query.prevId)
            query._id = {$lt: req.query.prevId};

        if(req.query.currentPage)
            nSkip = 50 * (req.query.currentPage - 1);*/

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

    Q.fcall(searchProducts)
        .then(function (products) {
            var dfd = Q.defer();
            for(var i = 0; i < products.length; i++) {
                console.log(i);
                Q.fcall(getLocationName(products[i]))
                    .then(function (locationName) {
                        console.log(locationName);
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                    .done(function () {
                        console.log('async location ended');
                    });
                if(i == products.length -1)
                    dfd.resolve();
            }

            return dfd.promise;
        })
        .catch(function (error) {
            console.log(error);
        })
        .done(function () {
            console.log('done');
            //res.end();
        });

    function searchProducts(query) {
        var dfd = Q.defer();
        Product.find(query)
            .sort({createdAt: 1})
            .limit(50)
            .exec(function (err, products) {
                if(err)
                    console.log(err);
                if(products.length > 0) {
                    dfd.resolve(products);
                } else
                    dfd.reject();
            });

        return dfd.promise;
    }

    function getLocationName(product) {
        var dfd = Q.defer();
        var query = {
            _id: product.location_id
        };
        Location.findOne(query, function (err, location) {
            if(err)
                console.log(err);
            if(location) {
                console.log(location.name);
                dfd.resolve(location.name);
            }
            else
                dfd.reject();
        });

        return dfd.promise;
    }

    function findProducts(query) {
        Product.find(query)
            .sort({createdAt: 1})
            .limit(50)
            .exec(function (err, products) {
                if(err) {
                    console.log(err);
                    res.status(500).json({success: false});
                    res.end();
                }
                if(products) {
                    // get the total amount of the prices
                    var sum = lodash.reduce(products, function (sum, n) {
                        return sum + Number(n.price);
                    }, 0);

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
                                                    var objRes = {
                                                        total: sum,
                                                        count: products.length,
                                                        objectProduct: objectProduct
                                                    };

                                                    res.status(200).json(objRes);
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
                }
            });
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
    console.log('PUT Product');
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