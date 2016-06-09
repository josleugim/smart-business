/**
 * Created by Mordekaiser on 04/06/16.
 */
"use strict";
angular.module('smartBusiness')
.controller('LoginCtrl', ['$scope', 'AuthService', '$location', LoginCtrl]);

function LoginCtrl($scope, AuthService, $location) {
    $scope.login = function () {
        var query = {
            email: $scope.email,
            password: $scope.password
        };
        AuthService.authenticate(query).then(function (success) {
            if(success) {
                $location.path('/users');
            }
        });
    }
}