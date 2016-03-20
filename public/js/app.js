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

    angular.module('app.services', ['ui.router', 'satellizer', 'restangular', 'angular-momentjs', 'ngMaterial']);
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

        $urlRouterProvider.otherwise('/products');


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

    function PurchaseOrderCreateController($auth, $state, $scope, $moment, Restangular, ToastService, RestService, DialogService, $stateParams)
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

    angular.module('app.controllers').controller('PurchaseOrderCreateController', ['$auth', '$state', '$scope', '$moment', 'Restangular', 'ToastService', 'RestService', 'DialogService', '$stateParams', PurchaseOrderCreateController]);

})();

(function(){
    "use strict";

    function PurchaseOrderDetailController($auth, $state, $scope, $moment, Restangular, RestService, $stateParams, ToastService, DialogService)
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
                //console.log("updated");
                ToastService.show("Successfully updated");
                $state.go("app.purchaseorders");
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

    angular.module('app.controllers').controller('PurchaseOrderDetailController', ['$auth', '$state', '$scope', '$moment', 'Restangular', 'RestService', '$stateParams', 'ToastService', 'DialogService', PurchaseOrderDetailController]);

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
        else if($state.is('app.reports.incomebymonth'))
        {
            showIncomeReportByMonthView();
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

    angular.module('app.controllers').controller('ReportController', ['$auth', '$state', 'Restangular', 'RestService', 'ChartService', ReportController]);

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHAuanMiLCJhcHAvcm91dGVzLmpzIiwiYXBwL2RpcmVjdGl2ZXMvZm9jdXNPbi5qcyIsImFwcC9kaXJlY3RpdmVzL3V0Yy1wYXJzZXIuZGlyZWN0aXZlLmpzIiwiYXBwL2ZpbHRlcnMvdHJ1bmNhdGVOYW1lLmpzIiwiYXBwL3NlcnZpY2VzL2F1dGguanMiLCJhcHAvc2VydmljZXMvY2hhcnQuanMiLCJhcHAvc2VydmljZXMvZGlhbG9nLmpzIiwiYXBwL3NlcnZpY2VzL2ZvY3VzLmpzIiwiYXBwL3NlcnZpY2VzL3Jlc3QuanMiLCJhcHAvc2VydmljZXMvdG9hc3QuanMiLCJhcHAvc2VydmljZXMvdmFsaWRhdGlvbi5qcyIsImFwcC9jb250cm9sbGVycy9jb3JlL2NvcmUuanMiLCJhcHAvY29udHJvbGxlcnMvY3VzdG9tZXJzL2N1c3RvbWVyLmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy9jdXN0b21lcnMvY3VzdG9tZXIuZGV0YWlsLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2N1c3RvbWVycy9jdXN0b21lcnMuanMiLCJhcHAvY29udHJvbGxlcnMvZXZlbnRzL2V2ZW50LmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy9ldmVudHMvZXZlbnQuZGV0YWlsLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2V2ZW50cy9ldmVudHMuanMiLCJhcHAvY29udHJvbGxlcnMvZm9vdGVyL2Zvb3Rlci5qcyIsImFwcC9jb250cm9sbGVycy9oZWFkZXIvaGVhZGVyLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2xhbmRpbmcvbGFuZGluZy5qcyIsImFwcC9jb250cm9sbGVycy9sb2dpbi9sb2dpbi5qcyIsImFwcC9jb250cm9sbGVycy9tYXRlcmlhbHMvbWF0ZXJpYWwuY3JlYXRlLmpzIiwiYXBwL2NvbnRyb2xsZXJzL21hdGVyaWFscy9tYXRlcmlhbC5kZXRhaWwuanMiLCJhcHAvY29udHJvbGxlcnMvbWF0ZXJpYWxzL21hdGVyaWFscy5qcyIsImFwcC9jb250cm9sbGVycy9wYXltZW50X3R5cGVzL3BheW1lbnR0eXBlLmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy9wYXltZW50X3R5cGVzL3BheW1lbnR0eXBlLmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy9wYXltZW50X3R5cGVzL3BheW1lbnR0eXBlcy5qcyIsImFwcC9jb250cm9sbGVycy9wcm9kdWN0cy9wcm9kdWN0LmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy9wcm9kdWN0cy9wcm9kdWN0LmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy9wcm9kdWN0cy9wcm9kdWN0cy5qcyIsImFwcC9jb250cm9sbGVycy9wdXJjaGFzZW9yZGVycy9wdXJjaGFzZW9yZGVyLmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy9wdXJjaGFzZW9yZGVycy9wdXJjaGFzZW9yZGVyLmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy9wdXJjaGFzZW9yZGVycy9wdXJjaGFzZW9yZGVycy5qcyIsImFwcC9jb250cm9sbGVycy9yZXBvcnRzL3JlcG9ydHMuanMiLCJhcHAvY29udHJvbGxlcnMvc2VhcmNoL3NlYXJjaC5qcyIsImFwcC9jb250cm9sbGVycy91bml0cy91bml0LmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy91bml0cy91bml0LmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy91bml0cy91bml0cy5qcyIsImFwcC9jb250cm9sbGVycy93b3Jrb3JkZXJzL3dvcmtvcmRlci5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvd29ya29yZGVycy93b3Jrb3JkZXIuZGV0YWlsLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3dvcmtvcmRlcnMvd29ya29yZGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxJQUFBLE1BQUEsUUFBQSxPQUFBO1FBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7OztJQUdBLFFBQUEsT0FBQSxnQkFBQSxDQUFBLGFBQUEsY0FBQSxlQUFBLG9CQUFBO0lBQ0EsUUFBQSxPQUFBLGNBQUEsQ0FBQSxhQUFBO0lBQ0EsUUFBQSxPQUFBLG1CQUFBLENBQUEsYUFBQSxjQUFBLGVBQUEsb0JBQUEsZ0JBQUEsY0FBQSxhQUFBLGlCQUFBLGlCQUFBO0lBQ0EsUUFBQSxPQUFBLGVBQUE7O0lBRUEsUUFBQSxPQUFBLGtCQUFBLENBQUE7SUFDQSxRQUFBLE9BQUEsY0FBQTs7Ozs7O0lBTUEsUUFBQSxPQUFBLGNBQUEseUJBQUEsVUFBQTtJQUNBOzs7UUFHQSxjQUFBLFdBQUE7OztJQUdBLFFBQUEsT0FBQSxjQUFBLDJCQUFBLFVBQUE7SUFDQTtRQUNBO2FBQ0EsYUFBQTthQUNBLFVBQUE7OztJQUdBLFFBQUEsT0FBQSxjQUFBLGdDQUFBLFNBQUEscUJBQUE7UUFDQTthQUNBLFdBQUE7YUFDQSxrQkFBQSxFQUFBLFFBQUE7OztJQUdBLFFBQUEsT0FBQSxjQUFBLCtCQUFBLFNBQUEsb0JBQUE7OztRQUdBLElBQUEsZ0JBQUEsbUJBQUEsY0FBQTtRQUNBO1lBQ0Esd0JBQUE7WUFDQSxzQkFBQSxDQUFBO1lBQ0EsTUFBQTs7O1FBR0EsbUJBQUEsY0FBQSxjQUFBO1FBQ0EsbUJBQUEsTUFBQTthQUNBLGVBQUE7WUFDQTtnQkFDQSxXQUFBO2dCQUNBLFNBQUE7O2FBRUEsY0FBQTs7OztJQUlBLFFBQUEsT0FBQSxjQUFBLGlDQUFBLFNBQUE7SUFDQTtRQUNBLHNCQUFBLGFBQUEsU0FBQTtRQUNBO1lBQ0EsR0FBQSxTQUFBO1lBQ0E7Z0JBQ0EsT0FBQSxPQUFBLE1BQUEsT0FBQTs7O1lBR0EsT0FBQTs7Ozs7SUFLQSxJQUFBLElBQUEsQ0FBQSxjQUFBLGFBQUEsVUFBQSxlQUFBLFVBQUEsWUFBQSxXQUFBLFFBQUEsYUFBQTs7UUFFQSxXQUFBLElBQUEscUJBQUEsVUFBQSxPQUFBLFNBQUEsVUFBQSxXQUFBLFlBQUE7UUFDQTs7O1lBR0EsR0FBQSxRQUFBLFNBQUE7WUFDQTtnQkFDQSxHQUFBLENBQUEsWUFBQTtnQkFDQTtvQkFDQSxRQUFBLElBQUE7b0JBQ0EsTUFBQTtvQkFDQSxPQUFBLEdBQUE7Ozs7Ozs7QUM1RkEsQ0FBQTtBQUNBO0lBQ0E7SUFDQSxRQUFBLE9BQUEsY0FBQSxrRUFBQSxTQUFBLGdCQUFBLG9CQUFBLGdCQUFBOztRQUVBLElBQUEsVUFBQSxVQUFBLFVBQUE7WUFDQSxPQUFBLGdCQUFBLFdBQUE7OztRQUdBLG1CQUFBLFVBQUE7OztRQUdBO2FBQ0EsTUFBQSxPQUFBO2dCQUNBLFVBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxRQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7O29CQUVBLFFBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7b0JBRUEsTUFBQTs7O2FBR0EsTUFBQSxhQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLGVBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsZ0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsdUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsdUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsaUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsd0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsd0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsa0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEseUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEseUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsY0FBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxxQkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxxQkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxlQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLDRCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLHFCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLDRCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLDZCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLGFBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsb0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsb0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsaUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsd0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsd0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsc0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsNkJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsNkJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsb0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsMkJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsMkJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7Ozs7Ozs7Ozs7Ozs7QUMzVUE7O0FBRUEsUUFBQSxPQUFBLGtCQUFBLFVBQUEsV0FBQTtBQUNBO0lBQ0EsT0FBQSxTQUFBLE9BQUEsTUFBQTtJQUNBO1FBQ0EsUUFBQSxJQUFBLEtBQUE7O1FBRUEsTUFBQSxJQUFBLFdBQUEsU0FBQSxHQUFBO1FBQ0E7O0FBRUEsUUFBQSxJQUFBLFlBQUE7WUFDQSxHQUFBLFNBQUEsS0FBQTtZQUNBO2dCQUNBLFFBQUEsSUFBQTtnQkFDQSxLQUFBLEdBQUE7Ozs7O0FDbkJBOztBQUVBLFFBQUEsT0FBQTtLQUNBLFVBQUEsYUFBQTtJQUNBO1FBQ0EsU0FBQSxLQUFBLE9BQUEsU0FBQSxPQUFBLFNBQUE7Ozs7WUFJQSxJQUFBLFNBQUEsVUFBQSxLQUFBO2dCQUNBLE1BQUEsT0FBQSxJQUFBLEtBQUE7Z0JBQ0EsT0FBQTs7O1lBR0EsSUFBQSxZQUFBLFVBQUEsS0FBQTtnQkFDQSxJQUFBLENBQUEsS0FBQTtvQkFDQSxPQUFBOztnQkFFQSxNQUFBLElBQUEsS0FBQTtnQkFDQSxPQUFBOzs7WUFHQSxRQUFBLFNBQUEsUUFBQTtZQUNBLFFBQUEsWUFBQSxRQUFBOzs7UUFHQSxPQUFBO1lBQ0EsU0FBQTtZQUNBLE1BQUE7WUFDQSxVQUFBOzs7QUM3QkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGVBQUEsT0FBQSxnQkFBQTtJQUNBO1FBQ0EsT0FBQSxTQUFBLE9BQUE7UUFDQTtZQUNBLFFBQUEsU0FBQTtZQUNBLElBQUEsTUFBQTs7WUFFQSxHQUFBLE1BQUEsU0FBQTtZQUNBO2dCQUNBLE1BQUEsTUFBQSxPQUFBLEdBQUEsYUFBQTs7O1lBR0E7Z0JBQ0EsTUFBQTs7O1lBR0EsT0FBQTs7Ozs7Ozs7O0FDaEJBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLGVBQUEsQ0FBQSxTQUFBLFVBQUEsU0FBQSxPQUFBLFFBQUE7O1FBRUEsT0FBQTs7WUFFQSxPQUFBLFNBQUEsT0FBQTtZQUNBO2dCQUNBLElBQUEsY0FBQSxFQUFBLE9BQUEsT0FBQSxVQUFBOzs7OztnQkFLQSxPQUFBLE1BQUEsTUFBQTs7O1lBR0EsaUJBQUE7WUFDQTtnQkFDQSxPQUFBLE1BQUE7OztZQUdBLFFBQUE7WUFDQTtnQkFDQSxNQUFBOzs7Ozs7Ozs7OztBQ3ZCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxnQkFBQSxDQUFBLFNBQUEsZUFBQSxXQUFBLFNBQUEsT0FBQSxhQUFBLFFBQUE7O1FBRUEsSUFBQSxZQUFBO1lBQ0EsU0FBQTtnQkFDQSxPQUFBO29CQUNBLE1BQUE7O2dCQUVBO2dCQUNBO29CQUNBO29CQUNBO3dCQUNBLGtCQUFBO3dCQUNBLFFBQUE7d0JBQ0E7d0JBQ0E7NEJBQ0EsU0FBQTs7d0JBRUEsY0FBQTs7OztZQUlBO1lBQ0E7OztZQUdBLFNBQUE7WUFDQTtZQUNBO2dCQUNBLE9BQUE7Z0JBQ0EsUUFBQTs7Ozs7UUFLQSxPQUFBOztZQUVBLHVCQUFBLFNBQUE7WUFDQTs7Z0JBRUEsTUFBQSxjQUFBO29CQUNBLFNBQUE7d0JBQ0EsT0FBQTs0QkFDQSxNQUFBOzt3QkFFQTt3QkFDQTs0QkFDQSxLQUFBOzRCQUNBOzRCQUNBO2dDQUNBLE1BQUE7Ozt3QkFHQTt3QkFDQTs0QkFDQSxNQUFBOzRCQUNBOzRCQUNBO2dDQUNBLE9BQUE7Z0NBQ0EsTUFBQTs7NEJBRUE7NEJBQ0E7Z0NBQ0EsTUFBQTs7O3dCQUdBO3dCQUNBOzs7OztvQkFLQSxPQUFBO3dCQUNBLE1BQUE7OztvQkFHQSxTQUFBOzs7Z0JBR0EsWUFBQSxJQUFBLGlDQUFBLEtBQUEsRUFBQSxnQkFBQSxLQUFBLEtBQUEsU0FBQTtnQkFDQTtvQkFDQSxJQUFBLFVBQUE7b0JBQ0EsSUFBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsUUFBQTtvQkFDQTt3QkFDQSxJQUFBLGVBQUEsS0FBQTs7d0JBRUEsUUFBQSxLQUFBLENBQUEsS0FBQSxJQUFBLFNBQUEsYUFBQSxPQUFBLFNBQUEsYUFBQSxTQUFBLElBQUEsU0FBQSxhQUFBOzs7b0JBR0EsTUFBQSxZQUFBLFNBQUEsQ0FBQSxDQUFBLE1BQUEsb0JBQUEsTUFBQTs7b0JBRUEsTUFBQSxZQUFBLFVBQUE7OztnQkFHQTtnQkFDQTs7Ozs7WUFLQSx3QkFBQSxTQUFBO1lBQ0E7O2dCQUVBLE1BQUEsY0FBQTtvQkFDQSxTQUFBO3dCQUNBLE9BQUE7NEJBQ0EsTUFBQTs7d0JBRUE7d0JBQ0E7NEJBQ0EsS0FBQTs0QkFDQTs0QkFDQTtnQ0FDQSxNQUFBOzs7d0JBR0E7d0JBQ0E7NEJBQ0EsTUFBQTs0QkFDQTs0QkFDQTtnQ0FDQSxPQUFBO2dDQUNBLE1BQUE7OzRCQUVBOzRCQUNBO2dDQUNBLE1BQUE7Ozt3QkFHQTt3QkFDQTs7Ozs7b0JBS0EsT0FBQTt3QkFDQSxNQUFBOzs7b0JBR0EsU0FBQTs7O2dCQUdBLFlBQUEsSUFBQSxpQ0FBQSxLQUFBLEVBQUEsZ0JBQUEsS0FBQSxLQUFBLFNBQUE7b0JBQ0E7d0JBQ0EsSUFBQSxVQUFBO3dCQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLFFBQUE7d0JBQ0E7NEJBQ0EsSUFBQSxlQUFBLEtBQUE7OzRCQUVBLFFBQUEsS0FBQSxDQUFBLEtBQUEsSUFBQSxT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QUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxZQUFBOzs7O1lBSUEsYUFBQSxTQUFBLE9BQUE7WUFDQTtnQkFDQSxZQUFBLElBQUEsWUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO2dCQUNBOztvQkFFQSxNQUFBLFdBQUE7Ozs7WUFJQSxrQkFBQSxTQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLGFBQUEsVUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsYUFBQTs7Ozs7O1lBTUEsY0FBQSxTQUFBLE9BQUE7WUFDQTtnQkFDQSxZQUFBLElBQUEsYUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO2dCQUNBOzs7O29CQUlBLEtBQUEsYUFBQSxRQUFBLEtBQUE7b0JBQ0EsS0FBQSxXQUFBLFFBQUEsS0FBQTs7O29CQUdBLEtBQUEsWUFBQSxTQUFBLEtBQUE7O29CQUVBLEtBQUEsWUFBQTs7O29CQUdBLE1BQUEsWUFBQTs7OztZQUlBLGNBQUEsU0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxTQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBOztvQkFFQSxNQUFBLFNBQUE7Ozs7WUFJQSxVQUFBLFNBQUEsT0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxTQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsUUFBQTs7OztZQUlBLGFBQUEsU0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxRQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBOztvQkFFQSxNQUFBLFFBQUE7Ozs7WUFJQSxTQUFBLFNBQUEsT0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxRQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsT0FBQTs7OztZQUlBLGlCQUFBLFNBQUE7WUFDQTtnQkFDQSxZQUFBLElBQUEsWUFBQSxVQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxZQUFBOzs7O1lBSUEsYUFBQSxTQUFBLE9BQUE7WUFDQTtnQkFDQSxZQUFBLElBQUEsWUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFB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QSxFQUFBLEdBQUE7d0JBQ0EsTUFBQSxzQkFBQSxJQUFBOzs7Z0JBR0E7Z0JBQ0E7Ozs7OztRQU1BLEtBQUEsc0JBQUEsU0FBQTtRQUNBOzs7O1lBSUEsS0FBQSx1QkFBQTs7WUFFQSxJQUFBLEtBQUEsc0JBQUEsSUFBQSxFQUFBLEtBQUEsc0JBQUE7aUJBQ0EsR0FBQSxDQUFBLEtBQUEsc0JBQUEsS0FBQSxLQUFBLGVBQUEsUUFBQSxFQUFBLEtBQUEsc0JBQUEsS0FBQSxlQUFBLFNBQUE7Ozs7WUFJQSxHQUFBLEtBQUEsdUJBQUEsS0FBQSxDQUFBLEtBQUEsc0JBQUEsTUFBQSxLQUFBLGVBQUE7WUFDQTtnQkFDQSxJQUFBLElBQUEsSUFBQSxLQUFBLEtBQUEsZUFBQSxLQUFBLHFCQUFBLE1BQUEsS0FBQSxlQUFBLEtBQUEscUJBQUEsUUFBQSxHQUFBOztnQkFFQSxLQUFBLHdCQUFBO2dCQUNBLEtBQUEsd0JBQUEsS0FBQSxlQUFBLEtBQUEscUJBQUE7Ozs7O1FBS0EsS0FBQSxhQUFBLFNBQUE7UUFDQTtZQUNBLFFBQUEsSUFBQTtZQUNBLEdBQUE7WUFDQTtnQkFDQSxLQUFBLFdBQUEsV0FBQSxLQUFBOzs7Ozs7O0lBT0EsUUFBQSxPQUFBLG1CQUFBLFdBQUEsb0JBQUEsQ0FBQSxTQUFBLFVBQUEsZUFBQSxlQUFBLGdCQUFBOzs7O0FDbEtBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEsaUJBQUEsUUFBQSxPQUFBLGFBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTs7UUFFQSxLQUFBLFVBQUE7UUFDQSxLQUFBLGFBQUE7UUFDQSxLQUFBLGlCQUFBOztRQUVBLEtBQUEsV0FBQSxTQUFBO1FBQ0E7O1lBRUEsT0FBQSxZQUFBLElBQUEsVUFBQSxPQUFBLFVBQUEsS0FBQSxTQUFBO1lBQ0E7Z0JBQ0EsUUFBQSxJQUFBO2dCQUNBLE9BQUE7Ozs7O1FBS0EsS0FBQSx3QkFBQSxVQUFBOztZQUVBLE9BQUEsTUFBQSxXQUFBOzs7UUFHQSxLQUFBLFdBQUE7UUFDQTtZQUNBLFFBQUEsSUFBQSxLQUFBO1lBQ0EsR0FB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QSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw2QkFBQSxDQUFBLFNBQUEsVUFBQSxnQkFBQSxlQUFBLGVBQUEsaUJBQUEscUJBQUEsV0FBQSxnQkFBQTs7OztBQ25FQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLG9CQUFBLE9BQUEsUUFBQSxhQUFBLGFBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTs7UUFFQSxLQUFBLGVBQUE7UUFDQSxJQUFBLGFBQUE7O1FBRUEsWUFBQSxpQkFBQTs7UUFFQSxRQUFBLElBQUE7O1FBRUEsS0FBQSxhQUFBLFNBQUE7UUFDQTs7WUFFQSxJQUFBLElBQUEsUUFBQTs7WUFFQSxJQUFBLFVBQUEsRUFBQSxLQUFBLFlBQUE7O1lBRUEsR0FBQSxVQUFBO1lBQ0E7Z0JBQ0EsT0FBQTs7aUJBRUEsR0FBQSxVQUFBLEtBQUEsV0FBQTtZQUNBO2dCQUNBLE9BQUE7O2lCQUVBLEdBQUEsVUFBQSxLQUFBLFdBQUE7WUFDQTtnQkFDQSxPQUFBOzs7WUFHQTtnQkFDQSxPQUFBOzs7Ozs7O1FBT0EsS0FBQSxxQkFBQSxTQUFBO1FBQ0E7WUFDQSxRQUFBLElBQUE7WUFDQSxRQUFBLElBQUE7Ozs7O0lBS0EsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdUJBQUEsQ0FBQSxTQUFBLFVBQUEsZUFBQSxlQUFBLFdBQUE7OztBQUdBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLFxyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgJ2FwcC5jb250cm9sbGVycycsXHJcbiAgICAgICAgICAgICdhcHAuZmlsdGVycycsXHJcbiAgICAgICAgICAgICdhcHAuc2VydmljZXMnLFxyXG4gICAgICAgICAgICAnYXBwLmRpcmVjdGl2ZXMnLFxyXG4gICAgICAgICAgICAnYXBwLnJvdXRlcycsXHJcbiAgICAgICAgICAgICdhcHAuY29uZmlnJ1xyXG4gICAgICAgIF0pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnLCBbJ3VpLnJvdXRlcicsICdzYXRlbGxpemVyJywgJ3Jlc3Rhbmd1bGFyJywgJ2FuZ3VsYXItbW9tZW50anMnLCAnbmdNYXRlcmlhbCddKTtcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJywgWyd1aS5yb3V0ZXInLCAnc2F0ZWxsaXplciddKTtcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnLCBbJ3VpLnJvdXRlcicsICduZ01hdGVyaWFsJywgJ3Jlc3Rhbmd1bGFyJywgJ2FuZ3VsYXItbW9tZW50anMnLCAnYXBwLnNlcnZpY2VzJywgJ25nTWVzc2FnZXMnLCAnbmdNZEljb25zJywgJ21kLmRhdGEudGFibGUnLCAnaGlnaGNoYXJ0cy1uZycsICduZ0Nvb2tpZXMnXSk7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnLCBbXSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJywgWydhbmd1bGFyLW1vbWVudGpzJ10pO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnLCBbXSk7XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyBDb25maWd1cmF0aW9uIHN0dWZmXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoJGF1dGhQcm92aWRlcilcclxuICAgIHtcclxuICAgICAgICAvLyBTYXRlbGxpemVyIGNvbmZpZ3VyYXRpb24gdGhhdCBzcGVjaWZpZXMgd2hpY2ggQVBJXHJcbiAgICAgICAgLy8gcm91dGUgdGhlIEpXVCBzaG91bGQgYmUgcmV0cmlldmVkIGZyb21cclxuICAgICAgICAkYXV0aFByb3ZpZGVyLmxvZ2luVXJsID0gJy9hcGkvYXV0aGVudGljYXRlJztcclxuICAgIH0pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uICgkbW9tZW50UHJvdmlkZXIpXHJcbiAgICB7XHJcbiAgICAgICAgJG1vbWVudFByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5hc3luY0xvYWRpbmcoZmFsc2UpXHJcbiAgICAgICAgICAgIC5zY3JpcHRVcmwoJy8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL21vbWVudC5qcy8yLjUuMS9tb21lbnQubWluLmpzJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyggZnVuY3Rpb24oUmVzdGFuZ3VsYXJQcm92aWRlcikge1xyXG4gICAgICAgIFJlc3Rhbmd1bGFyUHJvdmlkZXJcclxuICAgICAgICAgICAgLnNldEJhc2VVcmwoJy9hcGkvJylcclxuICAgICAgICAgICAgLnNldERlZmF1bHRIZWFkZXJzKHsgYWNjZXB0OiBcImFwcGxpY2F0aW9uL3gubGFyYXZlbC52MStqc29uXCIgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyggZnVuY3Rpb24oJG1kVGhlbWluZ1Byb3ZpZGVyKSB7XHJcbiAgICAgICAgLyogRm9yIG1vcmUgaW5mbywgdmlzaXQgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyanMub3JnLyMvVGhlbWluZy8wMV9pbnRyb2R1Y3Rpb24gKi9cclxuXHJcbiAgICAgICAgdmFyIGN1c3RvbUJsdWVNYXAgPSAkbWRUaGVtaW5nUHJvdmlkZXIuZXh0ZW5kUGFsZXR0ZSgnbGlnaHQtYmx1ZScsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAnY29udHJhc3REZWZhdWx0Q29sb3InOiAnbGlnaHQnLFxyXG4gICAgICAgICAgICAnY29udHJhc3REYXJrQ29sb3JzJzogWyc1MCddLFxyXG4gICAgICAgICAgICAnNTAnOiAnZmZmZmZmJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnY3VzdG9tQmx1ZScsIGN1c3RvbUJsdWVNYXApO1xyXG4gICAgICAgICRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgnZGVmYXVsdCcpXHJcbiAgICAgICAgICAgIC5wcmltYXJ5UGFsZXR0ZSgnY3VzdG9tQmx1ZScsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICdkZWZhdWx0JzogJzUwMCcsXHJcbiAgICAgICAgICAgICAgICAnaHVlLTEnOiAnNTAnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5hY2NlbnRQYWxldHRlKCdwaW5rJyk7XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24oJG1kRGF0ZUxvY2FsZVByb3ZpZGVyKVxyXG4gICAge1xyXG4gICAgICAgICRtZERhdGVMb2NhbGVQcm92aWRlci5mb3JtYXREYXRlID0gZnVuY3Rpb24oZGF0ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKGRhdGUgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vbWVudChkYXRlKS5mb3JtYXQoJ01NLURELVlZWVknKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBDaGVjayBmb3IgYXV0aGVudGljYXRlZCB1c2VyIG9uIGV2ZXJ5IHJlcXVlc3RcclxuICAgIGFwcC5ydW4oWyckcm9vdFNjb3BlJywgJyRsb2NhdGlvbicsICckc3RhdGUnLCAnQXV0aFNlcnZpY2UnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJGxvY2F0aW9uLCAkc3RhdGUsIEF1dGhTZXJ2aWNlKSB7XHJcblxyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcywgb3B0aW9ucylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ0F0dGVtcHRpbmcgdG8gZ2V0IHVybDogWycgKyB0b1N0YXRlLm5hbWUgKyAnXScpO1xyXG4gICAgICAgICAgICAvLyBMZXQgYW55b25lIGdvIHRvIHRoZSBsb2dpbiBwYWdlLCBjaGVjayBhdXRoIG9uIGFsbCBvdGhlciBwYWdlc1xyXG4gICAgICAgICAgICBpZih0b1N0YXRlLm5hbWUgIT09ICdhcHAubG9naW4nKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZighQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1c2VyIG5vdCBsb2dnZWQgaW4sIHJlZGlyZWN0IHRvIGxvZ2luIHBhZ2VcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5sb2dpbicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XSk7XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbigpXHJcbntcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnKS5jb25maWcoIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRhdXRoUHJvdmlkZXIgKSB7XHJcblxyXG4gICAgICAgIHZhciBnZXRWaWV3ID0gZnVuY3Rpb24oIHZpZXdOYW1lICl7XHJcbiAgICAgICAgICAgIHJldHVybiAnL3ZpZXdzL2FwcC8nICsgdmlld05hbWUgKyAnLmh0bWwnO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9wcm9kdWN0cycpO1xyXG5cclxuXHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAnLCB7XHJcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdoZWFkZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0hlYWRlckNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsSGVhZGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZm9vdGVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdmb290ZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0Zvb3RlckNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsRm9vdGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbWFpbjoge31cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAubG9naW4nLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvbG9naW4nLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdsb2dpbicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9naW5Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybExvZ2luJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAubGFuZGluZycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9sYW5kaW5nJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnbGFuZGluZycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTGFuZGluZ0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsTGFuZGluZydcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnByb2R1Y3RzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3Byb2R1Y3RzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncHJvZHVjdHMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Byb2R1Y3RDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFByb2R1Y3QnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5wcm9kdWN0cy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzpwcm9kdWN0SWQnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwcm9kdWN0LmRldGFpbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdERldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUHJvZHVjdERldGFpbCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnByb2R1Y3RzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwcm9kdWN0LmNyZWF0ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdENyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUHJvZHVjdENyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmN1c3RvbWVycycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jdXN0b21lcnMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdjdXN0b21lcnMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0N1c3RvbWVyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxDdXN0b21lcidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmN1c3RvbWVycy5jcmVhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvY3JlYXRlJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnY3VzdG9tZXIuY3JlYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDdXN0b21lckNyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsQ3VzdG9tZXJDcmVhdGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5jdXN0b21lcnMuZGV0YWlsJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2RldGFpbC86Y3VzdG9tZXJJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2N1c3RvbWVyLmRldGFpbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ3VzdG9tZXJEZXRhaWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybEN1c3RvbWVyRGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAud29ya29yZGVycycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy93b3Jrb3JkZXJzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0Vmlldygnd29ya29yZGVycycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnV29ya09yZGVyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxXb3JrT3JkZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC53b3Jrb3JkZXJzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd3b3Jrb3JkZXIuY3JlYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdXb3JrT3JkZXJDcmVhdGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFdvcmtPcmRlckNyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLndvcmtvcmRlcnMuZGV0YWlsJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2RldGFpbC86d29ya09yZGVySWQnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd3b3Jrb3JkZXIuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdXb3JrT3JkZXJEZXRhaWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFdvcmtPcmRlckRldGFpbCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmV2ZW50cycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9ldmVudHMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdldmVudHMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0V2ZW50Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxFdmVudCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmV2ZW50cy5jcmVhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvY3JlYXRlJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnZXZlbnQuY3JlYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFdmVudENyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsRXZlbnRDcmVhdGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5ldmVudHMuZGV0YWlsJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2RldGFpbC86ZXZlbnRJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2V2ZW50LmRldGFpbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRXZlbnREZXRhaWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybEV2ZW50RGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucmVwb3J0cycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9yZXBvcnRzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncmVwb3J0cycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVwb3J0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxSZXBvcnQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5yZXBvcnRzLmN1cnJlbnRzdG9jaycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jdXJyZW50c3RvY2snLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdyZXBvcnQuY3VycmVudHN0b2NrJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXBvcnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFJlcG9ydCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnJlcG9ydHMuc2FsZXMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvc2FsZXMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdyZXBvcnQuc2FsZXMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcG9ydENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUmVwb3J0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucmVwb3J0cy5zYWxlc2J5bW9udGgnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvc2FsZXNieW1vbnRoJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncmVwb3J0LnNhbGVzYnltb250aCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVwb3J0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxSZXBvcnQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5yZXBvcnRzLmluY29tZWJ5bW9udGgnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvaW5jb21lYnltb250aCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3JlcG9ydC5pbmNvbWVieW1vbnRoJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXBvcnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFJlcG9ydCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnVuaXRzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3VuaXRzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygndW5pdHMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VuaXRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFVuaXQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC51bml0cy5jcmVhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvY3JlYXRlJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygndW5pdC5jcmVhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VuaXRDcmVhdGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFVuaXRDcmVhdGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC51bml0cy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzp1bml0SWQnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd1bml0LmRldGFpbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVW5pdERldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsVW5pdERldGFpbCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLm1hdGVyaWFscycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9tYXRlcmlhbHMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdtYXRlcmlhbHMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01hdGVyaWFsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxNYXRlcmlhbCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLm1hdGVyaWFscy5jcmVhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvY3JlYXRlJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnbWF0ZXJpYWwuY3JlYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNYXRlcmlhbENyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsTWF0ZXJpYWxDcmVhdGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5tYXRlcmlhbHMuZGV0YWlsJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2RldGFpbC86bWF0ZXJpYWxJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ21hdGVyaWFsLmRldGFpbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWF0ZXJpYWxEZXRhaWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybE1hdGVyaWFsRGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucHVyY2hhc2VvcmRlcnMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcHVyY2hhc2VvcmRlcnMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwdXJjaGFzZW9yZGVycycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHVyY2hhc2VPcmRlckNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUHVyY2hhc2VPcmRlcidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnB1cmNoYXNlb3JkZXJzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwdXJjaGFzZW9yZGVyLmNyZWF0ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHVyY2hhc2VPcmRlckNyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUHVyY2hhc2VPcmRlckNyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnB1cmNoYXNlb3JkZXJzLmRldGFpbCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9kZXRhaWwvOnB1cmNoYXNlT3JkZXJJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3B1cmNoYXNlb3JkZXIuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQdXJjaGFzZU9yZGVyRGV0YWlsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQdXJjaGFzZU9yZGVyRGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucGF5bWVudHR5cGVzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3BheW1lbnR0eXBlcycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3BheW1lbnR0eXBlcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUGF5bWVudFR5cGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFBheW1lbnRUeXBlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucGF5bWVudHR5cGVzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwYXltZW50dHlwZS5jcmVhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1BheW1lbnRUeXBlQ3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQYXltZW50VHlwZUNyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnBheW1lbnR0eXBlcy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzpwYXltZW50VHlwZUlkJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncGF5bWVudHR5cGUuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQYXltZW50VHlwZURldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUGF5bWVudFR5cGVEZXRhaWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuXHJcbiAgICAgICAgICAgIDtcclxuXHJcbiAgICB9ICk7XHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgYnlvdW5nIG9uIDMvMTgvMjAxNi5cclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ2ZvY3VzT24nLCBmdW5jdGlvbiAoKVxyXG57XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsZW0sIGF0dHIpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYXR0ci5mb2N1c09uKTtcclxuXHJcbiAgICAgICAgc2NvcGUuJG9uKCdmb2N1c09uJywgZnVuY3Rpb24oZSwgbmFtZSlcclxuICAgICAgICB7XHJcblxyXG5jb25zb2xlLmxvZygnbmFtZSBpcycgKyBuYW1lKTtcclxuICAgICAgICAgICAgaWYobmFtZSA9PT0gYXR0ci5mb2N1c09uKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZvdW5kIGVsZW1cIik7XHJcbiAgICAgICAgICAgICAgICBlbGVtWzBdLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpXHJcbiAgICAuZGlyZWN0aXZlKCd1dGNQYXJzZXInLCBmdW5jdGlvbiAoKVxyXG4gICAge1xyXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsKSB7XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiSW4gdXRjUGFyc2VyIGRpcmVjdGl2ZVwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwYXJzZXIgPSBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgICAgICAgICB2YWwgPSBtb21lbnQudXRjKHZhbCkuZm9ybWF0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdmFyIGZvcm1hdHRlciA9IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhbCA9IG5ldyBEYXRlKHZhbCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgbmdNb2RlbC4kcGFyc2Vycy51bnNoaWZ0KHBhcnNlcik7XHJcbiAgICAgICAgICAgIG5nTW9kZWwuJGZvcm1hdHRlcnMudW5zaGlmdChmb3JtYXR0ZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnXHJcbiAgICAgICAgfTtcclxuICAgIH0pOyIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJhcHAuZmlsdGVyc1wiKS5maWx0ZXIoJ3RydW5jYXRlTmFtZScsIGZ1bmN0aW9uKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oaW5wdXQsIG1heExlbmd0aClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlucHV0ID0gaW5wdXQgfHwgXCJcIjtcclxuICAgICAgICAgICAgdmFyIG91dCA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICBpZihpbnB1dC5sZW5ndGggPiBtYXhMZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG91dCA9IGlucHV0LnN1YnN0cigwLCBtYXhMZW5ndGgpICsgXCIuLi5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG91dCA9IGlucHV0O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGJ5b3VuZyBvbiAzLzE0LzIwMTYuXHJcbiAqL1xyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0F1dGhTZXJ2aWNlJywgWyckYXV0aCcsICckc3RhdGUnLCBmdW5jdGlvbigkYXV0aCwgJHN0YXRlKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcblxyXG4gICAgICAgICAgICBsb2dpbjogZnVuY3Rpb24oZW1haWwsIHBhc3N3b3JkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3JlZGVudGlhbHMgPSB7IGVtYWlsOiBlbWFpbCwgcGFzc3dvcmQ6IHBhc3N3b3JkIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhjcmVkZW50aWFscyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVXNlIFNhdGVsbGl6ZXIncyAkYXV0aCBzZXJ2aWNlIHRvIGxvZ2luIGJlY2F1c2UgaXQnbGwgYXV0b21hdGljYWxseSBzYXZlIHRoZSBKV1QgaW4gbG9jYWxTdG9yYWdlXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGF1dGgubG9naW4oY3JlZGVudGlhbHMpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgaXNBdXRoZW50aWNhdGVkOiBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGxvZ291dDogZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAkYXV0aC5sb2dvdXQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfV0pO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBCcmVlbiBvbiAxNS8wMi8yMDE2LlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnQ2hhcnRTZXJ2aWNlJywgWyckYXV0aCcsICdSZXN0YW5ndWxhcicsICckbW9tZW50JywgZnVuY3Rpb24oJGF1dGgsIFJlc3Rhbmd1bGFyLCAkbW9tZW50KXtcclxuXHJcbiAgICAgICAgdmFyIHBpZUNvbmZpZyA9IHtcclxuICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgY2hhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncGllJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHBsb3RPcHRpb25zOlxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHBpZTpcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsbG93UG9pbnRTZWxlY3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhTGFiZWxzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dJbkxlZ2VuZDogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRpdGxlOlxyXG4gICAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsb2FkaW5nOiB0cnVlLFxyXG4gICAgICAgICAgICBzaXplOlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB3aWR0aDogNDAwLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAyNTBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICAgICAgZ2V0TW9udGhseVNhbGVzUmVwb3J0OiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgICAgIHNjb3BlLmNoYXJ0Q29uZmlnID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjb2x1bW4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHlBeGlzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnIyBvZiBzYWxlcydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeEF4aXM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkYXRldGltZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlVGltZUxhYmVsRm9ybWF0czpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb250aDogJyViJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5ZWFyOiAnJWInXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ0RhdGUnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvb2x0aXA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnU2FsZXMgcGVyIG1vbnRoJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmc6IHRydWVcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdyZXBvcnRzL2dldE1vbnRobHlTYWxlc1JlcG9ydCcpLnBvc3QoeyAncmVwb3J0UGFyYW1zJzoge319KS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFTZXQgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvbmVEYXRhUG9pbnQgPSBkYXRhW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKG9uZURhdGFQb2ludCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFTZXQucHVzaChbRGF0ZS5VVEMocGFyc2VJbnQob25lRGF0YVBvaW50LnllYXIpLCBwYXJzZUludChvbmVEYXRhUG9pbnQubW9udGgpIC0gMSksIHBhcnNlSW50KG9uZURhdGFQb2ludC5wb2NvdW50KV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2hhcnRDb25maWcuc2VyaWVzID0gW3tuYW1lOiAnU2FsZXMgdGhpcyBtb250aCcsIGRhdGE6IGRhdGFTZXQgfV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmNoYXJ0Q29uZmlnLmxvYWRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEVycm9yXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldE1vbnRobHlJbmNvbWVSZXBvcnQ6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICAgICAgc2NvcGUuY2hhcnRDb25maWcgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NvbHVtbidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeUF4aXM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbjogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICckIGFtb3VudCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeEF4aXM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkYXRldGltZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlVGltZUxhYmVsRm9ybWF0czpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb250aDogJyViJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5ZWFyOiAnJWInXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ0RhdGUnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvb2x0aXA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnSW5jb21lIHBlciBtb250aCdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgncmVwb3J0cy9nZXRNb250aGx5U2FsZXNSZXBvcnQnKS5wb3N0KHsgJ3JlcG9ydFBhcmFtcyc6IHt9fSkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFTZXQgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvbmVEYXRhUG9pbnQgPSBkYXRhW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhvbmVEYXRhUG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVNldC5wdXNoKFtEYXRlLlVUQyhwYXJzZUludChvbmVEYXRhUG9pbnQueWVhciksIHBhcnNlSW50KG9uZURhdGFQb2ludC5tb250aCkgLSAxKSwgcGFyc2VGbG9hdChvbmVEYXRhUG9pbnQubW9udGh0b3RhbCldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2hhcnRDb25maWcuc2VyaWVzID0gW3tuYW1lOiAnSW5jb21lIHRoaXMgbW9udGgnLCBkYXRhOiBkYXRhU2V0IH1dO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2hhcnRDb25maWcubG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRUb3BTZWxsaW5nUHJvZHVjdHM6IGZ1bmN0aW9uKHNjb3BlLCBjaGFydFRpdGxlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFydFRpdGxlKTtcclxuICAgICAgICAgICAgICAgIHNjb3BlLnRvcFNlbGxpbmdDaGFydENvbmZpZyA9IHt9O1xyXG4gICAgICAgICAgICAgICAgc2NvcGUudG9wU2VsbGluZ0NoYXJ0Q29uZmlnID0galF1ZXJ5LmV4dGVuZCh0cnVlLCB7fSwgcGllQ29uZmlnKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdyZXBvcnRzL2dldFRvcFNlbGxpbmdQcm9kdWN0cycpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YVNldCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9uZURhdGFQb2ludCA9IGRhdGFbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cob25lRGF0YVBvaW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVNldC5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IG9uZURhdGFQb2ludC5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ6IChpID09PSAwKSA/IHRydWUgOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWNlZDogKGkgPT09IDApID8gdHJ1ZSA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogcGFyc2VJbnQob25lRGF0YVBvaW50LnBjb3VudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzY29wZS50b3BTZWxsaW5nQ2hhcnRDb25maWcuc2VyaWVzID0gW3tuYW1lOiAnU29sZCcsIGRhdGE6IGRhdGFTZXQgfV07XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUudG9wU2VsbGluZ0NoYXJ0Q29uZmlnLnRpdGxlLnRleHQgPSBjaGFydFRpdGxlO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnRvcFNlbGxpbmdDaGFydENvbmZpZy5sb2FkaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfTtcclxuICAgIH1dKTtcclxufSkoKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBCcmVlbiBvbiAxNS8wMi8yMDE2LlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnRGlhbG9nU2VydmljZScsIGZ1bmN0aW9uKCAkbWREaWFsb2cgKXtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgICAgIGZyb21DdXN0b206IGZ1bmN0aW9uKG9wdGlvbnMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkbWREaWFsb2cuc2hvdyhvcHRpb25zKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGZyb21UZW1wbGF0ZTogZnVuY3Rpb24oZXYsIHRlbXBsYXRlLCBzY29wZSApIHtcclxuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpYWxvZ3MvJyArIHRlbXBsYXRlICsgJy5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBlc2NhcGVUb0Nsb3NlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiBEaWFsb2dDb250cm9sbGVyKCRzY29wZSwgJG1kRGlhbG9nKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbmZpcm1EaWFsb2cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNhbmNlbERpYWxvZyA9IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmNhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoZXYgIT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy50YXJnZXRFdmVudCA9IGV2O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggc2NvcGUgKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2NvcGUgPSBzY29wZS4kbmV3KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9vcHRpb25zLnByZXNlcnZlU2NvcGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiAkbWREaWFsb2cuc2hvdyhvcHRpb25zKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGhpZGU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJG1kRGlhbG9nLmhpZGUoKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFsZXJ0OiBmdW5jdGlvbih0aXRsZSwgY29udGVudCl7XHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuc2hvdyhcclxuICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuYWxlcnQoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGl0bGUodGl0bGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jb250ZW50KGNvbnRlbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vaygnT2snKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGNvbmZpcm06IGZ1bmN0aW9uKGV2ZW50LCB0aXRsZSwgY29udGVudClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbmZpcm0gPSAkbWREaWFsb2cuY29uZmlybSgpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRpdGxlKHRpdGxlKVxyXG4gICAgICAgICAgICAgICAgICAgIC50ZXh0Q29udGVudChjb250ZW50KVxyXG4gICAgICAgICAgICAgICAgICAgIC5hcmlhTGFiZWwoJycpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRhcmdldEV2ZW50KGV2ZW50KVxyXG4gICAgICAgICAgICAgICAgICAgIC5vaygnWWVzJylcclxuICAgICAgICAgICAgICAgICAgICAuY2FuY2VsKCdObycpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiAkbWREaWFsb2cuc2hvdyhjb25maXJtKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbn0pKCk7IiwiXHJcbihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnRm9jdXNTZXJ2aWNlJywgWyckcm9vdFNjb3BlJywgJyR0aW1lb3V0JywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHRpbWVvdXQpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG5hbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdmb2N1c09uJywgbmFtZSk7XHJcbiAgICAgICAgICAgIH0sMTAwKTtcclxuICAgICAgICB9O1xyXG4gICAgfV0pO1xyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEJyZWVuIG9uIDE1LzAyLzIwMTYuXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdSZXN0U2VydmljZScsIFsnJGF1dGgnLCAnUmVzdGFuZ3VsYXInLCAnJG1vbWVudCcsIGZ1bmN0aW9uKCRhdXRoLCBSZXN0YW5ndWxhciwgJG1vbWVudCl7XHJcblxyXG4gICAgICAgIHZhciBiYXNlUHJvZHVjdHMgPSBSZXN0YW5ndWxhci5hbGwoJ3Byb2R1Y3QnKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgICAgIGdldEFsbFByb2R1Y3RzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYmFzZVByb2R1Y3RzLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5wcm9kdWN0cyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldFByb2R1Y3Q6IGZ1bmN0aW9uKHNjb3BlLCBpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdwcm9kdWN0JywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEhhY2sgZm9yIE9MRCBteXNxbCBkcml2ZXJzIG9uIEhvc3RnYXRvciB3aGljaCBkb24ndCBwcm9wZXJseSBlbmNvZGUgaW50ZWdlciBhbmQgcmV0dXJuIHRoZW0gYXMgc3RyaW5nc1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuaXNfY3VzdG9tID0gcGFyc2VJbnQoZGF0YS5pc19jdXN0b20pO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnByb2R1Y3QgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRBbGxDdXN0b21lcnM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ2N1c3RvbWVyJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmN1c3RvbWVycyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEN1c3RvbWVyOiBmdW5jdGlvbihzY29wZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnY3VzdG9tZXInLCBpZCkuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY3VzdG9tZXIgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRBbGxXb3JrT3JkZXJzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCd3b3Jrb3JkZXInKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUud29ya29yZGVycyA9IGRhdGE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRXb3JrT3JkZXI6IGZ1bmN0aW9uKHNjb3BlLCBpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCd3b3Jrb3JkZXInLCBpZCkuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEZvcm1hdCBzdHJpbmcgZGF0ZXMgaW50byBkYXRlIG9iamVjdHNcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLnN0YXJ0X2RhdGUgPSAkbW9tZW50KGRhdGEuc3RhcnRfZGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5lbmRfZGF0ZSA9ICRtb21lbnQoZGF0YS5lbmRfZGF0ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEhhY2sgZm9yIE9MRCBteXNxbCBkcml2ZXJzIG9uIEhvc3RnYXRvciB3aGljaCBkb24ndCBwcm9wZXJseSBlbmNvZGUgaW50ZWdlciBhbmQgcmV0dXJuIHRoZW0gYXMgc3RyaW5nc1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuY29tcGxldGVkID0gcGFyc2VJbnQoZGF0YS5jb21wbGV0ZWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzZWxmLndvcmtvcmRlciA9IGRhdGE7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzY29wZS53b3Jrb3JkZXIgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRBbGxFdmVudHM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ2V2ZW50JykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmV2ZW50cyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEV2ZW50OiBmdW5jdGlvbihzY29wZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnZXZlbnQnLCBpZCkuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuZXZlbnQgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRBbGxVbml0czogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgndW5pdCcpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS51bml0cyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldFVuaXQ6IGZ1bmN0aW9uKHNjb3BlLCBpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCd1bml0JywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnVuaXQgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRBbGxNYXRlcmlhbHM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ21hdGVyaWFsJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLm1hdGVyaWFscyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldE1hdGVyaWFsOiBmdW5jdGlvbihzY29wZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnbWF0ZXJpYWwnLCBpZCkuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUubWF0ZXJpYWwgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBkb1NlYXJjaDogZnVuY3Rpb24oc2NvcGUsIHF1ZXJ5KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNhbGwgV1Mgd2l0aDogXCIgKyBxdWVyeSk7XHJcblxyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdzZWFyY2gnLCBxdWVyeSkuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRBbGxQdXJjaGFzZU9yZGVyczogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgncHVyY2hhc2VvcmRlcicpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5wdXJjaGFzZW9yZGVycyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldFB1cmNoYXNlT3JkZXI6IGZ1bmN0aW9uKHNjb3BlLCBpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdwdXJjaGFzZW9yZGVyJywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBGb3JtYXQgc3RyaW5nIGRhdGVzIGludG8gZGF0ZSBvYmplY3RzXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5waWNrdXBfZGF0ZSA9ICRtb21lbnQoZGF0YS5waWNrdXBfZGF0ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEhhY2sgZm9yIE9MRCBteXNxbCBkcml2ZXJzIG9uIEhvc3RnYXRvciB3aGljaCBkb24ndCBwcm9wZXJseSBlbmNvZGUgaW50ZWdlciBhbmQgcmV0dXJuIHRoZW0gYXMgc3RyaW5nc1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuZnVsZmlsbGVkID0gcGFyc2VJbnQoZGF0YS5mdWxmaWxsZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEucGFpZCA9IHBhcnNlSW50KGRhdGEucGFpZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnB1cmNoYXNlb3JkZXIgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRBbGxQYXltZW50VHlwZXM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3BheW1lbnR0eXBlJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnBheW1lbnR0eXBlcyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldFBheW1lbnRUeXBlOiBmdW5jdGlvbihzY29wZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncGF5bWVudHR5cGUnLCBpZCkuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucGF5bWVudHR5cGUgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRNYXRlcmlhbEFsbFR5cGVzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdtYXRlcmlhbHR5cGUnKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUubWF0ZXJpYWx0eXBlcyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEZ1bGx5Qm9va2VkRGF5czogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnc2NoZWR1bGVyL2dldEZ1bGx5Qm9va2VkRGF5cycpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuYm9va2VkRGF5cyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH07XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgQnJlZW4gb24gMTUvMDIvMjAxNi5cclxuICovXHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ1RvYXN0U2VydmljZScsIGZ1bmN0aW9uKCAkbWRUb2FzdCApe1xyXG5cclxuICAgICAgICB2YXIgZGVsYXkgPSA2MDAwLFxyXG4gICAgICAgICAgICBwb3NpdGlvbiA9ICd0b3AgcmlnaHQnLFxyXG4gICAgICAgICAgICBhY3Rpb24gPSAnT0snO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzaG93OiBmdW5jdGlvbihjb250ZW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJG1kVG9hc3Quc2hvdyhcclxuICAgICAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaW1wbGUoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY29udGVudChjb250ZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucG9zaXRpb24ocG9zaXRpb24pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hY3Rpb24oYWN0aW9uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuaGlkZURlbGF5KGRlbGF5KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxufSkoKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBieW91bmcgb24gMy8xNC8yMDE2LlxyXG4gKi9cclxuKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdWYWxpZGF0aW9uU2VydmljZScsIFtmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgICAgIGRlY2ltYWxSZWdleDogZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ15cXFxcZCpcXFxcLj9cXFxcZCokJztcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIG51bWVyaWNSZWdleDogZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ15cXFxcZCokJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfV0pO1xyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIENvcmVDb250cm9sbGVyKCRzY29wZSwgJHN0YXRlLCAkbW9tZW50LCAkbWRTaWRlbmF2LCAkbWRNZWRpYSwgQXV0aFNlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG5cclxuICAgICAgICAkc2NvcGUudG9kYXlzRGF0ZSA9IHRvZGF5O1xyXG4gICAgICAgICRzY29wZS5zaG93U2VhcmNoID0gZmFsc2U7XHJcblxyXG4gICAgICAgICRzY29wZS50b2dnbGVTaWRlbmF2ID0gZnVuY3Rpb24obWVudUlkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgJG1kU2lkZW5hdihtZW51SWQpLnRvZ2dsZSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5zaG93U2lkZU5hdiA9IGZ1bmN0aW9uKG1lbnVJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKCEkbWRTaWRlbmF2KG1lbnVJZCkuaXNMb2NrZWRPcGVuKCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICRtZFNpZGVuYXYobWVudUlkKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuaGlkZVNpZGVOYXYgPSBmdW5jdGlvbihtZW51SWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZighJG1kU2lkZW5hdihtZW51SWQpLmlzTG9ja2VkT3BlbigpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAkbWRTaWRlbmF2KG1lbnVJZCkuY2xvc2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS50b2dnbGVTZWFyY2ggPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAkc2NvcGUuc2hvd1NlYXJjaCA9ICEkc2NvcGUuc2hvd1NlYXJjaDtcclxuICAgICAgICAgICAgLy9pZigkc2NvcGUuc2hvd1NlYXJjaCkgeyBjb25zb2xlLmxvZyhhbmd1bGFyLmVsZW1lbnQoJyNzdXBlclNlYXJjaCcpKTsgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIExpc3RlbiBmb3IgdG9nZ2xlU2VhcmNoIGV2ZW50c1xyXG4gICAgICAgICRzY29wZS4kb24oXCJ0b2dnbGVTZWFyY2hcIiwgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgJHNjb3BlLnRvZ2dsZVNlYXJjaCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkc2NvcGUuZGV0ZXJtaW5lRmFiVmlzaWJpbGl0eSA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKCRzdGF0ZS5pcyhcImFwcC5wcm9kdWN0c1wiKSB8fCAkc3RhdGUuaXMoXCJhcHAuY3VzdG9tZXJzXCIpXHJcbiAgICAgICAgICAgICAgICB8fCAkc3RhdGUuaXMoXCJhcHAucHVyY2hhc2VvcmRlcnNcIikgfHwgJHN0YXRlLmlzKFwiYXBwLnBheW1lbnR0eXBlc1wiKVxyXG4gICAgICAgICAgICAgICAgfHwgJHN0YXRlLmlzKFwiYXBwLndvcmtvcmRlcnNcIikgfHwgJHN0YXRlLmlzKFwiYXBwLmV2ZW50c1wiKVxyXG4gICAgICAgICAgICAgICAgfHwgJHN0YXRlLmlzKFwiYXBwLnVuaXRzXCIpIHx8ICRzdGF0ZS5pcyhcImFwcC5tYXRlcmlhbHNcIikpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmFkZEZhYk5hdmlnYXRlID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJHN0YXRlLiRjdXJyZW50Lm5hbWUpO1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gXCJcIjtcclxuICAgICAgICAgICAgc3dpdGNoKCRzdGF0ZS4kY3VycmVudC5uYW1lKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiYXBwLnByb2R1Y3RzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gXCJhcHAucHJvZHVjdHMuY3JlYXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiYXBwLmN1c3RvbWVyc1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IFwiYXBwLmN1c3RvbWVycy5jcmVhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJhcHAucHVyY2hhc2VvcmRlcnNcIjpcclxuICAgICAgICAgICAgICAgICAgICB1cmwgPSBcImFwcC5wdXJjaGFzZW9yZGVycy5jcmVhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJhcHAucGF5bWVudHR5cGVzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gXCJhcHAucGF5bWVudHR5cGVzLmNyZWF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImFwcC53b3Jrb3JkZXJzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gXCJhcHAud29ya29yZGVycy5jcmVhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJhcHAuZXZlbnRzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gXCJhcHAuZXZlbnRzLmNyZWF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImFwcC51bml0c1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IFwiYXBwLnVuaXRzLmNyZWF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImFwcC5tYXRlcmlhbHNcIjpcclxuICAgICAgICAgICAgICAgICAgICB1cmwgPSBcImFwcC5tYXRlcmlhbHMuY3JlYXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzdGF0ZS5nbyh1cmwpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5pc0F1dGhlbnRpY2F0ZWQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xyXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5sb2dpbicpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb3JlQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRzdGF0ZScsICckbW9tZW50JywgJyRtZFNpZGVuYXYnLCAnJG1kTWVkaWEnLCAnQXV0aFNlcnZpY2UnLCBDb3JlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBDdXN0b21lckNyZWF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgVG9hc3RTZXJ2aWNlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYuY3JlYXRlQ3VzdG9tZXIgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYuY3VzdG9tZXIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjID0gc2VsZi5jdXN0b21lcjtcclxuXHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ2N1c3RvbWVyJykucG9zdChjKS50aGVuKGZ1bmN0aW9uKGQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8kc3RhdGUuZ28oJ2FwcC5jdXN0b21lcnMuZGV0YWlsJywgeydjdXN0b21lcklkJzogZC5uZXdJZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuY3VzdG9tZXJzJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgY3JlYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDdXN0b21lckNyZWF0ZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdUb2FzdFNlcnZpY2UnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgQ3VzdG9tZXJDcmVhdGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEN1c3RvbWVyRGV0YWlsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBUb2FzdFNlcnZpY2UsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgRGlhbG9nU2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEN1c3RvbWVyKHNlbGYsICRzdGF0ZVBhcmFtcy5jdXN0b21lcklkKTtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVDdXN0b21lciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuY3VzdG9tZXIucHV0KCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgdXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAuY3VzdG9tZXJzXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlQ3VzdG9tZXIgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmN1c3RvbWVyLnJlbW92ZSgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBkZWxldGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLmN1c3RvbWVyc1wiKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIERlbGV0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2hvd0RlbGV0ZUNvbmZpcm0gPSBmdW5jdGlvbihldilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZXYsICdEZWxldGUgY3VzdG9tZXI/JywgJ1RoaXMgd2lsbCBhbHNvIGRlbGV0ZSBhbnkgd29yayBvcmRlcnMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgY3VzdG9tZXInKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlQ3VzdG9tZXIoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ3VzdG9tZXJEZXRhaWxDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJ0RpYWxvZ1NlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgQ3VzdG9tZXJEZXRhaWxDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEN1c3RvbWVyQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxDdXN0b21lcnMoc2VsZik7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDdXN0b21lckNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsIEN1c3RvbWVyQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBFdmVudENyZWF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLmV2ZW50ID0ge307XHJcblxyXG4gICAgICAgIHNlbGYuY3JlYXRlRXZlbnQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaXNWYWxpZCk7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYuZXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBlID0gc2VsZi5ldmVudDtcclxuXHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCRlcnJvcik7XHJcblxyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdldmVudCcpLnBvc3QoZSkudGhlbihmdW5jdGlvbihlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZXZlbnRzJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRXZlbnRDcmVhdGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgRXZlbnRDcmVhdGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEV2ZW50RGV0YWlsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcywgVG9hc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5zZWxlY3RlZFByb2R1Y3QgPSBcIlwiO1xyXG4gICAgICAgIHNlbGYuc2VsZWN0ZWRRdWFudGl0eSA9IDA7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJHN0YXRlUGFyYW1zKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRFdmVudChzZWxmLCAkc3RhdGVQYXJhbXMuZXZlbnRJZCk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUHJvZHVjdHMoc2VsZik7XHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlRXZlbnQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaXNWYWxpZCk7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL1Jlc3RTZXJ2aWNlLnVwZGF0ZVByb2R1Y3Qoc2VsZiwgc2VsZi5wcm9kdWN0LmlkKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuZXZlbnQucHV0KCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgdXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAuZXZlbnRzXCIpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5hZGRQcm9kdWN0ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5zZWxlY3RlZFByb2R1Y3QpO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5ldmVudC5ldmVudF9wcm9kdWN0cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGV2ZW50X2lkOiBzZWxmLmV2ZW50LmlkLFxyXG4gICAgICAgICAgICAgICAgcHJvZHVjdF9pZDogc2VsZi5zZWxlY3RlZFByb2R1Y3QuaWQsXHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eTogc2VsZi5zZWxlY3RlZFF1YW50aXR5LFxyXG4gICAgICAgICAgICAgICAgcHJvZHVjdDogc2VsZi5zZWxlY3RlZFByb2R1Y3RcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkUHJvZHVjdCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRRdWFudGl0eSA9IDA7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVQcm9kdWN0ID0gZnVuY3Rpb24oZSwgcHJvZHVjdElkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4VG9SZW1vdmU7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzZWxmLmV2ZW50LmV2ZW50X3Byb2R1Y3RzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihwcm9kdWN0SWQgPT0gc2VsZi5ldmVudC5ldmVudF9wcm9kdWN0c1tpXS5wcm9kdWN0X2lkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4VG9SZW1vdmUgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpbmRleFRvUmVtb3ZlKTtcclxuICAgICAgICAgICAgc2VsZi5ldmVudC5ldmVudF9wcm9kdWN0cy5zcGxpY2UoaW5kZXhUb1JlbW92ZSwgMSk7XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVFdmVudCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZXZlbnQucmVtb3ZlKCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGRlbGV0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRlZWx0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAuZXZlbnRzXCIpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgRGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zaG93RGVsZXRlQ29uZmlybSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZyA9IERpYWxvZ1NlcnZpY2UuY29uZmlybShldiwgJ0RlbGV0ZSBldmVudD8nLCAnJyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZUV2ZW50KCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0V2ZW50RGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsICdUb2FzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsIEV2ZW50RGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBFdmVudENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsRXZlbnRzKHNlbGYpO1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFdmVudENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsIEV2ZW50Q29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBGb290ZXJDb250cm9sbGVyKCRtb21lbnQpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYuY3VycmVudFllYXIgPSAkbW9tZW50KCkuZm9ybWF0KCdZWVlZJyk7XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0Zvb3RlckNvbnRyb2xsZXInLCBbJyRtb21lbnQnLCBGb290ZXJDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEhlYWRlckNvbnRyb2xsZXIoJGF1dGgsICRtb21lbnQpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLnRvZGF5c0RhdGUgPSAkbW9tZW50KCkuZm9ybWF0KCdkZGRkLCBNTU1NIERvIFlZWVknKTtcclxuXHJcbiAgICAgICAgc2VsZi5pc0F1dGhlbnRpY2F0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRhdXRoLmlzQXV0aGVudGljYXRlZCgpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hlYWRlckNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRtb21lbnQnLCBIZWFkZXJDb250cm9sbGVyXSk7XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gTGFuZGluZ0NvbnRyb2xsZXIoJHN0YXRlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTGFuZGluZ0NvbnRyb2xsZXInLCBbJyRzdGF0ZScsIExhbmRpbmdDb250cm9sbGVyXSk7XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gTG9naW5Db250cm9sbGVyKCRzdGF0ZSwgJHNjb3BlLCAkY29va2llcywgRGlhbG9nU2VydmljZSwgQXV0aFNlcnZpY2UsIEZvY3VzU2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5lbWFpbCA9ICcnO1xyXG4gICAgICAgIHNlbGYucGFzc3dvcmQgPSAnJztcclxuXHJcbiAgICAgICAgaWYoJGNvb2tpZXMuZ2V0KCdsb2dpbk5hbWUnKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZW1haWwgPSAkY29va2llcy5nZXQoJ2xvZ2luTmFtZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGRpYWxvZ09wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpYWxvZ3MvZGxnTG9naW4uaHRtbCcsXHJcbiAgICAgICAgICAgIGVzY2FwZVRvQ2xvc2U6IGZhbHNlLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiBEaWFsb2dDb250cm9sbGVyKCRzY29wZSwgJG1kRGlhbG9nKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY29uZmlybURpYWxvZyA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLmVtYWlsKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihzZWxmLmVtYWlsICE9PSAnJyAmJiBzZWxmLnBhc3N3b3JkICE9PSAnJylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEF1dGhTZXJ2aWNlLmxvZ2luKHNlbGYuZW1haWwsIHNlbGYucGFzc3dvcmQpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTG9naW4gc3VjY2VzcycpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b2RheSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3ZhciBjb29raWVFeHBpcnkgPSBuZXcgRGF0ZSh0b2RheS5nZXRZZWFyKCkgKyAxLCB0b2RheS5nZXRNb250aCgpLCB0b2RheS5nZXREYXkoKSwgMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29va2llRXhwaXJ5ID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvb2tpZUV4cGlyeS5zZXRGdWxsWWVhcihjb29raWVFeHBpcnkuZ2V0RnVsbFllYXIoKSArIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjb29raWVzLnB1dCgnbG9naW5OYW1lJywgc2VsZi5lbWFpbCwgeyBleHBpcmVzOiBjb29raWVFeHBpcnkgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRtZERpYWxvZy5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5wcm9kdWN0cycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdFcnJvciBsb2dnaW5nIGluJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNjb3BlOiAkc2NvcGUuJG5ldygpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgRGlhbG9nU2VydmljZS5mcm9tQ3VzdG9tKGRpYWxvZ09wdGlvbnMpO1xyXG5cclxuICAgICAgICBGb2N1c1NlcnZpY2UoJ2ZvY3VzTWUnKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0xvZ2luQ29udHJvbGxlcicsIFsnJHN0YXRlJywgJyRzY29wZScsICckY29va2llcycsICdEaWFsb2dTZXJ2aWNlJywgJ0F1dGhTZXJ2aWNlJywgJ0ZvY3VzU2VydmljZScsIExvZ2luQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBNYXRlcmlhbENyZWF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgVG9hc3RTZXJ2aWNlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsIFZhbGlkYXRpb25TZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxVbml0cyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRNYXRlcmlhbEFsbFR5cGVzKHNlbGYpO1xyXG5cclxuICAgICAgICBzZWxmLmRlY2ltYWxSZWdleCA9IFZhbGlkYXRpb25TZXJ2aWNlLmRlY2ltYWxSZWdleCgpO1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZU1hdGVyaWFsID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlzVmFsaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLm1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbSA9IHNlbGYubWF0ZXJpYWw7XHJcblxyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdtYXRlcmlhbCcpLnBvc3QobSkudGhlbihmdW5jdGlvbihkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vJHN0YXRlLmdvKCdhcHAuY3VzdG9tZXJzLmRldGFpbCcsIHsnY3VzdG9tZXJJZCc6IGQubmV3SWR9KTtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBjcmVhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLm1hdGVyaWFscycpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGNyZWF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ01hdGVyaWFsQ3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICdWYWxpZGF0aW9uU2VydmljZScsICckc3RhdGVQYXJhbXMnLCBNYXRlcmlhbENyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gTWF0ZXJpYWxEZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCBWYWxpZGF0aW9uU2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsVW5pdHMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0TWF0ZXJpYWxBbGxUeXBlcyhzZWxmKTtcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldE1hdGVyaWFsKHNlbGYsICRzdGF0ZVBhcmFtcy5tYXRlcmlhbElkKTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWNpbWFsUmVnZXggPSBWYWxpZGF0aW9uU2VydmljZS5kZWNpbWFsUmVnZXgoKTtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVNYXRlcmlhbCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYubWF0ZXJpYWwucHV0KCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgdXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAubWF0ZXJpYWxzXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlTWF0ZXJpYWwgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLm1hdGVyaWFsLnJlbW92ZSgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBkZWxldGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLm1hdGVyaWFsc1wiKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIERlbGV0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNob3dEZWxldGVDb25maXJtID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGV2LCAnRGVsZXRlIG1hdGVyaWFsPycsICdUaGlzIHdpbGwgYWxzbyByZW1vdmUgdGhlIG1hdGVyaWFsIGZyb20gYW55IHByb2R1Y3RzIHVzaW5nIGl0Jyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZU1hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ01hdGVyaWFsRGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgJ1ZhbGlkYXRpb25TZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIE1hdGVyaWFsRGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBNYXRlcmlhbENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsTWF0ZXJpYWxzKHNlbGYpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTWF0ZXJpYWxDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCBNYXRlcmlhbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUGF5bWVudFR5cGVDcmVhdGVDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZVBheW1lbnRUeXBlID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlzVmFsaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLnBheW1lbnR0eXBlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHNlbGYucGF5bWVudHR5cGU7XHJcblxyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdwYXltZW50dHlwZScpLnBvc3QoYykudGhlbihmdW5jdGlvbihkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucGF5bWVudHR5cGVzJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgY3JlYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQYXltZW50VHlwZUNyZWF0ZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdUb2FzdFNlcnZpY2UnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgUGF5bWVudFR5cGVDcmVhdGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFBheW1lbnRUeXBlRGV0YWlsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBUb2FzdFNlcnZpY2UsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgRGlhbG9nU2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldFBheW1lbnRUeXBlKHNlbGYsICRzdGF0ZVBhcmFtcy5wYXltZW50VHlwZUlkKTtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVQYXltZW50VHlwZSA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucGF5bWVudHR5cGUucHV0KCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgdXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAucGF5bWVudHR5cGVzXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVBheW1lbnRUeXBlID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5wYXltZW50dHlwZS5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5wYXltZW50dHlwZXNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBEZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNob3dEZWxldGVDb25maXJtID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGV2LCAnRGVsZXRlIHBheW1lbnQgdHlwZT8nLCAnJyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZVBheW1lbnRUeXBlKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1BheW1lbnRUeXBlRGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIFBheW1lbnRUeXBlRGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBQYXltZW50VHlwZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUGF5bWVudFR5cGVzKHNlbGYpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUGF5bWVudFR5cGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCBQYXltZW50VHlwZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUHJvZHVjdENyZWF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFRvYXN0U2VydmljZSwgUmVzdFNlcnZpY2UsIFZhbGlkYXRpb25TZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsTWF0ZXJpYWxzKHNlbGYpO1xyXG5cclxuICAgICAgICBzZWxmLmRlY2ltYWxSZWdleCA9IFZhbGlkYXRpb25TZXJ2aWNlLmRlY2ltYWxSZWdleCgpO1xyXG4gICAgICAgIHNlbGYubnVtZXJpY1JlZ2V4ID0gVmFsaWRhdGlvblNlcnZpY2UubnVtZXJpY1JlZ2V4KCk7XHJcblxyXG4gICAgICAgIHNlbGYucHJvZHVjdCA9IHt9O1xyXG4gICAgICAgIHNlbGYucHJvZHVjdC5taW5pbXVtX3N0b2NrID0gMDtcclxuICAgICAgICBzZWxmLnByb2R1Y3QuY3VycmVudF9zdG9jayA9IDA7XHJcblxyXG4gICAgICAgIHNlbGYuY3JlYXRlUHJvZHVjdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYucHJvZHVjdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHAgPSBzZWxmLnByb2R1Y3Q7XHJcblxyXG4gICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJGVycm9yKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdwcm9kdWN0JykucG9zdChwKS50aGVuKGZ1bmN0aW9uKGQpXHJcbiAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8kc3RhdGUuZ28oJ2FwcC5wcm9kdWN0cy5kZXRhaWwnLCB7J3Byb2R1Y3RJZCc6IGQubmV3SWR9KTtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBjcmVhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLnByb2R1Y3RzJyk7XHJcbiAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGNyZWF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYWRkTWF0ZXJpYWwgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnNlbGVjdGVkTWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICAgICAgaWYoc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzID09PSB1bmRlZmluZWQpIHsgc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzID0gW107IH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsX2lkOiBzZWxmLnNlbGVjdGVkTWF0ZXJpYWwuaWQsXHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eTogc2VsZi5zZWxlY3RlZFF1YW50aXR5LFxyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWw6IHNlbGYuc2VsZWN0ZWRNYXRlcmlhbFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYucHJvZHVjdC5jb3N0ID09PSB1bmRlZmluZWQgfHwgc2VsZi5wcm9kdWN0LmNvc3QgPT09IG51bGwpIHsgc2VsZi5wcm9kdWN0LmNvc3QgPSAwOyB9XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50Q29zdCA9IHBhcnNlRmxvYXQoc2VsZi5wcm9kdWN0LmNvc3QpO1xyXG4gICAgICAgICAgICB2YXIgYnRlc3QgPSAocGFyc2VGbG9hdChzZWxmLnNlbGVjdGVkTWF0ZXJpYWwudW5pdF9jb3N0KSAqIHBhcnNlSW50KHNlbGYuc2VsZWN0ZWRRdWFudGl0eSkpO1xyXG4gICAgICAgICAgICBjdXJyZW50Q29zdCArPSBidGVzdDtcclxuICAgICAgICAgICAgc2VsZi5wcm9kdWN0LmNvc3QgPSBjdXJyZW50Q29zdDtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRNYXRlcmlhbCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRRdWFudGl0eSA9IDA7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnByb2R1Y3QpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlTWF0ZXJpYWwgPSBmdW5jdGlvbihlLCBtYXRlcmlhbElkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4VG9SZW1vdmU7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKG1hdGVyaWFsSWQgPT0gc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzW2ldLm1hdGVyaWFsX2lkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4VG9SZW1vdmUgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpbmRleFRvUmVtb3ZlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50Q29zdCA9IHBhcnNlRmxvYXQoc2VsZi5wcm9kdWN0LmNvc3QpO1xyXG4gICAgICAgICAgICB2YXIgYnRlc3QgPSAocGFyc2VGbG9hdChzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHNbaW5kZXhUb1JlbW92ZV0ubWF0ZXJpYWwudW5pdF9jb3N0KSAqIHBhcnNlSW50KHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFsc1tpbmRleFRvUmVtb3ZlXS5xdWFudGl0eSkpO1xyXG4gICAgICAgICAgICBjdXJyZW50Q29zdCAtPSBidGVzdDtcclxuICAgICAgICAgICAgc2VsZi5wcm9kdWN0LmNvc3QgPSBjdXJyZW50Q29zdDtcclxuXHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscy5zcGxpY2UoaW5kZXhUb1JlbW92ZSwgMSk7XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1Byb2R1Y3RDcmVhdGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3RTZXJ2aWNlJywgJ1ZhbGlkYXRpb25TZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIFByb2R1Y3RDcmVhdGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFByb2R1Y3REZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgJHN0YXRlUGFyYW1zLCBUb2FzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UsIFZhbGlkYXRpb25TZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbE1hdGVyaWFscyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRQcm9kdWN0KHNlbGYsICRzdGF0ZVBhcmFtcy5wcm9kdWN0SWQpO1xyXG5cclxuICAgICAgICBzZWxmLmRlY2ltYWxSZWdleCA9IFZhbGlkYXRpb25TZXJ2aWNlLmRlY2ltYWxSZWdleCgpO1xyXG4gICAgICAgIHNlbGYubnVtZXJpY1JlZ2V4ID0gVmFsaWRhdGlvblNlcnZpY2UubnVtZXJpY1JlZ2V4KCk7XHJcblxyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZVByb2R1Y3QgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaXNWYWxpZCk7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL1Jlc3RTZXJ2aWNlLnVwZGF0ZVByb2R1Y3Qoc2VsZiwgc2VsZi5wcm9kdWN0LmlkKTtcclxuICAgICAgICAgICAgICAgIHNlbGYucHJvZHVjdC5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwidXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5wcm9kdWN0c1wiKTtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlUHJvZHVjdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWVsdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5wcm9kdWN0c1wiKTtcclxuXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBkZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2hvd0RlbGV0ZUNvbmZpcm0gPSBmdW5jdGlvbihldilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZXYsICdEZWxldGUgcHJvZHVjdD8nLCAnVGhpcyB3aWxsIGFsc28gZGVsZXRlIGFueSB3b3JrIG9yZGVyIG9yIGV2ZW50IHN0b2NrIGxldmVscyBhc3NvY2lhdGVkIHdpdGggdGhpcyBwcm9kdWN0Jyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5kZWxldGVQcm9kdWN0KCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFkZE1hdGVyaWFsID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5zZWxlY3RlZE1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscyA9PT0gdW5kZWZpbmVkKSB7IHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscyA9IFtdOyB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBzZWxmLnByb2R1Y3QuaWQsXHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbF9pZDogc2VsZi5zZWxlY3RlZE1hdGVyaWFsLmlkLFxyXG4gICAgICAgICAgICAgICAgcXVhbnRpdHk6IHNlbGYuc2VsZWN0ZWRRdWFudGl0eSxcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsOiBzZWxmLnNlbGVjdGVkTWF0ZXJpYWxcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY3VycmVudENvc3QgPSBwYXJzZUZsb2F0KHNlbGYucHJvZHVjdC5jb3N0KTtcclxuICAgICAgICAgICAgdmFyIGJ0ZXN0ID0gKHBhcnNlRmxvYXQoc2VsZi5zZWxlY3RlZE1hdGVyaWFsLnVuaXRfY29zdCkgKiBwYXJzZUludChzZWxmLnNlbGVjdGVkUXVhbnRpdHkpKTtcclxuICAgICAgICAgICAgY3VycmVudENvc3QgKz0gYnRlc3Q7XHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5jb3N0ID0gY3VycmVudENvc3Q7XHJcblxyXG5cclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZE1hdGVyaWFsID0gXCJcIjtcclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFF1YW50aXR5ID0gMDtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVNYXRlcmlhbCA9IGZ1bmN0aW9uKGUsIG1hdGVyaWFsSWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXhUb1JlbW92ZTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYobWF0ZXJpYWxJZCA9PSBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHNbaV0ubWF0ZXJpYWxfaWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhUb1JlbW92ZSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGluZGV4VG9SZW1vdmUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRDb3N0ID0gcGFyc2VGbG9hdChzZWxmLnByb2R1Y3QuY29zdCk7XHJcbiAgICAgICAgICAgIHZhciBidGVzdCA9IChwYXJzZUZsb2F0KHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFsc1tpbmRleFRvUmVtb3ZlXS5tYXRlcmlhbC51bml0X2Nvc3QpICogcGFyc2VJbnQoc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzW2luZGV4VG9SZW1vdmVdLnF1YW50aXR5KSk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDb3N0IC09IGJ0ZXN0O1xyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QuY29zdCA9IGN1cnJlbnRDb3N0O1xyXG5cclxuXHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscy5zcGxpY2UoaW5kZXhUb1JlbW92ZSwgMSk7XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUHJvZHVjdERldGFpbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCAnVG9hc3RTZXJ2aWNlJywgJ0RpYWxvZ1NlcnZpY2UnLCAnVmFsaWRhdGlvblNlcnZpY2UnLCBQcm9kdWN0RGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBQcm9kdWN0Q29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYuZmlsdGVyVHlwZSA9IFwiXCI7XHJcbiAgICAgICAgc2VsZi5maWx0ZXJPcGVyYXRvciA9IFwiXCI7XHJcbiAgICAgICAgc2VsZi5maWx0ZXJWYWx1ZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFByb2R1Y3RzKHNlbGYpO1xyXG5cclxuICAgICAgICBzZWxmLmFwcGx5UHJvZHVjdEZpbHRlciA9IGZ1bmN0aW9uKHApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZihzZWxmLmZpbHRlclR5cGUgIT09IFwiXCIgJiYgc2VsZi5maWx0ZXJPcGVyYXRvciAhPT0gXCJcIiAmJiBzZWxmLmZpbHRlclZhbHVlICE9PSBcIlwiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImhpXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5VG9GaWx0ZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoKHNlbGYuZmlsdGVyVHlwZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwic3RvY2tcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlUb0ZpbHRlciA9IHBhcnNlSW50KHAuY3VycmVudF9zdG9jayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwcmljZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVRvRmlsdGVyID0gcGFyc2VGbG9hdChwLnByaWNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImNvc3RcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlUb0ZpbHRlciA9IHBhcnNlRmxvYXQocC5jb3N0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5maWx0ZXJPcGVyYXRvciA9PT0gXCI9XCIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VG9GaWx0ZXIgPT0gcGFyc2VGbG9hdChzZWxmLmZpbHRlclZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYoc2VsZi5maWx0ZXJPcGVyYXRvciA9PT0gXCI+XCIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VG9GaWx0ZXIgPiBwYXJzZUZsb2F0KHNlbGYuZmlsdGVyVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihzZWxmLmZpbHRlck9wZXJhdG9yID09PSBcIj49XCIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VG9GaWx0ZXIgPj0gc2VsZi5maWx0ZXJWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYoc2VsZi5maWx0ZXJPcGVyYXRvciA9PT0gXCI8XCIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VG9GaWx0ZXIgPCBwYXJzZUZsb2F0KHNlbGYuZmlsdGVyVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihzZWxmLmZpbHRlck9wZXJhdG9yID09PSBcIjw9XCIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VG9GaWx0ZXIgPD0gcGFyc2VGbG9hdChzZWxmLmZpbHRlclZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUHJvZHVjdENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsIFByb2R1Y3RDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFB1cmNoYXNlT3JkZXJDcmVhdGVDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsICRzY29wZSwgJG1vbWVudCwgUmVzdGFuZ3VsYXIsIFRvYXN0U2VydmljZSwgUmVzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbEN1c3RvbWVycyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQYXltZW50VHlwZXMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0RnVsbHlCb29rZWREYXlzKHNlbGYpO1xyXG5cclxuICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIgPSB7fTtcclxuICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIuYW1vdW50X3BhaWQgPSAwO1xyXG4gICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5kaXNjb3VudCA9IDA7XHJcbiAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID0gMDtcclxuXHJcbiAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLmRlbGl2ZXJ5ID0gMDtcclxuICAgICAgICBzZWxmLmRlbGl2ZXJ5X2NoYXJnZSA9IDA7XHJcblxyXG4gICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5zaGlwcGluZyA9IDA7XHJcbiAgICAgICAgc2VsZi5zaGlwcGluZ19jaGFyZ2UgPSAwO1xyXG5cclxuXHJcbiAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnN1cHByZXNzd29ya29yZGVyID0gMDtcclxuXHJcbiAgICAgICAgdmFyIG9yaWdpbmFsVG90YWwgPSAwO1xyXG4gICAgICAgIHZhciBvcmlnaW5hbFNoaXBwaW5nQ2hhcmdlID0gMDtcclxuXHJcbiAgICAgICAgc2VsZi5vbmx5T3BlbkRheXMgPSBmdW5jdGlvbihkYXRlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBpZighJG1vbWVudChkYXRlKS5pc0JlZm9yZSgpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGUpO1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYuYm9va2VkRGF5cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYuYm9va2VkRGF5c1tpXS5zdGFydF9kYXRlKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYuYm9va2VkRGF5c1tpXS5zdGFydF9kYXRlKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCRtb21lbnQoc2VsZi5ib29rZWREYXlzW2ldLnN0YXJ0X2RhdGUpKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihtb21lbnQoZGF0ZSkuaXNTYW1lKHNlbGYuYm9va2VkRGF5c1tpXS5zdGFydF9kYXRlKSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5jcmVhdGVQdXJjaGFzZU9yZGVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5wdXJjaGFzZW9yZGVyKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwID0gc2VsZi5wdXJjaGFzZW9yZGVyO1xyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygkZXJyb3IpO1xyXG5cclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdwdXJjaGFzZW9yZGVyJykucG9zdChwKS50aGVuKGZ1bmN0aW9uKGQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgICAgICAvLyRzdGF0ZS5nbygnYXBwLnByb2R1Y3RzLmRldGFpbCcsIHsncHJvZHVjdElkJzogZC5uZXdJZH0pO1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLnB1cmNoYXNlb3JkZXJzJyk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBjcmVhdGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5hcHBseURpc2NvdW50ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoc2VsZi5wdXJjaGFzZW9yZGVyLmRpc2NvdW50ID09IG51bGwgfHwgc2VsZi5wdXJjaGFzZW9yZGVyLmRpc2NvdW50ID09IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9IG9yaWdpbmFsVG90YWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICYmIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCAhPT0gbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgICYmIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA+IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpc2NvdW50ZWQgPSBvcmlnaW5hbFRvdGFsIC0gc2VsZi5wdXJjaGFzZW9yZGVyLmRpc2NvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc2NvdW50ZWQgPj0gMCA/IHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9IGRpc2NvdW50ZWQgOiAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5hcHBseURlbGl2ZXJ5ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoc2VsZi5kZWxpdmVyeV9jaGFyZ2UgPT09IDEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5kZWxpdmVyeSA9IGRlbGl2ZXJ5RmVlO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsICs9IGRlbGl2ZXJ5RmVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLmRlbGl2ZXJ5ID0gMDtcclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCAtPSBkZWxpdmVyeUZlZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYXBwbHlTaGlwcGluZyA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBjb3N0T2ZTaGlwcGluZyA9IDA7XHJcbiAgICAgICAgICAgIGlmKHNlbGYuc2hpcHBpbmdfY2hhcmdlID09PSAnQ0ROJylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29zdE9mU2hpcHBpbmcgPSBzaGlwcGluZ0NhbmFkYTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKHNlbGYuc2hpcHBpbmdfY2hhcmdlID09PSAnVVNBJylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29zdE9mU2hpcHBpbmcgPSBzaGlwcGluZ1VzYTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnNoaXBwaW5nID0gY29zdE9mU2hpcHBpbmc7XHJcblxyXG4gICAgICAgICAgICBpZihzZWxmLnNoaXBwaW5nX2NoYXJnZSAhPT0gb3JpZ2luYWxTaGlwcGluZ0NoYXJnZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsIC09IG9yaWdpbmFsU2hpcHBpbmdDaGFyZ2U7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgKz0gY29zdE9mU2hpcHBpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG9yaWdpbmFsU2hpcHBpbmdDaGFyZ2UgPSBjb3N0T2ZTaGlwcGluZztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNlbGYuYWRkUHJvZHVjdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc2VsZWN0ZWRQcm9kdWN0KTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cyA9PT0gdW5kZWZpbmVkKSB7IHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cyA9IFtdOyB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBzZWxmLnNlbGVjdGVkUHJvZHVjdC5pZCxcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiBzZWxmLnNlbGVjdGVkUXVhbnRpdHksXHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0OiBzZWxmLnNlbGVjdGVkUHJvZHVjdFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9PT0gdW5kZWZpbmVkIHx8IHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9PT0gbnVsbCkgeyBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSAwOyB9XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50Q29zdCA9IHBhcnNlRmxvYXQoc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsKTtcclxuICAgICAgICAgICAgdmFyIGJ0ZXN0ID0gKHBhcnNlRmxvYXQoc2VsZi5zZWxlY3RlZFByb2R1Y3QucHJpY2UpICogcGFyc2VJbnQoc2VsZi5zZWxlY3RlZFF1YW50aXR5KSk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDb3N0ICs9IGJ0ZXN0O1xyXG4gICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBjdXJyZW50Q29zdDtcclxuICAgICAgICAgICAgb3JpZ2luYWxUb3RhbCA9IGN1cnJlbnRDb3N0O1xyXG5cclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFByb2R1Y3QgPSBcIlwiO1xyXG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkUXVhbnRpdHkgPSAwO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5wdXJjaGFzZW9yZGVyKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVByb2R1Y3QgPSBmdW5jdGlvbihlLCBwcm9kdWN0SWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXhUb1JlbW92ZTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYocHJvZHVjdElkID09IHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0c1tpXS5wcm9kdWN0X2lkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4VG9SZW1vdmUgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpbmRleFRvUmVtb3ZlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50Q29zdCA9IHBhcnNlRmxvYXQoc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsKTtcclxuICAgICAgICAgICAgdmFyIGJ0ZXN0ID0gKHBhcnNlRmxvYXQoc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzW2luZGV4VG9SZW1vdmVdLnByb2R1Y3QucHJpY2UpICogcGFyc2VJbnQoc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzW2luZGV4VG9SZW1vdmVdLnF1YW50aXR5KSk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDb3N0IC09IGJ0ZXN0O1xyXG4gICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBjdXJyZW50Q29zdDtcclxuICAgICAgICAgICAgb3JpZ2luYWxUb3RhbCA9IGN1cnJlbnRDb3N0O1xyXG5cclxuICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzLnNwbGljZShpbmRleFRvUmVtb3ZlLCAxKTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRldGVybWluZVdvcmtPcmRlcnMgPSBmdW5jdGlvbihlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci5zdXBwcmVzc3dvcmtvcmRlciA9PSAxKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEp1c3QgcHJvY2VzcyB0aGUgUE8gYXMgbm9ybWFsXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jcmVhdGVQdXJjaGFzZU9yZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9kdWN0c1RvRnVsZmlsbCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2R1Y3RzVG9GdWxmaWxsLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdF9pZDogc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzW2ldLnByb2R1Y3RfaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzW2ldLnF1YW50aXR5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdzY2hlZHVsZXIvZ2V0V29ya09yZGVycycpLnBvc3Qoe3Byb2R1Y3RzVG9GdWxmaWxsOiBwcm9kdWN0c1RvRnVsZmlsbH0pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YS53b3JrT3JkZXJzVG9DcmVhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS53b3JrT3JkZXJzVG9DcmVhdGUgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGVyZSBhcmUgd29ya29yZGVycyBuZWVkZWQgZm9yIHRoaXMgUE8sIGNvbmZpcm0gdGhlaXIgY3JlYXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS53b3JrT3JkZXJzVG9DcmVhdGUgPSBkYXRhLndvcmtPcmRlcnNUb0NyZWF0ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS53b3JrT3JkZXJzID0gZGF0YS53b3JrT3JkZXJzO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKGUsICdkbGdDb25maXJtV29ya09yZGVycycsICRzY29wZSkudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci53b3JrX29yZGVycyA9ICRzY29wZS53b3JrT3JkZXJzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdjb25maXJtZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jcmVhdGVQdXJjaGFzZU9yZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2NhbmNlbGxlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBKdXN0IHByb2Nlc3MgdGhlIFBPIGFzIG5vcm1hbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jcmVhdGVQdXJjaGFzZU9yZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQdXJjaGFzZU9yZGVyQ3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJyRzY29wZScsICckbW9tZW50JywgJ1Jlc3Rhbmd1bGFyJywgJ1RvYXN0U2VydmljZScsICdSZXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIFB1cmNoYXNlT3JkZXJDcmVhdGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFB1cmNoYXNlT3JkZXJEZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsICRzY29wZSwgJG1vbWVudCwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMsIFRvYXN0U2VydmljZSwgRGlhbG9nU2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJHN0YXRlUGFyYW1zKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxDdXN0b21lcnMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUHJvZHVjdHMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUGF5bWVudFR5cGVzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldFB1cmNoYXNlT3JkZXIoc2VsZiwgJHN0YXRlUGFyYW1zLnB1cmNoYXNlT3JkZXJJZCk7XHJcblxyXG4gICAgICAgIHZhciBvcmlnaW5hbFRvdGFsID0gMDtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVQdXJjaGFzZU9yZGVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnB1dCgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwidXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IHVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAucHVyY2hhc2VvcmRlcnNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlUHVyY2hhc2VPcmRlciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWVsdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5wdXJjaGFzZW9yZGVyc1wiKTtcclxuXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBkZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2hvd0RlbGV0ZUNvbmZpcm0gPSBmdW5jdGlvbihldilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZXYsICdEZWxldGUgcHVyY2hhc2Ugb3JkZXI/JywgJycpO1xyXG4gICAgICAgICAgICBkaWFsb2cudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlUHVyY2hhc2VPcmRlcigpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5hcHBseURpc2NvdW50ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoc2VsZi5wdXJjaGFzZW9yZGVyLmRpc2NvdW50ID09IG51bGwgfHwgc2VsZi5wdXJjaGFzZW9yZGVyLmRpc2NvdW50ID09IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9IG9yaWdpbmFsVG90YWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICYmIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCAhPT0gbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgICYmIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA+IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpc2NvdW50ZWQgPSBvcmlnaW5hbFRvdGFsIC0gc2VsZi5wdXJjaGFzZW9yZGVyLmRpc2NvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc2NvdW50ZWQgPj0gMCA/IHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9IGRpc2NvdW50ZWQgOiAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5hZGRQcm9kdWN0ID0gZnVuY3Rpb24oZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc2VsZWN0ZWRQcm9kdWN0KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwb3BPYmogPSB7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBzZWxmLnNlbGVjdGVkUHJvZHVjdC5pZCxcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiBzZWxmLnNlbGVjdGVkUXVhbnRpdHksXHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0OiBzZWxmLnNlbGVjdGVkUHJvZHVjdFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdzY2hlZHVsZXIvZ2V0V29ya09yZGVycycpLnBvc3Qoe3Byb2R1Y3RzVG9GdWxmaWxsOiBbcG9wT2JqXSwgcHVyY2hhc2VPcmRlcklkOiBzZWxmLnB1cmNoYXNlb3JkZXIuaWR9KS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEud29ya09yZGVyc1RvQ3JlYXRlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMgPT09IHVuZGVmaW5lZCkgeyBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMgPSBbXTsgfVxyXG4gICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzLnB1c2gocG9wT2JqKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBSZWNhbGN1bGF0ZSBQTyB0b3RhbFxyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID09PSB1bmRlZmluZWQgfHwgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID09PSBudWxsKSB7IHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9IDA7IH1cclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50Q29zdCA9IHBhcnNlRmxvYXQoc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsKTtcclxuICAgICAgICAgICAgICAgIHZhciBidGVzdCA9IChwYXJzZUZsb2F0KHNlbGYuc2VsZWN0ZWRQcm9kdWN0LnByaWNlKSAqIHBhcnNlSW50KHNlbGYuc2VsZWN0ZWRRdWFudGl0eSkpO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudENvc3QgKz0gYnRlc3Q7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBjdXJyZW50Q29zdDtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsVG90YWwgPSBjdXJyZW50Q29zdDtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkUHJvZHVjdCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkUXVhbnRpdHkgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGRhdGEud29ya09yZGVyc1RvQ3JlYXRlID4gMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBUaGVyZSBhcmUgd29ya29yZGVycyBuZWVkZWQgZm9yIHRoaXMgUE8sIGFsZXJ0IG9mIHRoZWlyIGNyZWF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLndvcmtPcmRlcnNUb0NyZWF0ZSA9IGRhdGEud29ya09yZGVyc1RvQ3JlYXRlO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS53b3JrT3JkZXJzID0gZGF0YS53b3JrT3JkZXJzO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZShlLCAnZGxnQWxlcnRXb3JrT3JkZXJzJywgJHNjb3BlKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjb25maXJtZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBhZGRpbmcgcHJvZHVjdCwgcGxlYXNlIHRyeSBhZ2FpblwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVQcm9kdWN0ID0gZnVuY3Rpb24oZSwgcHJvZHVjdElkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4VG9SZW1vdmU7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHByb2R1Y3RJZCA9PSBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaV0ucHJvZHVjdF9pZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleFRvUmVtb3ZlID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpbmRleFRvUmVtb3ZlKTtcclxuXHJcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnc2NoZWR1bGVyL3Jlc3RvcmVTdG9ja0ZvclByb2R1Y3QnKS5wb3N0KHtwdXJjaGFzZV9vcmRlcl9pZDogc2VsZi5wdXJjaGFzZW9yZGVyLmlkLCBwcm9kdWN0X2lkOiBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaW5kZXhUb1JlbW92ZV0ucHJvZHVjdF9pZH0pLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gUmVjYWxjdWxhdGUgUE8gdG90YWxcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50Q29zdCA9IHBhcnNlRmxvYXQoc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsKTtcclxuICAgICAgICAgICAgICAgIHZhciBidGVzdCA9IChwYXJzZUZsb2F0KHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0c1tpbmRleFRvUmVtb3ZlXS5wcm9kdWN0LnByaWNlKSAqIHBhcnNlSW50KHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0c1tpbmRleFRvUmVtb3ZlXS5xdWFudGl0eSkpO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudENvc3QgLT0gYnRlc3Q7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBjdXJyZW50Q29zdDtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsVG90YWwgPSBjdXJyZW50Q29zdDtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMuc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xyXG5cclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIHVwZGF0aW5nIHN0b2NrLCBwbGVhc2UgdHJ5IGFnYWluXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQdXJjaGFzZU9yZGVyRGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJyRzY29wZScsICckbW9tZW50JywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsICdUb2FzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsIFB1cmNoYXNlT3JkZXJEZXRhaWxDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFB1cmNoYXNlT3JkZXJDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFB1cmNoYXNlT3JkZXJzKHNlbGYpO1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQdXJjaGFzZU9yZGVyQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgUHVyY2hhc2VPcmRlckNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUmVwb3J0Q29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsIENoYXJ0U2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYucmVwb3J0UGFyYW1zID0ge307XHJcblxyXG4gICAgICAgIGlmKCRzdGF0ZS5pcygnYXBwLnJlcG9ydHMuY3VycmVudHN0b2NrJykpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZW5lcmF0ZUN1cnJlbnRTdG9ja1JlcG9ydCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKCRzdGF0ZS5pcygnYXBwLnJlcG9ydHMuc2FsZXMnKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNob3dTYWxlc1JlcG9ydFZpZXcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZigkc3RhdGUuaXMoJ2FwcC5yZXBvcnRzLnNhbGVzYnltb250aCcpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2hvd1NhbGVzUmVwb3J0QnlNb250aFZpZXcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZigkc3RhdGUuaXMoJ2FwcC5yZXBvcnRzLmluY29tZWJ5bW9udGgnKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNob3dJbmNvbWVSZXBvcnRCeU1vbnRoVmlldygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBSZXBvcnQgaG9tZVxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZS5pcygnYXBwLnJlcG9ydHMnKSk7XHJcbiAgICAgICAgICAgIHNob3dEYXNoYm9hcmRXaWRnZXRzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZUN1cnJlbnRTdG9ja1JlcG9ydCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdlbmVyYXRlIHN0b2NrIHJlcnBvcnRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93U2FsZXNSZXBvcnRWaWV3KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbEN1c3RvbWVycyhzZWxmKTtcclxuICAgICAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUHJvZHVjdHMoc2VsZik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93RGFzaGJvYXJkV2lkZ2V0cygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDaGFydFNlcnZpY2UuZ2V0VG9wU2VsbGluZ1Byb2R1Y3RzKHNlbGYsICdUb3AgU2VsbGluZyBBbGwgVGltZScpO1xyXG4gICAgICAgICAgICBnZXRXb3JzdFNlbGxpbmdQcm9kdWN0cyhzZWxmKTtcclxuICAgICAgICAgICAgZ2V0T3ZlcmR1ZVB1cmNoYXNlT3JkZXJzKHNlbGYpO1xyXG4gICAgICAgICAgICBnZXRNb250aGx5SW5jb21lKHNlbGYpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2hvd1NhbGVzUmVwb3J0QnlNb250aFZpZXcoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ2hhcnRTZXJ2aWNlLmdldE1vbnRobHlTYWxlc1JlcG9ydChzZWxmKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNob3dJbmNvbWVSZXBvcnRCeU1vbnRoVmlldygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDaGFydFNlcnZpY2UuZ2V0TW9udGhseUluY29tZVJlcG9ydChzZWxmKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbGYuZ2V0U2FsZXNSZXBvcnQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnJlcG9ydFBhcmFtcyk7XHJcbiAgICAgICAgICAgIHNlbGYucG9Ub3RhbCA9IDA7XHJcbiAgICAgICAgICAgIHNlbGYucG9Db3VudCA9IDA7XHJcblxyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3JlcG9ydHMvZ2V0U2FsZXNSZXBvcnQnKS5wb3N0KHsgJ3JlcG9ydFBhcmFtcyc6IHNlbGYucmVwb3J0UGFyYW1zfSkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnJlc3VsdHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wb0NvdW50ID0gZGF0YS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLnJlc3VsdHNbMF0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIEVycm9yXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFdvcnN0U2VsbGluZ1Byb2R1Y3RzKHNjb3BlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdyZXBvcnRzL2dldFdvcnN0U2VsbGluZ1Byb2R1Y3RzJykuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLndvcnN0U2VsbGluZ1Byb2R1Y3RzID0gZGF0YTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldE92ZXJkdWVQdXJjaGFzZU9yZGVycyhzY29wZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncmVwb3J0cy9nZXRPdmVyZHVlUHVyY2hhc2VPcmRlcnMnKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYub3ZlcmR1ZVB1cmNoYXNlT3JkZXJzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIC8vc2VsZi5wb0NvdW50ID0gZGF0YS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gRXJyb3JcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRNb250aGx5SW5jb21lKHNjb3BlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdyZXBvcnRzL2dldE1vbnRobHlTYWxlc1JlcG9ydCcpLnBvc3QoeyAncmVwb3J0UGFyYW1zJzoge319KS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUubW9udGhseUluY29tZXMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNjb3BlLm1vbnRobHlJbmNvbWVzLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbCA9IHNjb3BlLm1vbnRobHlJbmNvbWVzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZShzY29wZS5tb250aGx5SW5jb21lc1tsLTFdLnllYXIsIHNjb3BlLm1vbnRobHlJbmNvbWVzW2wtMV0ubW9udGggLSAxLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY3VyTW9udGhseUluY29tZU1vbnRoID0gZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY3VyTW9udGhseUluY29tZVRvdGFsID0gc2NvcGUubW9udGhseUluY29tZXNbbC0xXS5tb250aHRvdGFsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXJNb250aGx5SW5jb21lUG9zID0gbCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VsZi5jaGFuZ2VNb250aGx5SW5jb21lID0gZnVuY3Rpb24oaW5jcmVtZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnTGVuOicgKyBzZWxmLm1vbnRobHlJbmNvbWVzLmxlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYuY3VyTW9udGhseUluY29tZVBvcyk7XHJcbiAgICAgICAgICAgIHNlbGYuY3VyTW9udGhseUluY29tZVBvcyArPSBpbmNyZW1lbnQ7XHJcblxyXG4gICAgICAgICAgICBpZigoc2VsZi5jdXJNb250aGx5SW5jb21lUG9zIDwgMCkpIHsgc2VsZi5jdXJNb250aGx5SW5jb21lUG9zID0gMDsgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKChzZWxmLmN1ck1vbnRobHlJbmNvbWVQb3MgKyAxKSA+IHNlbGYubW9udGhseUluY29tZXMubGVuZ3RoKSB7IHNlbGYuY3VyTW9udGhseUluY29tZVBvcyA9IHNlbGYubW9udGhseUluY29tZXMubGVuZ3RoIC0gMTsgfVxyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLmN1ck1vbnRobHlJbmNvbWVQb3MpO1xyXG5cclxuICAgICAgICAgICAgaWYoc2VsZi5jdXJNb250aGx5SW5jb21lUG9zID49IDAgJiYgKHNlbGYuY3VyTW9udGhseUluY29tZVBvcyArIDEpIDw9IHNlbGYubW9udGhseUluY29tZXMubGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKHNlbGYubW9udGhseUluY29tZXNbc2VsZi5jdXJNb250aGx5SW5jb21lUG9zXS55ZWFyLCBzZWxmLm1vbnRobHlJbmNvbWVzW3NlbGYuY3VyTW9udGhseUluY29tZVBvc10ubW9udGggLSAxLCAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLmN1ck1vbnRobHlJbmNvbWVNb250aCA9IGQ7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmN1ck1vbnRobHlJbmNvbWVUb3RhbCA9IHNlbGYubW9udGhseUluY29tZXNbc2VsZi5jdXJNb250aGx5SW5jb21lUG9zXS5tb250aHRvdGFsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2V0UG9Ub3RhbCA9IGZ1bmN0aW9uKGl0ZW0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKTtcclxuICAgICAgICAgICAgaWYoaXRlbSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wb1RvdGFsICs9IHBhcnNlRmxvYXQoaXRlbS50b3RhbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1JlcG9ydENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICdDaGFydFNlcnZpY2UnLCBSZXBvcnRDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFNlYXJjaENvbnRyb2xsZXIoJHNjb3BlLCAkYXV0aCwgUmVzdGFuZ3VsYXIsICRzdGF0ZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYubm9DYWNoZSA9IHRydWU7XHJcbiAgICAgICAgc2VsZi5zZWFyY2hUZXh0ID0gXCJcIjtcclxuICAgICAgICBzZWxmLnNlbGVjdGVkUmVzdWx0ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICBzZWxmLmRvU2VhcmNoID0gZnVuY3Rpb24ocXVlcnkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL1Jlc3RTZXJ2aWNlLmRvU2VhcmNoKHNlbGYsIHNlbGYuc2VhcmNoVGV4dCk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5vbmUoJ3NlYXJjaCcsIHF1ZXJ5KS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5maXJlVG9nZ2xlU2VhcmNoRXZlbnQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAvL3NlbGYuJHJvb3QuJGJyb2FkY2FzdChcInRvZ2dsZVNlYXJjaFwiLCB7dXNlcm5hbWU6ICRzY29wZS51c2VyLnVzZXJuYW1lIH0pO1xyXG4gICAgICAgICAgICAkc2NvcGUuJHJvb3QuJGJyb2FkY2FzdChcInRvZ2dsZVNlYXJjaFwiKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmdvdG9JdGVtID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5zZWxlY3RlZFJlc3VsdCk7XHJcbiAgICAgICAgICAgIGlmKHNlbGYuc2VsZWN0ZWRSZXN1bHQgIT09IG51bGwgJiYgc2VsZi5zZWxlY3RlZFJlc3VsdCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaFRleHQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5maXJlVG9nZ2xlU2VhcmNoRXZlbnQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2goc2VsZi5zZWxlY3RlZFJlc3VsdC5jb250ZW50X3R5cGUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInByb2R1Y3RcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucHJvZHVjdHMuZGV0YWlsJywgeydwcm9kdWN0SWQnOiBzZWxmLnNlbGVjdGVkUmVzdWx0LmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiY3VzdG9tZXJcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuY3VzdG9tZXJzLmRldGFpbCcsIHsnY3VzdG9tZXJJZCc6IHNlbGYuc2VsZWN0ZWRSZXN1bHQuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJldmVudFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ldmVudHMuZGV0YWlsJywgeydldmVudElkJzogc2VsZi5zZWxlY3RlZFJlc3VsdC5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIndvcmtvcmRlclwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC53b3Jrb3JkZXJzLmRldGFpbCcsIHsnd29ya09yZGVySWQnOiBzZWxmLnNlbGVjdGVkUmVzdWx0LmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwibWF0ZXJpYWxcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAubWF0ZXJpYWxzLmRldGFpbCcsIHsnbWF0ZXJpYWxJZCc6IHNlbGYuc2VsZWN0ZWRSZXN1bHQuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwdXJjaGFzZW9yZGVyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLnB1cmNoYXNlb3JkZXJzLmRldGFpbCcsIHsncHVyY2hhc2VPcmRlcklkJzogc2VsZi5zZWxlY3RlZFJlc3VsdC5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NlYXJjaENvbnRyb2xsZXInLCBbJyRzY29wZScsICckYXV0aCcsICdSZXN0YW5ndWxhcicsICckc3RhdGUnLCBTZWFyY2hDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFVuaXRDcmVhdGVDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZVVuaXQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaXNWYWxpZCk7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYudW5pdCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHNlbGYudW5pdDtcclxuXHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3VuaXQnKS5wb3N0KGMpLnRoZW4oZnVuY3Rpb24oZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyRzdGF0ZS5nbygnYXBwLmN1c3RvbWVycy5kZXRhaWwnLCB7J2N1c3RvbWVySWQnOiBkLm5ld0lkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC51bml0cycpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGNyZWF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVW5pdENyZWF0ZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdUb2FzdFNlcnZpY2UnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgVW5pdENyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gVW5pdERldGFpbENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgVG9hc3RTZXJ2aWNlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJHN0YXRlUGFyYW1zKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRVbml0KHNlbGYsICRzdGF0ZVBhcmFtcy51bml0SWQpO1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZVVuaXQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaXNWYWxpZCk7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnVuaXQucHV0KCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgdXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAudW5pdHNcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVVbml0ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi51bml0LnJlbW92ZSgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBkZWxldGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLnVuaXRzXCIpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgRGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zaG93RGVsZXRlQ29uZmlybSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZyA9IERpYWxvZ1NlcnZpY2UuY29uZmlybShldiwgJ0RlbGV0ZSB1bml0PycsICcnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlVW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdVbml0RGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIFVuaXREZXRhaWxDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFVuaXRDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFVuaXRzKHNlbGYpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVW5pdENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsIFVuaXRDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFdvcmtPcmRlckNyZWF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFRvYXN0U2VydmljZSwgJG1vbWVudCwgUmVzdFNlcnZpY2UsIFZhbGlkYXRpb25TZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxDdXN0b21lcnMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUHJvZHVjdHMoc2VsZik7XHJcblxyXG4gICAgICAgIHNlbGYubnVtZXJpY1JlZ2V4ID0gVmFsaWRhdGlvblNlcnZpY2UubnVtZXJpY1JlZ2V4KCk7XHJcblxyXG4gICAgICAgIHNlbGYuY3JlYXRlV29ya09yZGVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlzVmFsaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLndvcmtvcmRlcik7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHcgPSBzZWxmLndvcmtvcmRlcjtcclxuXHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3dvcmtvcmRlcicpLnBvc3QodykudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyRzdGF0ZS5nbygnYXBwLndvcmtvcmRlcnMuZGV0YWlsJywgeyd3b3JrT3JkZXJJZCc6IDF9KTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC53b3Jrb3JkZXJzJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdXb3JrT3JkZXJDcmVhdGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnVG9hc3RTZXJ2aWNlJywgJyRtb21lbnQnLCAnUmVzdFNlcnZpY2UnLCAnVmFsaWRhdGlvblNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgV29ya09yZGVyQ3JlYXRlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBXb3JrT3JkZXJEZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCBWYWxpZGF0aW9uU2VydmljZSwgJG1vbWVudCwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldFdvcmtPcmRlcihzZWxmLCAkc3RhdGVQYXJhbXMud29ya09yZGVySWQpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbEN1c3RvbWVycyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi5udW1lcmljUmVnZXggPSBWYWxpZGF0aW9uU2VydmljZS5udW1lcmljUmVnZXgoKTtcclxuXHJcbiAgICAgICAgc2VsZi50b2dnbGVDb21wbGV0ZSA9IGZ1bmN0aW9uKGNiU3RhdGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjYlN0YXRlKTtcclxuICAgICAgICAgICAgLy9pZihjYlN0YXRlKSB7IHNlbGYud29ya29yZGVyLmNvbXBsZXRlZCA9IDE7IH1cclxuICAgICAgICAgICAgLy9lbHNlIHsgc2VsZi53b3Jrb3JkZXIuY29tcGxldGVkID0gMDsgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlV29ya09yZGVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlzVmFsaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi53b3Jrb3JkZXIucHV0KCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgdXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAud29ya29yZGVyc1wiKTtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVdvcmtPcmRlciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYud29ya29yZGVyLnJlbW92ZSgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBkZWxldGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLndvcmtvcmRlcnNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBkZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zaG93RGVsZXRlQ29uZmlybSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZyA9IERpYWxvZ1NlcnZpY2UuY29uZmlybShldiwgJ0RlbGV0ZSB3b3JrIG9yZGVyPycsICcnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlV29ya09yZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1dvcmtPcmRlckRldGFpbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdUb2FzdFNlcnZpY2UnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsICdWYWxpZGF0aW9uU2VydmljZScsICckbW9tZW50JywgJyRzdGF0ZVBhcmFtcycsIFdvcmtPcmRlckRldGFpbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gV29ya09yZGVyQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRtb21lbnQpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLnNob3dDb21wbGV0ZSA9IGZhbHNlO1xyXG4gICAgICAgIHZhciB0b2RheXNEYXRlID0gJG1vbWVudCgpO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxXb3JrT3JkZXJzKHNlbGYpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi5zZXRVcmdlbmN5ID0gZnVuY3Rpb24ob2JqRGF0ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIDMgZGF5cywgNyBkYXlzLCAzMCBkYXlzLCB0aGUgcmVzdFxyXG4gICAgICAgICAgICB2YXIgZCA9ICRtb21lbnQob2JqRGF0ZSk7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgIHZhciBkYXlEaWZmID0gZC5kaWZmKHRvZGF5c0RhdGUsICdkYXlzJyk7XHJcblxyXG4gICAgICAgICAgICBpZihkYXlEaWZmID4gMzApIC8vIGdyZWVuXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImZhcldvcmtPcmRlclwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoZGF5RGlmZiA+IDcgJiYgZGF5RGlmZiA8PSAzMCkgLy8gYmx1ZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJjbG9zZVdvcmtPcmRlclwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoZGF5RGlmZiA+IDMgJiYgZGF5RGlmZiA8PSA3KSAvLyBvcmFuZ2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiY2xvc2VyV29ya09yZGVyXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSAvLyByZWRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiY2xvc2VzdFdvcmtPcmRlclwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGQuZGlmZih0b2RheXNEYXRlLCAnZGF5cycpKTtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi50b2dnbGVDb21wbGV0ZU9ubHkgPSBmdW5jdGlvbihjYlN0YXRlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RvZ2dsZScpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjYlN0YXRlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignV29ya09yZGVyQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJyRtb21lbnQnLCBXb3JrT3JkZXJDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
