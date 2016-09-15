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
    .controller('ProductCtrl', ['$scope', 'BrandService', 'LocationService', 'ProductService', 'CategoryService', 'mvNotifier', ProductCtrl]);

function ProductCtrl($scope, BrandService, LocationService, ProductService, CategoryService, mvNotifier) {
    /*$scope.codesCount = 0;
    $scope.product = {barCodes:[]};
    $scope.item = {sims:[]};
    var cont = 0;*/

    BrandService.get().then(function(data) {
        $scope.brands = data;
    });

    LocationService.get().then(function(data) {
        $scope.locations = data;
    });

    CategoryService.get().then(function(data) {
        $scope.categories = data;
    });

    $scope.addProduct = function() {
        var data = {
            brand_id: $scope.brandList._id,
            location_id: $scope.location_id,
            category_id: $scope.categoryList._id,
            name: $scope.productName,
            price: $scope.price,
            description: $scope.description,
            image: $scope.files,
            barcode: $scope.barcode,
            sim: $scope.sim
        };

        /*angular.forEach($scope.product.barCodes, function(item, key) {
            var tempCode = {
                barcode: item,
                sim: $scope.item.sims[cont]
            };
            data.codes.push(tempCode);
            cont = cont + 1;
        });*/

        ProductService.post(data).then(function(response) {
            console.log(response);
            if(response.success) {
                mvNotifier.notify('Producto creado correctamente');
                $scope.productName = "";
                $scope.price = "";
                $scope.description = "";
                $scope.files = "";
                $scope.sim = "";
                $scope.barcode = "";
                /*$scope.product = {barCodes:[]};
                $scope.item = {sims:[]};
                $scope.codesCount = 0;
                cont = 0;*/
            } else {
                mvNotifier.error('No se pudo crear el producto. ' + response.error.message);
            }
        });
    }

    /*$scope.upCountProduct = function () {
        $scope.codesCount++;
        $scope.product.barCodes.push('');
        $scope.item.sims.push('');
    };

    $scope.downCountProduct = function () {
        if($scope.codesCount > 0) {
            $scope.codesCount--;
            var index = $scope.product.barCodes.length;
            $scope.product.barCodes.splice(index -1);
            $scope.item.sims.splice(index -1);
        }
    };*/
}