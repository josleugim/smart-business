"use strict";
angular.module('smartBusiness')
    .factory('LocationService', ['$q', '$http', '$location', 'AuthToken', LocationService]);

    function LocationService($q, $http, $location, AuthToken) {
    	var host = 'http://' + $location.host() + ':5000/';

    	return {
            get: getAll,
    		post: post
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
    	}
    }