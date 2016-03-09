(function(){
    "use strict";

    function ReportController($auth, $state, Restangular, RestService)
    {
        var self = this;

        if($state.is('app.reports.currentstock'))
        {
            generateCurrentStockReport();
        }
        else
        {
            // Report home
            console.log($state.is('app.reports'));
        }

        function generateCurrentStockReport()
        {
            self.message = 'hi there';
            console.log("Generate stock rerport");
        };


    }

    angular.module('app.controllers').controller('ReportController', ['$auth', '$state', '$scope', 'Restangular', 'RestService', ReportController]);

})();
