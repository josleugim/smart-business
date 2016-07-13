/**
 * Created by Mordekaiser on 04/06/16.
 */
var userCtrl = require('../controllers/v1/usersCtrl'),
	locationCtrl = require('../controllers/v1/locationsCtrl');
module.exports = function (app, config) {
	// api routes
    app.post('/api/v1/login', userCtrl.login);
    app.post('/api/v1/locations', locationCtrl.post);

    app.get('*', function (req, res) {
        res.sendFile(config.rootPath + 'public/index.html');
    })
};