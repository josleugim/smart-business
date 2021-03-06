/**
 * Created by Mordekaiser on 06/06/16.
 */
var jwt = require('jsonwebtoken'),
    encrypt = require('../../utilities/encryption'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Location = mongoose.model('Location'),
    config = require('../../config/configuration');

exports.login = function (req, res) {
    console.log('POST User login');
    var query = {
        email: req.query.email,
        hashed_pwd: req.query.password
    };
    User.findOne({email: query.email, isActive: true}, function (err, user) {
        if(err)
            console.log('Error finding user, error: ' + err);
        if(!user) res.status(401).json({ success: false, message: 'Usuario inválido!!!' });
        else if(query.hashed_pwd) {
            if(encrypt.hashPwd(user.salt, query.hashed_pwd) === user.hashed_pwd) {
                var token = jwt.sign({roles: user.roles, user_id: user._id, location_id: user.location_id}, config.development.tokenSecret);

                var objectUser = user.toObject();
                delete objectUser.hashed_pwd;
                delete objectUser.salt;
                delete objectUser.__v;
                delete objectUser.createdAt;
                delete objectUser.updatedAt;
                delete objectUser.isActive;
                delete objectUser.email;
                objectUser.token = token;
                objectUser.success = true;
                
                res.status(200).json(objectUser);
            } else res.status(401).json({ success: false });
        } else res.status(401).json({ success: false });
    })
};

exports.getSeller = function(req, res) {
    var query = {};
    if(req.query._id) {
        console.log('Seller GET by _id');
        query = {
            roles: {
                $ne: 'owner'
            },
            _id: req.query._id,
            isActive: true
        };

        var objectSellers = [];

        User.findOne(query, function(usrErr, doc) {
            if(doc) {
                Location.findOne({_id: doc.location_id}, function(err, loc) {
                    if(loc) {
                        var document = {
                            _id: doc._id,
                            location_id: loc._id,
                            location: loc.name,
                            name: doc.name,
                            email: doc.email
                        };

                        objectSellers.push(document);

                        res.status(200).json(objectSellers[0]);
                        res.end();
                    } else {
                        res.status(500).json({error: err});
                        res.end()
                    }
                });
            } else {
                res.status(500).json({error: usrErr});
                res.end()
            }
        });
    } else {
        console.log('GET Seller');
        query = {
            roles: {
                $ne: 'owner'
            },
            isActive: true
        };

        User.find(query)
            .sort({name: -1})
            .limit(10)
            .exec(function (err, users) {
                if(err) {
                    console.log('Error at GET method: ' + err);
                    res.status(500).json({error: err});
                    res.end()
                } else {
                    var objectSellers = [];
                    // wait for the construction of the new object, before sending the response
                    var waiting = users.length;

                    if(waiting > 0) {

                        users.forEach(function(values) {
                            Location.findOne({_id: values.location_id}, function(locErr, location) {
                                if(location) {
                                    var document = {
                                        _id: values._id,
                                        location: location.name,
                                        name: values.name,
                                        email: values.email
                                    };
                                    objectSellers.push(document);
                                };

                                waiting--;

                                if(waiting == 0) {
                                    res.status(200).json(objectSellers);
                                    res.end();
                                }
                            });
                        });
                    } else {
                        res.status(200).json(objectSellers);
                        res.end();
                    }
                }
            });
    }
};

exports.postSeller = function(req, res) {
    console.log('POST Seller');

    var roles = [];
    var salt, hash;

    var data = {
        name: req.body.name,
        email: req.body.email,
        location_id: req.body.location_id
    };

    roles.push('user');
    roles.push('seller');
    data.roles = roles;

    if(req.body.password) {
        salt = encrypt.createSalt();
        hash = encrypt.hashPwd(salt, req.body.password);
        data.salt = salt;
        data.hashed_pwd = hash;
    }

    var user = new User(data);
    user.save(function(err, collection) {
        if(err) {
            console.log(err);
            res.status(500).json({success: false});
            res.end();
        } else {
            res.status(201).json({success: true});
            res.end();
        }
    })
};

exports.putSeller = function(req, res) {
    console.log('Seller PUT');
    var salt, hash;
    var data = {};
    var query = {
        roles: {
            $ne: 'owner'
        },
        _id: req.query._id
    };

    if(req.body.name)
        data.name = req.body.name;
    if(req.body.email)
        data.email = req.body.email;
    if(req.body.location_id)
        data.location_id = req.body.location_id;
    if(req.body.password) {
        salt = encrypt.createSalt();
        hash = encrypt.hashPwd(salt, req.body.password);
        data.salt = salt;
        data.hashed_pwd = hash;
    }

    User.update(query, {$set: data}, function (err) {
        if (err) {
            console.log(err);
            res.status(401).json({success: false, error: err});
        } else {
            res.status(201).json({success: true});
            res.end();
        }
    });
};

exports.delSeller = function(req, res) {
    console.log('Seller DELETE');

    var data = {
        isActive: false
    };

    var query = {
        roles: {
            $ne: 'owner'
        },
        _id: req.query._id
    };

    User.update(query, {$set: data}, function (err) {
        if (err) {
            console.log(err);
            res.status(401).json({success: false, error: err});
        } else {
            res.status(201).json({success: true});
            res.end();
        }
    });
};