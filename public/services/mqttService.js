/**
 * Created by Mordekaiser on 20/06/16.
 */
"use strict";
angular.module('smartBusiness')
    .factory('mqttService', ['$q', '$http', '$location', mqttService]);

function mqttService($q, $http, $location) {
    var host = 'http://' + $location.host() + ':5000/';
    return {
        post: postMqtt
    };

    function postMqtt(query) {
        var dfd = $q.defer();
        $http({
            method: 'POST',
            url: host + 'api/mqtt',
            params: query,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {
            if(response.data.success) {
                dfd.resolve(true);
            }
        }, function errorCallback() {
            dfd.resolve(false);
        });

        return dfd.promise;
    }
}