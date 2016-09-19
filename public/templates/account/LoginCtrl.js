/**
 * Created by Mordekaiser on 04/06/16.
 */
"use strict";
angular.module('smartBusiness')
.controller('LoginCtrl', ['$scope', 'AuthService', '$location', 'AuthToken', '$window', 'mvNotifier', LoginCtrl]);

function LoginCtrl($scope, AuthService, $location, AuthToken, $window, mvNotifier) {
    $scope.login = function () {
        var query = {
            email: $scope.email,
            password: $scope.password
        };
        AuthService.authenticate(query).then(function (success) {
            if(success) {
                mvNotifier.notify('Acceso exitoso');
                $location.path('/products');
                $window.location.reload();
            } else
                mvNotifier.error('No se puedo iniciar sesión');
        });
    }

    $scope.logout = function() {
        mvNotifier.notify('Sesisón finalizada');
        AuthToken.removeToken();
        $location.path('/');
        $window.location.reload();
    }
}