/**
 * Created by Mordekaiser on 03/06/16.
 */
var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    development: {
        db: 'mongodb://localhost/smart-business-dev',
        rootPath: rootPath,
        port: process.env.PORT || 5000,
        sendgridApiKey: "",
        captchaSecret: "",
        tokenSecret: "fierro-pariente"

    },
    production: {
        db: 'mongodb://localhost/smart-business-prod',
        rootPath: rootPath,
        port: process.env.PORT || 5000,
        tokenSecret: "chelpfilove16"
    }
};