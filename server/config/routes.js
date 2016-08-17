/**
 * Created by Mordekaiser on 04/06/16.
 */
var userCtrl = require('../controllers/v1/usersCtrl'),
	locationCtrl = require('../controllers/v1/locationsCtrl'),
	brandCtrl = require('../controllers/v1/brandsCtrl');

module.exports = function (app, config) {
	// api routes
    app.post('/api/v1/login', userCtrl.login);
    app.post('/api/v1/locations', locationCtrl.post);
    app.get('/api/v1/locations', locationCtrl.get);
    app.post('/api/v1/brands', brandCtrl.post);
    app.get('/api/v1/brands', brandCtrl.get);

    app.get('*', function (req, res) {
        res.sendFile(config.rootPath + 'public/index.html');
    })
};