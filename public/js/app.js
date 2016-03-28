(function(){
    "use strict";

    var app = angular.module('app',
        [
            'app.controllers',
            'app.filters',
            'app.services',
            'app.directives',
            'app.routes',
            'app.config'
        ]);

    angular.module('app.services', ['ui.router', 'satellizer', 'restangular', 'angular-momentjs', 'ngMaterial', 'ngFileUpload']);
    angular.module('app.routes', ['ui.router', 'satellizer']);
    angular.module('app.controllers', ['ui.router', 'ngMaterial', 'restangular', 'angular-momentjs', 'app.services', 'ngMessages', 'ngMdIcons', 'md.data.table', 'highcharts-ng', 'ngCookies']);
    angular.module('app.filters', []);

    angular.module('app.directives', ['angular-momentjs']);
    angular.module('app.config', []);

    //-------------------------------------------------------
    // Configuration stuff
    //-------------------------------------------------------

    angular.module('app.config').config(["$authProvider", function ($authProvider)
    {
        // Satellizer configuration that specifies which API
        // route the JWT should be retrieved from
        $authProvider.loginUrl = '/api/authenticate';
    }]);

    angular.module('app.config').config(["$momentProvider", function ($momentProvider)
    {
        $momentProvider
            .asyncLoading(false)
            .scriptUrl('//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min.js');
    }]);

    angular.module('app.config').config( ["RestangularProvider", function(RestangularProvider) {
        RestangularProvider
            .setBaseUrl('/api/')
            .setDefaultHeaders({ accept: "application/x.laravel.v1+json" });
    }]);

    angular.module('app.config').config( ["$mdThemingProvider", function($mdThemingProvider) {
        /* For more info, visit https://material.angularjs.org/#/Theming/01_introduction */

        var customBlueMap = $mdThemingProvider.extendPalette('light-blue',
        {
            'contrastDefaultColor': 'light',
            'contrastDarkColors': ['50'],
            '50': 'ffffff'
        });

        $mdThemingProvider.definePalette('customBlue', customBlueMap);
        $mdThemingProvider.theme('default')
            .primaryPalette('customBlue',
            {
                'default': '500',
                'hue-1': '50'
            })
            .accentPalette('pink');

    }]);

    angular.module('app.config').config(["$mdDateLocaleProvider", function($mdDateLocaleProvider)
    {
        $mdDateLocaleProvider.formatDate = function(date)
        {
            if(date !== undefined)
            {
                return moment(date).format('MM-DD-YYYY');
            }

            return '';
        };
    }]);

    // Check for authenticated user on every request
    app.run(['$rootScope', '$location', '$state', 'AuthService', function ($rootScope, $location, $state, AuthService) {

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options)
        {
            //console.log('Attempting to get url: [' + toState.name + ']');
            // Let anyone go to the login page, check auth on all other pages
            if(toState.name !== 'app.login')
            {
                if(!AuthService.isAuthenticated())
                {
                    console.log("user not logged in, redirect to login page");
                    event.preventDefault();
                    $state.go('app.login');
                }
            }
        });
    }]);

})();
(function()
{
    "use strict";
    angular.module('app.routes').config( ["$stateProvider", "$urlRouterProvider", "$authProvider", function($stateProvider, $urlRouterProvider, $authProvider ) {

        var getView = function( viewName ){
            return '/views/app/' + viewName + '.html';
        };

        $urlRouterProvider.otherwise('/purchaseorders');


        $stateProvider
            .state('app', {
                abstract: true,
                views: {
                    header: {
                        templateUrl: getView('header'),
                        controller: 'HeaderController',
                        controllerAs: 'ctrlHeader'
                    },
                    footer: {
                        templateUrl: getView('footer'),
                        controller: 'FooterController',
                        controllerAs: 'ctrlFooter'
                    },
                    main: {}
                }
            })
            .state('app.login', {
                url: '/login',
                views: {
                    'main@': {
                        templateUrl: getView('login'),
                        controller: 'LoginController',
                        controllerAs: 'ctrlLogin'
                    }
                }
            })
            .state('app.landing', {
                url: '/landing',
                views: {
                    'main@': {
                        templateUrl: getView('landing'),
                        controller: 'LandingController',
                        controllerAs: 'ctrlLanding'
                    }
                }
            })
            .state('app.products', {
                url: '/products',
                views: {
                    'main@': {
                        templateUrl: getView('products'),
                        controller: 'ProductController',
                        controllerAs: 'ctrlProduct'
                    }
                }
            })
            .state('app.products.detail', {
                url: '/detail/:productId',
                views: {
                    'main@': {
                        templateUrl: getView('product.detail'),
                        controller: 'ProductDetailController',
                        controllerAs: 'ctrlProductDetail'
                    }
                }
            })
            .state('app.products.create', {
                url: '/create',
                views: {
                    'main@': {
                        templateUrl: getView('product.create'),
                        controller: 'ProductCreateController',
                        controllerAs: 'ctrlProductCreate'
                    }
                }
            })
            .state('app.customers', {
                url: '/customers',
                views: {
                    'main@': {
                        templateUrl: getView('customers'),
                        controller: 'CustomerController',
                        controllerAs: 'ctrlCustomer'
                    }
                }
            })
            .state('app.customers.create', {
                url: '/create',
                views: {
                    'main@': {
                        templateUrl: getView('customer.create'),
                        controller: 'CustomerCreateController',
                        controllerAs: 'ctrlCustomerCreate'
                    }
                }
            })
            .state('app.customers.detail', {
                url: '/detail/:customerId',
                views: {
                    'main@': {
                        templateUrl: getView('customer.detail'),
                        controller: 'CustomerDetailController',
                        controllerAs: 'ctrlCustomerDetail'
                    }
                }
            })
            .state('app.workorders', {
                url: '/workorders',
                views: {
                    'main@': {
                        templateUrl: getView('workorders'),
                        controller: 'WorkOrderController',
                        controllerAs: 'ctrlWorkOrder'
                    }
                }
            })
            .state('app.workorders.create', {
                url: '/create',
                views: {
                    'main@': {
                        templateUrl: getView('workorder.create'),
                        controller: 'WorkOrderCreateController',
                        controllerAs: 'ctrlWorkOrderCreate'
                    }
                }
            })
            .state('app.workorders.detail', {
                url: '/detail/:workOrderId',
                views: {
                    'main@': {
                        templateUrl: getView('workorder.detail'),
                        controller: 'WorkOrderDetailController',
                        controllerAs: 'ctrlWorkOrderDetail'
                    }
                }
            })
            .state('app.events', {
                url: '/events',
                views: {
                    'main@': {
                        templateUrl: getView('events'),
                        controller: 'EventController',
                        controllerAs: 'ctrlEvent'
                    }
                }
            })
            .state('app.events.create', {
                url: '/create',
                views: {
                    'main@': {
                        templateUrl: getView('event.create'),
                        controller: 'EventCreateController',
                        controllerAs: 'ctrlEventCreate'
                    }
                }
            })
            .state('app.events.detail', {
                url: '/detail/:eventId',
                views: {
                    'main@': {
                        templateUrl: getView('event.detail'),
                        controller: 'EventDetailController',
                        controllerAs: 'ctrlEventDetail'
                    }
                }
            })
            .state('app.reports', {
                url: '/reports',
                views: {
                    'main@': {
                        templateUrl: getView('reports'),
                        controller: 'ReportController',
                        controllerAs: 'ctrlReport'
                    }
                }
            })
            .state('app.reports.currentstock', {
                url: '/currentstock',
                views: {
                    'main@': {
                        templateUrl: getView('report.currentstock'),
                        controller: 'ReportController',
                        controllerAs: 'ctrlReport'
                    }
                }
            })
            .state('app.reports.sales', {
                url: '/sales',
                views: {
                    'main@': {
                        templateUrl: getView('report.sales'),
                        controller: 'ReportController',
                        controllerAs: 'ctrlReport'
                    }
                }
            })
            .state('app.reports.salesbymonth', {
                url: '/salesbymonth',
                views: {
                    'main@': {
                        templateUrl: getView('report.salesbymonth'),
                        controller: 'ReportController',
                        controllerAs: 'ctrlReport'
                    }
                }
            })
            .state('app.reports.incomebymonth', {
                url: '/incomebymonth',
                views: {
                    'main@': {
                        templateUrl: getView('report.incomebymonth'),
                        controller: 'ReportController',
                        controllerAs: 'ctrlReport'
                    }
                }
            })
            .state('app.reports.productprofitpercents', {
                url: '/productprofitpercents',
                views: {
                    'main@': {
                        templateUrl: getView('report.productprofitpercents'),
                        controller: 'ReportController',
                        controllerAs: 'ctrlReport'
                    }
                }
            })
            .state('app.reports.weekworkorders', {
                url: '/weekworkorders',
                views: {
                    'main@': {
                        templateUrl: getView('report.weekworkorders'),
                        controller: 'ReportController',
                        controllerAs: 'ctrlReport'
                    }
                }
            })
            .state('app.units', {
                url: '/units',
                views: {
                    'main@': {
                        templateUrl: getView('units'),
                        controller: 'UnitController',
                        controllerAs: 'ctrlUnit'
                    }
                }
            })
            .state('app.units.create', {
                url: '/create',
                views: {
                    'main@': {
                        templateUrl: getView('unit.create'),
                        controller: 'UnitCreateController',
                        controllerAs: 'ctrlUnitCreate'
                    }
                }
            })
            .state('app.units.detail', {
                url: '/detail/:unitId',
                views: {
                    'main@': {
                        templateUrl: getView('unit.detail'),
                        controller: 'UnitDetailController',
                        controllerAs: 'ctrlUnitDetail'
                    }
                }
            })
            .state('app.materials', {
                url: '/materials',
                views: {
                    'main@': {
                        templateUrl: getView('materials'),
                        controller: 'MaterialController',
                        controllerAs: 'ctrlMaterial'
                    }
                }
            })
            .state('app.materials.create', {
                url: '/create',
                views: {
                    'main@': {
                        templateUrl: getView('material.create'),
                        controller: 'MaterialCreateController',
                        controllerAs: 'ctrlMaterialCreate'
                    }
                }
            })
            .state('app.materials.detail', {
                url: '/detail/:materialId',
                views: {
                    'main@': {
                        templateUrl: getView('material.detail'),
                        controller: 'MaterialDetailController',
                        controllerAs: 'ctrlMaterialDetail'
                    }
                }
            })
            .state('app.purchaseorders', {
                url: '/purchaseorders',
                views: {
                    'main@': {
                        templateUrl: getView('purchaseorders'),
                        controller: 'PurchaseOrderController',
                        controllerAs: 'ctrlPurchaseOrder'
                    }
                }
            })
            .state('app.purchaseorders.create', {
                url: '/create',
                views: {
                    'main@': {
                        templateUrl: getView('purchaseorder.create'),
                        controller: 'PurchaseOrderCreateController',
                        controllerAs: 'ctrlPurchaseOrderCreate'
                    }
                }
            })
            .state('app.purchaseorders.detail', {
                url: '/detail/:purchaseOrderId',
                views: {
                    'main@': {
                        templateUrl: getView('purchaseorder.detail'),
                        controller: 'PurchaseOrderDetailController',
                        controllerAs: 'ctrlPurchaseOrderDetail'
                    }
                }
            })
            .state('app.paymenttypes', {
                url: '/paymenttypes',
                views: {
                    'main@': {
                        templateUrl: getView('paymenttypes'),
                        controller: 'PaymentTypeController',
                        controllerAs: 'ctrlPaymentType'
                    }
                }
            })
            .state('app.paymenttypes.create', {
                url: '/create',
                views: {
                    'main@': {
                        templateUrl: getView('paymenttype.create'),
                        controller: 'PaymentTypeCreateController',
                        controllerAs: 'ctrlPaymentTypeCreate'
                    }
                }
            })
            .state('app.paymenttypes.detail', {
                url: '/detail/:paymentTypeId',
                views: {
                    'main@': {
                        templateUrl: getView('paymenttype.detail'),
                        controller: 'PaymentTypeDetailController',
                        controllerAs: 'ctrlPaymentTypeDetail'
                    }
                }
            })
            .state('app.lookups', {
                url: '/lookups',
                views: {
                    'main@': {
                        templateUrl: getView('lookups')
                    }
                }
            })
            .state('app.materialsets', {
                url: '/materialsets',
                views: {
                    'main@': {
                        templateUrl: getView('materialsets'),
                        controller: 'MaterialSetController',
                        controllerAs: 'ctrlMaterialSet'
                    }
                }
            })

            ;

    }] );
})();
/**
 * Created by byoung on 3/18/2016.
 */

'use strict';

angular.module('app.directives').directive('focusOn', function ()
{
    return function(scope, elem, attr)
    {
        console.log(attr.focusOn);

        scope.$on('focusOn', function(e, name)
        {

console.log('name is' + name);
            if(name === attr.focusOn)
            {
                console.log("found elem");
                elem[0].focus();
            }
        });
    };
});
'use strict';

angular.module('app.directives')
    .directive('utcParser', function ()
    {
        function link(scope, element, attrs, ngModel) {

            //console.log("In utcParser directive");

            var parser = function (val) {
                val = moment.utc(val).format();
                return val;
            };

            var formatter = function (val) {
                if (!val) {
                    return val;
                }
                val = new Date(val);
                return val;
            };

            ngModel.$parsers.unshift(parser);
            ngModel.$formatters.unshift(formatter);
        }

        return {
            require: 'ngModel',
            link: link,
            restrict: 'A'
        };
    });
(function(){
    "use strict";

    angular.module("app.filters").filter('truncateName', function()
    {
        return function(input, maxLength)
        {
            input = input || "";
            var out = "";

            if(input.length > maxLength)
            {
                out = input.substr(0, maxLength) + "...";
            }
            else
            {
                out = input;
            }

            return out;
        };
    });

})();

/**
 * Created by byoung on 3/14/2016.
 */
(function(){
    "use strict";

    angular.module("app.services").factory('AuthService', ['$auth', '$state', function($auth, $state) {

        return {

            login: function(email, password)
            {
                var credentials = { email: email, password: password };

                //console.log(credentials);

                // Use Satellizer's $auth service to login because it'll automatically save the JWT in localStorage
                return $auth.login(credentials);
            },

            isAuthenticated: function()
            {
                return $auth.isAuthenticated();
            },

            logout: function()
            {
                $auth.logout();
            }
        };

    }]);

})();
/**
 * Created by Breen on 15/02/2016.
 */

(function(){
    "use strict";

    angular.module("app.services").factory('ChartService', ['$auth', 'Restangular', '$moment', function($auth, Restangular, $moment){

        var pieConfig = {
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
                        },
                        showInLegend: false
                    }
                }
            },
            title:
            {

            },
            loading: true,
            size:
            {
                width: 400,
                height: 250
            }
        };


        return {

            getMonthlySalesReport: function(scope)
            {

                scope.chartConfig = {
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
                        //console.log(oneDataPoint);
                        dataSet.push([Date.UTC(parseInt(oneDataPoint.year), parseInt(oneDataPoint.month) - 1), parseInt(oneDataPoint.pocount)]);
                    }

                    scope.chartConfig.series = [{name: 'Sales this month', data: dataSet }];

                    scope.chartConfig.loading = false;

                },
                function()
                {
                    // Error
                });
            },

            getMonthlyIncomeReport: function(scope)
            {

                scope.chartConfig = {
                    options: {
                        chart: {
                            type: 'column'
                        },
                        yAxis:
                        {
                            min: 0,
                            title:
                            {
                                text: '$ amount'
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
                        text: 'Income per month'
                    },

                    loading: true
                };

                Restangular.all('reports/getMonthlySalesReport').post({ 'reportParams': {}}).then(function(data)
                    {
                        var dataSet = [];
                        for(var i = 0; i < data.length; i++)
                        {
                            var oneDataPoint = data[i];
                            //console.log(oneDataPoint);
                            dataSet.push([Date.UTC(parseInt(oneDataPoint.year), parseInt(oneDataPoint.month) - 1), parseFloat(oneDataPoint.monthtotal)]);
                        }

                        scope.chartConfig.series = [{name: 'Income this month', data: dataSet }];

                        scope.chartConfig.loading = false;

                    },
                    function()
                    {
                        // Error
                    });
            },

            getTopSellingProducts: function(scope, chartTitle)
            {
                console.log(chartTitle);
                scope.topSellingChartConfig = {};
                scope.topSellingChartConfig = jQuery.extend(true, {}, pieConfig);


                Restangular.one('reports/getTopSellingProducts').get().then(function(data)
                {
                    var dataSet = [];
                    for(var i = 0; i < data.length; i++)
                    {
                        var oneDataPoint = data[i];
                        //console.log(oneDataPoint);
                        dataSet.push({
                            name: oneDataPoint.name,
                            selected: (i === 0) ? true : false,
                            sliced: (i === 0) ? true : false,
                            y: parseInt(oneDataPoint.pcount)
                        });
                    }

                    scope.topSellingChartConfig.series = [{name: 'Sold', data: dataSet }];
                    scope.topSellingChartConfig.title.text = chartTitle;
                    scope.topSellingChartConfig.loading = false;

                },
                function()
                {
                    // Error
                });
            },

            getProductProfitPercents: function(scope)
            {
                scope.productProfitPercentChartConfig = {
                    options: {
                        chart: {
                            type: 'column'
                        },
                        legend: {
                            enabled: false
                        },
                        xAxis:
                        {
                            type: 'category'
                        },
                        yAxis:
                        {
                            min: 0,
                            title: {
                                text: 'Profit %'
                            }
                        }
                    },

                    title: {
                        text: 'Product Profit %'
                    },

                    loading: true
                };


                Restangular.one('reports/getProductProfitPercents').get().then(function(data)
                    {
                        var dataSet = [];
                        for(var i = 0; i < data.length; i++)
                        {
                            var oneDataPoint = data[i];

                            if(oneDataPoint.cost > 0)
                            {
                                var profit = oneDataPoint.price - oneDataPoint.cost;
                                var profitPercent = (profit / oneDataPoint.cost * 100);

                                //console.log('Price:' + oneDataPoint.price + ' Cost:' + oneDataPoint.cost + ' Profit:' + Math.round(profitPercent * 100) / 100);
                                //console.log('Price:' + oneDataPoint.price + ' Cost:' + oneDataPoint.cost + ' Profit:' + profitPercent.toFixed(0));

                                dataSet.push([oneDataPoint.name, parseInt(profitPercent.toFixed(0))]);
                            }
                        }

                        dataSet.sort(function(a, b) {
                            return parseInt(b[1]) - parseInt(a[1]);
                        });

                        console.log(dataSet);

                        scope.productProfitPercentChartConfig.series = [{name: 'Profit %', data: dataSet }];
                        scope.productProfitPercentChartConfig.loading = false;

                    },
                    function()
                    {
                        // Error
                    });
            }

        };
    }]);
})();
/**
 * Created by Breen on 15/02/2016.
 */

(function(){
    "use strict";

    angular.module("app.services").factory('DialogService', ["$mdDialog", function( $mdDialog ){

        return {

            fromCustom: function(options)
            {
                return $mdDialog.show(options);
            },

            fromTemplate: function(ev, template, scope ) {
                var options = {
                    templateUrl: '/views/dialogs/' + template + '.html',
                    escapeToClose: false,
                    controller: function DialogController($scope, $mdDialog)
                    {
                        $scope.confirmDialog = function () {
                            $mdDialog.hide();
                        };

                        $scope.cancelDialog = function()
                        {
                            $mdDialog.cancel();
                        };
                    }
                };

                if(ev !== null)
                {
                    options.targetEvent = ev;
                }

                if ( scope )
                {
                    //console.log(scope);
                    options.scope = scope.$new();
                    //options.preserveScope = true;
                }

                return $mdDialog.show(options);
            },

            hide: function(){
                return $mdDialog.hide();
            },

            alert: function(title, content){
                $mdDialog.show(
                    $mdDialog.alert()
                        .title(title)
                        .content(content)
                        .ok('Ok')
                );
            },

            confirm: function(event, title, content)
            {
                var confirm = $mdDialog.confirm()
                    .title(title)
                    .textContent(content)
                    .ariaLabel('')
                    .targetEvent(event)
                    .ok('Yes')
                    .cancel('No');

                return $mdDialog.show(confirm);

            }
        };
    }]);
})();

(function(){
    "use strict";

    angular.module("app.services").factory('FocusService', ['$rootScope', '$timeout', function($rootScope, $timeout)
    {
        return function(name)
        {
            return $timeout(function()
            {
                return $rootScope.$broadcast('focusOn', name);
            },100);
        };
    }]);
})();
/**
 * Created by byoung on 3/14/2016.
 */
