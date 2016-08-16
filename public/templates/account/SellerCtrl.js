/**
 * Created by Mordekaiser on 05/06/16.
 */
"use strict";
angular.module('smartBusiness')
    .controller('SellerCtrl', ['$scope', '$location', 'LocationService', '$rootScope', SellerCtrl]);

function SellerCtrl($scope, $location, LocationService, $rootScope) {
	$scope.locations = [];
	LocationService.get().then(function(data) {
		if(data) {
			angular.forEach(data, function(values, key) {
				$rootScope.$broadcast('updateLocations', values);
			});
		}
	})

	$scope.$on("updateLocations", function(event, data){
		$scope.locations.push(data);
    });
}