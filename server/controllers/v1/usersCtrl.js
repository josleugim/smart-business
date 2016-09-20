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
    User.findOne({email: query.email}, function (err, user) {
        if(err) {
            console.log('Error finding user, error: ' + err);
            res.status(401).json({ success: false });
        }
        if(!user) res.status(401).json({ success: false });
        else if(query.hashed_pwd) {
            if(encrypt.hashPwd(user.salt, query.hashed_pwd) === user.hashed_pwd) {
                var token = jwt.sign({roles: user.roles, user_id: user._id, location_id: user.location_id}, config.development.tokenSecret);

                /*var objectUser = user.toObject();
                delete objectUser.hashed_pwd;
                delete objectUser.salt;
                delete objectUser.__v;
                delete objectUser.createdAt;
                delete objectUser.updatedAt;
                objectUser.token = token;*/
                
                res.status(200).json({
                    token: token,
                    success: true
                })
            } else res.status(401).json({ success: false });
        } else res.status(401).json({ success: false });
    })
};

exports.getSeller = function(req, res) {
    if(req.query.token) {
        if(req.query._id) {
            console.log('Seller GET by _id');
            var query = {
                roles: {
                    $ne: 'owner'
                },
                _id: req.query._id
            };
            
            User.findOne(query, function(err, doc) {
                if(doc) {
                    delete doc.__v;
                    delete doc.createdAt;
                    delete doc.updatedAt;
                    delete doc.roles;
                    delete doc.hashed_pwd;
                    delete doc.salt;
                    delete doc.isActive;

                    res.status(200).json(doc);
                    res.end();
                };
            });
        } else {
            console.log('GET Seller');
            var query = {
                roles: {
                    $ne: 'owner'
                }
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
                            Location.findOne({_id: values.location_id}, function(err, location) {
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
    } else {
        res.status(401).json({success: false});
        res.end();
    }
};

exports.postSeller = function(req, res) {
    console.log('POST Seller');

    var roles = [];
    var salt, hash;

    if(req.query.token) {
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
    }
}