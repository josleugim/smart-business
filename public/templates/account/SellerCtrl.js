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
    }

    function updateSellers() {
		SellerService.get().then(function(data) {
			if(data) {
				$scope.sellers = data;
			}
		});
	};
}