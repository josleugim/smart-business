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
    .controller('CheckoutCtrl', ['$scope', 'ProductService', '$rootScope', 'CheckoutService', 'mvNotifier', CheckoutCtrl]);

function CheckoutCtrl($scope, ProductService, $rootScope, CheckoutService, mvNotifier) {
	$scope.searchItems = "";
	$scope.total = 0;
	$scope.searchProducts = "";
	$scope.carItems = [];

	$scope.addItem = function(itemBarcode) {
		$scope.keepFocus();
		var query = {
			barcode: itemBarcode,
			searchType: 'byBarcode',
            products_id: []
		};
        // send the ids in the checkout list that will be excluded in the response
        if($scope.carItems.length > 0) {
            angular.forEach($scope.carItems, function (product) {
                query.products_id.push(product._id);
            });
        }
        addItemToList(query);
		$scope.itemBarcode = "";
	};

	function addItemToList(query) {
		ProductService.get(query).then(function(data) {
			if(data.objectProduct.length > 0) {
				$scope.carItems.push(data.objectProduct[0]);
				total(data.objectProduct[0].price);
			}
		});
	}

	function total(price) {
		$scope.total = $scope.total + price;
	}

	$scope.checkout = function() {
		$('#sell').hide();
		$('#removeProduct').hide();
		$('#loader').css('display', 'block');
		var data = {
			products: $scope.carItems,
			total: $scope.total
		};

		if($scope.carItems.length > 0) {
            CheckoutService.post(data).then(function(success) {
                if(success) {
                    $scope.carItems = [];
                    $scope.total = 0;
                    mvNotifier.notify('Venta realizada correctamente');
                    $('#sell').show();
                    $('#removeProduct').show();
                    $('#loader').css('display', 'none');
                } else
                    mvNotifier.error('Ocurrio un error al realizar la venta!!!');
            })
        } else {
            $scope.keepFocus();
            mvNotifier.error('No has seleccionado producto para vender');
        }
	};

	$scope.searchItem = function() {
		$rootScope.$broadcast('updateItemsList', "");
		var info = {
			name: $scope.itemName,
			searchType: 'byName',
            products_id: []
		};

		// send the ids in the checkout list that will be excluded in the response
        if($scope.carItems.length > 0) {
            angular.forEach($scope.carItems, function (product) {
                info.products_id.push(product._id);
            });
        }

		ProductService.get(info).then(function(data) {
			if(data.objectProduct.length > 0) {
				$rootScope.$broadcast('updateItemsList', data.objectProduct);
			}
		})
	};

	$scope.removeItem = function(product) {
		$rootScope.$broadcast('removeItemFromCheckout', product);
	};

	// add product searched by name, to the cart
	$scope.addToCheckoutList = function(product) {
        var isInCart = false;
        // validates product isn't all ready in the cart
        if($scope.carItems.length > 0) {
            angular.forEach($scope.carItems, function(value, key) {
                if(value._id == product._id) {
                    isInCart = true;
                    mvNotifier.error('Ese producto ya se encuentra en tu lista, escoge otro del listado');
                }

            });
        }

        if(!isInCart) {
            $rootScope.$broadcast('updateCheckoutList', product);
            $scope.itemName = "";
            $scope.keepFocus();
        }
	};

	$scope.$on("updateItemsList", function(event, data){
		$scope.searchProducts = data;
    });

	// updates the checkout list
    $scope.$on("updateCheckoutList", function(event, data){
		$scope.carItems.push(data);
		$rootScope.$broadcast('updateItemsList', "");
		total(data.price);
    });

    $scope.$on("removeItemFromCheckout", function(event, product) {
    	var index = $scope.carItems.indexOf(product._id);
    	$scope.carItems.splice(index, 1);
    	total(-1 * product.price);
    });
}    