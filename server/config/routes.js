/**
 * Created by Mordekaiser on 04/06/16.
 */
var userCtrl = require('../controllers/v1/usersCtrl');
module.exports = function (app, config) {
    app.post('/api/v1/login', userCtrl.post);
    app.get('*', function (req, res) {
        res.sendFile(config.rootPath + 'public/index.html');
    })
};