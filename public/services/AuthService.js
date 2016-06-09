/**
 * Created by Mordekaiser on 08/06/16.
 */
"use strict";
angular.module('smartBusiness')
    .factory('AuthService', ['$q', '$http', '$location', 'mvIdentity', 'CookieStore', AuthService]);

function AuthService($q, $http, $location, mvIdentity, CookieStore) {
    var host = 'http://' + $location.host() + ':5000/';
    return {
        authenticate: loginUser,
        logout: logoutUser,
        authUserRoute: authorizeCurrentUserForRoute
    };

    function loginUser(query) {
        var dfd = $q.defer();
        $http({
            method: 'POST',
            url: host + 'api/v1/login',
            params: query,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {
            if(response.data.success) {
                console.log(response.data.user);
                CookieStore.setCookie(response.data.user);
                dfd.resolve(true);
            }
        }, function errorCallback() {
            dfd.resolve(false);
        });

        return dfd.promise;
    }

    function logoutUser() {

    }

    function authorizeCurrentUserForRoute() {
        
    }
}