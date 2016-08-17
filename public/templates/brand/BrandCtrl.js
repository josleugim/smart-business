/**
 * Created by Mordekaiser on 05/06/16.
 */
"use strict";
angular.module('smartBusiness')
    .controller('BrandCtrl', ['$scope', 'BrandService', BrandCtrl]);

function BrandCtrl($scope, BrandService) {
	$scope.addBrand = function() {
		var data = {
			name: $scope.brand
		};

		BrandService.post(data).then(function(success) {
			if(success) {
				$scope.brand = "";
			}
		})
	}
}