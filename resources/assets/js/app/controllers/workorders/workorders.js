(function(){
    "use strict";

    function WorkOrderController($auth, $state, Restangular, RestService)
    {
        var self = this;

        self.showComplete = false;

        RestService.getAllWorkOrders(self);



        console.log(self);


        self.toggleCompleteOnly = function(cbState)
        {
            console.log('toggle');
            console.log(cbState);
        };

    }

    angular.module('app.controllers').controller('WorkOrderController', ['$auth', '$state', 'Restangular', 'RestService', WorkOrderController]);

})();
