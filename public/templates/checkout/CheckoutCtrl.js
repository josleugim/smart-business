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
    .controller('CheckoutCtrl', ['$scope', 'ProductService', CheckoutCtrl]);

function CheckoutCtrl($scope, ProductService) {
	$scope.carItems = {products:[]};
	$scope.searchItems = {products:[]};
	$scope.total = 0;
	var info = {
		name: $scope.itemName
	};

	ProductService.getByName(info).then(function(data) {
		if(data) {
			console.log(data);
		}
	})

	$scope.addItem = function() {
		$scope.itemBarcode = "";
		$scope.keepFocus();
		$scope.carItems.products.push({'name':'Iphone 6', 'price':'1799.99'});
		total(1799.99)
	}

	function total(price) {
		$scope.total = $scope.total + price;
	}
}    