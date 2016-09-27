"use strict";
angular.module('smartBusiness')
    .factory('BrandService', ['$q', '$http', '$location', 'AuthToken', BrandService]);

function BrandService($q, $http, $location, AuthToken) {
	var host = 'http://' + $location.host() + ':5000/';

	return {
		post: post,
        get: get,
        getById: getById,
        put: put,
        delBrand: delBrand
	};

    function getById(query) {
        var dfd = $q.defer();
        
        query.token = AuthToken.getToken();

        $http({
            method: 'GET',
            url: host + 'api/v1/brands',
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
    };

    function get() {
        var dfd = $q.defer();
        $http({
            method: 'GET',
            url: host + 'api/v1/brands',
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

    function put(query, data) {
        var dfd = $q.defer();
        query.token = AuthToken.getToken();
        
        $http({
            method: 'PUT',
            url: host + 'api/v1/brands',
            params: query,
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
    };

	function post(data) {
		var dfd = $q.defer();
        $http({
            method: 'POST',
            url: host + 'api/v1/brands',
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
	};

    function delBrand(query) {
        var dfd = $q.defer();

        query.token = AuthToken.getToken();
        
        //More information about the http service at: https://docs.angularjs.org/api/ng/service/$http
        $http({
            method: 'DELETE',
            url: host + 'api/v1/brands',
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