"use strict";
angular.module('smartBusiness')
	.factory('SalesService', ['$q', '$http', '$location', 'AuthToken', SalesService]);

function SalesService ($q, $http, $location, AuthToken) {
	var host = 'http://' + $location.host() + ':5000/';
	return {
		get: get
	}

	function get(fromDate, toDate) {
		var dfd = $q.defer();

    	$http({
    		method: 'GET',
    		url: host + 'api/v1/sales',
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
}