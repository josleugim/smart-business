/**
 * Created by Mordekaiser on 04/06/16.
 */
"use strict";
angular.module('smartBusiness')
.controller('LocationCtrl', ['$scope', 'AuthToken', 'LocationService', LocationCtrl]);

function LocationCtrl($scope, AuthToken, LocationService) {
	$scope.createLocation = function() {
		var data = {
			name: $scope.name,
			description: $scope.description
		};

		LocationService.post(data).then(function(success) {
			if(success) {

			}
		})
	}
}