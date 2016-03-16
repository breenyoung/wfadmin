(function(){
    "use strict";

    function WorkOrderDetailController($auth, $state, ToastService, Restangular, RestService, DialogService, ValidationService, $moment, $stateParams)
    {
        var self = this;

        //console.log($stateParams);
        RestService.getWorkOrder(self, $stateParams.workOrderId);
        RestService.getAllCustomers(self);
        RestService.getAllProducts(self);

        self.numericRegex = ValidationService.numericRegex();

        self.toggleComplete = function(cbState)
        {
            console.log(cbState);
            //if(cbState) { self.workorder.completed = 1; }
            //else { self.workorder.completed = 0; }
        };

        self.updateWorkOrder = function()
        {
            self.form1.$setSubmitted();

            var isValid = self.form1.$valid;
            //console.log(isValid);

            if(isValid)
            {
                self.workorder.put().then(function()
                {
                    ToastService.show("Successfully updated");
                    $state.go("app.workorders");
                }, function()
                {
                    ToastService.show("Error updating");
                });
            }
        };

        self.deleteWorkOrder = function()
        {
            self.workorder.remove().then(function()
            {
                ToastService.show("Successfully deleted");
                $state.go("app.workorders");
            }, function()
            {
                ToastService.show("Error deleting");
            });
        };

        self.showDeleteConfirm = function(ev)
        {
            var dialog = DialogService.confirm(ev, 'Delete work order?', '');
            dialog.then(function()
                {
                    self.deleteWorkOrder();
                },
                function()
                {
                });
        };

    }

    angular.module('app.controllers').controller('WorkOrderDetailController', ['$auth', '$state', 'ToastService', 'Restangular', 'RestService', 'DialogService', 'ValidationService', '$moment', '$stateParams', WorkOrderDetailController]);

})();
