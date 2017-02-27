"use strict";
angular.module('smartBusiness')
    .controller('InventoryCtrl', ['$scope', 'mvNotifier', 'ProductService', 'LocationService', 'CategoryService', InventoryCtrl]);

function InventoryCtrl($scope, mvNotifier, ProductService, LocationService, CategoryService) {
    $scope.products = [];
	LocationService.get().then(function(response) {
		if(response.success) {
			$scope.locations = response.data;
		} else
			mvNotifier.error('No se pudieron cargar las locaciones. Error: ' + response.error.message + ' !!!');
	});

    CategoryService.get().then(function (data) {
		if(data)
			$scope.categories = data;
    });

	$scope.searchProducts = function () {
	    $scope.products = [];
        $scope.location_id = $scope.locList._id;
        $scope.lastId = "";
        var query = {
            location_id: $scope.locList._id,
            searchType: 'byLocation',
            name: $scope.name,
            barcode: $scope.barcode
        };
        if($scope.catList)
            query.category_id = $scope.catList._id;

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

	$scope.viewMoreProducts = function () {
	    var query = {
            location_id: $scope.locList._id,
            searchType: 'byLocation',
            last_id: $scope.lastId
        };

	    if($scope.lastId)
	        getProducts(query);
	    else
	        mvNotifier.error('No hay más productos');
    };

	function getProducts(query) {
		ProductService.get(query).then(function(data) {
			if(data) {
                if(data.inventory.length > 0) {
                    mvNotifier.notify('Productos cargados');
                    $scope.additionalInfo = {
                        totalProductsPrice: data.total,
                        productsCount: data.productCount
                    };

                    var lastIndex = data.inventory.length;
                    $scope.lastId = data.inventory[lastIndex - 1]._id;

                    angular.forEach(data.inventory, function (product) {
                        $scope.products.push(product);
                    });

                }
            } else
                mvNotifier.error('No hay más productos con esos filtros');
		});
	}
}    