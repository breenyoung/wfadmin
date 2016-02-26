(function(){
    "use strict";

    function CustomerCreateController($auth, $state, ToastService, Restangular, RestService, $stateParams)
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
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams)
            {
                console.log("$stateChangeSuccess fired");
            });

            //});

        };

    }

    angular.module('app.controllers').controller('CustomerCreateController', ['$auth', '$state', 'ToastService', 'Restangular', 'RestService', '$stateParams', CustomerCreateController]);

})();
