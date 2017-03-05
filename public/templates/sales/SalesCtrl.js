"use strict";
angular.module('smartBusiness')
	.controller('SalesCtrl', ['$scope', 'SalesService', '$filter', 'LocationService', SalesCtrl]);

function SalesCtrl ($scope, SalesService, $filter, LocationService) {
    $scope.totalSell = 0;
    $scope.products = [];
	$scope.options = {
    	showWeeks: true,
    	maxDate: new Date(),
    	dateFormat: 'dd-MMMM-yyyy'
  	};

    LocationService.get().then(function(response) {
        if(response.success){
            $scope.locations = response.data;
        } else
            mvNotifier.error('No se pudieron cargar las locaciones. Error: ' + response.error.message + ' !!!');
    });

  	$scope.open1 = function() {
    	$scope.popup1.opened = true;
  	};

  	$scope.open2 = function() {
    	$scope.popup2.opened = true;
  	};

  	$scope.popup1 = {
  		opened: false
  	};

  	$scope.popup2 = {
  		opened: false
  	};

  	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
    $scope.format = $scope.formats[0];

	$scope.getSales = function () {
        $scope.totalSell = 0;
        $scope.products = [];
        $('.chart').empty();
        var query = {
            from: $filter('date')($scope.dateOne, 'yyyy-MM-dd'),
            to: $filter('date')($scope.dateTwo, 'yyyy-MM-dd'),
            location_id: $scope.location_id
        };
        SalesService.get(query).then(function(data) {
            if(data) {
                console.log(data);
                $scope.totalSell = data.total;
                $scope.sales = data.sales;
            }
        });
	};

}	