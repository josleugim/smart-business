/**
 * Created by Mordekaiser on 05/06/16.
 */
"use strict";
angular.module('smartBusiness')
    .directive('imageFile', ['$parse', function($parse) {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs) {
                elm.bind('change', function () {
                    $parse(attrs.imageFile).assign(scope, elm[0].files[0])
                    scope.$apply();
                })
            }
        }
    }])
    .controller('ProductCtrl', ['$scope', 'BrandService', 'LocationService', 'ProductService', ProductCtrl]);

function ProductCtrl($scope, BrandService, LocationService, ProductService) {
    $scope.productCount = 0;
    $scope.product = {barCodes:[]};

    BrandService.get().then(function(data) {
        $scope.brands = data;
    })

    LocationService.get().then(function(data) {
        $scope.locations = data;
    })

    $scope.addProduct = function() {
        var data = {
            brand_id: $scope.brandList._id,
            name: $scope.productName,
            location_id: $scope.location_id,
            price: $scope.price,
            description: $scope.description,
            image: $scope.files,
            barcode: $scope.product.barCodes
        }

        ProductService.post(data).then(function(success) {
            if(success) {
                $scope.productName = "";
                $scope.price = "";
                $scope.description = "";
                $scope.files = "";
                $scope.product.barCodes = "";
            }
        });
    }

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