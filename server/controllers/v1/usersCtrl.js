/**
 * Created by Mordekaiser on 06/06/16.
 */
var jwt = require('jsonwebtoken'),
    encrypt = require('../../utilities/encryption'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    config = require('../../config/configuration');

exports.post = function (req, res) {
    console.log('POST User login');
    var query = {
        email: req.query.email,
        hashed_pwd: req.query.password
    };
    console.log(req.query.email);
    User.findOne({email: query.email}, function (err, user) {
        if(err) {
            console.log('Error finding user, error: ' + err);
            res.status(401).json({ success: false });
        }
        if(!user) res.status(401).json({ success: false })
        else if(query.hashed_pwd) {
            if(encrypt.hashPwd(user.salt, query.hashed_pwd) === user.hashed_pwd) {
                console.log(config.development.tokenSecret);
                var token = jwt.sign({roles: user.roles}, config.development.tokenSecret);

                res.status(200).json({
                    token: token,
                    success: true
                })
            } else res.status(401).json({ success: false });
        } else res.status(401).json({ success: false });
    })
};