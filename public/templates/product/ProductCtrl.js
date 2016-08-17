/**
 * Created by Mordekaiser on 05/06/16.
 */
"use strict";
angular.module('smartBusiness')
    .controller('ProductCtrl', ['$scope', 'BrandService', ProductCtrl]);

function ProductCtrl($scope, BrandService) {
    $scope.productCount = 0;
    $scope.product = {barCodes:[]};

    BrandService.get().then(function(data) {
        $scope.brands = data;
    })

    $scope.upCountProduct = function () {
        $scope.productCount++;
        $scope.product.barCodes.push('');
    };

    $scope.downCountProduct = function () {
        if($scope.productCount > 0) {
            $scope.productCount--;
            var index = $scope.product.barCodes.length;
            $scope.product.barCodes.splice(index -1);
        }
    };
}