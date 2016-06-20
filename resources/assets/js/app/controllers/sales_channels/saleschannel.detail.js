(function(){
    "use strict";

    function SalesChannelDetailController($auth, $state, ToastService, RestService, DialogService, $stateParams)
    {
        var self = this;

        //console.log($stateParams);
        RestService.getSalesChannel($stateParams.salesChannelId).then(function(data)
        {
            self.saleschannel = data;
        });

        self.updateSalesChannel = function()
        {
            self.form1.$setSubmitted();

            var isValid = self.form1.$valid;
            //console.log(isValid);

            if(isValid)
            {
                self.saleschannel.put().then(function()
                {
                    ToastService.show("Successfully updated");
                    $state.go("app.saleschannels");

                }, function()
                {
                    ToastService.show("Error updating");
                    console.log("error updating");
                });
            }

        };

        self.deleteSalesChannel = function()
        {
            self.saleschannel.remove().then(function()
            {
                ToastService.show("Successfully deleted");
                $state.go("app.saleschannels");
            }, function()
            {
                ToastService.show("Error Deleting");
            });


        };

        self.showDeleteConfirm = function(ev)
        {
            var dialog = DialogService.confirm(ev, 'Delete sales channel?', '');
            dialog.then(function()
                {
                    self.deleteSalesChannel();
                },
                function()
                {
                });
        };

    }

    angular.module('app.controllers').controller('SalesChannelDetailController', ['$auth', '$state', 'ToastService', 'RestService', 'DialogService', '$stateParams', SalesChannelDetailController]);

})();
