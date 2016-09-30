"use strict";
angular.module('smartBusiness')
    .controller('InventoryCtrl', ['$scope', 'mvNotifier', 'ProductService', 'LocationService', InventoryCtrl]);

function InventoryCtrl($scope, mvNotifier, ProductService, LocationService) {
	LocationService.get().then(function(response) {
		if(response.success) {
			$scope.locations = response.data;
		} else
			mvNotifier.error('No se pudieron cargar las locaciones. Error: ' + response.error.message + ' !!!');
	});

	$scope.updateInventory = function(id) {
		$scope.products = "";
        $scope.location_id = id;
		var query = {
			location_id: id,
            searchType: 'byLocation'
		};
		getProducts(query);
	};

	$scope.deleteProduct = function(id) {
		ProductService.delProduct({_id: id}).then(function (response) {
			if(response.success) {
				mvNotifier.notify('Producto borrado correctamente');
				getProducts({location_id: $scope.location_id});
			} else
			    mvNotifier.error('Ocurrió un error al intentar borrar el producto');
		})
	};

	function getProducts(query) {
		ProductService.get(query).then(function(data) {
			if(data) {
				mvNotifier.notify('Productos cargados');
				$scope.products = data;
			} else {
				mvNotifier.error('No se pudo cargar los productos.');
			}
		});
	};
}    