(function(){
    "use strict";

    angular.module("app.services").factory('GuidService', [function() {

        function s4()
        {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return {

            newGuid: function()
            {
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            }
        };

    }]);

})();
/**
 * Created by Breen on 15/02/2016.
 */

(function(){
    "use strict";

    angular.module("app.services").factory('RestService', ['$auth', 'Restangular', '$moment', function($auth, Restangular, $moment){

        var baseProducts = Restangular.all('product');

        return {

            getAllProducts: function(scope)
            {
                baseProducts.getList().then(function(data)
                {
                    //console.log(data);
                    scope.products = data;
                });
            },

            getProduct: function(scope, id)
            {
                Restangular.one('product', id).get().then(function(data)
                {
                    //console.log(data);
                    // Hack for OLD mysql drivers on Hostgator which don't properly encode integer and return them as strings
                    data.is_custom = parseInt(data.is_custom);
                    scope.product = data;
                });
            },

            getAllCustomers: function(scope)
            {
                Restangular.all('customer').getList().then(function(data)
                {
                    //console.log(data);
                    scope.customers = data;
                });
            },

            getCustomer: function(scope, id)
            {
                Restangular.one('customer', id).get().then(function(data)
                {
                    //console.log(data);
                    scope.customer = data;
                });
            },

            getAllWorkOrders: function(scope)
            {
                Restangular.all('workorder').getList().then(function(data)
                {
                    //console.log(data);
                    scope.workorders = data;

                    //console.log(scope);
                });
            },

            getWorkOrder: function(scope, id)
            {
                Restangular.one('workorder', id).get().then(function(data)
                {
                    //console.log(data);

                    // Format string dates into date objects
                    data.start_date = $moment(data.start_date);
                    data.end_date = $moment(data.end_date);

                    // Hack for OLD mysql drivers on Hostgator which don't properly encode integer and return them as strings
                    data.completed = parseInt(data.completed);

                    self.workorder = data;


                    scope.workorder = data;
                });
            },

            getAllEvents: function(scope)
            {
                Restangular.all('event').getList().then(function(data)
                {
                    //console.log(data);
                    scope.events = data;
                });
            },

            getEvent: function(scope, id)
            {
                Restangular.one('event', id).get().then(function(data)
                {
                    //console.log(data);
                    scope.event = data;
                });
            },

            getAllUnits: function(scope)
            {
                Restangular.all('unit').getList().then(function(data)
                {
                    //console.log(data);
                    scope.units = data;
                });
            },

            getUnit: function(scope, id)
            {
                Restangular.one('unit', id).get().then(function(data)
                {
                    //console.log(data);
                    scope.unit = data;
                });
            },

            getAllMaterials: function(scope)
            {
                Restangular.all('material').getList().then(function(data)
                {
                    //console.log(data);
                    scope.materials = data;
                });
            },

            getMaterial: function(scope, id)
            {
                Restangular.one('material', id).get().then(function(data)
                {
                    //console.log(data);
                    scope.material = data;
                });
            },

            doSearch: function(scope, query)
            {
                console.log("Call WS with: " + query);

                Restangular.one('search', query).getList().then(function(data)
                {
                   //console.log(data);

                });
            },

            getAllPurchaseOrders: function(scope)
            {
                Restangular.all('purchaseorder').getList().then(function(data)
                {
                    //console.log(data);
                    scope.purchaseorders = data;
                });
            },

            getPurchaseOrder: function(scope, id)
            {
                Restangular.one('purchaseorder', id).get().then(function(data)
                {
                    //console.log(data);

                    // Format string dates into date objects
                    data.pickup_date = $moment(data.pickup_date);

                    // Hack for OLD mysql drivers on Hostgator which don't properly encode integer and return them as strings
                    data.fulfilled = parseInt(data.fulfilled);
                    data.paid = parseInt(data.paid);

                    scope.purchaseorder = data;
                });
            },

            getAllPaymentTypes: function(scope)
            {
                Restangular.all('paymenttype').getList().then(function(data)
                {
                    //console.log(data);
                    scope.paymenttypes = data;
                });
            },

            getPaymentType: function(scope, id)
            {
                Restangular.one('paymenttype', id).get().then(function(data)
                {
                    //console.log(data);
                    scope.paymenttype = data;
                });
            },

            getMaterialAllTypes: function(scope)
            {
                Restangular.all('materialtype').getList().then(function(data)
                {
                    //console.log(data);
                    scope.materialtypes = data;
                });
            },

            getFullyBookedDays: function(scope)
            {
                Restangular.one('scheduler/getFullyBookedDays').getList().then(function(data)
                {
                    scope.bookedDays = data;
                    //console.log(data);
                });
            }

        };
    }]);
})();
/**
 * Created by Breen on 15/02/2016.
 */

(function(){
    "use strict";

    angular.module("app.services").factory('ToastService', ["$mdToast", function( $mdToast ){

        var delay = 6000,
            position = 'top right',
            action = 'OK';

        return {
            show: function(content) {
                return $mdToast.show(
                    $mdToast.simple()
                        .content(content)
                        .position(position)
                        .action(action)
                        .hideDelay(delay)
                );
            }
        };
    }]);
})();
(function(){
    "use strict";

    angular.module("app.services").factory('UploadService', ['Upload', function(Upload) {

        return {

            uploadFile: function (id, uploadType, file)
            {
                console.log('in upload');

                Upload.upload({
                    url: 'api/uploader/uploadFile',
                    data: {file: file, id: id, uploadType: uploadType}
                }).then(function (resp)
                {
                    //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                }, function (resp)
                {
                    console.log('Error status: ' + resp.status);
                }, function (evt)
                {
                    //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            }

        };

    }]);

})();
/**
 * Created by byoung on 3/14/2016.
 */
(function(){
    "use strict";

    angular.module("app.services").factory('ValidationService', [function() {

        return {

            decimalRegex: function()
            {
                return '^\\d*\\.?\\d*$';
            },

            numericRegex: function()
            {
                return '^\\d*$';
            }
        };

    }]);

})();
(function(){
    "use strict";

    function CoreController($scope, $state, $moment, $mdSidenav, $mdMedia, AuthService)
    {
        var self = this;

        var today = new Date();

        $scope.todaysDate = today;
        $scope.showSearch = false;

        $scope.toggleSidenav = function(menuId)
        {
            $mdSidenav(menuId).toggle();
        };

        $scope.showSideNav = function(menuId)
        {
            if(!$mdSidenav(menuId).isLockedOpen())
            {
                $mdSidenav(menuId).open();
            }
        };

        $scope.hideSideNav = function(menuId)
        {
            if(!$mdSidenav(menuId).isLockedOpen())
            {
                $mdSidenav(menuId).close();
            }
        };

        $scope.toggleSearch = function()
        {
            $scope.showSearch = !$scope.showSearch;
            //if($scope.showSearch) { console.log(angular.element('#superSearch')); }
        };

        // Listen for toggleSearch events
        $scope.$on("toggleSearch", function (event, args)
        {
            $scope.toggleSearch();
        });

        $scope.determineFabVisibility = function()
        {
            if($state.is("app.products") || $state.is("app.customers")
                || $state.is("app.purchaseorders") || $state.is("app.paymenttypes")
                || $state.is("app.workorders") || $state.is("app.events")
                || $state.is("app.units") || $state.is("app.materials"))
            {
                return true;
            }

            return false;
        };

        $scope.addFabNavigate = function()
        {
            console.log($state.$current.name);
            var url = "";
            switch($state.$current.name)
            {
                case "app.products":
                    url = "app.products.create";
                    break;
                case "app.customers":
                    url = "app.customers.create";
                    break;
                case "app.purchaseorders":
                    url = "app.purchaseorders.create";
                    break;
                case "app.paymenttypes":
                    url = "app.paymenttypes.create";
                    break;
                case "app.workorders":
                    url = "app.workorders.create";
                    break;
                case "app.events":
                    url = "app.events.create";
                    break;
                case "app.units":
                    url = "app.units.create";
                    break;
                case "app.materials":
                    url = "app.materials.create";
                    break;
            }

            $state.go(url);
        };

        $scope.isAuthenticated = function()
        {
            return AuthService.isAuthenticated();
        };

        $scope.logout = function()
        {
            AuthService.logout();
            $state.go('app.login');
        };

    }

    angular.module('app.controllers').controller('CoreController', ['$scope', '$state', '$moment', '$mdSidenav', '$mdMedia', 'AuthService', CoreController]);

})();

(function(){
    "use strict";

    function CustomerCreateController($auth, $state, ToastService, Restangular, RestService, $stateParams)
    {
        var self = this;

        self.createCustomer = function()
        {
            self.form1.$setSubmitted();

            var isValid = self.form1.$valid;

            if(isValid)
            {
                //console.log(self.customer);

                var c = self.customer;

                Restangular.all('customer').post(c).then(function(d)
                {
                    console.log(d);
                    //$state.go('app.customers.detail', {'customerId': d.newId});
                    ToastService.show("Successfully created");
                    $state.go('app.customers');

                }, function()
                {
                    ToastService.show("Error creating");
                });
            }
        };

    }

    angular.module('app.controllers').controller('CustomerCreateController', ['$auth', '$state', 'ToastService', 'Restangular', 'RestService', '$stateParams', CustomerCreateController]);

})();

(function(){
    "use strict";

    function CustomerDetailController($auth, $state, ToastService, Restangular, RestService, DialogService, $stateParams)
    {
        var self = this;

        //console.log($stateParams);
        RestService.getCustomer(self, $stateParams.customerId);

        self.updateCustomer = function()
        {
            self.form1.$setSubmitted();

            var isValid = self.form1.$valid;

            if(isValid)
            {
                self.customer.put().then(function()
                {
                    ToastService.show("Successfully updated");
                    $state.go("app.customers");

                }, function()
                {
                    ToastService.show("Error updating");
                    console.log("error updating");
                });
            }
        };

        self.deleteCustomer = function()
        {
            self.customer.remove().then(function()
            {
                ToastService.show("Successfully deleted");
                $state.go("app.customers");
            }, function()
            {
                ToastService.show("Error Deleting");
            });


        };

        self.showDeleteConfirm = function(ev)
        {
            var dialog = DialogService.confirm(ev, 'Delete customer?', 'This will also delete any work orders associated with this customer');
            dialog.then(function()
                {
                    self.deleteCustomer();
                },
                function()
                {
                });
        };

    }

    angular.module('app.controllers').controller('CustomerDetailController', ['$auth', '$state', 'ToastService', 'Restangular', 'RestService', 'DialogService', '$stateParams', CustomerDetailController]);

})();

(function(){
    "use strict";

    function CustomerController($auth, $state, Restangular, RestService)
    {
        var self = this;

        RestService.getAllCustomers(self);

    }

    angular.module('app.controllers').controller('CustomerController', ['$auth', '$state', 'Restangular', 'RestService', CustomerController]);

})();

(function(){
    "use strict";

    function EventCreateController($auth, $state, Restangular, RestService, $stateParams)
    {
        var self = this;

        self.event = {};

        self.createEvent = function()
        {
            self.form1.$setSubmitted();

            var isValid = self.form1.$valid;
            //console.log(isValid);

            if(isValid)
            {
                //console.log(self.event);

                var e = self.event;

                //console.log($error);

                Restangular.all('event').post(e).then(function(e)
                {
                    console.log(e);
                    ToastService.show("Successfully created");
                    $state.go('app.events');

                });
            }
        };

    }

    angular.module('app.controllers').controller('EventCreateController', ['$auth', '$state', 'Restangular', 'RestService', '$stateParams', EventCreateController]);

})();

(function(){
    "use strict";

    function EventDetailController($auth, $state, Restangular, RestService, $stateParams, ToastService, DialogService)
    {
        var self = this;

        self.selectedProduct = "";
        self.selectedQuantity = 0;

        //console.log($stateParams);
        RestService.getEvent(self, $stateParams.eventId);
        RestService.getAllProducts(self);

        self.updateEvent = function()
        {
            self.form1.$setSubmitted();

            var isValid = self.form1.$valid;
            //console.log(isValid);

            if(isValid)
            {
                //RestService.updateProduct(self, self.product.id);
                self.event.put().then(function()
                {
                    //console.log("updated");
                    ToastService.show("Successfully updated");
                    $state.go("app.events");
                }, function()
                {
                    ToastService.show("Error updating");
                    console.log("error updating");
                });
            }
        };

        self.addProduct = function()
        {
            console.log(self.selectedProduct);

            self.event.event_products.push({
                event_id: self.event.id,
                product_id: self.selectedProduct.id,
                quantity: self.selectedQuantity,
                product: self.selectedProduct
            });

            self.selectedProduct = "";
            self.selectedQuantity = 0;
        };

        self.deleteProduct = function(e, productId)
        {
            var indexToRemove;
            for(var i = 0; i < self.event.event_products.length; i++)
            {
                if(productId == self.event.event_products[i].product_id)
                {
                    indexToRemove = i;
                    break;
                }
            }

            console.log(indexToRemove);
            self.event.event_products.splice(indexToRemove, 1);

            e.preventDefault();
        };

        self.deleteEvent = function()
        {
            self.event.remove().then(function()
            {
                ToastService.show("Successfully deleted");
                console.log("deelted");
                $state.go("app.events");
            }, function()
            {
                ToastService.show("Error Deleting");
            });


        };

        self.showDeleteConfirm = function(ev)
        {
            var dialog = DialogService.confirm(ev, 'Delete event?', '');
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

(function(){
    "use strict";

    function EventController($auth, $state, Restangular, RestService)
    {
        var self = this;

        RestService.getAllEvents(self);
    }

    angular.module('app.controllers').controller('EventController', ['$auth', '$state', 'Restangular', 'RestService', EventController]);

})();

(function(){
    "use strict";

    function FooterController($moment)
    {
        var self = this;
        self.currentYear = $moment().format('YYYY');
    }

    angular.module('app.controllers').controller('FooterController', ['$moment', FooterController]);

})();

(function(){
    "use strict";

    function HeaderController($auth, $moment)
    {
        var self = this;

        self.todaysDate = $moment().format('dddd, MMMM Do YYYY');

        self.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };
    }

    angular.module('app.controllers').controller('HeaderController', ['$auth', '$moment', HeaderController]);

})();
(function(){
    "use strict";

    function LandingController($state)
    {
        var self = this;
    }

    angular.module('app.controllers').controller('LandingController', ['$state', LandingController]);

})();
(function(){
    "use strict";

    function LoginController($state, $scope, $cookies, DialogService, AuthService, FocusService)
    {
        var self = this;
        self.email = '';
        self.password = '';

        if($cookies.get('loginName'))
        {
            self.email = $cookies.get('loginName');
        }

        var dialogOptions = {
            templateUrl: '/views/dialogs/dlgLogin.html',
            escapeToClose: false,
            controller: function DialogController($scope, $mdDialog)
            {
                $scope.confirmDialog = function () {

                    //console.log(self.email);
                    if(self.email !== '' && self.password !== '')
                    {
                        AuthService.login(self.email, self.password).then(function()
                        {
                            console.log('Login success');

                            var today = new Date();
                            //var cookieExpiry = new Date(today.getYear() + 1, today.getMonth(), today.getDay(), 0, 0, 0, 0);
                            var cookieExpiry = new Date();
                            cookieExpiry.setFullYear(cookieExpiry.getFullYear() + 1);

                            $cookies.put('loginName', self.email, { expires: cookieExpiry });


                            $mdDialog.hide();
                            $state.go('app.products');
                        },
                        function()
                        {
                            alert('Error logging in');
                        });
                    }
                };
            },
            scope: $scope.$new()
        };

        DialogService.fromCustom(dialogOptions);

        FocusService('focusMe');

    }

    angular.module('app.controllers').controller('LoginController', ['$state', '$scope', '$cookies', 'DialogService', 'AuthService', 'FocusService', LoginController]);

})();

(function(){
    "use strict";

    function MaterialCreateController($auth, $state, ToastService, Restangular, RestService, ValidationService, $stateParams)
    {
        var self = this;

        RestService.getAllUnits(self);
        RestService.getMaterialAllTypes(self);

        self.decimalRegex = ValidationService.decimalRegex();

        self.createMaterial = function()
        {
            self.form1.$setSubmitted();

            var isValid = self.form1.$valid;
            //console.log(isValid);

            if(isValid)
            {
                //console.log(self.material);

                var m = self.material;

                Restangular.all('material').post(m).then(function(d)
                {
                    console.log(d);
                    //$state.go('app.customers.detail', {'customerId': d.newId});
                    ToastService.show("Successfully created");
                    $state.go('app.materials');

                }, function()
                {
                    ToastService.show("Error creating");
                });

            }
        };

    }

    angular.module('app.controllers').controller('MaterialCreateController', ['$auth', '$state', 'ToastService', 'Restangular', 'RestService', 'ValidationService', '$stateParams', MaterialCreateController]);

})();

(function(){
    "use strict";

    function MaterialDetailController($auth, $state, ToastService, Restangular, RestService, DialogService, ValidationService, $stateParams)
    {
        var self = this;

        RestService.getAllUnits(self);
        RestService.getMaterialAllTypes(self);

        //console.log($stateParams);
        RestService.getMaterial(self, $stateParams.materialId);

        self.decimalRegex = ValidationService.decimalRegex();

        self.updateMaterial = function()
        {
            self.form1.$setSubmitted();

            var isValid = self.form1.$valid;

            if(isValid)
            {
                self.material.put().then(function()
                {
                    ToastService.show("Successfully updated");
                    $state.go("app.materials");

                }, function()
                {
                    ToastService.show("Error updating");
                    console.log("error updating");
                });
            }
        };

        self.deleteMaterial = function()
        {
            self.material.remove().then(function()
            {
                ToastService.show("Successfully deleted");
                $state.go("app.materials");
            }, function()
            {
                ToastService.show("Error Deleting");
            });
        };

        self.showDeleteConfirm = function(ev)
        {
            var dialog = DialogService.confirm(ev, 'Delete material?', 'This will also remove the material from any products using it');
            dialog.then(function()
                {
                    self.deleteMaterial();
                },
                function()
                {
                });
        };

    }

    angular.module('app.controllers').controller('MaterialDetailController', ['$auth', '$state', 'ToastService', 'Restangular', 'RestService', 'DialogService', 'ValidationService', '$stateParams', MaterialDetailController]);

})();

(function(){
    "use strict";

    function MaterialController($auth, $state, Restangular, RestService)
    {
        var self = this;

        RestService.getAllMaterials(self);

    }

    angular.module('app.controllers').controller('MaterialController', ['$auth', '$state', 'Restangular', 'RestService', MaterialController]);

})();

(function(){
    "use strict";

    function MaterialSetController($auth, $state, RestService, GuidService, DialogService)
    {
        var localStorageKey = 'materialSets';

        var self = this;
        self.selectedMaterial = '';
        //self.selectedQuantity = 0;

        if(localStorage.getItem(localStorageKey) !== null && localStorage.getItem(localStorageKey) !== '')
        {
            self.existingSets = JSON.parse(localStorage.getItem(localStorageKey));
        }
        else
        {
            self.existingSets = [];
            localStorage.setItem(localStorageKey, JSON.stringify(self.existingSets));
        }

        initSetObject();

        RestService.getAllMaterials(self);

        self.createSet = function()
        {
            self.set.id = GuidService.newGuid();
            self.existingSets.push(self.set);
            console.log(self.set);

            localStorage.setItem('materialSets', JSON.stringify(self.existingSets));

            initSetObject();
        };

        self.deleteSet = function(e, setId)
        {
            var dialog = DialogService.confirm(e, 'Delete material set?', '');
            dialog.then(function()
            {
                var indexToRemove;
                for(var i = 0; i < self.existingSets.length; i++)
                {
                    if(setId == self.existingSets[i].id)
                    {
                        indexToRemove = i;
                        break;
                    }
                }

                self.existingSets.splice(indexToRemove, 1);
                if(self.existingSets.length === 0) { localStorage.removeItem(localStorageKey); }

                localStorage.setItem('materialSets', self.existingSets);
            },
            function()
            {
            });

            e.preventDefault();
        };

        self.deleteMaterial = function(e, materialId)
        {
            var indexToRemove;
            for(var i = 0; i < self.set.product_materials.length; i++)
            {
                if(materialId == self.set.product_materials[i].material_id)
                {
                    indexToRemove = i;
                    break;
                }
            }

            self.set.product_materials.splice(indexToRemove, 1);

            e.preventDefault();
        };

        self.addMaterial = function()
        {
            console.log(self.selectedMaterial);

            self.set.product_materials.push({
                material_id: self.selectedMaterial.id,
                quantity: self.selectedQuantity,
                material: self.selectedMaterial
            });

            self.selectedMaterial = '';
            self.selectedQuantity = null;
        };

        function initSetObject()
        {
            self.set = {};
            self.set.id = '';
            self.set.name = '';
            self.set.product_materials = [];
        }

    }

    angular.module('app.controllers').controller('MaterialSetController', ['$auth', '$state', 'RestService', 'GuidService', 'DialogService', MaterialSetController]);

})();

(function(){
    "use strict";

    function PaymentTypeCreateController($auth, $state, ToastService, Restangular, RestService, $stateParams)
    {
        var self = this;

        self.createPaymentType = function()
        {
            self.form1.$setSubmitted();

            var isValid = self.form1.$valid;
            //console.log(isValid);

            if(isValid)
            {
                //console.log(self.paymenttype);

                var c = self.paymenttype;

                Restangular.all('paymenttype').post(c).then(function(d)
                {
                    console.log(d);
                    ToastService.show("Successfully created");
                    $state.go('app.paymenttypes');

                }, function()
                {
                    ToastService.show("Error creating");
                });
            }
        };

    }

    angular.module('app.controllers').controller('PaymentTypeCreateController', ['$auth', '$state', 'ToastService', 'Restangular', 'RestService', '$stateParams', PaymentTypeCreateController]);

})();

(function(){
    "use strict";

    function PaymentTypeDetailController($auth, $state, ToastService, Restangular, RestService, DialogService, $stateParams)
    {
        var self = this;

        //console.log($stateParams);
        RestService.getPaymentType(self, $stateParams.paymentTypeId);

        self.updatePaymentType = function()
        {
            self.form1.$setSubmitted();

            var isValid = self.form1.$valid;
            //console.log(isValid);

            if(isValid)
            {
                self.paymenttype.put().then(function()
                {
                    ToastService.show("Successfully updated");
                    $state.go("app.paymenttypes");

                }, function()
                {
                    ToastService.show("Error updating");
                    console.log("error updating");
                });
            }

        };

        self.deletePaymentType = function()
        {
            self.paymenttype.remove().then(function()
            {
                ToastService.show("Successfully deleted");
                $state.go("app.paymenttypes");
            }, function()
            {
                ToastService.show("Error Deleting");
            });


        };

        self.showDeleteConfirm = function(ev)
        {
            var dialog = DialogService.confirm(ev, 'Delete payment type?', '');
            dialog.then(function()
                {
                    self.deletePaymentType();
                },
                function()
                {
                });
        };

    }

    angular.module('app.controllers').controller('PaymentTypeDetailController', ['$auth', '$state', 'ToastService', 'Restangular', 'RestService', 'DialogService', '$stateParams', PaymentTypeDetailController]);

})();

(function(){
    "use strict";

    function PaymentTypeController($auth, $state, Restangular, RestService)
    {
        var self = this;

        RestService.getAllPaymentTypes(self);

    }

    angular.module('app.controllers').controller('PaymentTypeController', ['$auth', '$state', 'Restangular', 'RestService', PaymentTypeController]);

})();

(function(){
    "use strict";

    function ProductCreateController($auth, $state, Restangular, ToastService, RestService, ValidationService, $stateParams)
    {
        var self = this;


        RestService.getAllMaterials(self);

        self.decimalRegex = ValidationService.decimalRegex();
        self.numericRegex = ValidationService.numericRegex();

        self.product = {};
        self.product.minimum_stock = 0;
        self.product.current_stock = 0;

        self.createProduct = function()
        {
            self.form1.$setSubmitted();

            var isValid = self.form1.$valid;
            //console.log(isValid);

            if(isValid)
            {
                console.log(self.product);

                var p = self.product;

                 //console.log($error);

                 Restangular.all('product').post(p).then(function(d)
                 {
                    //console.log(d);
                    //$state.go('app.products.detail', {'productId': d.newId});
                    ToastService.show("Successfully created");
                    $state.go('app.products');
                 }, function()
                 {
                    ToastService.show("Error creating");
                 });

            }
        };

        self.addMaterial = function()
        {
            console.log(self.selectedMaterial);

            if(self.product.product_materials === undefined) { self.product.product_materials = []; }

            self.product.product_materials.push({
                material_id: self.selectedMaterial.id,
                quantity: self.selectedQuantity,
                material: self.selectedMaterial
            });

            if(self.product.cost === undefined || self.product.cost === null) { self.product.cost = 0; }
            var currentCost = parseFloat(self.product.cost);
            var btest = (parseFloat(self.selectedMaterial.unit_cost) * parseInt(self.selectedQuantity));
            currentCost += btest;
            self.product.cost = currentCost;

            self.selectedMaterial = "";
            self.selectedQuantity = 0;

            console.log(self.product);
        };

        self.deleteMaterial = function(e, materialId)
        {
            var indexToRemove;
            for(var i = 0; i < self.product.product_materials.length; i++)
            {
                if(materialId == self.product.product_materials[i].material_id)
                {
                    indexToRemove = i;
                    break;
                }
            }

            console.log(indexToRemove);

            var currentCost = parseFloat(self.product.cost);
            var btest = (parseFloat(self.product.product_materials[indexToRemove].material.unit_cost) * parseInt(self.product.product_materials[indexToRemove].quantity));
            currentCost -= btest;
            self.product.cost = currentCost;

            self.product.product_materials.splice(indexToRemove, 1);

            e.preventDefault();
        };

    }

    angular.module('app.controllers').controller('ProductCreateController', ['$auth', '$state', 'Restangular', 'ToastService', 'RestService', 'ValidationService', '$stateParams', ProductCreateController]);

})();

(function(){
    "use strict";

    function ProductDetailController($auth, $state, Restangular, RestService, $stateParams, ToastService, DialogService, ValidationService)
    {
        var self = this;

        //console.log($stateParams);
        RestService.getAllMaterials(self);
        RestService.getProduct(self, $stateParams.productId);

        self.decimalRegex = ValidationService.decimalRegex();
        self.numericRegex = ValidationService.numericRegex();


        self.updateProduct = function()
        {
            self.form1.$setSubmitted();

            var isValid = self.form1.$valid;
            //console.log(isValid);

            if(isValid)
            {
                //RestService.updateProduct(self, self.product.id);
                self.product.put().then(function()
                {
                    //console.log("updated");
                    ToastService.show("Successfully updated");
                    $state.go("app.products");
                }, function()
                {
                    ToastService.show("Error updating");
                    console.log("error updating");
                });
            }
        };

        self.deleteProduct = function()
        {
            self.product.remove().then(function()
            {
                console.log("deelted");
                ToastService.show("Successfully deleted");
                $state.go("app.products");

            }, function()
            {
                ToastService.show("Error deleting");
                console.log("error deleting");
            });
        };

        self.showDeleteConfirm = function(ev)
        {
            var dialog = DialogService.confirm(ev, 'Delete product?', 'This will also delete any work order or event stock levels associated with this product');
            dialog.then(function()
            {
                self.deleteProduct();
            },
            function()
            {
            });
        };

        self.addMaterial = function()
        {
            console.log(self.selectedMaterial);

            if(self.product.product_materials === undefined) { self.product.product_materials = []; }

            self.product.product_materials.push({
                product_id: self.product.id,
                material_id: self.selectedMaterial.id,
                quantity: self.selectedQuantity,
                material: self.selectedMaterial
            });

            var currentCost = parseFloat(self.product.cost);
            var btest = (parseFloat(self.selectedMaterial.unit_cost) * parseInt(self.selectedQuantity));
            currentCost += btest;
            self.product.cost = currentCost;


            self.selectedMaterial = "";
            self.selectedQuantity = 0;

        };

        self.deleteMaterial = function(e, materialId)
        {
            var indexToRemove;
            for(var i = 0; i < self.product.product_materials.length; i++)
            {
                if(materialId == self.product.product_materials[i].material_id)
                {
                    indexToRemove = i;
                    break;
                }
            }

            console.log(indexToRemove);

            var currentCost = parseFloat(self.product.cost);
            var btest = (parseFloat(self.product.product_materials[indexToRemove].material.unit_cost) * parseInt(self.product.product_materials[indexToRemove].quantity));
            currentCost -= btest;
            self.product.cost = currentCost;


            self.product.product_materials.splice(indexToRemove, 1);

            e.preventDefault();
        };
    }

    angular.module('app.controllers').controller('ProductDetailController', ['$auth', '$state', 'Restangular', 'RestService', '$stateParams', 'ToastService', 'DialogService', 'ValidationService', ProductDetailController]);

})();

(function(){
    "use strict";

    function ProductController($auth, $state, Restangular, RestService)
    {
        var self = this;
        self.filterType = "";
        self.filterOperator = "";
        self.filterValue = "";

        RestService.getAllProducts(self);

        self.applyProductFilter = function(p)
        {
            if(self.filterType !== "" && self.filterOperator !== "" && self.filterValue !== "")
            {
                console.log("hi");
                var propertyToFilter = null;
                switch(self.filterType)
                {
                    case "stock":
                        propertyToFilter = parseInt(p.current_stock);
                        break;
                    case "price":
                        propertyToFilter = parseFloat(p.price);
                        break;
                    case "cost":
                        propertyToFilter = parseFloat(p.cost);
                        break;
                }

                if(self.filterOperator === "=")
                {
                    return propertyToFilter == parseFloat(self.filterValue);
                }
                else if(self.filterOperator === ">")
                {
                    return propertyToFilter > parseFloat(self.filterValue);
                }
                else if(self.filterOperator === ">=")
                {
                    return propertyToFilter >= self.filterValue;
                }
                else if(self.filterOperator === "<")
                {
                    return propertyToFilter < parseFloat(self.filterValue);
                }
                else if(self.filterOperator === "<=")
                {
                    return propertyToFilter <= parseFloat(self.filterValue);
                }
            }

            return true;
        };
    }

    angular.module('app.controllers').controller('ProductController', ['$auth', '$state', 'Restangular', 'RestService', ProductController]);

})();

(function(){
    "use strict";

    function PurchaseOrderCreateController($auth, $state, $scope, $moment, Restangular, UploadService, ToastService, RestService, DialogService, $stateParams)
    {
        var self = this;

        RestService.getAllCustomers(self);
        RestService.getAllProducts(self);
        RestService.getAllPaymentTypes(self);
        RestService.getFullyBookedDays(self);

        self.purchaseorder = {};
        self.purchaseorder.amount_paid = 0;
        self.purchaseorder.discount = 0;
        self.purchaseorder.total = 0;

        self.purchaseorder.delivery = 0;
        self.delivery_charge = 0;

        self.purchaseorder.shipping = 0;
        self.shipping_charge = 0;


        self.purchaseorder.suppressworkorder = 0;

        self.poImage = null;

        var originalTotal = 0;
        var originalShippingCharge = 0;

        self.onlyOpenDays = function(date)
        {
            var result = true;

            if(!$moment(date).isBefore())
            {
                //console.log(date);
                for(var i = 0; i < self.bookedDays.length; i++)
                {
                    //console.log(self.bookedDays[i].start_date);
                    //console.log(self.bookedDays[i].start_date);
                    //console.log($moment(self.bookedDays[i].start_date));
                    if(moment(date).isSame(self.bookedDays[i].start_date))
                    {
                        result = false;
                        break;
                    }
                }
            }

            return result;
        };

        self.createPurchaseOrder = function()
        {
            console.log(self.purchaseorder);

            var p = self.purchaseorder;

            //console.log($error);

            Restangular.all('purchaseorder').post(p).then(function(d)
            {
                if (self.poImage)
                {
                    UploadService.uploadFile(1, 'PO', self.poImage);
                }

                //console.log(d);
                //$state.go('app.products.detail', {'productId': d.newId});
                ToastService.show("Successfully created");
                $state.go('app.purchaseorders');
            }, function()
            {
                ToastService.show("Error creating");
            });
        };

        self.applyDiscount = function()
        {
            if(self.purchaseorder.discount == null || self.purchaseorder.discount == 0)
            {
                self.purchaseorder.total = originalTotal;
            }
            else
            {
                if(self.purchaseorder.total !== undefined
                    && self.purchaseorder.total !== null
                    && self.purchaseorder.total > 0)
                {
                    var discounted = originalTotal - self.purchaseorder.discount;
                    discounted >= 0 ? self.purchaseorder.total = discounted : 0;
                }
            }
        };

        self.applyDelivery = function()
        {
            if(self.delivery_charge === 1)
            {
                self.purchaseorder.delivery = deliveryFee;
                self.purchaseorder.total += deliveryFee;
            }
            else
            {
                self.purchaseorder.delivery = 0;
                self.purchaseorder.total -= deliveryFee;
            }
        };

        self.applyShipping = function()
        {
            var costOfShipping = 0;
            if(self.shipping_charge === 'CDN')
            {
                costOfShipping = shippingCanada;
            }
            else if(self.shipping_charge === 'USA')
            {
                costOfShipping = shippingUsa;
            }

            self.purchaseorder.shipping = costOfShipping;

            if(self.shipping_charge !== originalShippingCharge)
            {
                self.purchaseorder.total -= originalShippingCharge;
                self.purchaseorder.total += costOfShipping;
            }

            originalShippingCharge = costOfShipping;
        };
        
        self.addProduct = function()
        {
            console.log(self.selectedProduct);

            if(self.purchaseorder.purchase_order_products === undefined) { self.purchaseorder.purchase_order_products = []; }

            self.purchaseorder.purchase_order_products.push({
                product_id: self.selectedProduct.id,
                quantity: self.selectedQuantity,
                product: self.selectedProduct
            });

            if(self.purchaseorder.total === undefined || self.purchaseorder.total === null) { self.purchaseorder.total = 0; }
            var currentCost = parseFloat(self.purchaseorder.total);
            var btest = (parseFloat(self.selectedProduct.price) * parseInt(self.selectedQuantity));
            currentCost += btest;
            self.purchaseorder.total = currentCost;
            originalTotal = currentCost;

            self.selectedProduct = "";
            self.selectedQuantity = 0;

            console.log(self.purchaseorder);
        };

        self.deleteProduct = function(e, productId)
        {
            var indexToRemove;
            for(var i = 0; i < self.purchaseorder.purchase_order_products.length; i++)
            {
                if(productId == self.purchaseorder.purchase_order_products[i].product_id)
                {
                    indexToRemove = i;
                    break;
                }
            }

            console.log(indexToRemove);

            var currentCost = parseFloat(self.purchaseorder.total);
            var btest = (parseFloat(self.purchaseorder.purchase_order_products[indexToRemove].product.price) * parseInt(self.purchaseorder.purchase_order_products[indexToRemove].quantity));
            currentCost -= btest;
            self.purchaseorder.total = currentCost;
            originalTotal = currentCost;

            self.purchaseorder.purchase_order_products.splice(indexToRemove, 1);

            e.preventDefault();
        };

        self.determineWorkOrders = function(e)
        {
            if(self.purchaseorder.purchase_order_products !== undefined)
            {
                if(self.purchaseorder.suppressworkorder == 1)
                {
                    // Just process the PO as normal
                    self.createPurchaseOrder();
                }
                else
                {

                    var productsToFulfill = [];
                    for (var i = 0; i < self.purchaseorder.purchase_order_products.length; i++) {
                        productsToFulfill.push({
                            product_id: self.purchaseorder.purchase_order_products[i].product_id,
                            quantity: self.purchaseorder.purchase_order_products[i].quantity
                        });
                    }

                    Restangular.all('scheduler/getWorkOrders').post({productsToFulfill: productsToFulfill}).then(function (data) {
                        console.log(data.workOrdersToCreate);
                        if (data.workOrdersToCreate > 0) {
                            // There are workorders needed for this PO, confirm their creation
                            $scope.workOrdersToCreate = data.workOrdersToCreate;
                            $scope.workOrders = data.workOrders;

                            DialogService.fromTemplate(e, 'dlgConfirmWorkOrders', $scope).then(
                                function () {
                                    self.purchaseorder.work_orders = $scope.workOrders;
                                    //console.log('confirmed');
                                    self.createPurchaseOrder();
                                },
                                function () {
                                    //console.log('cancelled');
                                }
                            );
                        }
                        else {
                            // Just process the PO as normal
                            self.createPurchaseOrder();
                        }
                    });
                }
            }
        };

    }

    angular.module('app.controllers').controller('PurchaseOrderCreateController', ['$auth', '$state', '$scope', '$moment', 'Restangular', 'UploadService', 'ToastService', 'RestService', 'DialogService', '$stateParams', PurchaseOrderCreateController]);

})();

(function(){
    "use strict";

    function PurchaseOrderDetailController($auth, $state, $scope, $moment, Restangular, UploadService, RestService, $stateParams, ToastService, DialogService)
    {
        var self = this;

        //console.log($stateParams);
        RestService.getAllCustomers(self);
        RestService.getAllProducts(self);
        RestService.getAllPaymentTypes(self);
        RestService.getPurchaseOrder(self, $stateParams.purchaseOrderId);

        var originalTotal = 0;

        self.updatePurchaseOrder = function()
        {
            self.purchaseorder.put().then(function()
            {

                if (self.poImage)
                {
                    console.log('here');
                    UploadService.uploadFile(1, 'PO', self.poImage);
                }

                //console.log("updated");
                ToastService.show("Successfully updated");
                //$state.go("app.purchaseorders");
            }, function()
            {
                ToastService.show("Error updating");
                console.log("error updating");
            });
        };

        self.deletePurchaseOrder = function()
        {
            self.purchaseorder.remove().then(function()
            {
                console.log("deelted");
                ToastService.show("Successfully deleted");
                $state.go("app.purchaseorders");

            }, function()
            {
                ToastService.show("Error deleting");
                console.log("error deleting");
            });
        };

        self.showDeleteConfirm = function(ev)
        {
            var dialog = DialogService.confirm(ev, 'Delete purchase order?', '');
            dialog.then(function()
            {
                self.deletePurchaseOrder();
            },
            function()
            {
            });
        };

        self.applyDiscount = function()
        {
            if(self.purchaseorder.discount == null || self.purchaseorder.discount == 0)
            {
                self.purchaseorder.total = originalTotal;
            }
            else
            {
                if(self.purchaseorder.total !== undefined
                    && self.purchaseorder.total !== null
                    && self.purchaseorder.total > 0)
                {
                    var discounted = originalTotal - self.purchaseorder.discount;
                    discounted >= 0 ? self.purchaseorder.total = discounted : 0;
                }
            }
        };

        self.addProduct = function(e)
        {
            console.log(self.selectedProduct);

            var popObj = {
                product_id: self.selectedProduct.id,
                quantity: self.selectedQuantity,
                product: self.selectedProduct
            };

            Restangular.all('scheduler/getWorkOrders').post({productsToFulfill: [popObj], purchaseOrderId: self.purchaseorder.id}).then(function(data)
            {
                console.log(data.workOrdersToCreate);

                if(self.purchaseorder.purchase_order_products === undefined) { self.purchaseorder.purchase_order_products = []; }
                self.purchaseorder.purchase_order_products.push(popObj);

                // Recalculate PO total
                if(self.purchaseorder.total === undefined || self.purchaseorder.total === null) { self.purchaseorder.total = 0; }
                var currentCost = parseFloat(self.purchaseorder.total);
                var btest = (parseFloat(self.selectedProduct.price) * parseInt(self.selectedQuantity));
                currentCost += btest;
                self.purchaseorder.total = currentCost;
                originalTotal = currentCost;

                self.selectedProduct = "";
                self.selectedQuantity = 0;

                if(data.workOrdersToCreate > 0)
                {
                    // There are workorders needed for this PO, alert of their creation
                    $scope.workOrdersToCreate = data.workOrdersToCreate;
                    $scope.workOrders = data.workOrders;

                    DialogService.fromTemplate(e, 'dlgAlertWorkOrders', $scope).then(
                        function()
                        {
                            console.log('confirmed');
                        }
                    );
                }
            }, function()
            {
                ToastService.show("Error adding product, please try again");
            });
        };

        self.deleteProduct = function(e, productId)
        {
            var indexToRemove;
            for(var i = 0; i < self.purchaseorder.purchase_order_products.length; i++)
            {
                if(productId == self.purchaseorder.purchase_order_products[i].product_id)
                {
                    indexToRemove = i;
                    break;
                }
            }

            //console.log(indexToRemove);

            Restangular.all('scheduler/restoreStockForProduct').post({purchase_order_id: self.purchaseorder.id, product_id: self.purchaseorder.purchase_order_products[indexToRemove].product_id}).then(function(data)
            {
                // Recalculate PO total
                var currentCost = parseFloat(self.purchaseorder.total);
                var btest = (parseFloat(self.purchaseorder.purchase_order_products[indexToRemove].product.price) * parseInt(self.purchaseorder.purchase_order_products[indexToRemove].quantity));
                currentCost -= btest;
                self.purchaseorder.total = currentCost;
                originalTotal = currentCost;

                self.purchaseorder.purchase_order_products.splice(indexToRemove, 1);

            }, function()
            {
                ToastService.show("Error updating stock, please try again");
            });

            e.preventDefault();
        };
    }

    angular.module('app.controllers').controller('PurchaseOrderDetailController', ['$auth', '$state', '$scope', '$moment', 'Restangular', 'UploadService', 'RestService', '$stateParams', 'ToastService', 'DialogService', PurchaseOrderDetailController]);

})();

(function(){
    "use strict";

    function PurchaseOrderController($auth, $state, Restangular, RestService)
    {
        var self = this;

        RestService.getAllPurchaseOrders(self);
    }

    angular.module('app.controllers').controller('PurchaseOrderController', ['$auth', '$state', 'Restangular', 'RestService', PurchaseOrderController]);

})();

(function(){
    "use strict";

    function ReportController($scope, $auth, $state, Restangular, RestService, ChartService)
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

            Restangular.one('reports/getWeekWorkOrderReport').get().then(function(data)
                {
                    console.log(data);
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
            ChartService.getTopSellingProducts(self, 'Top Selling All Time');
            getWorstSellingProducts(self);
            getOverduePurchaseOrders(self);
            getMonthlyIncome(self);
            getOutstandingPayments(self);
        }

        function showSalesReportByMonthView()
        {
            ChartService.getMonthlySalesReport(self);
        }

        function showIncomeReportByMonthView()
        {
            ChartService.getMonthlyIncomeReport(self);
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

        function getWorstSellingProducts(scope)
        {
            Restangular.one('reports/getWorstSellingProducts').get().then(function(data)
            {
                self.worstSellingProducts = data;
            },
            function()
            {
                // Error
            });
        }

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


    }

    angular.module('app.controllers').controller('ReportController', ['$scope', '$auth', '$state', 'Restangular', 'RestService', 'ChartService', ReportController]);

})();

(function(){
    "use strict";

    function SearchController($scope, $auth, Restangular, $state)
    {
        var self = this;

        self.noCache = true;
        self.searchText = "";
        self.selectedResult = undefined;

        self.doSearch = function(query)
        {
            //RestService.doSearch(self, self.searchText);
            return Restangular.one('search', query).getList().then(function(data)
            {
                console.log(data);
                return data;
            });

        };

        self.fireToggleSearchEvent = function(){
            //self.$root.$broadcast("toggleSearch", {username: $scope.user.username });
            $scope.$root.$broadcast("toggleSearch");
        };

        self.gotoItem = function()
        {
            console.log(self.selectedResult);
            if(self.selectedResult !== null && self.selectedResult !== undefined)
            {
                self.searchText = "";
                self.fireToggleSearchEvent();

                switch(self.selectedResult.content_type)
                {
                    case "product":
                        $state.go('app.products.detail', {'productId': self.selectedResult.id});
                        break;

                    case "customer":
                        $state.go('app.customers.detail', {'customerId': self.selectedResult.id});
                        break;

                    case "event":
                        $state.go('app.events.detail', {'eventId': self.selectedResult.id});
                        break;

                    case "workorder":
                        $state.go('app.workorders.detail', {'workOrderId': self.selectedResult.id});
                        break;

                    case "material":
                        $state.go('app.materials.detail', {'materialId': self.selectedResult.id});
                        break;

                    case "purchaseorder":
                        $state.go('app.purchaseorders.detail', {'purchaseOrderId': self.selectedResult.id});
                        break;
                }
            }
        };
    }

    angular.module('app.controllers').controller('SearchController', ['$scope', '$auth', 'Restangular', '$state', SearchController]);

})();

(function(){
    "use strict";

    function UnitCreateController($auth, $state, ToastService, Restangular, RestService, $stateParams)
    {
        var self = this;

        self.createUnit = function()
        {
            self.form1.$setSubmitted();

            var isValid = self.form1.$valid;
            //console.log(isValid);

            if(isValid)
            {
                //console.log(self.unit);
                var c = self.unit;

                Restangular.all('unit').post(c).then(function(d)
                {
                    console.log(d);
                    //$state.go('app.customers.detail', {'customerId': d.newId});
                    ToastService.show("Successfully created");
                    $state.go('app.units');

                }, function()
                {
                    ToastService.show("Error creating");
                });
            }
        };

    }

    angular.module('app.controllers').controller('UnitCreateController', ['$auth', '$state', 'ToastService', 'Restangular', 'RestService', '$stateParams', UnitCreateController]);

})();

(function(){
    "use strict";

    function UnitDetailController($auth, $state, ToastService, Restangular, RestService, DialogService, $stateParams)
    {
        var self = this;

        //console.log($stateParams);
        RestService.getUnit(self, $stateParams.unitId);

        self.updateUnit = function()
        {
            self.form1.$setSubmitted();

            var isValid = self.form1.$valid;
            //console.log(isValid);

            if(isValid)
            {
                self.unit.put().then(function()
                {
                    ToastService.show("Successfully updated");
                    $state.go("app.units");

                }, function()
                {
                    ToastService.show("Error updating");
                    console.log("error updating");
                });
            }
        };

        self.deleteUnit = function()
        {
            self.unit.remove().then(function()
            {
                ToastService.show("Successfully deleted");
                $state.go("app.units");
            }, function()
            {
                ToastService.show("Error Deleting");
            });


        };

        self.showDeleteConfirm = function(ev)
        {
            var dialog = DialogService.confirm(ev, 'Delete unit?', '');
            dialog.then(function()
                {
                    self.deleteUnit();
                },
                function()
                {
                });
        };

    }

    angular.module('app.controllers').controller('UnitDetailController', ['$auth', '$state', 'ToastService', 'Restangular', 'RestService', 'DialogService', '$stateParams', UnitDetailController]);

})();

(function(){
    "use strict";

    function UnitController($auth, $state, Restangular, RestService)
    {
        var self = this;

        RestService.getAllUnits(self);

    }

    angular.module('app.controllers').controller('UnitController', ['$auth', '$state', 'Restangular', 'RestService', UnitController]);

})();

(function(){
    "use strict";

    function WorkOrderCreateController($auth, $state, Restangular, ToastService, $moment, RestService, ValidationService, $stateParams)
    {
        var self = this;

        RestService.getAllCustomers(self);
        RestService.getAllProducts(self);

        self.numericRegex = ValidationService.numericRegex();

        self.createWorkOrder = function()
        {
            self.form1.$setSubmitted();

            var isValid = self.form1.$valid;
            //console.log(isValid);

            if(isValid)
            {
                //console.log(self.workorder);

                var w = self.workorder;

                Restangular.all('workorder').post(w).then(function()
                {
                    ToastService.show("Successfully created");
                    //$state.go('app.workorders.detail', {'workOrderId': 1});
                    $state.go('app.workorders');

                });
            }
        };
    }

    angular.module('app.controllers').controller('WorkOrderCreateController', ['$auth', '$state', 'Restangular', 'ToastService', '$moment', 'RestService', 'ValidationService', '$stateParams', WorkOrderCreateController]);

})();

(function(){
    "use strict";

    function WorkOrderDetailController($auth, $state, ToastService, Restangular, RestService, DialogService, ValidationService, $moment, $stateParams)
    {
        var self = this;

        //console.log($stateParams);
        RestService.getWorkOrder(self, $stateParams.workOrderId);
        RestService.getAllCustomers(self);
        RestService.getAllProducts(self);

        self.numericRegex = ValidationService.numericRegex();

        self.toggleComplete = function(cbState)
        {
            console.log(cbState);
            //if(cbState) { self.workorder.completed = 1; }
            //else { self.workorder.completed = 0; }
        };

        self.updateWorkOrder = function()
        {
            self.form1.$setSubmitted();

            var isValid = self.form1.$valid;
            //console.log(isValid);

            if(isValid)
            {
                self.workorder.put().then(function()
                {
                    ToastService.show("Successfully updated");
                    $state.go("app.workorders");
                }, function()
                {
                    ToastService.show("Error updating");
                });
            }
        };

        self.deleteWorkOrder = function()
        {
            self.workorder.remove().then(function()
            {
                ToastService.show("Successfully deleted");
                $state.go("app.workorders");
            }, function()
            {
                ToastService.show("Error deleting");
            });
        };

        self.showDeleteConfirm = function(ev)
        {
            var dialog = DialogService.confirm(ev, 'Delete work order?', '');
            dialog.then(function()
                {
                    self.deleteWorkOrder();
                },
                function()
                {
                });
        };

    }

    angular.module('app.controllers').controller('WorkOrderDetailController', ['$auth', '$state', 'ToastService', 'Restangular', 'RestService', 'DialogService', 'ValidationService', '$moment', '$stateParams', WorkOrderDetailController]);

})();

(function(){
    "use strict";

    function WorkOrderController($auth, $state, Restangular, RestService, $moment)
    {
        var self = this;

        self.showComplete = false;
        var todaysDate = $moment();

        RestService.getAllWorkOrders(self);

        console.log(self);

        self.setUrgency = function(objDate)
        {
            // 3 days, 7 days, 30 days, the rest
            var d = $moment(objDate);
            //console.log(d);
            var dayDiff = d.diff(todaysDate, 'days');

            if(dayDiff > 30) // green
            {
                return "farWorkOrder";
            }
            else if(dayDiff > 7 && dayDiff <= 30) // blue
            {
                return "closeWorkOrder";
            }
            else if(dayDiff > 3 && dayDiff <= 7) // orange
            {
                return "closerWorkOrder";
            }
            else // red
            {
                return "closestWorkOrder";
            }

            //console.log(d.diff(todaysDate, 'days'));

        };

        self.toggleCompleteOnly = function(cbState)
        {
            console.log('toggle');
            console.log(cbState);
        };

    }

    angular.module('app.controllers').controller('WorkOrderController', ['$auth', '$state', 'Restangular', 'RestService', '$moment', WorkOrderController]);

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHAuanMiLCJhcHAvcm91dGVzLmpzIiwiYXBwL2RpcmVjdGl2ZXMvZm9jdXNPbi5qcyIsImFwcC9kaXJlY3RpdmVzL3V0Yy1wYXJzZXIuZGlyZWN0aXZlLmpzIiwiYXBwL2ZpbHRlcnMvdHJ1bmNhdGVOYW1lLmpzIiwiYXBwL3NlcnZpY2VzL2F1dGguanMiLCJhcHAvc2VydmljZXMvY2hhcnQuanMiLCJhcHAvc2VydmljZXMvZGlhbG9nLmpzIiwiYXBwL3NlcnZpY2VzL2ZvY3VzLmpzIiwiYXBwL3NlcnZpY2VzL2d1aWQuanMiLCJhcHAvc2VydmljZXMvcmVzdC5qcyIsImFwcC9zZXJ2aWNlcy90b2FzdC5qcyIsImFwcC9zZXJ2aWNlcy91cGxvYWQuanMiLCJhcHAvc2VydmljZXMvdmFsaWRhdGlvbi5qcyIsImFwcC9jb250cm9sbGVycy9jb3JlL2NvcmUuanMiLCJhcHAvY29udHJvbGxlcnMvY3VzdG9tZXJzL2N1c3RvbWVyLmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy9jdXN0b21lcnMvY3VzdG9tZXIuZGV0YWlsLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2N1c3RvbWVycy9jdXN0b21lcnMuanMiLCJhcHAvY29udHJvbGxlcnMvZXZlbnRzL2V2ZW50LmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy9ldmVudHMvZXZlbnQuZGV0YWlsLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2V2ZW50cy9ldmVudHMuanMiLCJhcHAvY29udHJvbGxlcnMvZm9vdGVyL2Zvb3Rlci5qcyIsImFwcC9jb250cm9sbGVycy9oZWFkZXIvaGVhZGVyLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2xhbmRpbmcvbGFuZGluZy5qcyIsImFwcC9jb250cm9sbGVycy9sb2dpbi9sb2dpbi5qcyIsImFwcC9jb250cm9sbGVycy9tYXRlcmlhbHMvbWF0ZXJpYWwuY3JlYXRlLmpzIiwiYXBwL2NvbnRyb2xsZXJzL21hdGVyaWFscy9tYXRlcmlhbC5kZXRhaWwuanMiLCJhcHAvY29udHJvbGxlcnMvbWF0ZXJpYWxzL21hdGVyaWFscy5qcyIsImFwcC9jb250cm9sbGVycy9tYXRlcmlhbHNldHMvbWF0ZXJpYWxzZXRzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3BheW1lbnRfdHlwZXMvcGF5bWVudHR5cGUuY3JlYXRlLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3BheW1lbnRfdHlwZXMvcGF5bWVudHR5cGUuZGV0YWlsLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3BheW1lbnRfdHlwZXMvcGF5bWVudHR5cGVzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3Byb2R1Y3RzL3Byb2R1Y3QuY3JlYXRlLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3Byb2R1Y3RzL3Byb2R1Y3QuZGV0YWlsLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3Byb2R1Y3RzL3Byb2R1Y3RzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3B1cmNoYXNlb3JkZXJzL3B1cmNoYXNlb3JkZXIuY3JlYXRlLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3B1cmNoYXNlb3JkZXJzL3B1cmNoYXNlb3JkZXIuZGV0YWlsLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3B1cmNoYXNlb3JkZXJzL3B1cmNoYXNlb3JkZXJzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3JlcG9ydHMvcmVwb3J0cy5qcyIsImFwcC9jb250cm9sbGVycy9zZWFyY2gvc2VhcmNoLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3VuaXRzL3VuaXQuY3JlYXRlLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3VuaXRzL3VuaXQuZGV0YWlsLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3VuaXRzL3VuaXRzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3dvcmtvcmRlcnMvd29ya29yZGVyLmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy93b3Jrb3JkZXJzL3dvcmtvcmRlci5kZXRhaWwuanMiLCJhcHAvY29udHJvbGxlcnMvd29ya29yZGVycy93b3Jrb3JkZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsVUFBQTtJQUNBOztJQUVB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QUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxxQkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSw0QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSw2QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxxQ0FBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSw4QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxhQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLG9CQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLG9CQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLGlCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLHdCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLHdCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLHNCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLDZCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLDZCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLG9CQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLDJCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLDJCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLGVBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBOzs7O2FBSUEsTUFBQSxvQkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7Ozs7Ozs7Ozs7O0FDalhBOztBQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLFdBQUE7QUFDQTtJQUNBLE9BQUEsU0FBQSxPQUFBLE1BQUE7SUFDQTtRQUNBLFFBQUEsSUFBQSxLQUFBOztRQUVBLE1BQUEsSUFBQSxXQUFBLFNBQUEsR0FBQTtRQUNBOztBQUVBLFFBQUEsSUFBQSxZQUFBO1lBQ0EsR0FBQSxTQUFBLEtBQUE7WUFDQTtnQkFDQSxRQUFBLElBQUE7Z0JBQ0EsS0FBQSxHQUFBOzs7OztBQ25CQTs7QUFFQSxRQUFBLE9BQUE7S0FDQSxVQUFBLGFBQUE7SUFDQTtRQUNBLFNBQUEsS0FBQSxPQUFBLFNBQUEsT0FBQSxTQUFBOzs7O1lBSUEsSUFBQSxTQUFBLFVBQUEsS0FBQTtnQkFDQSxNQUFBLE9BQUEsSUFBQSxLQUFBO2dCQUNBLE9BQUE7OztZQUdBLElBQUEsWUFBQSxVQUFBLEtBQUE7Z0JBQ0EsSUFBQSxDQUFBLEtBQUE7b0JBQ0EsT0FBQTs7Z0JBRUEsTUFBQSxJQUFBLEtBQUE7Z0JBQ0EsT0FBQTs7O1lBR0EsUUFBQSxTQUFBLFFBQUE7WUFDQSxRQUFBLFlBQUEsUUFBQTs7O1FBR0EsT0FBQTtZQUNBLFNBQUE7WUFDQSxNQUFBO1lBQ0EsVUFBQTs7O0FDN0JBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxlQUFBLE9BQUEsZ0JBQUE7SUFDQTtRQUNBLE9BQUEsU0FBQSxPQUFBO1FBQ0E7WUFDQSxRQUFBLFNBQUE7WUFDQSxJQUFBLE1BQUE7O1lBRUEsR0FBQSxNQUFBLFNBQUE7WUFDQTtnQkFDQSxNQUFBLE1BQUEsT0FBQSxHQUFBLGFBQUE7OztZQUdBO2dCQUNBLE1BQUE7OztZQUdBLE9BQUE7Ozs7Ozs7OztBQ2hCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxlQUFBLENBQUEsU0FBQSxVQUFBLFNBQUEsT0FBQSxRQUFBOztRQUVBLE9BQUE7O1lBRUEsT0FBQSxTQUFBLE9BQUE7WUFDQTtnQkFDQSxJQUFBLGNBQUEsRUFBQSxPQUFBLE9BQUEsVUFBQTs7Ozs7Z0JBS0EsT0FBQSxNQUFBLE1BQUE7OztZQUdBLGlCQUFBO1lBQ0E7Z0JBQ0EsT0FBQSxNQUFBOzs7WUFHQSxRQUFBO1lBQ0E7Z0JBQ0EsTUFBQTs7Ozs7Ozs7Ozs7QUN2QkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsZ0JBQUEsQ0FBQSxTQUFBLGVBQUEsV0FBQSxTQUFBLE9BQUEsYUFBQSxRQUFBOztRQUVBLElBQUEsWUFBQTtZQUNBLFNBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxNQUFBOztnQkFFQTtnQkFDQTtvQkFDQTtvQkFDQTt3QkFDQSxrQkFBQTt3QkFDQSxRQUFBO3dCQUNBO3dCQUNBOzRCQUNBLFNBQUE7O3dCQUVBLGNBQUE7Ozs7WUFJQTtZQUNBOzs7WUFHQSxTQUFBO1lBQ0E7WUFDQTtnQkFDQSxPQUFBO2dCQUNBLFFBQUE7Ozs7O1FBS0EsT0FBQTs7WUFFQSx1QkFBQSxTQUFBO1lBQ0E7O2dCQUVBLE1BQUEsY0FBQTtvQkFDQSxTQUFBO3dCQUNBLE9BQUE7NEJBQ0EsTUFBQTs7d0JBRUE7d0JBQ0E7NEJBQ0EsS0FBQTs0QkFDQTs0QkFDQTtnQ0FDQSxNQUFBOzs7d0JBR0E7d0JBQ0E7NEJBQ0EsTUFBQTs0QkFDQTs0QkFDQTtnQ0FDQSxPQUFBO2dDQUNBLE1BQUE7OzRCQUVBOzRCQUNBO2dDQUNBLE1BQUE7Ozt3QkFHQTt3QkFDQTs7Ozs7b0JBS0EsT0FBQTt3QkFDQSxNQUFBOzs7b0JBR0EsU0FBQTs7O2dCQUdBLFlBQUEsSUFBQSxpQ0FBQSxLQUFBLEVBQUEsZ0JBQUEsS0FBQSxLQUFBLFNBQUE7Z0JBQ0E7b0JBQ0EsSUFBQSxVQUFBO29CQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLFFBQUE7b0JBQ0E7d0JBQ0EsSUFBQSxlQUFBLEtBQUE7O3dCQUVBLFFBQUEsS0FBQSxDQUFBLEtBQUEsSUFBQSxTQUFBLGFBQUEsT0FBQSxTQUFBLGFBQUEsU0FBQSxJQUFBLFNBQUEsYUFBQTs7O29CQUdBLE1BQUEsWUFBQSxTQUFBLENBQUEsQ0FBQSxNQUFBLG9CQUFBLE1BQUE7O29CQUVBLE1BQUEsWUFBQSxVQUFBOzs7Z0JBR0E7Z0JBQ0E7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QUEsTUFBQSxPQUFBLE1BQUEsT0FBQTtvQkFDQSxPQUFBLE1BQUEsT0FBQSxPQUFBOzs7Ozs7Ozs7OztBQ2hCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxlQUFBLENBQUEsU0FBQSxlQUFBLFdBQUEsU0FBQSxPQUFBLGFBQUEsUUFBQTs7UUFFQSxJQUFBLGVBQUEsWUFBQSxJQUFBOztRQUVBLE9BQUE7O1lBRUEsZ0JBQUEsU0FBQTtZQUNBO2dCQUNBLGFBQUEsVUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsV0FBQTs7OztZQUlBLFlBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLFdBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtnQkFDQTs7O29CQUdBLEtBQUEsWUFBQSxTQUFBLEtBQUE7b0JBQ0EsTUFBQSxVQUFBOzs7O1lBSUEsaUJBQUEsU0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxZQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBOztvQkFFQSxNQUFBLFlBQUE7Ozs7WUFJQSxhQUFBLFNBQUEsT0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxZQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsV0FBQTs7OztZQUlBLGtCQUFBLFNBQUE7WUFDQTtnQkFDQSxZQUFBLElBQUEsYUFBQSxVQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxhQUFBOzs7Ozs7WUFNQSxjQUFBLFNBQUEsT0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxhQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7Ozs7b0JBSUEsS0FBQSxhQUFBLFFBQUEsS0FBQTtvQkFDQSxLQUFBLFdBQUEsUUFBQSxLQUFBOzs7b0JBR0EsS0FBQSxZQUFBLFNBQUEsS0FBQTs7b0JBRUEsS0FBQSxZQUFBOzs7b0JBR0EsTUFBQSxZQUFBOzs7O1lBSUEsY0FBQSxTQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLFNBQUEsVUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsU0FBQTs7OztZQUlBLFVBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLFNBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxRQUFBOzs7O1lBSUEsYUFBQSxTQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLFFBQUEsVUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsUUFBQTs7OztZQUlBLFNBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLFFBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxPQUFBOzs7O1lBSUEsaUJBQUEsU0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxZQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBOztvQkFFQSxNQUFBLFlBQUE7Ozs7WUFJQSxhQUFBLFNBQUEsT0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxZQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsV0FBQTs7OztZQUlBLFVBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsUUFBQSxJQUFBLG1CQUFBOztnQkFFQSxZQUFBLElBQUEsVUFBQSxPQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBOzs7Ozs7WUFNQSxzQkFBQSxTQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLGlCQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBOztvQkFFQSxNQUFBLGlCQUFBOzs7O1lBSUEsa0JBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLGlCQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7Ozs7b0JBSUEsS0FBQSxjQUFBLFFBQUEsS0FBQTs7O29CQUdBLEtBQUEsWUFBQSxTQUFBLEtBQUE7b0JBQ0EsS0FBQSxPQUFBLFNBQUEsS0FBQTs7b0JBRUEsTUFBQSxnQkFBQTs7OztZQUlBLG9CQUFBLFNBQUE7WUFDQTtnQkFDQSxZQUFBLElBQUEsZUFBQSxVQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxlQUFB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QUFBLE9BQUE7O1FBRUEsS0FBQSxrQkFBQTtRQUNBLEtBQUEsbUJBQUE7OztRQUdBLFlBQUEsU0FBQSxNQUFBLGFBQUE7UUFDQSxZQUFBLGVBQUE7O1FBRUEsS0FBQSxjQUFBO1FBQ0E7WUFDQSxLQUFBLE1BQUE7O1lBRUEsSUFBQSxVQUFBLEtBQUEsTUFBQTs7O1lBR0EsR0FBQTtZQUNBOztnQkFFQSxLQUFBLE1BQUEsTUFBQSxLQUFBO2dCQUNBOztvQkFFQSxhQUFBLEtBQUE7b0JBQ0EsT0FBQSxHQUFBO21CQUNBO2dCQUNBO29CQUNBLGFBQUEsS0FBQTtvQkFDQSxRQUFBLElBQUE7Ozs7O1FBS0EsS0FBQSxhQUFBO1FBQ0E7WUFDQSxRQUFBLElBQUEsS0FBQTs7WUFFQSxLQUFBLE1BQUEsZUFBQSxLQUFBO2dCQUNBLFVBQUEsS0FBQSxNQUFBO2dCQUNBLFlBQUEsS0FBQSxnQkFBQTtnQkFDQSxVQUFBLEtBQUE7Z0JBQ0EsU0FBQSxLQUFBOzs7WUFHQSxLQUFBLGtCQUFBO1lBQ0EsS0FBQSxtQkFBQTs7O1FBR0EsS0FBQSxnQkFBQSxTQUFBLEdBQUE7UUFDQTtZQUNBLElBQUE7WUFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxNQUFBLGVBQUEsUUFBQTtZQUNBO2dCQUNBLEdBQUEsYUFBQSxLQUFBLE1BQUEsZUFBQSxHQUFBO2dCQUNBO29CQUNBLGdCQUFBO29CQUNBOzs7O1lBSUEsUUFBQSxJQUFBO1lBQ0EsS0FBQSxNQUFBLGVBQUEsT0FBQSxlQUFBOztZQUVBLEVBQUE7OztRQUdBLEtBQUEsY0FBQTtRQUNBO1lBQ0EsS0FBQSxNQUFBLFNBQUEsS0FBQTtZQUNBO2dCQUNBLGFBQUEsS0FBQTtnQkFDQSxRQUFBLElBQUE7Z0JBQ0EsT0FBQSxHQUFBO2VBQ0E7WUFDQTtnQkFDQSxhQUFBLEtBQUE7Ozs7OztRQU1BLEtBQUEsb0JBQUEsU0FBQTtRQUNBO1lBQ0EsSUFBQSxTQUFBLGNBQUEsUUFBQSxJQUFBLGlCQUFBO1lBQ0EsT0FBQSxLQUFBO2dCQUNBO29CQUNBLEtBQUE7O2dCQUVB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QUFBLEtBQUE7b0JBQ0EsT0FBQSxHQUFBO29CQUNBO2lCQUNBO29CQUNBLGFBQUEsS0FBQTs7Ozs7O1FBTUEsS0FBQSxjQUFBO1FBQ0E7WUFDQSxRQUFBLElBQUEsS0FBQTs7WUFFQSxHQUFBLEtBQUEsUUFBQSxzQkFBQSxXQUFBLEVBQUEsS0FBQSxRQUFBLG9CQUFBOztZQUVBLEtBQUEsUUFBQSxrQkFBQSxLQUFBO2dCQUNBLGFBQUEsS0FBQSxpQkFBQTtnQkFDQSxVQUFBLEtBQUE7Z0JBQ0EsVUFBQSxLQUFBOzs7WUFHQSxHQUFBLEtBQUEsUUFBQSxTQUFBLGFBQUEsS0FBQSxRQUFBLFNBQUEsTUFBQSxFQUFBLEtBQUEsUUFBQSxPQUFBO1lBQ0EsSUFBQSxjQUFBLFdBQUEsS0FBQSxRQUFBO1lBQ0EsSUFBQSxTQUFBLFdBQUEsS0FBQSxpQkFBQSxhQUFBLFNBQUEsS0FBQTtZQUNBLGVBQUE7WUFDQSxLQUFBLFFBQUEsT0FBQTs7WUFFQSxLQUFBLG1CQUFBO1lBQ0EsS0FBQSxtQkFBQTs7WUFFQSxRQUFBLElBQUEsS0FBQTs7O1FBR0EsS0FBQSxpQkFBQSxTQUFBLEdBQUE7UUFDQTtZQUNBLElBQUE7WUFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxRQUFBLGtCQUFBLFFBQUE7WUFDQTtnQkFDQSxHQUFBLGNBQUEsS0FBQSxRQUFBLGtCQUFBLEdBQUE7Z0JBQ0E7b0JBQ0EsZ0JBQUE7b0JBQ0E7Ozs7WUFJQSxRQUFBLElBQUE7O1lBRUEsSUFBQSxjQUFBLFdBQUEsS0FBQSxRQUFBO1lBQ0EsSUFBQSxTQUFBLFdBQUEsS0FBQSxRQUFBLGtCQUFBLGVBQUEsU0FBQSxhQUFBLFNBQUEsS0FBQSxRQUFBLGtCQUFBLGVBQUE7WUFDQSxlQUFBO1lBQ0EsS0FBQSxRQUFBLE9BQUE7O1lBRUEsS0FBQSxRQUFBLGtCQUFBLE9BQUEsZUFBQTs7WUFFQSxFQUFBOzs7OztJQUtBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDJCQUFBLENBQUEsU0FBQSxVQUFBLGVBQUEsZ0JBQUEsZUFBQSxxQkFBQSxnQkFB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LElBQUEsT0FBQTs7UUFFQSxLQUFBLGFBQUE7UUFDQTtZQUNBLEtBQUEsTUFBQTs7WUFFQSxJQUFBLFVBQUEsS0FBQSxNQUFBOzs7WUFHQSxHQUFBO1lBQ0E7O2dCQUVBLElBQUEsSUFBQSxLQUFBOztnQkFFQSxZQUFBLElBQUEsUUFBQSxLQUFBLEdBQUEsS0FBQSxTQUFBO2dCQUNBO29CQUNBLFFBQUEsSUFBQTs7b0JBRUEsYUFBQSxLQUFBO29CQUNBLE9BQUEsR0FBQTs7bUJBRUE7Z0JBQ0E7b0JBQ0EsYUFBQSxLQUFBOzs7Ozs7O0lBT0EsUUFBQSxPQUFBLG1CQUFBLFdBQUEsd0JBQUEsQ0FBQSxTQUFBLFVBQUEsZ0JBQUEsZUFBQSxlQUFBLGdCQUFBOzs7O0FDbkNBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEscUJBQUEsT0FBQSxRQUFBLGNBQUEsYUFBQSxhQUFBLGVBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTs7O1FBR0EsWUFBQSxRQUFBLE1BQUEsYUFBQTs7UUFFQSxLQUFBLGFBQUE7UUFDQTtZQUNBLEtBQUEsTUFBQTs7WUFFQSxJQUFBLFVBQUEsS0FBQSxNQUFBOzs7WUFHQSxHQUFBO1lBQ0E7Z0JBQ0EsS0FBQSxLQUFBLE1BQUEsS0FBQTtnQkFDQTtvQkFDQSxhQUFBLEtBQUE7b0JBQ0EsT0FBQSxHQUFBOzttQkFFQTtnQkFDQTtvQkFDQSxhQUFBLEtBQUE7b0JBQ0EsUUFBQSxJQUFBOzs7OztRQUtBLEtBQUEsYUFBQTtRQUNBO1lBQ0EsS0FBQSxLQUFBLFNBQUEsS0FBQTtZQUNBO2dCQUNBLGFBQUEsS0FBQTtnQkFDQSxPQUFBLEdBQUE7ZUFDQTtZQUNBO2dCQUNBLGFBQUEsS0FBQTs7Ozs7O1FBTUEsS0FBQSxvQkFBQSxTQUFBO1FBQ0E7WUFDQSxJQUFBLFNBQUEsY0FBQSxRQUFBLElBQUEsZ0JBQUE7WUFDQSxPQUFBLEtBQUE7Z0JBQ0E7b0JBQ0EsS0FBQTs7Z0JBRUE7Z0JBQ0E7Ozs7OztJQU1BLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHdCQUFBLENBQUEsU0FBQSxVQUFBLGdCQUFB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bGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJyxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgICdhcHAuY29udHJvbGxlcnMnLFxyXG4gICAgICAgICAgICAnYXBwLmZpbHRlcnMnLFxyXG4gICAgICAgICAgICAnYXBwLnNlcnZpY2VzJyxcclxuICAgICAgICAgICAgJ2FwcC5kaXJlY3RpdmVzJyxcclxuICAgICAgICAgICAgJ2FwcC5yb3V0ZXMnLFxyXG4gICAgICAgICAgICAnYXBwLmNvbmZpZydcclxuICAgICAgICBdKTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJywgWyd1aS5yb3V0ZXInLCAnc2F0ZWxsaXplcicsICdyZXN0YW5ndWxhcicsICdhbmd1bGFyLW1vbWVudGpzJywgJ25nTWF0ZXJpYWwnLCAnbmdGaWxlVXBsb2FkJ10pO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnLCBbJ3VpLnJvdXRlcicsICdzYXRlbGxpemVyJ10pO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycsIFsndWkucm91dGVyJywgJ25nTWF0ZXJpYWwnLCAncmVzdGFuZ3VsYXInLCAnYW5ndWxhci1tb21lbnRqcycsICdhcHAuc2VydmljZXMnLCAnbmdNZXNzYWdlcycsICduZ01kSWNvbnMnLCAnbWQuZGF0YS50YWJsZScsICdoaWdoY2hhcnRzLW5nJywgJ25nQ29va2llcyddKTtcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycsIFtdKTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnLCBbJ2FuZ3VsYXItbW9tZW50anMnXSk7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycsIFtdKTtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIENvbmZpZ3VyYXRpb24gc3R1ZmZcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uICgkYXV0aFByb3ZpZGVyKVxyXG4gICAge1xyXG4gICAgICAgIC8vIFNhdGVsbGl6ZXIgY29uZmlndXJhdGlvbiB0aGF0IHNwZWNpZmllcyB3aGljaCBBUElcclxuICAgICAgICAvLyByb3V0ZSB0aGUgSldUIHNob3VsZCBiZSByZXRyaWV2ZWQgZnJvbVxyXG4gICAgICAgICRhdXRoUHJvdmlkZXIubG9naW5VcmwgPSAnL2FwaS9hdXRoZW50aWNhdGUnO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24gKCRtb21lbnRQcm92aWRlcilcclxuICAgIHtcclxuICAgICAgICAkbW9tZW50UHJvdmlkZXJcclxuICAgICAgICAgICAgLmFzeW5jTG9hZGluZyhmYWxzZSlcclxuICAgICAgICAgICAgLnNjcmlwdFVybCgnLy9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvbW9tZW50LmpzLzIuNS4xL21vbWVudC5taW4uanMnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKCBmdW5jdGlvbihSZXN0YW5ndWxhclByb3ZpZGVyKSB7XHJcbiAgICAgICAgUmVzdGFuZ3VsYXJQcm92aWRlclxyXG4gICAgICAgICAgICAuc2V0QmFzZVVybCgnL2FwaS8nKVxyXG4gICAgICAgICAgICAuc2V0RGVmYXVsdEhlYWRlcnMoeyBhY2NlcHQ6IFwiYXBwbGljYXRpb24veC5sYXJhdmVsLnYxK2pzb25cIiB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKCBmdW5jdGlvbigkbWRUaGVtaW5nUHJvdmlkZXIpIHtcclxuICAgICAgICAvKiBGb3IgbW9yZSBpbmZvLCB2aXNpdCBodHRwczovL21hdGVyaWFsLmFuZ3VsYXJqcy5vcmcvIy9UaGVtaW5nLzAxX2ludHJvZHVjdGlvbiAqL1xyXG5cclxuICAgICAgICB2YXIgY3VzdG9tQmx1ZU1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCdsaWdodC1ibHVlJyxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICdjb250cmFzdERlZmF1bHRDb2xvcic6ICdsaWdodCcsXHJcbiAgICAgICAgICAgICdjb250cmFzdERhcmtDb2xvcnMnOiBbJzUwJ10sXHJcbiAgICAgICAgICAgICc1MCc6ICdmZmZmZmYnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCdjdXN0b21CbHVlJywgY3VzdG9tQmx1ZU1hcCk7XHJcbiAgICAgICAgJG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0JylcclxuICAgICAgICAgICAgLnByaW1hcnlQYWxldHRlKCdjdXN0b21CbHVlJyxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgJ2RlZmF1bHQnOiAnNTAwJyxcclxuICAgICAgICAgICAgICAgICdodWUtMSc6ICc1MCdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmFjY2VudFBhbGV0dGUoJ3BpbmsnKTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbigkbWREYXRlTG9jYWxlUHJvdmlkZXIpXHJcbiAgICB7XHJcbiAgICAgICAgJG1kRGF0ZUxvY2FsZVByb3ZpZGVyLmZvcm1hdERhdGUgPSBmdW5jdGlvbihkYXRlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoZGF0ZSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUpLmZvcm1hdCgnTU0tREQtWVlZWScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIENoZWNrIGZvciBhdXRoZW50aWNhdGVkIHVzZXIgb24gZXZlcnkgcmVxdWVzdFxyXG4gICAgYXBwLnJ1bihbJyRyb290U2NvcGUnLCAnJGxvY2F0aW9uJywgJyRzdGF0ZScsICdBdXRoU2VydmljZScsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkbG9jYXRpb24sICRzdGF0ZSwgQXV0aFNlcnZpY2UpIHtcclxuXHJcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zLCBvcHRpb25zKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnQXR0ZW1wdGluZyB0byBnZXQgdXJsOiBbJyArIHRvU3RhdGUubmFtZSArICddJyk7XHJcbiAgICAgICAgICAgIC8vIExldCBhbnlvbmUgZ28gdG8gdGhlIGxvZ2luIHBhZ2UsIGNoZWNrIGF1dGggb24gYWxsIG90aGVyIHBhZ2VzXHJcbiAgICAgICAgICAgIGlmKHRvU3RhdGUubmFtZSAhPT0gJ2FwcC5sb2dpbicpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKCFBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInVzZXIgbm90IGxvZ2dlZCBpbiwgcmVkaXJlY3QgdG8gbG9naW4gcGFnZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmxvZ2luJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1dKTtcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uKClcclxue1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycpLmNvbmZpZyggZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGF1dGhQcm92aWRlciApIHtcclxuXHJcbiAgICAgICAgdmFyIGdldFZpZXcgPSBmdW5jdGlvbiggdmlld05hbWUgKXtcclxuICAgICAgICAgICAgcmV0dXJuICcvdmlld3MvYXBwLycgKyB2aWV3TmFtZSArICcuaHRtbCc7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL3B1cmNoYXNlb3JkZXJzJyk7XHJcblxyXG5cclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcCcsIHtcclxuICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2hlYWRlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSGVhZGVyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxIZWFkZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBmb290ZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2Zvb3RlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRm9vdGVyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxGb290ZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBtYWluOiB7fVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5sb2dpbicsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9sb2dpbicsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xvZ2luJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsTG9naW4nXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5sYW5kaW5nJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2xhbmRpbmcnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdsYW5kaW5nJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMYW5kaW5nQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxMYW5kaW5nJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucHJvZHVjdHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcHJvZHVjdHMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwcm9kdWN0cycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUHJvZHVjdCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnByb2R1Y3RzLmRldGFpbCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9kZXRhaWwvOnByb2R1Y3RJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3Byb2R1Y3QuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9kdWN0RGV0YWlsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQcm9kdWN0RGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucHJvZHVjdHMuY3JlYXRlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NyZWF0ZScsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3Byb2R1Y3QuY3JlYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9kdWN0Q3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQcm9kdWN0Q3JlYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuY3VzdG9tZXJzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2N1c3RvbWVycycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2N1c3RvbWVycycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ3VzdG9tZXJDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybEN1c3RvbWVyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuY3VzdG9tZXJzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdjdXN0b21lci5jcmVhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0N1c3RvbWVyQ3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxDdXN0b21lckNyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmN1c3RvbWVycy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzpjdXN0b21lcklkJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnY3VzdG9tZXIuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDdXN0b21lckRldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsQ3VzdG9tZXJEZXRhaWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC53b3Jrb3JkZXJzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3dvcmtvcmRlcnMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd3b3Jrb3JkZXJzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdXb3JrT3JkZXJDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFdvcmtPcmRlcidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLndvcmtvcmRlcnMuY3JlYXRlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NyZWF0ZScsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3dvcmtvcmRlci5jcmVhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtPcmRlckNyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsV29ya09yZGVyQ3JlYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAud29ya29yZGVycy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzp3b3JrT3JkZXJJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3dvcmtvcmRlci5kZXRhaWwnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtPcmRlckRldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsV29ya09yZGVyRGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuZXZlbnRzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2V2ZW50cycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2V2ZW50cycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRXZlbnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybEV2ZW50J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuZXZlbnRzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdldmVudC5jcmVhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0V2ZW50Q3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxFdmVudENyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmV2ZW50cy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzpldmVudElkJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnZXZlbnQuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFdmVudERldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsRXZlbnREZXRhaWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5yZXBvcnRzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3JlcG9ydHMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdyZXBvcnRzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXBvcnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFJlcG9ydCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnJlcG9ydHMuY3VycmVudHN0b2NrJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2N1cnJlbnRzdG9jaycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3JlcG9ydC5jdXJyZW50c3RvY2snKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcG9ydENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUmVwb3J0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucmVwb3J0cy5zYWxlcycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9zYWxlcycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3JlcG9ydC5zYWxlcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVwb3J0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxSZXBvcnQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5yZXBvcnRzLnNhbGVzYnltb250aCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9zYWxlc2J5bW9udGgnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdyZXBvcnQuc2FsZXNieW1vbnRoJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXBvcnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFJlcG9ydCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnJlcG9ydHMuaW5jb21lYnltb250aCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9pbmNvbWVieW1vbnRoJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncmVwb3J0LmluY29tZWJ5bW9udGgnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcG9ydENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUmVwb3J0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucmVwb3J0cy5wcm9kdWN0cHJvZml0cGVyY2VudHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcHJvZHVjdHByb2ZpdHBlcmNlbnRzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncmVwb3J0LnByb2R1Y3Rwcm9maXRwZXJjZW50cycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVwb3J0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxSZXBvcnQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5yZXBvcnRzLndlZWt3b3Jrb3JkZXJzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3dlZWt3b3Jrb3JkZXJzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncmVwb3J0LndlZWt3b3Jrb3JkZXJzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXBvcnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFJlcG9ydCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnVuaXRzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3VuaXRzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygndW5pdHMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VuaXRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFVuaXQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC51bml0cy5jcmVhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvY3JlYXRlJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygndW5pdC5jcmVhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VuaXRDcmVhdGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFVuaXRDcmVhdGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC51bml0cy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzp1bml0SWQnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd1bml0LmRldGFpbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVW5pdERldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsVW5pdERldGFpbCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLm1hdGVyaWFscycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9tYXRlcmlhbHMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdtYXRlcmlhbHMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01hdGVyaWFsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxNYXRlcmlhbCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLm1hdGVyaWFscy5jcmVhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvY3JlYXRlJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnbWF0ZXJpYWwuY3JlYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNYXRlcmlhbENyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsTWF0ZXJpYWxDcmVhdGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5tYXRlcmlhbHMuZGV0YWlsJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2RldGFpbC86bWF0ZXJpYWxJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ21hdGVyaWFsLmRldGFpbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWF0ZXJpYWxEZXRhaWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybE1hdGVyaWFsRGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucHVyY2hhc2VvcmRlcnMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcHVyY2hhc2VvcmRlcnMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwdXJjaGFzZW9yZGVycycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHVyY2hhc2VPcmRlckNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUHVyY2hhc2VPcmRlcidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnB1cmNoYXNlb3JkZXJzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwdXJjaGFzZW9yZGVyLmNyZWF0ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHVyY2hhc2VPcmRlckNyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUHVyY2hhc2VPcmRlckNyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnB1cmNoYXNlb3JkZXJzLmRldGFpbCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9kZXRhaWwvOnB1cmNoYXNlT3JkZXJJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3B1cmNoYXNlb3JkZXIuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQdXJjaGFzZU9yZGVyRGV0YWlsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQdXJjaGFzZU9yZGVyRGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucGF5bWVudHR5cGVzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3BheW1lbnR0eXBlcycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3BheW1lbnR0eXBlcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUGF5bWVudFR5cGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFBheW1lbnRUeXBlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucGF5bWVudHR5cGVzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwYXltZW50dHlwZS5jcmVhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1BheW1lbnRUeXBlQ3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQYXltZW50VHlwZUNyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnBheW1lbnR0eXBlcy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzpwYXltZW50VHlwZUlkJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncGF5bWVudHR5cGUuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQYXltZW50VHlwZURldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUGF5bWVudFR5cGVEZXRhaWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5sb29rdXBzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2xvb2t1cHMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdsb29rdXBzJylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLm1hdGVyaWFsc2V0cycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9tYXRlcmlhbHNldHMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdtYXRlcmlhbHNldHMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01hdGVyaWFsU2V0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxNYXRlcmlhbFNldCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICA7XHJcblxyXG4gICAgfSApO1xyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGJ5b3VuZyBvbiAzLzE4LzIwMTYuXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdmb2N1c09uJywgZnVuY3Rpb24gKClcclxue1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbGVtLCBhdHRyKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGF0dHIuZm9jdXNPbik7XHJcblxyXG4gICAgICAgIHNjb3BlLiRvbignZm9jdXNPbicsIGZ1bmN0aW9uKGUsIG5hbWUpXHJcbiAgICAgICAge1xyXG5cclxuY29uc29sZS5sb2coJ25hbWUgaXMnICsgbmFtZSk7XHJcbiAgICAgICAgICAgIGlmKG5hbWUgPT09IGF0dHIuZm9jdXNPbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmb3VuZCBlbGVtXCIpO1xyXG4gICAgICAgICAgICAgICAgZWxlbVswXS5mb2N1cygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKVxyXG4gICAgLmRpcmVjdGl2ZSgndXRjUGFyc2VyJywgZnVuY3Rpb24gKClcclxuICAgIHtcclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbmdNb2RlbCkge1xyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkluIHV0Y1BhcnNlciBkaXJlY3RpdmVcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgcGFyc2VyID0gZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICAgICAgdmFsID0gbW9tZW50LnV0Yyh2YWwpLmZvcm1hdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtYXR0ZXIgPSBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YWwgPSBuZXcgRGF0ZSh2YWwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIG5nTW9kZWwuJHBhcnNlcnMudW5zaGlmdChwYXJzZXIpO1xyXG4gICAgICAgICAgICBuZ01vZGVsLiRmb3JtYXR0ZXJzLnVuc2hpZnQoZm9ybWF0dGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJ1xyXG4gICAgICAgIH07XHJcbiAgICB9KTsiLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLmZpbHRlcnNcIikuZmlsdGVyKCd0cnVuY2F0ZU5hbWUnLCBmdW5jdGlvbigpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBtYXhMZW5ndGgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnB1dCA9IGlucHV0IHx8IFwiXCI7XHJcbiAgICAgICAgICAgIHZhciBvdXQgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgaWYoaW5wdXQubGVuZ3RoID4gbWF4TGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBvdXQgPSBpbnB1dC5zdWJzdHIoMCwgbWF4TGVuZ3RoKSArIFwiLi4uXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBvdXQgPSBpbnB1dDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG91dDtcclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBieW91bmcgb24gMy8xNC8yMDE2LlxyXG4gKi9cclxuKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdBdXRoU2VydmljZScsIFsnJGF1dGgnLCAnJHN0YXRlJywgZnVuY3Rpb24oJGF1dGgsICRzdGF0ZSkge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICAgICAgbG9naW46IGZ1bmN0aW9uKGVtYWlsLCBwYXNzd29yZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNyZWRlbnRpYWxzID0geyBlbWFpbDogZW1haWwsIHBhc3N3b3JkOiBwYXNzd29yZCB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coY3JlZGVudGlhbHMpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFVzZSBTYXRlbGxpemVyJ3MgJGF1dGggc2VydmljZSB0byBsb2dpbiBiZWNhdXNlIGl0J2xsIGF1dG9tYXRpY2FsbHkgc2F2ZSB0aGUgSldUIGluIGxvY2FsU3RvcmFnZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRhdXRoLmxvZ2luKGNyZWRlbnRpYWxzKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGlzQXV0aGVudGljYXRlZDogZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGF1dGguaXNBdXRoZW50aWNhdGVkKCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBsb2dvdXQ6IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgJGF1dGgubG9nb3V0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1dKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgQnJlZW4gb24gMTUvMDIvMjAxNi5cclxuICovXHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0NoYXJ0U2VydmljZScsIFsnJGF1dGgnLCAnUmVzdGFuZ3VsYXInLCAnJG1vbWVudCcsIGZ1bmN0aW9uKCRhdXRoLCBSZXN0YW5ndWxhciwgJG1vbWVudCl7XHJcblxyXG4gICAgICAgIHZhciBwaWVDb25maWcgPSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIGNoYXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3BpZSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBwbG90T3B0aW9uczpcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBwaWU6XHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxvd1BvaW50U2VsZWN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUxhYmVsczpcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93SW5MZWdlbmQ6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0aXRsZTpcclxuICAgICAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbG9hZGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgc2l6ZTpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDQwMCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogMjUwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgICAgIGdldE1vbnRobHlTYWxlc1JlcG9ydDogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgICAgICBzY29wZS5jaGFydENvbmZpZyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29sdW1uJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5QXhpczpcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJyMgb2Ygc2FsZXMnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhBeGlzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZGF0ZXRpbWUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZVRpbWVMYWJlbEZvcm1hdHM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9udGg6ICclYicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeWVhcjogJyViJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdEYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1NhbGVzIHBlciBtb250aCdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgncmVwb3J0cy9nZXRNb250aGx5U2FsZXNSZXBvcnQnKS5wb3N0KHsgJ3JlcG9ydFBhcmFtcyc6IHt9fSkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhU2V0ID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb25lRGF0YVBvaW50ID0gZGF0YVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhvbmVEYXRhUG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhU2V0LnB1c2goW0RhdGUuVVRDKHBhcnNlSW50KG9uZURhdGFQb2ludC55ZWFyKSwgcGFyc2VJbnQob25lRGF0YVBvaW50Lm1vbnRoKSAtIDEpLCBwYXJzZUludChvbmVEYXRhUG9pbnQucG9jb3VudCldKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmNoYXJ0Q29uZmlnLnNlcmllcyA9IFt7bmFtZTogJ1NhbGVzIHRoaXMgbW9udGgnLCBkYXRhOiBkYXRhU2V0IH1dO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jaGFydENvbmZpZy5sb2FkaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRNb250aGx5SW5jb21lUmVwb3J0OiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgICAgIHNjb3BlLmNoYXJ0Q29uZmlnID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjb2x1bW4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHlBeGlzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnJCBhbW91bnQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhBeGlzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZGF0ZXRpbWUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZVRpbWVMYWJlbEZvcm1hdHM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9udGg6ICclYicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeWVhcjogJyViJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdEYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ0luY29tZSBwZXIgbW9udGgnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3JlcG9ydHMvZ2V0TW9udGhseVNhbGVzUmVwb3J0JykucG9zdCh7ICdyZXBvcnRQYXJhbXMnOiB7fX0pLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhU2V0ID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb25lRGF0YVBvaW50ID0gZGF0YVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cob25lRGF0YVBvaW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFTZXQucHVzaChbRGF0ZS5VVEMocGFyc2VJbnQob25lRGF0YVBvaW50LnllYXIpLCBwYXJzZUludChvbmVEYXRhUG9pbnQubW9udGgpIC0gMSksIHBhcnNlRmxvYXQob25lRGF0YVBvaW50Lm1vbnRodG90YWwpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmNoYXJ0Q29uZmlnLnNlcmllcyA9IFt7bmFtZTogJ0luY29tZSB0aGlzIG1vbnRoJywgZGF0YTogZGF0YVNldCB9XTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmNoYXJ0Q29uZmlnLmxvYWRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0VG9wU2VsbGluZ1Byb2R1Y3RzOiBmdW5jdGlvbihzY29wZSwgY2hhcnRUaXRsZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhcnRUaXRsZSk7XHJcbiAgICAgICAgICAgICAgICBzY29wZS50b3BTZWxsaW5nQ2hhcnRDb25maWcgPSB7fTtcclxuICAgICAgICAgICAgICAgIHNjb3BlLnRvcFNlbGxpbmdDaGFydENvbmZpZyA9IGpRdWVyeS5leHRlbmQodHJ1ZSwge30sIHBpZUNvbmZpZyk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncmVwb3J0cy9nZXRUb3BTZWxsaW5nUHJvZHVjdHMnKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFTZXQgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvbmVEYXRhUG9pbnQgPSBkYXRhW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKG9uZURhdGFQb2ludCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFTZXQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBvbmVEYXRhUG9pbnQubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkOiAoaSA9PT0gMCkgPyB0cnVlIDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGljZWQ6IChpID09PSAwKSA/IHRydWUgOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IHBhcnNlSW50KG9uZURhdGFQb2ludC5wY291bnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUudG9wU2VsbGluZ0NoYXJ0Q29uZmlnLnNlcmllcyA9IFt7bmFtZTogJ1NvbGQnLCBkYXRhOiBkYXRhU2V0IH1dO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnRvcFNlbGxpbmdDaGFydENvbmZpZy50aXRsZS50ZXh0ID0gY2hhcnRUaXRsZTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS50b3BTZWxsaW5nQ2hhcnRDb25maWcubG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRXJyb3JcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0UHJvZHVjdFByb2ZpdFBlcmNlbnRzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUucHJvZHVjdFByb2ZpdFBlcmNlbnRDaGFydENvbmZpZyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29sdW1uJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhBeGlzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY2F0ZWdvcnknXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHlBeGlzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdQcm9maXQgJSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdQcm9kdWN0IFByb2ZpdCAlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmc6IHRydWVcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncmVwb3J0cy9nZXRQcm9kdWN0UHJvZml0UGVyY2VudHMnKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YVNldCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9uZURhdGFQb2ludCA9IGRhdGFbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYob25lRGF0YVBvaW50LmNvc3QgPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9maXQgPSBvbmVEYXRhUG9pbnQucHJpY2UgLSBvbmVEYXRhUG9pbnQuY29zdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvZml0UGVyY2VudCA9IChwcm9maXQgLyBvbmVEYXRhUG9pbnQuY29zdCAqIDEwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ1ByaWNlOicgKyBvbmVEYXRhUG9pbnQucHJpY2UgKyAnIENvc3Q6JyArIG9uZURhdGFQb2ludC5jb3N0ICsgJyBQcm9maXQ6JyArIE1hdGgucm91bmQocHJvZml0UGVyY2VudCAqIDEwMCkgLyAxMDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ1ByaWNlOicgKyBvbmVEYXRhUG9pbnQucHJpY2UgKyAnIENvc3Q6JyArIG9uZURhdGFQb2ludC5jb3N0ICsgJyBQcm9maXQ6JyArIHByb2ZpdFBlcmNlbnQudG9GaXhlZCgwKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFTZXQucHVzaChbb25lRGF0YVBvaW50Lm5hbWUsIHBhcnNlSW50KHByb2ZpdFBlcmNlbnQudG9GaXhlZCgwKSldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVNldC5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludChiWzFdKSAtIHBhcnNlSW50KGFbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGFTZXQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvZHVjdFByb2ZpdFBlcmNlbnRDaGFydENvbmZpZy5zZXJpZXMgPSBbe25hbWU6ICdQcm9maXQgJScsIGRhdGE6IGRhdGFTZXQgfV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnByb2R1Y3RQcm9maXRQZXJjZW50Q2hhcnRDb25maWcubG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfTtcclxuICAgIH1dKTtcclxufSkoKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBCcmVlbiBvbiAxNS8wMi8yMDE2LlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnRGlhbG9nU2VydmljZScsIGZ1bmN0aW9uKCAkbWREaWFsb2cgKXtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgICAgIGZyb21DdXN0b206IGZ1bmN0aW9uKG9wdGlvbnMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkbWREaWFsb2cuc2hvdyhvcHRpb25zKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGZyb21UZW1wbGF0ZTogZnVuY3Rpb24oZXYsIHRlbXBsYXRlLCBzY29wZSApIHtcclxuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpYWxvZ3MvJyArIHRlbXBsYXRlICsgJy5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBlc2NhcGVUb0Nsb3NlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiBEaWFsb2dDb250cm9sbGVyKCRzY29wZSwgJG1kRGlhbG9nKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbmZpcm1EaWFsb2cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNhbmNlbERpYWxvZyA9IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmNhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoZXYgIT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy50YXJnZXRFdmVudCA9IGV2O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggc2NvcGUgKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2NvcGUgPSBzY29wZS4kbmV3KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9vcHRpb25zLnByZXNlcnZlU2NvcGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiAkbWREaWFsb2cuc2hvdyhvcHRpb25zKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGhpZGU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJG1kRGlhbG9nLmhpZGUoKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFsZXJ0OiBmdW5jdGlvbih0aXRsZSwgY29udGVudCl7XHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuc2hvdyhcclxuICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuYWxlcnQoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGl0bGUodGl0bGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jb250ZW50KGNvbnRlbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vaygnT2snKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGNvbmZpcm06IGZ1bmN0aW9uKGV2ZW50LCB0aXRsZSwgY29udGVudClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbmZpcm0gPSAkbWREaWFsb2cuY29uZmlybSgpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRpdGxlKHRpdGxlKVxyXG4gICAgICAgICAgICAgICAgICAgIC50ZXh0Q29udGVudChjb250ZW50KVxyXG4gICAgICAgICAgICAgICAgICAgIC5hcmlhTGFiZWwoJycpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRhcmdldEV2ZW50KGV2ZW50KVxyXG4gICAgICAgICAgICAgICAgICAgIC5vaygnWWVzJylcclxuICAgICAgICAgICAgICAgICAgICAuY2FuY2VsKCdObycpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiAkbWREaWFsb2cuc2hvdyhjb25maXJtKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbn0pKCk7IiwiXHJcbihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnRm9jdXNTZXJ2aWNlJywgWyckcm9vdFNjb3BlJywgJyR0aW1lb3V0JywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHRpbWVvdXQpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG5hbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdmb2N1c09uJywgbmFtZSk7XHJcbiAgICAgICAgICAgIH0sMTAwKTtcclxuICAgICAgICB9O1xyXG4gICAgfV0pO1xyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGJ5b3VuZyBvbiAzLzE0LzIwMTYuXHJcbiAqL1xyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0d1aWRTZXJ2aWNlJywgW2Z1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBzNCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMClcclxuICAgICAgICAgICAgICAgIC50b1N0cmluZygxNilcclxuICAgICAgICAgICAgICAgIC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICAgICAgbmV3R3VpZDogZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gczQoKSArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArXHJcbiAgICAgICAgICAgICAgICAgICAgczQoKSArICctJyArIHM0KCkgKyBzNCgpICsgczQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfV0pO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBCcmVlbiBvbiAxNS8wMi8yMDE2LlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnUmVzdFNlcnZpY2UnLCBbJyRhdXRoJywgJ1Jlc3Rhbmd1bGFyJywgJyRtb21lbnQnLCBmdW5jdGlvbigkYXV0aCwgUmVzdGFuZ3VsYXIsICRtb21lbnQpe1xyXG5cclxuICAgICAgICB2YXIgYmFzZVByb2R1Y3RzID0gUmVzdGFuZ3VsYXIuYWxsKCdwcm9kdWN0Jyk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcblxyXG4gICAgICAgICAgICBnZXRBbGxQcm9kdWN0czogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGJhc2VQcm9kdWN0cy5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvZHVjdHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRQcm9kdWN0OiBmdW5jdGlvbihzY29wZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncHJvZHVjdCcsIGlkKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBIYWNrIGZvciBPTEQgbXlzcWwgZHJpdmVycyBvbiBIb3N0Z2F0b3Igd2hpY2ggZG9uJ3QgcHJvcGVybHkgZW5jb2RlIGludGVnZXIgYW5kIHJldHVybiB0aGVtIGFzIHN0cmluZ3NcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLmlzX2N1c3RvbSA9IHBhcnNlSW50KGRhdGEuaXNfY3VzdG9tKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5wcm9kdWN0ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsQ3VzdG9tZXJzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdjdXN0b21lcicpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXN0b21lcnMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRDdXN0b21lcjogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ2N1c3RvbWVyJywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmN1c3RvbWVyID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsV29ya09yZGVyczogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnd29ya29yZGVyJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLndvcmtvcmRlcnMgPSBkYXRhO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0V29ya09yZGVyOiBmdW5jdGlvbihzY29wZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnd29ya29yZGVyJywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBGb3JtYXQgc3RyaW5nIGRhdGVzIGludG8gZGF0ZSBvYmplY3RzXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5zdGFydF9kYXRlID0gJG1vbWVudChkYXRhLnN0YXJ0X2RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuZW5kX2RhdGUgPSAkbW9tZW50KGRhdGEuZW5kX2RhdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBIYWNrIGZvciBPTEQgbXlzcWwgZHJpdmVycyBvbiBIb3N0Z2F0b3Igd2hpY2ggZG9uJ3QgcHJvcGVybHkgZW5jb2RlIGludGVnZXIgYW5kIHJldHVybiB0aGVtIGFzIHN0cmluZ3NcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLmNvbXBsZXRlZCA9IHBhcnNlSW50KGRhdGEuY29tcGxldGVkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi53b3Jrb3JkZXIgPSBkYXRhO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUud29ya29yZGVyID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsRXZlbnRzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdldmVudCcpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5ldmVudHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRFdmVudDogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ2V2ZW50JywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmV2ZW50ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsVW5pdHM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3VuaXQnKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUudW5pdHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRVbml0OiBmdW5jdGlvbihzY29wZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgndW5pdCcsIGlkKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS51bml0ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsTWF0ZXJpYWxzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdtYXRlcmlhbCcpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5tYXRlcmlhbHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRNYXRlcmlhbDogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ21hdGVyaWFsJywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLm1hdGVyaWFsID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZG9TZWFyY2g6IGZ1bmN0aW9uKHNjb3BlLCBxdWVyeSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDYWxsIFdTIHdpdGg6IFwiICsgcXVlcnkpO1xyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnc2VhcmNoJywgcXVlcnkpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsUHVyY2hhc2VPcmRlcnM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3B1cmNoYXNlb3JkZXInKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucHVyY2hhc2VvcmRlcnMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRQdXJjaGFzZU9yZGVyOiBmdW5jdGlvbihzY29wZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncHVyY2hhc2VvcmRlcicsIGlkKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRm9ybWF0IHN0cmluZyBkYXRlcyBpbnRvIGRhdGUgb2JqZWN0c1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEucGlja3VwX2RhdGUgPSAkbW9tZW50KGRhdGEucGlja3VwX2RhdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBIYWNrIGZvciBPTEQgbXlzcWwgZHJpdmVycyBvbiBIb3N0Z2F0b3Igd2hpY2ggZG9uJ3QgcHJvcGVybHkgZW5jb2RlIGludGVnZXIgYW5kIHJldHVybiB0aGVtIGFzIHN0cmluZ3NcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLmZ1bGZpbGxlZCA9IHBhcnNlSW50KGRhdGEuZnVsZmlsbGVkKTtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLnBhaWQgPSBwYXJzZUludChkYXRhLnBhaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5wdXJjaGFzZW9yZGVyID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsUGF5bWVudFR5cGVzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdwYXltZW50dHlwZScpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5wYXltZW50dHlwZXMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRQYXltZW50VHlwZTogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3BheW1lbnR0eXBlJywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnBheW1lbnR0eXBlID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0TWF0ZXJpYWxBbGxUeXBlczogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnbWF0ZXJpYWx0eXBlJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLm1hdGVyaWFsdHlwZXMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRGdWxseUJvb2tlZERheXM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3NjaGVkdWxlci9nZXRGdWxseUJvb2tlZERheXMnKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmJvb2tlZERheXMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9O1xyXG4gICAgfV0pO1xyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEJyZWVuIG9uIDE1LzAyLzIwMTYuXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdUb2FzdFNlcnZpY2UnLCBmdW5jdGlvbiggJG1kVG9hc3QgKXtcclxuXHJcbiAgICAgICAgdmFyIGRlbGF5ID0gNjAwMCxcclxuICAgICAgICAgICAgcG9zaXRpb24gPSAndG9wIHJpZ2h0JyxcclxuICAgICAgICAgICAgYWN0aW9uID0gJ09LJztcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc2hvdzogZnVuY3Rpb24oY29udGVudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRtZFRvYXN0LnNob3coXHJcbiAgICAgICAgICAgICAgICAgICAgJG1kVG9hc3Quc2ltcGxlKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNvbnRlbnQoY29udGVudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnBvc2l0aW9uKHBvc2l0aW9uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWN0aW9uKGFjdGlvbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmhpZGVEZWxheShkZWxheSlcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdVcGxvYWRTZXJ2aWNlJywgWydVcGxvYWQnLCBmdW5jdGlvbihVcGxvYWQpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgICAgIHVwbG9hZEZpbGU6IGZ1bmN0aW9uIChpZCwgdXBsb2FkVHlwZSwgZmlsZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2luIHVwbG9hZCcpO1xyXG5cclxuICAgICAgICAgICAgICAgIFVwbG9hZC51cGxvYWQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2FwaS91cGxvYWRlci91cGxvYWRGaWxlJyxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7ZmlsZTogZmlsZSwgaWQ6IGlkLCB1cGxvYWRUeXBlOiB1cGxvYWRUeXBlfVxyXG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzcClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdTdWNjZXNzICcgKyByZXNwLmNvbmZpZy5kYXRhLmZpbGUubmFtZSArICd1cGxvYWRlZC4gUmVzcG9uc2U6ICcgKyByZXNwLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3ApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHN0YXR1czogJyArIHJlc3Auc3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChldnQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy92YXIgcHJvZ3Jlc3NQZXJjZW50YWdlID0gcGFyc2VJbnQoMTAwLjAgKiBldnQubG9hZGVkIC8gZXZ0LnRvdGFsKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdwcm9ncmVzczogJyArIHByb2dyZXNzUGVyY2VudGFnZSArICclICcgKyBldnQuY29uZmlnLmRhdGEuZmlsZS5uYW1lKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfV0pO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBieW91bmcgb24gMy8xNC8yMDE2LlxyXG4gKi9cclxuKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdWYWxpZGF0aW9uU2VydmljZScsIFtmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgICAgIGRlY2ltYWxSZWdleDogZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ15cXFxcZCpcXFxcLj9cXFxcZCokJztcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIG51bWVyaWNSZWdleDogZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ15cXFxcZCokJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfV0pO1xyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIENvcmVDb250cm9sbGVyKCRzY29wZSwgJHN0YXRlLCAkbW9tZW50LCAkbWRTaWRlbmF2LCAkbWRNZWRpYSwgQXV0aFNlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG5cclxuICAgICAgICAkc2NvcGUudG9kYXlzRGF0ZSA9IHRvZGF5O1xyXG4gICAgICAgICRzY29wZS5zaG93U2VhcmNoID0gZmFsc2U7XHJcblxyXG4gICAgICAgICRzY29wZS50b2dnbGVTaWRlbmF2ID0gZnVuY3Rpb24obWVudUlkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgJG1kU2lkZW5hdihtZW51SWQpLnRvZ2dsZSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5zaG93U2lkZU5hdiA9IGZ1bmN0aW9uKG1lbnVJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKCEkbWRTaWRlbmF2KG1lbnVJZCkuaXNMb2NrZWRPcGVuKCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICRtZFNpZGVuYXYobWVudUlkKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuaGlkZVNpZGVOYXYgPSBmdW5jdGlvbihtZW51SWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZighJG1kU2lkZW5hdihtZW51SWQpLmlzTG9ja2VkT3BlbigpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAkbWRTaWRlbmF2KG1lbnVJZCkuY2xvc2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS50b2dnbGVTZWFyY2ggPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAkc2NvcGUuc2hvd1NlYXJjaCA9ICEkc2NvcGUuc2hvd1NlYXJjaDtcclxuICAgICAgICAgICAgLy9pZigkc2NvcGUuc2hvd1NlYXJjaCkgeyBjb25zb2xlLmxvZyhhbmd1bGFyLmVsZW1lbnQoJyNzdXBlclNlYXJjaCcpKTsgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIExpc3RlbiBmb3IgdG9nZ2xlU2VhcmNoIGV2ZW50c1xyXG4gICAgICAgICRzY29wZS4kb24oXCJ0b2dnbGVTZWFyY2hcIiwgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgJHNjb3BlLnRvZ2dsZVNlYXJjaCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkc2NvcGUuZGV0ZXJtaW5lRmFiVmlzaWJpbGl0eSA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKCRzdGF0ZS5pcyhcImFwcC5wcm9kdWN0c1wiKSB8fCAkc3RhdGUuaXMoXCJhcHAuY3VzdG9tZXJzXCIpXHJcbiAgICAgICAgICAgICAgICB8fCAkc3RhdGUuaXMoXCJhcHAucHVyY2hhc2VvcmRlcnNcIikgfHwgJHN0YXRlLmlzKFwiYXBwLnBheW1lbnR0eXBlc1wiKVxyXG4gICAgICAgICAgICAgICAgfHwgJHN0YXRlLmlzKFwiYXBwLndvcmtvcmRlcnNcIikgfHwgJHN0YXRlLmlzKFwiYXBwLmV2ZW50c1wiKVxyXG4gICAgICAgICAgICAgICAgfHwgJHN0YXRlLmlzKFwiYXBwLnVuaXRzXCIpIHx8ICRzdGF0ZS5pcyhcImFwcC5tYXRlcmlhbHNcIikpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmFkZEZhYk5hdmlnYXRlID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJHN0YXRlLiRjdXJyZW50Lm5hbWUpO1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gXCJcIjtcclxuICAgICAgICAgICAgc3dpdGNoKCRzdGF0ZS4kY3VycmVudC5uYW1lKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiYXBwLnByb2R1Y3RzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gXCJhcHAucHJvZHVjdHMuY3JlYXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiYXBwLmN1c3RvbWVyc1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IFwiYXBwLmN1c3RvbWVycy5jcmVhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJhcHAucHVyY2hhc2VvcmRlcnNcIjpcclxuICAgICAgICAgICAgICAgICAgICB1cmwgPSBcImFwcC5wdXJjaGFzZW9yZGVycy5jcmVhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJhcHAucGF5bWVudHR5cGVzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gXCJhcHAucGF5bWVudHR5cGVzLmNyZWF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImFwcC53b3Jrb3JkZXJzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gXCJhcHAud29ya29yZGVycy5jcmVhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJhcHAuZXZlbnRzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gXCJhcHAuZXZlbnRzLmNyZWF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImFwcC51bml0c1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IFwiYXBwLnVuaXRzLmNyZWF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImFwcC5tYXRlcmlhbHNcIjpcclxuICAgICAgICAgICAgICAgICAgICB1cmwgPSBcImFwcC5tYXRlcmlhbHMuY3JlYXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzdGF0ZS5nbyh1cmwpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5pc0F1dGhlbnRpY2F0ZWQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xyXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5sb2dpbicpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb3JlQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRzdGF0ZScsICckbW9tZW50JywgJyRtZFNpZGVuYXYnLCAnJG1kTWVkaWEnLCAnQXV0aFNlcnZpY2UnLCBDb3JlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBDdXN0b21lckNyZWF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgVG9hc3RTZXJ2aWNlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYuY3JlYXRlQ3VzdG9tZXIgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYuY3VzdG9tZXIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjID0gc2VsZi5jdXN0b21lcjtcclxuXHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ2N1c3RvbWVyJykucG9zdChjKS50aGVuKGZ1bmN0aW9uKGQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8kc3RhdGUuZ28oJ2FwcC5jdXN0b21lcnMuZGV0YWlsJywgeydjdXN0b21lcklkJzogZC5uZXdJZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuY3VzdG9tZXJzJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgY3JlYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDdXN0b21lckNyZWF0ZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdUb2FzdFNlcnZpY2UnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgQ3VzdG9tZXJDcmVhdGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEN1c3RvbWVyRGV0YWlsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBUb2FzdFNlcnZpY2UsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgRGlhbG9nU2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEN1c3RvbWVyKHNlbGYsICRzdGF0ZVBhcmFtcy5jdXN0b21lcklkKTtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVDdXN0b21lciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuY3VzdG9tZXIucHV0KCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgdXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAuY3VzdG9tZXJzXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlQ3VzdG9tZXIgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmN1c3RvbWVyLnJlbW92ZSgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBkZWxldGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLmN1c3RvbWVyc1wiKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIERlbGV0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2hvd0RlbGV0ZUNvbmZpcm0gPSBmdW5jdGlvbihldilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZXYsICdEZWxldGUgY3VzdG9tZXI/JywgJ1RoaXMgd2lsbCBhbHNvIGRlbGV0ZSBhbnkgd29yayBvcmRlcnMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgY3VzdG9tZXInKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlQ3VzdG9tZXIoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ3VzdG9tZXJEZXRhaWxDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJ0RpYWxvZ1NlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgQ3VzdG9tZXJEZXRhaWxDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEN1c3RvbWVyQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxDdXN0b21lcnMoc2VsZik7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDdXN0b21lckNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsIEN1c3RvbWVyQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBFdmVudENyZWF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLmV2ZW50ID0ge307XHJcblxyXG4gICAgICAgIHNlbGYuY3JlYXRlRXZlbnQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaXNWYWxpZCk7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYuZXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBlID0gc2VsZi5ldmVudDtcclxuXHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCRlcnJvcik7XHJcblxyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdldmVudCcpLnBvc3QoZSkudGhlbihmdW5jdGlvbihlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZXZlbnRzJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRXZlbnRDcmVhdGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgRXZlbnRDcmVhdGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEV2ZW50RGV0YWlsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcywgVG9hc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5zZWxlY3RlZFByb2R1Y3QgPSBcIlwiO1xyXG4gICAgICAgIHNlbGYuc2VsZWN0ZWRRdWFudGl0eSA9IDA7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJHN0YXRlUGFyYW1zKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRFdmVudChzZWxmLCAkc3RhdGVQYXJhbXMuZXZlbnRJZCk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUHJvZHVjdHMoc2VsZik7XHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlRXZlbnQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaXNWYWxpZCk7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL1Jlc3RTZXJ2aWNlLnVwZGF0ZVByb2R1Y3Qoc2VsZiwgc2VsZi5wcm9kdWN0LmlkKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuZXZlbnQucHV0KCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgdXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAuZXZlbnRzXCIpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5hZGRQcm9kdWN0ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5zZWxlY3RlZFByb2R1Y3QpO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5ldmVudC5ldmVudF9wcm9kdWN0cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGV2ZW50X2lkOiBzZWxmLmV2ZW50LmlkLFxyXG4gICAgICAgICAgICAgICAgcHJvZHVjdF9pZDogc2VsZi5zZWxlY3RlZFByb2R1Y3QuaWQsXHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eTogc2VsZi5zZWxlY3RlZFF1YW50aXR5LFxyXG4gICAgICAgICAgICAgICAgcHJvZHVjdDogc2VsZi5zZWxlY3RlZFByb2R1Y3RcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkUHJvZHVjdCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRRdWFudGl0eSA9IDA7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVQcm9kdWN0ID0gZnVuY3Rpb24oZSwgcHJvZHVjdElkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4VG9SZW1vdmU7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzZWxmLmV2ZW50LmV2ZW50X3Byb2R1Y3RzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihwcm9kdWN0SWQgPT0gc2VsZi5ldmVudC5ldmVudF9wcm9kdWN0c1tpXS5wcm9kdWN0X2lkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4VG9SZW1vdmUgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpbmRleFRvUmVtb3ZlKTtcclxuICAgICAgICAgICAgc2VsZi5ldmVudC5ldmVudF9wcm9kdWN0cy5zcGxpY2UoaW5kZXhUb1JlbW92ZSwgMSk7XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVFdmVudCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZXZlbnQucmVtb3ZlKCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGRlbGV0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRlZWx0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAuZXZlbnRzXCIpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgRGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zaG93RGVsZXRlQ29uZmlybSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZyA9IERpYWxvZ1NlcnZpY2UuY29uZmlybShldiwgJ0RlbGV0ZSBldmVudD8nLCAnJyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZUV2ZW50KCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0V2ZW50RGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsICdUb2FzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsIEV2ZW50RGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBFdmVudENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsRXZlbnRzKHNlbGYpO1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFdmVudENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsIEV2ZW50Q29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBGb290ZXJDb250cm9sbGVyKCRtb21lbnQpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYuY3VycmVudFllYXIgPSAkbW9tZW50KCkuZm9ybWF0KCdZWVlZJyk7XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0Zvb3RlckNvbnRyb2xsZXInLCBbJyRtb21lbnQnLCBGb290ZXJDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEhlYWRlckNvbnRyb2xsZXIoJGF1dGgsICRtb21lbnQpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLnRvZGF5c0RhdGUgPSAkbW9tZW50KCkuZm9ybWF0KCdkZGRkLCBNTU1NIERvIFlZWVknKTtcclxuXHJcbiAgICAgICAgc2VsZi5pc0F1dGhlbnRpY2F0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRhdXRoLmlzQXV0aGVudGljYXRlZCgpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hlYWRlckNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRtb21lbnQnLCBIZWFkZXJDb250cm9sbGVyXSk7XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gTGFuZGluZ0NvbnRyb2xsZXIoJHN0YXRlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTGFuZGluZ0NvbnRyb2xsZXInLCBbJyRzdGF0ZScsIExhbmRpbmdDb250cm9sbGVyXSk7XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gTG9naW5Db250cm9sbGVyKCRzdGF0ZSwgJHNjb3BlLCAkY29va2llcywgRGlhbG9nU2VydmljZSwgQXV0aFNlcnZpY2UsIEZvY3VzU2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5lbWFpbCA9ICcnO1xyXG4gICAgICAgIHNlbGYucGFzc3dvcmQgPSAnJztcclxuXHJcbiAgICAgICAgaWYoJGNvb2tpZXMuZ2V0KCdsb2dpbk5hbWUnKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZW1haWwgPSAkY29va2llcy5nZXQoJ2xvZ2luTmFtZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGRpYWxvZ09wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpYWxvZ3MvZGxnTG9naW4uaHRtbCcsXHJcbiAgICAgICAgICAgIGVzY2FwZVRvQ2xvc2U6IGZhbHNlLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiBEaWFsb2dDb250cm9sbGVyKCRzY29wZSwgJG1kRGlhbG9nKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY29uZmlybURpYWxvZyA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLmVtYWlsKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihzZWxmLmVtYWlsICE9PSAnJyAmJiBzZWxmLnBhc3N3b3JkICE9PSAnJylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEF1dGhTZXJ2aWNlLmxvZ2luKHNlbGYuZW1haWwsIHNlbGYucGFzc3dvcmQpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTG9naW4gc3VjY2VzcycpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b2RheSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3ZhciBjb29raWVFeHBpcnkgPSBuZXcgRGF0ZSh0b2RheS5nZXRZZWFyKCkgKyAxLCB0b2RheS5nZXRNb250aCgpLCB0b2RheS5nZXREYXkoKSwgMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29va2llRXhwaXJ5ID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvb2tpZUV4cGlyeS5zZXRGdWxsWWVhcihjb29raWVFeHBpcnkuZ2V0RnVsbFllYXIoKSArIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjb29raWVzLnB1dCgnbG9naW5OYW1lJywgc2VsZi5lbWFpbCwgeyBleHBpcmVzOiBjb29raWVFeHBpcnkgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRtZERpYWxvZy5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5wcm9kdWN0cycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdFcnJvciBsb2dnaW5nIGluJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNjb3BlOiAkc2NvcGUuJG5ldygpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgRGlhbG9nU2VydmljZS5mcm9tQ3VzdG9tKGRpYWxvZ09wdGlvbnMpO1xyXG5cclxuICAgICAgICBGb2N1c1NlcnZpY2UoJ2ZvY3VzTWUnKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0xvZ2luQ29udHJvbGxlcicsIFsnJHN0YXRlJywgJyRzY29wZScsICckY29va2llcycsICdEaWFsb2dTZXJ2aWNlJywgJ0F1dGhTZXJ2aWNlJywgJ0ZvY3VzU2VydmljZScsIExvZ2luQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBNYXRlcmlhbENyZWF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgVG9hc3RTZXJ2aWNlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsIFZhbGlkYXRpb25TZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxVbml0cyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRNYXRlcmlhbEFsbFR5cGVzKHNlbGYpO1xyXG5cclxuICAgICAgICBzZWxmLmRlY2ltYWxSZWdleCA9IFZhbGlkYXRpb25TZXJ2aWNlLmRlY2ltYWxSZWdleCgpO1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZU1hdGVyaWFsID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlzVmFsaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLm1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbSA9IHNlbGYubWF0ZXJpYWw7XHJcblxyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdtYXRlcmlhbCcpLnBvc3QobSkudGhlbihmdW5jdGlvbihkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vJHN0YXRlLmdvKCdhcHAuY3VzdG9tZXJzLmRldGFpbCcsIHsnY3VzdG9tZXJJZCc6IGQubmV3SWR9KTtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBjcmVhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLm1hdGVyaWFscycpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGNyZWF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ01hdGVyaWFsQ3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICdWYWxpZGF0aW9uU2VydmljZScsICckc3RhdGVQYXJhbXMnLCBNYXRlcmlhbENyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gTWF0ZXJpYWxEZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCBWYWxpZGF0aW9uU2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsVW5pdHMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0TWF0ZXJpYWxBbGxUeXBlcyhzZWxmKTtcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldE1hdGVyaWFsKHNlbGYsICRzdGF0ZVBhcmFtcy5tYXRlcmlhbElkKTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWNpbWFsUmVnZXggPSBWYWxpZGF0aW9uU2VydmljZS5kZWNpbWFsUmVnZXgoKTtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVNYXRlcmlhbCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYubWF0ZXJpYWwucHV0KCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgdXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAubWF0ZXJpYWxzXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlTWF0ZXJpYWwgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLm1hdGVyaWFsLnJlbW92ZSgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBkZWxldGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLm1hdGVyaWFsc1wiKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIERlbGV0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNob3dEZWxldGVDb25maXJtID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGV2LCAnRGVsZXRlIG1hdGVyaWFsPycsICdUaGlzIHdpbGwgYWxzbyByZW1vdmUgdGhlIG1hdGVyaWFsIGZyb20gYW55IHByb2R1Y3RzIHVzaW5nIGl0Jyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZU1hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ01hdGVyaWFsRGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgJ1ZhbGlkYXRpb25TZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIE1hdGVyaWFsRGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBNYXRlcmlhbENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsTWF0ZXJpYWxzKHNlbGYpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTWF0ZXJpYWxDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCBNYXRlcmlhbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gTWF0ZXJpYWxTZXRDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3RTZXJ2aWNlLCBHdWlkU2VydmljZSwgRGlhbG9nU2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgbG9jYWxTdG9yYWdlS2V5ID0gJ21hdGVyaWFsU2V0cyc7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLnNlbGVjdGVkTWF0ZXJpYWwgPSAnJztcclxuICAgICAgICAvL3NlbGYuc2VsZWN0ZWRRdWFudGl0eSA9IDA7XHJcblxyXG4gICAgICAgIGlmKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGxvY2FsU3RvcmFnZUtleSkgIT09IG51bGwgJiYgbG9jYWxTdG9yYWdlLmdldEl0ZW0obG9jYWxTdG9yYWdlS2V5KSAhPT0gJycpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmV4aXN0aW5nU2V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obG9jYWxTdG9yYWdlS2V5KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZXhpc3RpbmdTZXRzID0gW107XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGxvY2FsU3RvcmFnZUtleSwgSlNPTi5zdHJpbmdpZnkoc2VsZi5leGlzdGluZ1NldHMpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXRTZXRPYmplY3QoKTtcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsTWF0ZXJpYWxzKHNlbGYpO1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZVNldCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0LmlkID0gR3VpZFNlcnZpY2UubmV3R3VpZCgpO1xyXG4gICAgICAgICAgICBzZWxmLmV4aXN0aW5nU2V0cy5wdXNoKHNlbGYuc2V0KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5zZXQpO1xyXG5cclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ21hdGVyaWFsU2V0cycsIEpTT04uc3RyaW5naWZ5KHNlbGYuZXhpc3RpbmdTZXRzKSk7XHJcblxyXG4gICAgICAgICAgICBpbml0U2V0T2JqZWN0KCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVTZXQgPSBmdW5jdGlvbihlLCBzZXRJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZSwgJ0RlbGV0ZSBtYXRlcmlhbCBzZXQ/JywgJycpO1xyXG4gICAgICAgICAgICBkaWFsb2cudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleFRvUmVtb3ZlO1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYuZXhpc3RpbmdTZXRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNldElkID09IHNlbGYuZXhpc3RpbmdTZXRzW2ldLmlkKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhUb1JlbW92ZSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLmV4aXN0aW5nU2V0cy5zcGxpY2UoaW5kZXhUb1JlbW92ZSwgMSk7XHJcbiAgICAgICAgICAgICAgICBpZihzZWxmLmV4aXN0aW5nU2V0cy5sZW5ndGggPT09IDApIHsgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0obG9jYWxTdG9yYWdlS2V5KTsgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdtYXRlcmlhbFNldHMnLCBzZWxmLmV4aXN0aW5nU2V0cyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZU1hdGVyaWFsID0gZnVuY3Rpb24oZSwgbWF0ZXJpYWxJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleFRvUmVtb3ZlO1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgc2VsZi5zZXQucHJvZHVjdF9tYXRlcmlhbHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKG1hdGVyaWFsSWQgPT0gc2VsZi5zZXQucHJvZHVjdF9tYXRlcmlhbHNbaV0ubWF0ZXJpYWxfaWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhUb1JlbW92ZSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYuc2V0LnByb2R1Y3RfbWF0ZXJpYWxzLnNwbGljZShpbmRleFRvUmVtb3ZlLCAxKTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFkZE1hdGVyaWFsID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5zZWxlY3RlZE1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc2V0LnByb2R1Y3RfbWF0ZXJpYWxzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWxfaWQ6IHNlbGYuc2VsZWN0ZWRNYXRlcmlhbC5pZCxcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiBzZWxmLnNlbGVjdGVkUXVhbnRpdHksXHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbDogc2VsZi5zZWxlY3RlZE1hdGVyaWFsXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZE1hdGVyaWFsID0gJyc7XHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRRdWFudGl0eSA9IG51bGw7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdFNldE9iamVjdCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLnNldCA9IHt9O1xyXG4gICAgICAgICAgICBzZWxmLnNldC5pZCA9ICcnO1xyXG4gICAgICAgICAgICBzZWxmLnNldC5uYW1lID0gJyc7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0LnByb2R1Y3RfbWF0ZXJpYWxzID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTWF0ZXJpYWxTZXRDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdFNlcnZpY2UnLCAnR3VpZFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsIE1hdGVyaWFsU2V0Q29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBQYXltZW50VHlwZUNyZWF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgVG9hc3RTZXJ2aWNlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYuY3JlYXRlUGF5bWVudFR5cGUgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaXNWYWxpZCk7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYucGF5bWVudHR5cGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjID0gc2VsZi5wYXltZW50dHlwZTtcclxuXHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3BheW1lbnR0eXBlJykucG9zdChjKS50aGVuKGZ1bmN0aW9uKGQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5wYXltZW50dHlwZXMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBjcmVhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1BheW1lbnRUeXBlQ3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCBQYXltZW50VHlwZUNyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUGF5bWVudFR5cGVEZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0UGF5bWVudFR5cGUoc2VsZiwgJHN0YXRlUGFyYW1zLnBheW1lbnRUeXBlSWQpO1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZVBheW1lbnRUeXBlID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlzVmFsaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wYXltZW50dHlwZS5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5wYXltZW50dHlwZXNcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlUGF5bWVudFR5cGUgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLnBheW1lbnR0eXBlLnJlbW92ZSgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBkZWxldGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLnBheW1lbnR0eXBlc1wiKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIERlbGV0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2hvd0RlbGV0ZUNvbmZpcm0gPSBmdW5jdGlvbihldilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZXYsICdEZWxldGUgcGF5bWVudCB0eXBlPycsICcnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlUGF5bWVudFR5cGUoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUGF5bWVudFR5cGVEZXRhaWxDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJ0RpYWxvZ1NlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgUGF5bWVudFR5cGVEZXRhaWxDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFBheW1lbnRUeXBlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQYXltZW50VHlwZXMoc2VsZik7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQYXltZW50VHlwZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsIFBheW1lbnRUeXBlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBQcm9kdWN0Q3JlYXRlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgVG9hc3RTZXJ2aWNlLCBSZXN0U2VydmljZSwgVmFsaWRhdGlvblNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxNYXRlcmlhbHMoc2VsZik7XHJcblxyXG4gICAgICAgIHNlbGYuZGVjaW1hbFJlZ2V4ID0gVmFsaWRhdGlvblNlcnZpY2UuZGVjaW1hbFJlZ2V4KCk7XHJcbiAgICAgICAgc2VsZi5udW1lcmljUmVnZXggPSBWYWxpZGF0aW9uU2VydmljZS5udW1lcmljUmVnZXgoKTtcclxuXHJcbiAgICAgICAgc2VsZi5wcm9kdWN0ID0ge307XHJcbiAgICAgICAgc2VsZi5wcm9kdWN0Lm1pbmltdW1fc3RvY2sgPSAwO1xyXG4gICAgICAgIHNlbGYucHJvZHVjdC5jdXJyZW50X3N0b2NrID0gMDtcclxuXHJcbiAgICAgICAgc2VsZi5jcmVhdGVQcm9kdWN0ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlzVmFsaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5wcm9kdWN0KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcCA9IHNlbGYucHJvZHVjdDtcclxuXHJcbiAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygkZXJyb3IpO1xyXG5cclxuICAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3Byb2R1Y3QnKS5wb3N0KHApLnRoZW4oZnVuY3Rpb24oZClcclxuICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyRzdGF0ZS5nbygnYXBwLnByb2R1Y3RzLmRldGFpbCcsIHsncHJvZHVjdElkJzogZC5uZXdJZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucHJvZHVjdHMnKTtcclxuICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgY3JlYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5hZGRNYXRlcmlhbCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc2VsZWN0ZWRNYXRlcmlhbCk7XHJcblxyXG4gICAgICAgICAgICBpZihzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMgPT09IHVuZGVmaW5lZCkgeyBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMgPSBbXTsgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWxfaWQ6IHNlbGYuc2VsZWN0ZWRNYXRlcmlhbC5pZCxcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiBzZWxmLnNlbGVjdGVkUXVhbnRpdHksXHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbDogc2VsZi5zZWxlY3RlZE1hdGVyaWFsXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYoc2VsZi5wcm9kdWN0LmNvc3QgPT09IHVuZGVmaW5lZCB8fCBzZWxmLnByb2R1Y3QuY29zdCA9PT0gbnVsbCkgeyBzZWxmLnByb2R1Y3QuY29zdCA9IDA7IH1cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRDb3N0ID0gcGFyc2VGbG9hdChzZWxmLnByb2R1Y3QuY29zdCk7XHJcbiAgICAgICAgICAgIHZhciBidGVzdCA9IChwYXJzZUZsb2F0KHNlbGYuc2VsZWN0ZWRNYXRlcmlhbC51bml0X2Nvc3QpICogcGFyc2VJbnQoc2VsZi5zZWxlY3RlZFF1YW50aXR5KSk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDb3N0ICs9IGJ0ZXN0O1xyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QuY29zdCA9IGN1cnJlbnRDb3N0O1xyXG5cclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZE1hdGVyaWFsID0gXCJcIjtcclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFF1YW50aXR5ID0gMDtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYucHJvZHVjdCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVNYXRlcmlhbCA9IGZ1bmN0aW9uKGUsIG1hdGVyaWFsSWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXhUb1JlbW92ZTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYobWF0ZXJpYWxJZCA9PSBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHNbaV0ubWF0ZXJpYWxfaWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhUb1JlbW92ZSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGluZGV4VG9SZW1vdmUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRDb3N0ID0gcGFyc2VGbG9hdChzZWxmLnByb2R1Y3QuY29zdCk7XHJcbiAgICAgICAgICAgIHZhciBidGVzdCA9IChwYXJzZUZsb2F0KHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFsc1tpbmRleFRvUmVtb3ZlXS5tYXRlcmlhbC51bml0X2Nvc3QpICogcGFyc2VJbnQoc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzW2luZGV4VG9SZW1vdmVdLnF1YW50aXR5KSk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDb3N0IC09IGJ0ZXN0O1xyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QuY29zdCA9IGN1cnJlbnRDb3N0O1xyXG5cclxuICAgICAgICAgICAgc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzLnNwbGljZShpbmRleFRvUmVtb3ZlLCAxKTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUHJvZHVjdENyZWF0ZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdUb2FzdFNlcnZpY2UnLCAnUmVzdFNlcnZpY2UnLCAnVmFsaWRhdGlvblNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgUHJvZHVjdENyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUHJvZHVjdERldGFpbENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMsIFRvYXN0U2VydmljZSwgRGlhbG9nU2VydmljZSwgVmFsaWRhdGlvblNlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsTWF0ZXJpYWxzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldFByb2R1Y3Qoc2VsZiwgJHN0YXRlUGFyYW1zLnByb2R1Y3RJZCk7XHJcblxyXG4gICAgICAgIHNlbGYuZGVjaW1hbFJlZ2V4ID0gVmFsaWRhdGlvblNlcnZpY2UuZGVjaW1hbFJlZ2V4KCk7XHJcbiAgICAgICAgc2VsZi5udW1lcmljUmVnZXggPSBWYWxpZGF0aW9uU2VydmljZS5udW1lcmljUmVnZXgoKTtcclxuXHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlUHJvZHVjdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vUmVzdFNlcnZpY2UudXBkYXRlUHJvZHVjdChzZWxmLCBzZWxmLnByb2R1Y3QuaWQpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wcm9kdWN0LnB1dCgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJ1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IHVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLnByb2R1Y3RzXCIpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVQcm9kdWN0ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5wcm9kdWN0LnJlbW92ZSgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRlZWx0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBkZWxldGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLnByb2R1Y3RzXCIpO1xyXG5cclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGRlbGV0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBkZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zaG93RGVsZXRlQ29uZmlybSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZyA9IERpYWxvZ1NlcnZpY2UuY29uZmlybShldiwgJ0RlbGV0ZSBwcm9kdWN0PycsICdUaGlzIHdpbGwgYWxzbyBkZWxldGUgYW55IHdvcmsgb3JkZXIgb3IgZXZlbnQgc3RvY2sgbGV2ZWxzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHByb2R1Y3QnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZVByb2R1Y3QoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYWRkTWF0ZXJpYWwgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnNlbGVjdGVkTWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICAgICAgaWYoc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzID09PSB1bmRlZmluZWQpIHsgc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzID0gW107IH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIHByb2R1Y3RfaWQ6IHNlbGYucHJvZHVjdC5pZCxcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsX2lkOiBzZWxmLnNlbGVjdGVkTWF0ZXJpYWwuaWQsXHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eTogc2VsZi5zZWxlY3RlZFF1YW50aXR5LFxyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWw6IHNlbGYuc2VsZWN0ZWRNYXRlcmlhbFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50Q29zdCA9IHBhcnNlRmxvYXQoc2VsZi5wcm9kdWN0LmNvc3QpO1xyXG4gICAgICAgICAgICB2YXIgYnRlc3QgPSAocGFyc2VGbG9hdChzZWxmLnNlbGVjdGVkTWF0ZXJpYWwudW5pdF9jb3N0KSAqIHBhcnNlSW50KHNlbGYuc2VsZWN0ZWRRdWFudGl0eSkpO1xyXG4gICAgICAgICAgICBjdXJyZW50Q29zdCArPSBidGVzdDtcclxuICAgICAgICAgICAgc2VsZi5wcm9kdWN0LmNvc3QgPSBjdXJyZW50Q29zdDtcclxuXHJcblxyXG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkTWF0ZXJpYWwgPSBcIlwiO1xyXG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkUXVhbnRpdHkgPSAwO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZU1hdGVyaWFsID0gZnVuY3Rpb24oZSwgbWF0ZXJpYWxJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleFRvUmVtb3ZlO1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihtYXRlcmlhbElkID09IHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFsc1tpXS5tYXRlcmlhbF9pZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleFRvUmVtb3ZlID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coaW5kZXhUb1JlbW92ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY3VycmVudENvc3QgPSBwYXJzZUZsb2F0KHNlbGYucHJvZHVjdC5jb3N0KTtcclxuICAgICAgICAgICAgdmFyIGJ0ZXN0ID0gKHBhcnNlRmxvYXQoc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzW2luZGV4VG9SZW1vdmVdLm1hdGVyaWFsLnVuaXRfY29zdCkgKiBwYXJzZUludChzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHNbaW5kZXhUb1JlbW92ZV0ucXVhbnRpdHkpKTtcclxuICAgICAgICAgICAgY3VycmVudENvc3QgLT0gYnRlc3Q7XHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5jb3N0ID0gY3VycmVudENvc3Q7XHJcblxyXG5cclxuICAgICAgICAgICAgc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzLnNwbGljZShpbmRleFRvUmVtb3ZlLCAxKTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQcm9kdWN0RGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsICdUb2FzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsICdWYWxpZGF0aW9uU2VydmljZScsIFByb2R1Y3REZXRhaWxDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFByb2R1Y3RDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5maWx0ZXJUeXBlID0gXCJcIjtcclxuICAgICAgICBzZWxmLmZpbHRlck9wZXJhdG9yID0gXCJcIjtcclxuICAgICAgICBzZWxmLmZpbHRlclZhbHVlID0gXCJcIjtcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUHJvZHVjdHMoc2VsZik7XHJcblxyXG4gICAgICAgIHNlbGYuYXBwbHlQcm9kdWN0RmlsdGVyID0gZnVuY3Rpb24ocClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHNlbGYuZmlsdGVyVHlwZSAhPT0gXCJcIiAmJiBzZWxmLmZpbHRlck9wZXJhdG9yICE9PSBcIlwiICYmIHNlbGYuZmlsdGVyVmFsdWUgIT09IFwiXCIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaGlcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlUb0ZpbHRlciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2goc2VsZi5maWx0ZXJUeXBlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzdG9ja1wiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVRvRmlsdGVyID0gcGFyc2VJbnQocC5jdXJyZW50X3N0b2NrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInByaWNlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VG9GaWx0ZXIgPSBwYXJzZUZsb2F0KHAucHJpY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiY29zdFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVRvRmlsdGVyID0gcGFyc2VGbG9hdChwLmNvc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZihzZWxmLmZpbHRlck9wZXJhdG9yID09PSBcIj1cIilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHlUb0ZpbHRlciA9PSBwYXJzZUZsb2F0KHNlbGYuZmlsdGVyVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihzZWxmLmZpbHRlck9wZXJhdG9yID09PSBcIj5cIilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHlUb0ZpbHRlciA+IHBhcnNlRmxvYXQoc2VsZi5maWx0ZXJWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHNlbGYuZmlsdGVyT3BlcmF0b3IgPT09IFwiPj1cIilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHlUb0ZpbHRlciA+PSBzZWxmLmZpbHRlclZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihzZWxmLmZpbHRlck9wZXJhdG9yID09PSBcIjxcIilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHlUb0ZpbHRlciA8IHBhcnNlRmxvYXQoc2VsZi5maWx0ZXJWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHNlbGYuZmlsdGVyT3BlcmF0b3IgPT09IFwiPD1cIilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHlUb0ZpbHRlciA8PSBwYXJzZUZsb2F0KHNlbGYuZmlsdGVyVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQcm9kdWN0Q29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgUHJvZHVjdENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUHVyY2hhc2VPcmRlckNyZWF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgJHNjb3BlLCAkbW9tZW50LCBSZXN0YW5ndWxhciwgVXBsb2FkU2VydmljZSwgVG9hc3RTZXJ2aWNlLCBSZXN0U2VydmljZSwgRGlhbG9nU2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsQ3VzdG9tZXJzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFByb2R1Y3RzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFBheW1lbnRUeXBlcyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRGdWxseUJvb2tlZERheXMoc2VsZik7XHJcblxyXG4gICAgICAgIHNlbGYucHVyY2hhc2VvcmRlciA9IHt9O1xyXG4gICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5hbW91bnRfcGFpZCA9IDA7XHJcbiAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLmRpc2NvdW50ID0gMDtcclxuICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSAwO1xyXG5cclxuICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIuZGVsaXZlcnkgPSAwO1xyXG4gICAgICAgIHNlbGYuZGVsaXZlcnlfY2hhcmdlID0gMDtcclxuXHJcbiAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnNoaXBwaW5nID0gMDtcclxuICAgICAgICBzZWxmLnNoaXBwaW5nX2NoYXJnZSA9IDA7XHJcblxyXG5cclxuICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIuc3VwcHJlc3N3b3Jrb3JkZXIgPSAwO1xyXG5cclxuICAgICAgICBzZWxmLnBvSW1hZ2UgPSBudWxsO1xyXG5cclxuICAgICAgICB2YXIgb3JpZ2luYWxUb3RhbCA9IDA7XHJcbiAgICAgICAgdmFyIG9yaWdpbmFsU2hpcHBpbmdDaGFyZ2UgPSAwO1xyXG5cclxuICAgICAgICBzZWxmLm9ubHlPcGVuRGF5cyA9IGZ1bmN0aW9uKGRhdGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmKCEkbW9tZW50KGRhdGUpLmlzQmVmb3JlKCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0ZSk7XHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgc2VsZi5ib29rZWREYXlzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi5ib29rZWREYXlzW2ldLnN0YXJ0X2RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi5ib29rZWREYXlzW2ldLnN0YXJ0X2RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJG1vbWVudChzZWxmLmJvb2tlZERheXNbaV0uc3RhcnRfZGF0ZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG1vbWVudChkYXRlKS5pc1NhbWUoc2VsZi5ib29rZWREYXlzW2ldLnN0YXJ0X2RhdGUpKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZVB1cmNoYXNlT3JkZXIgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnB1cmNoYXNlb3JkZXIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHAgPSBzZWxmLnB1cmNoYXNlb3JkZXI7XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCRlcnJvcik7XHJcblxyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3B1cmNoYXNlb3JkZXInKS5wb3N0KHApLnRoZW4oZnVuY3Rpb24oZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYucG9JbWFnZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBVcGxvYWRTZXJ2aWNlLnVwbG9hZEZpbGUoMSwgJ1BPJywgc2VsZi5wb0ltYWdlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGQpO1xyXG4gICAgICAgICAgICAgICAgLy8kc3RhdGUuZ28oJ2FwcC5wcm9kdWN0cy5kZXRhaWwnLCB7J3Byb2R1Y3RJZCc6IGQubmV3SWR9KTtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5wdXJjaGFzZW9yZGVycycpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgY3JlYXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYXBwbHlEaXNjb3VudCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci5kaXNjb3VudCA9PSBudWxsIHx8IHNlbGYucHVyY2hhc2VvcmRlci5kaXNjb3VudCA9PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBvcmlnaW5hbFRvdGFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAmJiBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgIT09IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAmJiBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPiAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkaXNjb3VudGVkID0gb3JpZ2luYWxUb3RhbCAtIHNlbGYucHVyY2hhc2VvcmRlci5kaXNjb3VudDtcclxuICAgICAgICAgICAgICAgICAgICBkaXNjb3VudGVkID49IDAgPyBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBkaXNjb3VudGVkIDogMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYXBwbHlEZWxpdmVyeSA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHNlbGYuZGVsaXZlcnlfY2hhcmdlID09PSAxKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIuZGVsaXZlcnkgPSBkZWxpdmVyeUZlZTtcclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCArPSBkZWxpdmVyeUZlZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5kZWxpdmVyeSA9IDA7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgLT0gZGVsaXZlcnlGZWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFwcGx5U2hpcHBpbmcgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgY29zdE9mU2hpcHBpbmcgPSAwO1xyXG4gICAgICAgICAgICBpZihzZWxmLnNoaXBwaW5nX2NoYXJnZSA9PT0gJ0NETicpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvc3RPZlNoaXBwaW5nID0gc2hpcHBpbmdDYW5hZGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZihzZWxmLnNoaXBwaW5nX2NoYXJnZSA9PT0gJ1VTQScpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvc3RPZlNoaXBwaW5nID0gc2hpcHBpbmdVc2E7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5zaGlwcGluZyA9IGNvc3RPZlNoaXBwaW5nO1xyXG5cclxuICAgICAgICAgICAgaWYoc2VsZi5zaGlwcGluZ19jaGFyZ2UgIT09IG9yaWdpbmFsU2hpcHBpbmdDaGFyZ2UpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCAtPSBvcmlnaW5hbFNoaXBwaW5nQ2hhcmdlO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsICs9IGNvc3RPZlNoaXBwaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBvcmlnaW5hbFNoaXBwaW5nQ2hhcmdlID0gY29zdE9mU2hpcHBpbmc7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICBzZWxmLmFkZFByb2R1Y3QgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnNlbGVjdGVkUHJvZHVjdCk7XHJcblxyXG4gICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMgPT09IHVuZGVmaW5lZCkgeyBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMgPSBbXTsgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgcHJvZHVjdF9pZDogc2VsZi5zZWxlY3RlZFByb2R1Y3QuaWQsXHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eTogc2VsZi5zZWxlY3RlZFF1YW50aXR5LFxyXG4gICAgICAgICAgICAgICAgcHJvZHVjdDogc2VsZi5zZWxlY3RlZFByb2R1Y3RcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPT09IHVuZGVmaW5lZCB8fCBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPT09IG51bGwpIHsgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID0gMDsgfVxyXG4gICAgICAgICAgICB2YXIgY3VycmVudENvc3QgPSBwYXJzZUZsb2F0KHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCk7XHJcbiAgICAgICAgICAgIHZhciBidGVzdCA9IChwYXJzZUZsb2F0KHNlbGYuc2VsZWN0ZWRQcm9kdWN0LnByaWNlKSAqIHBhcnNlSW50KHNlbGYuc2VsZWN0ZWRRdWFudGl0eSkpO1xyXG4gICAgICAgICAgICBjdXJyZW50Q29zdCArPSBidGVzdDtcclxuICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID0gY3VycmVudENvc3Q7XHJcbiAgICAgICAgICAgIG9yaWdpbmFsVG90YWwgPSBjdXJyZW50Q29zdDtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRQcm9kdWN0ID0gXCJcIjtcclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFF1YW50aXR5ID0gMDtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYucHVyY2hhc2VvcmRlcik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVQcm9kdWN0ID0gZnVuY3Rpb24oZSwgcHJvZHVjdElkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4VG9SZW1vdmU7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHByb2R1Y3RJZCA9PSBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaV0ucHJvZHVjdF9pZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleFRvUmVtb3ZlID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coaW5kZXhUb1JlbW92ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY3VycmVudENvc3QgPSBwYXJzZUZsb2F0KHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCk7XHJcbiAgICAgICAgICAgIHZhciBidGVzdCA9IChwYXJzZUZsb2F0KHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0c1tpbmRleFRvUmVtb3ZlXS5wcm9kdWN0LnByaWNlKSAqIHBhcnNlSW50KHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0c1tpbmRleFRvUmVtb3ZlXS5xdWFudGl0eSkpO1xyXG4gICAgICAgICAgICBjdXJyZW50Q29zdCAtPSBidGVzdDtcclxuICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID0gY3VycmVudENvc3Q7XHJcbiAgICAgICAgICAgIG9yaWdpbmFsVG90YWwgPSBjdXJyZW50Q29zdDtcclxuXHJcbiAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cy5zcGxpY2UoaW5kZXhUb1JlbW92ZSwgMSk7XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZXRlcm1pbmVXb3JrT3JkZXJzID0gZnVuY3Rpb24oZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cyAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIuc3VwcHJlc3N3b3Jrb3JkZXIgPT0gMSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBKdXN0IHByb2Nlc3MgdGhlIFBPIGFzIG5vcm1hbFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY3JlYXRlUHVyY2hhc2VPcmRlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvZHVjdHNUb0Z1bGZpbGwgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0c1RvRnVsZmlsbC5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2R1Y3RfaWQ6IHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0c1tpXS5wcm9kdWN0X2lkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHk6IHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0c1tpXS5xdWFudGl0eVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnc2NoZWR1bGVyL2dldFdvcmtPcmRlcnMnKS5wb3N0KHtwcm9kdWN0c1RvRnVsZmlsbDogcHJvZHVjdHNUb0Z1bGZpbGx9KS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEud29ya09yZGVyc1RvQ3JlYXRlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEud29ya09yZGVyc1RvQ3JlYXRlID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlcmUgYXJlIHdvcmtvcmRlcnMgbmVlZGVkIGZvciB0aGlzIFBPLCBjb25maXJtIHRoZWlyIGNyZWF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUud29ya09yZGVyc1RvQ3JlYXRlID0gZGF0YS53b3JrT3JkZXJzVG9DcmVhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUud29ya09yZGVycyA9IGRhdGEud29ya09yZGVycztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZShlLCAnZGxnQ29uZmlybVdvcmtPcmRlcnMnLCAkc2NvcGUpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIud29ya19vcmRlcnMgPSAkc2NvcGUud29ya09yZGVycztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnY29uZmlybWVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY3JlYXRlUHVyY2hhc2VPcmRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdjYW5jZWxsZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSnVzdCBwcm9jZXNzIHRoZSBQTyBhcyBub3JtYWxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY3JlYXRlUHVyY2hhc2VPcmRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUHVyY2hhc2VPcmRlckNyZWF0ZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICckc2NvcGUnLCAnJG1vbWVudCcsICdSZXN0YW5ndWxhcicsICdVcGxvYWRTZXJ2aWNlJywgJ1RvYXN0U2VydmljZScsICdSZXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIFB1cmNoYXNlT3JkZXJDcmVhdGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFB1cmNoYXNlT3JkZXJEZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsICRzY29wZSwgJG1vbWVudCwgUmVzdGFuZ3VsYXIsIFVwbG9hZFNlcnZpY2UsIFJlc3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMsIFRvYXN0U2VydmljZSwgRGlhbG9nU2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJHN0YXRlUGFyYW1zKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxDdXN0b21lcnMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUHJvZHVjdHMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUGF5bWVudFR5cGVzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldFB1cmNoYXNlT3JkZXIoc2VsZiwgJHN0YXRlUGFyYW1zLnB1cmNoYXNlT3JkZXJJZCk7XHJcblxyXG4gICAgICAgIHZhciBvcmlnaW5hbFRvdGFsID0gMDtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVQdXJjaGFzZU9yZGVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnB1dCgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYucG9JbWFnZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaGVyZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIFVwbG9hZFNlcnZpY2UudXBsb2FkRmlsZSgxLCAnUE8nLCBzZWxmLnBvSW1hZ2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJ1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgdXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgIC8vJHN0YXRlLmdvKFwiYXBwLnB1cmNoYXNlb3JkZXJzXCIpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVB1cmNoYXNlT3JkZXIgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIucmVtb3ZlKCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGVlbHRlZFwiKTtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGRlbGV0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAucHVyY2hhc2VvcmRlcnNcIik7XHJcblxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgZGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGRlbGV0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNob3dEZWxldGVDb25maXJtID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGV2LCAnRGVsZXRlIHB1cmNoYXNlIG9yZGVyPycsICcnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZVB1cmNoYXNlT3JkZXIoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYXBwbHlEaXNjb3VudCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci5kaXNjb3VudCA9PSBudWxsIHx8IHNlbGYucHVyY2hhc2VvcmRlci5kaXNjb3VudCA9PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBvcmlnaW5hbFRvdGFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAmJiBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgIT09IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAmJiBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPiAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkaXNjb3VudGVkID0gb3JpZ2luYWxUb3RhbCAtIHNlbGYucHVyY2hhc2VvcmRlci5kaXNjb3VudDtcclxuICAgICAgICAgICAgICAgICAgICBkaXNjb3VudGVkID49IDAgPyBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBkaXNjb3VudGVkIDogMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYWRkUHJvZHVjdCA9IGZ1bmN0aW9uKGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnNlbGVjdGVkUHJvZHVjdCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcG9wT2JqID0ge1xyXG4gICAgICAgICAgICAgICAgcHJvZHVjdF9pZDogc2VsZi5zZWxlY3RlZFByb2R1Y3QuaWQsXHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eTogc2VsZi5zZWxlY3RlZFF1YW50aXR5LFxyXG4gICAgICAgICAgICAgICAgcHJvZHVjdDogc2VsZi5zZWxlY3RlZFByb2R1Y3RcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnc2NoZWR1bGVyL2dldFdvcmtPcmRlcnMnKS5wb3N0KHtwcm9kdWN0c1RvRnVsZmlsbDogW3BvcE9ial0sIHB1cmNoYXNlT3JkZXJJZDogc2VsZi5wdXJjaGFzZW9yZGVyLmlkfSkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLndvcmtPcmRlcnNUb0NyZWF0ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzID09PSB1bmRlZmluZWQpIHsgc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzID0gW107IH1cclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cy5wdXNoKHBvcE9iaik7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUmVjYWxjdWxhdGUgUE8gdG90YWxcclxuICAgICAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9PT0gdW5kZWZpbmVkIHx8IHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9PT0gbnVsbCkgeyBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSAwOyB9XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudENvc3QgPSBwYXJzZUZsb2F0KHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgYnRlc3QgPSAocGFyc2VGbG9hdChzZWxmLnNlbGVjdGVkUHJvZHVjdC5wcmljZSkgKiBwYXJzZUludChzZWxmLnNlbGVjdGVkUXVhbnRpdHkpKTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRDb3N0ICs9IGJ0ZXN0O1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID0gY3VycmVudENvc3Q7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFRvdGFsID0gY3VycmVudENvc3Q7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFByb2R1Y3QgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFF1YW50aXR5ID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihkYXRhLndvcmtPcmRlcnNUb0NyZWF0ZSA+IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlcmUgYXJlIHdvcmtvcmRlcnMgbmVlZGVkIGZvciB0aGlzIFBPLCBhbGVydCBvZiB0aGVpciBjcmVhdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS53b3JrT3JkZXJzVG9DcmVhdGUgPSBkYXRhLndvcmtPcmRlcnNUb0NyZWF0ZTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUud29ya09yZGVycyA9IGRhdGEud29ya09yZGVycztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgRGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoZSwgJ2RsZ0FsZXJ0V29ya09yZGVycycsICRzY29wZSkudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY29uZmlybWVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgYWRkaW5nIHByb2R1Y3QsIHBsZWFzZSB0cnkgYWdhaW5cIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlUHJvZHVjdCA9IGZ1bmN0aW9uKGUsIHByb2R1Y3RJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleFRvUmVtb3ZlO1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihwcm9kdWN0SWQgPT0gc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzW2ldLnByb2R1Y3RfaWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhUb1JlbW92ZSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaW5kZXhUb1JlbW92ZSk7XHJcblxyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3NjaGVkdWxlci9yZXN0b3JlU3RvY2tGb3JQcm9kdWN0JykucG9zdCh7cHVyY2hhc2Vfb3JkZXJfaWQ6IHNlbGYucHVyY2hhc2VvcmRlci5pZCwgcHJvZHVjdF9pZDogc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzW2luZGV4VG9SZW1vdmVdLnByb2R1Y3RfaWR9KS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIFJlY2FsY3VsYXRlIFBPIHRvdGFsXHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudENvc3QgPSBwYXJzZUZsb2F0KHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgYnRlc3QgPSAocGFyc2VGbG9hdChzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaW5kZXhUb1JlbW92ZV0ucHJvZHVjdC5wcmljZSkgKiBwYXJzZUludChzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaW5kZXhUb1JlbW92ZV0ucXVhbnRpdHkpKTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRDb3N0IC09IGJ0ZXN0O1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID0gY3VycmVudENvc3Q7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFRvdGFsID0gY3VycmVudENvc3Q7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzLnNwbGljZShpbmRleFRvUmVtb3ZlLCAxKTtcclxuXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZyBzdG9jaywgcGxlYXNlIHRyeSBhZ2FpblwiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUHVyY2hhc2VPcmRlckRldGFpbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICckc2NvcGUnLCAnJG1vbWVudCcsICdSZXN0YW5ndWxhcicsICdVcGxvYWRTZXJ2aWNlJywgJ1Jlc3RTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsICdUb2FzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsIFB1cmNoYXNlT3JkZXJEZXRhaWxDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFB1cmNoYXNlT3JkZXJDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFB1cmNoYXNlT3JkZXJzKHNlbGYpO1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQdXJjaGFzZU9yZGVyQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgUHVyY2hhc2VPcmRlckNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUmVwb3J0Q29udHJvbGxlcigkc2NvcGUsICRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgQ2hhcnRTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5yZXBvcnRQYXJhbXMgPSB7fTtcclxuXHJcbiAgICAgICAgaWYoJHN0YXRlLmlzKCdhcHAucmVwb3J0cy5jdXJyZW50c3RvY2snKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdlbmVyYXRlQ3VycmVudFN0b2NrUmVwb3J0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoJHN0YXRlLmlzKCdhcHAucmVwb3J0cy5zYWxlcycpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2hvd1NhbGVzUmVwb3J0VmlldygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKCRzdGF0ZS5pcygnYXBwLnJlcG9ydHMuc2FsZXNieW1vbnRoJykpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzaG93U2FsZXNSZXBvcnRCeU1vbnRoVmlldygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKCRzdGF0ZS5pcygnYXBwLnJlcG9ydHMuaW5jb21lYnltb250aCcpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2hvd0luY29tZVJlcG9ydEJ5TW9udGhWaWV3KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoJHN0YXRlLmlzKCdhcHAucmVwb3J0cy5wcm9kdWN0cHJvZml0cGVyY2VudHMnKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNob3dQcm9kdWN0UHJvZml0UGVyY2VudHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZigkc3RhdGUuaXMoJ2FwcC5yZXBvcnRzLndlZWt3b3Jrb3JkZXJzJykpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzaG93V2Vla2x5V29ya09yZGVycygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBSZXBvcnQgaG9tZVxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZS5pcygnYXBwLnJlcG9ydHMnKSk7XHJcbiAgICAgICAgICAgIHNob3dEYXNoYm9hcmRXaWRnZXRzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2hvd1Byb2R1Y3RQcm9maXRQZXJjZW50cygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDaGFydFNlcnZpY2UuZ2V0UHJvZHVjdFByb2ZpdFBlcmNlbnRzKHNlbGYpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2hvd1dlZWtseVdvcmtPcmRlcnMoKVxyXG4gICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncmVwb3J0cy9nZXRXZWVrV29ya09yZGVyUmVwb3J0JykuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYud2Vla3dvcmtvcmRlcnMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZUN1cnJlbnRTdG9ja1JlcG9ydCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdlbmVyYXRlIHN0b2NrIHJlcnBvcnRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93U2FsZXNSZXBvcnRWaWV3KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbEN1c3RvbWVycyhzZWxmKTtcclxuICAgICAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUHJvZHVjdHMoc2VsZik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93RGFzaGJvYXJkV2lkZ2V0cygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDaGFydFNlcnZpY2UuZ2V0VG9wU2VsbGluZ1Byb2R1Y3RzKHNlbGYsICdUb3AgU2VsbGluZyBBbGwgVGltZScpO1xyXG4gICAgICAgICAgICBnZXRXb3JzdFNlbGxpbmdQcm9kdWN0cyhzZWxmKTtcclxuICAgICAgICAgICAgZ2V0T3ZlcmR1ZVB1cmNoYXNlT3JkZXJzKHNlbGYpO1xyXG4gICAgICAgICAgICBnZXRNb250aGx5SW5jb21lKHNlbGYpO1xyXG4gICAgICAgICAgICBnZXRPdXRzdGFuZGluZ1BheW1lbnRzKHNlbGYpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2hvd1NhbGVzUmVwb3J0QnlNb250aFZpZXcoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ2hhcnRTZXJ2aWNlLmdldE1vbnRobHlTYWxlc1JlcG9ydChzZWxmKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNob3dJbmNvbWVSZXBvcnRCeU1vbnRoVmlldygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDaGFydFNlcnZpY2UuZ2V0TW9udGhseUluY29tZVJlcG9ydChzZWxmKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbGYuZ2V0U2FsZXNSZXBvcnQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnJlcG9ydFBhcmFtcyk7XHJcbiAgICAgICAgICAgIHNlbGYucG9Ub3RhbCA9IDA7XHJcbiAgICAgICAgICAgIHNlbGYucG9Db3VudCA9IDA7XHJcblxyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3JlcG9ydHMvZ2V0U2FsZXNSZXBvcnQnKS5wb3N0KHsgJ3JlcG9ydFBhcmFtcyc6IHNlbGYucmVwb3J0UGFyYW1zfSkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnJlc3VsdHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wb0NvdW50ID0gZGF0YS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLnJlc3VsdHNbMF0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIEVycm9yXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFdvcnN0U2VsbGluZ1Byb2R1Y3RzKHNjb3BlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdyZXBvcnRzL2dldFdvcnN0U2VsbGluZ1Byb2R1Y3RzJykuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLndvcnN0U2VsbGluZ1Byb2R1Y3RzID0gZGF0YTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldE92ZXJkdWVQdXJjaGFzZU9yZGVycyhzY29wZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncmVwb3J0cy9nZXRPdmVyZHVlUHVyY2hhc2VPcmRlcnMnKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYub3ZlcmR1ZVB1cmNoYXNlT3JkZXJzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIC8vc2VsZi5wb0NvdW50ID0gZGF0YS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gRXJyb3JcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRNb250aGx5SW5jb21lKHNjb3BlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdyZXBvcnRzL2dldE1vbnRobHlTYWxlc1JlcG9ydCcpLnBvc3QoeyAncmVwb3J0UGFyYW1zJzoge319KS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUubW9udGhseUluY29tZXMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNjb3BlLm1vbnRobHlJbmNvbWVzLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbCA9IHNjb3BlLm1vbnRobHlJbmNvbWVzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZShzY29wZS5tb250aGx5SW5jb21lc1tsLTFdLnllYXIsIHNjb3BlLm1vbnRobHlJbmNvbWVzW2wtMV0ubW9udGggLSAxLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY3VyTW9udGhseUluY29tZU1vbnRoID0gZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY3VyTW9udGhseUluY29tZVRvdGFsID0gc2NvcGUubW9udGhseUluY29tZXNbbC0xXS5tb250aHRvdGFsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXJNb250aGx5SW5jb21lUG9zID0gbCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRPdXRzdGFuZGluZ1BheW1lbnRzKHNjb3BlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdyZXBvcnRzL2dldE91dHN0YW5kaW5nUGF5bWVudHMnKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5vdXRzdGFuZGluZ1BheW1lbnRzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBpZihzY29wZS5vdXRzdGFuZGluZ1BheW1lbnRzLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKHNjb3BlLm91dHN0YW5kaW5nUGF5bWVudHNbMF0ueWVhciwgc2NvcGUub3V0c3RhbmRpbmdQYXltZW50c1swXS5tb250aCAtIDEsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXJNb250aGx5T3V0c3RhbmRpbmdNb250aCA9IGQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmN1ck1vbnRobHlPdXN0YW5kaW5nVG90YWwgPSBzY29wZS5vdXRzdGFuZGluZ1BheW1lbnRzWzBdLm91dHN0YW5kaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXJNb250aGx5T3V0c3RhbmRpbmdQb3MgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRXJyb3JcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VsZi5jaGFuZ2VNb250aGx5T3V0c3RhbmRpbmcgPSBmdW5jdGlvbihpbmNyZW1lbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmN1ck1vbnRobHlPdXRzdGFuZGluZ1BvcyArPSBpbmNyZW1lbnQ7XHJcblxyXG4gICAgICAgICAgICBpZigoc2VsZi5jdXJNb250aGx5T3V0c3RhbmRpbmdQb3MgPCAwKSkgeyBzZWxmLmN1ck1vbnRobHlPdXRzdGFuZGluZ1BvcyA9IDA7IH1cclxuICAgICAgICAgICAgZWxzZSBpZigoc2VsZi5jdXJNb250aGx5T3V0c3RhbmRpbmdQb3MgKyAxKSA+IHNlbGYub3V0c3RhbmRpbmdQYXltZW50cy5sZW5ndGgpIHsgc2VsZi5jdXJNb250aGx5T3V0c3RhbmRpbmdQb3MgPSBzZWxmLm91dHN0YW5kaW5nUGF5bWVudHMubGVuZ3RoIC0gMTsgfVxyXG5cclxuICAgICAgICAgICAgaWYoc2VsZi5jdXJNb250aGx5T3V0c3RhbmRpbmdQb3MgPj0gMCAmJiAoc2VsZi5jdXJNb250aGx5T3V0c3RhbmRpbmdQb3MgKyAxKSA8PSBzZWxmLm91dHN0YW5kaW5nUGF5bWVudHMubGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKHNlbGYub3V0c3RhbmRpbmdQYXltZW50c1tzZWxmLmN1ck1vbnRobHlPdXRzdGFuZGluZ1Bvc10ueWVhciwgc2VsZi5vdXRzdGFuZGluZ1BheW1lbnRzW3NlbGYuY3VyTW9udGhseU91dHN0YW5kaW5nUG9zXS5tb250aCAtIDEsIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYuY3VyTW9udGhseU91dHN0YW5kaW5nTW9udGggPSBkO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jdXJNb250aGx5T3VzdGFuZGluZ1RvdGFsID0gc2VsZi5vdXRzdGFuZGluZ1BheW1lbnRzW3NlbGYuY3VyTW9udGhseU91dHN0YW5kaW5nUG9zXS5vdXRzdGFuZGluZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuY2hhbmdlTW9udGhseUluY29tZSA9IGZ1bmN0aW9uKGluY3JlbWVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ0xlbjonICsgc2VsZi5tb250aGx5SW5jb21lcy5sZW5ndGgpO1xyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLmN1ck1vbnRobHlJbmNvbWVQb3MpO1xyXG4gICAgICAgICAgICBzZWxmLmN1ck1vbnRobHlJbmNvbWVQb3MgKz0gaW5jcmVtZW50O1xyXG5cclxuICAgICAgICAgICAgaWYoKHNlbGYuY3VyTW9udGhseUluY29tZVBvcyA8IDApKSB7IHNlbGYuY3VyTW9udGhseUluY29tZVBvcyA9IDA7IH1cclxuICAgICAgICAgICAgZWxzZSBpZigoc2VsZi5jdXJNb250aGx5SW5jb21lUG9zICsgMSkgPiBzZWxmLm1vbnRobHlJbmNvbWVzLmxlbmd0aCkgeyBzZWxmLmN1ck1vbnRobHlJbmNvbWVQb3MgPSBzZWxmLm1vbnRobHlJbmNvbWVzLmxlbmd0aCAtIDE7IH1cclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi5jdXJNb250aGx5SW5jb21lUG9zKTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYuY3VyTW9udGhseUluY29tZVBvcyA+PSAwICYmIChzZWxmLmN1ck1vbnRobHlJbmNvbWVQb3MgKyAxKSA8PSBzZWxmLm1vbnRobHlJbmNvbWVzLmxlbmd0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZShzZWxmLm1vbnRobHlJbmNvbWVzW3NlbGYuY3VyTW9udGhseUluY29tZVBvc10ueWVhciwgc2VsZi5tb250aGx5SW5jb21lc1tzZWxmLmN1ck1vbnRobHlJbmNvbWVQb3NdLm1vbnRoIC0gMSwgMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi5jdXJNb250aGx5SW5jb21lTW9udGggPSBkO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jdXJNb250aGx5SW5jb21lVG90YWwgPSBzZWxmLm1vbnRobHlJbmNvbWVzW3NlbGYuY3VyTW9udGhseUluY29tZVBvc10ubW9udGh0b3RhbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNldFBvVG90YWwgPSBmdW5jdGlvbihpdGVtKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coaXRlbSk7XHJcbiAgICAgICAgICAgIGlmKGl0ZW0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucG9Ub3RhbCArPSBwYXJzZUZsb2F0KGl0ZW0udG90YWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdSZXBvcnRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJ0NoYXJ0U2VydmljZScsIFJlcG9ydENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gU2VhcmNoQ29udHJvbGxlcigkc2NvcGUsICRhdXRoLCBSZXN0YW5ndWxhciwgJHN0YXRlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5ub0NhY2hlID0gdHJ1ZTtcclxuICAgICAgICBzZWxmLnNlYXJjaFRleHQgPSBcIlwiO1xyXG4gICAgICAgIHNlbGYuc2VsZWN0ZWRSZXN1bHQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIHNlbGYuZG9TZWFyY2ggPSBmdW5jdGlvbihxdWVyeSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vUmVzdFNlcnZpY2UuZG9TZWFyY2goc2VsZiwgc2VsZi5zZWFyY2hUZXh0KTtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLm9uZSgnc2VhcmNoJywgcXVlcnkpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmZpcmVUb2dnbGVTZWFyY2hFdmVudCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIC8vc2VsZi4kcm9vdC4kYnJvYWRjYXN0KFwidG9nZ2xlU2VhcmNoXCIsIHt1c2VybmFtZTogJHNjb3BlLnVzZXIudXNlcm5hbWUgfSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kcm9vdC4kYnJvYWRjYXN0KFwidG9nZ2xlU2VhcmNoXCIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZ290b0l0ZW0gPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnNlbGVjdGVkUmVzdWx0KTtcclxuICAgICAgICAgICAgaWYoc2VsZi5zZWxlY3RlZFJlc3VsdCAhPT0gbnVsbCAmJiBzZWxmLnNlbGVjdGVkUmVzdWx0ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoVGV4dCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmZpcmVUb2dnbGVTZWFyY2hFdmVudCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHN3aXRjaChzZWxmLnNlbGVjdGVkUmVzdWx0LmNvbnRlbnRfdHlwZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicHJvZHVjdFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5wcm9kdWN0cy5kZXRhaWwnLCB7J3Byb2R1Y3RJZCc6IHNlbGYuc2VsZWN0ZWRSZXN1bHQuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJjdXN0b21lclwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5jdXN0b21lcnMuZGV0YWlsJywgeydjdXN0b21lcklkJzogc2VsZi5zZWxlY3RlZFJlc3VsdC5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImV2ZW50XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmV2ZW50cy5kZXRhaWwnLCB7J2V2ZW50SWQnOiBzZWxmLnNlbGVjdGVkUmVzdWx0LmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwid29ya29yZGVyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLndvcmtvcmRlcnMuZGV0YWlsJywgeyd3b3JrT3JkZXJJZCc6IHNlbGYuc2VsZWN0ZWRSZXN1bHQuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJtYXRlcmlhbFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5tYXRlcmlhbHMuZGV0YWlsJywgeydtYXRlcmlhbElkJzogc2VsZi5zZWxlY3RlZFJlc3VsdC5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInB1cmNoYXNlb3JkZXJcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucHVyY2hhc2VvcmRlcnMuZGV0YWlsJywgeydwdXJjaGFzZU9yZGVySWQnOiBzZWxmLnNlbGVjdGVkUmVzdWx0LmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2VhcmNoQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRhdXRoJywgJ1Jlc3Rhbmd1bGFyJywgJyRzdGF0ZScsIFNlYXJjaENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gVW5pdENyZWF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgVG9hc3RTZXJ2aWNlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYuY3JlYXRlVW5pdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi51bml0KTtcclxuICAgICAgICAgICAgICAgIHZhciBjID0gc2VsZi51bml0O1xyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgndW5pdCcpLnBvc3QoYykudGhlbihmdW5jdGlvbihkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vJHN0YXRlLmdvKCdhcHAuY3VzdG9tZXJzLmRldGFpbCcsIHsnY3VzdG9tZXJJZCc6IGQubmV3SWR9KTtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBjcmVhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLnVuaXRzJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgY3JlYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdVbml0Q3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCBVbml0Q3JlYXRlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBVbml0RGV0YWlsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBUb2FzdFNlcnZpY2UsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgRGlhbG9nU2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldFVuaXQoc2VsZiwgJHN0YXRlUGFyYW1zLnVuaXRJZCk7XHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlVW5pdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYudW5pdC5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC51bml0c1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVVuaXQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLnVuaXQucmVtb3ZlKCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGRlbGV0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAudW5pdHNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBEZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNob3dEZWxldGVDb25maXJtID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGV2LCAnRGVsZXRlIHVuaXQ/JywgJycpO1xyXG4gICAgICAgICAgICBkaWFsb2cudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5kZWxldGVVbml0KCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1VuaXREZXRhaWxDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJ0RpYWxvZ1NlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgVW5pdERldGFpbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gVW5pdENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsVW5pdHMoc2VsZik7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdVbml0Q29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgVW5pdENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gV29ya09yZGVyQ3JlYXRlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgVG9hc3RTZXJ2aWNlLCAkbW9tZW50LCBSZXN0U2VydmljZSwgVmFsaWRhdGlvblNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbEN1c3RvbWVycyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi5udW1lcmljUmVnZXggPSBWYWxpZGF0aW9uU2VydmljZS5udW1lcmljUmVnZXgoKTtcclxuXHJcbiAgICAgICAgc2VsZi5jcmVhdGVXb3JrT3JkZXIgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaXNWYWxpZCk7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYud29ya29yZGVyKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdyA9IHNlbGYud29ya29yZGVyO1xyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnd29ya29yZGVyJykucG9zdCh3KS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBjcmVhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vJHN0YXRlLmdvKCdhcHAud29ya29yZGVycy5kZXRhaWwnLCB7J3dvcmtPcmRlcklkJzogMX0pO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLndvcmtvcmRlcnMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1dvcmtPcmRlckNyZWF0ZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdUb2FzdFNlcnZpY2UnLCAnJG1vbWVudCcsICdSZXN0U2VydmljZScsICdWYWxpZGF0aW9uU2VydmljZScsICckc3RhdGVQYXJhbXMnLCBXb3JrT3JkZXJDcmVhdGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFdvcmtPcmRlckRldGFpbENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgVG9hc3RTZXJ2aWNlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UsIFZhbGlkYXRpb25TZXJ2aWNlLCAkbW9tZW50LCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0V29ya09yZGVyKHNlbGYsICRzdGF0ZVBhcmFtcy53b3JrT3JkZXJJZCk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsQ3VzdG9tZXJzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFByb2R1Y3RzKHNlbGYpO1xyXG5cclxuICAgICAgICBzZWxmLm51bWVyaWNSZWdleCA9IFZhbGlkYXRpb25TZXJ2aWNlLm51bWVyaWNSZWdleCgpO1xyXG5cclxuICAgICAgICBzZWxmLnRvZ2dsZUNvbXBsZXRlID0gZnVuY3Rpb24oY2JTdGF0ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNiU3RhdGUpO1xyXG4gICAgICAgICAgICAvL2lmKGNiU3RhdGUpIHsgc2VsZi53b3Jrb3JkZXIuY29tcGxldGVkID0gMTsgfVxyXG4gICAgICAgICAgICAvL2Vsc2UgeyBzZWxmLndvcmtvcmRlci5jb21wbGV0ZWQgPSAwOyB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVXb3JrT3JkZXIgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaXNWYWxpZCk7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLndvcmtvcmRlci5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC53b3Jrb3JkZXJzXCIpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlV29ya09yZGVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi53b3Jrb3JkZXIucmVtb3ZlKCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGRlbGV0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAud29ya29yZGVyc1wiKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGRlbGV0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNob3dEZWxldGVDb25maXJtID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGV2LCAnRGVsZXRlIHdvcmsgb3JkZXI/JywgJycpO1xyXG4gICAgICAgICAgICBkaWFsb2cudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5kZWxldGVXb3JrT3JkZXIoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignV29ya09yZGVyRGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgJ1ZhbGlkYXRpb25TZXJ2aWNlJywgJyRtb21lbnQnLCAnJHN0YXRlUGFyYW1zJywgV29ya09yZGVyRGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBXb3JrT3JkZXJDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgJG1vbWVudClcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYuc2hvd0NvbXBsZXRlID0gZmFsc2U7XHJcbiAgICAgICAgdmFyIHRvZGF5c0RhdGUgPSAkbW9tZW50KCk7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFdvcmtPcmRlcnMoc2VsZik7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHNlbGYpO1xyXG5cclxuICAgICAgICBzZWxmLnNldFVyZ2VuY3kgPSBmdW5jdGlvbihvYmpEYXRlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy8gMyBkYXlzLCA3IGRheXMsIDMwIGRheXMsIHRoZSByZXN0XHJcbiAgICAgICAgICAgIHZhciBkID0gJG1vbWVudChvYmpEYXRlKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkKTtcclxuICAgICAgICAgICAgdmFyIGRheURpZmYgPSBkLmRpZmYodG9kYXlzRGF0ZSwgJ2RheXMnKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGRheURpZmYgPiAzMCkgLy8gZ3JlZW5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiZmFyV29ya09yZGVyXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZihkYXlEaWZmID4gNyAmJiBkYXlEaWZmIDw9IDMwKSAvLyBibHVlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImNsb3NlV29ya09yZGVyXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZihkYXlEaWZmID4gMyAmJiBkYXlEaWZmIDw9IDcpIC8vIG9yYW5nZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJjbG9zZXJXb3JrT3JkZXJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIC8vIHJlZFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJjbG9zZXN0V29ya09yZGVyXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZC5kaWZmKHRvZGF5c0RhdGUsICdkYXlzJykpO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnRvZ2dsZUNvbXBsZXRlT25seSA9IGZ1bmN0aW9uKGNiU3RhdGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygndG9nZ2xlJyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNiU3RhdGUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdXb3JrT3JkZXJDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnJG1vbWVudCcsIFdvcmtPcmRlckNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
