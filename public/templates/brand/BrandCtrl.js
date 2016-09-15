/**
 * Created by Mordekaiser on 05/06/16.
 */
"use strict";
angular.module('smartBusiness')
    .controller('BrandCtrl', ['$scope', 'BrandService', 'mvNotifier', BrandCtrl]);

function BrandCtrl($scope, BrandService, mvNotifier) {
	updateBrands();
	$scope.addBrand = function() {
		var data = {
			name: $scope.brand
		};

		BrandService.post(data).then(function(success) {
			if(success) {
				mvNotifier.notify('Marca agregada correctamente.');
				$scope.brand = "";
				updateBrands();
			} else {
				mvNotifier.error('No se pudo crear la marca.')
			}
		})
	}

	function updateBrands() {
		BrandService.get().then(function(data) {
			if(data) {
				$scope.brands = data;
			}
		});
	};
}