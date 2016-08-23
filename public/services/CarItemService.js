"use strict";
angular.module('smartBusiness')
    .factory('CarItemService', ['$q', '$http', '$location', 'AuthToken', CarItemService]);

function LocationService($q, $http, $location, AuthToken) {
	var host = 'http://' + $location.host() + ':5000/';

	return {
	};
}    