/**
 * Created by Mordekaiser on 08/06/16.
 */
"use strict";
angular.module('smartBusiness').factory('CookieStore', function ($cookieStore) {
    return {
        setCookie: function (user) {
            $cookieStore.put('user', user);
        },
        getCookie: function () {
            $cookieStore.get('user');
        },
        removeCookie: function () {
            $cookieStore.remove('user');
        }
    }
});