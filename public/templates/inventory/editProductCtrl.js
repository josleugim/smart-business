/**
 * Created by Mordekaiser on 29/09/16.
 */
"use strict";
angular.module('smartBusiness')
    .controller('editProductCtrl', ['$scope', 'mvNotifier', 'ProductService', 'LocationService', '$stateParams', 'CategoryService', 'BrandService', '$timeout', '$state', editProductCtrl]);

function editProductCtrl($scope, mvNotifier, ProductService, LocationService, $stateParams, CategoryService, BrandService, $timeout, $state) {
    if($stateParams.id) {
        LocationService.get().then(function(response) {
            if(response.success) {
                $scope.locations = response.data;
            } else
                mvNotifier.error('No se pudieron cargar las locaciones. Error: ' + response.error.message + ' !!!');
        });

        CategoryService.get().then(function (data) {
            $scope.categories = data;
        });

        BrandService.get().then(function (data) {
            $scope.brands = data;
        });

        var query = {
            _id: $stateParams.id
        };

        ProductService.get(query).then(function (data) {
            if(data[0]) {
                $scope.locationList = {'_id': data[0].location_id, 'name': data[0].locationName};
                $scope.categoryList = {'_id': data[0].category_id, 'name': data[0].categoryName};
                $scope.brandList = {'_id': data[0].brand_id, 'name': data[0].brandName};
                $scope.productName = data[0].name;
                $scope.price = data[0].price;
                $scope.description = data[0].description;
                $scope.barcode = data[0].barcode;
                $scope.sim = data[0].sim;
                $scope.image = data[0].image;
                $scope.soldOut = data[0].soldOut === 'Vendido';
                mvNotifier.notify('Producto cargado en formulario correctamente.');
            } else
                mvNotifier.error('Error al cargar el producto');
        });

    } else
        mvNotifier.error('Error al cargar vista.');
    $scope.saveProduct = function () {
        var data = {};
        var query = {
            _id: $stateParams.id
        };

        if(!$scope.editProductForm.productName.$pristine)
            data.name = $scope.productName;
        if(!$scope.editProductForm.price.$pristine)
            data.price = $scope.price;
        if(!$scope.editProductForm.description.$pristine)
            data.description = $scope.description;
        if(!$scope.editProductForm.barcode.$pristine)
            data.barcode = $scope.barcode;
        if(!$scope.editProductForm.sim.$pristine)
            data.sim = $scope.sim;
        if(!$scope.editProductForm.soldOut.$pristine)
            data.soldOut = $scope.soldOut;
        if($scope.files)
            data.image = $scope.files;
        if($scope.brandList)
            data.brand_id = $scope.brandList._id;
        if($scope.categoryList)
            data.category_id = $scope.categoryList._id;

        ProductService.put(query, data).then(function (success) {
            if(success) {
                mvNotifier.notify('Producto actualizado correctamente');
                $timeout(function(){
                    $state.go('inventory');
                },300);
            } else
                mvNotifier.error('El producto no se pudo actualizar.');
        })
    }
}