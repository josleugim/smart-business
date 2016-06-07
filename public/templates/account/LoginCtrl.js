/**
 * Created by Mordekaiser on 04/06/16.
 */
"use strict";
angular.module('smartBusiness')
.controller('LoginCtrl', ['$scope', 'UserService', '$location', LoginCtrl]);

function LoginCtrl($scope, UserService, $location) {
    console.log('LoginCtrl');
    $scope.login = function () {
        var query = {
            email: $scope.email,
            password: $scope.password
        };
        console.log(query);
        UserService.post(query).then(function (success) {
            if(success) {
                $location.path('/users');
            }
        });
    }
}