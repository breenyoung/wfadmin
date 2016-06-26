(function(){
    "use strict";

    function SalesChannelCreateController($auth, $state, ToastService, Restangular, $stateParams)
    {
        var self = this;

        self.createSalesChannel = function()
        {
            self.form1.$setSubmitted();

            var isValid = self.form1.$valid;
            //console.log(isValid);

            if(isValid)
            {
                //console.log(self.paymenttype);

                var c = self.saleschannel;

                Restangular.all('saleschannel').post(c).then(function(d)
                {
                    //console.log(d);
                    ToastService.show("Successfully created");
                    $state.go('app.saleschannels');

                }, function()
                {
                    ToastService.show("Error creating");
                });
            }
        };

    }

    angular.module('app.controllers').controller('SalesChannelCreateController', ['$auth', '$state', 'ToastService', 'Restangular', '$stateParams', SalesChannelCreateController]);

})();
