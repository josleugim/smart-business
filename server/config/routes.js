/**
 * Created by Mordekaiser on 04/06/16.
 */
var userCtrl = require('../controllers/v1/usersCtrl'),
	locationCtrl = require('../controllers/v1/locationsCtrl'),
	brandCtrl = require('../controllers/v1/brandsCtrl'),
    productCtrl = require('../controllers/v1/productsCtrl'),
    multer = require('multer'),
    upload = multer({dest: 'public/assets/products/'}),
    checkoutCtrl = require('../controllers/v1/checkoutCtrl'),
    salesCtrl = require('../controllers/v1/salesCtrl'),
    categoriesCtrl = require('../controllers/v1/categoriesCtrl');

module.exports = function (app, config, client) {
	// api routes
    var mqttCtrl = require('../controllers/v1/mqttCtrl')(client);
    app.post('/api/v1/login', userCtrl.login);
    app.post('/api/v1/locations', locationCtrl.post);
    app.get('/api/v1/locations', locationCtrl.get);
    app.post('/api/v1/brands', brandCtrl.post);
    app.get('/api/v1/brands', brandCtrl.get);
    app.post('/api/v1/products', upload.single('image'), productCtrl.post);
    app.get('/api/v1/products', productCtrl.get);
    app.post('/api/v1/sellers', userCtrl.postSeller);
    app.post('/api/v1/checkout', checkoutCtrl.post);
    app.get('/api/v1/sales', salesCtrl.get);
    app.post('/api/v1/categories', categoriesCtrl.post);
    app.get('/api/v1/categories', categoriesCtrl.get);

    app.get('*', function (req, res) {
        res.sendFile(config.rootPath + 'public/index.html');
    })
};