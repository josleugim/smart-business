"use strict";
angular.module('smartBusiness')
    .factory('LocationService', ['$q', '$http', '$location', 'AuthToken', LocationService]);

    function LocationService($q, $http, $location, AuthToken) {
    	var host = 'http://' + $location.host() + ':5000/';

    	return {
            get: getAll,
            getById: getById,
    		post: post,
            put: put
    	};

        function getAll() {
            var dfd = $q.defer();

            $http({
                method: 'GET',
                url: host + 'api/v1/locations',
                params: {token: AuthToken.getToken()},
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function successCallback(response) {
                response.success = true;
                dfd.resolve(response);
            }, function errorCallback(response) {
                dfd.resolve(response.data);
            });

            return dfd.promise;
        }

        function getById(query) {
            var dfd = $q.defer();

            query.token = AuthToken.getToken();

            $http({
                method: 'GET',
                url: host + 'api/v1/locations',
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

    	function post(data) {
    		var dfd = $q.defer();

    		$http({
    			method: 'POST',
            	url: host + 'api/v1/locations',
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

        function put(query, data) {
            var dfd = $q.defer();

            query.token = AuthToken.getToken();

            $http({
                method: 'PUT',
                url: host + 'api/v1/locations',
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
        }
    }