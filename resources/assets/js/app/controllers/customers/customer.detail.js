(function(){
    "use strict";

    function CustomerDetailController($auth, $state, Restangular, RestService, $stateParams)
    {
        var self = this;

        //console.log($stateParams);
        RestService.getCustomer(self, $stateParams.customerId);

        self.updateCustomer = function()
        {
            self.customer.put().then(function()
            {
                console.log("updated");
            }, function()
            {
                console.log("error updating");
            });
        };

        self.deleteCustomer = function()
        {
            self.customer.remove().then(function()
            {
                console.log("deelted");
            });

            $state.go("app.customers");
        };

    }

    angular.module('app.controllers').controller('CustomerDetailController', ['$auth', '$state', 'Restangular', 'RestService', '$stateParams', CustomerDetailController]);

})();
