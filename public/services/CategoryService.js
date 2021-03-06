"use strict";
angular.module('smartBusiness')
    .factory('CategoryService', ['$q', '$http', '$location', 'AuthToken', CategoryService]);

function CategoryService($q, $http, $location, AuthToken) {
	var host = 'http://' + $location.host() + ':5000/';
    var user = AuthToken.getToken();

	return {
		get: get,
		post: post,
        getById: getById,
        put: put,
        delCategory: delCategory
	};

    function delCategory(query) {
        var dfd = $q.defer();
        
        //More information about the http service at: https://docs.angularjs.org/api/ng/service/$http
        $http({
            method: 'DELETE',
            url: host + 'api/v1/categories',
            params: query,
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': user.token
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

    function put(query, data) {
        var dfd = $q.defer();
        
        $http({
            method: 'PUT',
            url: host + 'api/v1/categories',
            params: query,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': user.token
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

    function getById(query) {
        var dfd = $q.defer();

        $http({
            method: 'GET',
            url: host + 'api/v1/categories',
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

	function get() {
		var dfd = $q.defer();
        $http({
            method: 'GET',
            url: host + 'api/v1/categories',
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
        $http({
            method: 'POST',
            url: host + 'api/v1/categories',
            data: data,
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': user.token
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