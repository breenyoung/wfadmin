(function(){
    "use strict";

    function WorkOrderController($auth, $state, Restangular, RestService)
    {
        var self = this;

        self.showIncompleteOnly = true;

        RestService.getAllWorkOrders(self);

        /*
        self.toggleComplete = function()
        {
            console.log('toggle');
            console.log(self.workorders);
        };
        */
    }

    angular.module('app.controllers').controller('WorkOrderController', ['$auth', '$state', 'Restangular', 'RestService', WorkOrderController]);

})();
