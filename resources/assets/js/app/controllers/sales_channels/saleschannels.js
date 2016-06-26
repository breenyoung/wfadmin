(function(){
    "use strict";

    function SalesChannelController(RestService)
    {
        var self = this;

        RestService.getAllSalesChannels(self).then(function(data)
        {
            self.saleschannels = data;
        });

    }

    angular.module('app.controllers').controller('SalesChannelController', ['RestService', SalesChannelController]);

})();
