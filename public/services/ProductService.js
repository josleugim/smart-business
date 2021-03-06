"use strict";
angular.module('smartBusiness')
    .factory('ProductService', ['$q', '$http', '$location', 'AuthToken', ProductService]);

function ProductService($q, $http, $location, AuthToken) {
	var host = 'http://' + $location.host() + ':5000/';
    var user = AuthToken.getToken();

	return {
    	post: post,
        get: get,
        delProduct: delProduct,
        put: put,
        count: countProducts
    };

    function put(query, data) {
        var dfd = $q.defer();

        var fd = new FormData();
        for(var key in data) {
            fd.append(key, data[key]);
        }

        $http({
            method: 'PUT',
            url: host + 'api/v1/products',
            params: query,
            data: fd,
            transformRequest: angular.indentity,
            headers: {
                'Content-Type': undefined,
                'x-access-token': user.token
            }
        }).then(function successCallback(response) {
            dfd.resolve(response.data.success);
        }, function errorCallback(response) {
            dfd.resolve(false);
        });

        return dfd.promise;
    }

    function get(query) {
        var dfd = $q.defer();

        $http({
            method: 'GET',
            url: host + 'api/v1/products',
            params: query,
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': user.token
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

        var fd = new FormData();
        for(var key in data) {
            fd.append(key, data[key]);
        }

    	$http({
    		method: 'POST',
    		url: host + 'api/v1/products',
    		data: fd,
            transformRequest: angular.indentity,
            headers: {
                'Content-Type': undefined,
                'x-access-token': user.token
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

    function delProduct(query) {
        var dfd = $q.defer();
        
        //More information about the http service at: https://docs.angularjs.org/api/ng/service/$http
        $http({
            method: 'DELETE',
            url: host + 'api/v1/products',
            params: query,
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': user.token
            }
        }).then(function successCallback(response) {
            response.success = true;
            dfd.resolve(response);
        }, function errorCallback(response) {
            dfd.resolve(response);
        });

        return dfd.promise;
    }

    function countProducts(query) {
        var dfd = $q.defer();

        $http({
            method: 'GET',
            url: host + 'api/v1/products-count',
            params: query,
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': user.token
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
}    