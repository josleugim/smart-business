/**
 * Created by Mordekaiser on 08/06/16.
 */
"use strict";
angular.module('smartBusiness')
    .factory('AuthToken', ['$window', AuthToken]);

function AuthToken($window) {
    var storage = $window.localStorage;
    var cachedToken;
    var userToken = 'userToken';

    var AuthToken = {
        setToken: function(token) {
            cachedToken = token;
            storage.setItem(userToken, angular.toJson(token));
        },
        getToken: function() {
            if(!cachedToken)
                cachedToken = storage.getItem(userToken);

            if(typeof cachedToken == 'string')
                return JSON.parse(cachedToken);
            else
                return cachedToken;
        },
        isAuthenticated: function() {
            return !!this.getToken();
        },
        removeToken: function() {
            cachedToken = null;
            storage.removeItem(userToken);
        },
        isAuthorized: function (validRoles) {
            var auth = false;
            var user = this.getToken();
            if(user) {
                angular.forEach(user.roles, function (usrRole, key) {
                    if(validRoles.indexOf(usrRole) !== -1)
                        auth = true;
                });
            }

            return !!user && auth;
        }
    };

    return AuthToken;
}