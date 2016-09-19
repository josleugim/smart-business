"use strict";
angular.module('smartBusiness').value('mvToastr', toastr);

angular.module('smartBusiness').factory('mvNotifier', function (mvToastr) {
    return {
        notify: function (msg) {
            mvToastr.success(msg);
        },
        error: function (msg) {
            mvToastr.error(msg);
        }
    }
});