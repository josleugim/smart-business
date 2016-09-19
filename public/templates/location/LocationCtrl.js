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

	$scope.saveLocation = function() {
		var data = {};
		var query = {
			_id: $scope.id
		};

		if(!$scope.locationForm.name.$pristine)
			data.name = $scope.name;
		if(!$scope.locationForm.description.$pristine)
			data.description = $scope.description;


		if(!$scope.locationForm.$pristine) {
			LocationService.put(query, data).then(function(success) {
				if(success) {
					$scope.name = "";
					$scope.id = "";
					$scope.description = "";
					mvNotifier.notify('Localidad actualizada correctamente.');
				} else
					mvNotifier.error('No se pudo actualizar la localidad.');
			});
		} else
			mvNotifier.error('Modifica la localidad para poder actualizarla.');
	};

	$scope.editLocation = function(id) {
		$('.mark-up .views-content .product-form #create-location').hide();
		$('.mark-up .views-content .product-form #save-location').show();
		var query = {
			_id: id
		};

		LocationService.getById(query).then(function(data) {
			if(data) {
				mvNotifier.notify('Información cargada');
				$scope.name = data.name;
				$scope.description = data.description;
				$scope.id = data._id;
			}
		});
	};

	function updateLocations() {
		LocationService.get().then(function(data) {
			$scope.locations = data;
		});
	};
}