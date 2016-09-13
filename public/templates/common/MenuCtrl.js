"use strict";
angular.module('smartBusiness')
.controller('MenuCtrl', ['$scope', 'AuthToken', MenuCtrl]);

function MenuCtrl($scope, AuthToken) {
    $scope.isAuthenticated = AuthToken.isAuthenticated();
}