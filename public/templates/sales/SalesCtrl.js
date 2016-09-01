"use strict";
angular.module('smartBusiness')
	.controller('SalesCtrl', ['$scope', SalesCtrl]);

function SalesCtrl ($scope) {
	$scope.options = {
    	showWeeks: true,
    	maxDate: new Date(),
    	dateFormat: 'dd-MMMM-yyyy'
  	};

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
}	