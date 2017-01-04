/**
 * Created by Mordekaiser on 04/06/16.
 */
"use strict";
angular.module('smartBusiness')
.controller('LoginCtrl', ['$scope', 'AuthService', '$location', 'AuthToken', '$window', 'mvNotifier', '$timeout', LoginCtrl]);

function LoginCtrl($scope, AuthService, $location, AuthToken, $window, mvNotifier, $timeout) {
    $scope.login = function () {
        var query = {
            email: $scope.email,
            password: $scope.password
        };
        AuthService.authenticate(query).then(function (success) {
            if(success) {
                $window.ga('send', 'event', 'Action', 'Login', $scope.email);
                mvNotifier.notify('Acceso exitoso');
                $timeout(function(){
                    $location.path('/products');
                    $window.location.reload();
                },300);
            } else
                mvNotifier.error('No se puedo iniciar sesión');
        });
    };

    $scope.logout = function() {
        console.log('Sesisón finalizada');
        mvNotifier.error('Sesisón finalizada');
        AuthToken.removeToken();
        $timeout(function(){
            $location.path('/');
            $window.location.reload();
        },300);
    }
}