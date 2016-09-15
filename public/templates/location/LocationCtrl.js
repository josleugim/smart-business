/**
 * Created by Mordekaiser on 04/06/16.
 */
"use strict";
angular.module('smartBusiness')
	.controller('LocationCtrl', ['$scope', 'AuthToken', 'LocationService', 'mvNotifier', LocationCtrl]);

function LocationCtrl($scope, AuthToken, LocationService, mvNotifier) {
	$scope.locations = "";
	updateLocations();

	$scope.createLocation = function() {
		var data = {
			name: $scope.name,
			description: $scope.description
		};

		LocationService.post(data).then(function(success) {
			if(success) {
				mvNotifier.notify('Localidad creada correctamente.');
				$scope.name = "";
				$scope.description = "";
				updateLocations();
			} else {
				mvNotifier.error('No se pudo crear la localidad');
			}
		})
	}

	function updateLocations() {
		LocationService.get().then(function(data) {
			$scope.locations = data;
		});
	};
}