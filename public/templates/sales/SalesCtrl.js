"use strict";
angular.module('smartBusiness')
	.controller('SalesCtrl', ['$scope', 'SalesService', '$filter', SalesCtrl]);

function SalesCtrl ($scope, SalesService, $filter) {
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

    var date = new Date();
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    console.log(day + "/" + monthIndex + "/" + year);



	$scope.getSales = function () {
        $('.chart').empty();
        var query = {
            from: $filter('date')($scope.dateOne, 'yyyy-MM-d'),
            to: $filter('date')($scope.dateTwo, 'yyyy-MM-d')
        };

        SalesService.get(query).then(function(data) {
            if(data) {
                console.log(data);
                var totals = [];

                angular.forEach(data, function (value, key) {
                    totals.push(value.total);
                });
                graphicData(totals);
            }
        });
	};

    function graphicData(totals) {
        var data = totals;
        console.log(data);
      var x = d3.scale.linear()
      .domain([0, d3.max(data)])
      .range([0, 420]);

      d3.select(".chart")
      .selectAll("div")
      .data(data)
      .enter().append("div")
      .style("width", function(d) { return x(d) + "px"; })
      .text(function(d) { return d; });
    }
}	