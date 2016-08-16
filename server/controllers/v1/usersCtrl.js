/**
 * Created by Mordekaiser on 06/06/16.
 */
var jwt = require('jsonwebtoken'),
    encrypt = require('../../utilities/encryption'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
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
                var token = jwt.sign({roles: user.roles, user_id: user._id}, config.development.tokenSecret);

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