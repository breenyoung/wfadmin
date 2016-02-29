(function(){
    "use strict";

    function EventDetailController($auth, $state, Restangular, RestService, $stateParams, ToastService, DialogService)
    {
        var self = this;

        //console.log($stateParams);
        RestService.getEvent(self, $stateParams.eventId);
        RestService.getAllProducts(self);


        self.updateEvent = function()
        {
            //RestService.updateProduct(self, self.product.id);
            self.event.put().then(function()
            {
                //console.log("updated");
                ToastService.show("Successfully updated");
            }, function()
            {
                console.log("error updating");
            });
        };

        self.deleteEvent = function()
        {
            self.event.remove().then(function()
            {
                console.log("deelted");
            });

            $state.go("app.events");
        };

        self.showDeleteConfirm = function(ev)
        {
            var dialog = DialogService.confirm(ev, 'Delete event?', '')
            dialog.then(function()
                {
                    self.deleteEvent();
                },
                function()
                {
                });
        };

    }

    angular.module('app.controllers').controller('EventDetailController', ['$auth', '$state', 'Restangular', 'RestService', '$stateParams', 'ToastService', 'DialogService', EventDetailController]);

})();
