/**
 * Created by Mordekaiser on 04/06/16.
 */
"use strict";
angular.module('smartBusiness')
.controller('LoginCtrl', ['$scope', 'AuthService', '$location', 'AuthToken', '$window', LoginCtrl]);

function LoginCtrl($scope, AuthService, $location, AuthToken, $window) {
    $scope.login = function () {
        var query = {
            email: $scope.email,
            password: $scope.password
        };
        AuthService.authenticate(query).then(function (success) {
            if(success) {
                $location.path('/users');
                $window.location.reload();
            }
        });
    }

    $scope.logout = function() {
        console.log('Logout');
        AuthToken.removeToken();
        $location.path('/');
        $window.location.reload();
    }
}