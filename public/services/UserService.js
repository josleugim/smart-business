/**
 * Created by Mordekaiser on 06/06/16.
 */
"use strict";
angular.module('smartBusiness')
.factory('UserService', ['$q', '$http', '$location', UserService]);

function UserService($q, $http, $location) {
    var host = 'http://' + $location.host() + ':5000/';
    return {
        post: loginUser
    };

    function loginUser(query) {
        var dfd = $q.defer();
        $http({
            method: 'POST',
            url: host + 'api/v1/login',
            params: query,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {
            if(response.data.success) {
                dfd.resolve(true);
            }
        }, function errorCallback(response) {
            dfd.resolve(false);
        });

        return dfd.promise;
    }
}