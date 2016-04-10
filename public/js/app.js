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
        ]).constant('myConfig',
        {
            'materialSetsLSKey': 'materialSets'
        });

    angular.module('app.services', ['ui.router', 'satellizer', 'restangular', 'angular-momentjs', 'ngMaterial', 'ngFileUpload']);
    angular.module('app.routes', ['ui.router', 'satellizer']);
    angular.module('app.controllers', ['ui.router', 'ngMaterial', 'restangular', 'angular-momentjs', 'app.services', 'ngMessages', 'ngMdIcons', 'md.data.table', 'highcharts-ng', 'ngCookies']);
    angular.module('app.filters', []);

    angular.module('app.directives', ['angular-momentjs', 'ngAnimate']);
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
'use strict';

angular.module('app.directives').directive('mAppLoading', ["$animate", function ($animate)
{
    // Return the directive configuration.
    return({
        link: link,
        restrict: "C"
    });

    function link( scope, element, attributes )
    {
        // Due to the way AngularJS prevents animation during the bootstrap
        // of the application, we can't animate the top-level container; but,
        // since we added "ngAnimateChildren", we can animated the inner
        // container during this phase.
        // --
        // NOTE: Am using .eq(1) so that we don't animate the Style block.
        $animate.leave( element.children().eq( 1 ) ).then(
            function cleanupAfterAnimation()
            {
                // Remove the root directive element.
                element.remove();

                // Clear the closed-over variable references.
                scope = element = attributes = null;
            }
        );
    }

}]);
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
            },

            addCustomer: function(obj)
            {
                return Restangular.all('customer').post(obj);
            },

            addProduct: function(obj)
            {
                return Restangular.all('product').post(obj);
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

            uploadFile: function (filename, file)
            {
                var dataObj = {file: file };
                if(filename !== '') { dataObj.filename = filename; }

                return Upload.upload({
                    url: 'api/uploader/uploadFile',
                    data: dataObj
                });
            },

            deleteFile: function(filename)
            {
                var dataObj = {filename: filename };

                return Upload.upload({
                    url: 'api/uploader/deleteFile',
                    data: dataObj
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

    function MaterialSetController($state, RestService, GuidService, DialogService, myConfig)
    {
        var self = this;
        self.selectedMaterial = '';
        //self.selectedQuantity = 0;

        console.log(myConfig.materialSetsLSKey);

        if(localStorage.getItem(myConfig.materialSetsLSKey) !== null && localStorage.getItem(myConfig.materialSetsLSKey) !== '')
        {
            self.existingSets = JSON.parse(localStorage.getItem(myConfig.materialSetsLSKey));
        }
        else
        {
            self.existingSets = [];
            localStorage.setItem(myConfig.materialSetsLSKey, JSON.stringify(self.existingSets));
        }

        initSetObject();

        RestService.getAllMaterials(self);

        self.createSet = function()
        {
            self.set.id = GuidService.newGuid();
            self.existingSets.push(self.set);
            console.log(self.set);

            localStorage.setItem(myConfig.materialSetsLSKey, JSON.stringify(self.existingSets));

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
                if(self.existingSets.length === 0) { localStorage.removeItem(myConfig.materialSetsLSKey); }

                localStorage.setItem(myConfig.materialSetsLSKey, self.existingSets);
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

    angular.module('app.controllers').controller('MaterialSetController', ['$state', 'RestService', 'GuidService', 'DialogService', 'myConfig', MaterialSetController]);

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

    function ProductCreateController($auth, $state, Restangular, ToastService, RestService, ValidationService, myConfig, $stateParams)
    {
        var self = this;


        RestService.getAllMaterials(self);

        self.decimalRegex = ValidationService.decimalRegex();
        self.numericRegex = ValidationService.numericRegex();
        self.cbAddMaterialsBy = 2;

        self.product = {};
        self.product.minimum_stock = 0;
        self.product.current_stock = 0;

        if(localStorage.getItem(myConfig.materialSetsLSKey) !== null && localStorage.getItem(myConfig.materialSetsLSKey) !== '')
        {
            self.materialSets = JSON.parse(localStorage.getItem(myConfig.materialSetsLSKey));
        }


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

            addMaterial(self.selectedMaterial.id, self.selectedQuantity, self.selectedMaterial);

            self.selectedMaterial = "";
            self.selectedQuantity = 0;

            console.log(self.product);
        };

        self.addMaterialSet = function()
        {
            //console.log(self.selectedMaterialSet);

            for(var i = 0; i < self.selectedMaterialSet.product_materials.length; i++)
            {
                var pm = self.selectedMaterialSet.product_materials[i];
                //console.log(pm);
                addMaterial(pm.material_id, pm.quantity, pm.material);
            }
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

            //console.log(indexToRemove);

            var currentCost = parseFloat(self.product.cost);
            var btest = (parseFloat(self.product.product_materials[indexToRemove].material.unit_cost) * parseInt(self.product.product_materials[indexToRemove].quantity));
            currentCost -= btest;
            self.product.cost = currentCost;

            self.product.product_materials.splice(indexToRemove, 1);

            e.preventDefault();
        };

        function addMaterial(materialId, quantity, material)
        {
            if(self.product.product_materials === undefined) { self.product.product_materials = []; }

            self.product.product_materials.push({
                material_id: materialId,
                quantity: quantity,
                material: material
            });

            if(self.product.cost === undefined || self.product.cost === null) { self.product.cost = 0; }
            var currentCost = parseFloat(self.product.cost);
            var btest = (parseFloat(material.unit_cost) * parseFloat(quantity));
            currentCost += btest;
            self.product.cost = currentCost;
        }

    }

    angular.module('app.controllers').controller('ProductCreateController', ['$auth', '$state', 'Restangular', 'ToastService', 'RestService', 'ValidationService', 'myConfig', '$stateParams', ProductCreateController]);

})();

(function(){
    "use strict";

    function ProductDetailController($auth, $state, Restangular, RestService, $stateParams, ToastService, DialogService, ValidationService, myConfig)
    {
        var self = this;

        //console.log($stateParams);
        RestService.getAllMaterials(self);
        RestService.getProduct(self, $stateParams.productId);

        self.decimalRegex = ValidationService.decimalRegex();
        self.numericRegex = ValidationService.numericRegex();
        self.cbAddMaterialsBy = 2;

        if(localStorage.getItem(myConfig.materialSetsLSKey) !== null && localStorage.getItem(myConfig.materialSetsLSKey) !== '')
        {
            self.materialSets = JSON.parse(localStorage.getItem(myConfig.materialSetsLSKey));
        }


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

            addMaterial(self.selectedMaterial.id, self.selectedQuantity, self.selectedMaterial);

            self.selectedMaterial = "";
            self.selectedQuantity = 0;

        };

        self.addMaterialSet = function()
        {
            //console.log(self.selectedMaterialSet);

            for(var i = 0; i < self.selectedMaterialSet.product_materials.length; i++)
            {
                var pm = self.selectedMaterialSet.product_materials[i];
                //console.log(pm);
                addMaterial(pm.material_id, pm.quantity, pm.material);
            }
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

        function addMaterial(materialId, quantity, material)
        {
            if(self.product.product_materials === undefined) { self.product.product_materials = []; }

            self.product.product_materials.push({
                product_id: self.product.id,
                material_id: materialId,
                quantity: quantity,
                material: material
            });

            if(self.product.cost === undefined || self.product.cost === null) { self.product.cost = 0; }
            var currentCost = parseFloat(self.product.cost);
            var btest = (parseFloat(material.unit_cost) * parseFloat(quantity));
            currentCost += btest;
            self.product.cost = currentCost;
        }
    }

    angular.module('app.controllers').controller('ProductDetailController', ['$auth', '$state', 'Restangular', 'RestService', '$stateParams', 'ToastService', 'DialogService', 'ValidationService', 'myConfig', ProductDetailController]);

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

    function PurchaseOrderCreateController($auth, $state, $scope, $moment, Restangular, ToastService, RestService, DialogService, ValidationService, $stateParams)
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

        self.addProductInline = function(ev)
        {
            var dialogOptions = {
                templateUrl: '/views/dialogs/dlgCreateProductInline.html',
                escapeToClose: true,
                targetEvent: ev,
                controller: function DialogController($scope, $mdDialog)
                {
                    $scope.decimalRegex = ValidationService.decimalRegex();

                    $scope.confirmDialog = function ()
                    {
                        //console.log('accepted');

                        $scope.form1.$setSubmitted();

                        var isValid = $scope.form1.$valid;
                        if(isValid)
                        {
                            var p = $scope.ctrlProductCreateInline.product;
                            p.cost = 0;
                            p.minimum_stock = 0;
                            p.current_stock = 0;
                            //console.log(p);

                            RestService.addProduct(p).then(function(d)
                            {
                                //console.log(d.newId);
                                var pop = {id: d.newId, name: p.name, price: p.price};
                                self.products.push(pop);
                                self.selectedProduct = pop;
                                ToastService.show("Product Successfully created");
                            }, function()
                            {
                                ToastService.show("Error creating product");
                            });

                            $mdDialog.hide();
                        }
                    };

                    $scope.cancelDialog = function()
                    {
                        //console.log('cancelled');
                        $mdDialog.hide();
                    };
                },
                scope: $scope.$new()
            };

            DialogService.fromCustom(dialogOptions);

        };

        self.addCustomerInline = function(ev)
        {
            var dialogOptions = {
                templateUrl: '/views/dialogs/dlgCreateCustomerInline.html',
                escapeToClose: true,
                targetEvent: ev,
                controller: function DialogController($scope, $mdDialog)
                {
                    $scope.confirmDialog = function ()
                    {
                        //console.log('accepted');

                        $scope.form1.$setSubmitted();

                        var isValid = $scope.form1.$valid;
                        if(isValid)
                        {
                            var c = $scope.ctrlCustomerCreateInline.customer;
                            console.log(c);

                            RestService.addCustomer(c).then(function(d)
                            {
                                console.log(d.newId);
                                self.customers.push({id: d.newId, first_name: c.first_name, last_name: c.last_name });
                                self.purchaseorder.customer_id = d.newId;
                                ToastService.show("Customer Successfully created");
                            }, function()
                            {
                                ToastService.show("Error creating customer");
                            });

                            $mdDialog.hide();
                        }
                    };

                    $scope.cancelDialog = function()
                    {
                        //console.log('cancelled');
                        $mdDialog.hide();
                    };
                },
                scope: $scope.$new()
            };

            DialogService.fromCustom(dialogOptions);
        };

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

                originalTotal -= originalShippingCharge;
                originalTotal += costOfShipping;
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

            //console.log(indexToRemove);

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

    angular.module('app.controllers').controller('PurchaseOrderCreateController', ['$auth', '$state', '$scope', '$moment', 'Restangular', 'ToastService', 'RestService', 'DialogService', 'ValidationService', '$stateParams', PurchaseOrderCreateController]);

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

    function WorkOrderCreateController($auth, $state, Restangular, UploadService, ToastService, $moment, RestService, ValidationService, $stateParams)
    {
        var self = this;

        RestService.getAllCustomers(self);
        RestService.getAllProducts(self);

        self.numericRegex = ValidationService.numericRegex();
        self.workorder = {};

        self.uploadFile = function(file, errFiles)
        {
            self.f = file;
            self.errFile = errFiles && errFiles[0];
            if(file)
            {
                UploadService.uploadFile('', file).then(function (resp)
                {
                    if(resp.data.success == 1)
                    {
                        //console.log('successful upload');
                        self.workorder.image_filename = resp.data.filename;
                    }
                    //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                }, function (resp)
                {
                    if (resp.status > 0)
                    {
                        self.errorMsg = resp.status + ': ' + resp.data;
                    }
                    console.log('Error status: ' + resp.status);
                }, function (evt)
                {
                    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
        };

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

    angular.module('app.controllers').controller('WorkOrderCreateController', ['$auth', '$state', 'Restangular', 'UploadService', 'ToastService', '$moment', 'RestService', 'ValidationService', '$stateParams', WorkOrderCreateController]);

})();

(function(){
    "use strict";

    function WorkOrderDetailController($auth, $state, $scope, ToastService, Restangular, UploadService, RestService, DialogService, ValidationService, $moment, $stateParams)
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

        self.viewAttachment = function(ev, filename)
        {
            $scope.a = attachmentPath  + '/' + filename;

            DialogService.fromTemplate(ev, 'dlgAttachmentView', $scope).then(
                function()
                {
                    console.log('confirmed');
                }
            );
            console.log(attachmentPath  + '/' + filename);
        };

        self.deleteAttachment = function(ev, filename)
        {
            var dialog = DialogService.confirm(ev, 'Delete attachment?', '');
            dialog.then(function()
                {
                    UploadService.deleteFile(filename).then(function()
                    {
                        self.workorder.image_filename = null;
                        self.f.progress = -1;
                        self.f = null;

                        ToastService.show("Attachent deleted");
                    }, function(resp)
                    {
                        ToastService.show("Error deleting attachment");
                    });
                },
                function()
                {
                });
        };

        self.uploadFile = function(file, errFiles)
        {
            self.f = file;
            self.errFile = errFiles && errFiles[0];
            if(file)
            {
                var fname = '';
                if(self.workorder.image_filename !== undefined
                    && self.workorder.image_filename !== null
                    && self.workorder.image_filename !== 'null'
                    && self.workorder.image_filename !== '')
                {
                    fname = self.workorder.image_filename;
                }

                UploadService.uploadFile(fname, file).then(function (resp)
                {
                    if(resp.data.success == 1)
                    {
                        //console.log('successful upload');
                        self.workorder.image_filename = resp.data.filename;
                    }
                    //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                }, function (resp)
                {
                    if (resp.status > 0)
                    {
                        self.errorMsg = resp.status + ': ' + resp.data;
                    }
                    console.log('Error status: ' + resp.status);
                }, function (evt)
                {
                    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
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

    angular.module('app.controllers').controller('WorkOrderDetailController', ['$auth', '$state', '$scope', 'ToastService', 'Restangular', 'UploadService', 'RestService', 'DialogService', 'ValidationService', '$moment', '$stateParams', WorkOrderDetailController]);

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHAuanMiLCJhcHAvcm91dGVzLmpzIiwiYXBwL2RpcmVjdGl2ZXMvYXBwTG9hZGluZy5qcyIsImFwcC9kaXJlY3RpdmVzL2ZvY3VzT24uanMiLCJhcHAvZGlyZWN0aXZlcy91dGMtcGFyc2VyLmRpcmVjdGl2ZS5qcyIsImFwcC9maWx0ZXJzL3RydW5jYXRlTmFtZS5qcyIsImFwcC9zZXJ2aWNlcy9hdXRoLmpzIiwiYXBwL3NlcnZpY2VzL2NoYXJ0LmpzIiwiYXBwL3NlcnZpY2VzL2RpYWxvZy5qcyIsImFwcC9zZXJ2aWNlcy9mb2N1cy5qcyIsImFwcC9zZXJ2aWNlcy9ndWlkLmpzIiwiYXBwL3NlcnZpY2VzL3Jlc3QuanMiLCJhcHAvc2VydmljZXMvdG9hc3QuanMiLCJhcHAvc2VydmljZXMvdXBsb2FkLmpzIiwiYXBwL3NlcnZpY2VzL3ZhbGlkYXRpb24uanMiLCJhcHAvY29udHJvbGxlcnMvY29yZS9jb3JlLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2N1c3RvbWVycy9jdXN0b21lci5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvY3VzdG9tZXJzL2N1c3RvbWVyLmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy9jdXN0b21lcnMvY3VzdG9tZXJzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2V2ZW50cy9ldmVudC5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvZXZlbnRzL2V2ZW50LmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy9ldmVudHMvZXZlbnRzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2Zvb3Rlci9mb290ZXIuanMiLCJhcHAvY29udHJvbGxlcnMvaGVhZGVyL2hlYWRlci5qcyIsImFwcC9jb250cm9sbGVycy9sYW5kaW5nL2xhbmRpbmcuanMiLCJhcHAvY29udHJvbGxlcnMvbG9naW4vbG9naW4uanMiLCJhcHAvY29udHJvbGxlcnMvbWF0ZXJpYWxzL21hdGVyaWFsLmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy9tYXRlcmlhbHMvbWF0ZXJpYWwuZGV0YWlsLmpzIiwiYXBwL2NvbnRyb2xsZXJzL21hdGVyaWFscy9tYXRlcmlhbHMuanMiLCJhcHAvY29udHJvbGxlcnMvbWF0ZXJpYWxzZXRzL21hdGVyaWFsc2V0cy5qcyIsImFwcC9jb250cm9sbGVycy9wYXltZW50X3R5cGVzL3BheW1lbnR0eXBlLmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy9wYXltZW50X3R5cGVzL3BheW1lbnR0eXBlLmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy9wYXltZW50X3R5cGVzL3BheW1lbnR0eXBlcy5qcyIsImFwcC9jb250cm9sbGVycy9wcm9kdWN0cy9wcm9kdWN0LmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy9wcm9kdWN0cy9wcm9kdWN0LmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy9wcm9kdWN0cy9wcm9kdWN0cy5qcyIsImFwcC9jb250cm9sbGVycy9wdXJjaGFzZW9yZGVycy9wdXJjaGFzZW9yZGVyLmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy9wdXJjaGFzZW9yZGVycy9wdXJjaGFzZW9yZGVyLmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy9wdXJjaGFzZW9yZGVycy9wdXJjaGFzZW9yZGVycy5qcyIsImFwcC9jb250cm9sbGVycy9yZXBvcnRzL3JlcG9ydHMuanMiLCJhcHAvY29udHJvbGxlcnMvc2VhcmNoL3NlYXJjaC5qcyIsImFwcC9jb250cm9sbGVycy91bml0cy91bml0LmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy91bml0cy91bml0LmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy91bml0cy91bml0cy5qcyIsImFwcC9jb250cm9sbGVycy93b3Jrb3JkZXJzL3dvcmtvcmRlci5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvd29ya29yZGVycy93b3Jrb3JkZXIuZGV0YWlsLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3dvcmtvcmRlcnMvd29ya29yZGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBp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UUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLGlCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLHdCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLHdCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLGtCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLHlCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLHlCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLGNBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEscUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEscUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsZUFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSw0QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxxQkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSw0QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSw2QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxxQ0FBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSw4QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxhQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLG9CQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLG9CQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLGlCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLHdCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLHdCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLHNCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLDZCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLDZCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLG9CQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLDJCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLDJCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLGVBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBOzs7O2FBSUEsTUFBQSxvQkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFB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QUFBLEtBQUEsS0FBQSxTQUFBO2dCQUNBO29CQUNBLElBQUEsVUFBQTtvQkFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxRQUFBO29CQUNBO3dCQUNBLElBQUEsZUFBQSxLQUFBOzt3QkFFQSxRQUFBLEtBQUEsQ0FBQSxLQUFBLElBQUEsU0FBQSxhQUFBLE9BQUEsU0FBQSxhQUFBLFNBQUEsSUFBQSxTQUFBLGFBQUE7OztvQkFHQSxNQUFBLFlBQUEsU0FBQSxDQUFBLENBQUEsTUFBQSxvQkFBQSxNQUFBOztvQkFFQSxNQUFBLFlBQUEsVUFBQTs7O2dCQUdBO2dCQUNBOzs7OztZQUtBLHdCQUFBLFNBQUE7WUFDQTs7Z0JBRUEsTUFBQSxjQUFBO29CQUNBLFNBQUE7d0JBQ0EsT0FBQTs0QkFDQSxNQUFBOzt3QkFFQTt3QkFDQTs0QkFDQSxLQUFBOzRCQUNBOzRCQUNBO2dDQUNBLE1BQUE7Ozt3QkFHQTt3QkFDQTs0QkFDQSxNQUFBOzRCQUNBOzRCQUNBO2dDQUNBLE9BQUE7Z0NBQ0EsTUFBQTs7NEJBRUE7NEJBQ0E7Z0NBQ0EsTUFBQTs7O3dCQUdBO3dCQUNBOzs7OztvQkFLQSxPQUFBO3dCQUNBLE1BQUE7OztvQkFHQSxTQUFBOzs7Z0JBR0EsWUFBQSxJQUFBLGlDQUFBLEtBQUEsRUFBQSxnQkFBQSxLQUFBLEtBQUEsU0FBQTtvQkFDQTt3QkFDQSxJQUFBLFVBQUE7d0JBQ0EsSUFBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsUUFBQTt3QkFDQTs0QkFDQSxJQUFBLGVBQUEsS0FBQTs7NEJBRUEsUUFBQSxLQUFBLENBQUEsS0FBQSxJQUFBLFNBQUEsYUFBQSxPQUFBLFNBQUEsYUFBQSxTQUFBLElBQUEsV0FBQSxhQUFBOzs7d0JBR0EsTUFBQSxZQUFBLFNBQUEsQ0FBQSxDQUFBLE1BQUEscUJBQUEsTUFBQTs7d0JBRUEsTUFBQSxZQUFBLFVBQUE7OztvQkFHQTtvQkFDQTs7Ozs7WUFLQSx1QkFBQSxTQUFBLE9BQUE7WUFDQTtnQkFDQSxRQUFBLElBQUE7Z0JBQ0EsTUFBQSx3QkFBQTtn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QUEsYUFBQTs7Ozs7O1lBTUEsY0FBQSxTQUFBLE9BQUE7WUFDQTtnQkFDQSxZQUFBLElBQUEsYUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO2dCQUNBOzs7O29CQUlBLEtBQUEsYUFBQSxRQUFBLEtBQUE7b0JBQ0EsS0FBQSxXQUFBLFFBQUEsS0FBQTs7O29CQUdBLEtBQUEsWUFBQSxTQUFBLEtBQUE7O29CQUVBLEtBQUEsWUFBQTs7O29CQUdBLE1BQUEsWUFBQTs7OztZQUlBLGNBQUEsU0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxTQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBOztvQkFFQSxNQUFBLFNBQUE7Ozs7WUFJQSxVQUFBLFNBQUEsT0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxTQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsUUFBQTs7OztZQUlBLGFBQUEsU0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxRQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBOztvQkFFQSxNQUFBLFFBQUE7Ozs7WUFJQSxTQUFBLFNBQUEsT0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxRQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsT0FBQTs7OztZQUlBLGlCQUFBLFNBQUE7WUFDQTtnQkFDQSxZQUFBLElBQUEsWUFBQSxVQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxZQUFBOzs7O1lBSUEsYUFBQSxTQUFBLE9BQUE7WUFDQTtnQkFDQSxZQUFBLElBQUEsWUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO2dCQUNBOztvQkFFQSxNQUFBLFdBQUE7Ozs7WUFJQSxVQUFBLFNBQUEsT0FBQTtZQUNBO2dCQUNBLFFBQUEsSUFBQSxtQkFBQTs7Z0JBRUEsWUFBQSxJQUFBLFVBQUEsT0FBQSxVQUFBLEtBQUEsU0FBQTtnQkFDQTs7Ozs7O1lBTUEsc0JBQUEsU0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxpQkFBQSxVQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEs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QUlBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG9CQUFBLENBQUEsU0FBQSxXQUFBOzs7QUNkQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLGtCQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7OztJQUdBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHFCQUFBLENBQUEsVUFBQTs7O0FDUkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSxnQkFBQSxRQUFBLFFBQUEsVUFBQSxlQUFBLGFBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTtRQUNBLEtBQUEsUUFBQTtRQUNBLEtBQUEsV0FBQTs7UUFFQSxHQUFBLFNBQUEsSUFBQTtRQUNBO1lBQ0EsS0FBQSxRQUFBLFNBQUEsSUFBQTs7O1FBR0EsSUFBQSxnQkFBQTtZQUNBLGFBQUE7WUFDQSxlQUFBO1lBQ0EsWUFBQSxTQUFBLGlCQUFBLFFBQUE7WUFDQTtnQkFDQSxPQUFBLGdCQUFBLFlBQUE7OztvQkFHQSxHQUFBLEtBQUEsVUFBQSxNQUFBLEtBQUEsYUFBQTtvQkFDQTt3QkFDQSxZQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO3dCQUNBOzRCQUNBLFFBQUEsSUFBQTs7NEJBRUEsSUFBQSxRQUFBLElBQUE7OzRCQUVBLElBQUEsZUFBQSxJQUFBOzRCQUNBLGFBQUEsWUFBQSxhQUFBLGdCQUFBOzs0QkFFQSxTQUFBLElBQUEsYUFBQSxLQUFBLE9BQUEsRUFBQSxTQUFBOzs7NEJBR0EsVUFBQTs0QkFDQSxPQUFBLEdBQUE7O3dCQUVBO3dCQUNBOzRCQUNBLE1BQUE7Ozs7O1lBS0EsT0FBQSxPQUFBOzs7UUFHQSxjQUFBLFdBQUE7O1FBRUEsYUFBQTs7OztJQUlBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG1CQUFBLENBQUEsVUFBQSxVQUFBLFlBQUEsaUJBQUEsZUFBQSxnQkFBQTs7OztBQ3ZEQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLHlCQUFBLE9BQUEsUUFBQSxjQUFBLGFBQUEsYUFBQSxtQkFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOztRQUVBLFlBQUEs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UUFFQSxLQUFBLGVBQUEsa0JBQUE7UUFDQSxLQUFBLGVBQUEsa0JBQUE7UUFDQSxLQUFBLG1CQUFBOztRQUVBLEdBQUEsYUFBQSxRQUFBLFNBQUEsdUJBQUEsUUFBQSxhQUFBLFFBQUEsU0FBQSx1QkFBQTtRQUNBO1lBQ0EsS0FBQSxlQUFBLEtBQUEsTUFBQSxhQUFBLFFBQUEsU0FBQTs7OztRQUlBLEtBQUEsZ0JBQUE7UUFDQTtZQUNBLEtBQUEsTUFBQTs7WUFFQSxJQUFBLFVBQUEsS0FBQSxNQUFBOzs7WUFHQSxHQUFBO1lBQ0E7O2dCQUVBLEtBQUEsUUFBQSxNQUFBLEtBQUE7Z0JBQ0E7O29CQUVBLGFBQUEsS0FBQTtvQkFDQSxPQUFBLEdBQUE7bUJBQ0E7Z0JBQ0E7b0JBQ0EsYUFBQSxLQUFBO29CQUNBLFFBQUEsSUFBQTs7Ozs7UUFLQSxLQUFBLGdCQUFBO1FBQ0E7WUFDQSxLQUFBLFFBQUEsU0FBQSxLQUFBO1lBQ0E7Z0JBQ0EsUUFBQSxJQUFBO2dCQUNBLGFBQUEsS0FBQTtnQkFDQSxPQUFBLEdBQUE7O2VBRUE7WUFDQTtnQkFDQSxhQUFBLEtBQUE7Z0JBQ0EsUUFBQSxJQUFBOzs7O1FBSUEsS0FBQSxvQkFBQSxTQUFBO1FBQ0E7WUFDQSxJQUFBLFNBQUEsY0FBQSxRQUFBLElBQUEsbUJBQUE7WUFDQSxPQUFBLEtBQUE7WUFDQTtnQkFDQSxLQUFBOztZQUVBO1lBQ0E7Ozs7UUFJQSxLQUFBLGNBQUE7UUFDQTtZQUNBLFFBQUEsSUFBQSxLQUFBOztZQUVBLFlBQUEsS0FBQSxpQkFBQSxJQUFBLEtBQUEsa0JBQUEsS0FBQTs7WUFFQSxLQUFBLG1CQUFBO1lBQ0EsS0FBQSxtQkFBQTs7OztRQUlBLEtBQUEsaUJBQUE7UUFDQTs7O1lBR0EsSUFBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsb0JBQUEsa0JBQUEsUUFBQTtZQUNBO2dCQUNBLElBQUEsS0FBQSxLQUFBLG9CQUFBLGtCQUFBOztnQkFFQSxZQUFBLEdBQUEsYUFBQSxHQUFBLFVBQUEsR0FBQTs7OztRQUlBLEtBQUEsaUJBQUEsU0FBQSxHQUFBO1FBQ0E7WUFDQSxJQUFBO1lBQ0EsSUFBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsUUFBQSxrQkFBQSxRQUFBO1lBQ0E7Z0JBQ0EsR0FBQSxjQUFBLEtBQUEsUUFBQSxrQkFBQSxHQUFBO2dCQUNBO29CQUNBLGdCQUFBO29CQUNBOzs7O1lBSUEsUUFBQSxJQUFBOztZQUVBLElBQUEsY0FBQSxXQUFBLEtBQUEsUUFBQTtZQUNBLElBQUEsU0FBQSxXQUFBLEtBQUEsUUFBQSxrQkFBQSxlQUFBLFNBQUEsYUFBQSxTQUFBLEtBQUEsUUFBQSxrQkFBQSxlQUFBO1lBQ0EsZUFBQTtZQUNBLEtBQUEsUUFBQSxPQUFBOzs7WUFHQSxLQUFBLFFBQUEsa0JBQUEsT0FBQSxlQUFBOztZQUVBLEVBQUE7OztRQUdBLFNBQUEsWUFBQSxZQUFBLFVBQUE7UUFDQTtZQUNBLEdBQUEsS0FBQSxRQUFBLHNCQUFBLFdBQUEsRUFBQSxLQUFBLFFBQUEsb0JBQUE7O1lBRUEsS0FBQSxRQUFBLGtCQUFBLEtBQUE7Z0JBQ0EsWUFBQSxLQUFBLFFBQUE7Z0JBQ0EsYUFBQTtnQkFDQSxVQUFBO2dCQUNBLFVBQUE7OztZQUdBLEdBQUEsS0FBQSxRQUFBLFNBQUEsYUFBQSxLQUFBLFFBQUEsU0FBQSxNQUFBLEVBQUEsS0FBQSxRQUFBLE9BQUE7WUFDQSxJQUFBLGNBQUEsV0FBQSxLQUFBLFFBQUE7WUFDQSxJQUFBLFNBQUEsV0FBQSxTQUFBLGFBQUEsV0FBQTtZQUNBLGVBQUE7WUFDQSxLQUFBLFFBQUEsT0FBQTs7OztJQUlBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDJCQUFBLENBQUEsU0FBQSxVQUFBLGVBQUEsZUFBQSxnQkFBQSxnQkFBQSxpQkFBQSxxQkFBQSxZQUFBOzs7O0FDMUlBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEsa0JBQUEsT0FBQSxRQUFBLGFBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTtRQUNBLEtBQUEsYUFBQTtRQUNBLEtBQUEsaUJBQUE7UUFDQSxLQUFBLGNBQUE7O1FBRUEsWUFBQSxlQUFBOztRQUVBLEtBQUEscUJBQUEsU0FBQTtRQUNBO1lBQ0EsR0FBQSxLQUFBLGVBQUEsTUFBQSxLQUFBLG1CQUFBLE1BQUEsS0FBQSxnQkFBQTtZQUNBO2dCQUNBLFFBQUEsSUFBQTtnQkFDQSxJQUFBLG1CQUFBO2dCQUNBLE9BQUEsS0FBQTs7b0JBRUEsS0FBQTt3QkFDQSxtQkFBQSxTQUFBLEVBQUE7d0JBQ0E7b0JBQ0EsS0FBQTt3QkFDQSxtQkFBQSxXQUFBLEVBQUE7d0JBQ0E7b0JBQ0EsS0FBQTt3QkFDQSxtQkFBQSxXQUFBLEVBQUE7d0JBQ0E7OztnQkFHQSxHQUFBLEtBQUEsbUJBQUE7Z0JBQ0E7b0JBQ0EsT0FBQSxvQkFBQSxXQUFBLEtBQUE7O3FCQUVBLEdBQUEsS0FBQSxtQkFBQTtnQkFDQTtvQkFDQSxPQUFBLG1CQUFBLFdBQUEsS0FBQTs7cUJBRUEsR0FBQSxLQUFBLG1CQUFBO2dCQUNBO29CQUNBLE9BQUEsb0JBQUEsS0FBQTs7cUJBRUEsR0FBQSxLQUFBLG1CQUFBO2dCQUNBO29CQUNBLE9BQUEsbUJBQUEsV0FBQSxLQUFBOztxQkFFQSxHQUFBLEtBQUEsbUJBQUE7Z0JBQ0E7b0JBQ0EsT0FBQSxvQkFBQSxXQUFBLEtBQUE7Ozs7WUFJQSxPQUFBOzs7O0lBSUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEscUJBQUEsQ0FBQSxTQUFBLFVBQUEsZUFBQSxlQUFBOzs7O0FDekRBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEsOEJBQUEsT0FBQSxRQUFBLFFBQUEsU0FBQSxhQUFBLGNBQUEsYUFBQSxlQUFBLG1CQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7O1FBRUEsWUFBQSxnQkFBQTtRQUNBLFlBQUEsZUFBQTtRQUNBLFlBQUEsbUJBQUE7UUFDQSxZQUFBLG1CQUFBOztRQUVBLEtBQUEsZ0JBQUE7UUFDQSxLQUFBLGNBQUEsY0FBQTtRQUNBLEtBQUEsY0FBQSxXQUFBO1FBQ0EsS0FBQSxjQUFBLFFBQUE7O1FBRUEsS0FBQSxjQUFBLFdBQUE7UUFDQSxLQUFBLGtCQUFBOztRQUVBLEtBQUEsY0FBQSxXQUFBO1FBQ0EsS0FBQSxrQkFBQTs7UUFFQSxLQUFBLGNBQUEsb0JBQUE7O1FBRUEsSUFBQSxnQkFBQTtRQUNBLElBQUEseUJBQUE7O1FBRUEsS0FBQSxtQkFBQSxTQUFBO1FBQ0E7WUFDQSxJQUFBLGdCQUFBO2dCQUNBLGFBQUE7Z0JBQ0EsZUFBQTtnQkFDQSxhQUFBO2dCQUNBLFlBQUEsU0FBQSxpQkFBQSxRQUFBO2dCQUNBO29CQUNBLE9BQUEsZUFBQSxrQkFBQTs7b0JBRUEsT0FBQSxnQkFBQTtvQkFDQTs7O3dCQUdBLE9BQUEsTUFBQTs7d0JBRUEsSUFBQSxVQUFBLE9BQUEsTUFBQTt3QkFDQSxHQUFBO3dCQUNBOzRCQUNBLElBQUEsSUFBQSxPQUFBLHdCQUFBOzRCQUNBLEVBQUEsT0FBQTs0QkFDQSxFQUFBLGdCQUFBOzRCQUNBLEVBQUEsZ0JBQUE7Ozs0QkFHQSxZQUFBLFdBQUEsR0FBQSxLQUFBLFNBQUE7NEJBQ0E7O2dDQUVBLElBQUEsTUFBQSxDQUFBLElBQUEsRUFBQSxPQUFBLE1BQUEsRUFBQSxNQUFBLE9BQUEsRUFBQTtnQ0FDQSxLQUFBLFNBQUEsS0FBQTtnQ0FDQSxLQUFBLGtCQUFBO2dDQUNBLGFBQUEsS0FBQTsrQkFDQTs0QkFDQTtnQ0FDQSxhQUFBLEtBQUE7Ozs0QkFHQSxVQUFBOzs7O29CQUlBLE9BQUEsZUFBQTtvQkFDQTs7d0JBRUEsVUFBQTs7O2dCQUdBLE9BQUEsT0FBQTs7O1lBR0EsY0FBQSxXQUFBOzs7O1FBSUEsS0FBQSxvQkFBQSxTQUFBO1FBQ0E7WUFDQSxJQUFBLGdCQUFBO2dCQUNBLGFBQUE7Z0JBQ0EsZUFBQTtnQkFDQSxhQUFBO2dCQUNBLFlBQUEsU0FBQSxpQkFBQSxRQUFBO2dCQUNBO29CQUNBLE9BQUEsZ0JBQUE7b0JBQ0E7Ozt3QkFHQSxPQUFBLE1BQUE7O3dCQUVBLElBQUEsVUFBQSxPQUFBLE1BQUE7d0JBQ0EsR0FBQTt3QkFDQTs0QkFDQSxJQUFBLElBQUEsT0FBQSx5QkFBQTs0QkFDQSxRQUFBLElBQUE7OzRCQUVBLFlBQUEsWUFBQSxHQUFBLEtBQUEsU0FBQTs0QkFDQTtnQ0FDQSxRQUFBLElBQUEsRUFBQTtnQ0FDQSxLQUFBLFVBQUEsS0FBQSxDQUFBLElBQUEsRUFBQSxPQUFBLFlBQUEsRUFBQSxZQUFBLFdBQUEsRUFBQTtnQ0FDQSxLQUFBLGNBQUEsY0FBQSxFQUFBO2dDQUNBLGFBQUEsS0FBQTsrQkFDQTs0QkFDQTtnQ0FDQSxhQUFBLEtBQUE7Ozs0QkFHQSxVQUFBOzs7O29CQUlBLE9BQUEsZUFBQTtvQkFDQTs7d0JBRUEsVUFBQTs7O2dCQUdBLE9BQUEsT0FBQTs7O1lBR0EsY0FBQSxXQUFBOzs7UUFHQSxLQUFBLGVBQUEsU0FBQTtRQUNBO1lBQ0EsSUFBQSxTQUFBOztZQUVBLEdBQUEsQ0FBQSxRQUFBLE1BQUE7WUFDQTs7Z0JBRUEsSUFBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsV0FBQSxRQUFBO2dCQUNBOzs7O29CQUlBLEdBQUEsT0FBQSxNQUFBLE9BQUEsS0FBQSxXQUFBLEdBQUE7b0JBQ0E7d0JBQ0EsU0FBQTt3QkFDQTs7Ozs7WUFLQSxPQUFBOzs7UUFHQSxLQUFBLHNCQUFBO1FBQ0E7WUFDQSxRQUFBLElBQUEsS0FBQTs7WUFFQSxJQUFBLElBQUEsS0FBQTs7OztZQUlBLFlBQUEsSUFBQSxpQkFBQSxLQUFBLEdBQUEsS0FBQSxTQUFBO1lBQ0E7OztnQkFHQSxhQUFBLEtBQUE7Z0JBQ0EsT0FBQSxHQUFBO2VBQ0E7WUFDQTtnQkFDQSxhQUFBLEtBQUE7Ozs7UUFJQSxLQUFBLGdCQUFBO1FBQ0E7WUFDQSxHQUFBLEtBQUEsY0FBQSxZQUFBLFFBQUEsS0FBQSxjQUFBLFlBQUE7WUFDQTtnQkFDQSxLQUFBLGNBQUEsUUFBQTs7O1lBR0E7Z0JBQ0EsR0FBQSxLQUFBLGNBQUEsVUFBQTt1QkFDQSxLQUFBLGNBQUEsVUFBQTt1QkFDQSxLQUFBLGNBQUEsUUFBQTtnQkFDQTtvQkFDQSxJQUFBLGFBQUEsZ0JBQUEsS0FBQSxjQUFBO29CQUNBLGNBQUEsSUFBQSxLQUFBLGNBQUEsUUFBQSxhQUFBOzs7OztRQUtBLEtBQUEsZ0JBQUE7UUFDQTtZQUNBLEdBQUEsS0FBQSxvQkFBQTtZQUNBO2dCQUNBLEtBQUEsY0FBQSxXQUFBO2dCQUNBLEtBQUEsY0FBQSxTQUFBOzs7WUFHQTtnQkFDQSxLQUFBLGNBQUEsV0FBQTtnQkFDQSxLQUFBLGNBQUEsU0FBQTs7OztRQUlBLEtBQUEsZ0JBQUE7UUFDQTtZQUNBLElBQUEsaUJBQUE7WUFDQSxHQUFBLEtBQUEsb0JBQUE7WUFDQTtnQkFDQSxpQkFBQTs7aUJBRUEsR0FBQSxLQUFBLG9CQUFBO1lBQ0E7Z0JBQ0EsaUJBQUE7OztZQUdBLEtBQUEsY0FBQSxXQUFBOztZQUVBLEdBQUEsS0FBQSxvQkFBQTtZQUNBO2dCQUNBLEtBQUEsY0FBQSxTQUFBO2dCQUNBLEtBQUEsY0FBQSxTQUFBOztnQkFFQSxpQkFBQTtnQkFDQSxpQkFBQTs7O1lBR0EseUJBQUE7OztRQUdBLEtBQUEsYUFBQTtRQUNBO1lBQ0EsUUFBQSxJQUFBLEtBQUE7O1lBRUEsR0FBQSxLQUFBLGNBQUEsNEJBQUEsV0FBQSxFQUFBLEtBQUEsY0FBQSwwQkFBQTs7WUFFQSxLQUFBLGNBQUEsd0JBQUEsS0FBQTtnQkFDQSxZQUFBLEtBQUEsZ0JBQUE7Z0JBQ0EsVUFBQSxLQUFBO2dCQUNBLFNBQUEsS0FBQTs7O1lBR0EsR0FBQSxLQUFBLGNBQUEsVUFBQSxhQUFBLEtBQUEsY0FBQSxVQUFBLE1BQUEsRUFBQSxLQUFBLGNBQUEsUUFBQTtZQUNBLElBQUEsY0FBQSxXQUFBLEtBQUEsY0FBQTtZQUNBLElBQUEsU0FBQSxXQUFBLEtBQUEsZ0JBQUEsU0FBQSxTQUFBLEtBQUE7WUFDQSxlQUFBO1lBQ0EsS0FBQSxjQUFBLFFBQUE7WUFDQSxnQkFBQTs7WUFFQSxLQUFBLGtCQUFBO1lBQ0EsS0FBQSxtQkFBQTs7WUFFQSxRQUFBLElBQUEsS0FBQTs7O1FBR0EsS0FBQSxnQkFBQSxTQUFBLEdBQUE7UUFDQTtZQUNBLElBQUE7WUFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxjQUFBLHdCQUFBLFFBQUE7WUFDQTtnQkFDQSxHQUFBLGFBQUEsS0FBQSxjQUFBLHdCQUFBLEdBQUE7Z0JBQ0E7b0JBQ0EsZ0JBQUE7b0JBQ0E7Ozs7OztZQU1BLElBQUEsY0FBQSxXQUFBLEtBQUEsY0FBQTtZQUNBLElBQUEsU0FBQSxXQUFBLEtBQUEsY0FBQSx3QkFBQSxlQUFBLFFBQUEsU0FBQSxTQUFBLEtBQUEsY0FBQSx3QkFBQSxlQUFBO1lBQ0EsZUFBQTtZQUNBLEtBQUEsY0FBQSxRQUFBO1lBQ0EsZ0JBQUE7O1lBRUEsS0FBQSxjQUFBLHdCQUFBLE9BQUEsZUFBQTs7WUFFQSxFQUFBOzs7UUFHQSxLQUFBLHNCQUFBLFNBQUE7UUFDQTtZQUNBLEdBQUEsS0FBQSxjQUFBLDRCQUFBO1lBQ0E7Z0JBQ0EsR0FBQSxLQUFBLGNBQUEscUJBQUE7Z0JBQ0E7O29CQUVBLEtBQUE7OztnQkFHQTs7b0JBRUEsSUFBQSxvQkFBQTtvQkFDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxjQUFBLHdCQUFBLFFBQUEsS0FBQTt3QkFDQSxrQkFBQSxLQUFBOzRCQUNBLFlBQUEsS0FBQSxjQUFBLHdCQUFBLEdBQUE7NEJBQ0EsVUFBQSxLQUFBLGNBQUEsd0JBQUEsR0FBQTs7OztvQkFJQSxZQUFBLElBQUEsMkJBQUEsS0FBQSxDQUFBLG1CQUFBLG9CQUFBLEtBQUEsVUFBQSxNQUFBO3dCQUNBLFFBQUEsSUFBQSxLQUFBO3dCQUNBLElBQUEsS0FBQSxxQkFBQSxHQUFBOzs0QkFFQSxPQUFBLHFCQUFBLEtBQUE7NEJBQ0EsT0FBQSxhQUFBLEtBQUE7OzRCQUVBLGNBQUEsYUFBQSxHQUFBLHdCQUFBLFFBQUE7Z0NBQ0EsWUFBQTtvQ0FDQSxLQUFBLGNBQUEsY0FBQSxPQUFBOztvQ0FFQSxLQUFBOztnQ0FFQSxZQUFBOzs7Ozs2QkFLQTs7NEJBRUEsS0FBQTs7Ozs7Ozs7O0lBU0EsUUFBQSxPQUFBLG1CQUFBLFdBQUEsaUNBQUEsQ0FBQSxTQUFBLFVBQUEsVUFBQSxXQUFBLGVBQUEsZ0JBQUEsZUFBQSxpQkFBQSxxQkFBQSxnQkFBQTs7OztBQ3pVQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLDhCQUFBLE9BQUEsUUFBQSxRQUFBLFNBQUEsYUFBQSxhQUFBLGNBQUEsY0FBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOzs7UUFHQSxZQUFBLGdCQUFBO1FBQ0EsWUFBQSxlQUFBO1FBQ0EsWUFBQSxtQkFBQTtRQUNBLFlBQUEsaUJBQUEsTUFBQSxhQUFBOztRQUVBLElBQUEsZ0JBQUE7O1FBRUEsS0FBQSxzQkFBQTtRQUNBO1lBQ0EsS0FBQSxjQUFBLE1BQUEsS0FBQTtZQUNBOztnQkFFQSxhQUFBLEtBQUE7Z0JBQ0EsT0FBQSxHQUFBO2VBQ0E7WUFDQTtnQkFDQSxhQUFBLEtBQUE7Z0JBQ0EsUUFBQSxJQUFBOzs7O1FBSUEsS0FBQSxzQkFBQTtRQUNBO1lBQ0EsS0FBQSxjQUFBLFNBQUEsS0FBQTtZQUNBO2dCQUNBLFFBQUEsSUFBQTtnQkFDQSxhQUFBLEtBQUE7Z0JBQ0EsT0FBQSxHQUFBOztlQUVBO1lBQ0E7Z0JBQ0EsYUFBQSxLQUFBO2dCQUNBLFFBQUEsSUFBQTs7OztRQUlBLEtBQUEsb0JBQUEsU0FBQTtRQUNBO1lBQ0EsSUFBQSxTQUFBLGNBQUEsUUFBQSxJQUFBLDBCQUFBO1lBQ0EsT0FBQSxLQUFBO1lBQ0E7Z0JBQ0EsS0FBQTs7WUFFQTtZQUNBOzs7O1FBSUEsS0FBQSxnQkFBQTtRQUNBO1lBQ0EsR0FBQSxLQUFBLGNBQUEsWUFBQSxRQUFBLEtBQUEsY0FBQSxZQUFBO1lBQ0E7Z0JBQ0EsS0FBQSxjQUFBLFFBQUE7OztZQUdBO2dCQUNBLEdBQUEsS0FBQSxjQUFBLFVBQUE7dUJBQ0EsS0FBQSxjQUFBLFVBQUE7dUJBQ0EsS0FBQSxjQUFBLFFBQUE7Z0JBQ0E7b0JBQ0EsSUFBQSxhQUFBLGdCQUFBLEtBQUEsY0FBQTtvQkFDQSxjQUFBLElBQUEsS0FBQSxjQUFBLFFBQUEsYUFBQTs7Ozs7UUFLQSxLQUFBLGFBQUEsU0FBQTtRQUNBO1lBQ0EsUUFBQSxJQUFBLEtBQUE7O1lBRUEsSUFBQSxTQUFBO2dCQUNBLFlBQUEsS0FBQSxnQkFBQTtnQkFDQSxVQUFBLEtBQUE7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LEdBQUE7ZUFDQTtZQUNBO2dCQUNBLGFBQUEsS0FBQTs7OztRQUlBLEtBQUEsb0JBQUEsU0FBQTtRQUNBO1lBQ0EsSUFBQSxTQUFBLGNBQUEsUUFBQSxJQUFBLHNCQUFBO1lBQ0EsT0FBQSxLQUFBO2dCQUNBO29CQUNBLEtBQUE7O2dCQUVBO2dCQUNBOzs7Ozs7SUFNQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw2QkFBQSxDQUFBLFNBQUEsVUFBQSxVQUFBLGdCQUFBLGVBQUEsaUJBQUEsZUFBQSxpQkFBQSxxQkFBQSxXQUFBLGdCQUFBOzs7O0FDM0lBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEsb0JBQUEsT0FBQSxRQUFBLGFBQUEsYUFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOztRQUVBLEtBQUEsZUFBQTtRQUNBLElBQUEsYUFBQTs7UUFFQSxZQUFBLGlCQUFBOztRQUVBLFFBQUEsSUFBQTs7UUFFQSxLQUFBLGFBQUEsU0FBQTtRQUNBOztZQUVBLElBQUEsSUFBQSxRQUFBOztZQUVBLElBQUEsVUFBQSxFQUFBLEtBQUEsWUFBQTs7WUFFQSxHQUFBLFVBQUE7WUFDQTtnQkFDQSxPQUFBOztpQkFFQSxHQUFBLFVBQUEsS0FBQSxXQUFBO1lBQ0E7Z0JBQ0EsT0FBQTs7aUJBRUEsR0FBQSxVQUFBLEtBQUEsV0FBQTtZQUNBO2dCQUNBLE9BQUE7OztZQUdBO2dCQUNBLE9BQUE7Ozs7Ozs7UUFPQSxLQUFBLHFCQUFBLFNBQUE7UUFDQTtZQUNBLFFBQUEsSUFBQTtZQUNBLFFBQUEsSUFBQTs7Ozs7SUFLQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx1QkFBQSxDQUFBLFNBQUEsVUFBQSxlQUFBLGVBQUEsV0FBQTs7O0FBR0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsXHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICAnYXBwLmNvbnRyb2xsZXJzJyxcclxuICAgICAgICAgICAgJ2FwcC5maWx0ZXJzJyxcclxuICAgICAgICAgICAgJ2FwcC5zZXJ2aWNlcycsXHJcbiAgICAgICAgICAgICdhcHAuZGlyZWN0aXZlcycsXHJcbiAgICAgICAgICAgICdhcHAucm91dGVzJyxcclxuICAgICAgICAgICAgJ2FwcC5jb25maWcnXHJcbiAgICAgICAgXSkuY29uc3RhbnQoJ215Q29uZmlnJyxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICdtYXRlcmlhbFNldHNMU0tleSc6ICdtYXRlcmlhbFNldHMnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycsIFsndWkucm91dGVyJywgJ3NhdGVsbGl6ZXInLCAncmVzdGFuZ3VsYXInLCAnYW5ndWxhci1tb21lbnRqcycsICduZ01hdGVyaWFsJywgJ25nRmlsZVVwbG9hZCddKTtcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJywgWyd1aS5yb3V0ZXInLCAnc2F0ZWxsaXplciddKTtcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnLCBbJ3VpLnJvdXRlcicsICduZ01hdGVyaWFsJywgJ3Jlc3Rhbmd1bGFyJywgJ2FuZ3VsYXItbW9tZW50anMnLCAnYXBwLnNlcnZpY2VzJywgJ25nTWVzc2FnZXMnLCAnbmdNZEljb25zJywgJ21kLmRhdGEudGFibGUnLCAnaGlnaGNoYXJ0cy1uZycsICduZ0Nvb2tpZXMnXSk7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnLCBbXSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJywgWydhbmd1bGFyLW1vbWVudGpzJywgJ25nQW5pbWF0ZSddKTtcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJywgW10pO1xyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gQ29uZmlndXJhdGlvbiBzdHVmZlxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24gKCRhdXRoUHJvdmlkZXIpXHJcbiAgICB7XHJcbiAgICAgICAgLy8gU2F0ZWxsaXplciBjb25maWd1cmF0aW9uIHRoYXQgc3BlY2lmaWVzIHdoaWNoIEFQSVxyXG4gICAgICAgIC8vIHJvdXRlIHRoZSBKV1Qgc2hvdWxkIGJlIHJldHJpZXZlZCBmcm9tXHJcbiAgICAgICAgJGF1dGhQcm92aWRlci5sb2dpblVybCA9ICcvYXBpL2F1dGhlbnRpY2F0ZSc7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoJG1vbWVudFByb3ZpZGVyKVxyXG4gICAge1xyXG4gICAgICAgICRtb21lbnRQcm92aWRlclxyXG4gICAgICAgICAgICAuYXN5bmNMb2FkaW5nKGZhbHNlKVxyXG4gICAgICAgICAgICAuc2NyaXB0VXJsKCcvL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9tb21lbnQuanMvMi41LjEvbW9tZW50Lm1pbi5qcycpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoIGZ1bmN0aW9uKFJlc3Rhbmd1bGFyUHJvdmlkZXIpIHtcclxuICAgICAgICBSZXN0YW5ndWxhclByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zZXRCYXNlVXJsKCcvYXBpLycpXHJcbiAgICAgICAgICAgIC5zZXREZWZhdWx0SGVhZGVycyh7IGFjY2VwdDogXCJhcHBsaWNhdGlvbi94LmxhcmF2ZWwudjEranNvblwiIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoIGZ1bmN0aW9uKCRtZFRoZW1pbmdQcm92aWRlcikge1xyXG4gICAgICAgIC8qIEZvciBtb3JlIGluZm8sIHZpc2l0IGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhcmpzLm9yZy8jL1RoZW1pbmcvMDFfaW50cm9kdWN0aW9uICovXHJcblxyXG4gICAgICAgIHZhciBjdXN0b21CbHVlTWFwID0gJG1kVGhlbWluZ1Byb3ZpZGVyLmV4dGVuZFBhbGV0dGUoJ2xpZ2h0LWJsdWUnLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgJ2NvbnRyYXN0RGVmYXVsdENvbG9yJzogJ2xpZ2h0JyxcclxuICAgICAgICAgICAgJ2NvbnRyYXN0RGFya0NvbG9ycyc6IFsnNTAnXSxcclxuICAgICAgICAgICAgJzUwJzogJ2ZmZmZmZidcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJG1kVGhlbWluZ1Byb3ZpZGVyLmRlZmluZVBhbGV0dGUoJ2N1c3RvbUJsdWUnLCBjdXN0b21CbHVlTWFwKTtcclxuICAgICAgICAkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2RlZmF1bHQnKVxyXG4gICAgICAgICAgICAucHJpbWFyeVBhbGV0dGUoJ2N1c3RvbUJsdWUnLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAnZGVmYXVsdCc6ICc1MDAnLFxyXG4gICAgICAgICAgICAgICAgJ2h1ZS0xJzogJzUwJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYWNjZW50UGFsZXR0ZSgncGluaycpO1xyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uKCRtZERhdGVMb2NhbGVQcm92aWRlcilcclxuICAgIHtcclxuICAgICAgICAkbWREYXRlTG9jYWxlUHJvdmlkZXIuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZihkYXRlICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSkuZm9ybWF0KCdNTS1ERC1ZWVlZJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQ2hlY2sgZm9yIGF1dGhlbnRpY2F0ZWQgdXNlciBvbiBldmVyeSByZXF1ZXN0XHJcbiAgICBhcHAucnVuKFsnJHJvb3RTY29wZScsICckbG9jYXRpb24nLCAnJHN0YXRlJywgJ0F1dGhTZXJ2aWNlJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRsb2NhdGlvbiwgJHN0YXRlLCBBdXRoU2VydmljZSkge1xyXG5cclxuICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMsIG9wdGlvbnMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdBdHRlbXB0aW5nIHRvIGdldCB1cmw6IFsnICsgdG9TdGF0ZS5uYW1lICsgJ10nKTtcclxuICAgICAgICAgICAgLy8gTGV0IGFueW9uZSBnbyB0byB0aGUgbG9naW4gcGFnZSwgY2hlY2sgYXV0aCBvbiBhbGwgb3RoZXIgcGFnZXNcclxuICAgICAgICAgICAgaWYodG9TdGF0ZS5uYW1lICE9PSAnYXBwLmxvZ2luJylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoIUF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidXNlciBub3QgbG9nZ2VkIGluLCByZWRpcmVjdCB0byBsb2dpbiBwYWdlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAubG9naW4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfV0pO1xyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24oKVxyXG57XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAucm91dGVzJykuY29uZmlnKCBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkYXV0aFByb3ZpZGVyICkge1xyXG5cclxuICAgICAgICB2YXIgZ2V0VmlldyA9IGZ1bmN0aW9uKCB2aWV3TmFtZSApe1xyXG4gICAgICAgICAgICByZXR1cm4gJy92aWV3cy9hcHAvJyArIHZpZXdOYW1lICsgJy5odG1sJztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvcHVyY2hhc2VvcmRlcnMnKTtcclxuXHJcblxyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwJywge1xyXG4gICAgICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnaGVhZGVyJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIZWFkZXJDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybEhlYWRlcidcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGZvb3Rlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnZm9vdGVyJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdGb290ZXJDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybEZvb3RlcidcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG1haW46IHt9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmxvZ2luJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2xvZ2luJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnbG9naW4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxMb2dpbidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmxhbmRpbmcnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvbGFuZGluZycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xhbmRpbmcnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xhbmRpbmdDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybExhbmRpbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5wcm9kdWN0cycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9wcm9kdWN0cycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3Byb2R1Y3RzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9kdWN0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQcm9kdWN0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucHJvZHVjdHMuZGV0YWlsJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2RldGFpbC86cHJvZHVjdElkJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncHJvZHVjdC5kZXRhaWwnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Byb2R1Y3REZXRhaWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFByb2R1Y3REZXRhaWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5wcm9kdWN0cy5jcmVhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvY3JlYXRlJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncHJvZHVjdC5jcmVhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Byb2R1Y3RDcmVhdGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFByb2R1Y3RDcmVhdGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5jdXN0b21lcnMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvY3VzdG9tZXJzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnY3VzdG9tZXJzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDdXN0b21lckNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsQ3VzdG9tZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5jdXN0b21lcnMuY3JlYXRlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NyZWF0ZScsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2N1c3RvbWVyLmNyZWF0ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ3VzdG9tZXJDcmVhdGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybEN1c3RvbWVyQ3JlYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuY3VzdG9tZXJzLmRldGFpbCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9kZXRhaWwvOmN1c3RvbWVySWQnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdjdXN0b21lci5kZXRhaWwnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0N1c3RvbWVyRGV0YWlsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxDdXN0b21lckRldGFpbCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLndvcmtvcmRlcnMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvd29ya29yZGVycycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3dvcmtvcmRlcnMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtPcmRlckNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsV29ya09yZGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAud29ya29yZGVycy5jcmVhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvY3JlYXRlJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0Vmlldygnd29ya29yZGVyLmNyZWF0ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnV29ya09yZGVyQ3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxXb3JrT3JkZXJDcmVhdGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC53b3Jrb3JkZXJzLmRldGFpbCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9kZXRhaWwvOndvcmtPcmRlcklkJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0Vmlldygnd29ya29yZGVyLmRldGFpbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnV29ya09yZGVyRGV0YWlsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxXb3JrT3JkZXJEZXRhaWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5ldmVudHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZXZlbnRzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnZXZlbnRzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFdmVudENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsRXZlbnQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5ldmVudHMuY3JlYXRlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NyZWF0ZScsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2V2ZW50LmNyZWF0ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRXZlbnRDcmVhdGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybEV2ZW50Q3JlYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuZXZlbnRzLmRldGFpbCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9kZXRhaWwvOmV2ZW50SWQnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdldmVudC5kZXRhaWwnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0V2ZW50RGV0YWlsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxFdmVudERldGFpbCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnJlcG9ydHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcmVwb3J0cycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3JlcG9ydHMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcG9ydENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUmVwb3J0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucmVwb3J0cy5jdXJyZW50c3RvY2snLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvY3VycmVudHN0b2NrJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncmVwb3J0LmN1cnJlbnRzdG9jaycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVwb3J0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxSZXBvcnQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5yZXBvcnRzLnNhbGVzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3NhbGVzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncmVwb3J0LnNhbGVzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXBvcnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFJlcG9ydCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnJlcG9ydHMuc2FsZXNieW1vbnRoJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3NhbGVzYnltb250aCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3JlcG9ydC5zYWxlc2J5bW9udGgnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcG9ydENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUmVwb3J0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucmVwb3J0cy5pbmNvbWVieW1vbnRoJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2luY29tZWJ5bW9udGgnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdyZXBvcnQuaW5jb21lYnltb250aCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVwb3J0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxSZXBvcnQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5yZXBvcnRzLnByb2R1Y3Rwcm9maXRwZXJjZW50cycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9wcm9kdWN0cHJvZml0cGVyY2VudHMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdyZXBvcnQucHJvZHVjdHByb2ZpdHBlcmNlbnRzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXBvcnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFJlcG9ydCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnJlcG9ydHMud2Vla3dvcmtvcmRlcnMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvd2Vla3dvcmtvcmRlcnMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdyZXBvcnQud2Vla3dvcmtvcmRlcnMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcG9ydENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUmVwb3J0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAudW5pdHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvdW5pdHMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd1bml0cycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVW5pdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsVW5pdCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnVuaXRzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd1bml0LmNyZWF0ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVW5pdENyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsVW5pdENyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnVuaXRzLmRldGFpbCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9kZXRhaWwvOnVuaXRJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3VuaXQuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdVbml0RGV0YWlsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxVbml0RGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAubWF0ZXJpYWxzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL21hdGVyaWFscycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ21hdGVyaWFscycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWF0ZXJpYWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybE1hdGVyaWFsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAubWF0ZXJpYWxzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdtYXRlcmlhbC5jcmVhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01hdGVyaWFsQ3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxNYXRlcmlhbENyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLm1hdGVyaWFscy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzptYXRlcmlhbElkJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnbWF0ZXJpYWwuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNYXRlcmlhbERldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsTWF0ZXJpYWxEZXRhaWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5wdXJjaGFzZW9yZGVycycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9wdXJjaGFzZW9yZGVycycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3B1cmNoYXNlb3JkZXJzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQdXJjaGFzZU9yZGVyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQdXJjaGFzZU9yZGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucHVyY2hhc2VvcmRlcnMuY3JlYXRlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NyZWF0ZScsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3B1cmNoYXNlb3JkZXIuY3JlYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQdXJjaGFzZU9yZGVyQ3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQdXJjaGFzZU9yZGVyQ3JlYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucHVyY2hhc2VvcmRlcnMuZGV0YWlsJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2RldGFpbC86cHVyY2hhc2VPcmRlcklkJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncHVyY2hhc2VvcmRlci5kZXRhaWwnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1B1cmNoYXNlT3JkZXJEZXRhaWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFB1cmNoYXNlT3JkZXJEZXRhaWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5wYXltZW50dHlwZXMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcGF5bWVudHR5cGVzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncGF5bWVudHR5cGVzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQYXltZW50VHlwZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUGF5bWVudFR5cGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5wYXltZW50dHlwZXMuY3JlYXRlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NyZWF0ZScsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3BheW1lbnR0eXBlLmNyZWF0ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUGF5bWVudFR5cGVDcmVhdGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFBheW1lbnRUeXBlQ3JlYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucGF5bWVudHR5cGVzLmRldGFpbCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9kZXRhaWwvOnBheW1lbnRUeXBlSWQnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwYXltZW50dHlwZS5kZXRhaWwnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1BheW1lbnRUeXBlRGV0YWlsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQYXltZW50VHlwZURldGFpbCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmxvb2t1cHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvbG9va3VwcycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xvb2t1cHMnKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAubWF0ZXJpYWxzZXRzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL21hdGVyaWFsc2V0cycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ21hdGVyaWFsc2V0cycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWF0ZXJpYWxTZXRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybE1hdGVyaWFsU2V0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIDtcclxuXHJcbiAgICB9ICk7XHJcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdtQXBwTG9hZGluZycsIGZ1bmN0aW9uICgkYW5pbWF0ZSlcclxue1xyXG4gICAgLy8gUmV0dXJuIHRoZSBkaXJlY3RpdmUgY29uZmlndXJhdGlvbi5cclxuICAgIHJldHVybih7XHJcbiAgICAgICAgbGluazogbGluayxcclxuICAgICAgICByZXN0cmljdDogXCJDXCJcclxuICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIGxpbmsoIHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGVzIClcclxuICAgIHtcclxuICAgICAgICAvLyBEdWUgdG8gdGhlIHdheSBBbmd1bGFySlMgcHJldmVudHMgYW5pbWF0aW9uIGR1cmluZyB0aGUgYm9vdHN0cmFwXHJcbiAgICAgICAgLy8gb2YgdGhlIGFwcGxpY2F0aW9uLCB3ZSBjYW4ndCBhbmltYXRlIHRoZSB0b3AtbGV2ZWwgY29udGFpbmVyOyBidXQsXHJcbiAgICAgICAgLy8gc2luY2Ugd2UgYWRkZWQgXCJuZ0FuaW1hdGVDaGlsZHJlblwiLCB3ZSBjYW4gYW5pbWF0ZWQgdGhlIGlubmVyXHJcbiAgICAgICAgLy8gY29udGFpbmVyIGR1cmluZyB0aGlzIHBoYXNlLlxyXG4gICAgICAgIC8vIC0tXHJcbiAgICAgICAgLy8gTk9URTogQW0gdXNpbmcgLmVxKDEpIHNvIHRoYXQgd2UgZG9uJ3QgYW5pbWF0ZSB0aGUgU3R5bGUgYmxvY2suXHJcbiAgICAgICAgJGFuaW1hdGUubGVhdmUoIGVsZW1lbnQuY2hpbGRyZW4oKS5lcSggMSApICkudGhlbihcclxuICAgICAgICAgICAgZnVuY3Rpb24gY2xlYW51cEFmdGVyQW5pbWF0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSByb290IGRpcmVjdGl2ZSBlbGVtZW50LlxyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDbGVhciB0aGUgY2xvc2VkLW92ZXIgdmFyaWFibGUgcmVmZXJlbmNlcy5cclxuICAgICAgICAgICAgICAgIHNjb3BlID0gZWxlbWVudCA9IGF0dHJpYnV0ZXMgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbn0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGJ5b3VuZyBvbiAzLzE4LzIwMTYuXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdmb2N1c09uJywgZnVuY3Rpb24gKClcclxue1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbGVtLCBhdHRyKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGF0dHIuZm9jdXNPbik7XHJcblxyXG4gICAgICAgIHNjb3BlLiRvbignZm9jdXNPbicsIGZ1bmN0aW9uKGUsIG5hbWUpXHJcbiAgICAgICAge1xyXG5cclxuY29uc29sZS5sb2coJ25hbWUgaXMnICsgbmFtZSk7XHJcbiAgICAgICAgICAgIGlmKG5hbWUgPT09IGF0dHIuZm9jdXNPbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmb3VuZCBlbGVtXCIpO1xyXG4gICAgICAgICAgICAgICAgZWxlbVswXS5mb2N1cygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKVxyXG4gICAgLmRpcmVjdGl2ZSgndXRjUGFyc2VyJywgZnVuY3Rpb24gKClcclxuICAgIHtcclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbmdNb2RlbCkge1xyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkluIHV0Y1BhcnNlciBkaXJlY3RpdmVcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgcGFyc2VyID0gZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICAgICAgdmFsID0gbW9tZW50LnV0Yyh2YWwpLmZvcm1hdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtYXR0ZXIgPSBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YWwgPSBuZXcgRGF0ZSh2YWwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIG5nTW9kZWwuJHBhcnNlcnMudW5zaGlmdChwYXJzZXIpO1xyXG4gICAgICAgICAgICBuZ01vZGVsLiRmb3JtYXR0ZXJzLnVuc2hpZnQoZm9ybWF0dGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJ1xyXG4gICAgICAgIH07XHJcbiAgICB9KTsiLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLmZpbHRlcnNcIikuZmlsdGVyKCd0cnVuY2F0ZU5hbWUnLCBmdW5jdGlvbigpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBtYXhMZW5ndGgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnB1dCA9IGlucHV0IHx8IFwiXCI7XHJcbiAgICAgICAgICAgIHZhciBvdXQgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgaWYoaW5wdXQubGVuZ3RoID4gbWF4TGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBvdXQgPSBpbnB1dC5zdWJzdHIoMCwgbWF4TGVuZ3RoKSArIFwiLi4uXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBvdXQgPSBpbnB1dDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG91dDtcclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBieW91bmcgb24gMy8xNC8yMDE2LlxyXG4gKi9cclxuKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdBdXRoU2VydmljZScsIFsnJGF1dGgnLCAnJHN0YXRlJywgZnVuY3Rpb24oJGF1dGgsICRzdGF0ZSkge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICAgICAgbG9naW46IGZ1bmN0aW9uKGVtYWlsLCBwYXNzd29yZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNyZWRlbnRpYWxzID0geyBlbWFpbDogZW1haWwsIHBhc3N3b3JkOiBwYXNzd29yZCB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coY3JlZGVudGlhbHMpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFVzZSBTYXRlbGxpemVyJ3MgJGF1dGggc2VydmljZSB0byBsb2dpbiBiZWNhdXNlIGl0J2xsIGF1dG9tYXRpY2FsbHkgc2F2ZSB0aGUgSldUIGluIGxvY2FsU3RvcmFnZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRhdXRoLmxvZ2luKGNyZWRlbnRpYWxzKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGlzQXV0aGVudGljYXRlZDogZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGF1dGguaXNBdXRoZW50aWNhdGVkKCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBsb2dvdXQ6IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgJGF1dGgubG9nb3V0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1dKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgQnJlZW4gb24gMTUvMDIvMjAxNi5cclxuICovXHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0NoYXJ0U2VydmljZScsIFsnJGF1dGgnLCAnUmVzdGFuZ3VsYXInLCAnJG1vbWVudCcsIGZ1bmN0aW9uKCRhdXRoLCBSZXN0YW5ndWxhciwgJG1vbWVudCl7XHJcblxyXG4gICAgICAgIHZhciBwaWVDb25maWcgPSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIGNoYXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3BpZSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBwbG90T3B0aW9uczpcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBwaWU6XHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxvd1BvaW50U2VsZWN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUxhYmVsczpcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93SW5MZWdlbmQ6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0aXRsZTpcclxuICAgICAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbG9hZGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgc2l6ZTpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDQwMCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogMjUwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgICAgIGdldE1vbnRobHlTYWxlc1JlcG9ydDogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgICAgICBzY29wZS5jaGFydENvbmZpZyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29sdW1uJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5QXhpczpcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJyMgb2Ygc2FsZXMnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhBeGlzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZGF0ZXRpbWUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZVRpbWVMYWJlbEZvcm1hdHM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9udGg6ICclYicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeWVhcjogJyViJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdEYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1NhbGVzIHBlciBtb250aCdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgncmVwb3J0cy9nZXRNb250aGx5U2FsZXNSZXBvcnQnKS5wb3N0KHsgJ3JlcG9ydFBhcmFtcyc6IHt9fSkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhU2V0ID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb25lRGF0YVBvaW50ID0gZGF0YVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhvbmVEYXRhUG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhU2V0LnB1c2goW0RhdGUuVVRDKHBhcnNlSW50KG9uZURhdGFQb2ludC55ZWFyKSwgcGFyc2VJbnQob25lRGF0YVBvaW50Lm1vbnRoKSAtIDEpLCBwYXJzZUludChvbmVEYXRhUG9pbnQucG9jb3VudCldKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmNoYXJ0Q29uZmlnLnNlcmllcyA9IFt7bmFtZTogJ1NhbGVzIHRoaXMgbW9udGgnLCBkYXRhOiBkYXRhU2V0IH1dO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jaGFydENvbmZpZy5sb2FkaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRNb250aGx5SW5jb21lUmVwb3J0OiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgICAgIHNjb3BlLmNoYXJ0Q29uZmlnID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjb2x1bW4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHlBeGlzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnJCBhbW91bnQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhBeGlzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZGF0ZXRpbWUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZVRpbWVMYWJlbEZvcm1hdHM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9udGg6ICclYicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeWVhcjogJyViJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdEYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ0luY29tZSBwZXIgbW9udGgnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3JlcG9ydHMvZ2V0TW9udGhseVNhbGVzUmVwb3J0JykucG9zdCh7ICdyZXBvcnRQYXJhbXMnOiB7fX0pLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhU2V0ID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb25lRGF0YVBvaW50ID0gZGF0YVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cob25lRGF0YVBvaW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFTZXQucHVzaChbRGF0ZS5VVEMocGFyc2VJbnQob25lRGF0YVBvaW50LnllYXIpLCBwYXJzZUludChvbmVEYXRhUG9pbnQubW9udGgpIC0gMSksIHBhcnNlRmxvYXQob25lRGF0YVBvaW50Lm1vbnRodG90YWwpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmNoYXJ0Q29uZmlnLnNlcmllcyA9IFt7bmFtZTogJ0luY29tZSB0aGlzIG1vbnRoJywgZGF0YTogZGF0YVNldCB9XTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmNoYXJ0Q29uZmlnLmxvYWRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0VG9wU2VsbGluZ1Byb2R1Y3RzOiBmdW5jdGlvbihzY29wZSwgY2hhcnRUaXRsZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhcnRUaXRsZSk7XHJcbiAgICAgICAgICAgICAgICBzY29wZS50b3BTZWxsaW5nQ2hhcnRDb25maWcgPSB7fTtcclxuICAgICAgICAgICAgICAgIHNjb3BlLnRvcFNlbGxpbmdDaGFydENvbmZpZyA9IGpRdWVyeS5leHRlbmQodHJ1ZSwge30sIHBpZUNvbmZpZyk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncmVwb3J0cy9nZXRUb3BTZWxsaW5nUHJvZHVjdHMnKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFTZXQgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvbmVEYXRhUG9pbnQgPSBkYXRhW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKG9uZURhdGFQb2ludCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFTZXQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBvbmVEYXRhUG9pbnQubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkOiAoaSA9PT0gMCkgPyB0cnVlIDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGljZWQ6IChpID09PSAwKSA/IHRydWUgOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IHBhcnNlSW50KG9uZURhdGFQb2ludC5wY291bnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUudG9wU2VsbGluZ0NoYXJ0Q29uZmlnLnNlcmllcyA9IFt7bmFtZTogJ1NvbGQnLCBkYXRhOiBkYXRhU2V0IH1dO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnRvcFNlbGxpbmdDaGFydENvbmZpZy50aXRsZS50ZXh0ID0gY2hhcnRUaXRsZTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS50b3BTZWxsaW5nQ2hhcnRDb25maWcubG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRXJyb3JcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0UHJvZHVjdFByb2ZpdFBlcmNlbnRzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUucHJvZHVjdFByb2ZpdFBlcmNlbnRDaGFydENvbmZpZyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29sdW1uJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhBeGlzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY2F0ZWdvcnknXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHlBeGlzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdQcm9maXQgJSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdQcm9kdWN0IFByb2ZpdCAlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmc6IHRydWVcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncmVwb3J0cy9nZXRQcm9kdWN0UHJvZml0UGVyY2VudHMnKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YVNldCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9uZURhdGFQb2ludCA9IGRhdGFbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYob25lRGF0YVBvaW50LmNvc3QgPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9maXQgPSBvbmVEYXRhUG9pbnQucHJpY2UgLSBvbmVEYXRhUG9pbnQuY29zdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvZml0UGVyY2VudCA9IChwcm9maXQgLyBvbmVEYXRhUG9pbnQuY29zdCAqIDEwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ1ByaWNlOicgKyBvbmVEYXRhUG9pbnQucHJpY2UgKyAnIENvc3Q6JyArIG9uZURhdGFQb2ludC5jb3N0ICsgJyBQcm9maXQ6JyArIE1hdGgucm91bmQocHJvZml0UGVyY2VudCAqIDEwMCkgLyAxMDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ1ByaWNlOicgKyBvbmVEYXRhUG9pbnQucHJpY2UgKyAnIENvc3Q6JyArIG9uZURhdGFQb2ludC5jb3N0ICsgJyBQcm9maXQ6JyArIHByb2ZpdFBlcmNlbnQudG9GaXhlZCgwKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFTZXQucHVzaChbb25lRGF0YVBvaW50Lm5hbWUsIHBhcnNlSW50KHByb2ZpdFBlcmNlbnQudG9GaXhlZCgwKSldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVNldC5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludChiWzFdKSAtIHBhcnNlSW50KGFbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGFTZXQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvZHVjdFByb2ZpdFBlcmNlbnRDaGFydENvbmZpZy5zZXJpZXMgPSBbe25hbWU6ICdQcm9maXQgJScsIGRhdGE6IGRhdGFTZXQgfV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnByb2R1Y3RQcm9maXRQZXJjZW50Q2hhcnRDb25maWcubG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfTtcclxuICAgIH1dKTtcclxufSkoKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBCcmVlbiBvbiAxNS8wMi8yMDE2LlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnRGlhbG9nU2VydmljZScsIGZ1bmN0aW9uKCAkbWREaWFsb2cgKXtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgICAgIGZyb21DdXN0b206IGZ1bmN0aW9uKG9wdGlvbnMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkbWREaWFsb2cuc2hvdyhvcHRpb25zKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGZyb21UZW1wbGF0ZTogZnVuY3Rpb24oZXYsIHRlbXBsYXRlLCBzY29wZSApIHtcclxuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpYWxvZ3MvJyArIHRlbXBsYXRlICsgJy5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBlc2NhcGVUb0Nsb3NlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiBEaWFsb2dDb250cm9sbGVyKCRzY29wZSwgJG1kRGlhbG9nKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbmZpcm1EaWFsb2cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNhbmNlbERpYWxvZyA9IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmNhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoZXYgIT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy50YXJnZXRFdmVudCA9IGV2O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggc2NvcGUgKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2NvcGUgPSBzY29wZS4kbmV3KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9vcHRpb25zLnByZXNlcnZlU2NvcGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiAkbWREaWFsb2cuc2hvdyhvcHRpb25zKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGhpZGU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJG1kRGlhbG9nLmhpZGUoKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFsZXJ0OiBmdW5jdGlvbih0aXRsZSwgY29udGVudCl7XHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuc2hvdyhcclxuICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuYWxlcnQoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGl0bGUodGl0bGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jb250ZW50KGNvbnRlbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vaygnT2snKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGNvbmZpcm06IGZ1bmN0aW9uKGV2ZW50LCB0aXRsZSwgY29udGVudClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbmZpcm0gPSAkbWREaWFsb2cuY29uZmlybSgpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRpdGxlKHRpdGxlKVxyXG4gICAgICAgICAgICAgICAgICAgIC50ZXh0Q29udGVudChjb250ZW50KVxyXG4gICAgICAgICAgICAgICAgICAgIC5hcmlhTGFiZWwoJycpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRhcmdldEV2ZW50KGV2ZW50KVxyXG4gICAgICAgICAgICAgICAgICAgIC5vaygnWWVzJylcclxuICAgICAgICAgICAgICAgICAgICAuY2FuY2VsKCdObycpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiAkbWREaWFsb2cuc2hvdyhjb25maXJtKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbn0pKCk7IiwiXHJcbihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnRm9jdXNTZXJ2aWNlJywgWyckcm9vdFNjb3BlJywgJyR0aW1lb3V0JywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHRpbWVvdXQpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG5hbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdmb2N1c09uJywgbmFtZSk7XHJcbiAgICAgICAgICAgIH0sMTAwKTtcclxuICAgICAgICB9O1xyXG4gICAgfV0pO1xyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGJ5b3VuZyBvbiAzLzE0LzIwMTYuXHJcbiAqL1xyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0d1aWRTZXJ2aWNlJywgW2Z1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBzNCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMClcclxuICAgICAgICAgICAgICAgIC50b1N0cmluZygxNilcclxuICAgICAgICAgICAgICAgIC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICAgICAgbmV3R3VpZDogZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gczQoKSArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArXHJcbiAgICAgICAgICAgICAgICAgICAgczQoKSArICctJyArIHM0KCkgKyBzNCgpICsgczQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfV0pO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBCcmVlbiBvbiAxNS8wMi8yMDE2LlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnUmVzdFNlcnZpY2UnLCBbJyRhdXRoJywgJ1Jlc3Rhbmd1bGFyJywgJyRtb21lbnQnLCBmdW5jdGlvbigkYXV0aCwgUmVzdGFuZ3VsYXIsICRtb21lbnQpe1xyXG5cclxuICAgICAgICB2YXIgYmFzZVByb2R1Y3RzID0gUmVzdGFuZ3VsYXIuYWxsKCdwcm9kdWN0Jyk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcblxyXG4gICAgICAgICAgICBnZXRBbGxQcm9kdWN0czogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGJhc2VQcm9kdWN0cy5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvZHVjdHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRQcm9kdWN0OiBmdW5jdGlvbihzY29wZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncHJvZHVjdCcsIGlkKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBIYWNrIGZvciBPTEQgbXlzcWwgZHJpdmVycyBvbiBIb3N0Z2F0b3Igd2hpY2ggZG9uJ3QgcHJvcGVybHkgZW5jb2RlIGludGVnZXIgYW5kIHJldHVybiB0aGVtIGFzIHN0cmluZ3NcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLmlzX2N1c3RvbSA9IHBhcnNlSW50KGRhdGEuaXNfY3VzdG9tKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5wcm9kdWN0ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsQ3VzdG9tZXJzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdjdXN0b21lcicpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXN0b21lcnMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRDdXN0b21lcjogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ2N1c3RvbWVyJywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmN1c3RvbWVyID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsV29ya09yZGVyczogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnd29ya29yZGVyJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLndvcmtvcmRlcnMgPSBkYXRhO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0V29ya09yZGVyOiBmdW5jdGlvbihzY29wZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnd29ya29yZGVyJywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBGb3JtYXQgc3RyaW5nIGRhdGVzIGludG8gZGF0ZSBvYmplY3RzXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5zdGFydF9kYXRlID0gJG1vbWVudChkYXRhLnN0YXJ0X2RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuZW5kX2RhdGUgPSAkbW9tZW50KGRhdGEuZW5kX2RhdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBIYWNrIGZvciBPTEQgbXlzcWwgZHJpdmVycyBvbiBIb3N0Z2F0b3Igd2hpY2ggZG9uJ3QgcHJvcGVybHkgZW5jb2RlIGludGVnZXIgYW5kIHJldHVybiB0aGVtIGFzIHN0cmluZ3NcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLmNvbXBsZXRlZCA9IHBhcnNlSW50KGRhdGEuY29tcGxldGVkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi53b3Jrb3JkZXIgPSBkYXRhO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUud29ya29yZGVyID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsRXZlbnRzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdldmVudCcpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5ldmVudHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRFdmVudDogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ2V2ZW50JywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmV2ZW50ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsVW5pdHM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3VuaXQnKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUudW5pdHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRVbml0OiBmdW5jdGlvbihzY29wZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgndW5pdCcsIGlkKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS51bml0ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsTWF0ZXJpYWxzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdtYXRlcmlhbCcpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5tYXRlcmlhbHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRNYXRlcmlhbDogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ21hdGVyaWFsJywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLm1hdGVyaWFsID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZG9TZWFyY2g6IGZ1bmN0aW9uKHNjb3BlLCBxdWVyeSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDYWxsIFdTIHdpdGg6IFwiICsgcXVlcnkpO1xyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnc2VhcmNoJywgcXVlcnkpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsUHVyY2hhc2VPcmRlcnM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3B1cmNoYXNlb3JkZXInKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucHVyY2hhc2VvcmRlcnMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRQdXJjaGFzZU9yZGVyOiBmdW5jdGlvbihzY29wZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncHVyY2hhc2VvcmRlcicsIGlkKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRm9ybWF0IHN0cmluZyBkYXRlcyBpbnRvIGRhdGUgb2JqZWN0c1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEucGlja3VwX2RhdGUgPSAkbW9tZW50KGRhdGEucGlja3VwX2RhdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBIYWNrIGZvciBPTEQgbXlzcWwgZHJpdmVycyBvbiBIb3N0Z2F0b3Igd2hpY2ggZG9uJ3QgcHJvcGVybHkgZW5jb2RlIGludGVnZXIgYW5kIHJldHVybiB0aGVtIGFzIHN0cmluZ3NcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLmZ1bGZpbGxlZCA9IHBhcnNlSW50KGRhdGEuZnVsZmlsbGVkKTtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLnBhaWQgPSBwYXJzZUludChkYXRhLnBhaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5wdXJjaGFzZW9yZGVyID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsUGF5bWVudFR5cGVzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdwYXltZW50dHlwZScpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5wYXltZW50dHlwZXMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRQYXltZW50VHlwZTogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3BheW1lbnR0eXBlJywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnBheW1lbnR0eXBlID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0TWF0ZXJpYWxBbGxUeXBlczogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnbWF0ZXJpYWx0eXBlJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLm1hdGVyaWFsdHlwZXMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRGdWxseUJvb2tlZERheXM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3NjaGVkdWxlci9nZXRGdWxseUJvb2tlZERheXMnKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmJvb2tlZERheXMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZEN1c3RvbWVyOiBmdW5jdGlvbihvYmopXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5hbGwoJ2N1c3RvbWVyJykucG9zdChvYmopO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkUHJvZHVjdDogZnVuY3Rpb24ob2JqKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIuYWxsKCdwcm9kdWN0JykucG9zdChvYmopO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH07XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgQnJlZW4gb24gMTUvMDIvMjAxNi5cclxuICovXHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ1RvYXN0U2VydmljZScsIGZ1bmN0aW9uKCAkbWRUb2FzdCApe1xyXG5cclxuICAgICAgICB2YXIgZGVsYXkgPSA2MDAwLFxyXG4gICAgICAgICAgICBwb3NpdGlvbiA9ICd0b3AgcmlnaHQnLFxyXG4gICAgICAgICAgICBhY3Rpb24gPSAnT0snO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzaG93OiBmdW5jdGlvbihjb250ZW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJG1kVG9hc3Quc2hvdyhcclxuICAgICAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaW1wbGUoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY29udGVudChjb250ZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucG9zaXRpb24ocG9zaXRpb24pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hY3Rpb24oYWN0aW9uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuaGlkZURlbGF5KGRlbGF5KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ1VwbG9hZFNlcnZpY2UnLCBbJ1VwbG9hZCcsIGZ1bmN0aW9uKFVwbG9hZCkge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICAgICAgdXBsb2FkRmlsZTogZnVuY3Rpb24gKGZpbGVuYW1lLCBmaWxlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YU9iaiA9IHtmaWxlOiBmaWxlIH07XHJcbiAgICAgICAgICAgICAgICBpZihmaWxlbmFtZSAhPT0gJycpIHsgZGF0YU9iai5maWxlbmFtZSA9IGZpbGVuYW1lOyB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFVwbG9hZC51cGxvYWQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2FwaS91cGxvYWRlci91cGxvYWRGaWxlJyxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhT2JqXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGRlbGV0ZUZpbGU6IGZ1bmN0aW9uKGZpbGVuYW1lKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YU9iaiA9IHtmaWxlbmFtZTogZmlsZW5hbWUgfTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVXBsb2FkLnVwbG9hZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnYXBpL3VwbG9hZGVyL2RlbGV0ZUZpbGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFPYmpcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1dKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgYnlvdW5nIG9uIDMvMTQvMjAxNi5cclxuICovXHJcbihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnVmFsaWRhdGlvblNlcnZpY2UnLCBbZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcblxyXG4gICAgICAgICAgICBkZWNpbWFsUmVnZXg6IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICdeXFxcXGQqXFxcXC4/XFxcXGQqJCc7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBudW1lcmljUmVnZXg6IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICdeXFxcXGQqJCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1dKTtcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBDb3JlQ29udHJvbGxlcigkc2NvcGUsICRzdGF0ZSwgJG1vbWVudCwgJG1kU2lkZW5hdiwgJG1kTWVkaWEsIEF1dGhTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIHRvZGF5ID0gbmV3IERhdGUoKTtcclxuXHJcbiAgICAgICAgJHNjb3BlLnRvZGF5c0RhdGUgPSB0b2RheTtcclxuICAgICAgICAkc2NvcGUuc2hvd1NlYXJjaCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAkc2NvcGUudG9nZ2xlU2lkZW5hdiA9IGZ1bmN0aW9uKG1lbnVJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICRtZFNpZGVuYXYobWVudUlkKS50b2dnbGUoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuc2hvd1NpZGVOYXYgPSBmdW5jdGlvbihtZW51SWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZighJG1kU2lkZW5hdihtZW51SWQpLmlzTG9ja2VkT3BlbigpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAkbWRTaWRlbmF2KG1lbnVJZCkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmhpZGVTaWRlTmF2ID0gZnVuY3Rpb24obWVudUlkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoISRtZFNpZGVuYXYobWVudUlkKS5pc0xvY2tlZE9wZW4oKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgJG1kU2lkZW5hdihtZW51SWQpLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUudG9nZ2xlU2VhcmNoID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgJHNjb3BlLnNob3dTZWFyY2ggPSAhJHNjb3BlLnNob3dTZWFyY2g7XHJcbiAgICAgICAgICAgIC8vaWYoJHNjb3BlLnNob3dTZWFyY2gpIHsgY29uc29sZS5sb2coYW5ndWxhci5lbGVtZW50KCcjc3VwZXJTZWFyY2gnKSk7IH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBMaXN0ZW4gZm9yIHRvZ2dsZVNlYXJjaCBldmVudHNcclxuICAgICAgICAkc2NvcGUuJG9uKFwidG9nZ2xlU2VhcmNoXCIsIGZ1bmN0aW9uIChldmVudCwgYXJncylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICRzY29wZS50b2dnbGVTZWFyY2goKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmRldGVybWluZUZhYlZpc2liaWxpdHkgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZigkc3RhdGUuaXMoXCJhcHAucHJvZHVjdHNcIikgfHwgJHN0YXRlLmlzKFwiYXBwLmN1c3RvbWVyc1wiKVxyXG4gICAgICAgICAgICAgICAgfHwgJHN0YXRlLmlzKFwiYXBwLnB1cmNoYXNlb3JkZXJzXCIpIHx8ICRzdGF0ZS5pcyhcImFwcC5wYXltZW50dHlwZXNcIilcclxuICAgICAgICAgICAgICAgIHx8ICRzdGF0ZS5pcyhcImFwcC53b3Jrb3JkZXJzXCIpIHx8ICRzdGF0ZS5pcyhcImFwcC5ldmVudHNcIilcclxuICAgICAgICAgICAgICAgIHx8ICRzdGF0ZS5pcyhcImFwcC51bml0c1wiKSB8fCAkc3RhdGUuaXMoXCJhcHAubWF0ZXJpYWxzXCIpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5hZGRGYWJOYXZpZ2F0ZSA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzdGF0ZS4kY3VycmVudC5uYW1lKTtcclxuICAgICAgICAgICAgdmFyIHVybCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHN3aXRjaCgkc3RhdGUuJGN1cnJlbnQubmFtZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImFwcC5wcm9kdWN0c1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IFwiYXBwLnByb2R1Y3RzLmNyZWF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImFwcC5jdXN0b21lcnNcIjpcclxuICAgICAgICAgICAgICAgICAgICB1cmwgPSBcImFwcC5jdXN0b21lcnMuY3JlYXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiYXBwLnB1cmNoYXNlb3JkZXJzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gXCJhcHAucHVyY2hhc2VvcmRlcnMuY3JlYXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiYXBwLnBheW1lbnR0eXBlc1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IFwiYXBwLnBheW1lbnR0eXBlcy5jcmVhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJhcHAud29ya29yZGVyc1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IFwiYXBwLndvcmtvcmRlcnMuY3JlYXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiYXBwLmV2ZW50c1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IFwiYXBwLmV2ZW50cy5jcmVhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJhcHAudW5pdHNcIjpcclxuICAgICAgICAgICAgICAgICAgICB1cmwgPSBcImFwcC51bml0cy5jcmVhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJhcHAubWF0ZXJpYWxzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gXCJhcHAubWF0ZXJpYWxzLmNyZWF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc3RhdGUuZ28odXJsKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuaXNBdXRoZW50aWNhdGVkID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBBdXRoU2VydmljZS5sb2dvdXQoKTtcclxuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAubG9naW4nKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ29yZUNvbnRyb2xsZXInLCBbJyRzY29wZScsICckc3RhdGUnLCAnJG1vbWVudCcsICckbWRTaWRlbmF2JywgJyRtZE1lZGlhJywgJ0F1dGhTZXJ2aWNlJywgQ29yZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gQ3VzdG9tZXJDcmVhdGVDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZUN1c3RvbWVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLmN1c3RvbWVyKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHNlbGYuY3VzdG9tZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdjdXN0b21lcicpLnBvc3QoYykudGhlbihmdW5jdGlvbihkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vJHN0YXRlLmdvKCdhcHAuY3VzdG9tZXJzLmRldGFpbCcsIHsnY3VzdG9tZXJJZCc6IGQubmV3SWR9KTtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBjcmVhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmN1c3RvbWVycycpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGNyZWF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ3VzdG9tZXJDcmVhdGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIEN1c3RvbWVyQ3JlYXRlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBDdXN0b21lckRldGFpbENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgVG9hc3RTZXJ2aWNlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJHN0YXRlUGFyYW1zKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRDdXN0b21lcihzZWxmLCAkc3RhdGVQYXJhbXMuY3VzdG9tZXJJZCk7XHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlQ3VzdG9tZXIgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmN1c3RvbWVyLnB1dCgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IHVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLmN1c3RvbWVyc1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZUN1c3RvbWVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5jdXN0b21lci5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5jdXN0b21lcnNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBEZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNob3dEZWxldGVDb25maXJtID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGV2LCAnRGVsZXRlIGN1c3RvbWVyPycsICdUaGlzIHdpbGwgYWxzbyBkZWxldGUgYW55IHdvcmsgb3JkZXJzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGN1c3RvbWVyJyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZUN1c3RvbWVyKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0N1c3RvbWVyRGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIEN1c3RvbWVyRGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBDdXN0b21lckNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsQ3VzdG9tZXJzKHNlbGYpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ3VzdG9tZXJDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCBDdXN0b21lckNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gRXZlbnRDcmVhdGVDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5ldmVudCA9IHt9O1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZUV2ZW50ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlzVmFsaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLmV2ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZSA9IHNlbGYuZXZlbnQ7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygkZXJyb3IpO1xyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnZXZlbnQnKS5wb3N0KGUpLnRoZW4oZnVuY3Rpb24oZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBjcmVhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmV2ZW50cycpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0V2ZW50Q3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIEV2ZW50Q3JlYXRlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBFdmVudERldGFpbENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMsIFRvYXN0U2VydmljZSwgRGlhbG9nU2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYuc2VsZWN0ZWRQcm9kdWN0ID0gXCJcIjtcclxuICAgICAgICBzZWxmLnNlbGVjdGVkUXVhbnRpdHkgPSAwO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0RXZlbnQoc2VsZiwgJHN0YXRlUGFyYW1zLmV2ZW50SWQpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFByb2R1Y3RzKHNlbGYpO1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZUV2ZW50ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlzVmFsaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9SZXN0U2VydmljZS51cGRhdGVQcm9kdWN0KHNlbGYsIHNlbGYucHJvZHVjdC5pZCk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmV2ZW50LnB1dCgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJ1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IHVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLmV2ZW50c1wiKTtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYWRkUHJvZHVjdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc2VsZWN0ZWRQcm9kdWN0KTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuZXZlbnQuZXZlbnRfcHJvZHVjdHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBldmVudF9pZDogc2VsZi5ldmVudC5pZCxcclxuICAgICAgICAgICAgICAgIHByb2R1Y3RfaWQ6IHNlbGYuc2VsZWN0ZWRQcm9kdWN0LmlkLFxyXG4gICAgICAgICAgICAgICAgcXVhbnRpdHk6IHNlbGYuc2VsZWN0ZWRRdWFudGl0eSxcclxuICAgICAgICAgICAgICAgIHByb2R1Y3Q6IHNlbGYuc2VsZWN0ZWRQcm9kdWN0XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFByb2R1Y3QgPSBcIlwiO1xyXG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkUXVhbnRpdHkgPSAwO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlUHJvZHVjdCA9IGZ1bmN0aW9uKGUsIHByb2R1Y3RJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleFRvUmVtb3ZlO1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgc2VsZi5ldmVudC5ldmVudF9wcm9kdWN0cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYocHJvZHVjdElkID09IHNlbGYuZXZlbnQuZXZlbnRfcHJvZHVjdHNbaV0ucHJvZHVjdF9pZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleFRvUmVtb3ZlID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coaW5kZXhUb1JlbW92ZSk7XHJcbiAgICAgICAgICAgIHNlbGYuZXZlbnQuZXZlbnRfcHJvZHVjdHMuc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlRXZlbnQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmV2ZW50LnJlbW92ZSgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBkZWxldGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWVsdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLmV2ZW50c1wiKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIERlbGV0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2hvd0RlbGV0ZUNvbmZpcm0gPSBmdW5jdGlvbihldilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZXYsICdEZWxldGUgZXZlbnQ/JywgJycpO1xyXG4gICAgICAgICAgICBkaWFsb2cudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5kZWxldGVFdmVudCgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFdmVudERldGFpbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCAnVG9hc3RTZXJ2aWNlJywgJ0RpYWxvZ1NlcnZpY2UnLCBFdmVudERldGFpbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gRXZlbnRDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbEV2ZW50cyhzZWxmKTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRXZlbnRDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCBFdmVudENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gRm9vdGVyQ29udHJvbGxlcigkbW9tZW50KVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmN1cnJlbnRZZWFyID0gJG1vbWVudCgpLmZvcm1hdCgnWVlZWScpO1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdGb290ZXJDb250cm9sbGVyJywgWyckbW9tZW50JywgRm9vdGVyQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBIZWFkZXJDb250cm9sbGVyKCRhdXRoLCAkbW9tZW50KVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi50b2RheXNEYXRlID0gJG1vbWVudCgpLmZvcm1hdCgnZGRkZCwgTU1NTSBEbyBZWVlZJyk7XHJcblxyXG4gICAgICAgIHNlbGYuaXNBdXRoZW50aWNhdGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdIZWFkZXJDb250cm9sbGVyJywgWyckYXV0aCcsICckbW9tZW50JywgSGVhZGVyQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIExhbmRpbmdDb250cm9sbGVyKCRzdGF0ZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0xhbmRpbmdDb250cm9sbGVyJywgWyckc3RhdGUnLCBMYW5kaW5nQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIExvZ2luQ29udHJvbGxlcigkc3RhdGUsICRzY29wZSwgJGNvb2tpZXMsIERpYWxvZ1NlcnZpY2UsIEF1dGhTZXJ2aWNlLCBGb2N1c1NlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYuZW1haWwgPSAnJztcclxuICAgICAgICBzZWxmLnBhc3N3b3JkID0gJyc7XHJcblxyXG4gICAgICAgIGlmKCRjb29raWVzLmdldCgnbG9naW5OYW1lJykpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmVtYWlsID0gJGNvb2tpZXMuZ2V0KCdsb2dpbk5hbWUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBkaWFsb2dPcHRpb25zID0ge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaWFsb2dzL2RsZ0xvZ2luLmh0bWwnLFxyXG4gICAgICAgICAgICBlc2NhcGVUb0Nsb3NlOiBmYWxzZSxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gRGlhbG9nQ29udHJvbGxlcigkc2NvcGUsICRtZERpYWxvZylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmNvbmZpcm1EaWFsb2cgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi5lbWFpbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc2VsZi5lbWFpbCAhPT0gJycgJiYgc2VsZi5wYXNzd29yZCAhPT0gJycpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBdXRoU2VydmljZS5sb2dpbihzZWxmLmVtYWlsLCBzZWxmLnBhc3N3b3JkKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0xvZ2luIHN1Y2Nlc3MnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy92YXIgY29va2llRXhwaXJ5ID0gbmV3IERhdGUodG9kYXkuZ2V0WWVhcigpICsgMSwgdG9kYXkuZ2V0TW9udGgoKSwgdG9kYXkuZ2V0RGF5KCksIDAsIDAsIDAsIDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvb2tpZUV4cGlyeSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb29raWVFeHBpcnkuc2V0RnVsbFllYXIoY29va2llRXhwaXJ5LmdldEZ1bGxZZWFyKCkgKyAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY29va2llcy5wdXQoJ2xvZ2luTmFtZScsIHNlbGYuZW1haWwsIHsgZXhwaXJlczogY29va2llRXhwaXJ5IH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucHJvZHVjdHMnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgnRXJyb3IgbG9nZ2luZyBpbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzY29wZTogJHNjb3BlLiRuZXcoKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbUN1c3RvbShkaWFsb2dPcHRpb25zKTtcclxuXHJcbiAgICAgICAgRm9jdXNTZXJ2aWNlKCdmb2N1c01lJyk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMb2dpbkNvbnRyb2xsZXInLCBbJyRzdGF0ZScsICckc2NvcGUnLCAnJGNvb2tpZXMnLCAnRGlhbG9nU2VydmljZScsICdBdXRoU2VydmljZScsICdGb2N1c1NlcnZpY2UnLCBMb2dpbkNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gTWF0ZXJpYWxDcmVhdGVDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCBWYWxpZGF0aW9uU2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsVW5pdHMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0TWF0ZXJpYWxBbGxUeXBlcyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWNpbWFsUmVnZXggPSBWYWxpZGF0aW9uU2VydmljZS5kZWNpbWFsUmVnZXgoKTtcclxuXHJcbiAgICAgICAgc2VsZi5jcmVhdGVNYXRlcmlhbCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi5tYXRlcmlhbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG0gPSBzZWxmLm1hdGVyaWFsO1xyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnbWF0ZXJpYWwnKS5wb3N0KG0pLnRoZW4oZnVuY3Rpb24oZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyRzdGF0ZS5nbygnYXBwLmN1c3RvbWVycy5kZXRhaWwnLCB7J2N1c3RvbWVySWQnOiBkLm5ld0lkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5tYXRlcmlhbHMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBjcmVhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdNYXRlcmlhbENyZWF0ZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdUb2FzdFNlcnZpY2UnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnVmFsaWRhdGlvblNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgTWF0ZXJpYWxDcmVhdGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIE1hdGVyaWFsRGV0YWlsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBUb2FzdFNlcnZpY2UsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgRGlhbG9nU2VydmljZSwgVmFsaWRhdGlvblNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFVuaXRzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldE1hdGVyaWFsQWxsVHlwZXMoc2VsZik7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJHN0YXRlUGFyYW1zKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRNYXRlcmlhbChzZWxmLCAkc3RhdGVQYXJhbXMubWF0ZXJpYWxJZCk7XHJcblxyXG4gICAgICAgIHNlbGYuZGVjaW1hbFJlZ2V4ID0gVmFsaWRhdGlvblNlcnZpY2UuZGVjaW1hbFJlZ2V4KCk7XHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlTWF0ZXJpYWwgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLm1hdGVyaWFsLnB1dCgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IHVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLm1hdGVyaWFsc1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZU1hdGVyaWFsID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5tYXRlcmlhbC5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5tYXRlcmlhbHNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBEZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zaG93RGVsZXRlQ29uZmlybSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZyA9IERpYWxvZ1NlcnZpY2UuY29uZmlybShldiwgJ0RlbGV0ZSBtYXRlcmlhbD8nLCAnVGhpcyB3aWxsIGFsc28gcmVtb3ZlIHRoZSBtYXRlcmlhbCBmcm9tIGFueSBwcm9kdWN0cyB1c2luZyBpdCcpO1xyXG4gICAgICAgICAgICBkaWFsb2cudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5kZWxldGVNYXRlcmlhbCgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdNYXRlcmlhbERldGFpbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdUb2FzdFNlcnZpY2UnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsICdWYWxpZGF0aW9uU2VydmljZScsICckc3RhdGVQYXJhbXMnLCBNYXRlcmlhbERldGFpbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gTWF0ZXJpYWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbE1hdGVyaWFscyhzZWxmKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ01hdGVyaWFsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgTWF0ZXJpYWxDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIE1hdGVyaWFsU2V0Q29udHJvbGxlcigkc3RhdGUsIFJlc3RTZXJ2aWNlLCBHdWlkU2VydmljZSwgRGlhbG9nU2VydmljZSwgbXlDb25maWcpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYuc2VsZWN0ZWRNYXRlcmlhbCA9ICcnO1xyXG4gICAgICAgIC8vc2VsZi5zZWxlY3RlZFF1YW50aXR5ID0gMDtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2cobXlDb25maWcubWF0ZXJpYWxTZXRzTFNLZXkpO1xyXG5cclxuICAgICAgICBpZihsb2NhbFN0b3JhZ2UuZ2V0SXRlbShteUNvbmZpZy5tYXRlcmlhbFNldHNMU0tleSkgIT09IG51bGwgJiYgbG9jYWxTdG9yYWdlLmdldEl0ZW0obXlDb25maWcubWF0ZXJpYWxTZXRzTFNLZXkpICE9PSAnJylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZXhpc3RpbmdTZXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShteUNvbmZpZy5tYXRlcmlhbFNldHNMU0tleSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmV4aXN0aW5nU2V0cyA9IFtdO1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShteUNvbmZpZy5tYXRlcmlhbFNldHNMU0tleSwgSlNPTi5zdHJpbmdpZnkoc2VsZi5leGlzdGluZ1NldHMpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXRTZXRPYmplY3QoKTtcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsTWF0ZXJpYWxzKHNlbGYpO1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZVNldCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0LmlkID0gR3VpZFNlcnZpY2UubmV3R3VpZCgpO1xyXG4gICAgICAgICAgICBzZWxmLmV4aXN0aW5nU2V0cy5wdXNoKHNlbGYuc2V0KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5zZXQpO1xyXG5cclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obXlDb25maWcubWF0ZXJpYWxTZXRzTFNLZXksIEpTT04uc3RyaW5naWZ5KHNlbGYuZXhpc3RpbmdTZXRzKSk7XHJcblxyXG4gICAgICAgICAgICBpbml0U2V0T2JqZWN0KCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVTZXQgPSBmdW5jdGlvbihlLCBzZXRJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZSwgJ0RlbGV0ZSBtYXRlcmlhbCBzZXQ/JywgJycpO1xyXG4gICAgICAgICAgICBkaWFsb2cudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleFRvUmVtb3ZlO1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYuZXhpc3RpbmdTZXRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNldElkID09IHNlbGYuZXhpc3RpbmdTZXRzW2ldLmlkKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhUb1JlbW92ZSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLmV4aXN0aW5nU2V0cy5zcGxpY2UoaW5kZXhUb1JlbW92ZSwgMSk7XHJcbiAgICAgICAgICAgICAgICBpZihzZWxmLmV4aXN0aW5nU2V0cy5sZW5ndGggPT09IDApIHsgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0obXlDb25maWcubWF0ZXJpYWxTZXRzTFNLZXkpOyB9XHJcblxyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obXlDb25maWcubWF0ZXJpYWxTZXRzTFNLZXksIHNlbGYuZXhpc3RpbmdTZXRzKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlTWF0ZXJpYWwgPSBmdW5jdGlvbihlLCBtYXRlcmlhbElkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4VG9SZW1vdmU7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzZWxmLnNldC5wcm9kdWN0X21hdGVyaWFscy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYobWF0ZXJpYWxJZCA9PSBzZWxmLnNldC5wcm9kdWN0X21hdGVyaWFsc1tpXS5tYXRlcmlhbF9pZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleFRvUmVtb3ZlID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5zZXQucHJvZHVjdF9tYXRlcmlhbHMuc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYWRkTWF0ZXJpYWwgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnNlbGVjdGVkTWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5zZXQucHJvZHVjdF9tYXRlcmlhbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbF9pZDogc2VsZi5zZWxlY3RlZE1hdGVyaWFsLmlkLFxyXG4gICAgICAgICAgICAgICAgcXVhbnRpdHk6IHNlbGYuc2VsZWN0ZWRRdWFudGl0eSxcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsOiBzZWxmLnNlbGVjdGVkTWF0ZXJpYWxcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkTWF0ZXJpYWwgPSAnJztcclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFF1YW50aXR5ID0gbnVsbDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0U2V0T2JqZWN0KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0ID0ge307XHJcbiAgICAgICAgICAgIHNlbGYuc2V0LmlkID0gJyc7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0Lm5hbWUgPSAnJztcclxuICAgICAgICAgICAgc2VsZi5zZXQucHJvZHVjdF9tYXRlcmlhbHMgPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdNYXRlcmlhbFNldENvbnRyb2xsZXInLCBbJyRzdGF0ZScsICdSZXN0U2VydmljZScsICdHdWlkU2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgJ215Q29uZmlnJywgTWF0ZXJpYWxTZXRDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFBheW1lbnRUeXBlQ3JlYXRlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBUb2FzdFNlcnZpY2UsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5jcmVhdGVQYXltZW50VHlwZSA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi5wYXltZW50dHlwZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGMgPSBzZWxmLnBheW1lbnR0eXBlO1xyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgncGF5bWVudHR5cGUnKS5wb3N0KGMpLnRoZW4oZnVuY3Rpb24oZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkKTtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBjcmVhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLnBheW1lbnR0eXBlcycpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGNyZWF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUGF5bWVudFR5cGVDcmVhdGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIFBheW1lbnRUeXBlQ3JlYXRlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBQYXltZW50VHlwZURldGFpbENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgVG9hc3RTZXJ2aWNlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJHN0YXRlUGFyYW1zKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRQYXltZW50VHlwZShzZWxmLCAkc3RhdGVQYXJhbXMucGF5bWVudFR5cGVJZCk7XHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlUGF5bWVudFR5cGUgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaXNWYWxpZCk7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBheW1lbnR0eXBlLnB1dCgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IHVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLnBheW1lbnR0eXBlc1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVQYXltZW50VHlwZSA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYucGF5bWVudHR5cGUucmVtb3ZlKCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGRlbGV0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAucGF5bWVudHR5cGVzXCIpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgRGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zaG93RGVsZXRlQ29uZmlybSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZyA9IERpYWxvZ1NlcnZpY2UuY29uZmlybShldiwgJ0RlbGV0ZSBwYXltZW50IHR5cGU/JywgJycpO1xyXG4gICAgICAgICAgICBkaWFsb2cudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5kZWxldGVQYXltZW50VHlwZSgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQYXltZW50VHlwZURldGFpbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdUb2FzdFNlcnZpY2UnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsICckc3RhdGVQYXJhbXMnLCBQYXltZW50VHlwZURldGFpbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUGF5bWVudFR5cGVDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFBheW1lbnRUeXBlcyhzZWxmKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1BheW1lbnRUeXBlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgUGF5bWVudFR5cGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFByb2R1Y3RDcmVhdGVDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBUb2FzdFNlcnZpY2UsIFJlc3RTZXJ2aWNlLCBWYWxpZGF0aW9uU2VydmljZSwgbXlDb25maWcsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxNYXRlcmlhbHMoc2VsZik7XHJcblxyXG4gICAgICAgIHNlbGYuZGVjaW1hbFJlZ2V4ID0gVmFsaWRhdGlvblNlcnZpY2UuZGVjaW1hbFJlZ2V4KCk7XHJcbiAgICAgICAgc2VsZi5udW1lcmljUmVnZXggPSBWYWxpZGF0aW9uU2VydmljZS5udW1lcmljUmVnZXgoKTtcclxuICAgICAgICBzZWxmLmNiQWRkTWF0ZXJpYWxzQnkgPSAyO1xyXG5cclxuICAgICAgICBzZWxmLnByb2R1Y3QgPSB7fTtcclxuICAgICAgICBzZWxmLnByb2R1Y3QubWluaW11bV9zdG9jayA9IDA7XHJcbiAgICAgICAgc2VsZi5wcm9kdWN0LmN1cnJlbnRfc3RvY2sgPSAwO1xyXG5cclxuICAgICAgICBpZihsb2NhbFN0b3JhZ2UuZ2V0SXRlbShteUNvbmZpZy5tYXRlcmlhbFNldHNMU0tleSkgIT09IG51bGwgJiYgbG9jYWxTdG9yYWdlLmdldEl0ZW0obXlDb25maWcubWF0ZXJpYWxTZXRzTFNLZXkpICE9PSAnJylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYubWF0ZXJpYWxTZXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShteUNvbmZpZy5tYXRlcmlhbFNldHNMU0tleSkpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHNlbGYuY3JlYXRlUHJvZHVjdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYucHJvZHVjdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHAgPSBzZWxmLnByb2R1Y3Q7XHJcblxyXG4gICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJGVycm9yKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdwcm9kdWN0JykucG9zdChwKS50aGVuKGZ1bmN0aW9uKGQpXHJcbiAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8kc3RhdGUuZ28oJ2FwcC5wcm9kdWN0cy5kZXRhaWwnLCB7J3Byb2R1Y3RJZCc6IGQubmV3SWR9KTtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBjcmVhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLnByb2R1Y3RzJyk7XHJcbiAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGNyZWF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYWRkTWF0ZXJpYWwgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnNlbGVjdGVkTWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICAgICAgYWRkTWF0ZXJpYWwoc2VsZi5zZWxlY3RlZE1hdGVyaWFsLmlkLCBzZWxmLnNlbGVjdGVkUXVhbnRpdHksIHNlbGYuc2VsZWN0ZWRNYXRlcmlhbCk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkTWF0ZXJpYWwgPSBcIlwiO1xyXG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkUXVhbnRpdHkgPSAwO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5wcm9kdWN0KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFkZE1hdGVyaWFsU2V0ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLnNlbGVjdGVkTWF0ZXJpYWxTZXQpO1xyXG5cclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYuc2VsZWN0ZWRNYXRlcmlhbFNldC5wcm9kdWN0X21hdGVyaWFscy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBtID0gc2VsZi5zZWxlY3RlZE1hdGVyaWFsU2V0LnByb2R1Y3RfbWF0ZXJpYWxzW2ldO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhwbSk7XHJcbiAgICAgICAgICAgICAgICBhZGRNYXRlcmlhbChwbS5tYXRlcmlhbF9pZCwgcG0ucXVhbnRpdHksIHBtLm1hdGVyaWFsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlTWF0ZXJpYWwgPSBmdW5jdGlvbihlLCBtYXRlcmlhbElkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4VG9SZW1vdmU7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKG1hdGVyaWFsSWQgPT0gc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzW2ldLm1hdGVyaWFsX2lkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4VG9SZW1vdmUgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGluZGV4VG9SZW1vdmUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRDb3N0ID0gcGFyc2VGbG9hdChzZWxmLnByb2R1Y3QuY29zdCk7XHJcbiAgICAgICAgICAgIHZhciBidGVzdCA9IChwYXJzZUZsb2F0KHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFsc1tpbmRleFRvUmVtb3ZlXS5tYXRlcmlhbC51bml0X2Nvc3QpICogcGFyc2VJbnQoc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzW2luZGV4VG9SZW1vdmVdLnF1YW50aXR5KSk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDb3N0IC09IGJ0ZXN0O1xyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QuY29zdCA9IGN1cnJlbnRDb3N0O1xyXG5cclxuICAgICAgICAgICAgc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzLnNwbGljZShpbmRleFRvUmVtb3ZlLCAxKTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhZGRNYXRlcmlhbChtYXRlcmlhbElkLCBxdWFudGl0eSwgbWF0ZXJpYWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZihzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMgPT09IHVuZGVmaW5lZCkgeyBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMgPSBbXTsgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWxfaWQ6IG1hdGVyaWFsSWQsXHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eTogcXVhbnRpdHksXHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbDogbWF0ZXJpYWxcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZihzZWxmLnByb2R1Y3QuY29zdCA9PT0gdW5kZWZpbmVkIHx8IHNlbGYucHJvZHVjdC5jb3N0ID09PSBudWxsKSB7IHNlbGYucHJvZHVjdC5jb3N0ID0gMDsgfVxyXG4gICAgICAgICAgICB2YXIgY3VycmVudENvc3QgPSBwYXJzZUZsb2F0KHNlbGYucHJvZHVjdC5jb3N0KTtcclxuICAgICAgICAgICAgdmFyIGJ0ZXN0ID0gKHBhcnNlRmxvYXQobWF0ZXJpYWwudW5pdF9jb3N0KSAqIHBhcnNlRmxvYXQocXVhbnRpdHkpKTtcclxuICAgICAgICAgICAgY3VycmVudENvc3QgKz0gYnRlc3Q7XHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5jb3N0ID0gY3VycmVudENvc3Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUHJvZHVjdENyZWF0ZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdUb2FzdFNlcnZpY2UnLCAnUmVzdFNlcnZpY2UnLCAnVmFsaWRhdGlvblNlcnZpY2UnLCAnbXlDb25maWcnLCAnJHN0YXRlUGFyYW1zJywgUHJvZHVjdENyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUHJvZHVjdERldGFpbENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMsIFRvYXN0U2VydmljZSwgRGlhbG9nU2VydmljZSwgVmFsaWRhdGlvblNlcnZpY2UsIG15Q29uZmlnKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbE1hdGVyaWFscyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRQcm9kdWN0KHNlbGYsICRzdGF0ZVBhcmFtcy5wcm9kdWN0SWQpO1xyXG5cclxuICAgICAgICBzZWxmLmRlY2ltYWxSZWdleCA9IFZhbGlkYXRpb25TZXJ2aWNlLmRlY2ltYWxSZWdleCgpO1xyXG4gICAgICAgIHNlbGYubnVtZXJpY1JlZ2V4ID0gVmFsaWRhdGlvblNlcnZpY2UubnVtZXJpY1JlZ2V4KCk7XHJcbiAgICAgICAgc2VsZi5jYkFkZE1hdGVyaWFsc0J5ID0gMjtcclxuXHJcbiAgICAgICAgaWYobG9jYWxTdG9yYWdlLmdldEl0ZW0obXlDb25maWcubWF0ZXJpYWxTZXRzTFNLZXkpICE9PSBudWxsICYmIGxvY2FsU3RvcmFnZS5nZXRJdGVtKG15Q29uZmlnLm1hdGVyaWFsU2V0c0xTS2V5KSAhPT0gJycpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLm1hdGVyaWFsU2V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obXlDb25maWcubWF0ZXJpYWxTZXRzTFNLZXkpKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZVByb2R1Y3QgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaXNWYWxpZCk7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL1Jlc3RTZXJ2aWNlLnVwZGF0ZVByb2R1Y3Qoc2VsZiwgc2VsZi5wcm9kdWN0LmlkKTtcclxuICAgICAgICAgICAgICAgIHNlbGYucHJvZHVjdC5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwidXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5wcm9kdWN0c1wiKTtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlUHJvZHVjdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWVsdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5wcm9kdWN0c1wiKTtcclxuXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBkZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2hvd0RlbGV0ZUNvbmZpcm0gPSBmdW5jdGlvbihldilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZXYsICdEZWxldGUgcHJvZHVjdD8nLCAnVGhpcyB3aWxsIGFsc28gZGVsZXRlIGFueSB3b3JrIG9yZGVyIG9yIGV2ZW50IHN0b2NrIGxldmVscyBhc3NvY2lhdGVkIHdpdGggdGhpcyBwcm9kdWN0Jyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5kZWxldGVQcm9kdWN0KCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFkZE1hdGVyaWFsID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5zZWxlY3RlZE1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgICAgIGFkZE1hdGVyaWFsKHNlbGYuc2VsZWN0ZWRNYXRlcmlhbC5pZCwgc2VsZi5zZWxlY3RlZFF1YW50aXR5LCBzZWxmLnNlbGVjdGVkTWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZE1hdGVyaWFsID0gXCJcIjtcclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFF1YW50aXR5ID0gMDtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5hZGRNYXRlcmlhbFNldCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi5zZWxlY3RlZE1hdGVyaWFsU2V0KTtcclxuXHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzZWxmLnNlbGVjdGVkTWF0ZXJpYWxTZXQucHJvZHVjdF9tYXRlcmlhbHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBwbSA9IHNlbGYuc2VsZWN0ZWRNYXRlcmlhbFNldC5wcm9kdWN0X21hdGVyaWFsc1tpXTtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cocG0pO1xyXG4gICAgICAgICAgICAgICAgYWRkTWF0ZXJpYWwocG0ubWF0ZXJpYWxfaWQsIHBtLnF1YW50aXR5LCBwbS5tYXRlcmlhbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZU1hdGVyaWFsID0gZnVuY3Rpb24oZSwgbWF0ZXJpYWxJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleFRvUmVtb3ZlO1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihtYXRlcmlhbElkID09IHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFsc1tpXS5tYXRlcmlhbF9pZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleFRvUmVtb3ZlID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coaW5kZXhUb1JlbW92ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY3VycmVudENvc3QgPSBwYXJzZUZsb2F0KHNlbGYucHJvZHVjdC5jb3N0KTtcclxuICAgICAgICAgICAgdmFyIGJ0ZXN0ID0gKHBhcnNlRmxvYXQoc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzW2luZGV4VG9SZW1vdmVdLm1hdGVyaWFsLnVuaXRfY29zdCkgKiBwYXJzZUludChzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHNbaW5kZXhUb1JlbW92ZV0ucXVhbnRpdHkpKTtcclxuICAgICAgICAgICAgY3VycmVudENvc3QgLT0gYnRlc3Q7XHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5jb3N0ID0gY3VycmVudENvc3Q7XHJcblxyXG5cclxuICAgICAgICAgICAgc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzLnNwbGljZShpbmRleFRvUmVtb3ZlLCAxKTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhZGRNYXRlcmlhbChtYXRlcmlhbElkLCBxdWFudGl0eSwgbWF0ZXJpYWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZihzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMgPT09IHVuZGVmaW5lZCkgeyBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMgPSBbXTsgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgcHJvZHVjdF9pZDogc2VsZi5wcm9kdWN0LmlkLFxyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWxfaWQ6IG1hdGVyaWFsSWQsXHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eTogcXVhbnRpdHksXHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbDogbWF0ZXJpYWxcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZihzZWxmLnByb2R1Y3QuY29zdCA9PT0gdW5kZWZpbmVkIHx8IHNlbGYucHJvZHVjdC5jb3N0ID09PSBudWxsKSB7IHNlbGYucHJvZHVjdC5jb3N0ID0gMDsgfVxyXG4gICAgICAgICAgICB2YXIgY3VycmVudENvc3QgPSBwYXJzZUZsb2F0KHNlbGYucHJvZHVjdC5jb3N0KTtcclxuICAgICAgICAgICAgdmFyIGJ0ZXN0ID0gKHBhcnNlRmxvYXQobWF0ZXJpYWwudW5pdF9jb3N0KSAqIHBhcnNlRmxvYXQocXVhbnRpdHkpKTtcclxuICAgICAgICAgICAgY3VycmVudENvc3QgKz0gYnRlc3Q7XHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5jb3N0ID0gY3VycmVudENvc3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQcm9kdWN0RGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsICdUb2FzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsICdWYWxpZGF0aW9uU2VydmljZScsICdteUNvbmZpZycsIFByb2R1Y3REZXRhaWxDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFByb2R1Y3RDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5maWx0ZXJUeXBlID0gXCJcIjtcclxuICAgICAgICBzZWxmLmZpbHRlck9wZXJhdG9yID0gXCJcIjtcclxuICAgICAgICBzZWxmLmZpbHRlclZhbHVlID0gXCJcIjtcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUHJvZHVjdHMoc2VsZik7XHJcblxyXG4gICAgICAgIHNlbGYuYXBwbHlQcm9kdWN0RmlsdGVyID0gZnVuY3Rpb24ocClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHNlbGYuZmlsdGVyVHlwZSAhPT0gXCJcIiAmJiBzZWxmLmZpbHRlck9wZXJhdG9yICE9PSBcIlwiICYmIHNlbGYuZmlsdGVyVmFsdWUgIT09IFwiXCIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaGlcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlUb0ZpbHRlciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2goc2VsZi5maWx0ZXJUeXBlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzdG9ja1wiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVRvRmlsdGVyID0gcGFyc2VJbnQocC5jdXJyZW50X3N0b2NrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInByaWNlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VG9GaWx0ZXIgPSBwYXJzZUZsb2F0KHAucHJpY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiY29zdFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVRvRmlsdGVyID0gcGFyc2VGbG9hdChwLmNvc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZihzZWxmLmZpbHRlck9wZXJhdG9yID09PSBcIj1cIilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHlUb0ZpbHRlciA9PSBwYXJzZUZsb2F0KHNlbGYuZmlsdGVyVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihzZWxmLmZpbHRlck9wZXJhdG9yID09PSBcIj5cIilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHlUb0ZpbHRlciA+IHBhcnNlRmxvYXQoc2VsZi5maWx0ZXJWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHNlbGYuZmlsdGVyT3BlcmF0b3IgPT09IFwiPj1cIilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHlUb0ZpbHRlciA+PSBzZWxmLmZpbHRlclZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihzZWxmLmZpbHRlck9wZXJhdG9yID09PSBcIjxcIilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHlUb0ZpbHRlciA8IHBhcnNlRmxvYXQoc2VsZi5maWx0ZXJWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHNlbGYuZmlsdGVyT3BlcmF0b3IgPT09IFwiPD1cIilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHlUb0ZpbHRlciA8PSBwYXJzZUZsb2F0KHNlbGYuZmlsdGVyVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQcm9kdWN0Q29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgUHJvZHVjdENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUHVyY2hhc2VPcmRlckNyZWF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgJHNjb3BlLCAkbW9tZW50LCBSZXN0YW5ndWxhciwgVG9hc3RTZXJ2aWNlLCBSZXN0U2VydmljZSwgRGlhbG9nU2VydmljZSwgVmFsaWRhdGlvblNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbEN1c3RvbWVycyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQYXltZW50VHlwZXMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0RnVsbHlCb29rZWREYXlzKHNlbGYpO1xyXG5cclxuICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIgPSB7fTtcclxuICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIuYW1vdW50X3BhaWQgPSAwO1xyXG4gICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5kaXNjb3VudCA9IDA7XHJcbiAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID0gMDtcclxuXHJcbiAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLmRlbGl2ZXJ5ID0gMDtcclxuICAgICAgICBzZWxmLmRlbGl2ZXJ5X2NoYXJnZSA9IDA7XHJcblxyXG4gICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5zaGlwcGluZyA9IDA7XHJcbiAgICAgICAgc2VsZi5zaGlwcGluZ19jaGFyZ2UgPSAwO1xyXG5cclxuICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIuc3VwcHJlc3N3b3Jrb3JkZXIgPSAwO1xyXG5cclxuICAgICAgICB2YXIgb3JpZ2luYWxUb3RhbCA9IDA7XHJcbiAgICAgICAgdmFyIG9yaWdpbmFsU2hpcHBpbmdDaGFyZ2UgPSAwO1xyXG5cclxuICAgICAgICBzZWxmLmFkZFByb2R1Y3RJbmxpbmUgPSBmdW5jdGlvbihldilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2dPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvZGlhbG9ncy9kbGdDcmVhdGVQcm9kdWN0SW5saW5lLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgZXNjYXBlVG9DbG9zZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRhcmdldEV2ZW50OiBldixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uIERpYWxvZ0NvbnRyb2xsZXIoJHNjb3BlLCAkbWREaWFsb2cpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRlY2ltYWxSZWdleCA9IFZhbGlkYXRpb25TZXJ2aWNlLmRlY2ltYWxSZWdleCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY29uZmlybURpYWxvZyA9IGZ1bmN0aW9uICgpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdhY2NlcHRlZCcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gJHNjb3BlLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHAgPSAkc2NvcGUuY3RybFByb2R1Y3RDcmVhdGVJbmxpbmUucHJvZHVjdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHAuY29zdCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwLm1pbmltdW1fc3RvY2sgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcC5jdXJyZW50X3N0b2NrID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cocCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzdFNlcnZpY2UuYWRkUHJvZHVjdChwKS50aGVuKGZ1bmN0aW9uKGQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkLm5ld0lkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9wID0ge2lkOiBkLm5ld0lkLCBuYW1lOiBwLm5hbWUsIHByaWNlOiBwLnByaWNlfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnByb2R1Y3RzLnB1c2gocG9wKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkUHJvZHVjdCA9IHBvcDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlByb2R1Y3QgU3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBjcmVhdGluZyBwcm9kdWN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jYW5jZWxEaWFsb2cgPSBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdjYW5jZWxsZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNjb3BlOiAkc2NvcGUuJG5ldygpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21DdXN0b20oZGlhbG9nT3B0aW9ucyk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYWRkQ3VzdG9tZXJJbmxpbmUgPSBmdW5jdGlvbihldilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2dPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvZGlhbG9ncy9kbGdDcmVhdGVDdXN0b21lcklubGluZS5odG1sJyxcclxuICAgICAgICAgICAgICAgIGVzY2FwZVRvQ2xvc2U6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRFdmVudDogZXYsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiBEaWFsb2dDb250cm9sbGVyKCRzY29wZSwgJG1kRGlhbG9nKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jb25maXJtRGlhbG9nID0gZnVuY3Rpb24gKClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjY2VwdGVkJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSAkc2NvcGUuZm9ybTEuJHZhbGlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYyA9ICRzY29wZS5jdHJsQ3VzdG9tZXJDcmVhdGVJbmxpbmUuY3VzdG9tZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXN0U2VydmljZS5hZGRDdXN0b21lcihjKS50aGVuKGZ1bmN0aW9uKGQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZC5uZXdJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jdXN0b21lcnMucHVzaCh7aWQ6IGQubmV3SWQsIGZpcnN0X25hbWU6IGMuZmlyc3RfbmFtZSwgbGFzdF9uYW1lOiBjLmxhc3RfbmFtZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIuY3VzdG9tZXJfaWQgPSBkLm5ld0lkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiQ3VzdG9tZXIgU3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBjcmVhdGluZyBjdXN0b21lclwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRtZERpYWxvZy5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2FuY2VsRGlhbG9nID0gZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnY2FuY2VsbGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRtZERpYWxvZy5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzY29wZTogJHNjb3BlLiRuZXcoKVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgRGlhbG9nU2VydmljZS5mcm9tQ3VzdG9tKGRpYWxvZ09wdGlvbnMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYub25seU9wZW5EYXlzID0gZnVuY3Rpb24oZGF0ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgaWYoISRtb21lbnQoZGF0ZSkuaXNCZWZvcmUoKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRlKTtcclxuICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzZWxmLmJvb2tlZERheXMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLmJvb2tlZERheXNbaV0uc3RhcnRfZGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLmJvb2tlZERheXNbaV0uc3RhcnRfZGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygkbW9tZW50KHNlbGYuYm9va2VkRGF5c1tpXS5zdGFydF9kYXRlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYobW9tZW50KGRhdGUpLmlzU2FtZShzZWxmLmJvb2tlZERheXNbaV0uc3RhcnRfZGF0ZSkpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuY3JlYXRlUHVyY2hhc2VPcmRlciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYucHVyY2hhc2VvcmRlcik7XHJcblxyXG4gICAgICAgICAgICB2YXIgcCA9IHNlbGYucHVyY2hhc2VvcmRlcjtcclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJGVycm9yKTtcclxuXHJcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgncHVyY2hhc2VvcmRlcicpLnBvc3QocCkudGhlbihmdW5jdGlvbihkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGQpO1xyXG4gICAgICAgICAgICAgICAgLy8kc3RhdGUuZ28oJ2FwcC5wcm9kdWN0cy5kZXRhaWwnLCB7J3Byb2R1Y3RJZCc6IGQubmV3SWR9KTtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5wdXJjaGFzZW9yZGVycycpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgY3JlYXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYXBwbHlEaXNjb3VudCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci5kaXNjb3VudCA9PSBudWxsIHx8IHNlbGYucHVyY2hhc2VvcmRlci5kaXNjb3VudCA9PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBvcmlnaW5hbFRvdGFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAmJiBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgIT09IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAmJiBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPiAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkaXNjb3VudGVkID0gb3JpZ2luYWxUb3RhbCAtIHNlbGYucHVyY2hhc2VvcmRlci5kaXNjb3VudDtcclxuICAgICAgICAgICAgICAgICAgICBkaXNjb3VudGVkID49IDAgPyBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBkaXNjb3VudGVkIDogMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYXBwbHlEZWxpdmVyeSA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHNlbGYuZGVsaXZlcnlfY2hhcmdlID09PSAxKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIuZGVsaXZlcnkgPSBkZWxpdmVyeUZlZTtcclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCArPSBkZWxpdmVyeUZlZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5kZWxpdmVyeSA9IDA7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgLT0gZGVsaXZlcnlGZWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFwcGx5U2hpcHBpbmcgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgY29zdE9mU2hpcHBpbmcgPSAwO1xyXG4gICAgICAgICAgICBpZihzZWxmLnNoaXBwaW5nX2NoYXJnZSA9PT0gJ0NETicpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvc3RPZlNoaXBwaW5nID0gc2hpcHBpbmdDYW5hZGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZihzZWxmLnNoaXBwaW5nX2NoYXJnZSA9PT0gJ1VTQScpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvc3RPZlNoaXBwaW5nID0gc2hpcHBpbmdVc2E7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5zaGlwcGluZyA9IGNvc3RPZlNoaXBwaW5nO1xyXG5cclxuICAgICAgICAgICAgaWYoc2VsZi5zaGlwcGluZ19jaGFyZ2UgIT09IG9yaWdpbmFsU2hpcHBpbmdDaGFyZ2UpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCAtPSBvcmlnaW5hbFNoaXBwaW5nQ2hhcmdlO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsICs9IGNvc3RPZlNoaXBwaW5nO1xyXG5cclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsVG90YWwgLT0gb3JpZ2luYWxTaGlwcGluZ0NoYXJnZTtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsVG90YWwgKz0gY29zdE9mU2hpcHBpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG9yaWdpbmFsU2hpcHBpbmdDaGFyZ2UgPSBjb3N0T2ZTaGlwcGluZztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNlbGYuYWRkUHJvZHVjdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc2VsZWN0ZWRQcm9kdWN0KTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cyA9PT0gdW5kZWZpbmVkKSB7IHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cyA9IFtdOyB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBzZWxmLnNlbGVjdGVkUHJvZHVjdC5pZCxcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiBzZWxmLnNlbGVjdGVkUXVhbnRpdHksXHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0OiBzZWxmLnNlbGVjdGVkUHJvZHVjdFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9PT0gdW5kZWZpbmVkIHx8IHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9PT0gbnVsbCkgeyBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSAwOyB9XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50Q29zdCA9IHBhcnNlRmxvYXQoc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsKTtcclxuICAgICAgICAgICAgdmFyIGJ0ZXN0ID0gKHBhcnNlRmxvYXQoc2VsZi5zZWxlY3RlZFByb2R1Y3QucHJpY2UpICogcGFyc2VJbnQoc2VsZi5zZWxlY3RlZFF1YW50aXR5KSk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDb3N0ICs9IGJ0ZXN0O1xyXG4gICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBjdXJyZW50Q29zdDtcclxuICAgICAgICAgICAgb3JpZ2luYWxUb3RhbCA9IGN1cnJlbnRDb3N0O1xyXG5cclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFByb2R1Y3QgPSBcIlwiO1xyXG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkUXVhbnRpdHkgPSAwO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5wdXJjaGFzZW9yZGVyKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVByb2R1Y3QgPSBmdW5jdGlvbihlLCBwcm9kdWN0SWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXhUb1JlbW92ZTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYocHJvZHVjdElkID09IHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0c1tpXS5wcm9kdWN0X2lkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4VG9SZW1vdmUgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGluZGV4VG9SZW1vdmUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRDb3N0ID0gcGFyc2VGbG9hdChzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwpO1xyXG4gICAgICAgICAgICB2YXIgYnRlc3QgPSAocGFyc2VGbG9hdChzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaW5kZXhUb1JlbW92ZV0ucHJvZHVjdC5wcmljZSkgKiBwYXJzZUludChzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaW5kZXhUb1JlbW92ZV0ucXVhbnRpdHkpKTtcclxuICAgICAgICAgICAgY3VycmVudENvc3QgLT0gYnRlc3Q7XHJcbiAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9IGN1cnJlbnRDb3N0O1xyXG4gICAgICAgICAgICBvcmlnaW5hbFRvdGFsID0gY3VycmVudENvc3Q7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMuc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGV0ZXJtaW5lV29ya09yZGVycyA9IGZ1bmN0aW9uKGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5wdXJjaGFzZW9yZGVyLnN1cHByZXNzd29ya29yZGVyID09IDEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSnVzdCBwcm9jZXNzIHRoZSBQTyBhcyBub3JtYWxcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNyZWF0ZVB1cmNoYXNlT3JkZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb2R1Y3RzVG9GdWxmaWxsID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdHNUb0Z1bGZpbGwucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaV0ucHJvZHVjdF9pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaV0ucXVhbnRpdHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3NjaGVkdWxlci9nZXRXb3JrT3JkZXJzJykucG9zdCh7cHJvZHVjdHNUb0Z1bGZpbGw6IHByb2R1Y3RzVG9GdWxmaWxsfSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLndvcmtPcmRlcnNUb0NyZWF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLndvcmtPcmRlcnNUb0NyZWF0ZSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZXJlIGFyZSB3b3Jrb3JkZXJzIG5lZWRlZCBmb3IgdGhpcyBQTywgY29uZmlybSB0aGVpciBjcmVhdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLndvcmtPcmRlcnNUb0NyZWF0ZSA9IGRhdGEud29ya09yZGVyc1RvQ3JlYXRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLndvcmtPcmRlcnMgPSBkYXRhLndvcmtPcmRlcnM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoZSwgJ2RsZ0NvbmZpcm1Xb3JrT3JkZXJzJywgJHNjb3BlKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLndvcmtfb3JkZXJzID0gJHNjb3BlLndvcmtPcmRlcnM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2NvbmZpcm1lZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNyZWF0ZVB1cmNoYXNlT3JkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnY2FuY2VsbGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEp1c3QgcHJvY2VzcyB0aGUgUE8gYXMgbm9ybWFsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNyZWF0ZVB1cmNoYXNlT3JkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1B1cmNoYXNlT3JkZXJDcmVhdGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnJHNjb3BlJywgJyRtb21lbnQnLCAnUmVzdGFuZ3VsYXInLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3RTZXJ2aWNlJywgJ0RpYWxvZ1NlcnZpY2UnLCAnVmFsaWRhdGlvblNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgUHVyY2hhc2VPcmRlckNyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUHVyY2hhc2VPcmRlckRldGFpbENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgJHNjb3BlLCAkbW9tZW50LCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcywgVG9hc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbEN1c3RvbWVycyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQYXltZW50VHlwZXMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0UHVyY2hhc2VPcmRlcihzZWxmLCAkc3RhdGVQYXJhbXMucHVyY2hhc2VPcmRlcklkKTtcclxuXHJcbiAgICAgICAgdmFyIG9yaWdpbmFsVG90YWwgPSAwO1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZVB1cmNoYXNlT3JkZXIgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIucHV0KCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJ1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgdXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5wdXJjaGFzZW9yZGVyc1wiKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVQdXJjaGFzZU9yZGVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnJlbW92ZSgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRlZWx0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBkZWxldGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLnB1cmNoYXNlb3JkZXJzXCIpO1xyXG5cclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGRlbGV0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBkZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zaG93RGVsZXRlQ29uZmlybSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZyA9IERpYWxvZ1NlcnZpY2UuY29uZmlybShldiwgJ0RlbGV0ZSBwdXJjaGFzZSBvcmRlcj8nLCAnJyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5kZWxldGVQdXJjaGFzZU9yZGVyKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFwcGx5RGlzY291bnQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIuZGlzY291bnQgPT0gbnVsbCB8fCBzZWxmLnB1cmNoYXNlb3JkZXIuZGlzY291bnQgPT0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID0gb3JpZ2luYWxUb3RhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsICE9PSBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID4gMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGlzY291bnRlZCA9IG9yaWdpbmFsVG90YWwgLSBzZWxmLnB1cmNoYXNlb3JkZXIuZGlzY291bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzY291bnRlZCA+PSAwID8gc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID0gZGlzY291bnRlZCA6IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFkZFByb2R1Y3QgPSBmdW5jdGlvbihlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5zZWxlY3RlZFByb2R1Y3QpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHBvcE9iaiA9IHtcclxuICAgICAgICAgICAgICAgIHByb2R1Y3RfaWQ6IHNlbGYuc2VsZWN0ZWRQcm9kdWN0LmlkLFxyXG4gICAgICAgICAgICAgICAgcXVhbnRpdHk6IHNlbGYuc2VsZWN0ZWRRdWFudGl0eSxcclxuICAgICAgICAgICAgICAgIHByb2R1Y3Q6IHNlbGYuc2VsZWN0ZWRQcm9kdWN0XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3NjaGVkdWxlci9nZXRXb3JrT3JkZXJzJykucG9zdCh7cHJvZHVjdHNUb0Z1bGZpbGw6IFtwb3BPYmpdLCBwdXJjaGFzZU9yZGVySWQ6IHNlbGYucHVyY2hhc2VvcmRlci5pZH0pLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YS53b3JrT3JkZXJzVG9DcmVhdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cyA9PT0gdW5kZWZpbmVkKSB7IHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cyA9IFtdOyB9XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMucHVzaChwb3BPYmopO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFJlY2FsY3VsYXRlIFBPIHRvdGFsXHJcbiAgICAgICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPT09IHVuZGVmaW5lZCB8fCBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPT09IG51bGwpIHsgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID0gMDsgfVxyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRDb3N0ID0gcGFyc2VGbG9hdChzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGJ0ZXN0ID0gKHBhcnNlRmxvYXQoc2VsZi5zZWxlY3RlZFByb2R1Y3QucHJpY2UpICogcGFyc2VJbnQoc2VsZi5zZWxlY3RlZFF1YW50aXR5KSk7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Q29zdCArPSBidGVzdDtcclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9IGN1cnJlbnRDb3N0O1xyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxUb3RhbCA9IGN1cnJlbnRDb3N0O1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRQcm9kdWN0ID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRRdWFudGl0eSA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoZGF0YS53b3JrT3JkZXJzVG9DcmVhdGUgPiAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZXJlIGFyZSB3b3Jrb3JkZXJzIG5lZWRlZCBmb3IgdGhpcyBQTywgYWxlcnQgb2YgdGhlaXIgY3JlYXRpb25cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUud29ya09yZGVyc1RvQ3JlYXRlID0gZGF0YS53b3JrT3JkZXJzVG9DcmVhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLndvcmtPcmRlcnMgPSBkYXRhLndvcmtPcmRlcnM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKGUsICdkbGdBbGVydFdvcmtPcmRlcnMnLCAkc2NvcGUpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NvbmZpcm1lZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGFkZGluZyBwcm9kdWN0LCBwbGVhc2UgdHJ5IGFnYWluXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVByb2R1Y3QgPSBmdW5jdGlvbihlLCBwcm9kdWN0SWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXhUb1JlbW92ZTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYocHJvZHVjdElkID09IHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0c1tpXS5wcm9kdWN0X2lkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4VG9SZW1vdmUgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGluZGV4VG9SZW1vdmUpO1xyXG5cclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdzY2hlZHVsZXIvcmVzdG9yZVN0b2NrRm9yUHJvZHVjdCcpLnBvc3Qoe3B1cmNoYXNlX29yZGVyX2lkOiBzZWxmLnB1cmNoYXNlb3JkZXIuaWQsIHByb2R1Y3RfaWQ6IHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0c1tpbmRleFRvUmVtb3ZlXS5wcm9kdWN0X2lkfSkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBSZWNhbGN1bGF0ZSBQTyB0b3RhbFxyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRDb3N0ID0gcGFyc2VGbG9hdChzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGJ0ZXN0ID0gKHBhcnNlRmxvYXQoc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzW2luZGV4VG9SZW1vdmVdLnByb2R1Y3QucHJpY2UpICogcGFyc2VJbnQoc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzW2luZGV4VG9SZW1vdmVdLnF1YW50aXR5KSk7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Q29zdCAtPSBidGVzdDtcclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9IGN1cnJlbnRDb3N0O1xyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxUb3RhbCA9IGN1cnJlbnRDb3N0O1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cy5zcGxpY2UoaW5kZXhUb1JlbW92ZSwgMSk7XHJcblxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmcgc3RvY2ssIHBsZWFzZSB0cnkgYWdhaW5cIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1B1cmNoYXNlT3JkZXJEZXRhaWxDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnJHNjb3BlJywgJyRtb21lbnQnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgJ1RvYXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgUHVyY2hhc2VPcmRlckRldGFpbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUHVyY2hhc2VPcmRlckNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUHVyY2hhc2VPcmRlcnMoc2VsZik7XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1B1cmNoYXNlT3JkZXJDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCBQdXJjaGFzZU9yZGVyQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBSZXBvcnRDb250cm9sbGVyKCRzY29wZSwgJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCBDaGFydFNlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLnJlcG9ydFBhcmFtcyA9IHt9O1xyXG5cclxuICAgICAgICBpZigkc3RhdGUuaXMoJ2FwcC5yZXBvcnRzLmN1cnJlbnRzdG9jaycpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2VuZXJhdGVDdXJyZW50U3RvY2tSZXBvcnQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZigkc3RhdGUuaXMoJ2FwcC5yZXBvcnRzLnNhbGVzJykpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzaG93U2FsZXNSZXBvcnRWaWV3KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoJHN0YXRlLmlzKCdhcHAucmVwb3J0cy5zYWxlc2J5bW9udGgnKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNob3dTYWxlc1JlcG9ydEJ5TW9udGhWaWV3KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoJHN0YXRlLmlzKCdhcHAucmVwb3J0cy5pbmNvbWVieW1vbnRoJykpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzaG93SW5jb21lUmVwb3J0QnlNb250aFZpZXcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZigkc3RhdGUuaXMoJ2FwcC5yZXBvcnRzLnByb2R1Y3Rwcm9maXRwZXJjZW50cycpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2hvd1Byb2R1Y3RQcm9maXRQZXJjZW50cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKCRzdGF0ZS5pcygnYXBwLnJlcG9ydHMud2Vla3dvcmtvcmRlcnMnKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNob3dXZWVrbHlXb3JrT3JkZXJzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIFJlcG9ydCBob21lXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJHN0YXRlLmlzKCdhcHAucmVwb3J0cycpKTtcclxuICAgICAgICAgICAgc2hvd0Rhc2hib2FyZFdpZGdldHMoKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93UHJvZHVjdFByb2ZpdFBlcmNlbnRzKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENoYXJ0U2VydmljZS5nZXRQcm9kdWN0UHJvZml0UGVyY2VudHMoc2VsZik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93V2Vla2x5V29ya09yZGVycygpXHJcbiAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdyZXBvcnRzL2dldFdlZWtXb3JrT3JkZXJSZXBvcnQnKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi53ZWVrd29ya29yZGVycyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEVycm9yXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlQ3VycmVudFN0b2NrUmVwb3J0KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR2VuZXJhdGUgc3RvY2sgcmVycG9ydFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNob3dTYWxlc1JlcG9ydFZpZXcoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsQ3VzdG9tZXJzKHNlbGYpO1xyXG4gICAgICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNob3dEYXNoYm9hcmRXaWRnZXRzKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENoYXJ0U2VydmljZS5nZXRUb3BTZWxsaW5nUHJvZHVjdHMoc2VsZiwgJ1RvcCBTZWxsaW5nIEFsbCBUaW1lJyk7XHJcbiAgICAgICAgICAgIGdldFdvcnN0U2VsbGluZ1Byb2R1Y3RzKHNlbGYpO1xyXG4gICAgICAgICAgICBnZXRPdmVyZHVlUHVyY2hhc2VPcmRlcnMoc2VsZik7XHJcbiAgICAgICAgICAgIGdldE1vbnRobHlJbmNvbWUoc2VsZik7XHJcbiAgICAgICAgICAgIGdldE91dHN0YW5kaW5nUGF5bWVudHMoc2VsZik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93U2FsZXNSZXBvcnRCeU1vbnRoVmlldygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDaGFydFNlcnZpY2UuZ2V0TW9udGhseVNhbGVzUmVwb3J0KHNlbGYpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2hvd0luY29tZVJlcG9ydEJ5TW9udGhWaWV3KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENoYXJ0U2VydmljZS5nZXRNb250aGx5SW5jb21lUmVwb3J0KHNlbGYpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VsZi5nZXRTYWxlc1JlcG9ydCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYucmVwb3J0UGFyYW1zKTtcclxuICAgICAgICAgICAgc2VsZi5wb1RvdGFsID0gMDtcclxuICAgICAgICAgICAgc2VsZi5wb0NvdW50ID0gMDtcclxuXHJcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgncmVwb3J0cy9nZXRTYWxlc1JlcG9ydCcpLnBvc3QoeyAncmVwb3J0UGFyYW1zJzogc2VsZi5yZXBvcnRQYXJhbXN9KS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucmVzdWx0cyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBvQ291bnQgPSBkYXRhLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYucmVzdWx0c1swXSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gRXJyb3JcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0V29yc3RTZWxsaW5nUHJvZHVjdHMoc2NvcGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3JlcG9ydHMvZ2V0V29yc3RTZWxsaW5nUHJvZHVjdHMnKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYud29yc3RTZWxsaW5nUHJvZHVjdHMgPSBkYXRhO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIEVycm9yXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0T3ZlcmR1ZVB1cmNoYXNlT3JkZXJzKHNjb3BlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdyZXBvcnRzL2dldE92ZXJkdWVQdXJjaGFzZU9yZGVycycpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5vdmVyZHVlUHVyY2hhc2VPcmRlcnMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgLy9zZWxmLnBvQ291bnQgPSBkYXRhLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldE1vbnRobHlJbmNvbWUoc2NvcGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3JlcG9ydHMvZ2V0TW9udGhseVNhbGVzUmVwb3J0JykucG9zdCh7ICdyZXBvcnRQYXJhbXMnOiB7fX0pLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5tb250aGx5SW5jb21lcyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc2NvcGUubW9udGhseUluY29tZXMubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsID0gc2NvcGUubW9udGhseUluY29tZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKHNjb3BlLm1vbnRobHlJbmNvbWVzW2wtMV0ueWVhciwgc2NvcGUubW9udGhseUluY29tZXNbbC0xXS5tb250aCAtIDEsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXJNb250aGx5SW5jb21lTW9udGggPSBkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXJNb250aGx5SW5jb21lVG90YWwgPSBzY29wZS5tb250aGx5SW5jb21lc1tsLTFdLm1vbnRodG90YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmN1ck1vbnRobHlJbmNvbWVQb3MgPSBsIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEVycm9yXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldE91dHN0YW5kaW5nUGF5bWVudHMoc2NvcGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3JlcG9ydHMvZ2V0T3V0c3RhbmRpbmdQYXltZW50cycpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLm91dHN0YW5kaW5nUGF5bWVudHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNjb3BlLm91dHN0YW5kaW5nUGF5bWVudHMubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkID0gbmV3IERhdGUoc2NvcGUub3V0c3RhbmRpbmdQYXltZW50c1swXS55ZWFyLCBzY29wZS5vdXRzdGFuZGluZ1BheW1lbnRzWzBdLm1vbnRoIC0gMSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmN1ck1vbnRobHlPdXRzdGFuZGluZ01vbnRoID0gZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY3VyTW9udGhseU91c3RhbmRpbmdUb3RhbCA9IHNjb3BlLm91dHN0YW5kaW5nUGF5bWVudHNbMF0ub3V0c3RhbmRpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmN1ck1vbnRobHlPdXRzdGFuZGluZ1BvcyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWxmLmNoYW5nZU1vbnRobHlPdXRzdGFuZGluZyA9IGZ1bmN0aW9uKGluY3JlbWVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuY3VyTW9udGhseU91dHN0YW5kaW5nUG9zICs9IGluY3JlbWVudDtcclxuXHJcbiAgICAgICAgICAgIGlmKChzZWxmLmN1ck1vbnRobHlPdXRzdGFuZGluZ1BvcyA8IDApKSB7IHNlbGYuY3VyTW9udGhseU91dHN0YW5kaW5nUG9zID0gMDsgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKChzZWxmLmN1ck1vbnRobHlPdXRzdGFuZGluZ1BvcyArIDEpID4gc2VsZi5vdXRzdGFuZGluZ1BheW1lbnRzLmxlbmd0aCkgeyBzZWxmLmN1ck1vbnRobHlPdXRzdGFuZGluZ1BvcyA9IHNlbGYub3V0c3RhbmRpbmdQYXltZW50cy5sZW5ndGggLSAxOyB9XHJcblxyXG4gICAgICAgICAgICBpZihzZWxmLmN1ck1vbnRobHlPdXRzdGFuZGluZ1BvcyA+PSAwICYmIChzZWxmLmN1ck1vbnRobHlPdXRzdGFuZGluZ1BvcyArIDEpIDw9IHNlbGYub3V0c3RhbmRpbmdQYXltZW50cy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBkID0gbmV3IERhdGUoc2VsZi5vdXRzdGFuZGluZ1BheW1lbnRzW3NlbGYuY3VyTW9udGhseU91dHN0YW5kaW5nUG9zXS55ZWFyLCBzZWxmLm91dHN0YW5kaW5nUGF5bWVudHNbc2VsZi5jdXJNb250aGx5T3V0c3RhbmRpbmdQb3NdLm1vbnRoIC0gMSwgMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi5jdXJNb250aGx5T3V0c3RhbmRpbmdNb250aCA9IGQ7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmN1ck1vbnRobHlPdXN0YW5kaW5nVG90YWwgPSBzZWxmLm91dHN0YW5kaW5nUGF5bWVudHNbc2VsZi5jdXJNb250aGx5T3V0c3RhbmRpbmdQb3NdLm91dHN0YW5kaW5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5jaGFuZ2VNb250aGx5SW5jb21lID0gZnVuY3Rpb24oaW5jcmVtZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnTGVuOicgKyBzZWxmLm1vbnRobHlJbmNvbWVzLmxlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYuY3VyTW9udGhseUluY29tZVBvcyk7XHJcbiAgICAgICAgICAgIHNlbGYuY3VyTW9udGhseUluY29tZVBvcyArPSBpbmNyZW1lbnQ7XHJcblxyXG4gICAgICAgICAgICBpZigoc2VsZi5jdXJNb250aGx5SW5jb21lUG9zIDwgMCkpIHsgc2VsZi5jdXJNb250aGx5SW5jb21lUG9zID0gMDsgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKChzZWxmLmN1ck1vbnRobHlJbmNvbWVQb3MgKyAxKSA+IHNlbGYubW9udGhseUluY29tZXMubGVuZ3RoKSB7IHNlbGYuY3VyTW9udGhseUluY29tZVBvcyA9IHNlbGYubW9udGhseUluY29tZXMubGVuZ3RoIC0gMTsgfVxyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLmN1ck1vbnRobHlJbmNvbWVQb3MpO1xyXG5cclxuICAgICAgICAgICAgaWYoc2VsZi5jdXJNb250aGx5SW5jb21lUG9zID49IDAgJiYgKHNlbGYuY3VyTW9udGhseUluY29tZVBvcyArIDEpIDw9IHNlbGYubW9udGhseUluY29tZXMubGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKHNlbGYubW9udGhseUluY29tZXNbc2VsZi5jdXJNb250aGx5SW5jb21lUG9zXS55ZWFyLCBzZWxmLm1vbnRobHlJbmNvbWVzW3NlbGYuY3VyTW9udGhseUluY29tZVBvc10ubW9udGggLSAxLCAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLmN1ck1vbnRobHlJbmNvbWVNb250aCA9IGQ7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmN1ck1vbnRobHlJbmNvbWVUb3RhbCA9IHNlbGYubW9udGhseUluY29tZXNbc2VsZi5jdXJNb250aGx5SW5jb21lUG9zXS5tb250aHRvdGFsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2V0UG9Ub3RhbCA9IGZ1bmN0aW9uKGl0ZW0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKTtcclxuICAgICAgICAgICAgaWYoaXRlbSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wb1RvdGFsICs9IHBhcnNlRmxvYXQoaXRlbS50b3RhbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1JlcG9ydENvbnRyb2xsZXInLCBbJyRzY29wZScsICckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnQ2hhcnRTZXJ2aWNlJywgUmVwb3J0Q29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBTZWFyY2hDb250cm9sbGVyKCRzY29wZSwgJGF1dGgsIFJlc3Rhbmd1bGFyLCAkc3RhdGUpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLm5vQ2FjaGUgPSB0cnVlO1xyXG4gICAgICAgIHNlbGYuc2VhcmNoVGV4dCA9IFwiXCI7XHJcbiAgICAgICAgc2VsZi5zZWxlY3RlZFJlc3VsdCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgc2VsZi5kb1NlYXJjaCA9IGZ1bmN0aW9uKHF1ZXJ5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9SZXN0U2VydmljZS5kb1NlYXJjaChzZWxmLCBzZWxmLnNlYXJjaFRleHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIub25lKCdzZWFyY2gnLCBxdWVyeSkuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZmlyZVRvZ2dsZVNlYXJjaEV2ZW50ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgLy9zZWxmLiRyb290LiRicm9hZGNhc3QoXCJ0b2dnbGVTZWFyY2hcIiwge3VzZXJuYW1lOiAkc2NvcGUudXNlci51c2VybmFtZSB9KTtcclxuICAgICAgICAgICAgJHNjb3BlLiRyb290LiRicm9hZGNhc3QoXCJ0b2dnbGVTZWFyY2hcIik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5nb3RvSXRlbSA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc2VsZWN0ZWRSZXN1bHQpO1xyXG4gICAgICAgICAgICBpZihzZWxmLnNlbGVjdGVkUmVzdWx0ICE9PSBudWxsICYmIHNlbGYuc2VsZWN0ZWRSZXN1bHQgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hUZXh0ID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIHNlbGYuZmlyZVRvZ2dsZVNlYXJjaEV2ZW50KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgc3dpdGNoKHNlbGYuc2VsZWN0ZWRSZXN1bHQuY29udGVudF90eXBlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwcm9kdWN0XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLnByb2R1Y3RzLmRldGFpbCcsIHsncHJvZHVjdElkJzogc2VsZi5zZWxlY3RlZFJlc3VsdC5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImN1c3RvbWVyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmN1c3RvbWVycy5kZXRhaWwnLCB7J2N1c3RvbWVySWQnOiBzZWxmLnNlbGVjdGVkUmVzdWx0LmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZXZlbnRcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZXZlbnRzLmRldGFpbCcsIHsnZXZlbnRJZCc6IHNlbGYuc2VsZWN0ZWRSZXN1bHQuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ3b3Jrb3JkZXJcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAud29ya29yZGVycy5kZXRhaWwnLCB7J3dvcmtPcmRlcklkJzogc2VsZi5zZWxlY3RlZFJlc3VsdC5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm1hdGVyaWFsXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLm1hdGVyaWFscy5kZXRhaWwnLCB7J21hdGVyaWFsSWQnOiBzZWxmLnNlbGVjdGVkUmVzdWx0LmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicHVyY2hhc2VvcmRlclwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5wdXJjaGFzZW9yZGVycy5kZXRhaWwnLCB7J3B1cmNoYXNlT3JkZXJJZCc6IHNlbGYuc2VsZWN0ZWRSZXN1bHQuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTZWFyY2hDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJGF1dGgnLCAnUmVzdGFuZ3VsYXInLCAnJHN0YXRlJywgU2VhcmNoQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBVbml0Q3JlYXRlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBUb2FzdFNlcnZpY2UsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5jcmVhdGVVbml0ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlzVmFsaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLnVuaXQpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGMgPSBzZWxmLnVuaXQ7XHJcblxyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCd1bml0JykucG9zdChjKS50aGVuKGZ1bmN0aW9uKGQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8kc3RhdGUuZ28oJ2FwcC5jdXN0b21lcnMuZGV0YWlsJywgeydjdXN0b21lcklkJzogZC5uZXdJZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAudW5pdHMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBjcmVhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1VuaXRDcmVhdGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIFVuaXRDcmVhdGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFVuaXREZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0VW5pdChzZWxmLCAkc3RhdGVQYXJhbXMudW5pdElkKTtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVVbml0ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlzVmFsaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi51bml0LnB1dCgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IHVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLnVuaXRzXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlVW5pdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYudW5pdC5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC51bml0c1wiKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIERlbGV0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2hvd0RlbGV0ZUNvbmZpcm0gPSBmdW5jdGlvbihldilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZXYsICdEZWxldGUgdW5pdD8nLCAnJyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZVVuaXQoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVW5pdERldGFpbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdUb2FzdFNlcnZpY2UnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsICckc3RhdGVQYXJhbXMnLCBVbml0RGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBVbml0Q29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxVbml0cyhzZWxmKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1VuaXRDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCBVbml0Q29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBXb3JrT3JkZXJDcmVhdGVDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBVcGxvYWRTZXJ2aWNlLCBUb2FzdFNlcnZpY2UsICRtb21lbnQsIFJlc3RTZXJ2aWNlLCBWYWxpZGF0aW9uU2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsQ3VzdG9tZXJzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFByb2R1Y3RzKHNlbGYpO1xyXG5cclxuICAgICAgICBzZWxmLm51bWVyaWNSZWdleCA9IFZhbGlkYXRpb25TZXJ2aWNlLm51bWVyaWNSZWdleCgpO1xyXG4gICAgICAgIHNlbGYud29ya29yZGVyID0ge307XHJcblxyXG4gICAgICAgIHNlbGYudXBsb2FkRmlsZSA9IGZ1bmN0aW9uKGZpbGUsIGVyckZpbGVzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mID0gZmlsZTtcclxuICAgICAgICAgICAgc2VsZi5lcnJGaWxlID0gZXJyRmlsZXMgJiYgZXJyRmlsZXNbMF07XHJcbiAgICAgICAgICAgIGlmKGZpbGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFVwbG9hZFNlcnZpY2UudXBsb2FkRmlsZSgnJywgZmlsZSkudGhlbihmdW5jdGlvbiAocmVzcClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihyZXNwLmRhdGEuc3VjY2VzcyA9PSAxKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnc3VjY2Vzc2Z1bCB1cGxvYWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi53b3Jrb3JkZXIuaW1hZ2VfZmlsZW5hbWUgPSByZXNwLmRhdGEuZmlsZW5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ1N1Y2Nlc3MgJyArIHJlc3AuY29uZmlnLmRhdGEuZmlsZS5uYW1lICsgJ3VwbG9hZGVkLiBSZXNwb25zZTogJyArIHJlc3AuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzcClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcC5zdGF0dXMgPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lcnJvck1zZyA9IHJlc3Auc3RhdHVzICsgJzogJyArIHJlc3AuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHN0YXR1czogJyArIHJlc3Auc3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChldnQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZS5wcm9ncmVzcyA9IE1hdGgubWluKDEwMCwgcGFyc2VJbnQoMTAwLjAgKiBldnQubG9hZGVkIC8gZXZ0LnRvdGFsKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuY3JlYXRlV29ya09yZGVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlzVmFsaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLndvcmtvcmRlcik7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHcgPSBzZWxmLndvcmtvcmRlcjtcclxuXHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3dvcmtvcmRlcicpLnBvc3QodykudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyRzdGF0ZS5nbygnYXBwLndvcmtvcmRlcnMuZGV0YWlsJywgeyd3b3JrT3JkZXJJZCc6IDF9KTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC53b3Jrb3JkZXJzJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdXb3JrT3JkZXJDcmVhdGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnVXBsb2FkU2VydmljZScsICdUb2FzdFNlcnZpY2UnLCAnJG1vbWVudCcsICdSZXN0U2VydmljZScsICdWYWxpZGF0aW9uU2VydmljZScsICckc3RhdGVQYXJhbXMnLCBXb3JrT3JkZXJDcmVhdGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFdvcmtPcmRlckRldGFpbENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgJHNjb3BlLCBUb2FzdFNlcnZpY2UsIFJlc3Rhbmd1bGFyLCBVcGxvYWRTZXJ2aWNlLCBSZXN0U2VydmljZSwgRGlhbG9nU2VydmljZSwgVmFsaWRhdGlvblNlcnZpY2UsICRtb21lbnQsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJHN0YXRlUGFyYW1zKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRXb3JrT3JkZXIoc2VsZiwgJHN0YXRlUGFyYW1zLndvcmtPcmRlcklkKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxDdXN0b21lcnMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUHJvZHVjdHMoc2VsZik7XHJcblxyXG4gICAgICAgIHNlbGYubnVtZXJpY1JlZ2V4ID0gVmFsaWRhdGlvblNlcnZpY2UubnVtZXJpY1JlZ2V4KCk7XHJcblxyXG4gICAgICAgIHNlbGYudG9nZ2xlQ29tcGxldGUgPSBmdW5jdGlvbihjYlN0YXRlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coY2JTdGF0ZSk7XHJcbiAgICAgICAgICAgIC8vaWYoY2JTdGF0ZSkgeyBzZWxmLndvcmtvcmRlci5jb21wbGV0ZWQgPSAxOyB9XHJcbiAgICAgICAgICAgIC8vZWxzZSB7IHNlbGYud29ya29yZGVyLmNvbXBsZXRlZCA9IDA7IH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnZpZXdBdHRhY2htZW50ID0gZnVuY3Rpb24oZXYsIGZpbGVuYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgJHNjb3BlLmEgPSBhdHRhY2htZW50UGF0aCAgKyAnLycgKyBmaWxlbmFtZTtcclxuXHJcbiAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKGV2LCAnZGxnQXR0YWNobWVudFZpZXcnLCAkc2NvcGUpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NvbmZpcm1lZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhdHRhY2htZW50UGF0aCAgKyAnLycgKyBmaWxlbmFtZSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVBdHRhY2htZW50ID0gZnVuY3Rpb24oZXYsIGZpbGVuYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZyA9IERpYWxvZ1NlcnZpY2UuY29uZmlybShldiwgJ0RlbGV0ZSBhdHRhY2htZW50PycsICcnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFVwbG9hZFNlcnZpY2UuZGVsZXRlRmlsZShmaWxlbmFtZSkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLndvcmtvcmRlci5pbWFnZV9maWxlbmFtZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZi5wcm9ncmVzcyA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmYgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJBdHRhY2hlbnQgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBkZWxldGluZyBhdHRhY2htZW50XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYudXBsb2FkRmlsZSA9IGZ1bmN0aW9uKGZpbGUsIGVyckZpbGVzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mID0gZmlsZTtcclxuICAgICAgICAgICAgc2VsZi5lcnJGaWxlID0gZXJyRmlsZXMgJiYgZXJyRmlsZXNbMF07XHJcbiAgICAgICAgICAgIGlmKGZpbGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBmbmFtZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi53b3Jrb3JkZXIuaW1hZ2VfZmlsZW5hbWUgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICYmIHNlbGYud29ya29yZGVyLmltYWdlX2ZpbGVuYW1lICE9PSBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgc2VsZi53b3Jrb3JkZXIuaW1hZ2VfZmlsZW5hbWUgIT09ICdudWxsJ1xyXG4gICAgICAgICAgICAgICAgICAgICYmIHNlbGYud29ya29yZGVyLmltYWdlX2ZpbGVuYW1lICE9PSAnJylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBmbmFtZSA9IHNlbGYud29ya29yZGVyLmltYWdlX2ZpbGVuYW1lO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIFVwbG9hZFNlcnZpY2UudXBsb2FkRmlsZShmbmFtZSwgZmlsZSkudGhlbihmdW5jdGlvbiAocmVzcClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihyZXNwLmRhdGEuc3VjY2VzcyA9PSAxKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnc3VjY2Vzc2Z1bCB1cGxvYWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi53b3Jrb3JkZXIuaW1hZ2VfZmlsZW5hbWUgPSByZXNwLmRhdGEuZmlsZW5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ1N1Y2Nlc3MgJyArIHJlc3AuY29uZmlnLmRhdGEuZmlsZS5uYW1lICsgJ3VwbG9hZGVkLiBSZXNwb25zZTogJyArIHJlc3AuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzcClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcC5zdGF0dXMgPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lcnJvck1zZyA9IHJlc3Auc3RhdHVzICsgJzogJyArIHJlc3AuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHN0YXR1czogJyArIHJlc3Auc3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChldnQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZS5wcm9ncmVzcyA9IE1hdGgubWluKDEwMCwgcGFyc2VJbnQoMTAwLjAgKiBldnQubG9hZGVkIC8gZXZ0LnRvdGFsKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlV29ya09yZGVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlzVmFsaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi53b3Jrb3JkZXIucHV0KCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgdXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAud29ya29yZGVyc1wiKTtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVdvcmtPcmRlciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYud29ya29yZGVyLnJlbW92ZSgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBkZWxldGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLndvcmtvcmRlcnNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBkZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zaG93RGVsZXRlQ29uZmlybSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZyA9IERpYWxvZ1NlcnZpY2UuY29uZmlybShldiwgJ0RlbGV0ZSB3b3JrIG9yZGVyPycsICcnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlV29ya09yZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1dvcmtPcmRlckRldGFpbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICckc2NvcGUnLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3Rhbmd1bGFyJywgJ1VwbG9hZFNlcnZpY2UnLCAnUmVzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsICdWYWxpZGF0aW9uU2VydmljZScsICckbW9tZW50JywgJyRzdGF0ZVBhcmFtcycsIFdvcmtPcmRlckRldGFpbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gV29ya09yZGVyQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRtb21lbnQpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLnNob3dDb21wbGV0ZSA9IGZhbHNlO1xyXG4gICAgICAgIHZhciB0b2RheXNEYXRlID0gJG1vbWVudCgpO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxXb3JrT3JkZXJzKHNlbGYpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi5zZXRVcmdlbmN5ID0gZnVuY3Rpb24ob2JqRGF0ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIDMgZGF5cywgNyBkYXlzLCAzMCBkYXlzLCB0aGUgcmVzdFxyXG4gICAgICAgICAgICB2YXIgZCA9ICRtb21lbnQob2JqRGF0ZSk7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgIHZhciBkYXlEaWZmID0gZC5kaWZmKHRvZGF5c0RhdGUsICdkYXlzJyk7XHJcblxyXG4gICAgICAgICAgICBpZihkYXlEaWZmID4gMzApIC8vIGdyZWVuXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImZhcldvcmtPcmRlclwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoZGF5RGlmZiA+IDcgJiYgZGF5RGlmZiA8PSAzMCkgLy8gYmx1ZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJjbG9zZVdvcmtPcmRlclwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoZGF5RGlmZiA+IDMgJiYgZGF5RGlmZiA8PSA3KSAvLyBvcmFuZ2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiY2xvc2VyV29ya09yZGVyXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSAvLyByZWRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiY2xvc2VzdFdvcmtPcmRlclwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGQuZGlmZih0b2RheXNEYXRlLCAnZGF5cycpKTtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi50b2dnbGVDb21wbGV0ZU9ubHkgPSBmdW5jdGlvbihjYlN0YXRlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RvZ2dsZScpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjYlN0YXRlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignV29ya09yZGVyQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJyRtb21lbnQnLCBXb3JrT3JkZXJDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
