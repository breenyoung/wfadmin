(function(){
    "use strict";

    function WorkOrderCreateController($auth, $state, Restangular, $moment, RestService, $stateParams)
    {
        var self = this;

        RestService.getAllCustomers(self);
        RestService.getAllProducts(self);

        self.createWorkOrder = function()
        {

            //Tue Feb 02 2016 00:00:00 GMT-0400 (Atlantic Standard Time)
            console.log(self.workorder);

            var w = self.workorder;

            Restangular.all('workorder').post(w).then(function()
            {
                console.log("created");
                //$state.go('app.workorders.detail', {'workOrderId': 1});
                $state.go('app.workorders');

            });

        };

    }

    angular.module('app.controllers').controller('WorkOrderCreateController', ['$auth', '$state', 'Restangular', '$moment', 'RestService', '$stateParams', WorkOrderCreateController]);

})();
