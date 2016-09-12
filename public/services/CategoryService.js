"use strict";
angular.module('smartBusiness')
    .factory('CategoryService', ['$q', '$http', '$location', 'AuthToken', CategoryService]);

function CategoryService($q, $http, $location, AuthToken) {
	var host = 'http://' + $location.host() + ':5000/';

	return {
		get: get,
		post: post
	};

	function get() {
		var dfd = $q.defer();
        $http({
            method: 'GET',
            url: host + 'api/v1/categories',
            params: {token: AuthToken.getToken()},
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {
            if(response.data) {
                dfd.resolve(response.data);
            }
        }, function errorCallback() {
            dfd.resolve(false);
        });

        return dfd.promise;
	};

	function post(data) {
		var dfd = $q.defer();
        $http({
            method: 'POST',
            url: host + 'api/v1/categories',
            params: {token: AuthToken.getToken()},
            data: data,
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