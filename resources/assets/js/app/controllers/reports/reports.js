(function(){
    "use strict";

    function ReportController($auth, $state, Restangular, RestService)
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
            self.topSellingChartConfig = {
                options: {
                    chart: {
                        type: 'pie'
                    },
                    plotOptions:
                    {
                        pie:
                        {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels:
                            {
                                enabled: true
                            }
                        }
                    }
                },

                title: {
                    text: 'Top selling products all time'
                },

                loading: true
            };

            Restangular.one('reports/getTopSellingProducts').get().then(function(data)
            {
                var dataSet = [];
                for(var i = 0; i < data.length; i++)
                {
                    var oneDataPoint = data[i];
                    console.log(oneDataPoint);
                        dataSet.push({
                            name: oneDataPoint.name,
                            selected: (i === 0) ? true : false,
                            sliced: (i === 0) ? true : false,
                            y: parseInt(oneDataPoint.pcount)
                        });
                }

                self.topSellingChartConfig.series = [{name: 'Sold', data: dataSet }];

                self.topSellingChartConfig.loading = false;

            },
            function()
            {
                // Error
            });

        };

        function showSalesReportByMonthView()
        {

            self.chartConfig = {
                options: {
                    chart: {
                        type: 'column'
                    },
                    yAxis:
                    {
                        min: 0,
                        title:
                        {
                            text: '# of sales'
                        }
                    },
                    xAxis:
                    {
                        type: 'datetime',
                        dateTimeLabelFormats:
                        {
                            month: '%b',
                            year: '%b'
                        },
                        title:
                        {
                            text: 'Date'
                        }
                    },
                    tooltip:
                    {

                    }
                },

                title: {
                    text: 'Sales per month'
                },

                loading: true
            };

            Restangular.all('reports/getMonthlySalesReport').post({ 'reportParams': {}}).then(function(data)
            {
                    var dataSet = [];
                    for(var i = 0; i < data.length; i++)
                    {
                        var oneDataPoint = data[i];
                        console.log(oneDataPoint);
                        dataSet.push([Date.UTC(parseInt(oneDataPoint.year), parseInt(oneDataPoint.month) - 1), parseInt(oneDataPoint.pocount)]);
                    }

                    self.chartConfig.series = [{name: 'Sales this month', data: dataSet }];

                    self.chartConfig.loading = false;

            },
            function()
            {
                // Error
            });
        };

        self.swapChartType = function ()
        {
            if (self.chartConfig.options.chart.type === 'line')
            {
                self.chartConfig.options.chart.type = 'bar';
            }
            else
            {
                self.chartConfig.options.chart.type = 'line';
                self.chartConfig.options.chart.zoomType = 'x';
            }
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

        self.setPoTotal = function(item)
        {
            console.log(item);
            if(item)
            {
                self.poTotal += parseFloat(item.total);
            }
        };


    }

    angular.module('app.controllers').controller('ReportController', ['$auth', '$state', 'Restangular', 'RestService', ReportController]);

})();
