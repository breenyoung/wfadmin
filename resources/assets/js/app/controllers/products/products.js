(function(){
    "use strict";

    angular.module('app.controllers').controller('ProductController', ['$auth', '$state', 'Restangular', 'RestService', function($auth, $state, Restangular, RestService)
    {
        var self = this;

        RestService.getAllProducts(self);


    }]);

})();
