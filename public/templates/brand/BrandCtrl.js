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
	};

	$scope.editBrand = function(id) {
		$('.mark-up .views-content .product-form #create-brand').hide();
		$('.mark-up .views-content .product-form #save-brand').show();

		var query = {
			_id: id
		};

		BrandService.getById(query).then(function(data) {
			if(data) {
				mvNotifier.notify('Marca cargada en el formulario.');
				$scope.brand = data.name;
				$scope.id = data._id;
			}
		});
	};

	$scope.saveBrand = function() {
		var data = {};
		var query = {
			_id: $scope.id
		};

		if(!$scope.brandForm.brand.$pristine)
			data.name = $scope.brand;

		if(!$scope.brandForm.$pristine) {
			BrandService.put(query, data).then(function(success) {
				if(success) {
					$scope.id = "";
					$scope.name = "";
					mvNotifier.notify('Marca actualizada correctamente.');
				} else
					mvNotifier.error('No se pudo actualizar la marca.');
			});
		} else
			mvNotifier.error('Modifica la marca para poder actualizarla.');
	}

	function updateBrands() {
		BrandService.get().then(function(data) {
			if(data) {
				$scope.brands = data;
			}
		});
	};
}