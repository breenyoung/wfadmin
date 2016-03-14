(function(){
    "use strict";

    function ReportController($auth, $state, Restangular, RestService, ChartService)
    {
        var self = this;

        self.reportParams = {};

        if($state.is('app.reports.currentstock'))
        {
            generateCurrentStockReport();
        }
        else if($state.is('app.reports.sales'))
        {
            showSalesReportView();
        }
        else if($state.is('app.reports.salesbymonth'))
        {
            showSalesReportByMonthView();
        }
        else
        {
            // Report home
            //console.log($state.is('app.reports'));
            showDashboardWidgets();
        }

        function generateCurrentStockReport()
        {
            console.log("Generate stock rerport");
        };

        function showSalesReportView()
        {
            RestService.getAllCustomers(self);
            RestService.getAllProducts(self);
        };

        function showDashboardWidgets()
        {
            ChartService.getTopSellingProducts(self, 'Top Selling All Time');
            ChartService.getWorstSellingProducts(self, 'Worst Selling All Time');
        };

        function showSalesReportByMonthView()
        {
            ChartService.getMonthlySalesReport(self);
        };

        self.getSalesReport = function()
        {
            console.log(self.reportParams);
            self.poTotal = 0;
            self.poCount = 0;

            Restangular.all('reports/getSalesReport').post({ 'reportParams': self.reportParams}).then(function(data)
            {
                self.results = data;
                self.poCount = data.length;

                //console.log(self.results[0]);
            },
            function()
            {
                // Error
            });
        };

        self.setPoTotal = function(item)
        {
            console.log(item);
            if(item)
            {
                self.poTotal += parseFloat(item.total);
            }
        };


    }

    angular.module('app.controllers').controller('ReportController', ['$auth', '$state', 'Restangular', 'RestService', 'ChartService', ReportController]);

})();
