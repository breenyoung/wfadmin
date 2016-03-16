(function(){
    "use strict";

    function WorkOrderCreateController($auth, $state, Restangular, ToastService, $moment, RestService, ValidationService, $stateParams)
    {
        var self = this;

        RestService.getAllCustomers(self);
        RestService.getAllProducts(self);

        self.numericRegex = ValidationService.numericRegex();

        self.createWorkOrder = function()
        {
            self.form1.$setSubmitted();

            var isValid = self.form1.$valid;
            //console.log(isValid);

            if(isValid)
            {
                //console.log(self.workorder);

                var w = self.workorder;

                Restangular.all('workorder').post(w).then(function()
                {
                    ToastService.show("Successfully created");
                    //$state.go('app.workorders.detail', {'workOrderId': 1});
                    $state.go('app.workorders');

                });
            }
        };
    }

    angular.module('app.controllers').controller('WorkOrderCreateController', ['$auth', '$state', 'Restangular', 'ToastService', '$moment', 'RestService', 'ValidationService', '$stateParams', WorkOrderCreateController]);

})();
