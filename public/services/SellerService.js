"use strict";
angular.module('smartBusiness')
.factory('SellerService', ['$q', '$http', '$location', SellerService]);

function SellerService($q, $http, $location) {
    var host = 'http://' + $location.host() + ':5000/';

    return {
    	post: post
    };

    function post(data) {
    	var dfd = $q.defer();

    	$http({
    		method: 'POST',
    		url: host + 'api/v1/sellers',
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