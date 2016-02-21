(function(){
    "use strict";

    function ProductDetailController($auth, $state, Restangular, RestService, $stateParams)
    {
        var self = this;

        //console.log($stateParams);
        RestService.getProduct(self, $stateParams.productId);

        self.updateProduct = function()
        {
            //RestService.updateProduct(self, self.product.id);
            self.product.put().then(function()
            {
                console.log("updated");
            }, function()
            {
                console.log("error updating");
            });
        };

        self.deleteProduct = function()
        {
            self.product.remove().then(function()
            {
                console.log("deelted");
            });

            $state.go("app.products");
        };

    }

    angular.module('app.controllers').controller('ProductDetailController', ['$auth', '$state', 'Restangular', 'RestService', '$stateParams', ProductDetailController]);

})();
