(function(){
    "use strict";

    angular.module('app.controllers').controller('HeaderController', ['$auth', function($auth)
    {
        var self = this;

        self.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };
    }]);

})();