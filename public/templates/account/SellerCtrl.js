/**
 * Created by Mordekaiser on 05/06/16.
 */
"use strict";
angular.module('smartBusiness')
	.directive('pwCheck', [function () {
		return {
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {
				var firstPassword = '#' + attrs.pwCheck;
				elem.add(firstPassword).on('keyup', function () {
					scope.$apply(function () {
						var v = elem.val()===$(firstPassword).val();
						ctrl.$setValidity('pwmatch', v);
					});
				});
			}
		}
	}])
    .controller('SellerCtrl', ['$scope', '$location', 'LocationService', '$rootScope', 'SellerService', 'mvNotifier', SellerCtrl]);

function SellerCtrl($scope, $location, LocationService, $rootScope, SellerService, mvNotifier) {
	LocationService.get().then(function(data) {
		if(data) {
			$scope.locations = data;
		}
	});

	updateSellers();

	$scope.$on("updateLocations", function(event, data){
		$scope.locations.push(data);
    });

    $scope.addSeller = function() {
    	var data = {
    		location_id: $scope.locationList._id,
    		name: $scope.name,
    		email: $scope.email,
    		password: $scope.pass
    	};

    	SellerService.post(data).then(function(success) {
    		if(success) {
    			updateSellers();
    			mvNotifier.notify('Vendedor creado correctamente.');
    			$scope.name = "";
    			$scope.email = "";
    			$scope.pass = "";
    			$scope.confPass = "";
    		} else {
    			mvNotifier.error('No se pudo crear el vendedor.');
    		}
    	})
    };

    $scope.editSeller = function(id) {
    	$('.mark-up .views-content .seller-form #create-seller').hide();
		$('.mark-up .views-content .seller-form #save-seller').show();

		var query = {
			_id: id
		};

		SellerService.getById(query).then(function(data) {
			if(data) {
				mvNotifier.notify('Vendedor cargado en el formulario.');
				$scope.name = data.name;
				$scope.email = data.email;
				$scope.id = data._id;
				$('.mark-up .views-content .seller-form .location').hide();
			}
		});
    };

    $scope.saveSeller = function() {
    	var data = {};
		var query = {
			_id: $scope.id
		};

		if(!$scope.sellerForm.name.$pristine)
			data.name = $scope.name;
		if(!$scope.sellerForm.email.$pristine)
			data.email = $scope.email;
		if(!$scope.sellerForm.pass.$pristine) {
			data.password = $scope.pass;
		}

		if(!$scope.sellerForm.$pristine) {
			CategoryService.put(query, data).then(function(success) {
				if(success) {
					$scope.id = "";
					$scope.categoryName = "";
					$scope.description = "";
					mvNotifier.notify('Categoría actualizada correctamente.');
					updateCategories();
				} else
					mvNotifier.error('No se pudo actualizar la categoría.');
			});
		} else
			mvNotifier.error('Modifica la categoría para poder actualizarla.');
    }

    function updateSellers() {
		SellerService.get().then(function(data) {
			if(data) {
				$scope.sellers = data;
			}
		});
	};
}