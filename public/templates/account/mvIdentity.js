/**
 * Created by Mordekaiser on 08/06/16.
 */
"use strict";
angular.module('smartBusiness')
    .factory('mvIdentity', ['CookieStore', mvIdentity]);

function mvIdentity(CookieStore) {
    var currentUser = CookieStore.getCookie('user');
    return {
        currentUser: currentUser,
        isAuthenticated: function () {
            return !!this.currentUser;
        },
        isAuthorized: function (role) {
            return !!this.currentUser && this.currentUser.roles.indexOf(role) > -1;
        },
        isAdmin: function () {
            return !!this.currentUser && this.currentUser.roles.indexOf('admin') > -1;
        }
    }
}