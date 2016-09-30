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
	LocationService.get().then(function(response) {
		if(response.success) {
			$scope.locations = response.data;
		} else
			mvNotifier.error('No se pudieron cargar las locaciones. Error: ' + response.error.message + ' !!!');
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
				$scope.locationList = {'_id': data.location_id, 'name': data.location};
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

		data.location_id = $scope.locationList._id;

		if(!$scope.sellerForm.$pristine) {
			SellerService.put(query, data).then(function(success) {
				if(success) {
					$scope.id = "";
					$scope.name = "";
					$scope.email = "";
					$scope.locationList = "";
					$scope.pass = "";
					$scope.confPass = "";
					mvNotifier.notify('Vendedor actualizado correctamente.');
					updateSellers();
				} else
					mvNotifier.error('No se pudo actualizar el vendedor.');
			});
		} else
			mvNotifier.error('Modifica el vendedor para poder actualizarlo.');
    };

    $scope.deleteSeller = function(id) {
    	SellerService.delSeller({_id: id}).then(function(success) {
    		if(success) {
    			mvNotifier.notify('Vendedor borrado correctamente.');
    			updateSellers();
    		} else
    			mvNotifier.error('Ocurrió un error al intentar borrar el vendedor.');
    	});
    };

    function updateSellers() {
		SellerService.get().then(function(data) {
			if(data) {
				$scope.sellers = data;
			}
		});
	};
}