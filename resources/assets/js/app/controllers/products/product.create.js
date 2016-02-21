(function(){
    "use strict";

    function ProductCreateController($auth, $state, Restangular, RestService, $stateParams)
    {
        var self = this;

        self.createProduct = function()
        {
            console.log(self.product);

            var p = self.product;

            //Restangular.all('product').post(p).then(function()
            //{
                //console.log("created");
                $state.go('app.products.detail', {'productId': 1});

            //});

        };

    }

    angular.module('app.controllers').controller('ProductCreateController', ['$auth', '$state', 'Restangular', 'RestService', '$stateParams', ProductCreateController]);

})();
