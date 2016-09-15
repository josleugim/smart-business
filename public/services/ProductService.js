"use strict";
angular.module('smartBusiness')
    .factory('ProductService', ['$q', '$http', '$location', 'AuthToken', ProductService]);

function ProductService($q, $http, $location, AuthToken) {
	var host = 'http://' + $location.host() + ':5000/';

	return {
    	post: post,
        get: get
    };

    function get(query) {
        var dfd = $q.defer();

        query.token = AuthToken.getToken()
        $http({
            method: 'GET',
            url: host + 'api/v1/products',
            params: query,
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
    }

    function post(data) {
    	var dfd = $q.defer();

    	$http({
    		method: 'POST',
    		url: host + 'api/v1/products',
    		params: {token: AuthToken.getToken()},
    		data: data,
    		headers: {
    			'Content-Type': 'application/json'
    		}
    	}).then(function successCallback(response) {
    		if(response.data.success) {
    			dfd.resolve(response.data);
    		}
    	}, function errorCallback(response) {
    		dfd.resolve(response.data);
    	});

    	return dfd.promise;
    }
}    