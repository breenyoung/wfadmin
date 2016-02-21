(function(){
    "use strict";

    function CustomerCreateController($auth, $state, Restangular, RestService, $stateParams)
    {
        var self = this;

        self.createCustomer = function()
        {
            console.log(self.customer);

            var c = self.customer;

            //Restangular.all('product').post(p).then(function()
            //{
            //console.log("created");
            $state.go('app.customers.detail', {'customerId': 1});


            //});

        };

    }

    angular.module('app.controllers').controller('CustomerCreateController', ['$auth', '$state', 'Restangular', 'RestService', '$stateParams', CustomerCreateController]);

})();
