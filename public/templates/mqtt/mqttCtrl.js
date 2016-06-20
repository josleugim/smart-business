/**
 * Created by Mordekaiser on 20/06/16.
 */
"use strict";
angular.module('smartBusiness')
    .controller('mqttCtrl', ['$scope', 'mqttService', mqttCtrl]);

function mqttCtrl($scope, mqttService) {
    $scope.switchToggle = function (status) {
        console.log('toggle status: ' + status);
        mqttService.post({status: status}).then(function (success) {
            if(success) {
                console.log('Success');
            }
        })
    }
}