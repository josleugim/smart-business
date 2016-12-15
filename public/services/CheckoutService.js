"use strict";
angular.module('smartBusiness')
    .factory('CheckoutService', ['$q', '$http', '$location', 'AuthToken', CheckoutService]);

function CheckoutService($q, $http, $location, AuthToken) {
	var host = 'http://' + $location.host() + ':5000/';
    var user = AuthToken.getToken();

	return {
		post: post
	};

	function post(data) {
		var dfd = $q.defer();
        $http({
            method: 'POST',
            url: host + 'api/v1/checkout',
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