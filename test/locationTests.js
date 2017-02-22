/**
 * Created by Latin on 2/21/2017.
 */
'use strict';

var locationCRUD = require('../server/controllers/v1/locationsCtrl'),
    chai = require('chai'),
    should = chai.should(),
    expect = chai.expect();

describe('Location', function () {
    it('should save the information on the location collection', function () {
        var req = {
            name: 'Tienda de regalos Molango',
            description: 'Ubicada en Molango'
        };

        var location = locationCRUD.post(req);
        should.exist(location);
    })
});