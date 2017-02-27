/**
 * Created by Latin on 2/21/2017.
 */
'use strict';

/*var should = require('should'),
    sinon = require('sinon');*/

var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon');

var mongoose = require('mongoose');
require('sinon-mongoose');

var Location = require('../server/models/Location');

chai.should();

describe('Location Controller Tests', function () {
    beforeEach(function () {

    });

    describe('POST', function () {
        it('should not allow empty location name', function () {
            var Location = function (location) {
                this.save = function () {

                }
            };
            var req = {
                body: {
                    description: 'Ubicada en Molango'
                },
                headers: {
                    'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJ1c2VyIiwib3duZXIiXSwidXNlcl9pZCI6IjU4OTRkMzg2MjRhMDMzMDNiNDg4NzUxZSIsImlhdCI6MTQ4Nzc4Njg2OX0.WAhuqLX11vtVgbI8CJd8Kr_Q_BOH5nh6sbDrpxH5VxA'
                }
            };

            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            };

            var locationCtrl = require('../server/controllers/v1/locationsCtrl')(Location);
            locationCtrl.post(req, res);
            res.status.calledWith(400).should.equal(true, 'Bad Status ' + res.status.args);
            res.send.calledWith('Location name is required').should.equal(true);
        });

        it('should be invalid if location name and user_id are empty', function (done) {
            var location = new Location({
                description: 'Ubicada en...',
                isActive: true
            });
            location.validate(function (err) {
                expect(err.errors.name).to.exist;
                expect(err.errors.user_id).to.exist;
                done();
            })
        })
    });

    describe('GET', function () {
        it('should return all locations', function (done) {
            var locationMock = sinon.mock(Location);
            var expectedResult = {status: true, objectLocation: []};
            locationMock.expects('find').yields(null, expectedResult);
            Location.find(function (err, result) {
                locationMock.verify();
                locationMock.restore();
                expect(result.status).to.be.true;
                done();
            })
        })
    });
});