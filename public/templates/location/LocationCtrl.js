/**
 * Created by Mordekaiser on 04/06/16.
 */
"use strict";
angular.module('smartBusiness')
.controller('LocationCtrl', ['$scope', 'mvIdentity', LocationCtrl]);

function LocationCtrl($scope, mvIdentity) {
    $scope.identity = mvIdentity.currentUser;
    console.log($scope.identity);
}