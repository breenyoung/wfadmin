(function(){
    "use strict";

    function ProductCreateController($auth, $state, Restangular, RestService, $stateParams)
    {
        var self = this;

        self.product = {};

        self.createProduct = function()
        {
            console.log(self.product);

            var p = self.product;

            //console.log($error);

            Restangular.all('product').post(p).then(function(d)
            {
                console.log(d);
                $state.go('app.products.detail', {'productId': d.newId});

            });

        };

    }

    angular.module('app.controllers').controller('ProductCreateController', ['$auth', '$state', 'Restangular', 'RestService', '$stateParams', ProductCreateController]);

})();
