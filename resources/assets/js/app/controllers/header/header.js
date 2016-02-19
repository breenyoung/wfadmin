(function(){
    "use strict";

    function HeaderController($auth)
    {
        var self = this;

        self.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };
    }

    angular.module('app.controllers').controller('HeaderController', ['$auth', HeaderController]);

})();