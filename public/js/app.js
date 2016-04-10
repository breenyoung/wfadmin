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
            .state('app.bookeddates', {
                url: '/bookeddates',
                views: {
                    'main@': {
                        templateUrl: getView('bookeddates'),
                        controller: 'BookedDateController',
                        controllerAs: 'ctrlBookedDate'
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

    function BookedDateController($auth, $state, Restangular, RestService)
    {
        var self = this;

    }

    angular.module('app.controllers').controller('BookedDateController', ['$auth', '$state', 'Restangular', 'RestService', BookedDateController]);

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHAuanMiLCJhcHAvcm91dGVzLmpzIiwiYXBwL2RpcmVjdGl2ZXMvYXBwTG9hZGluZy5qcyIsImFwcC9kaXJlY3RpdmVzL2ZvY3VzT24uanMiLCJhcHAvZGlyZWN0aXZlcy91dGMtcGFyc2VyLmRpcmVjdGl2ZS5qcyIsImFwcC9maWx0ZXJzL3RydW5jYXRlTmFtZS5qcyIsImFwcC9zZXJ2aWNlcy9hdXRoLmpzIiwiYXBwL3NlcnZpY2VzL2NoYXJ0LmpzIiwiYXBwL3NlcnZpY2VzL2RpYWxvZy5qcyIsImFwcC9zZXJ2aWNlcy9mb2N1cy5qcyIsImFwcC9zZXJ2aWNlcy9ndWlkLmpzIiwiYXBwL3NlcnZpY2VzL3Jlc3QuanMiLCJhcHAvc2VydmljZXMvdG9hc3QuanMiLCJhcHAvc2VydmljZXMvdXBsb2FkLmpzIiwiYXBwL3NlcnZpY2VzL3ZhbGlkYXRpb24uanMiLCJhcHAvY29udHJvbGxlcnMvYm9va2VkZGF0ZXMvYm9va2VkZGF0ZXMuanMiLCJhcHAvY29udHJvbGxlcnMvY29yZS9jb3JlLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2N1c3RvbWVycy9jdXN0b21lci5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvY3VzdG9tZXJzL2N1c3RvbWVyLmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy9jdXN0b21lcnMvY3VzdG9tZXJzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2V2ZW50cy9ldmVudC5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvZXZlbnRzL2V2ZW50LmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy9ldmVudHMvZXZlbnRzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2Zvb3Rlci9mb290ZXIuanMiLCJhcHAvY29udHJvbGxlcnMvaGVhZGVyL2hlYWRlci5qcyIsImFwcC9jb250cm9sbGVycy9sYW5kaW5nL2xhbmRpbmcuanMiLCJhcHAvY29udHJvbGxlcnMvbG9naW4vbG9naW4uanMiLCJhcHAvY29udHJvbGxlcnMvbWF0ZXJpYWxzL21hdGVyaWFsLmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy9tYXRlcmlhbHMvbWF0ZXJpYWwuZGV0YWlsLmpzIiwiYXBwL2NvbnRyb2xsZXJzL21hdGVyaWFscy9tYXRlcmlhbHMuanMiLCJhcHAvY29udHJvbGxlcnMvbWF0ZXJpYWxzZXRzL21hdGVyaWFsc2V0cy5qcyIsImFwcC9jb250cm9sbGVycy9wYXltZW50X3R5cGVzL3BheW1lbnR0eXBlLmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy9wYXltZW50X3R5cGVzL3BheW1lbnR0eXBlLmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy9wYXltZW50X3R5cGVzL3BheW1lbnR0eXBlcy5qcyIsImFwcC9jb250cm9sbGVycy9wcm9kdWN0cy9wcm9kdWN0LmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy9wcm9kdWN0cy9wcm9kdWN0LmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy9wcm9kdWN0cy9wcm9kdWN0cy5qcyIsImFwcC9jb250cm9sbGVycy9wdXJjaGFzZW9yZGVycy9wdXJjaGFzZW9yZGVyLmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy9wdXJjaGFzZW9yZGVycy9wdXJjaGFzZW9yZGVyLmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy9wdXJjaGFzZW9yZGVycy9wdXJjaGFzZW9yZGVycy5qcyIsImFwcC9jb250cm9sbGVycy9yZXBvcnRzL3JlcG9ydHMuanMiLCJhcHAvY29udHJvbGxlcnMvc2VhcmNoL3NlYXJjaC5qcyIsImFwcC9jb250cm9sbGVycy91bml0cy91bml0LmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy91bml0cy91bml0LmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy91bml0cy91bml0cy5qcyIsImFwcC9jb250cm9sbGVycy93b3Jrb3JkZXJzL3dvcmtvcmRlci5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvd29ya29yZGVycy93b3Jrb3JkZXIuZGV0YWlsLmpzIiwiYXBwL2NvbnRyb2xsZXJz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O2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLGlCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLHdCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLHdCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLGtCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLHlCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLHlCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLGNBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEscUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEscUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsZUFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSw0QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxxQkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSw0QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSw2QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxxQ0FBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSw4QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxhQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLG9CQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLG9CQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLGlCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLHdCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLHdCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLHNCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLDZCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLDZCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLG9CQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLDJCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLDJCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLGVBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBOzs7O2FBSUEsTUFBQSxvQkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JB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Z0NBQ0EsT0FBQTtnQ0FDQSxNQUFBOzs0QkFFQTs0QkFDQTtnQ0FDQSxNQUFBOzs7d0JBR0E7d0JBQ0E7Ozs7O29CQUtBLE9BQUE7d0JBQ0EsTUFBQTs7O29CQUdBLFNBQUE7OztnQkFHQSxZQUFBLElBQUEsaUNBQUEsS0FBQSxFQUFBLGdCQUFBLEtBQUEsS0FBQSxTQUFBO2dCQUNBO29CQUNBLElBQUEsVUFBQTtvQkFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxRQUFBO29CQUNBO3dCQUNBLElBQUEsZUFBQSxLQUFBOzt3QkFFQSxRQUFBLEtBQUEsQ0FBQSxLQUFBLElBQUEsU0FBQSxhQUFBLE9BQUEsU0FBQSxhQUFBLFNBQUEsSUFBQSxTQUFBLGFBQUE7OztvQkFHQSxNQUFBLFlBQUEsU0FBQSxDQUFBLENBQUEsTUFBQSxvQkFBQSxNQUFBOztvQkFFQSxNQUFBLFlBQUEsVUFBQTs7O2dCQUdBO2dCQUNBOzs7OztZQUtBLHdCQUFBLFNBQUE7WUFDQTs7Z0JBRUEsTUFBQSxjQUFBO29CQUNBLFNBQUE7d0JBQ0EsT0FBQTs0QkFDQSxNQUFBOzt3QkFFQTt3QkFDQTs0QkFDQSxLQUFBOzRCQUNBOzRCQUNBO2dDQUNBLE1BQUE7Ozt3QkFHQTt3QkFDQTs0QkFDQSxNQUFBOzRCQUNBOzRCQUNBO2dDQUNBLE9BQUE7Z0NBQ0EsTUFBQTs7NEJBRUE7NEJBQ0E7Z0NBQ0EsTUFBQTs7O3dCQUdBO3dCQUNBOzs7OztvQkFLQSxPQUFBO3dCQUNBLE1BQUE7OztvQkFHQSxTQUFBOzs7Z0JBR0EsWUFBQSxJQUFBLGlDQUFBLEtBQUEsRUFBQSxnQkFBQSxLQUFBLEtBQUEsU0FBQTtvQkFDQTt3QkFDQSxJQUFBLFVBQUE7d0JBQ0EsSUFBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsUUFBQTt3QkFDQTs0QkFDQSxJQUFBLGVBQUEsS0FBQTs7NEJBRUEsUUFBQSxLQUFBLENBQUEsS0FBQSxJQUFBLFNBQUEsYUFBQSxPQUFBLFNBQUEsYUFBQSxTQUFBLElBQUEsV0FBQSxhQUFBOzs7d0JBR0EsTUFBQSxZ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QSxZQUFBLElBQUEsWUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO2dCQUNBOztvQkFFQSxNQUFBLFdBQUE7Ozs7WUFJQSxrQkFBQSxTQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLGFBQUEsVUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsYUFBQTs7Ozs7O1lBTUEsY0FBQSxTQUFBLE9BQUE7WUFDQTtnQkFDQSxZQUFBLElBQUEsYUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO2dCQUNBOzs7O29CQUlBLEtBQUEsYUFBQSxRQUFBLEtBQUE7b0JBQ0EsS0FBQSxXQUFBLFFBQUEsS0FBQTs7O29CQUdBLEtBQUEsWUFBQSxTQUFBLEtBQUE7O29CQUVBLEtBQUEsWUFBQTs7O29CQUdBLE1BQUEsWUFBQTs7OztZQUlBLGNBQUEsU0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxTQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBOztvQkFFQSxNQUFBLFNBQUE7Ozs7WUFJQSxVQUFBLFNBQUEsT0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxTQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsUUFBQTs7OztZQUlBLGFBQUEsU0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxRQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBOztvQkFFQSxNQUFBLFFBQUE7Ozs7WUFJQSxTQUFBLFNBQUEsT0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxRQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsT0FBQTs7OztZQUlBLGlCQUFBLFNBQUE7WUFDQTtnQkFDQSxZQUFBLElBQUEsWUFBQSxVQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxZQUFBOzs7O1lBSUEsYUFBQSxTQUFBLE9BQUE7WUFDQTtnQkFDQSxZQUFBLElBQUEsWUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO2dCQUNBOztvQkFFQSxNQUFBLFdBQUE7Ozs7WUFJQSxVQUFBLFNBQUEsT0FBQTtZQUNBO2dCQUNBLFFBQUEs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QSxRQUFBLEtBQUEsbUJBQUE7WUFDQTtnQkFDQSxLQUFBLGFBQUE7Z0JBQ0EsS0FBQTs7Z0JBRUEsT0FBQSxLQUFBLGVBQUE7O29CQUVBLEtBQUE7d0JBQ0EsT0FBQSxHQUFBLHVCQUFBLENBQUEsYUFBQSxLQUFBLGVBQUE7d0JBQ0E7O29CQUVBLEtBQUE7d0JBQ0EsT0FBQSxHQUFBLHdCQUFBLENBQUEsY0FBQSxLQUFBLGVBQUE7d0JBQ0E7O29CQUVBLEtBQUE7d0JBQ0EsT0FBQSxHQUFBLHFCQUFBLENBQUEsV0FBQSxLQUFBLGVBQUE7d0JBQ0E7O29CQUVBLEtBQUE7d0JBQ0EsT0FBQSxHQUFBLHlCQUFBLENBQUEsZUFBQSxLQUFBLGVBQUE7d0JBQ0E7O29CQUVBLEtBQUE7d0JBQ0EsT0FBQSxHQUFBLHdCQUFBLENBQUEsY0FBQSxLQUFBLGVBQUE7d0JBQ0E7O29CQUVBLEtBQUE7d0JBQ0EsT0FBQSxHQUFBLDZCQUFBLENBQUEsbUJBQUEsS0FBQSxlQUFBO3dCQUNBOzs7Ozs7SUFNQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxvQkFBQSxDQUFBLFVBQUEsU0FBQSxlQUFBLFVBQUE7Ozs7QUNqRUEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSxxQkFBQSxPQUFBLFFBQUEsY0FBQSxhQUFBLGFBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTs7UUFFQSxLQUFBLGFBQUE7UUFDQTtZQUNBLEtBQUEsTUFBQTs7WUFFQSxJQUFBLFVBQUEsS0FBQSxNQUFBOzs7WUFHQSxHQUFBO1lBQ0E7O2dCQUVBLElBQUEsSUFBQSxLQUFBOztnQkFFQSxZQUFBLElBQUEsUUFBQSxLQUFBLEdBQUEsS0FBQSxTQUFBO2dCQUNBO29CQUNBLFFBQUEsSUFBQTs7b0JBRUEsYUFBQSxLQUFBO29CQUNBLE9BQUEsR0FBQTs7bUJBRUE7Z0JBQ0E7b0JBQ0EsYUFBQSxLQUFBOzs7Ozs7O0lBT0EsUUFBQSxPQUFBLG1CQUFBLFdBQUEsd0JBQUEsQ0FBQSxTQUFBLFVBQUEsZ0JBQUEsZUFBQSxlQUFBLGdCQUFBOzs7O0FDbkNBLENBQUEsVUFB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QUNBO1lBQ0EsUUFBQSxJQUFBO1lBQ0EsUUFBQSxJQUFBOzs7OztJQUtBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHVCQUFBLENBQUEsU0FBQSxVQUFBLGVBQUEsZUFBQSxXQUFBOzs7QUFHQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJyxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgICdhcHAuY29udHJvbGxlcnMnLFxyXG4gICAgICAgICAgICAnYXBwLmZpbHRlcnMnLFxyXG4gICAgICAgICAgICAnYXBwLnNlcnZpY2VzJyxcclxuICAgICAgICAgICAgJ2FwcC5kaXJlY3RpdmVzJyxcclxuICAgICAgICAgICAgJ2FwcC5yb3V0ZXMnLFxyXG4gICAgICAgICAgICAnYXBwLmNvbmZpZydcclxuICAgICAgICBdKS5jb25zdGFudCgnbXlDb25maWcnLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgJ21hdGVyaWFsU2V0c0xTS2V5JzogJ21hdGVyaWFsU2V0cydcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJywgWyd1aS5yb3V0ZXInLCAnc2F0ZWxsaXplcicsICdyZXN0YW5ndWxhcicsICdhbmd1bGFyLW1vbWVudGpzJywgJ25nTWF0ZXJpYWwnLCAnbmdGaWxlVXBsb2FkJ10pO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnLCBbJ3VpLnJvdXRlcicsICdzYXRlbGxpemVyJ10pO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycsIFsndWkucm91dGVyJywgJ25nTWF0ZXJpYWwnLCAncmVzdGFuZ3VsYXInLCAnYW5ndWxhci1tb21lbnRqcycsICdhcHAuc2VydmljZXMnLCAnbmdNZXNzYWdlcycsICduZ01kSWNvbnMnLCAnbWQuZGF0YS50YWJsZScsICdoaWdoY2hhcnRzLW5nJywgJ25nQ29va2llcyddKTtcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycsIFtdKTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnLCBbJ2FuZ3VsYXItbW9tZW50anMnLCAnbmdBbmltYXRlJ10pO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnLCBbXSk7XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyBDb25maWd1cmF0aW9uIHN0dWZmXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoJGF1dGhQcm92aWRlcilcclxuICAgIHtcclxuICAgICAgICAvLyBTYXRlbGxpemVyIGNvbmZpZ3VyYXRpb24gdGhhdCBzcGVjaWZpZXMgd2hpY2ggQVBJXHJcbiAgICAgICAgLy8gcm91dGUgdGhlIEpXVCBzaG91bGQgYmUgcmV0cmlldmVkIGZyb21cclxuICAgICAgICAkYXV0aFByb3ZpZGVyLmxvZ2luVXJsID0gJy9hcGkvYXV0aGVudGljYXRlJztcclxuICAgIH0pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uICgkbW9tZW50UHJvdmlkZXIpXHJcbiAgICB7XHJcbiAgICAgICAgJG1vbWVudFByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5hc3luY0xvYWRpbmcoZmFsc2UpXHJcbiAgICAgICAgICAgIC5zY3JpcHRVcmwoJy8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL21vbWVudC5qcy8yLjUuMS9tb21lbnQubWluLmpzJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyggZnVuY3Rpb24oUmVzdGFuZ3VsYXJQcm92aWRlcikge1xyXG4gICAgICAgIFJlc3Rhbmd1bGFyUHJvdmlkZXJcclxuICAgICAgICAgICAgLnNldEJhc2VVcmwoJy9hcGkvJylcclxuICAgICAgICAgICAgLnNldERlZmF1bHRIZWFkZXJzKHsgYWNjZXB0OiBcImFwcGxpY2F0aW9uL3gubGFyYXZlbC52MStqc29uXCIgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyggZnVuY3Rpb24oJG1kVGhlbWluZ1Byb3ZpZGVyKSB7XHJcbiAgICAgICAgLyogRm9yIG1vcmUgaW5mbywgdmlzaXQgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyanMub3JnLyMvVGhlbWluZy8wMV9pbnRyb2R1Y3Rpb24gKi9cclxuXHJcbiAgICAgICAgdmFyIGN1c3RvbUJsdWVNYXAgPSAkbWRUaGVtaW5nUHJvdmlkZXIuZXh0ZW5kUGFsZXR0ZSgnbGlnaHQtYmx1ZScsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAnY29udHJhc3REZWZhdWx0Q29sb3InOiAnbGlnaHQnLFxyXG4gICAgICAgICAgICAnY29udHJhc3REYXJrQ29sb3JzJzogWyc1MCddLFxyXG4gICAgICAgICAgICAnNTAnOiAnZmZmZmZmJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnY3VzdG9tQmx1ZScsIGN1c3RvbUJsdWVNYXApO1xyXG4gICAgICAgICRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgnZGVmYXVsdCcpXHJcbiAgICAgICAgICAgIC5wcmltYXJ5UGFsZXR0ZSgnY3VzdG9tQmx1ZScsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICdkZWZhdWx0JzogJzUwMCcsXHJcbiAgICAgICAgICAgICAgICAnaHVlLTEnOiAnNTAnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5hY2NlbnRQYWxldHRlKCdwaW5rJyk7XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24oJG1kRGF0ZUxvY2FsZVByb3ZpZGVyKVxyXG4gICAge1xyXG4gICAgICAgICRtZERhdGVMb2NhbGVQcm92aWRlci5mb3JtYXREYXRlID0gZnVuY3Rpb24oZGF0ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKGRhdGUgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vbWVudChkYXRlKS5mb3JtYXQoJ01NLURELVlZWVknKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBDaGVjayBmb3IgYXV0aGVudGljYXRlZCB1c2VyIG9uIGV2ZXJ5IHJlcXVlc3RcclxuICAgIGFwcC5ydW4oWyckcm9vdFNjb3BlJywgJyRsb2NhdGlvbicsICckc3RhdGUnLCAnQXV0aFNlcnZpY2UnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJGxvY2F0aW9uLCAkc3RhdGUsIEF1dGhTZXJ2aWNlKSB7XHJcblxyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcywgb3B0aW9ucylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ0F0dGVtcHRpbmcgdG8gZ2V0IHVybDogWycgKyB0b1N0YXRlLm5hbWUgKyAnXScpO1xyXG4gICAgICAgICAgICAvLyBMZXQgYW55b25lIGdvIHRvIHRoZSBsb2dpbiBwYWdlLCBjaGVjayBhdXRoIG9uIGFsbCBvdGhlciBwYWdlc1xyXG4gICAgICAgICAgICBpZih0b1N0YXRlLm5hbWUgIT09ICdhcHAubG9naW4nKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZighQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1c2VyIG5vdCBsb2dnZWQgaW4sIHJlZGlyZWN0IHRvIGxvZ2luIHBhZ2VcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5sb2dpbicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XSk7XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbigpXHJcbntcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnKS5jb25maWcoIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRhdXRoUHJvdmlkZXIgKSB7XHJcblxyXG4gICAgICAgIHZhciBnZXRWaWV3ID0gZnVuY3Rpb24oIHZpZXdOYW1lICl7XHJcbiAgICAgICAgICAgIHJldHVybiAnL3ZpZXdzL2FwcC8nICsgdmlld05hbWUgKyAnLmh0bWwnO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9wdXJjaGFzZW9yZGVycycpO1xyXG5cclxuXHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAnLCB7XHJcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdoZWFkZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0hlYWRlckNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsSGVhZGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZm9vdGVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdmb290ZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0Zvb3RlckNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsRm9vdGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbWFpbjoge31cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAubG9naW4nLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvbG9naW4nLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdsb2dpbicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9naW5Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybExvZ2luJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAubGFuZGluZycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9sYW5kaW5nJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnbGFuZGluZycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTGFuZGluZ0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsTGFuZGluZydcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnByb2R1Y3RzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3Byb2R1Y3RzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncHJvZHVjdHMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Byb2R1Y3RDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFByb2R1Y3QnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5wcm9kdWN0cy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzpwcm9kdWN0SWQnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwcm9kdWN0LmRldGFpbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdERldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUHJvZHVjdERldGFpbCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnByb2R1Y3RzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwcm9kdWN0LmNyZWF0ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdENyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUHJvZHVjdENyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmN1c3RvbWVycycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jdXN0b21lcnMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdjdXN0b21lcnMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0N1c3RvbWVyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxDdXN0b21lcidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmN1c3RvbWVycy5jcmVhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvY3JlYXRlJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnY3VzdG9tZXIuY3JlYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDdXN0b21lckNyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsQ3VzdG9tZXJDcmVhdGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5jdXN0b21lcnMuZGV0YWlsJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2RldGFpbC86Y3VzdG9tZXJJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2N1c3RvbWVyLmRldGFpbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ3VzdG9tZXJEZXRhaWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybEN1c3RvbWVyRGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAud29ya29yZGVycycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy93b3Jrb3JkZXJzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0Vmlldygnd29ya29yZGVycycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnV29ya09yZGVyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxXb3JrT3JkZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC53b3Jrb3JkZXJzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd3b3Jrb3JkZXIuY3JlYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdXb3JrT3JkZXJDcmVhdGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFdvcmtPcmRlckNyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLndvcmtvcmRlcnMuZGV0YWlsJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2RldGFpbC86d29ya09yZGVySWQnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd3b3Jrb3JkZXIuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdXb3JrT3JkZXJEZXRhaWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFdvcmtPcmRlckRldGFpbCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmV2ZW50cycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9ldmVudHMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdldmVudHMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0V2ZW50Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxFdmVudCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmV2ZW50cy5jcmVhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvY3JlYXRlJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnZXZlbnQuY3JlYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFdmVudENyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsRXZlbnRDcmVhdGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5ldmVudHMuZGV0YWlsJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2RldGFpbC86ZXZlbnRJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2V2ZW50LmRldGFpbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRXZlbnREZXRhaWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybEV2ZW50RGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucmVwb3J0cycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9yZXBvcnRzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncmVwb3J0cycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVwb3J0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxSZXBvcnQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5yZXBvcnRzLmN1cnJlbnRzdG9jaycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jdXJyZW50c3RvY2snLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdyZXBvcnQuY3VycmVudHN0b2NrJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXBvcnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFJlcG9ydCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnJlcG9ydHMuc2FsZXMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvc2FsZXMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdyZXBvcnQuc2FsZXMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcG9ydENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUmVwb3J0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucmVwb3J0cy5zYWxlc2J5bW9udGgnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvc2FsZXNieW1vbnRoJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncmVwb3J0LnNhbGVzYnltb250aCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVwb3J0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxSZXBvcnQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5yZXBvcnRzLmluY29tZWJ5bW9udGgnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvaW5jb21lYnltb250aCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3JlcG9ydC5pbmNvbWVieW1vbnRoJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXBvcnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFJlcG9ydCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnJlcG9ydHMucHJvZHVjdHByb2ZpdHBlcmNlbnRzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3Byb2R1Y3Rwcm9maXRwZXJjZW50cycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3JlcG9ydC5wcm9kdWN0cHJvZml0cGVyY2VudHMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcG9ydENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUmVwb3J0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucmVwb3J0cy53ZWVrd29ya29yZGVycycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy93ZWVrd29ya29yZGVycycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3JlcG9ydC53ZWVrd29ya29yZGVycycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVwb3J0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxSZXBvcnQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC51bml0cycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy91bml0cycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3VuaXRzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdVbml0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxVbml0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAudW5pdHMuY3JlYXRlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NyZWF0ZScsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3VuaXQuY3JlYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdVbml0Q3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxVbml0Q3JlYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAudW5pdHMuZGV0YWlsJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2RldGFpbC86dW5pdElkJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygndW5pdC5kZXRhaWwnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VuaXREZXRhaWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFVuaXREZXRhaWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5tYXRlcmlhbHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvbWF0ZXJpYWxzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnbWF0ZXJpYWxzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNYXRlcmlhbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsTWF0ZXJpYWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5tYXRlcmlhbHMuY3JlYXRlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NyZWF0ZScsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ21hdGVyaWFsLmNyZWF0ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWF0ZXJpYWxDcmVhdGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybE1hdGVyaWFsQ3JlYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAubWF0ZXJpYWxzLmRldGFpbCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9kZXRhaWwvOm1hdGVyaWFsSWQnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdtYXRlcmlhbC5kZXRhaWwnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01hdGVyaWFsRGV0YWlsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxNYXRlcmlhbERldGFpbCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnB1cmNoYXNlb3JkZXJzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3B1cmNoYXNlb3JkZXJzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncHVyY2hhc2VvcmRlcnMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1B1cmNoYXNlT3JkZXJDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFB1cmNoYXNlT3JkZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5wdXJjaGFzZW9yZGVycy5jcmVhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvY3JlYXRlJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncHVyY2hhc2VvcmRlci5jcmVhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1B1cmNoYXNlT3JkZXJDcmVhdGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFB1cmNoYXNlT3JkZXJDcmVhdGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5wdXJjaGFzZW9yZGVycy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzpwdXJjaGFzZU9yZGVySWQnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwdXJjaGFzZW9yZGVyLmRldGFpbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHVyY2hhc2VPcmRlckRldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUHVyY2hhc2VPcmRlckRldGFpbCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnBheW1lbnR0eXBlcycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9wYXltZW50dHlwZXMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwYXltZW50dHlwZXMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1BheW1lbnRUeXBlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQYXltZW50VHlwZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnBheW1lbnR0eXBlcy5jcmVhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvY3JlYXRlJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncGF5bWVudHR5cGUuY3JlYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQYXltZW50VHlwZUNyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUGF5bWVudFR5cGVDcmVhdGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5wYXltZW50dHlwZXMuZGV0YWlsJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2RldGFpbC86cGF5bWVudFR5cGVJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3BheW1lbnR0eXBlLmRldGFpbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUGF5bWVudFR5cGVEZXRhaWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFBheW1lbnRUeXBlRGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAubG9va3VwcycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9sb29rdXBzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnbG9va3VwcycpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5tYXRlcmlhbHNldHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvbWF0ZXJpYWxzZXRzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnbWF0ZXJpYWxzZXRzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNYXRlcmlhbFNldENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsTWF0ZXJpYWxTZXQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5ib29rZWRkYXRlcycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9ib29rZWRkYXRlcycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2Jvb2tlZGRhdGVzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rZWREYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxCb29rZWREYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIDtcclxuXHJcbiAgICB9ICk7XHJcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdtQXBwTG9hZGluZycsIGZ1bmN0aW9uICgkYW5pbWF0ZSlcclxue1xyXG4gICAgLy8gUmV0dXJuIHRoZSBkaXJlY3RpdmUgY29uZmlndXJhdGlvbi5cclxuICAgIHJldHVybih7XHJcbiAgICAgICAgbGluazogbGluayxcclxuICAgICAgICByZXN0cmljdDogXCJDXCJcclxuICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIGxpbmsoIHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGVzIClcclxuICAgIHtcclxuICAgICAgICAvLyBEdWUgdG8gdGhlIHdheSBBbmd1bGFySlMgcHJldmVudHMgYW5pbWF0aW9uIGR1cmluZyB0aGUgYm9vdHN0cmFwXHJcbiAgICAgICAgLy8gb2YgdGhlIGFwcGxpY2F0aW9uLCB3ZSBjYW4ndCBhbmltYXRlIHRoZSB0b3AtbGV2ZWwgY29udGFpbmVyOyBidXQsXHJcbiAgICAgICAgLy8gc2luY2Ugd2UgYWRkZWQgXCJuZ0FuaW1hdGVDaGlsZHJlblwiLCB3ZSBjYW4gYW5pbWF0ZWQgdGhlIGlubmVyXHJcbiAgICAgICAgLy8gY29udGFpbmVyIGR1cmluZyB0aGlzIHBoYXNlLlxyXG4gICAgICAgIC8vIC0tXHJcbiAgICAgICAgLy8gTk9URTogQW0gdXNpbmcgLmVxKDEpIHNvIHRoYXQgd2UgZG9uJ3QgYW5pbWF0ZSB0aGUgU3R5bGUgYmxvY2suXHJcbiAgICAgICAgJGFuaW1hdGUubGVhdmUoIGVsZW1lbnQuY2hpbGRyZW4oKS5lcSggMSApICkudGhlbihcclxuICAgICAgICAgICAgZnVuY3Rpb24gY2xlYW51cEFmdGVyQW5pbWF0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSByb290IGRpcmVjdGl2ZSBlbGVtZW50LlxyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDbGVhciB0aGUgY2xvc2VkLW92ZXIgdmFyaWFibGUgcmVmZXJlbmNlcy5cclxuICAgICAgICAgICAgICAgIHNjb3BlID0gZWxlbWVudCA9IGF0dHJpYnV0ZXMgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbn0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGJ5b3VuZyBvbiAzLzE4LzIwMTYuXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdmb2N1c09uJywgZnVuY3Rpb24gKClcclxue1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbGVtLCBhdHRyKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGF0dHIuZm9jdXNPbik7XHJcblxyXG4gICAgICAgIHNjb3BlLiRvbignZm9jdXNPbicsIGZ1bmN0aW9uKGUsIG5hbWUpXHJcbiAgICAgICAge1xyXG5cclxuY29uc29sZS5sb2coJ25hbWUgaXMnICsgbmFtZSk7XHJcbiAgICAgICAgICAgIGlmKG5hbWUgPT09IGF0dHIuZm9jdXNPbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmb3VuZCBlbGVtXCIpO1xyXG4gICAgICAgICAgICAgICAgZWxlbVswXS5mb2N1cygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKVxyXG4gICAgLmRpcmVjdGl2ZSgndXRjUGFyc2VyJywgZnVuY3Rpb24gKClcclxuICAgIHtcclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbmdNb2RlbCkge1xyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkluIHV0Y1BhcnNlciBkaXJlY3RpdmVcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgcGFyc2VyID0gZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICAgICAgdmFsID0gbW9tZW50LnV0Yyh2YWwpLmZvcm1hdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtYXR0ZXIgPSBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YWwgPSBuZXcgRGF0ZSh2YWwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIG5nTW9kZWwuJHBhcnNlcnMudW5zaGlmdChwYXJzZXIpO1xyXG4gICAgICAgICAgICBuZ01vZGVsLiRmb3JtYXR0ZXJzLnVuc2hpZnQoZm9ybWF0dGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJ1xyXG4gICAgICAgIH07XHJcbiAgICB9KTsiLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLmZpbHRlcnNcIikuZmlsdGVyKCd0cnVuY2F0ZU5hbWUnLCBmdW5jdGlvbigpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBtYXhMZW5ndGgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnB1dCA9IGlucHV0IHx8IFwiXCI7XHJcbiAgICAgICAgICAgIHZhciBvdXQgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgaWYoaW5wdXQubGVuZ3RoID4gbWF4TGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBvdXQgPSBpbnB1dC5zdWJzdHIoMCwgbWF4TGVuZ3RoKSArIFwiLi4uXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBvdXQgPSBpbnB1dDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG91dDtcclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBieW91bmcgb24gMy8xNC8yMDE2LlxyXG4gKi9cclxuKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdBdXRoU2VydmljZScsIFsnJGF1dGgnLCAnJHN0YXRlJywgZnVuY3Rpb24oJGF1dGgsICRzdGF0ZSkge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICAgICAgbG9naW46IGZ1bmN0aW9uKGVtYWlsLCBwYXNzd29yZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNyZWRlbnRpYWxzID0geyBlbWFpbDogZW1haWwsIHBhc3N3b3JkOiBwYXNzd29yZCB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coY3JlZGVudGlhbHMpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFVzZSBTYXRlbGxpemVyJ3MgJGF1dGggc2VydmljZSB0byBsb2dpbiBiZWNhdXNlIGl0J2xsIGF1dG9tYXRpY2FsbHkgc2F2ZSB0aGUgSldUIGluIGxvY2FsU3RvcmFnZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRhdXRoLmxvZ2luKGNyZWRlbnRpYWxzKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGlzQXV0aGVudGljYXRlZDogZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGF1dGguaXNBdXRoZW50aWNhdGVkKCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBsb2dvdXQ6IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgJGF1dGgubG9nb3V0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1dKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgQnJlZW4gb24gMTUvMDIvMjAxNi5cclxuICovXHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0NoYXJ0U2VydmljZScsIFsnJGF1dGgnLCAnUmVzdGFuZ3VsYXInLCAnJG1vbWVudCcsIGZ1bmN0aW9uKCRhdXRoLCBSZXN0YW5ndWxhciwgJG1vbWVudCl7XHJcblxyXG4gICAgICAgIHZhciBwaWVDb25maWcgPSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIGNoYXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3BpZSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBwbG90T3B0aW9uczpcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBwaWU6XHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxvd1BvaW50U2VsZWN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUxhYmVsczpcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93SW5MZWdlbmQ6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0aXRsZTpcclxuICAgICAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbG9hZGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgc2l6ZTpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDQwMCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogMjUwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgICAgIGdldE1vbnRobHlTYWxlc1JlcG9ydDogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgICAgICBzY29wZS5jaGFydENvbmZpZyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29sdW1uJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5QXhpczpcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJyMgb2Ygc2FsZXMnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhBeGlzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZGF0ZXRpbWUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZVRpbWVMYWJlbEZvcm1hdHM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9udGg6ICclYicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeWVhcjogJyViJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdEYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1NhbGVzIHBlciBtb250aCdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgncmVwb3J0cy9nZXRNb250aGx5U2FsZXNSZXBvcnQnKS5wb3N0KHsgJ3JlcG9ydFBhcmFtcyc6IHt9fSkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhU2V0ID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb25lRGF0YVBvaW50ID0gZGF0YVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhvbmVEYXRhUG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhU2V0LnB1c2goW0RhdGUuVVRDKHBhcnNlSW50KG9uZURhdGFQb2ludC55ZWFyKSwgcGFyc2VJbnQob25lRGF0YVBvaW50Lm1vbnRoKSAtIDEpLCBwYXJzZUludChvbmVEYXRhUG9pbnQucG9jb3VudCldKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmNoYXJ0Q29uZmlnLnNlcmllcyA9IFt7bmFtZTogJ1NhbGVzIHRoaXMgbW9udGgnLCBkYXRhOiBkYXRhU2V0IH1dO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jaGFydENvbmZpZy5sb2FkaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRNb250aGx5SW5jb21lUmVwb3J0OiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgICAgIHNjb3BlLmNoYXJ0Q29uZmlnID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjb2x1bW4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHlBeGlzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnJCBhbW91bnQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhBeGlzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZGF0ZXRpbWUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZVRpbWVMYWJlbEZvcm1hdHM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9udGg6ICclYicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeWVhcjogJyViJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdEYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ0luY29tZSBwZXIgbW9udGgnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3JlcG9ydHMvZ2V0TW9udGhseVNhbGVzUmVwb3J0JykucG9zdCh7ICdyZXBvcnRQYXJhbXMnOiB7fX0pLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhU2V0ID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb25lRGF0YVBvaW50ID0gZGF0YVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cob25lRGF0YVBvaW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFTZXQucHVzaChbRGF0ZS5VVEMocGFyc2VJbnQob25lRGF0YVBvaW50LnllYXIpLCBwYXJzZUludChvbmVEYXRhUG9pbnQubW9udGgpIC0gMSksIHBhcnNlRmxvYXQob25lRGF0YVBvaW50Lm1vbnRodG90YWwpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmNoYXJ0Q29uZmlnLnNlcmllcyA9IFt7bmFtZTogJ0luY29tZSB0aGlzIG1vbnRoJywgZGF0YTogZGF0YVNldCB9XTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmNoYXJ0Q29uZmlnLmxvYWRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0VG9wU2VsbGluZ1Byb2R1Y3RzOiBmdW5jdGlvbihzY29wZSwgY2hhcnRUaXRsZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhcnRUaXRsZSk7XHJcbiAgICAgICAgICAgICAgICBzY29wZS50b3BTZWxsaW5nQ2hhcnRDb25maWcgPSB7fTtcclxuICAgICAgICAgICAgICAgIHNjb3BlLnRvcFNlbGxpbmdDaGFydENvbmZpZyA9IGpRdWVyeS5leHRlbmQodHJ1ZSwge30sIHBpZUNvbmZpZyk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncmVwb3J0cy9nZXRUb3BTZWxsaW5nUHJvZHVjdHMnKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFTZXQgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvbmVEYXRhUG9pbnQgPSBkYXRhW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKG9uZURhdGFQb2ludCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFTZXQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBvbmVEYXRhUG9pbnQubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkOiAoaSA9PT0gMCkgPyB0cnVlIDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGljZWQ6IChpID09PSAwKSA/IHRydWUgOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IHBhcnNlSW50KG9uZURhdGFQb2ludC5wY291bnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUudG9wU2VsbGluZ0NoYXJ0Q29uZmlnLnNlcmllcyA9IFt7bmFtZTogJ1NvbGQnLCBkYXRhOiBkYXRhU2V0IH1dO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnRvcFNlbGxpbmdDaGFydENvbmZpZy50aXRsZS50ZXh0ID0gY2hhcnRUaXRsZTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS50b3BTZWxsaW5nQ2hhcnRDb25maWcubG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRXJyb3JcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0UHJvZHVjdFByb2ZpdFBlcmNlbnRzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUucHJvZHVjdFByb2ZpdFBlcmNlbnRDaGFydENvbmZpZyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29sdW1uJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhBeGlzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY2F0ZWdvcnknXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHlBeGlzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdQcm9maXQgJSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdQcm9kdWN0IFByb2ZpdCAlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmc6IHRydWVcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncmVwb3J0cy9nZXRQcm9kdWN0UHJvZml0UGVyY2VudHMnKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YVNldCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9uZURhdGFQb2ludCA9IGRhdGFbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYob25lRGF0YVBvaW50LmNvc3QgPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9maXQgPSBvbmVEYXRhUG9pbnQucHJpY2UgLSBvbmVEYXRhUG9pbnQuY29zdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvZml0UGVyY2VudCA9IChwcm9maXQgLyBvbmVEYXRhUG9pbnQuY29zdCAqIDEwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ1ByaWNlOicgKyBvbmVEYXRhUG9pbnQucHJpY2UgKyAnIENvc3Q6JyArIG9uZURhdGFQb2ludC5jb3N0ICsgJyBQcm9maXQ6JyArIE1hdGgucm91bmQocHJvZml0UGVyY2VudCAqIDEwMCkgLyAxMDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ1ByaWNlOicgKyBvbmVEYXRhUG9pbnQucHJpY2UgKyAnIENvc3Q6JyArIG9uZURhdGFQb2ludC5jb3N0ICsgJyBQcm9maXQ6JyArIHByb2ZpdFBlcmNlbnQudG9GaXhlZCgwKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFTZXQucHVzaChbb25lRGF0YVBvaW50Lm5hbWUsIHBhcnNlSW50KHByb2ZpdFBlcmNlbnQudG9GaXhlZCgwKSldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVNldC5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludChiWzFdKSAtIHBhcnNlSW50KGFbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGFTZXQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvZHVjdFByb2ZpdFBlcmNlbnRDaGFydENvbmZpZy5zZXJpZXMgPSBbe25hbWU6ICdQcm9maXQgJScsIGRhdGE6IGRhdGFTZXQgfV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnByb2R1Y3RQcm9maXRQZXJjZW50Q2hhcnRDb25maWcubG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfTtcclxuICAgIH1dKTtcclxufSkoKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBCcmVlbiBvbiAxNS8wMi8yMDE2LlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnRGlhbG9nU2VydmljZScsIGZ1bmN0aW9uKCAkbWREaWFsb2cgKXtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgICAgIGZyb21DdXN0b206IGZ1bmN0aW9uKG9wdGlvbnMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkbWREaWFsb2cuc2hvdyhvcHRpb25zKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGZyb21UZW1wbGF0ZTogZnVuY3Rpb24oZXYsIHRlbXBsYXRlLCBzY29wZSApIHtcclxuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpYWxvZ3MvJyArIHRlbXBsYXRlICsgJy5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBlc2NhcGVUb0Nsb3NlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiBEaWFsb2dDb250cm9sbGVyKCRzY29wZSwgJG1kRGlhbG9nKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbmZpcm1EaWFsb2cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNhbmNlbERpYWxvZyA9IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmNhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoZXYgIT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy50YXJnZXRFdmVudCA9IGV2O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggc2NvcGUgKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2NvcGUgPSBzY29wZS4kbmV3KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9vcHRpb25zLnByZXNlcnZlU2NvcGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiAkbWREaWFsb2cuc2hvdyhvcHRpb25zKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGhpZGU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJG1kRGlhbG9nLmhpZGUoKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFsZXJ0OiBmdW5jdGlvbih0aXRsZSwgY29udGVudCl7XHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuc2hvdyhcclxuICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuYWxlcnQoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGl0bGUodGl0bGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jb250ZW50KGNvbnRlbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vaygnT2snKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGNvbmZpcm06IGZ1bmN0aW9uKGV2ZW50LCB0aXRsZSwgY29udGVudClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbmZpcm0gPSAkbWREaWFsb2cuY29uZmlybSgpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRpdGxlKHRpdGxlKVxyXG4gICAgICAgICAgICAgICAgICAgIC50ZXh0Q29udGVudChjb250ZW50KVxyXG4gICAgICAgICAgICAgICAgICAgIC5hcmlhTGFiZWwoJycpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRhcmdldEV2ZW50KGV2ZW50KVxyXG4gICAgICAgICAgICAgICAgICAgIC5vaygnWWVzJylcclxuICAgICAgICAgICAgICAgICAgICAuY2FuY2VsKCdObycpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiAkbWREaWFsb2cuc2hvdyhjb25maXJtKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbn0pKCk7IiwiXHJcbihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnRm9jdXNTZXJ2aWNlJywgWyckcm9vdFNjb3BlJywgJyR0aW1lb3V0JywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHRpbWVvdXQpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG5hbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdmb2N1c09uJywgbmFtZSk7XHJcbiAgICAgICAgICAgIH0sMTAwKTtcclxuICAgICAgICB9O1xyXG4gICAgfV0pO1xyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGJ5b3VuZyBvbiAzLzE0LzIwMTYuXHJcbiAqL1xyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0d1aWRTZXJ2aWNlJywgW2Z1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBzNCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMClcclxuICAgICAgICAgICAgICAgIC50b1N0cmluZygxNilcclxuICAgICAgICAgICAgICAgIC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICAgICAgbmV3R3VpZDogZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gczQoKSArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArXHJcbiAgICAgICAgICAgICAgICAgICAgczQoKSArICctJyArIHM0KCkgKyBzNCgpICsgczQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfV0pO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBCcmVlbiBvbiAxNS8wMi8yMDE2LlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnUmVzdFNlcnZpY2UnLCBbJyRhdXRoJywgJ1Jlc3Rhbmd1bGFyJywgJyRtb21lbnQnLCBmdW5jdGlvbigkYXV0aCwgUmVzdGFuZ3VsYXIsICRtb21lbnQpe1xyXG5cclxuICAgICAgICB2YXIgYmFzZVByb2R1Y3RzID0gUmVzdGFuZ3VsYXIuYWxsKCdwcm9kdWN0Jyk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcblxyXG4gICAgICAgICAgICBnZXRBbGxQcm9kdWN0czogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGJhc2VQcm9kdWN0cy5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvZHVjdHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRQcm9kdWN0OiBmdW5jdGlvbihzY29wZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncHJvZHVjdCcsIGlkKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBIYWNrIGZvciBPTEQgbXlzcWwgZHJpdmVycyBvbiBIb3N0Z2F0b3Igd2hpY2ggZG9uJ3QgcHJvcGVybHkgZW5jb2RlIGludGVnZXIgYW5kIHJldHVybiB0aGVtIGFzIHN0cmluZ3NcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLmlzX2N1c3RvbSA9IHBhcnNlSW50KGRhdGEuaXNfY3VzdG9tKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5wcm9kdWN0ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsQ3VzdG9tZXJzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdjdXN0b21lcicpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXN0b21lcnMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRDdXN0b21lcjogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ2N1c3RvbWVyJywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmN1c3RvbWVyID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsV29ya09yZGVyczogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnd29ya29yZGVyJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLndvcmtvcmRlcnMgPSBkYXRhO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0V29ya09yZGVyOiBmdW5jdGlvbihzY29wZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnd29ya29yZGVyJywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBGb3JtYXQgc3RyaW5nIGRhdGVzIGludG8gZGF0ZSBvYmplY3RzXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5zdGFydF9kYXRlID0gJG1vbWVudChkYXRhLnN0YXJ0X2RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuZW5kX2RhdGUgPSAkbW9tZW50KGRhdGEuZW5kX2RhdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBIYWNrIGZvciBPTEQgbXlzcWwgZHJpdmVycyBvbiBIb3N0Z2F0b3Igd2hpY2ggZG9uJ3QgcHJvcGVybHkgZW5jb2RlIGludGVnZXIgYW5kIHJldHVybiB0aGVtIGFzIHN0cmluZ3NcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLmNvbXBsZXRlZCA9IHBhcnNlSW50KGRhdGEuY29tcGxldGVkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi53b3Jrb3JkZXIgPSBkYXRhO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUud29ya29yZGVyID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsRXZlbnRzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdldmVudCcpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5ldmVudHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRFdmVudDogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ2V2ZW50JywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmV2ZW50ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsVW5pdHM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3VuaXQnKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUudW5pdHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRVbml0OiBmdW5jdGlvbihzY29wZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgndW5pdCcsIGlkKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS51bml0ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsTWF0ZXJpYWxzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdtYXRlcmlhbCcpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5tYXRlcmlhbHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRNYXRlcmlhbDogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ21hdGVyaWFsJywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLm1hdGVyaWFsID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZG9TZWFyY2g6IGZ1bmN0aW9uKHNjb3BlLCBxdWVyeSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDYWxsIFdTIHdpdGg6IFwiICsgcXVlcnkpO1xyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnc2VhcmNoJywgcXVlcnkpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsUHVyY2hhc2VPcmRlcnM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3B1cmNoYXNlb3JkZXInKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucHVyY2hhc2VvcmRlcnMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRQdXJjaGFzZU9yZGVyOiBmdW5jdGlvbihzY29wZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncHVyY2hhc2VvcmRlcicsIGlkKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRm9ybWF0IHN0cmluZyBkYXRlcyBpbnRvIGRhdGUgb2JqZWN0c1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEucGlja3VwX2RhdGUgPSAkbW9tZW50KGRhdGEucGlja3VwX2RhdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBIYWNrIGZvciBPTEQgbXlzcWwgZHJpdmVycyBvbiBIb3N0Z2F0b3Igd2hpY2ggZG9uJ3QgcHJvcGVybHkgZW5jb2RlIGludGVnZXIgYW5kIHJldHVybiB0aGVtIGFzIHN0cmluZ3NcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLmZ1bGZpbGxlZCA9IHBhcnNlSW50KGRhdGEuZnVsZmlsbGVkKTtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLnBhaWQgPSBwYXJzZUludChkYXRhLnBhaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5wdXJjaGFzZW9yZGVyID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsUGF5bWVudFR5cGVzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdwYXltZW50dHlwZScpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5wYXltZW50dHlwZXMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRQYXltZW50VHlwZTogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3BheW1lbnR0eXBlJywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnBheW1lbnR0eXBlID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0TWF0ZXJpYWxBbGxUeXBlczogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnbWF0ZXJpYWx0eXBlJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLm1hdGVyaWFsdHlwZXMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRGdWxseUJvb2tlZERheXM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3NjaGVkdWxlci9nZXRGdWxseUJvb2tlZERheXMnKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmJvb2tlZERheXMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZEN1c3RvbWVyOiBmdW5jdGlvbihvYmopXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5hbGwoJ2N1c3RvbWVyJykucG9zdChvYmopO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkUHJvZHVjdDogZnVuY3Rpb24ob2JqKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIuYWxsKCdwcm9kdWN0JykucG9zdChvYmopO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH07XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgQnJlZW4gb24gMTUvMDIvMjAxNi5cclxuICovXHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ1RvYXN0U2VydmljZScsIGZ1bmN0aW9uKCAkbWRUb2FzdCApe1xyXG5cclxuICAgICAgICB2YXIgZGVsYXkgPSA2MDAwLFxyXG4gICAgICAgICAgICBwb3NpdGlvbiA9ICd0b3AgcmlnaHQnLFxyXG4gICAgICAgICAgICBhY3Rpb24gPSAnT0snO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzaG93OiBmdW5jdGlvbihjb250ZW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJG1kVG9hc3Quc2hvdyhcclxuICAgICAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaW1wbGUoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY29udGVudChjb250ZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucG9zaXRpb24ocG9zaXRpb24pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hY3Rpb24oYWN0aW9uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuaGlkZURlbGF5KGRlbGF5KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ1VwbG9hZFNlcnZpY2UnLCBbJ1VwbG9hZCcsIGZ1bmN0aW9uKFVwbG9hZCkge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICAgICAgdXBsb2FkRmlsZTogZnVuY3Rpb24gKGZpbGVuYW1lLCBmaWxlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YU9iaiA9IHtmaWxlOiBmaWxlIH07XHJcbiAgICAgICAgICAgICAgICBpZihmaWxlbmFtZSAhPT0gJycpIHsgZGF0YU9iai5maWxlbmFtZSA9IGZpbGVuYW1lOyB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFVwbG9hZC51cGxvYWQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2FwaS91cGxvYWRlci91cGxvYWRGaWxlJyxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhT2JqXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGRlbGV0ZUZpbGU6IGZ1bmN0aW9uKGZpbGVuYW1lKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YU9iaiA9IHtmaWxlbmFtZTogZmlsZW5hbWUgfTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVXBsb2FkLnVwbG9hZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnYXBpL3VwbG9hZGVyL2RlbGV0ZUZpbGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFPYmpcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1dKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgYnlvdW5nIG9uIDMvMTQvMjAxNi5cclxuICovXHJcbihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnVmFsaWRhdGlvblNlcnZpY2UnLCBbZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcblxyXG4gICAgICAgICAgICBkZWNpbWFsUmVnZXg6IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICdeXFxcXGQqXFxcXC4/XFxcXGQqJCc7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBudW1lcmljUmVnZXg6IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICdeXFxcXGQqJCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1dKTtcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBCb29rZWREYXRlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQm9va2VkRGF0ZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsIEJvb2tlZERhdGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gQ29yZUNvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGUsICRtb21lbnQsICRtZFNpZGVuYXYsICRtZE1lZGlhLCBBdXRoU2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciB0b2RheSA9IG5ldyBEYXRlKCk7XHJcblxyXG4gICAgICAgICRzY29wZS50b2RheXNEYXRlID0gdG9kYXk7XHJcbiAgICAgICAgJHNjb3BlLnNob3dTZWFyY2ggPSBmYWxzZTtcclxuXHJcbiAgICAgICAgJHNjb3BlLnRvZ2dsZVNpZGVuYXYgPSBmdW5jdGlvbihtZW51SWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAkbWRTaWRlbmF2KG1lbnVJZCkudG9nZ2xlKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLnNob3dTaWRlTmF2ID0gZnVuY3Rpb24obWVudUlkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoISRtZFNpZGVuYXYobWVudUlkKS5pc0xvY2tlZE9wZW4oKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgJG1kU2lkZW5hdihtZW51SWQpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5oaWRlU2lkZU5hdiA9IGZ1bmN0aW9uKG1lbnVJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKCEkbWRTaWRlbmF2KG1lbnVJZCkuaXNMb2NrZWRPcGVuKCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICRtZFNpZGVuYXYobWVudUlkKS5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLnRvZ2dsZVNlYXJjaCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICRzY29wZS5zaG93U2VhcmNoID0gISRzY29wZS5zaG93U2VhcmNoO1xyXG4gICAgICAgICAgICAvL2lmKCRzY29wZS5zaG93U2VhcmNoKSB7IGNvbnNvbGUubG9nKGFuZ3VsYXIuZWxlbWVudCgnI3N1cGVyU2VhcmNoJykpOyB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gTGlzdGVuIGZvciB0b2dnbGVTZWFyY2ggZXZlbnRzXHJcbiAgICAgICAgJHNjb3BlLiRvbihcInRvZ2dsZVNlYXJjaFwiLCBmdW5jdGlvbiAoZXZlbnQsIGFyZ3MpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAkc2NvcGUudG9nZ2xlU2VhcmNoKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRzY29wZS5kZXRlcm1pbmVGYWJWaXNpYmlsaXR5ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoJHN0YXRlLmlzKFwiYXBwLnByb2R1Y3RzXCIpIHx8ICRzdGF0ZS5pcyhcImFwcC5jdXN0b21lcnNcIilcclxuICAgICAgICAgICAgICAgIHx8ICRzdGF0ZS5pcyhcImFwcC5wdXJjaGFzZW9yZGVyc1wiKSB8fCAkc3RhdGUuaXMoXCJhcHAucGF5bWVudHR5cGVzXCIpXHJcbiAgICAgICAgICAgICAgICB8fCAkc3RhdGUuaXMoXCJhcHAud29ya29yZGVyc1wiKSB8fCAkc3RhdGUuaXMoXCJhcHAuZXZlbnRzXCIpXHJcbiAgICAgICAgICAgICAgICB8fCAkc3RhdGUuaXMoXCJhcHAudW5pdHNcIikgfHwgJHN0YXRlLmlzKFwiYXBwLm1hdGVyaWFsc1wiKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuYWRkRmFiTmF2aWdhdGUgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc3RhdGUuJGN1cnJlbnQubmFtZSk7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSBcIlwiO1xyXG4gICAgICAgICAgICBzd2l0Y2goJHN0YXRlLiRjdXJyZW50Lm5hbWUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJhcHAucHJvZHVjdHNcIjpcclxuICAgICAgICAgICAgICAgICAgICB1cmwgPSBcImFwcC5wcm9kdWN0cy5jcmVhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJhcHAuY3VzdG9tZXJzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gXCJhcHAuY3VzdG9tZXJzLmNyZWF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImFwcC5wdXJjaGFzZW9yZGVyc1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IFwiYXBwLnB1cmNoYXNlb3JkZXJzLmNyZWF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImFwcC5wYXltZW50dHlwZXNcIjpcclxuICAgICAgICAgICAgICAgICAgICB1cmwgPSBcImFwcC5wYXltZW50dHlwZXMuY3JlYXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiYXBwLndvcmtvcmRlcnNcIjpcclxuICAgICAgICAgICAgICAgICAgICB1cmwgPSBcImFwcC53b3Jrb3JkZXJzLmNyZWF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImFwcC5ldmVudHNcIjpcclxuICAgICAgICAgICAgICAgICAgICB1cmwgPSBcImFwcC5ldmVudHMuY3JlYXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiYXBwLnVuaXRzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gXCJhcHAudW5pdHMuY3JlYXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiYXBwLm1hdGVyaWFsc1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IFwiYXBwLm1hdGVyaWFscy5jcmVhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHN0YXRlLmdvKHVybCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmlzQXV0aGVudGljYXRlZCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQXV0aFNlcnZpY2UubG9nb3V0KCk7XHJcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmxvZ2luJyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvcmVDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJHN0YXRlJywgJyRtb21lbnQnLCAnJG1kU2lkZW5hdicsICckbWRNZWRpYScsICdBdXRoU2VydmljZScsIENvcmVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEN1c3RvbWVyQ3JlYXRlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBUb2FzdFNlcnZpY2UsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5jcmVhdGVDdXN0b21lciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi5jdXN0b21lcik7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGMgPSBzZWxmLmN1c3RvbWVyO1xyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnY3VzdG9tZXInKS5wb3N0KGMpLnRoZW4oZnVuY3Rpb24oZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyRzdGF0ZS5nbygnYXBwLmN1c3RvbWVycy5kZXRhaWwnLCB7J2N1c3RvbWVySWQnOiBkLm5ld0lkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5jdXN0b21lcnMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBjcmVhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0N1c3RvbWVyQ3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCBDdXN0b21lckNyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gQ3VzdG9tZXJEZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0Q3VzdG9tZXIoc2VsZiwgJHN0YXRlUGFyYW1zLmN1c3RvbWVySWQpO1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZUN1c3RvbWVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jdXN0b21lci5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5jdXN0b21lcnNcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVDdXN0b21lciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuY3VzdG9tZXIucmVtb3ZlKCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGRlbGV0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAuY3VzdG9tZXJzXCIpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgRGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zaG93RGVsZXRlQ29uZmlybSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZyA9IERpYWxvZ1NlcnZpY2UuY29uZmlybShldiwgJ0RlbGV0ZSBjdXN0b21lcj8nLCAnVGhpcyB3aWxsIGFsc28gZGVsZXRlIGFueSB3b3JrIG9yZGVycyBhc3NvY2lhdGVkIHdpdGggdGhpcyBjdXN0b21lcicpO1xyXG4gICAgICAgICAgICBkaWFsb2cudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5kZWxldGVDdXN0b21lcigpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDdXN0b21lckRldGFpbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdUb2FzdFNlcnZpY2UnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsICckc3RhdGVQYXJhbXMnLCBDdXN0b21lckRldGFpbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gQ3VzdG9tZXJDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbEN1c3RvbWVycyhzZWxmKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0N1c3RvbWVyQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgQ3VzdG9tZXJDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEV2ZW50Q3JlYXRlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYuZXZlbnQgPSB7fTtcclxuXHJcbiAgICAgICAgc2VsZi5jcmVhdGVFdmVudCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi5ldmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGUgPSBzZWxmLmV2ZW50O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJGVycm9yKTtcclxuXHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ2V2ZW50JykucG9zdChlKS50aGVuKGZ1bmN0aW9uKGUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ldmVudHMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFdmVudENyZWF0ZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCBFdmVudENyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gRXZlbnREZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgJHN0YXRlUGFyYW1zLCBUb2FzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLnNlbGVjdGVkUHJvZHVjdCA9IFwiXCI7XHJcbiAgICAgICAgc2VsZi5zZWxlY3RlZFF1YW50aXR5ID0gMDtcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEV2ZW50KHNlbGYsICRzdGF0ZVBhcmFtcy5ldmVudElkKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVFdmVudCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vUmVzdFNlcnZpY2UudXBkYXRlUHJvZHVjdChzZWxmLCBzZWxmLnByb2R1Y3QuaWQpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5ldmVudC5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwidXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5ldmVudHNcIik7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFkZFByb2R1Y3QgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnNlbGVjdGVkUHJvZHVjdCk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLmV2ZW50LmV2ZW50X3Byb2R1Y3RzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgZXZlbnRfaWQ6IHNlbGYuZXZlbnQuaWQsXHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBzZWxmLnNlbGVjdGVkUHJvZHVjdC5pZCxcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiBzZWxmLnNlbGVjdGVkUXVhbnRpdHksXHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0OiBzZWxmLnNlbGVjdGVkUHJvZHVjdFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRQcm9kdWN0ID0gXCJcIjtcclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFF1YW50aXR5ID0gMDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVByb2R1Y3QgPSBmdW5jdGlvbihlLCBwcm9kdWN0SWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXhUb1JlbW92ZTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYuZXZlbnQuZXZlbnRfcHJvZHVjdHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHByb2R1Y3RJZCA9PSBzZWxmLmV2ZW50LmV2ZW50X3Byb2R1Y3RzW2ldLnByb2R1Y3RfaWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhUb1JlbW92ZSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGluZGV4VG9SZW1vdmUpO1xyXG4gICAgICAgICAgICBzZWxmLmV2ZW50LmV2ZW50X3Byb2R1Y3RzLnNwbGljZShpbmRleFRvUmVtb3ZlLCAxKTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZUV2ZW50ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5ldmVudC5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGVlbHRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5ldmVudHNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBEZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNob3dEZWxldGVDb25maXJtID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGV2LCAnRGVsZXRlIGV2ZW50PycsICcnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlRXZlbnQoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRXZlbnREZXRhaWxDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgJ1RvYXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgRXZlbnREZXRhaWxDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEV2ZW50Q29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxFdmVudHMoc2VsZik7XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0V2ZW50Q29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgRXZlbnRDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEZvb3RlckNvbnRyb2xsZXIoJG1vbWVudClcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5jdXJyZW50WWVhciA9ICRtb21lbnQoKS5mb3JtYXQoJ1lZWVknKTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRm9vdGVyQ29udHJvbGxlcicsIFsnJG1vbWVudCcsIEZvb3RlckNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gSGVhZGVyQ29udHJvbGxlcigkYXV0aCwgJG1vbWVudClcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYudG9kYXlzRGF0ZSA9ICRtb21lbnQoKS5mb3JtYXQoJ2RkZGQsIE1NTU0gRG8gWVlZWScpO1xyXG5cclxuICAgICAgICBzZWxmLmlzQXV0aGVudGljYXRlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGF1dGguaXNBdXRoZW50aWNhdGVkKCk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSGVhZGVyQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJG1vbWVudCcsIEhlYWRlckNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBMYW5kaW5nQ29udHJvbGxlcigkc3RhdGUpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMYW5kaW5nQ29udHJvbGxlcicsIFsnJHN0YXRlJywgTGFuZGluZ0NvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBMb2dpbkNvbnRyb2xsZXIoJHN0YXRlLCAkc2NvcGUsICRjb29raWVzLCBEaWFsb2dTZXJ2aWNlLCBBdXRoU2VydmljZSwgRm9jdXNTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmVtYWlsID0gJyc7XHJcbiAgICAgICAgc2VsZi5wYXNzd29yZCA9ICcnO1xyXG5cclxuICAgICAgICBpZigkY29va2llcy5nZXQoJ2xvZ2luTmFtZScpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5lbWFpbCA9ICRjb29raWVzLmdldCgnbG9naW5OYW1lJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZGlhbG9nT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvZGlhbG9ncy9kbGdMb2dpbi5odG1sJyxcclxuICAgICAgICAgICAgZXNjYXBlVG9DbG9zZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uIERpYWxvZ0NvbnRyb2xsZXIoJHNjb3BlLCAkbWREaWFsb2cpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jb25maXJtRGlhbG9nID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYuZW1haWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNlbGYuZW1haWwgIT09ICcnICYmIHNlbGYucGFzc3dvcmQgIT09ICcnKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQXV0aFNlcnZpY2UubG9naW4oc2VsZi5lbWFpbCwgc2VsZi5wYXNzd29yZCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdMb2dpbiBzdWNjZXNzJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRvZGF5ID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFyIGNvb2tpZUV4cGlyeSA9IG5ldyBEYXRlKHRvZGF5LmdldFllYXIoKSArIDEsIHRvZGF5LmdldE1vbnRoKCksIHRvZGF5LmdldERheSgpLCAwLCAwLCAwLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb29raWVFeHBpcnkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29va2llRXhwaXJ5LnNldEZ1bGxZZWFyKGNvb2tpZUV4cGlyeS5nZXRGdWxsWWVhcigpICsgMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGNvb2tpZXMucHV0KCdsb2dpbk5hbWUnLCBzZWxmLmVtYWlsLCB7IGV4cGlyZXM6IGNvb2tpZUV4cGlyeSB9KTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLnByb2R1Y3RzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0Vycm9yIGxvZ2dpbmcgaW4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2NvcGU6ICRzY29wZS4kbmV3KClcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21DdXN0b20oZGlhbG9nT3B0aW9ucyk7XHJcblxyXG4gICAgICAgIEZvY3VzU2VydmljZSgnZm9jdXNNZScpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTG9naW5Db250cm9sbGVyJywgWyckc3RhdGUnLCAnJHNjb3BlJywgJyRjb29raWVzJywgJ0RpYWxvZ1NlcnZpY2UnLCAnQXV0aFNlcnZpY2UnLCAnRm9jdXNTZXJ2aWNlJywgTG9naW5Db250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIE1hdGVyaWFsQ3JlYXRlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBUb2FzdFNlcnZpY2UsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgVmFsaWRhdGlvblNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFVuaXRzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldE1hdGVyaWFsQWxsVHlwZXMoc2VsZik7XHJcblxyXG4gICAgICAgIHNlbGYuZGVjaW1hbFJlZ2V4ID0gVmFsaWRhdGlvblNlcnZpY2UuZGVjaW1hbFJlZ2V4KCk7XHJcblxyXG4gICAgICAgIHNlbGYuY3JlYXRlTWF0ZXJpYWwgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaXNWYWxpZCk7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYubWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBtID0gc2VsZi5tYXRlcmlhbDtcclxuXHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ21hdGVyaWFsJykucG9zdChtKS50aGVuKGZ1bmN0aW9uKGQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8kc3RhdGUuZ28oJ2FwcC5jdXN0b21lcnMuZGV0YWlsJywgeydjdXN0b21lcklkJzogZC5uZXdJZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAubWF0ZXJpYWxzJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgY3JlYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTWF0ZXJpYWxDcmVhdGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJ1ZhbGlkYXRpb25TZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIE1hdGVyaWFsQ3JlYXRlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBNYXRlcmlhbERldGFpbENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgVG9hc3RTZXJ2aWNlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UsIFZhbGlkYXRpb25TZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxVbml0cyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRNYXRlcmlhbEFsbFR5cGVzKHNlbGYpO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0TWF0ZXJpYWwoc2VsZiwgJHN0YXRlUGFyYW1zLm1hdGVyaWFsSWQpO1xyXG5cclxuICAgICAgICBzZWxmLmRlY2ltYWxSZWdleCA9IFZhbGlkYXRpb25TZXJ2aWNlLmRlY2ltYWxSZWdleCgpO1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZU1hdGVyaWFsID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5tYXRlcmlhbC5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5tYXRlcmlhbHNcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVNYXRlcmlhbCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYubWF0ZXJpYWwucmVtb3ZlKCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGRlbGV0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAubWF0ZXJpYWxzXCIpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgRGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2hvd0RlbGV0ZUNvbmZpcm0gPSBmdW5jdGlvbihldilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZXYsICdEZWxldGUgbWF0ZXJpYWw/JywgJ1RoaXMgd2lsbCBhbHNvIHJlbW92ZSB0aGUgbWF0ZXJpYWwgZnJvbSBhbnkgcHJvZHVjdHMgdXNpbmcgaXQnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlTWF0ZXJpYWwoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTWF0ZXJpYWxEZXRhaWxDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJ0RpYWxvZ1NlcnZpY2UnLCAnVmFsaWRhdGlvblNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgTWF0ZXJpYWxEZXRhaWxDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIE1hdGVyaWFsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxNYXRlcmlhbHMoc2VsZik7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdNYXRlcmlhbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsIE1hdGVyaWFsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBNYXRlcmlhbFNldENvbnRyb2xsZXIoJHN0YXRlLCBSZXN0U2VydmljZSwgR3VpZFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UsIG15Q29uZmlnKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLnNlbGVjdGVkTWF0ZXJpYWwgPSAnJztcclxuICAgICAgICAvL3NlbGYuc2VsZWN0ZWRRdWFudGl0eSA9IDA7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKG15Q29uZmlnLm1hdGVyaWFsU2V0c0xTS2V5KTtcclxuXHJcbiAgICAgICAgaWYobG9jYWxTdG9yYWdlLmdldEl0ZW0obXlDb25maWcubWF0ZXJpYWxTZXRzTFNLZXkpICE9PSBudWxsICYmIGxvY2FsU3RvcmFnZS5nZXRJdGVtKG15Q29uZmlnLm1hdGVyaWFsU2V0c0xTS2V5KSAhPT0gJycpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmV4aXN0aW5nU2V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obXlDb25maWcubWF0ZXJpYWxTZXRzTFNLZXkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5leGlzdGluZ1NldHMgPSBbXTtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obXlDb25maWcubWF0ZXJpYWxTZXRzTFNLZXksIEpTT04uc3RyaW5naWZ5KHNlbGYuZXhpc3RpbmdTZXRzKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0U2V0T2JqZWN0KCk7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbE1hdGVyaWFscyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi5jcmVhdGVTZXQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLnNldC5pZCA9IEd1aWRTZXJ2aWNlLm5ld0d1aWQoKTtcclxuICAgICAgICAgICAgc2VsZi5leGlzdGluZ1NldHMucHVzaChzZWxmLnNldCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc2V0KTtcclxuXHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG15Q29uZmlnLm1hdGVyaWFsU2V0c0xTS2V5LCBKU09OLnN0cmluZ2lmeShzZWxmLmV4aXN0aW5nU2V0cykpO1xyXG5cclxuICAgICAgICAgICAgaW5pdFNldE9iamVjdCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlU2V0ID0gZnVuY3Rpb24oZSwgc2V0SWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGUsICdEZWxldGUgbWF0ZXJpYWwgc2V0PycsICcnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXhUb1JlbW92ZTtcclxuICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzZWxmLmV4aXN0aW5nU2V0cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihzZXRJZCA9PSBzZWxmLmV4aXN0aW5nU2V0c1tpXS5pZClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4VG9SZW1vdmUgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi5leGlzdGluZ1NldHMuc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5leGlzdGluZ1NldHMubGVuZ3RoID09PSAwKSB7IGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKG15Q29uZmlnLm1hdGVyaWFsU2V0c0xTS2V5KTsgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG15Q29uZmlnLm1hdGVyaWFsU2V0c0xTS2V5LCBzZWxmLmV4aXN0aW5nU2V0cyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZU1hdGVyaWFsID0gZnVuY3Rpb24oZSwgbWF0ZXJpYWxJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleFRvUmVtb3ZlO1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgc2VsZi5zZXQucHJvZHVjdF9tYXRlcmlhbHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKG1hdGVyaWFsSWQgPT0gc2VsZi5zZXQucHJvZHVjdF9tYXRlcmlhbHNbaV0ubWF0ZXJpYWxfaWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhUb1JlbW92ZSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYuc2V0LnByb2R1Y3RfbWF0ZXJpYWxzLnNwbGljZShpbmRleFRvUmVtb3ZlLCAxKTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFkZE1hdGVyaWFsID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5zZWxlY3RlZE1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc2V0LnByb2R1Y3RfbWF0ZXJpYWxzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWxfaWQ6IHNlbGYuc2VsZWN0ZWRNYXRlcmlhbC5pZCxcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiBzZWxmLnNlbGVjdGVkUXVhbnRpdHksXHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbDogc2VsZi5zZWxlY3RlZE1hdGVyaWFsXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZE1hdGVyaWFsID0gJyc7XHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRRdWFudGl0eSA9IG51bGw7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdFNldE9iamVjdCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLnNldCA9IHt9O1xyXG4gICAgICAgICAgICBzZWxmLnNldC5pZCA9ICcnO1xyXG4gICAgICAgICAgICBzZWxmLnNldC5uYW1lID0gJyc7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0LnByb2R1Y3RfbWF0ZXJpYWxzID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTWF0ZXJpYWxTZXRDb250cm9sbGVyJywgWyckc3RhdGUnLCAnUmVzdFNlcnZpY2UnLCAnR3VpZFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsICdteUNvbmZpZycsIE1hdGVyaWFsU2V0Q29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBQYXltZW50VHlwZUNyZWF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgVG9hc3RTZXJ2aWNlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYuY3JlYXRlUGF5bWVudFR5cGUgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaXNWYWxpZCk7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYucGF5bWVudHR5cGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjID0gc2VsZi5wYXltZW50dHlwZTtcclxuXHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3BheW1lbnR0eXBlJykucG9zdChjKS50aGVuKGZ1bmN0aW9uKGQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5wYXltZW50dHlwZXMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBjcmVhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1BheW1lbnRUeXBlQ3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCBQYXltZW50VHlwZUNyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUGF5bWVudFR5cGVEZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0UGF5bWVudFR5cGUoc2VsZiwgJHN0YXRlUGFyYW1zLnBheW1lbnRUeXBlSWQpO1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZVBheW1lbnRUeXBlID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlzVmFsaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wYXltZW50dHlwZS5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5wYXltZW50dHlwZXNcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlUGF5bWVudFR5cGUgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLnBheW1lbnR0eXBlLnJlbW92ZSgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBkZWxldGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLnBheW1lbnR0eXBlc1wiKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIERlbGV0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2hvd0RlbGV0ZUNvbmZpcm0gPSBmdW5jdGlvbihldilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZXYsICdEZWxldGUgcGF5bWVudCB0eXBlPycsICcnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlUGF5bWVudFR5cGUoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUGF5bWVudFR5cGVEZXRhaWxDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJ0RpYWxvZ1NlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgUGF5bWVudFR5cGVEZXRhaWxDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFBheW1lbnRUeXBlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQYXltZW50VHlwZXMoc2VsZik7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQYXltZW50VHlwZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsIFBheW1lbnRUeXBlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBQcm9kdWN0Q3JlYXRlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgVG9hc3RTZXJ2aWNlLCBSZXN0U2VydmljZSwgVmFsaWRhdGlvblNlcnZpY2UsIG15Q29uZmlnLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsTWF0ZXJpYWxzKHNlbGYpO1xyXG5cclxuICAgICAgICBzZWxmLmRlY2ltYWxSZWdleCA9IFZhbGlkYXRpb25TZXJ2aWNlLmRlY2ltYWxSZWdleCgpO1xyXG4gICAgICAgIHNlbGYubnVtZXJpY1JlZ2V4ID0gVmFsaWRhdGlvblNlcnZpY2UubnVtZXJpY1JlZ2V4KCk7XHJcbiAgICAgICAgc2VsZi5jYkFkZE1hdGVyaWFsc0J5ID0gMjtcclxuXHJcbiAgICAgICAgc2VsZi5wcm9kdWN0ID0ge307XHJcbiAgICAgICAgc2VsZi5wcm9kdWN0Lm1pbmltdW1fc3RvY2sgPSAwO1xyXG4gICAgICAgIHNlbGYucHJvZHVjdC5jdXJyZW50X3N0b2NrID0gMDtcclxuXHJcbiAgICAgICAgaWYobG9jYWxTdG9yYWdlLmdldEl0ZW0obXlDb25maWcubWF0ZXJpYWxTZXRzTFNLZXkpICE9PSBudWxsICYmIGxvY2FsU3RvcmFnZS5nZXRJdGVtKG15Q29uZmlnLm1hdGVyaWFsU2V0c0xTS2V5KSAhPT0gJycpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLm1hdGVyaWFsU2V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obXlDb25maWcubWF0ZXJpYWxTZXRzTFNLZXkpKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZVByb2R1Y3QgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaXNWYWxpZCk7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnByb2R1Y3QpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBwID0gc2VsZi5wcm9kdWN0O1xyXG5cclxuICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCRlcnJvcik7XHJcblxyXG4gICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgncHJvZHVjdCcpLnBvc3QocCkudGhlbihmdW5jdGlvbihkKVxyXG4gICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vJHN0YXRlLmdvKCdhcHAucHJvZHVjdHMuZGV0YWlsJywgeydwcm9kdWN0SWQnOiBkLm5ld0lkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5wcm9kdWN0cycpO1xyXG4gICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBjcmVhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFkZE1hdGVyaWFsID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5zZWxlY3RlZE1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgICAgIGFkZE1hdGVyaWFsKHNlbGYuc2VsZWN0ZWRNYXRlcmlhbC5pZCwgc2VsZi5zZWxlY3RlZFF1YW50aXR5LCBzZWxmLnNlbGVjdGVkTWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZE1hdGVyaWFsID0gXCJcIjtcclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFF1YW50aXR5ID0gMDtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYucHJvZHVjdCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5hZGRNYXRlcmlhbFNldCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi5zZWxlY3RlZE1hdGVyaWFsU2V0KTtcclxuXHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzZWxmLnNlbGVjdGVkTWF0ZXJpYWxTZXQucHJvZHVjdF9tYXRlcmlhbHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBwbSA9IHNlbGYuc2VsZWN0ZWRNYXRlcmlhbFNldC5wcm9kdWN0X21hdGVyaWFsc1tpXTtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cocG0pO1xyXG4gICAgICAgICAgICAgICAgYWRkTWF0ZXJpYWwocG0ubWF0ZXJpYWxfaWQsIHBtLnF1YW50aXR5LCBwbS5tYXRlcmlhbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZU1hdGVyaWFsID0gZnVuY3Rpb24oZSwgbWF0ZXJpYWxJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleFRvUmVtb3ZlO1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihtYXRlcmlhbElkID09IHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFsc1tpXS5tYXRlcmlhbF9pZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleFRvUmVtb3ZlID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpbmRleFRvUmVtb3ZlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50Q29zdCA9IHBhcnNlRmxvYXQoc2VsZi5wcm9kdWN0LmNvc3QpO1xyXG4gICAgICAgICAgICB2YXIgYnRlc3QgPSAocGFyc2VGbG9hdChzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHNbaW5kZXhUb1JlbW92ZV0ubWF0ZXJpYWwudW5pdF9jb3N0KSAqIHBhcnNlSW50KHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFsc1tpbmRleFRvUmVtb3ZlXS5xdWFudGl0eSkpO1xyXG4gICAgICAgICAgICBjdXJyZW50Q29zdCAtPSBidGVzdDtcclxuICAgICAgICAgICAgc2VsZi5wcm9kdWN0LmNvc3QgPSBjdXJyZW50Q29zdDtcclxuXHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscy5zcGxpY2UoaW5kZXhUb1JlbW92ZSwgMSk7XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkTWF0ZXJpYWwobWF0ZXJpYWxJZCwgcXVhbnRpdHksIG1hdGVyaWFsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzID09PSB1bmRlZmluZWQpIHsgc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzID0gW107IH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsX2lkOiBtYXRlcmlhbElkLFxyXG4gICAgICAgICAgICAgICAgcXVhbnRpdHk6IHF1YW50aXR5LFxyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWw6IG1hdGVyaWFsXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYoc2VsZi5wcm9kdWN0LmNvc3QgPT09IHVuZGVmaW5lZCB8fCBzZWxmLnByb2R1Y3QuY29zdCA9PT0gbnVsbCkgeyBzZWxmLnByb2R1Y3QuY29zdCA9IDA7IH1cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRDb3N0ID0gcGFyc2VGbG9hdChzZWxmLnByb2R1Y3QuY29zdCk7XHJcbiAgICAgICAgICAgIHZhciBidGVzdCA9IChwYXJzZUZsb2F0KG1hdGVyaWFsLnVuaXRfY29zdCkgKiBwYXJzZUZsb2F0KHF1YW50aXR5KSk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDb3N0ICs9IGJ0ZXN0O1xyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QuY29zdCA9IGN1cnJlbnRDb3N0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1Byb2R1Y3RDcmVhdGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3RTZXJ2aWNlJywgJ1ZhbGlkYXRpb25TZXJ2aWNlJywgJ215Q29uZmlnJywgJyRzdGF0ZVBhcmFtcycsIFByb2R1Y3RDcmVhdGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFByb2R1Y3REZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgJHN0YXRlUGFyYW1zLCBUb2FzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UsIFZhbGlkYXRpb25TZXJ2aWNlLCBteUNvbmZpZylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJHN0YXRlUGFyYW1zKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxNYXRlcmlhbHMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0UHJvZHVjdChzZWxmLCAkc3RhdGVQYXJhbXMucHJvZHVjdElkKTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWNpbWFsUmVnZXggPSBWYWxpZGF0aW9uU2VydmljZS5kZWNpbWFsUmVnZXgoKTtcclxuICAgICAgICBzZWxmLm51bWVyaWNSZWdleCA9IFZhbGlkYXRpb25TZXJ2aWNlLm51bWVyaWNSZWdleCgpO1xyXG4gICAgICAgIHNlbGYuY2JBZGRNYXRlcmlhbHNCeSA9IDI7XHJcblxyXG4gICAgICAgIGlmKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG15Q29uZmlnLm1hdGVyaWFsU2V0c0xTS2V5KSAhPT0gbnVsbCAmJiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShteUNvbmZpZy5tYXRlcmlhbFNldHNMU0tleSkgIT09ICcnKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5tYXRlcmlhbFNldHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG15Q29uZmlnLm1hdGVyaWFsU2V0c0xTS2V5KSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVQcm9kdWN0ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlzVmFsaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9SZXN0U2VydmljZS51cGRhdGVQcm9kdWN0KHNlbGYsIHNlbGYucHJvZHVjdC5pZCk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnByb2R1Y3QucHV0KCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgdXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAucHJvZHVjdHNcIik7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVByb2R1Y3QgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QucmVtb3ZlKCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGVlbHRlZFwiKTtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGRlbGV0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAucHJvZHVjdHNcIik7XHJcblxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgZGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGRlbGV0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNob3dEZWxldGVDb25maXJtID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGV2LCAnRGVsZXRlIHByb2R1Y3Q/JywgJ1RoaXMgd2lsbCBhbHNvIGRlbGV0ZSBhbnkgd29yayBvcmRlciBvciBldmVudCBzdG9jayBsZXZlbHMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgcHJvZHVjdCcpO1xyXG4gICAgICAgICAgICBkaWFsb2cudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlUHJvZHVjdCgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5hZGRNYXRlcmlhbCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc2VsZWN0ZWRNYXRlcmlhbCk7XHJcblxyXG4gICAgICAgICAgICBhZGRNYXRlcmlhbChzZWxmLnNlbGVjdGVkTWF0ZXJpYWwuaWQsIHNlbGYuc2VsZWN0ZWRRdWFudGl0eSwgc2VsZi5zZWxlY3RlZE1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRNYXRlcmlhbCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRRdWFudGl0eSA9IDA7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYWRkTWF0ZXJpYWxTZXQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYuc2VsZWN0ZWRNYXRlcmlhbFNldCk7XHJcblxyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgc2VsZi5zZWxlY3RlZE1hdGVyaWFsU2V0LnByb2R1Y3RfbWF0ZXJpYWxzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcG0gPSBzZWxmLnNlbGVjdGVkTWF0ZXJpYWxTZXQucHJvZHVjdF9tYXRlcmlhbHNbaV07XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHBtKTtcclxuICAgICAgICAgICAgICAgIGFkZE1hdGVyaWFsKHBtLm1hdGVyaWFsX2lkLCBwbS5xdWFudGl0eSwgcG0ubWF0ZXJpYWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVNYXRlcmlhbCA9IGZ1bmN0aW9uKGUsIG1hdGVyaWFsSWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXhUb1JlbW92ZTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYobWF0ZXJpYWxJZCA9PSBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHNbaV0ubWF0ZXJpYWxfaWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhUb1JlbW92ZSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGluZGV4VG9SZW1vdmUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRDb3N0ID0gcGFyc2VGbG9hdChzZWxmLnByb2R1Y3QuY29zdCk7XHJcbiAgICAgICAgICAgIHZhciBidGVzdCA9IChwYXJzZUZsb2F0KHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFsc1tpbmRleFRvUmVtb3ZlXS5tYXRlcmlhbC51bml0X2Nvc3QpICogcGFyc2VJbnQoc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzW2luZGV4VG9SZW1vdmVdLnF1YW50aXR5KSk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDb3N0IC09IGJ0ZXN0O1xyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QuY29zdCA9IGN1cnJlbnRDb3N0O1xyXG5cclxuXHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscy5zcGxpY2UoaW5kZXhUb1JlbW92ZSwgMSk7XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkTWF0ZXJpYWwobWF0ZXJpYWxJZCwgcXVhbnRpdHksIG1hdGVyaWFsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzID09PSB1bmRlZmluZWQpIHsgc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzID0gW107IH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIHByb2R1Y3RfaWQ6IHNlbGYucHJvZHVjdC5pZCxcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsX2lkOiBtYXRlcmlhbElkLFxyXG4gICAgICAgICAgICAgICAgcXVhbnRpdHk6IHF1YW50aXR5LFxyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWw6IG1hdGVyaWFsXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYoc2VsZi5wcm9kdWN0LmNvc3QgPT09IHVuZGVmaW5lZCB8fCBzZWxmLnByb2R1Y3QuY29zdCA9PT0gbnVsbCkgeyBzZWxmLnByb2R1Y3QuY29zdCA9IDA7IH1cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRDb3N0ID0gcGFyc2VGbG9hdChzZWxmLnByb2R1Y3QuY29zdCk7XHJcbiAgICAgICAgICAgIHZhciBidGVzdCA9IChwYXJzZUZsb2F0KG1hdGVyaWFsLnVuaXRfY29zdCkgKiBwYXJzZUZsb2F0KHF1YW50aXR5KSk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDb3N0ICs9IGJ0ZXN0O1xyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QuY29zdCA9IGN1cnJlbnRDb3N0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUHJvZHVjdERldGFpbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCAnVG9hc3RTZXJ2aWNlJywgJ0RpYWxvZ1NlcnZpY2UnLCAnVmFsaWRhdGlvblNlcnZpY2UnLCAnbXlDb25maWcnLCBQcm9kdWN0RGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBQcm9kdWN0Q29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYuZmlsdGVyVHlwZSA9IFwiXCI7XHJcbiAgICAgICAgc2VsZi5maWx0ZXJPcGVyYXRvciA9IFwiXCI7XHJcbiAgICAgICAgc2VsZi5maWx0ZXJWYWx1ZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFByb2R1Y3RzKHNlbGYpO1xyXG5cclxuICAgICAgICBzZWxmLmFwcGx5UHJvZHVjdEZpbHRlciA9IGZ1bmN0aW9uKHApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZihzZWxmLmZpbHRlclR5cGUgIT09IFwiXCIgJiYgc2VsZi5maWx0ZXJPcGVyYXRvciAhPT0gXCJcIiAmJiBzZWxmLmZpbHRlclZhbHVlICE9PSBcIlwiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImhpXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5VG9GaWx0ZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoKHNlbGYuZmlsdGVyVHlwZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwic3RvY2tcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlUb0ZpbHRlciA9IHBhcnNlSW50KHAuY3VycmVudF9zdG9jayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwcmljZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVRvRmlsdGVyID0gcGFyc2VGbG9hdChwLnByaWNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImNvc3RcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlUb0ZpbHRlciA9IHBhcnNlRmxvYXQocC5jb3N0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5maWx0ZXJPcGVyYXRvciA9PT0gXCI9XCIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VG9GaWx0ZXIgPT0gcGFyc2VGbG9hdChzZWxmLmZpbHRlclZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYoc2VsZi5maWx0ZXJPcGVyYXRvciA9PT0gXCI+XCIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VG9GaWx0ZXIgPiBwYXJzZUZsb2F0KHNlbGYuZmlsdGVyVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihzZWxmLmZpbHRlck9wZXJhdG9yID09PSBcIj49XCIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VG9GaWx0ZXIgPj0gc2VsZi5maWx0ZXJWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYoc2VsZi5maWx0ZXJPcGVyYXRvciA9PT0gXCI8XCIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VG9GaWx0ZXIgPCBwYXJzZUZsb2F0KHNlbGYuZmlsdGVyVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihzZWxmLmZpbHRlck9wZXJhdG9yID09PSBcIjw9XCIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VG9GaWx0ZXIgPD0gcGFyc2VGbG9hdChzZWxmLmZpbHRlclZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUHJvZHVjdENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsIFByb2R1Y3RDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFB1cmNoYXNlT3JkZXJDcmVhdGVDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsICRzY29wZSwgJG1vbWVudCwgUmVzdGFuZ3VsYXIsIFRvYXN0U2VydmljZSwgUmVzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UsIFZhbGlkYXRpb25TZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxDdXN0b21lcnMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUHJvZHVjdHMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUGF5bWVudFR5cGVzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEZ1bGx5Qm9va2VkRGF5cyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyID0ge307XHJcbiAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLmFtb3VudF9wYWlkID0gMDtcclxuICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIuZGlzY291bnQgPSAwO1xyXG4gICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9IDA7XHJcblxyXG4gICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5kZWxpdmVyeSA9IDA7XHJcbiAgICAgICAgc2VsZi5kZWxpdmVyeV9jaGFyZ2UgPSAwO1xyXG5cclxuICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIuc2hpcHBpbmcgPSAwO1xyXG4gICAgICAgIHNlbGYuc2hpcHBpbmdfY2hhcmdlID0gMDtcclxuXHJcbiAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnN1cHByZXNzd29ya29yZGVyID0gMDtcclxuXHJcbiAgICAgICAgdmFyIG9yaWdpbmFsVG90YWwgPSAwO1xyXG4gICAgICAgIHZhciBvcmlnaW5hbFNoaXBwaW5nQ2hhcmdlID0gMDtcclxuXHJcbiAgICAgICAgc2VsZi5hZGRQcm9kdWN0SW5saW5lID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpYWxvZ3MvZGxnQ3JlYXRlUHJvZHVjdElubGluZS5odG1sJyxcclxuICAgICAgICAgICAgICAgIGVzY2FwZVRvQ2xvc2U6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRFdmVudDogZXYsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiBEaWFsb2dDb250cm9sbGVyKCRzY29wZSwgJG1kRGlhbG9nKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5kZWNpbWFsUmVnZXggPSBWYWxpZGF0aW9uU2VydmljZS5kZWNpbWFsUmVnZXgoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbmZpcm1EaWFsb2cgPSBmdW5jdGlvbiAoKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnYWNjZXB0ZWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNWYWxpZCA9ICRzY29wZS5mb3JtMS4kdmFsaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwID0gJHNjb3BlLmN0cmxQcm9kdWN0Q3JlYXRlSW5saW5lLnByb2R1Y3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwLmNvc3QgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcC5taW5pbXVtX3N0b2NrID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHAuY3VycmVudF9zdG9jayA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc3RTZXJ2aWNlLmFkZFByb2R1Y3QocCkudGhlbihmdW5jdGlvbihkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZC5uZXdJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBvcCA9IHtpZDogZC5uZXdJZCwgbmFtZTogcC5uYW1lLCBwcmljZTogcC5wcmljZX07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5wcm9kdWN0cy5wdXNoKHBvcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFByb2R1Y3QgPSBwb3A7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJQcm9kdWN0IFN1Y2Nlc3NmdWxseSBjcmVhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgY3JlYXRpbmcgcHJvZHVjdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRtZERpYWxvZy5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2FuY2VsRGlhbG9nID0gZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnY2FuY2VsbGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRtZERpYWxvZy5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzY29wZTogJHNjb3BlLiRuZXcoKVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgRGlhbG9nU2VydmljZS5mcm9tQ3VzdG9tKGRpYWxvZ09wdGlvbnMpO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFkZEN1c3RvbWVySW5saW5lID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpYWxvZ3MvZGxnQ3JlYXRlQ3VzdG9tZXJJbmxpbmUuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBlc2NhcGVUb0Nsb3NlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0RXZlbnQ6IGV2LFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gRGlhbG9nQ29udHJvbGxlcigkc2NvcGUsICRtZERpYWxvZylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY29uZmlybURpYWxvZyA9IGZ1bmN0aW9uICgpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdhY2NlcHRlZCcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gJHNjb3BlLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGMgPSAkc2NvcGUuY3RybEN1c3RvbWVyQ3JlYXRlSW5saW5lLmN1c3RvbWVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzdFNlcnZpY2UuYWRkQ3VzdG9tZXIoYykudGhlbihmdW5jdGlvbihkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGQubmV3SWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY3VzdG9tZXJzLnB1c2goe2lkOiBkLm5ld0lkLCBmaXJzdF9uYW1lOiBjLmZpcnN0X25hbWUsIGxhc3RfbmFtZTogYy5sYXN0X25hbWUgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLmN1c3RvbWVyX2lkID0gZC5uZXdJZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkN1c3RvbWVyIFN1Y2Nlc3NmdWxseSBjcmVhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgY3JlYXRpbmcgY3VzdG9tZXJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNhbmNlbERpYWxvZyA9IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2NhbmNlbGxlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2NvcGU6ICRzY29wZS4kbmV3KClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbUN1c3RvbShkaWFsb2dPcHRpb25zKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLm9ubHlPcGVuRGF5cyA9IGZ1bmN0aW9uKGRhdGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmKCEkbW9tZW50KGRhdGUpLmlzQmVmb3JlKCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0ZSk7XHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgc2VsZi5ib29rZWREYXlzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi5ib29rZWREYXlzW2ldLnN0YXJ0X2RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi5ib29rZWREYXlzW2ldLnN0YXJ0X2RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJG1vbWVudChzZWxmLmJvb2tlZERheXNbaV0uc3RhcnRfZGF0ZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG1vbWVudChkYXRlKS5pc1NhbWUoc2VsZi5ib29rZWREYXlzW2ldLnN0YXJ0X2RhdGUpKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZVB1cmNoYXNlT3JkZXIgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnB1cmNoYXNlb3JkZXIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHAgPSBzZWxmLnB1cmNoYXNlb3JkZXI7XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCRlcnJvcik7XHJcblxyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3B1cmNoYXNlb3JkZXInKS5wb3N0KHApLnRoZW4oZnVuY3Rpb24oZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkKTtcclxuICAgICAgICAgICAgICAgIC8vJHN0YXRlLmdvKCdhcHAucHJvZHVjdHMuZGV0YWlsJywgeydwcm9kdWN0SWQnOiBkLm5ld0lkfSk7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBjcmVhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucHVyY2hhc2VvcmRlcnMnKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGNyZWF0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFwcGx5RGlzY291bnQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIuZGlzY291bnQgPT0gbnVsbCB8fCBzZWxmLnB1cmNoYXNlb3JkZXIuZGlzY291bnQgPT0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID0gb3JpZ2luYWxUb3RhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsICE9PSBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID4gMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGlzY291bnRlZCA9IG9yaWdpbmFsVG90YWwgLSBzZWxmLnB1cmNoYXNlb3JkZXIuZGlzY291bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzY291bnRlZCA+PSAwID8gc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID0gZGlzY291bnRlZCA6IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFwcGx5RGVsaXZlcnkgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZihzZWxmLmRlbGl2ZXJ5X2NoYXJnZSA9PT0gMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLmRlbGl2ZXJ5ID0gZGVsaXZlcnlGZWU7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgKz0gZGVsaXZlcnlGZWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIuZGVsaXZlcnkgPSAwO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsIC09IGRlbGl2ZXJ5RmVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5hcHBseVNoaXBwaW5nID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGNvc3RPZlNoaXBwaW5nID0gMDtcclxuICAgICAgICAgICAgaWYoc2VsZi5zaGlwcGluZ19jaGFyZ2UgPT09ICdDRE4nKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb3N0T2ZTaGlwcGluZyA9IHNoaXBwaW5nQ2FuYWRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoc2VsZi5zaGlwcGluZ19jaGFyZ2UgPT09ICdVU0EnKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb3N0T2ZTaGlwcGluZyA9IHNoaXBwaW5nVXNhO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIuc2hpcHBpbmcgPSBjb3N0T2ZTaGlwcGluZztcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYuc2hpcHBpbmdfY2hhcmdlICE9PSBvcmlnaW5hbFNoaXBwaW5nQ2hhcmdlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgLT0gb3JpZ2luYWxTaGlwcGluZ0NoYXJnZTtcclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCArPSBjb3N0T2ZTaGlwcGluZztcclxuXHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFRvdGFsIC09IG9yaWdpbmFsU2hpcHBpbmdDaGFyZ2U7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFRvdGFsICs9IGNvc3RPZlNoaXBwaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBvcmlnaW5hbFNoaXBwaW5nQ2hhcmdlID0gY29zdE9mU2hpcHBpbmc7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICBzZWxmLmFkZFByb2R1Y3QgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnNlbGVjdGVkUHJvZHVjdCk7XHJcblxyXG4gICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMgPT09IHVuZGVmaW5lZCkgeyBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMgPSBbXTsgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgcHJvZHVjdF9pZDogc2VsZi5zZWxlY3RlZFByb2R1Y3QuaWQsXHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eTogc2VsZi5zZWxlY3RlZFF1YW50aXR5LFxyXG4gICAgICAgICAgICAgICAgcHJvZHVjdDogc2VsZi5zZWxlY3RlZFByb2R1Y3RcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPT09IHVuZGVmaW5lZCB8fCBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPT09IG51bGwpIHsgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID0gMDsgfVxyXG4gICAgICAgICAgICB2YXIgY3VycmVudENvc3QgPSBwYXJzZUZsb2F0KHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCk7XHJcbiAgICAgICAgICAgIHZhciBidGVzdCA9IChwYXJzZUZsb2F0KHNlbGYuc2VsZWN0ZWRQcm9kdWN0LnByaWNlKSAqIHBhcnNlSW50KHNlbGYuc2VsZWN0ZWRRdWFudGl0eSkpO1xyXG4gICAgICAgICAgICBjdXJyZW50Q29zdCArPSBidGVzdDtcclxuICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID0gY3VycmVudENvc3Q7XHJcbiAgICAgICAgICAgIG9yaWdpbmFsVG90YWwgPSBjdXJyZW50Q29zdDtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRQcm9kdWN0ID0gXCJcIjtcclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFF1YW50aXR5ID0gMDtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYucHVyY2hhc2VvcmRlcik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVQcm9kdWN0ID0gZnVuY3Rpb24oZSwgcHJvZHVjdElkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4VG9SZW1vdmU7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHByb2R1Y3RJZCA9PSBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaV0ucHJvZHVjdF9pZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleFRvUmVtb3ZlID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpbmRleFRvUmVtb3ZlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50Q29zdCA9IHBhcnNlRmxvYXQoc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsKTtcclxuICAgICAgICAgICAgdmFyIGJ0ZXN0ID0gKHBhcnNlRmxvYXQoc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzW2luZGV4VG9SZW1vdmVdLnByb2R1Y3QucHJpY2UpICogcGFyc2VJbnQoc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzW2luZGV4VG9SZW1vdmVdLnF1YW50aXR5KSk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDb3N0IC09IGJ0ZXN0O1xyXG4gICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBjdXJyZW50Q29zdDtcclxuICAgICAgICAgICAgb3JpZ2luYWxUb3RhbCA9IGN1cnJlbnRDb3N0O1xyXG5cclxuICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzLnNwbGljZShpbmRleFRvUmVtb3ZlLCAxKTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRldGVybWluZVdvcmtPcmRlcnMgPSBmdW5jdGlvbihlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci5zdXBwcmVzc3dvcmtvcmRlciA9PSAxKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEp1c3QgcHJvY2VzcyB0aGUgUE8gYXMgbm9ybWFsXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jcmVhdGVQdXJjaGFzZU9yZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9kdWN0c1RvRnVsZmlsbCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2R1Y3RzVG9GdWxmaWxsLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdF9pZDogc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzW2ldLnByb2R1Y3RfaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzW2ldLnF1YW50aXR5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdzY2hlZHVsZXIvZ2V0V29ya09yZGVycycpLnBvc3Qoe3Byb2R1Y3RzVG9GdWxmaWxsOiBwcm9kdWN0c1RvRnVsZmlsbH0pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YS53b3JrT3JkZXJzVG9DcmVhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS53b3JrT3JkZXJzVG9DcmVhdGUgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGVyZSBhcmUgd29ya29yZGVycyBuZWVkZWQgZm9yIHRoaXMgUE8sIGNvbmZpcm0gdGhlaXIgY3JlYXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS53b3JrT3JkZXJzVG9DcmVhdGUgPSBkYXRhLndvcmtPcmRlcnNUb0NyZWF0ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS53b3JrT3JkZXJzID0gZGF0YS53b3JrT3JkZXJzO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKGUsICdkbGdDb25maXJtV29ya09yZGVycycsICRzY29wZSkudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci53b3JrX29yZGVycyA9ICRzY29wZS53b3JrT3JkZXJzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdjb25maXJtZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jcmVhdGVQdXJjaGFzZU9yZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2NhbmNlbGxlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBKdXN0IHByb2Nlc3MgdGhlIFBPIGFzIG5vcm1hbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jcmVhdGVQdXJjaGFzZU9yZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQdXJjaGFzZU9yZGVyQ3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJyRzY29wZScsICckbW9tZW50JywgJ1Jlc3Rhbmd1bGFyJywgJ1RvYXN0U2VydmljZScsICdSZXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgJ1ZhbGlkYXRpb25TZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIFB1cmNoYXNlT3JkZXJDcmVhdGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFB1cmNoYXNlT3JkZXJEZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsICRzY29wZSwgJG1vbWVudCwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMsIFRvYXN0U2VydmljZSwgRGlhbG9nU2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJHN0YXRlUGFyYW1zKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxDdXN0b21lcnMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUHJvZHVjdHMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUGF5bWVudFR5cGVzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldFB1cmNoYXNlT3JkZXIoc2VsZiwgJHN0YXRlUGFyYW1zLnB1cmNoYXNlT3JkZXJJZCk7XHJcblxyXG4gICAgICAgIHZhciBvcmlnaW5hbFRvdGFsID0gMDtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVQdXJjaGFzZU9yZGVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnB1dCgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwidXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IHVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAucHVyY2hhc2VvcmRlcnNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlUHVyY2hhc2VPcmRlciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWVsdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5wdXJjaGFzZW9yZGVyc1wiKTtcclxuXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBkZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2hvd0RlbGV0ZUNvbmZpcm0gPSBmdW5jdGlvbihldilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZXYsICdEZWxldGUgcHVyY2hhc2Ugb3JkZXI/JywgJycpO1xyXG4gICAgICAgICAgICBkaWFsb2cudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlUHVyY2hhc2VPcmRlcigpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5hcHBseURpc2NvdW50ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoc2VsZi5wdXJjaGFzZW9yZGVyLmRpc2NvdW50ID09IG51bGwgfHwgc2VsZi5wdXJjaGFzZW9yZGVyLmRpc2NvdW50ID09IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9IG9yaWdpbmFsVG90YWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICYmIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCAhPT0gbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgICYmIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA+IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpc2NvdW50ZWQgPSBvcmlnaW5hbFRvdGFsIC0gc2VsZi5wdXJjaGFzZW9yZGVyLmRpc2NvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc2NvdW50ZWQgPj0gMCA/IHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9IGRpc2NvdW50ZWQgOiAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5hZGRQcm9kdWN0ID0gZnVuY3Rpb24oZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc2VsZWN0ZWRQcm9kdWN0KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwb3BPYmogPSB7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBzZWxmLnNlbGVjdGVkUHJvZHVjdC5pZCxcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiBzZWxmLnNlbGVjdGVkUXVhbnRpdHksXHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0OiBzZWxmLnNlbGVjdGVkUHJvZHVjdFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdzY2hlZHVsZXIvZ2V0V29ya09yZGVycycpLnBvc3Qoe3Byb2R1Y3RzVG9GdWxmaWxsOiBbcG9wT2JqXSwgcHVyY2hhc2VPcmRlcklkOiBzZWxmLnB1cmNoYXNlb3JkZXIuaWR9KS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEud29ya09yZGVyc1RvQ3JlYXRlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMgPT09IHVuZGVmaW5lZCkgeyBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMgPSBbXTsgfVxyXG4gICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzLnB1c2gocG9wT2JqKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBSZWNhbGN1bGF0ZSBQTyB0b3RhbFxyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID09PSB1bmRlZmluZWQgfHwgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID09PSBudWxsKSB7IHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9IDA7IH1cclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50Q29zdCA9IHBhcnNlRmxvYXQoc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsKTtcclxuICAgICAgICAgICAgICAgIHZhciBidGVzdCA9IChwYXJzZUZsb2F0KHNlbGYuc2VsZWN0ZWRQcm9kdWN0LnByaWNlKSAqIHBhcnNlSW50KHNlbGYuc2VsZWN0ZWRRdWFudGl0eSkpO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudENvc3QgKz0gYnRlc3Q7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBjdXJyZW50Q29zdDtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsVG90YWwgPSBjdXJyZW50Q29zdDtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkUHJvZHVjdCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkUXVhbnRpdHkgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGRhdGEud29ya09yZGVyc1RvQ3JlYXRlID4gMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBUaGVyZSBhcmUgd29ya29yZGVycyBuZWVkZWQgZm9yIHRoaXMgUE8sIGFsZXJ0IG9mIHRoZWlyIGNyZWF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLndvcmtPcmRlcnNUb0NyZWF0ZSA9IGRhdGEud29ya09yZGVyc1RvQ3JlYXRlO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS53b3JrT3JkZXJzID0gZGF0YS53b3JrT3JkZXJzO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZShlLCAnZGxnQWxlcnRXb3JrT3JkZXJzJywgJHNjb3BlKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjb25maXJtZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBhZGRpbmcgcHJvZHVjdCwgcGxlYXNlIHRyeSBhZ2FpblwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVQcm9kdWN0ID0gZnVuY3Rpb24oZSwgcHJvZHVjdElkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4VG9SZW1vdmU7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHByb2R1Y3RJZCA9PSBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaV0ucHJvZHVjdF9pZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleFRvUmVtb3ZlID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpbmRleFRvUmVtb3ZlKTtcclxuXHJcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnc2NoZWR1bGVyL3Jlc3RvcmVTdG9ja0ZvclByb2R1Y3QnKS5wb3N0KHtwdXJjaGFzZV9vcmRlcl9pZDogc2VsZi5wdXJjaGFzZW9yZGVyLmlkLCBwcm9kdWN0X2lkOiBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaW5kZXhUb1JlbW92ZV0ucHJvZHVjdF9pZH0pLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gUmVjYWxjdWxhdGUgUE8gdG90YWxcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50Q29zdCA9IHBhcnNlRmxvYXQoc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsKTtcclxuICAgICAgICAgICAgICAgIHZhciBidGVzdCA9IChwYXJzZUZsb2F0KHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0c1tpbmRleFRvUmVtb3ZlXS5wcm9kdWN0LnByaWNlKSAqIHBhcnNlSW50KHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0c1tpbmRleFRvUmVtb3ZlXS5xdWFudGl0eSkpO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudENvc3QgLT0gYnRlc3Q7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBjdXJyZW50Q29zdDtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsVG90YWwgPSBjdXJyZW50Q29zdDtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMuc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xyXG5cclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIHVwZGF0aW5nIHN0b2NrLCBwbGVhc2UgdHJ5IGFnYWluXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQdXJjaGFzZU9yZGVyRGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJyRzY29wZScsICckbW9tZW50JywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsICdUb2FzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsIFB1cmNoYXNlT3JkZXJEZXRhaWxDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFB1cmNoYXNlT3JkZXJDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFB1cmNoYXNlT3JkZXJzKHNlbGYpO1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQdXJjaGFzZU9yZGVyQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgUHVyY2hhc2VPcmRlckNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUmVwb3J0Q29udHJvbGxlcigkc2NvcGUsICRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgQ2hhcnRTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5yZXBvcnRQYXJhbXMgPSB7fTtcclxuXHJcbiAgICAgICAgaWYoJHN0YXRlLmlzKCdhcHAucmVwb3J0cy5jdXJyZW50c3RvY2snKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdlbmVyYXRlQ3VycmVudFN0b2NrUmVwb3J0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoJHN0YXRlLmlzKCdhcHAucmVwb3J0cy5zYWxlcycpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2hvd1NhbGVzUmVwb3J0VmlldygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKCRzdGF0ZS5pcygnYXBwLnJlcG9ydHMuc2FsZXNieW1vbnRoJykpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzaG93U2FsZXNSZXBvcnRCeU1vbnRoVmlldygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKCRzdGF0ZS5pcygnYXBwLnJlcG9ydHMuaW5jb21lYnltb250aCcpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2hvd0luY29tZVJlcG9ydEJ5TW9udGhWaWV3KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoJHN0YXRlLmlzKCdhcHAucmVwb3J0cy5wcm9kdWN0cHJvZml0cGVyY2VudHMnKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNob3dQcm9kdWN0UHJvZml0UGVyY2VudHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZigkc3RhdGUuaXMoJ2FwcC5yZXBvcnRzLndlZWt3b3Jrb3JkZXJzJykpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzaG93V2Vla2x5V29ya09yZGVycygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBSZXBvcnQgaG9tZVxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZS5pcygnYXBwLnJlcG9ydHMnKSk7XHJcbiAgICAgICAgICAgIHNob3dEYXNoYm9hcmRXaWRnZXRzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2hvd1Byb2R1Y3RQcm9maXRQZXJjZW50cygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDaGFydFNlcnZpY2UuZ2V0UHJvZHVjdFByb2ZpdFBlcmNlbnRzKHNlbGYpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2hvd1dlZWtseVdvcmtPcmRlcnMoKVxyXG4gICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncmVwb3J0cy9nZXRXZWVrV29ya09yZGVyUmVwb3J0JykuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYud2Vla3dvcmtvcmRlcnMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZUN1cnJlbnRTdG9ja1JlcG9ydCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdlbmVyYXRlIHN0b2NrIHJlcnBvcnRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93U2FsZXNSZXBvcnRWaWV3KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbEN1c3RvbWVycyhzZWxmKTtcclxuICAgICAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUHJvZHVjdHMoc2VsZik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93RGFzaGJvYXJkV2lkZ2V0cygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDaGFydFNlcnZpY2UuZ2V0VG9wU2VsbGluZ1Byb2R1Y3RzKHNlbGYsICdUb3AgU2VsbGluZyBBbGwgVGltZScpO1xyXG4gICAgICAgICAgICBnZXRXb3JzdFNlbGxpbmdQcm9kdWN0cyhzZWxmKTtcclxuICAgICAgICAgICAgZ2V0T3ZlcmR1ZVB1cmNoYXNlT3JkZXJzKHNlbGYpO1xyXG4gICAgICAgICAgICBnZXRNb250aGx5SW5jb21lKHNlbGYpO1xyXG4gICAgICAgICAgICBnZXRPdXRzdGFuZGluZ1BheW1lbnRzKHNlbGYpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2hvd1NhbGVzUmVwb3J0QnlNb250aFZpZXcoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ2hhcnRTZXJ2aWNlLmdldE1vbnRobHlTYWxlc1JlcG9ydChzZWxmKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNob3dJbmNvbWVSZXBvcnRCeU1vbnRoVmlldygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDaGFydFNlcnZpY2UuZ2V0TW9udGhseUluY29tZVJlcG9ydChzZWxmKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbGYuZ2V0U2FsZXNSZXBvcnQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnJlcG9ydFBhcmFtcyk7XHJcbiAgICAgICAgICAgIHNlbGYucG9Ub3RhbCA9IDA7XHJcbiAgICAgICAgICAgIHNlbGYucG9Db3VudCA9IDA7XHJcblxyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3JlcG9ydHMvZ2V0U2FsZXNSZXBvcnQnKS5wb3N0KHsgJ3JlcG9ydFBhcmFtcyc6IHNlbGYucmVwb3J0UGFyYW1zfSkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnJlc3VsdHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wb0NvdW50ID0gZGF0YS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLnJlc3VsdHNbMF0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIEVycm9yXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFdvcnN0U2VsbGluZ1Byb2R1Y3RzKHNjb3BlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdyZXBvcnRzL2dldFdvcnN0U2VsbGluZ1Byb2R1Y3RzJykuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLndvcnN0U2VsbGluZ1Byb2R1Y3RzID0gZGF0YTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldE92ZXJkdWVQdXJjaGFzZU9yZGVycyhzY29wZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncmVwb3J0cy9nZXRPdmVyZHVlUHVyY2hhc2VPcmRlcnMnKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYub3ZlcmR1ZVB1cmNoYXNlT3JkZXJzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIC8vc2VsZi5wb0NvdW50ID0gZGF0YS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gRXJyb3JcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRNb250aGx5SW5jb21lKHNjb3BlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdyZXBvcnRzL2dldE1vbnRobHlTYWxlc1JlcG9ydCcpLnBvc3QoeyAncmVwb3J0UGFyYW1zJzoge319KS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUubW9udGhseUluY29tZXMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNjb3BlLm1vbnRobHlJbmNvbWVzLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbCA9IHNjb3BlLm1vbnRobHlJbmNvbWVzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZShzY29wZS5tb250aGx5SW5jb21lc1tsLTFdLnllYXIsIHNjb3BlLm1vbnRobHlJbmNvbWVzW2wtMV0ubW9udGggLSAxLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY3VyTW9udGhseUluY29tZU1vbnRoID0gZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY3VyTW9udGhseUluY29tZVRvdGFsID0gc2NvcGUubW9udGhseUluY29tZXNbbC0xXS5tb250aHRvdGFsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXJNb250aGx5SW5jb21lUG9zID0gbCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRPdXRzdGFuZGluZ1BheW1lbnRzKHNjb3BlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdyZXBvcnRzL2dldE91dHN0YW5kaW5nUGF5bWVudHMnKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5vdXRzdGFuZGluZ1BheW1lbnRzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBpZihzY29wZS5vdXRzdGFuZGluZ1BheW1lbnRzLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKHNjb3BlLm91dHN0YW5kaW5nUGF5bWVudHNbMF0ueWVhciwgc2NvcGUub3V0c3RhbmRpbmdQYXltZW50c1swXS5tb250aCAtIDEsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXJNb250aGx5T3V0c3RhbmRpbmdNb250aCA9IGQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmN1ck1vbnRobHlPdXN0YW5kaW5nVG90YWwgPSBzY29wZS5vdXRzdGFuZGluZ1BheW1lbnRzWzBdLm91dHN0YW5kaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXJNb250aGx5T3V0c3RhbmRpbmdQb3MgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRXJyb3JcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VsZi5jaGFuZ2VNb250aGx5T3V0c3RhbmRpbmcgPSBmdW5jdGlvbihpbmNyZW1lbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmN1ck1vbnRobHlPdXRzdGFuZGluZ1BvcyArPSBpbmNyZW1lbnQ7XHJcblxyXG4gICAgICAgICAgICBpZigoc2VsZi5jdXJNb250aGx5T3V0c3RhbmRpbmdQb3MgPCAwKSkgeyBzZWxmLmN1ck1vbnRobHlPdXRzdGFuZGluZ1BvcyA9IDA7IH1cclxuICAgICAgICAgICAgZWxzZSBpZigoc2VsZi5jdXJNb250aGx5T3V0c3RhbmRpbmdQb3MgKyAxKSA+IHNlbGYub3V0c3RhbmRpbmdQYXltZW50cy5sZW5ndGgpIHsgc2VsZi5jdXJNb250aGx5T3V0c3RhbmRpbmdQb3MgPSBzZWxmLm91dHN0YW5kaW5nUGF5bWVudHMubGVuZ3RoIC0gMTsgfVxyXG5cclxuICAgICAgICAgICAgaWYoc2VsZi5jdXJNb250aGx5T3V0c3RhbmRpbmdQb3MgPj0gMCAmJiAoc2VsZi5jdXJNb250aGx5T3V0c3RhbmRpbmdQb3MgKyAxKSA8PSBzZWxmLm91dHN0YW5kaW5nUGF5bWVudHMubGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKHNlbGYub3V0c3RhbmRpbmdQYXltZW50c1tzZWxmLmN1ck1vbnRobHlPdXRzdGFuZGluZ1Bvc10ueWVhciwgc2VsZi5vdXRzdGFuZGluZ1BheW1lbnRzW3NlbGYuY3VyTW9udGhseU91dHN0YW5kaW5nUG9zXS5tb250aCAtIDEsIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYuY3VyTW9udGhseU91dHN0YW5kaW5nTW9udGggPSBkO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jdXJNb250aGx5T3VzdGFuZGluZ1RvdGFsID0gc2VsZi5vdXRzdGFuZGluZ1BheW1lbnRzW3NlbGYuY3VyTW9udGhseU91dHN0YW5kaW5nUG9zXS5vdXRzdGFuZGluZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuY2hhbmdlTW9udGhseUluY29tZSA9IGZ1bmN0aW9uKGluY3JlbWVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ0xlbjonICsgc2VsZi5tb250aGx5SW5jb21lcy5sZW5ndGgpO1xyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLmN1ck1vbnRobHlJbmNvbWVQb3MpO1xyXG4gICAgICAgICAgICBzZWxmLmN1ck1vbnRobHlJbmNvbWVQb3MgKz0gaW5jcmVtZW50O1xyXG5cclxuICAgICAgICAgICAgaWYoKHNlbGYuY3VyTW9udGhseUluY29tZVBvcyA8IDApKSB7IHNlbGYuY3VyTW9udGhseUluY29tZVBvcyA9IDA7IH1cclxuICAgICAgICAgICAgZWxzZSBpZigoc2VsZi5jdXJNb250aGx5SW5jb21lUG9zICsgMSkgPiBzZWxmLm1vbnRobHlJbmNvbWVzLmxlbmd0aCkgeyBzZWxmLmN1ck1vbnRobHlJbmNvbWVQb3MgPSBzZWxmLm1vbnRobHlJbmNvbWVzLmxlbmd0aCAtIDE7IH1cclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi5jdXJNb250aGx5SW5jb21lUG9zKTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYuY3VyTW9udGhseUluY29tZVBvcyA+PSAwICYmIChzZWxmLmN1ck1vbnRobHlJbmNvbWVQb3MgKyAxKSA8PSBzZWxmLm1vbnRobHlJbmNvbWVzLmxlbmd0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZShzZWxmLm1vbnRobHlJbmNvbWVzW3NlbGYuY3VyTW9udGhseUluY29tZVBvc10ueWVhciwgc2VsZi5tb250aGx5SW5jb21lc1tzZWxmLmN1ck1vbnRobHlJbmNvbWVQb3NdLm1vbnRoIC0gMSwgMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi5jdXJNb250aGx5SW5jb21lTW9udGggPSBkO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jdXJNb250aGx5SW5jb21lVG90YWwgPSBzZWxmLm1vbnRobHlJbmNvbWVzW3NlbGYuY3VyTW9udGhseUluY29tZVBvc10ubW9udGh0b3RhbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNldFBvVG90YWwgPSBmdW5jdGlvbihpdGVtKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coaXRlbSk7XHJcbiAgICAgICAgICAgIGlmKGl0ZW0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucG9Ub3RhbCArPSBwYXJzZUZsb2F0KGl0ZW0udG90YWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdSZXBvcnRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJ0NoYXJ0U2VydmljZScsIFJlcG9ydENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gU2VhcmNoQ29udHJvbGxlcigkc2NvcGUsICRhdXRoLCBSZXN0YW5ndWxhciwgJHN0YXRlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5ub0NhY2hlID0gdHJ1ZTtcclxuICAgICAgICBzZWxmLnNlYXJjaFRleHQgPSBcIlwiO1xyXG4gICAgICAgIHNlbGYuc2VsZWN0ZWRSZXN1bHQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIHNlbGYuZG9TZWFyY2ggPSBmdW5jdGlvbihxdWVyeSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vUmVzdFNlcnZpY2UuZG9TZWFyY2goc2VsZiwgc2VsZi5zZWFyY2hUZXh0KTtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLm9uZSgnc2VhcmNoJywgcXVlcnkpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmZpcmVUb2dnbGVTZWFyY2hFdmVudCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIC8vc2VsZi4kcm9vdC4kYnJvYWRjYXN0KFwidG9nZ2xlU2VhcmNoXCIsIHt1c2VybmFtZTogJHNjb3BlLnVzZXIudXNlcm5hbWUgfSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kcm9vdC4kYnJvYWRjYXN0KFwidG9nZ2xlU2VhcmNoXCIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZ290b0l0ZW0gPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnNlbGVjdGVkUmVzdWx0KTtcclxuICAgICAgICAgICAgaWYoc2VsZi5zZWxlY3RlZFJlc3VsdCAhPT0gbnVsbCAmJiBzZWxmLnNlbGVjdGVkUmVzdWx0ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoVGV4dCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmZpcmVUb2dnbGVTZWFyY2hFdmVudCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHN3aXRjaChzZWxmLnNlbGVjdGVkUmVzdWx0LmNvbnRlbnRfdHlwZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicHJvZHVjdFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5wcm9kdWN0cy5kZXRhaWwnLCB7J3Byb2R1Y3RJZCc6IHNlbGYuc2VsZWN0ZWRSZXN1bHQuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJjdXN0b21lclwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5jdXN0b21lcnMuZGV0YWlsJywgeydjdXN0b21lcklkJzogc2VsZi5zZWxlY3RlZFJlc3VsdC5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImV2ZW50XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmV2ZW50cy5kZXRhaWwnLCB7J2V2ZW50SWQnOiBzZWxmLnNlbGVjdGVkUmVzdWx0LmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwid29ya29yZGVyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLndvcmtvcmRlcnMuZGV0YWlsJywgeyd3b3JrT3JkZXJJZCc6IHNlbGYuc2VsZWN0ZWRSZXN1bHQuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJtYXRlcmlhbFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5tYXRlcmlhbHMuZGV0YWlsJywgeydtYXRlcmlhbElkJzogc2VsZi5zZWxlY3RlZFJlc3VsdC5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInB1cmNoYXNlb3JkZXJcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucHVyY2hhc2VvcmRlcnMuZGV0YWlsJywgeydwdXJjaGFzZU9yZGVySWQnOiBzZWxmLnNlbGVjdGVkUmVzdWx0LmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2VhcmNoQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRhdXRoJywgJ1Jlc3Rhbmd1bGFyJywgJyRzdGF0ZScsIFNlYXJjaENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gVW5pdENyZWF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgVG9hc3RTZXJ2aWNlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYuY3JlYXRlVW5pdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi51bml0KTtcclxuICAgICAgICAgICAgICAgIHZhciBjID0gc2VsZi51bml0O1xyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgndW5pdCcpLnBvc3QoYykudGhlbihmdW5jdGlvbihkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vJHN0YXRlLmdvKCdhcHAuY3VzdG9tZXJzLmRldGFpbCcsIHsnY3VzdG9tZXJJZCc6IGQubmV3SWR9KTtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBjcmVhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLnVuaXRzJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgY3JlYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdVbml0Q3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCBVbml0Q3JlYXRlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBVbml0RGV0YWlsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBUb2FzdFNlcnZpY2UsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgRGlhbG9nU2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldFVuaXQoc2VsZiwgJHN0YXRlUGFyYW1zLnVuaXRJZCk7XHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlVW5pdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYudW5pdC5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC51bml0c1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVVuaXQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLnVuaXQucmVtb3ZlKCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGRlbGV0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAudW5pdHNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBEZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNob3dEZWxldGVDb25maXJtID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGV2LCAnRGVsZXRlIHVuaXQ/JywgJycpO1xyXG4gICAgICAgICAgICBkaWFsb2cudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5kZWxldGVVbml0KCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1VuaXREZXRhaWxDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJ0RpYWxvZ1NlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgVW5pdERldGFpbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gVW5pdENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsVW5pdHMoc2VsZik7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdVbml0Q29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgVW5pdENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gV29ya09yZGVyQ3JlYXRlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgVXBsb2FkU2VydmljZSwgVG9hc3RTZXJ2aWNlLCAkbW9tZW50LCBSZXN0U2VydmljZSwgVmFsaWRhdGlvblNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbEN1c3RvbWVycyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi5udW1lcmljUmVnZXggPSBWYWxpZGF0aW9uU2VydmljZS5udW1lcmljUmVnZXgoKTtcclxuICAgICAgICBzZWxmLndvcmtvcmRlciA9IHt9O1xyXG5cclxuICAgICAgICBzZWxmLnVwbG9hZEZpbGUgPSBmdW5jdGlvbihmaWxlLCBlcnJGaWxlcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZiA9IGZpbGU7XHJcbiAgICAgICAgICAgIHNlbGYuZXJyRmlsZSA9IGVyckZpbGVzICYmIGVyckZpbGVzWzBdO1xyXG4gICAgICAgICAgICBpZihmaWxlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBVcGxvYWRTZXJ2aWNlLnVwbG9hZEZpbGUoJycsIGZpbGUpLnRoZW4oZnVuY3Rpb24gKHJlc3ApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzcC5kYXRhLnN1Y2Nlc3MgPT0gMSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3N1Y2Nlc3NmdWwgdXBsb2FkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYud29ya29yZGVyLmltYWdlX2ZpbGVuYW1lID0gcmVzcC5kYXRhLmZpbGVuYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdTdWNjZXNzICcgKyByZXNwLmNvbmZpZy5kYXRhLmZpbGUubmFtZSArICd1cGxvYWRlZC4gUmVzcG9uc2U6ICcgKyByZXNwLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3ApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3Auc3RhdHVzID4gMClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZXJyb3JNc2cgPSByZXNwLnN0YXR1cyArICc6ICcgKyByZXNwLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBzdGF0dXM6ICcgKyByZXNwLnN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXZ0KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGUucHJvZ3Jlc3MgPSBNYXRoLm1pbigxMDAsIHBhcnNlSW50KDEwMC4wICogZXZ0LmxvYWRlZCAvIGV2dC50b3RhbCkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZVdvcmtPcmRlciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi53b3Jrb3JkZXIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB3ID0gc2VsZi53b3Jrb3JkZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCd3b3Jrb3JkZXInKS5wb3N0KHcpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8kc3RhdGUuZ28oJ2FwcC53b3Jrb3JkZXJzLmRldGFpbCcsIHsnd29ya09yZGVySWQnOiAxfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAud29ya29yZGVycycpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignV29ya09yZGVyQ3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1VwbG9hZFNlcnZpY2UnLCAnVG9hc3RTZXJ2aWNlJywgJyRtb21lbnQnLCAnUmVzdFNlcnZpY2UnLCAnVmFsaWRhdGlvblNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgV29ya09yZGVyQ3JlYXRlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBXb3JrT3JkZXJEZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsICRzY29wZSwgVG9hc3RTZXJ2aWNlLCBSZXN0YW5ndWxhciwgVXBsb2FkU2VydmljZSwgUmVzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UsIFZhbGlkYXRpb25TZXJ2aWNlLCAkbW9tZW50LCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0V29ya09yZGVyKHNlbGYsICRzdGF0ZVBhcmFtcy53b3JrT3JkZXJJZCk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsQ3VzdG9tZXJzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFByb2R1Y3RzKHNlbGYpO1xyXG5cclxuICAgICAgICBzZWxmLm51bWVyaWNSZWdleCA9IFZhbGlkYXRpb25TZXJ2aWNlLm51bWVyaWNSZWdleCgpO1xyXG5cclxuICAgICAgICBzZWxmLnRvZ2dsZUNvbXBsZXRlID0gZnVuY3Rpb24oY2JTdGF0ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNiU3RhdGUpO1xyXG4gICAgICAgICAgICAvL2lmKGNiU3RhdGUpIHsgc2VsZi53b3Jrb3JkZXIuY29tcGxldGVkID0gMTsgfVxyXG4gICAgICAgICAgICAvL2Vsc2UgeyBzZWxmLndvcmtvcmRlci5jb21wbGV0ZWQgPSAwOyB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi52aWV3QXR0YWNobWVudCA9IGZ1bmN0aW9uKGV2LCBmaWxlbmFtZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICRzY29wZS5hID0gYXR0YWNobWVudFBhdGggICsgJy8nICsgZmlsZW5hbWU7XHJcblxyXG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZShldiwgJ2RsZ0F0dGFjaG1lbnRWaWV3JywgJHNjb3BlKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjb25maXJtZWQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYXR0YWNobWVudFBhdGggICsgJy8nICsgZmlsZW5hbWUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlQXR0YWNobWVudCA9IGZ1bmN0aW9uKGV2LCBmaWxlbmFtZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZXYsICdEZWxldGUgYXR0YWNobWVudD8nLCAnJyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBVcGxvYWRTZXJ2aWNlLmRlbGV0ZUZpbGUoZmlsZW5hbWUpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi53b3Jrb3JkZXIuaW1hZ2VfZmlsZW5hbWUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmYucHJvZ3Jlc3MgPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5mID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiQXR0YWNoZW50IGRlbGV0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzcClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgZGVsZXRpbmcgYXR0YWNobWVudFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnVwbG9hZEZpbGUgPSBmdW5jdGlvbihmaWxlLCBlcnJGaWxlcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZiA9IGZpbGU7XHJcbiAgICAgICAgICAgIHNlbGYuZXJyRmlsZSA9IGVyckZpbGVzICYmIGVyckZpbGVzWzBdO1xyXG4gICAgICAgICAgICBpZihmaWxlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZm5hbWUgPSAnJztcclxuICAgICAgICAgICAgICAgIGlmKHNlbGYud29ya29yZGVyLmltYWdlX2ZpbGVuYW1lICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAmJiBzZWxmLndvcmtvcmRlci5pbWFnZV9maWxlbmFtZSAhPT0gbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgICYmIHNlbGYud29ya29yZGVyLmltYWdlX2ZpbGVuYW1lICE9PSAnbnVsbCdcclxuICAgICAgICAgICAgICAgICAgICAmJiBzZWxmLndvcmtvcmRlci5pbWFnZV9maWxlbmFtZSAhPT0gJycpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm5hbWUgPSBzZWxmLndvcmtvcmRlci5pbWFnZV9maWxlbmFtZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBVcGxvYWRTZXJ2aWNlLnVwbG9hZEZpbGUoZm5hbWUsIGZpbGUpLnRoZW4oZnVuY3Rpb24gKHJlc3ApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzcC5kYXRhLnN1Y2Nlc3MgPT0gMSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3N1Y2Nlc3NmdWwgdXBsb2FkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYud29ya29yZGVyLmltYWdlX2ZpbGVuYW1lID0gcmVzcC5kYXRhLmZpbGVuYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdTdWNjZXNzICcgKyByZXNwLmNvbmZpZy5kYXRhLmZpbGUubmFtZSArICd1cGxvYWRlZC4gUmVzcG9uc2U6ICcgKyByZXNwLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3ApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3Auc3RhdHVzID4gMClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZXJyb3JNc2cgPSByZXNwLnN0YXR1cyArICc6ICcgKyByZXNwLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBzdGF0dXM6ICcgKyByZXNwLnN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXZ0KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGUucHJvZ3Jlc3MgPSBNYXRoLm1pbigxMDAsIHBhcnNlSW50KDEwMC4wICogZXZ0LmxvYWRlZCAvIGV2dC50b3RhbCkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZVdvcmtPcmRlciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYud29ya29yZGVyLnB1dCgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IHVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLndvcmtvcmRlcnNcIik7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVXb3JrT3JkZXIgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLndvcmtvcmRlci5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC53b3Jrb3JkZXJzXCIpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgZGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2hvd0RlbGV0ZUNvbmZpcm0gPSBmdW5jdGlvbihldilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZXYsICdEZWxldGUgd29yayBvcmRlcj8nLCAnJyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZVdvcmtPcmRlcigpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdXb3JrT3JkZXJEZXRhaWxDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnJHNjb3BlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdVcGxvYWRTZXJ2aWNlJywgJ1Jlc3RTZXJ2aWNlJywgJ0RpYWxvZ1NlcnZpY2UnLCAnVmFsaWRhdGlvblNlcnZpY2UnLCAnJG1vbWVudCcsICckc3RhdGVQYXJhbXMnLCBXb3JrT3JkZXJEZXRhaWxDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFdvcmtPcmRlckNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCAkbW9tZW50KVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5zaG93Q29tcGxldGUgPSBmYWxzZTtcclxuICAgICAgICB2YXIgdG9kYXlzRGF0ZSA9ICRtb21lbnQoKTtcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsV29ya09yZGVycyhzZWxmKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coc2VsZik7XHJcblxyXG4gICAgICAgIHNlbGYuc2V0VXJnZW5jeSA9IGZ1bmN0aW9uKG9iakRhdGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyAzIGRheXMsIDcgZGF5cywgMzAgZGF5cywgdGhlIHJlc3RcclxuICAgICAgICAgICAgdmFyIGQgPSAkbW9tZW50KG9iakRhdGUpO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGQpO1xyXG4gICAgICAgICAgICB2YXIgZGF5RGlmZiA9IGQuZGlmZih0b2RheXNEYXRlLCAnZGF5cycpO1xyXG5cclxuICAgICAgICAgICAgaWYoZGF5RGlmZiA+IDMwKSAvLyBncmVlblxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJmYXJXb3JrT3JkZXJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKGRheURpZmYgPiA3ICYmIGRheURpZmYgPD0gMzApIC8vIGJsdWVcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiY2xvc2VXb3JrT3JkZXJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKGRheURpZmYgPiAzICYmIGRheURpZmYgPD0gNykgLy8gb3JhbmdlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImNsb3NlcldvcmtPcmRlclwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgLy8gcmVkXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImNsb3Nlc3RXb3JrT3JkZXJcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkLmRpZmYodG9kYXlzRGF0ZSwgJ2RheXMnKSk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYudG9nZ2xlQ29tcGxldGVPbmx5ID0gZnVuY3Rpb24oY2JTdGF0ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0b2dnbGUnKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coY2JTdGF0ZSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1dvcmtPcmRlckNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckbW9tZW50JywgV29ya09yZGVyQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
