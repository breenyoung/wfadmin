(function(){
    "use strict";

    function WorkOrderController($auth, $state, Restangular, RestService)
    {
        var self = this;

        RestService.getAllWorkOrders(self);

        self.showIncompleteOnly = true;

        console.log(self);

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
