"use strict";

angular.module('smartBusiness')
	.directive('barcodeFocus', function() {
		return {
			link: function(scope, element, attr) {
				scope[attr.barcodeFocus] = function() {
					element[0].focus();
				}
			}
		}
	})
    .controller('CheckoutCtrl', ['$scope', 'ProductService', '$rootScope', 'CheckoutService', CheckoutCtrl]);

function CheckoutCtrl($scope, ProductService, $rootScope, CheckoutService) {
	$scope.searchItems = "";
	$scope.total = 0;
	$scope.searchProducts = "";
	$scope.carItems = [];

	$scope.addItem = function(itemBarcode) {
		$scope.keepFocus();
		var query = {
			barcode: itemBarcode,
			searchType: 'byBarcode'
		};
		if($scope.carItems.length > 0) {
			angular.forEach($scope.carItems, function(value, key) {
				if(value.barcode.indexOf(itemBarcode) == -1) {
					addItemToList(query);
				} else {
					console.log('Item already in list');
				}
			});
		} else {
			addItemToList(query);
		}
		$scope.itemBarcode = "";
	}

	function addItemToList(query) {
		ProductService.get(query).then(function(data) {
			if(data) {
				$scope.carItems.push(data);
				total(data.price);
			}
		});
	}

	function total(price) {
		$scope.total = $scope.total + price;
	}

	$scope.checkout = function() {
		console.log($scope.carItems);
		var data = {
			products: $scope.carItems,
			total: $scope.total
		}
		CheckoutService.post(data).then(function(success) {
			if(success) {

			}
		})
	}

	$scope.searchItem = function() {
		$rootScope.$broadcast('updateItemsList', "");
		var info = {
			name: $scope.itemName,
			searchType: 'byName'
		};

		ProductService.get(info).then(function(data) {
			if(data) {
				$rootScope.$broadcast('updateItemsList', data);
			}
		})
	}

	$scope.removeItem = function(product) {
		$rootScope.$broadcast('removeItemFromCheckout', product);
	}

	$scope.addToCheckoutList = function(product) {
		$rootScope.$broadcast('updateCheckoutList', product);
	}

	$scope.$on("updateItemsList", function(event, data){
		$scope.searchProducts = data;
    });

    $scope.$on("updateCheckoutList", function(event, data){
		$scope.carItems.push(data);
		$rootScope.$broadcast('updateItemsList', "");
		total(data.price);
    });

    $scope.$on("removeItemFromCheckout", function(event, product) {
    	var index = $scope.carItems.indexOf(product._id);
    	$scope.carItems.splice(index, 1);
    	total(-1 * product.price);
    })

    var formatter = new Intl.NumberFormat('es-MX', {
    	style: 'currency',
    	currency: 'MXN',
    	minimumFractionDigits: 2
    });
}    