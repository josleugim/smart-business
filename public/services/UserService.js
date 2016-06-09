/**
 * Created by Mordekaiser on 06/06/16.
 */
"use strict";
angular.module('smartBusiness')
.factory('UserService', ['$q', '$http', '$location', UserService]);

function UserService($q, $http, $location) {
    var host = 'http://' + $location.host() + ':5000/';
}