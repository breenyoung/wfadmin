(function(){
    "use strict";

    function ReportController($scope, $auth, $state, $moment, Restangular, RestService, ChartService)
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
        else if($state.is('app.reports.incomebymonth'))
        {
            showIncomeReportByMonthView();
        }
        else if($state.is('app.reports.productprofitpercents'))
        {
            showProductProfitPercents();
        }
        else if($state.is('app.reports.weekworkorders'))
        {
            showWeeklyWorkOrders();
        }
        else if($state.is('app.reports.aos'))
        {
            showAosReport();
        }
        else
        {
            // Report home
            //console.log($state.is('app.reports'));
            showDashboardWidgets();
        }


        function showProductProfitPercents()
        {
            ChartService.getProductProfitPercents(self);
        }

        function showWeeklyWorkOrders()
        {

            RestService.getAllWorkOrderTasks().then(function(data)
            {
                self.workordertasks = data;
            });

            Restangular.one('reports/getWeekWorkOrderReport').get().then(function(data)
                {
                    // More Hostgator shit
                    for(var i = 0; i < data.length; i++)
                    {
                        var wo = data[i];
                        for(var j = 0; j < wo.work_order_progress.length; j++)
                        {
                            wo.work_order_progress[j].work_order_id = parseInt(wo.work_order_progress[j].work_order_id);
                            wo.work_order_progress[j].work_order_task_id = parseInt(wo.work_order_progress[j].work_order_task_id);
                        }
                    }

                    //console.log(data);
                    self.weekworkorders = data;

                },
                function()
                {
                    // Error
                });
        }

        function generateCurrentStockReport()
        {
            console.log("Generate stock rerport");
        }

        function showSalesReportView()
        {
            RestService.getAllCustomers(self);
            RestService.getAllProducts(self);
        }

        function showDashboardWidgets()
        {
            getOverduePurchaseOrders(self);
            getMonthlyIncome(self);
            getOutstandingPayments(self);
            getPendingApprovalWorkOrders(self);

            self.dayreports = [];
            self.daily_sales_from_date = moment().subtract(7, 'days').toDate();
            self.daily_sales_to_date = moment().toDate();
        }

        function showSalesReportByMonthView()
        {
            ChartService.getMonthlySalesReport(self);
        }

        function showIncomeReportByMonthView()
        {
            ChartService.getMonthlyIncomeReport(self);
        }

        function showAosReport()
        {

        }

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

        function getOverduePurchaseOrders(scope)
        {
            Restangular.one('reports/getOverduePurchaseOrders').get().then(function(data)
            {
                self.overduePurchaseOrders = data;
                //self.poCount = data.length;

                console.log(data);
            },
            function()
            {
                // Error
            });
        }

        function getPendingApprovalWorkOrders(scope)
        {
            Restangular.one('reports/getPendingApprovalWorkOrders').get().then(function(data)
                {
                    self.pendingApprovalWorkOrders = data;
                    //self.poCount = data.length;

                    console.log(data);
                },
                function()
                {
                    // Error
                });
        }

        function getMonthlyIncome(scope)
        {
            Restangular.all('reports/getMonthlySalesReport').post({ 'reportParams': {}}).then(function(data)
                {
                    scope.monthlyIncomes = data;
                    if(scope.monthlyIncomes.length > 0)
                    {
                        var l = scope.monthlyIncomes.length;
                        var d = new Date(scope.monthlyIncomes[l-1].year, scope.monthlyIncomes[l-1].month - 1, 1);
                        scope.curMonthlyIncomeMonth = d;
                        scope.curMonthlyIncomeTotal = scope.monthlyIncomes[l-1].monthtotal;
                        scope.curMonthlyIncomePos = l - 1;
                    }
                },
                function()
                {
                    // Error
                });
        }

        function getOutstandingPayments(scope)
        {
            Restangular.one('reports/getOutstandingPayments').get().then(function(data)
                {
                    //console.log(data);
                    scope.outstandingPayments = data;
                    if(scope.outstandingPayments.length > 0)
                    {
                        var d = new Date(scope.outstandingPayments[0].year, scope.outstandingPayments[0].month - 1, 1);
                        scope.curMonthlyOutstandingMonth = d;
                        scope.curMonthlyOustandingTotal = scope.outstandingPayments[0].outstanding;
                        scope.curMonthlyOutstandingPos = 0;
                    }
                },
                function()
                {
                    // Error
                });
        }

        self.changeMonthlyOutstanding = function(increment)
        {
            self.curMonthlyOutstandingPos += increment;

            if((self.curMonthlyOutstandingPos < 0)) { self.curMonthlyOutstandingPos = 0; }
            else if((self.curMonthlyOutstandingPos + 1) > self.outstandingPayments.length) { self.curMonthlyOutstandingPos = self.outstandingPayments.length - 1; }

            if(self.curMonthlyOutstandingPos >= 0 && (self.curMonthlyOutstandingPos + 1) <= self.outstandingPayments.length)
            {
                var d = new Date(self.outstandingPayments[self.curMonthlyOutstandingPos].year, self.outstandingPayments[self.curMonthlyOutstandingPos].month - 1, 1);

                self.curMonthlyOutstandingMonth = d;
                self.curMonthlyOustandingTotal = self.outstandingPayments[self.curMonthlyOutstandingPos].outstanding;
            }
        };

        self.changeMonthlyIncome = function(increment)
        {
            //console.log('Len:' + self.monthlyIncomes.length);

            //console.log(self.curMonthlyIncomePos);
            self.curMonthlyIncomePos += increment;

            if((self.curMonthlyIncomePos < 0)) { self.curMonthlyIncomePos = 0; }
            else if((self.curMonthlyIncomePos + 1) > self.monthlyIncomes.length) { self.curMonthlyIncomePos = self.monthlyIncomes.length - 1; }

            //console.log(self.curMonthlyIncomePos);

            if(self.curMonthlyIncomePos >= 0 && (self.curMonthlyIncomePos + 1) <= self.monthlyIncomes.length)
            {
                var d = new Date(self.monthlyIncomes[self.curMonthlyIncomePos].year, self.monthlyIncomes[self.curMonthlyIncomePos].month - 1, 1);

                self.curMonthlyIncomeMonth = d;
                self.curMonthlyIncomeTotal = self.monthlyIncomes[self.curMonthlyIncomePos].monthtotal;
            }

        };

        self.setPoTotal = function(item)
        {
            console.log(item);
            if(item)
            {
                self.poTotal += parseFloat(item.total);
            }
        };

        self.getDailySalesCsv = function(e)
        {
            console.log(self.daily_sales_from_date);
            console.log(self.daily_sales_to_date);


            self.reportParams.daily_sales_from_date  = self.daily_sales_from_date;
            self.reportParams.daily_sales_to_date  = self.daily_sales_to_date;

            Restangular.all('reports/getDailySales').post({ 'reportParams': self.reportParams}).then(function(data)
            {
                console.log(data);
                self.dayreports = data;
                //console.log(self.results[0]);
            },
            function()
            {
                // Error
            });


        };

        self.getSalesChannels = function(e)
        {
            console.log(self.sales_channel_from_date);
            console.log(self.sales_channel_to_date);


            self.reportParams.sales_channel_from_date  = self.sales_channel_from_date;
            self.reportParams.sales_channel_to_date  = self.sales_channel_to_date;

            Restangular.all('reports/getSalesChannelReport').post({ 'reportParams': self.reportParams}).then(function(data)
                {
                    console.log(data);
                    self.channelreports = data;
                    //console.log(self.results[0]);
                },
                function()
                {
                    // Error
                });
        };

    }

    angular.module('app.controllers').controller('ReportController', ['$scope', '$auth', '$state', '$moment', 'Restangular', 'RestService', 'ChartService', ReportController]);

})();
