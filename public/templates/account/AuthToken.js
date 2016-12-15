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
        isAuthorized: function (role) {
            var user = this.getToken();
            return !!user && user.roles.indexOf(role) > -1;
        }
    };

    return AuthToken;
}