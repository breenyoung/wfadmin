(function(){
    "use strict";

    function WorkOrderController($auth, $state, Restangular, RestService)
    {
        var self = this;

        RestService.getAllWorkOrders(self);
    }

    angular.module('app.controllers').controller('WorkOrderController', ['$auth', '$state', 'Restangular', 'RestService', WorkOrderController]);

})();
