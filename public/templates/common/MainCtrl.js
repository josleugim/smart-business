/**
 * Created by latin on 12/27/2016.
 */
"use strict";
angular.module('smartBusiness')
    .controller('MainCtrl', ['$scope', 'AuthToken', MainCtrl]);

function MainCtrl($scope, AuthToken) {
    $scope.identity = AuthToken;
}