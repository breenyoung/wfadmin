(function(){
    "use strict";

    function ProductDetailController($auth, $state, Restangular, RestService, $stateParams)
    {
        var self = this;

        //console.log($stateParams);
        RestService.getProduct(self, $stateParams.productId);

        self.updateProduct = function()
        {

        };

    }

    angular.module('app.controllers').controller('ProductDetailController', ['$auth', '$state', 'Restangular', 'RestService', '$stateParams', ProductDetailController]);

})();
