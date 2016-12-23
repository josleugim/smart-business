"use strict";
angular.module('smartBusiness')
    .controller('InventoryCtrl', ['$scope', 'mvNotifier', 'ProductService', 'LocationService', 'CategoryService', InventoryCtrl]);

function InventoryCtrl($scope, mvNotifier, ProductService, LocationService, CategoryService) {
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

    ProductService.count({}).then(function (data) {
		$scope.totalPage = data;
		$scope.totalPageArray = new Array(data);
	});

	/*$scope.updateInventory = function(id) {
		$scope.products = "";
        $scope.location_id = id;
		var query = {
			location_id: id,
            searchType: 'byLocation'
		};
		getProducts(query);
	};*/

	$scope.searchProducts = function () {
	    $scope.products = "";
        $scope.location_id = $scope.locList._id;
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

    $scope.changePage = function (index) {
        if($scope.currentPage != index) {
            var query = {
                currentPage: index,
                location_id: $scope.location_id,
                searchType: 'byLocation'
            };
            getProducts(query);
            $scope.currentPage = index;
        }
    };

    $scope.nextId = function () {
        if($scope.currentPage < $scope.totalPage) {
            getProducts({lastId: $scope.lastId, location_id: $scope.location_id, searchType: 'byLocation'});
            $scope.currentPage = $scope.currentPage + 1;
        }
    };

    $scope.previousId = function () {
        if($scope.currentPage > 1) {
            getProducts({prevId: $scope.lastId, location_id: $scope.location_id, searchType: 'byLocation'});
            $scope.currentPage = $scope.currentPage -1;
        }
    };

	function getProducts(query) {
		ProductService.get(query).then(function(data) {
			if(data) {
				mvNotifier.notify('Productos cargados');
                var lastIndex = data.length;
                $scope.lastId = data[lastIndex - 1]._id;
				$scope.products = data;

			} else {
				mvNotifier.error('No se pudo cargar los productos.');
			}
		});
	}
}    