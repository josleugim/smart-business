"use strict";
angular.module('smartBusiness')
    .factory('LocationService', ['$q', '$http', '$location', 'AuthToken', LocationService]);

    function LocationService($q, $http, $location, AuthToken) {
    	var host = 'http://' + $location.host() + ':5000/';

    	return {
    		post: post
    	};

    	function post(data) {
    		var dfd = $q.defer();

            console.log(data);

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