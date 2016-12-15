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
    categoriesCtrl = require('../controllers/v1/categoriesCtrl'),
    jwt = require('../services/jwtValidation');

module.exports = function (app, config) {
	// api routes
    app.post('/api/v1/login', userCtrl.login);
    app.post('/api/v1/locations', jwt.validateToken, locationCtrl.post);
    app.get('/api/v1/locations', jwt.validateToken, locationCtrl.get);
    app.put('/api/v1/locations', jwt.validateToken, locationCtrl.put);
    app.post('/api/v1/brands', jwt.validateToken, brandCtrl.post);
    app.get('/api/v1/brands', jwt.validateToken, brandCtrl.get);
    app.put('/api/v1/brands', jwt.validateToken, brandCtrl.put);
    app.delete('/api/v1/brands', jwt.validateToken, brandCtrl.del);
    app.post('/api/v1/products', jwt.validateToken, upload.single('image'), productCtrl.post);
    app.get('/api/v1/products', jwt.validateToken, productCtrl.get);
    app.delete('/api/v1/products',jwt.validateToken, productCtrl.del);
    app.put('/api/v1/products', jwt.validateToken, upload.single('image'), productCtrl.put);
    app.get('/api/v1/products-count', productCtrl.count);
    app.post('/api/v1/sellers', jwt.validateToken, userCtrl.postSeller);
    app.get('/api/v1/sellers', jwt.validateToken, userCtrl.getSeller);
    app.put('/api/v1/sellers', jwt.validateToken, userCtrl.putSeller);
    app.delete('/api/v1/sellers', jwt.validateToken, userCtrl.delSeller);
    app.post('/api/v1/checkout', jwt.validateToken, checkoutCtrl.post);
    app.get('/api/v1/sales', jwt.validateToken, salesCtrl.get);
    app.post('/api/v1/categories', jwt.validateToken, categoriesCtrl.post);
    app.get('/api/v1/categories', jwt.validateToken, categoriesCtrl.get);
    app.put('/api/v1/categories', jwt.validateToken, categoriesCtrl.put);
    app.delete('/api/v1/categories', jwt.validateToken, categoriesCtrl.del);

    app.get('*', function (req, res) {
        res.sendFile(config.rootPath + 'public/index.html');
    })
};