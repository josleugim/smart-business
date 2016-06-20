/**
 * Created by Mordekaiser on 04/06/16.
 */
var userCtrl = require('../controllers/v1/usersCtrl');
module.exports = function (app, config, client) {
    var mqttCtrl = require('../controllers/v1/mqttCtrl')(client);
    app.post('/api/v1/login', userCtrl.post);
    app.post('/api/mqtt', mqttCtrl.post);
    app.get('*', function (req, res) {
        res.sendFile(config.rootPath + 'public/index.html');
    })
};