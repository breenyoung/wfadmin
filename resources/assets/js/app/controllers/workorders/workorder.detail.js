(function(){
    "use strict";

    function WorkOrderDetailController($auth, $state, Restangular, RestService, $stateParams)
    {
        var self = this;

        //console.log($stateParams);
        RestService.getWorkOrder(self, $stateParams.workOrderId);

        self.updateWorkOrder = function()
        {
            self.workorder.put().then(function()
            {
                console.log("updated");
            }, function()
            {
                console.log("error updating");
            });
        };

        self.deleteWorkOrder = function()
        {
            self.workorder.remove().then(function()
            {
                console.log("deelted");
            });

            $state.go("app.workorders");
        };

    }

    angular.module('app.controllers').controller('WorkOrderDetailController', ['$auth', '$state', 'Restangular', 'RestService', '$stateParams', WorkOrderDetailController]);

})();
