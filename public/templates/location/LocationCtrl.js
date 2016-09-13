/**
 * Created by Mordekaiser on 04/06/16.
 */
"use strict";
angular.module('smartBusiness')
	.controller('LocationCtrl', ['$scope', 'AuthToken', 'LocationService', LocationCtrl]);

function LocationCtrl($scope, AuthToken, LocationService) {
	$scope.locations = "";
	updateLocations();

	$scope.createLocation = function() {
		var data = {
			name: $scope.name,
			description: $scope.description
		};

		LocationService.post(data).then(function(success) {
			if(success) {
				$scope.name = "";
				$scope.description = "";
				updateLocations();
			}
		})
	}

	function updateLocations() {
		LocationService.get().then(function(data) {
			$scope.locations = data;
		});
	};
}