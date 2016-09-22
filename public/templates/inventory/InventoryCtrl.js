"use strict";
angular.module('smartBusiness')
    .controller('InventoryCtrl', ['$scope', 'mvNotifier', 'ProductService', 'LocationService', InventoryCtrl]);

function InventoryCtrl($scope, mvNotifier, ProductService, LocationService) {
	LocationService.get().then(function(data) {
		$scope.locations = data;
	});

	$scope.updateInventory = function(id) {
		$scope.products = ""
		var query = {
			location_id: id
		};
		getProducts(query);
	};

	function getProducts(query) {
		ProductService.get(query).then(function(data) {
			if(data) {
				mvNotifier.notify('Productos cargados');
				$scope.products = data;
			} else
			mvNotifier.error('No se pudo cargar los productos.');
		});
	}
}    