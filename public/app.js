/**
 * Created by Mordekaiser on 04/06/16.
 */
"use strict";
var smartBusiness = angular.module('smartBusiness', ['ngResource', 'ui.router', 'ui.bootstrap']);

smartBusiness.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function ($stateProvider, $locationProvider, $urlRouterProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state("main", {
            url: "/",
            data: {
                authorization: true,
                role: ['owner']
            }
        })
        .state('location', {
            url: '^/location',
            templateUrl: 'templates/location/location.html',
            controller: 'LocationCtrl',
            data: {
                authorization: true,
                role: ['owner']
            }
        })
        .state('seller', {
            url: '/seller',
            templateUrl: 'templates/account/seller.html',
            controller: 'SellerCtrl',
            data: {
                authorization: true,
                role: ['owner']
            }
        })
        .state('brand', {
            url: '/brand',
            templateUrl: 'templates/brand/brand.html',
            controller: 'BrandCtrl',
            data: {
                authorization: true,
                role: ['owner']
            }
        })
        .state('product', {
            url: '/product',
            templateUrl: 'templates/product/product.html',
            controller: 'ProductCtrl',
            data: {
                authorization: true,
                role: ['owner']
            }
        })
        .state('product-edit', {
            url: '/product/:id',
            templateUrl: 'templates/inventory/editProduct.html',
            controller: 'editProductCtrl',
            data: {
                authorization: true,
                role: ['owner']
            }
        })
        .state('checkout', {
            url: '/checkout',
            templateUrl: 'templates/checkout/index.html',
            controller: 'CheckoutCtrl',
            data: {
                authorization: true,
                role: ['seller']
            }
        })
        .state('sales', {
            url: '/sales',
            templateUrl: 'templates/sales/index.html',
            controller: 'SalesCtrl',
            data: {
                authorization: true,
                role: ['owner', 'seller']
            }
        })
        .state('categories', {
            url: '/categories',
            templateUrl: 'templates/category/index.html',
            controller: 'CategoryCtrl',
            data: {
                authorization: true,
                role: ['owner']
            }
        })
        .state('inventory', {
            url: '/inventory',
            templateUrl: 'templates/inventory/inventory.html',
            controller: 'InventoryCtrl',
            data: {
                authorization: true,
                role: ['owner', 'seller']
            }
        })
}]);

smartBusiness.run(function ($rootScope, $state, $log, AuthToken, mvNotifier, $location, $window) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
        $rootScope.toState = toState;
        $rootScope.toStateParams = toStateParams;
        if (!AuthToken.isAuthenticated()) {
            $location.path('/login');
            mvNotifier.error('No has iniciado sesión');
        }
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        var user = AuthToken.getToken();
        var auth = false;
        if(user) {
            angular.forEach(user.roles, function (role, key) {
                if(toState.data.role.indexOf(role) !== -1)
                    auth = true;
            });
            if (auth == false && toState.data.authorization) {
                $state.go('main');
            }
        }
    });
    $rootScope.online = navigator.onLine;
    $window.addEventListener("offline", function () {
        $rootScope.$apply(function() {
            $rootScope.online = false;
        });
    }, false);
    $window.addEventListener("online", function () {
        $rootScope.$apply(function() {
            $rootScope.online = true;
        });
    }, false);
});