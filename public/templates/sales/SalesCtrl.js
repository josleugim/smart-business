"use strict";
angular.module('smartBusiness')
	.controller('SalesCtrl', ['$scope', 'SalesService', '$filter', SalesCtrl]);

function SalesCtrl ($scope, SalesService, $filter) {
    $scope.totalSell = 0;
    $scope.products = [];
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

	$scope.getSales = function () {
        $scope.totalSell = 0;
        $scope.products = [];
        $('.chart').empty();
        var query = {
            from: $filter('date')($scope.dateOne, 'yyyy-MM-d'),
            to: $filter('date')($scope.dateTwo, 'yyyy-MM-d')
        };

        SalesService.get(query).then(function(data) {
            if(data) {
                var totals = [];

                angular.forEach(data, function (value, key) {
                    var objGrap = {
                        total: value.total,
                        createdAt: value.createdAt
                    };
                    $scope.totalSell = $scope.totalSell + value.total;
                    // pass each product to the scope
                    angular.forEach(value.product, function (item, key) {
                        item.username = value.username;
                        $scope.products.push(item);
                    });
                    totals.push(objGrap);
                });
                graphicData(totals);
            }
        });
	};

    function graphicData(obj) {
        var totals = [];
        var cont = 0;
        angular.forEach(obj, function (value, key) {
            totals.push(value.total);
        });

        var data = totals;
        var x = d3.scale.linear()
            .domain([0, d3.max(data)])
            .range([0, 420]);

        d3.select(".chart")
            .selectAll("div")
            .data(data)
            .enter().append("div")
            .style("width", function(d) { return x(d) + "px"; })
            .text(function(d) {
                var text = 'Fecha de venta: ' + obj[cont].createdAt + ' Total de la venta: $ ' + d;
                cont++;
                return text
            });
    }
}	