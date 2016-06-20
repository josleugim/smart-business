/**
 * Created by Mordekaiser on 04/06/16.
 */
"use strict";
var smartBusiness = angular.module('smartBusiness', ['ngResource', 'ngRoute', 'ngCookies']);

smartBusiness.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $routeProvider
        .when('/register', {
            templateUrl: 'templates/account/register.html',
            controller: 'RegisterCtrl'
        })
        .when('/location', {
            templateUrl: 'templates/location/location.html',
            controller: 'LocationCtrl'
        })
        .when('/seller', {
            templateUrl: 'templates/account/seller.html',
            controller: 'SellerCtrl'
        })
        .when('/brand', {
            templateUrl: 'templates/brand/brand.html',
            controller: 'BrandCtrl'
        })
        .when('/product', {
            templateUrl: 'templates/product/product.html',
            controller: 'ProductCtrl'
        })
        .when('/mqtt-client', {
            templateUrl: 'templates/mqtt/mqtt-client.html',
            controller: 'mqttCtrl'
        })
}]);