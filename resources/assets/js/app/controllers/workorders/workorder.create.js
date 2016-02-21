(function(){
    "use strict";

    function WorkOrderCreateController($auth, $state, Restangular, RestService, $stateParams)
    {
        var self = this;

        self.createProduct = function()
        {
            console.log(self.workorder);

            var w = self.workorder;

            Restangular.all('workorder').post(w).then(function()
            {
                console.log("created");
                $state.go('app.workorders.detail', {'workOrderId': 1});

            });

        };

    }

    angular.module('app.controllers').controller('WorkOrderCreateController', ['$auth', '$state', 'Restangular', 'RestService', '$stateParams', WorkOrderCreateController]);

})();
