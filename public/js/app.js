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
            .state('app.reports.aos', {
                url: '/aos',
                views: {
                    'main@': {
                        templateUrl: getView('report.aos'),
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
            .state('app.materialchecklist', {
                url: '/materialchecklist',
                views: {
                    'main@': {
                        templateUrl: getView('materialchecklist'),
                        controller: 'MaterialChecklistController',
                        controllerAs: 'ctrlMaterialChecklist'
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

            getFutureWorkOrders: function()
            {
                return Restangular.one('scheduler/getFutureWorkOrders').getList();
            },

            addCustomer: function(obj)
            {
                return Restangular.all('customer').post(obj);
            },

            addProduct: function(obj)
            {
                return Restangular.all('product').post(obj);
            },

            getAllBookings: function(start, end)
            {
                return Restangular.all('bookeddate').getList({ start: start, end: end});
            },

            addBooking: function(obj)
            {
                return Restangular.all('bookeddate').post(obj);
            },

            updateBooking: function(obj)
            {
                return obj.put();
            },

            deleteBooking: function(obj)
            {
                return obj.remove();
            },

            getAllSalesChannels: function()
            {
                return Restangular.all('saleschannel').getList();
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

    function BookedDateController($auth, $state, $scope, Restangular, $moment, RestService, DialogService)
    {
        var self = this;

        var eventSources = [];
        var workOrderEventSrc = { events: [], backgroundColor: 'blue', allDayDefault: true, editable: false };

        var bookedDateEvents = [];
        var bookedDateSrc = {
            events: function(start, end, tz, callback)
            {
                RestService.getAllBookings(start, end).then(function(data)
                {
                    //console.log(data);
                    var events = [];
                    for(var i = 0; i < data.length; i++)
                    {
                        //console.log(data[i]);
                        events.push({bdObj: data[i], title: data[i].notes, start: data[i].start_date, end: data[i].end_date});
                    }

                    callback(events);
                });
            }
            , backgroundColor: 'orange', allDayDefault: true, editable: true, eventStartEditable: true
        };

        RestService.getFutureWorkOrders().then(function(data)
        {
            //console.log(data);
            for(var i = 0; i < data.length; i++)
            {
                //console.log(data[i]);
                var oneWO = data[i];
                //console.log($moment(oneWO.start_date));
                workOrderEventSrc.events.push({
                    title: 'Work Order ' + oneWO.id,
                    start: $moment(oneWO.start_date).format(),
                    woObj: oneWO,
                    bookingType: 'workorder'
                });
            }
            eventSources.push(workOrderEventSrc);

            //bookedDateEvents.push({ title: 'test BOzzz', bookingType: 'bookedDate', start: $moment().format()});
            eventSources.push(bookedDateSrc);

            $('#calendar').fullCalendar({

                // put your options and callbacks here
                eventSources: eventSources,
                eventClick: function(calEvent, jsEvent, view)
                {
                    //console.log(calEvent);

                    if(calEvent.bookingType === 'workorder')
                    {
                        $scope.woObj = calEvent.woObj;

                        // Popup WO details (readonly)
                        DialogService.fromTemplate(null, 'dlgWorkOrderQuickView', $scope).then(
                            function ()
                            {
                                //console.log('confirmed');
                            }
                        );
                        //$state.go('app.workorders.detail', {'workOrderId': calEvent.work_order_id});
                    }
                    else
                    {
                        $scope.isEdit = true;
                        $scope.bdObj = calEvent.bdObj;
                        $scope.notes = calEvent.title;

                        // Booking Date (allow edit)
                        var dialogOptions =
                        {
                            templateUrl: '/views/dialogs/dlgAddBookingDate.html',
                            escapeToClose: true,
                            targetEvent: null,
                            controller: function DialogController($scope, $mdDialog)
                            {
                                $scope.confirmDialog = function ()
                                {
                                    $scope.bdObj.notes = $scope.notes;
                                    RestService.updateBooking($scope.bdObj).then(function()
                                    {
                                        $('#calendar').fullCalendar('refetchEvents');
                                    });
                                    $mdDialog.hide();
                                };

                                $scope.deleteBooking = function()
                                {
                                    RestService.deleteBooking($scope.bdObj).then(function()
                                    {
                                        $('#calendar').fullCalendar('refetchEvents');
                                    });
                                    $mdDialog.hide();
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
                    }
                },
                eventMouseover: function(event, jsEvent, view)
                {
                    $(this).css('cursor', 'pointer');
                },
                dayClick: function(date, jsEvent, view, resourceObj)
                {
                    date.local();
                    //console.log(date.local());
                    //console.log(date.toISOString());

                    $scope.isEdit = false;

                    var dialogOptions = {
                        templateUrl: '/views/dialogs/dlgAddBookingDate.html',
                        escapeToClose: true,
                        targetEvent: null,
                        controller: function DialogController($scope, $mdDialog)
                        {
                            $scope.confirmDialog = function ()
                            {
                                //console.log('accepted');

                                var eventObj = { notes: $scope.notes,
                                                start_date: date.toDate(),
                                                end_date: date.toDate()
                                            };

                                //console.log(eventObj);
                                RestService.addBooking(eventObj).then(function()
                                {
                                    //console.log('event added');
                                    $('#calendar').fullCalendar('refetchEvents');
                                });

                                //$('#calendar').fullCalendar('removeEventSource', bookedDateSrc);
                                //$('#calendar').fullCalendar('addEventSource', bookedDateSrc);

                                $mdDialog.hide();
                            };

                            $scope.cancelDialog = function()
                            {
                                //console.log('cancelled');
                                $mdDialog.hide();
                            };
                        },
                        scope: $scope.$new()
                    };

                    //console.log(dialogOptions);
                    DialogService.fromCustom(dialogOptions);
                },
                eventDrop: function(event, delta, revertFunc)
                {
                    console.log(event);

                    console.log(delta);
                    console.log(delta.days());

                    /*
                    if(delta.days() > 0)
                    {
                        event.start.add(delta.days());
                        event.end = event.start; //$moment(event.start).add(1, 'days');
                    }
                    else if(delta.days < 0)
                    {
                        event.start.subtract(delta.days());
                        event.end = event.start; //$moment(event.start).add(1, 'days');
                    }
console.log(event);
*/
                    event.bdObj.start_date = event.start;
                    event.bdObj.end_date = event.end === null ? event.start : event.end;

                    console.log(event.bdObj);

                    RestService.updateBooking(event.bdObj).then(function()
                    {
                        //console.log("date changed");
                        $('#calendar').fullCalendar('refetchEvents');
                    });
                },
                eventResize: function(event, delta, revertFunc)
                {
                    //console.log(event);
                    //console.log(delta);
                    /*
                    if(delta.days() > 0)
                    {
                        event.end.add(delta.days());
                    }
                    else if(delta.days < 0)
                    {
                        event.end.subtract(delta.days());
                    }
*/

                    event.bdObj.end_date = event.end;

                    //console.log(event.bdObj);

                    RestService.updateBooking(event.bdObj).then(function()
                    {
                        //console.log("date changed");
                        $('#calendar').fullCalendar('refetchEvents');
                    });
                }
            });

        });

    }

    angular.module('app.controllers').controller('BookedDateController', ['$auth', '$state', '$scope', 'Restangular', '$moment', 'RestService', 'DialogService', BookedDateController]);

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

    function MaterialChecklistController($auth, $state, Restangular, RestService)
    {
        var self = this;

        self.checklistmode = 'thisweek';
        self.checklist_products = [];

        RestService.getAllProducts(self);


        self.addProduct = function()
        {
            console.log(self.selectedProduct);

            if(self.checklist_products === undefined) { self.checklist_products = []; }

            self.checklist_products.push({
                product_id: self.selectedProduct.id,
                quantity: self.selectedQuantity,
                product: self.selectedProduct
            });

            self.selectedProduct = "";
            self.selectedQuantity = "";
        };

        self.deleteProduct = function(e, productId)
        {
            var indexToRemove;
            for(var i = 0; i < self.checklist_products.length; i++)
            {
                if(productId == self.checklist_products[i].product_id)
                {
                    indexToRemove = i;
                    break;
                }
            }

            self.checklist_products.splice(indexToRemove, 1);

            e.preventDefault();
        };

        self.generateChecklist = function()
        {
            var reportParams = {};
            reportParams.mode = self.checklistmode;

            switch(self.checklistmode)
            {
                case 'thisweek':
                    break;

                case 'date':
                    reportParams.start_date = self.start_date;
                    reportParams.end_date = self.end_date;
                    break;


                case 'products':
                    self.products = [];
                    for(var i = 0; i < self.checklist_products.length; i++)
                    {
                        var one = self.checklist_products[i];
                        self.products.push({id: one.product_id, quantity: one.quantity});
                    }
                    break;
            }

            Restangular.all('reports/getMaterialChecklist').post({ 'reportParams': reportParams}).then(function(data)
            {
                self.results = data;
                //console.log(self.results[0]);
            },
            function()
            {
                // Error
            });

            self.report = [];
        };

    }

    angular.module('app.controllers').controller('MaterialChecklistController', ['$auth', '$state', 'Restangular', 'RestService', MaterialChecklistController]);

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
        //RestService.getFullyBookedDays(self);

        RestService.getAllSalesChannels().then(function(data)
        {
            self.saleschannels = data;
        });

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
                console.log(d);
                //$state.go('app.products.detail', {'productId': d.newId});
                ToastService.show("Successfully created");
                if(d.newWoIds && d.newWoIds.length > 0)
                {
                    var linkObj = [];
                    linkObj.push({LinkText: 'View All POs', LinkUrl: $state.href('app.purchaseorders')});
                    linkObj.push({LinkText: 'View Created PO', LinkUrl: $state.href('app.purchaseorders.detail', {purchaseOrderId: d.newId})});
                    for(var i = 0; i < d.newWoIds.length; i++)
                    {
                        linkObj.push({LinkText: 'View WO #' + d.newWoIds[i], LinkUrl: $state.href('app.workorders.detail', {workOrderId: d.newWoIds[i]})});
                    }

                    $scope.linksToShow = linkObj;

                    DialogService.fromTemplate(null, 'dlgLinkChooser', $scope);
                }
                else
                {
                    $state.go('app.purchaseorders');
                }

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

        RestService.getAllSalesChannels().then(function(data)
        {
            self.saleschannels = data;
        });

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
            //getWorstSellingProducts(self);
            getOverduePurchaseOrders(self);
            getMonthlyIncome(self);
            getOutstandingPayments(self);

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

    }

    angular.module('app.controllers').controller('ReportController', ['$scope', '$auth', '$state', '$moment', 'Restangular', 'RestService', 'ChartService', ReportController]);

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHAuanMiLCJhcHAvcm91dGVzLmpzIiwiYXBwL2RpcmVjdGl2ZXMvYXBwTG9hZGluZy5qcyIsImFwcC9kaXJlY3RpdmVzL2ZvY3VzT24uanMiLCJhcHAvZGlyZWN0aXZlcy91dGMtcGFyc2VyLmRpcmVjdGl2ZS5qcyIsImFwcC9maWx0ZXJzL3RydW5jYXRlTmFtZS5qcyIsImFwcC9zZXJ2aWNlcy9hdXRoLmpzIiwiYXBwL3NlcnZpY2VzL2NoYXJ0LmpzIiwiYXBwL3NlcnZpY2VzL2RpYWxvZy5qcyIsImFwcC9zZXJ2aWNlcy9mb2N1cy5qcyIsImFwcC9zZXJ2aWNlcy9ndWlkLmpzIiwiYXBwL3NlcnZpY2VzL3Jlc3QuanMiLCJhcHAvc2VydmljZXMvdG9hc3QuanMiLCJhcHAvc2VydmljZXMvdXBsb2FkLmpzIiwiYXBwL3NlcnZpY2VzL3ZhbGlkYXRpb24uanMiLCJhcHAvY29udHJvbGxlcnMvYm9va2VkZGF0ZXMvYm9va2VkZGF0ZXMuanMiLCJhcHAvY29udHJvbGxlcnMvY29yZS9jb3JlLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2N1c3RvbWVycy9jdXN0b21lci5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvY3VzdG9tZXJzL2N1c3RvbWVyLmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy9jdXN0b21lcnMvY3VzdG9tZXJzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2V2ZW50cy9ldmVudC5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvZXZlbnRzL2V2ZW50LmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy9ldmVudHMvZXZlbnRzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2Zvb3Rlci9mb290ZXIuanMiLCJhcHAvY29udHJvbGxlcnMvaGVhZGVyL2hlYWRlci5qcyIsImFwcC9jb250cm9sbGVycy9sYW5kaW5nL2xhbmRpbmcuanMiLCJhcHAvY29udHJvbGxlcnMvbG9naW4vbG9naW4uanMiLCJhcHAvY29udHJvbGxlcnMvbWF0ZXJpYWxzL21hdGVyaWFsLmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy9tYXRlcmlhbHMvbWF0ZXJpYWwuZGV0YWlsLmpzIiwiYXBwL2NvbnRyb2xsZXJzL21hdGVyaWFscy9tYXRlcmlhbHMuanMiLCJhcHAvY29udHJvbGxlcnMvbWF0ZXJpYWxzZXRzL21hdGVyaWFsc2V0cy5qcyIsImFwcC9jb250cm9sbGVycy9tYXRlcmlhbF9jaGVja2xpc3QvbWF0ZXJpYWxfY2hlY2tsaXN0LmpzIiwiYXBwL2NvbnRyb2xsZXJzL3BheW1lbnRfdHlwZXMvcGF5bWVudHR5cGUuY3JlYXRlLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3BheW1lbnRfdHlwZXMvcGF5bWVudHR5cGUuZGV0YWlsLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3BheW1lbnRfdHlwZXMvcGF5bWVudHR5cGVzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3Byb2R1Y3RzL3Byb2R1Y3QuY3JlYXRlLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3Byb2R1Y3RzL3Byb2R1Y3QuZGV0YWlsLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3Byb2R1Y3RzL3Byb2R1Y3RzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3B1cmNoYXNlb3JkZXJzL3B1cmNoYXNlb3JkZXIuY3JlYXRlLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3B1cmNoYXNlb3JkZXJzL3B1cmNoYXNlb3JkZXIuZGV0YWlsLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3B1cmNoYXNlb3JkZXJzL3B1cmNoYXNlb3JkZXJzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3JlcG9ydHMvcmVwb3J0cy5qcyIsImFwcC9jb250cm9sbGVycy9zZWFyY2gvc2VhcmNoLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3VuaXRzL3VuaXQuY3JlYXRlLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3VuaXRzL3VuaXQuZGV0YWlsLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3VuaXRzL3VuaXRzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3dvcmtvcmRlcnMvd29ya29yZGVyLmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy93b3Jrb3JkZXJzL3dvcmtvcmRlci5kZXRhaWwuanMiLCJhcHAvY29udHJvbGxlcnMvd29ya29yZGVycy93b3Jrb3JkZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsVUFBQTtJQUNBOztJQUVBLElBQUEsTUFBQSxRQUFBLE9BQUE7UUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtXQUNBLFNBQUE7UUFDQTtZQUNBLHFCQUFBOzs7SUFHQSxRQUFBLE9BQUEsZ0JBQUEsQ0FBQSxhQUFBLGNBQUEsZUFBQSxvQkFBQSxjQUFBO0lBQ0EsUUFBQSxPQUFBLGNBQUEsQ0FBQSxhQUFBO0lBQ0EsUUFBQSxPQUFBLG1CQUFBLENBQUEsYUFBQSxjQUFBLGVBQUEsb0JBQUEsZ0JBQUEsY0FBQSxhQUFBLGlCQUFBLGlCQUFBO0lBQ0EsUUFBQSxPQUFBLGVBQUE7O0lBRUEsUUFBQSxPQUFBLGtCQUFBLENBQUEsb0JBQUE7SUFDQSxRQUFBLE9BQUEsY0FBQTs7Ozs7O0lBTUEsUUFBQSxPQUFBLGNBQUEseUJBQUEsVUFBQTtJQUNBOzs7UUFHQSxjQUFBLFdBQUE7OztJQUdBLFFBQUEsT0FBQSxjQUFBLDJCQUFBLFVBQUE7SUFDQTtRQUNBO2FBQ0EsYUFBQTthQUNBLFVBQUE7OztJQUdBLFFBQUEsT0FBQSxjQUFBLGdDQUFBLFNBQUEscUJBQUE7UUFDQTthQUNBLFdBQUE7YUFDQSxrQkFBQSxFQUFBLFFBQUE7OztJQUdBLFFBQUEsT0FBQSxjQUFBLCtCQUFBLFNBQUEsb0JBQUE7OztRQUdBLElBQUEsZ0JBQUEsbUJBQUEsY0FBQTtRQUNBO1lBQ0Esd0JBQUE7WUFDQSxzQkFBQSxDQUFBO1lBQ0EsTUFBQTs7O1FBR0EsbUJBQUEsY0FBQSxjQUFBO1FBQ0EsbUJBQUEsTUFBQTthQUNBLGVBQUE7WUFDQTtnQkFDQSxXQUFBO2dCQUNBLFNBQUE7O2FBRUEsY0FBQTs7OztJQUlBLFFBQUEsT0FBQSxjQUFBLGlDQUFBLFNBQUE7SUFDQTtRQUNBLHNCQUFBLGFBQUEsU0FBQTtRQUNBO1lBQ0EsR0FBQSxTQUFBO1lBQ0E7Z0JBQ0EsT0FBQSxPQUFBLE1BQUEsT0FBQTs7O1lBR0EsT0FBQTs7Ozs7SUFLQSxJQUFBLElBQUEsQ0FBQSxjQUFBLGFBQUEsVUFBQSxlQUFBLFVBQUEsWUFBQSxXQUFBLFFBQUEsYUFBQTs7UUFFQSxXQUFBLElBQUEscUJBQUEsVUFBQSxPQUFBLFNBQUEsVUFBQSxXQUFBLFlBQUE7UUFDQTs7O1lBR0EsR0FBQSxRQUFBLFNBQUE7WUFDQTtnQkFDQSxHQUFBLENBQUEsWUFBQTtnQkFDQTtvQkFDQSxRQUFBLElBQUE7b0JBQ0EsTUFBQTtvQkFDQSxPQUFBLEdBQUE7Ozs7Ozs7QUMvRkEsQ0FBQTtBQUNBO0lBQ0E7SUFDQSxRQUFBLE9BQUEsY0FBQSxrRUFBQSxTQUFBLGdCQUFBLG9CQUFBLGdCQUFBOztRQUVBLElBQUEsVUFBQSxVQUFBLFVBQUE7WUFDQSxPQUFBLGdCQUFBLFdBQUE7OztRQUdBLG1CQUFBLFVBQUE7OztRQUdBO2FBQ0EsTUFBQSxPQUFBO2dCQUNBLFVBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxRQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7O29CQUVBLFFBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7b0JBRUEsTUFBQTs7O2FBR0EsTUFBQSxhQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLGVBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsZ0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsdUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsdUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsaUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsd0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsd0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsa0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEseUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEseUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsY0FBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxxQkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxxQkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxlQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLDRCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLHFCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLDRCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLDZCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLHFDQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLDhCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLG1CQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLGFBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsb0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsb0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsaUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsd0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsd0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsc0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsNkJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsNkJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsb0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsMkJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsMkJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsZUFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7Ozs7YUFJQSxNQUFBLG9CQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLG1CQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLHlCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7Ozs7OztBQ25aQTs7QUFFQSxRQUFBLE9BQUEsa0JBQUEsVUFBQSw0QkFBQSxVQUFBO0FBQ0E7O0lBRUEsT0FBQTtRQUNBLE1BQUE7UUFDQSxVQUFBOzs7SUFHQSxTQUFBLE1BQUEsT0FBQSxTQUFBO0lBQ0E7Ozs7Ozs7UUFPQSxTQUFBLE9BQUEsUUFBQSxXQUFBLElBQUEsTUFBQTtZQUNBLFNBQUE7WUFDQTs7Z0JBRUEsUUFBQTs7O2dCQUdBLFFBQUEsVUFBQSxhQUFBOzs7Ozs7Ozs7O0FDckJBOztBQUVBLFFBQUEsT0FBQSxrQkFBQSxVQUFBLFdBQUE7QUFDQTtJQUNBLE9BQUEsU0FBQSxPQUFBLE1BQUE7SUFDQTtRQUNBLFFBQUEsSUFBQSxLQUFBOztRQUVBLE1BQUEsSUFBQSxXQUFBLFNBQUEsR0FBQTtRQUNBOztBQUVBLFFBQUEsSUFBQSxZQUFBO1lBQ0EsR0FBQSxTQUFBLEtBQUE7WUFDQTtnQkFDQSxRQUFBLElBQUE7Z0JBQ0EsS0FBQSxHQUFBOzs7OztBQ25CQTs7QUFFQSxRQUFBLE9BQUE7S0FDQSxVQUFBLGFBQUE7SUFDQTtRQUNBLFNBQUEsS0FBQSxPQUFBLFNBQUEsT0FBQSxTQUFBOzs7O1lBSUEsSUFBQSxTQUFBLFVBQUEsS0FBQTtnQkFDQSxNQUFBLE9BQUEsSUFBQSxLQUFBO2dCQUNBLE9BQUE7OztZQUdBLElBQUEsWUFBQSxVQUFBLEtBQUE7Z0JBQ0EsSUFBQSxDQUFBLEtBQUE7b0JBQ0EsT0FBQTs7Z0JBRUEsTUFBQSxJQUFBLEtBQUE7Z0JBQ0EsT0FBQTs7O1lBR0EsUUFBQSxTQUFBLFFBQUE7WUFDQSxRQUFBLFlBQUEsUUFBQTs7O1FBR0EsT0FBQTtZQUNBLFNBQUE7WUFDQSxNQUFBO1lBQ0EsVUFBQTs7O0FDN0JBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxlQUFBLE9BQUEsZ0JBQUE7SUFDQTtRQUNBLE9BQUEsU0FBQSxPQUFBO1FBQ0E7WUFDQSxRQUFBLFNBQUE7WUFDQSxJQUFBLE1BQUE7O1lBRUEsR0FBQSxNQUFBLFNBQUE7WUFDQTtnQkFDQSxNQUFBLE1BQUEsT0FBQSxHQUFBLGFBQUE7OztZQUdBO2dCQUNBLE1BQUE7OztZQUdBLE9BQUE7Ozs7Ozs7OztBQ2hCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxlQUFBLENBQUEsU0FBQSxVQUFBLFNBQUEsT0FBQSxRQUFBOztRQUVBLE9BQUE7O1lBRUEsT0FBQSxTQUFBLE9BQUE7WUFDQTtnQkFDQSxJQUFBLGNBQUEsRUFBQSxPQUFBLE9BQUEsVUFBQTs7Ozs7Z0JBS0EsT0FBQSxNQUFBLE1BQUE7OztZQUdBLGlCQUFBO1lBQ0E7Z0JBQ0EsT0FBQSxNQUFBOzs7WUFHQSxRQUFBO1lBQ0E7Z0JBQ0EsTUFBQTs7Ozs7Ozs7Ozs7QUN2QkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsZ0JBQUEsQ0FBQSxTQUFBLGVBQUEsV0FBQSxTQUFBLE9BQUEsYUFBQSxRQUFBOztRQUVBLElBQUEsWUFBQTtZQUNBLFNBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxNQUFBOztnQkFFQTtnQkFDQTtvQkFDQTtvQkFDQTt3QkFDQSxrQkFBQTt3QkFDQSxRQUFBO3dCQUNBO3dCQUNBOzRCQUNBLFNBQUE7O3dCQUVBLGNBQUE7Ozs7WUFJQTtZQUNBOzs7WUFHQSxTQUFBO1lBQ0E7WUFDQTtnQkFDQSxPQUFBO2dCQUNBLFFBQUE7Ozs7O1FBS0EsT0FBQTs7WUFFQSx1QkFBQSxTQUFBO1lBQ0E7O2dCQUVBLE1BQUEsY0FBQTtvQkFDQSxTQUFBO3dCQUNBLE9BQUE7NEJBQ0EsTUFBQTs7d0JBRUE7d0JBQ0E7NEJBQ0EsS0FBQTs0QkFDQTs0QkFDQTtnQ0FDQSxNQUFBOzs7d0JBR0E7d0JBQ0E7NEJBQ0EsTUFBQTs0QkFDQTs0QkFDQTtnQ0FDQSxPQUFBO2dDQUNBLE1BQUE7OzRCQUVBOzRCQUNBO2dDQUNBLE1BQUE7Ozt3QkFHQTt3QkFDQTs7Ozs7b0JBS0EsT0FBQTt3QkFDQSxNQUFBOzs7b0JBR0EsU0FBQTs7O2dCQUdBLFlBQUEsSUFBQSxpQ0FBQSxLQUFBLEVBQUEsZ0JBQUEsS0FBQSxLQUFBLFNBQUE7Z0JBQ0E7b0JBQ0EsSUFBQSxVQUFBO29CQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLFFBQUE7b0JBQ0E7d0JBQ0EsSUFBQSxlQUFBLEtBQUE7O3dCQUVBLFFBQUEsS0FBQSxDQUFBLEtBQUEsSUFBQSxTQUFBLGFBQUEsT0FBQSxTQUFBLGFBQUEsU0FBQSxJQUFBLFNBQUEsYUFBQTs7O29CQUdBLE1BQUEsWUFBQSxTQUFBLENBQUEsQ0FBQSxNQUFBLG9CQUFBLE1BQUE7O29CQUVBLE1BQUEsWUFBQSxVQUFBOzs7Z0JBR0E7Z0JBQ0E7Ozs7O1lBS0Esd0JBQUEsU0FBQTtZQUNBOztnQkFFQSxNQUFBLGNBQUE7b0JBQ0EsU0FBQTt3QkFDQSxPQUFBOzRCQUNBLE1BQUE7O3dCQUVBO3dCQUNBOzRCQUNBLEtBQUE7NEJBQ0E7NEJBQ0E7Z0NBQ0EsTUFBQTs7O3dCQUdBO3dCQUNBOzRCQUNBLE1BQUE7NEJBQ0E7NEJBQ0E7Z0NBQ0EsT0FBQTtnQ0FDQSxNQUFBOzs0QkFFQTs0QkFDQTtnQ0FDQSxNQUFBOzs7d0JBR0E7d0JBQ0E7Ozs7O29CQUtBLE9BQUE7d0JBQ0EsTUFBQTs7O29CQUdBLFNBQUE7OztnQkFHQSxZQUFBLElBQUEsaUNBQUEsS0FBQSxFQUFBLGdCQUFBLEtBQUEsS0FBQSxTQUFBO29CQUNBO3dCQUNBLElBQUEsVUFBQTt3QkFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxRQUFBO3dCQUNBOzRCQUNBLElBQUEsZUFBQSxLQUFBOzs0QkFFQSxRQUFBLEtBQUEsQ0FBQSxLQUFBLElBQUEsU0FBQSxhQUFBLE9BQUEsU0FBQSxhQUFBLFNBQUEsSUFBQSxXQUFBLGFBQUE7Ozt3QkFHQSxNQUFBLFlBQUEsU0FBQSxDQUFBLENBQUEsTUFBQSxxQkFBQSxNQUFBOzt3QkFFQSxNQUFBLFlBQUEsVUFBQTs7O29CQUdBO29CQUNBOzs7OztZQUtBLHVCQUFBLFNBQUEsT0FBQTtZQUNBO2dCQUNBLFFBQUEsSUFBQTtnQkFDQSxNQUFBLHdCQUFBO2dCQUNBLE1BQUEsd0JBQUEsT0FBQSxPQUFBLE1BQUEsSUFBQTs7O2dCQUdBLFlBQUEsSUFBQSxpQ0FBQSxNQUFBLEtBQUEsU0FBQTtnQkFDQTtvQkFDQSxJQUFBLFVBQUE7b0JBQ0EsSUFBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsUUFBQTtvQkFDQTt3QkFDQSxJQUFBLGVBQUEsS0FBQTs7d0JBRUEsUUFBQSxLQUFBOzRCQUNBLE1BQUEsYUFBQTs0QkFDQSxVQUFBLENBQUEsTUFBQSxLQUFBLE9BQUE7NEJBQ0EsUUFBQSxDQUFBLE1BQUEsS0FBQSxPQUFBOzRCQUNBLEdBQUEsU0FBQSxhQUFBOzs7O29CQUlBLE1BQUEsc0JBQUEsU0FBQSxDQUFBLENBQUEsTUFBQSxRQUFBLE1BQUE7b0JBQ0EsTUFBQSxzQkFBQSxNQUFBLE9BQUE7b0JBQ0EsTUFBQSxzQkFBQSxVQUFBOzs7Z0JBR0E7Z0JBQ0E7Ozs7O1lBS0EsMEJBQUEsU0FBQTtZQUNBO2dCQUNBLE1BQUEsa0NBQUE7b0JBQ0EsU0FBQTt3QkFDQSxPQUFBOzRCQUNBLE1BQUE7O3dCQUVBLFFBQUE7NEJBQ0EsU0FBQTs7d0JBRUE7d0JBQ0E7NEJBQ0EsTUFBQTs7d0JBRUE7d0JBQ0E7NEJBQ0EsS0FBQTs0QkFDQSxPQUFBO2dDQUNBLE1BQUE7Ozs7O29CQUtBLE9BQUE7d0JBQ0EsTUFBQTs7O29CQUdBLFNBQUE7Ozs7Z0JBSUEsWUFBQSxJQUFBLG9DQUFBLE1BQUEsS0FBQSxTQUFBO29CQUNBO3dCQUNBLElBQUEsVUFBQTt3QkFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxRQUFBO3dCQUNBOzRCQUNBLElBQUEsZUFBQSxLQUFBOzs0QkFFQSxHQUFBLGFBQUEsT0FBQTs0QkFDQTtnQ0FDQSxJQUFBLFNBQUEsYUFBQSxRQUFBLGFBQUE7Z0NBQ0EsSUFBQSxpQkFBQSxTQUFBLGFBQUEsT0FBQTs7Ozs7Z0NBS0EsUUFBQSxLQUFBLENBQUEsYUFBQSxNQUFBLFNBQUEsY0FBQSxRQUFBOzs7O3dCQUlBLFFBQUEsS0FBQSxTQUFBLEdBQUEsR0FBQTs0QkFDQSxPQUFBLFNBQUEsRUFBQSxNQUFBLFNBQUEsRUFBQTs7O3dCQUdBLFFBQUEsSUFBQTs7d0JBRUEsTUFBQSxnQ0FBQSxTQUFBLENBQUEsQ0FBQSxNQUFBLFlBQUEsTUFBQTt3QkFDQSxNQUFBLGdDQUFBLFVBQUE7OztvQkFHQTtvQkFDQTs7Ozs7Ozs7Ozs7O0FDblFBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLCtCQUFBLFVBQUEsV0FBQTs7UUFFQSxPQUFBOztZQUVBLFlBQUEsU0FBQTtZQUNBO2dCQUNBLE9BQUEsVUFBQSxLQUFBOzs7WUFHQSxjQUFBLFNBQUEsSUFBQSxVQUFBLFFBQUE7Z0JBQ0EsSUFBQSxVQUFBO29CQUNBLGFBQUEsb0JBQUEsV0FBQTtvQkFDQSxlQUFBO29CQUNBLFlBQUEsU0FBQSxpQkFBQSxRQUFBO29CQUNBO3dCQUNBLE9BQUEsZ0JBQUEsWUFBQTs0QkFDQSxVQUFBOzs7d0JBR0EsT0FBQSxlQUFBO3dCQUNBOzRCQUNBLFVBQUE7Ozs7O2dCQUtBLEdBQUEsT0FBQTtnQkFDQTtvQkFDQSxRQUFBLGNBQUE7OztnQkFHQSxLQUFBO2dCQUNBOztvQkFFQSxRQUFBLFFBQUEsTUFBQTs7OztnQkFJQSxPQUFBLFVBQUEsS0FBQTs7O1lBR0EsTUFBQSxVQUFBO2dCQUNBLE9BQUEsVUFBQTs7O1lBR0EsT0FBQSxTQUFBLE9BQUEsUUFBQTtnQkFDQSxVQUFBO29CQUNBLFVBQUE7eUJBQ0EsTUFBQTt5QkFDQSxRQUFBO3lCQUNBLEdBQUE7Ozs7WUFJQSxTQUFBLFNBQUEsT0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsSUFBQSxVQUFBLFVBQUE7cUJBQ0EsTUFBQTtxQkFDQSxZQUFBO3FCQUNBLFVBQUE7cUJBQ0EsWUFBQTtxQkFDQSxHQUFBO3FCQUNBLE9BQUE7O2dCQUVBLE9BQUEsVUFBQSxLQUFBOzs7Ozs7O0FDdEVBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLGdCQUFBLENBQUEsY0FBQSxZQUFBLFNBQUEsWUFBQTtJQUNBO1FBQ0EsT0FBQSxTQUFBO1FBQ0E7WUFDQSxPQUFBLFNBQUE7WUFDQTtnQkFDQSxPQUFBLFdBQUEsV0FBQSxXQUFBO2NBQ0E7Ozs7Ozs7QUNSQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxlQUFBLENBQUEsV0FBQTs7UUFFQSxTQUFBO1FBQ0E7WUFDQSxPQUFBLEtBQUEsTUFBQSxDQUFBLElBQUEsS0FBQSxZQUFBO2lCQUNBLFNBQUE7aUJBQ0EsVUFBQTs7O1FBR0EsT0FBQTs7WUFFQSxTQUFBO1lBQ0E7Z0JBQ0EsT0FBQSxPQUFBLE9BQUEsTUFBQSxPQUFBLE1BQUEsT0FBQTtvQkFDQSxPQUFBLE1BQUEsT0FBQSxPQUFBOzs7Ozs7Ozs7OztBQ2hCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxlQUFBLENBQUEsU0FBQSxlQUFBLFdBQUEsU0FBQSxPQUFBLGFBQUEsUUFBQTs7UUFFQSxJQUFBLGVBQUEsWUFBQSxJQUFBOztRQUVBLE9BQUE7O1lBRUEsZ0JBQUEsU0FBQTtZQUNBO2dCQUNBLGFBQUEsVUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsV0FBQTs7OztZQUlBLFlBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLFdBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtnQkFDQTs7O29CQUdBLEtBQUEsWUFBQSxTQUFBLEtBQUE7b0JBQ0EsTUFBQSxVQUFBOzs7O1lBSUEsaUJBQUEsU0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxZQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBOztvQkFFQSxNQUFBLFlBQUE7Ozs7WUFJQSxhQUFBLFNBQUEsT0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxZQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsV0FBQTs7OztZQUlBLGtCQUFBLFNBQUE7WUFDQTtnQkFDQSxZQUFBLElBQUEsYUFBQSxVQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxhQUFBOzs7Ozs7WUFNQSxjQUFBLFNBQUEsT0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxhQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7Ozs7b0JBSUEsS0FBQSxhQUFBLFFBQUEsS0FBQTtvQkFDQSxLQUFBLFdBQUEsUUFBQSxLQUFBOzs7b0JBR0EsS0FBQSxZQUFBLFNBQUEsS0FBQTs7b0JBRUEsS0FBQSxZQUFBOzs7b0JBR0EsTUFBQSxZQUFBOzs7O1lBSUEsY0FBQSxTQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLFNBQUEsVUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsU0FBQTs7OztZQUlBLFVBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLFNBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxRQUFBOzs7O1lBSUEsYUFBQSxTQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLFFBQUEsVUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsUUFBQTs7OztZQUlBLFNBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLFFBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxPQUFBOzs7O1lBSUEsaUJBQUEsU0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxZQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBOztvQkFFQSxNQUFBLFlBQUE7Ozs7WUFJQSxhQUFBLFNBQUEsT0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxZQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsV0FBQTs7OztZQUlBLFVBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsUUFBQSxJQUFBLG1CQUFBOztnQkFFQSxZQUFBLElBQUEsVUFBQSxPQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBOzs7Ozs7WUFNQSxzQkFBQSxTQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLGlCQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBOztvQkFFQSxNQUFBLGlCQUFBOzs7O1lBSUEsa0JBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLGlCQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7Ozs7b0JBSUEsS0FBQSxjQUFBLFFBQUEsS0FBQTs7O29CQUdBLEtBQUEsWUFBQSxTQUFBLEtBQUE7b0JBQ0EsS0FBQSxPQUFBLFNBQUEsS0FBQTs7b0JBRUEsTUFBQSxnQkFBQTs7OztZQUlBLG9CQUFBLFNBQUE7WUFDQTtnQkFDQSxZQUFBLElBQUEsZUFBQSxVQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxlQUFBOzs7O1lBSUEsZ0JBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLGVBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxjQUFBOzs7O1lBSUEscUJBQUEsU0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxnQkFBQSxVQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxnQkFBQTs7OztZQUlBLG9CQUFBLFNBQUE7WUFDQTtnQkFDQSxZQUFBLElBQUEsZ0NBQUEsVUFBQSxLQUFBLFNBQUE7Z0JBQ0E7b0JBQ0EsTUFBQSxhQUFBOzs7OztZQUtBLHFCQUFBO1lBQ0E7Z0JBQ0EsT0FBQSxZQUFBLElBQUEsaUNBQUE7OztZQUdBLGFBQUEsU0FBQTtZQUNBO2dCQUNBLE9BQUEsWUFBQSxJQUFBLFlBQUEsS0FBQTs7O1lBR0EsWUFBQSxTQUFBO1lBQ0E7Z0JBQ0EsT0FBQSxZQUFBLElBQUEsV0FBQSxLQUFBOzs7WUFHQSxnQkFBQSxTQUFBLE9BQUE7WUFDQTtnQkFDQSxPQUFBLFlBQUEsSUFBQSxjQUFBLFFBQUEsRUFBQSxPQUFBLE9BQUEsS0FBQTs7O1lBR0EsWUFBQSxTQUFBO1lBQ0E7Z0JBQ0EsT0FBQSxZQUFBLElBQUEsY0FBQSxLQUFBOzs7WUFHQSxlQUFBLFNBQUE7WUFDQTtnQkFDQSxPQUFBLElBQUE7OztZQUdBLGVBQUEsU0FBQTtZQUNBO2dCQUNBLE9BQUEsSUFBQTs7O1lBR0EscUJBQUE7WUFDQTtnQkFDQSxPQUFBLFlBQUEsSUFBQSxnQkFBQTs7Ozs7Ozs7OztBQ2xQQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSw2QkFBQSxVQUFBLFVBQUE7O1FBRUEsSUFBQSxRQUFBO1lBQ0EsV0FBQTtZQUNBLFNBQUE7O1FBRUEsT0FBQTtZQUNBLE1BQUEsU0FBQSxTQUFBO2dCQUNBLE9BQUEsU0FBQTtvQkFDQSxTQUFBO3lCQUNBLFFBQUE7eUJBQ0EsU0FBQTt5QkFDQSxPQUFBO3lCQUNBLFVBQUE7Ozs7OztBQ3BCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxpQkFBQSxDQUFBLFVBQUEsU0FBQSxRQUFBOztRQUVBLE9BQUE7O1lBRUEsWUFBQSxVQUFBLFVBQUE7WUFDQTtnQkFDQSxJQUFBLFVBQUEsQ0FBQSxNQUFBO2dCQUNBLEdBQUEsYUFBQSxJQUFBLEVBQUEsUUFBQSxXQUFBOztnQkFFQSxPQUFBLE9BQUEsT0FBQTtvQkFDQSxLQUFBO29CQUNBLE1BQUE7Ozs7WUFJQSxZQUFBLFNBQUE7WUFDQTtnQkFDQSxJQUFBLFVBQUEsQ0FBQSxVQUFBOztnQkFFQSxPQUFBLE9BQUEsT0FBQTtvQkFDQSxLQUFBO29CQUNBLE1BQUE7Ozs7Ozs7Ozs7Ozs7QUNyQkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEscUJBQUEsQ0FBQSxXQUFBOztRQUVBLE9BQUE7O1lBRUEsY0FBQTtZQUNBO2dCQUNBLE9BQUE7OztZQUdBLGNBQUE7WUFDQTtnQkFDQSxPQUFBOzs7Ozs7O0FDakJBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEscUJBQUEsT0FBQSxRQUFBLFFBQUEsYUFBQSxTQUFBLGFBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTs7UUFFQSxJQUFBLGVBQUE7UUFDQSxJQUFBLG9CQUFBLEVBQUEsUUFBQSxJQUFBLGlCQUFBLFFBQUEsZUFBQSxNQUFBLFVBQUE7O1FBRUEsSUFBQSxtQkFBQTtRQUNBLElBQUEsZ0JBQUE7WUFDQSxRQUFBLFNBQUEsT0FBQSxLQUFBLElBQUE7WUFDQTtnQkFDQSxZQUFBLGVBQUEsT0FBQSxLQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsSUFBQSxTQUFBO29CQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLFFBQUE7b0JBQ0E7O3dCQUVBLE9BQUEsS0FBQSxDQUFBLE9BQUEsS0FBQSxJQUFBLE9BQUEsS0FBQSxHQUFBLE9BQUEsT0FBQSxLQUFBLEdBQUEsWUFBQSxLQUFBLEtBQUEsR0FBQTs7O29CQUdBLFNBQUE7OztjQUdBLGlCQUFBLFVBQUEsZUFBQSxNQUFBLFVBQUEsTUFBQSxvQkFBQTs7O1FBR0EsWUFBQSxzQkFBQSxLQUFBLFNBQUE7UUFDQTs7WUFFQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxRQUFBO1lBQ0E7O2dCQUVBLElBQUEsUUFBQSxLQUFBOztnQkFFQSxrQkFBQSxPQUFBLEtBQUE7b0JBQ0EsT0FBQSxnQkFBQSxNQUFBO29CQUNBLE9BQUEsUUFBQSxNQUFBLFlBQUE7b0JBQ0EsT0FBQTtvQkFDQSxhQUFBOzs7WUFHQSxhQUFBLEtBQUE7OztZQUdBLGFBQUEsS0FBQTs7WUFFQSxFQUFBLGFBQUEsYUFBQTs7O2dCQUdBLGNBQUE7Z0JBQ0EsWUFBQSxTQUFBLFVBQUEsU0FBQTtnQkFDQTs7O29CQUdBLEdBQUEsU0FBQSxnQkFBQTtvQkFDQTt3QkFDQSxPQUFBLFFBQUEsU0FBQTs7O3dCQUdBLGNBQUEsYUFBQSxNQUFBLHlCQUFBLFFBQUE7NEJBQ0E7NEJBQ0E7Ozs7Ozs7b0JBT0E7d0JBQ0EsT0FBQSxTQUFBO3dCQUNBLE9BQUEsUUFBQSxTQUFBO3dCQUNBLE9BQUEsUUFBQSxTQUFBOzs7d0JBR0EsSUFBQTt3QkFDQTs0QkFDQSxhQUFBOzRCQUNBLGVBQUE7NEJBQ0EsYUFBQTs0QkFDQSxZQUFBLFNBQUEsaUJBQUEsUUFBQTs0QkFDQTtnQ0FDQSxPQUFBLGdCQUFBO2dDQUNBO29DQUNBLE9BQUEsTUFBQSxRQUFBLE9BQUE7b0NBQ0EsWUFBQSxjQUFBLE9BQUEsT0FBQSxLQUFBO29DQUNBO3dDQUNBLEVBQUEsYUFBQSxhQUFBOztvQ0FFQSxVQUFBOzs7Z0NBR0EsT0FBQSxnQkFBQTtnQ0FDQTtvQ0FDQSxZQUFBLGNBQUEsT0FBQSxPQUFBLEtBQUE7b0NBQ0E7d0NBQ0EsRUFBQSxhQUFBLGFBQUE7O29DQUVBLFVBQUE7OztnQ0FHQSxPQUFBLGVBQUE7Z0NBQ0E7O29DQUVBLFVBQUE7Ozs0QkFHQSxPQUFBLE9BQUE7O3dCQUVBLGNBQUEsV0FBQTs7O2dCQUdBLGdCQUFBLFNBQUEsT0FBQSxTQUFBO2dCQUNBO29CQUNBLEVBQUEsTUFBQSxJQUFBLFVBQUE7O2dCQUVBLFVBQUEsU0FBQSxNQUFBLFNBQUEsTUFBQTtnQkFDQTtvQkFDQSxLQUFBOzs7O29CQUlBLE9BQUEsU0FBQTs7b0JBRUEsSUFBQSxnQkFBQTt3QkFDQSxhQUFBO3dCQUNBLGVBQUE7d0JBQ0EsYUFBQTt3QkFDQSxZQUFBLFNBQUEsaUJBQUEsUUFBQTt3QkFDQTs0QkFDQSxPQUFBLGdCQUFBOzRCQUNBOzs7Z0NBR0EsSUFBQSxXQUFBLEVBQUEsT0FBQSxPQUFBO2dEQUNBLFlBQUEsS0FBQTtnREFDQSxVQUFBLEtBQUE7Ozs7Z0NBSUEsWUFBQSxXQUFBLFVBQUEsS0FBQTtnQ0FDQTs7b0NBRUEsRUFBQSxhQUFBLGFBQUE7Ozs7OztnQ0FNQSxVQUFBOzs7NEJBR0EsT0FBQSxlQUFBOzRCQUNBOztnQ0FFQSxVQUFBOzs7d0JBR0EsT0FBQSxPQUFBOzs7O29CQUlBLGNBQUEsV0FBQTs7Z0JBRUEsV0FBQSxTQUFBLE9BQUEsT0FBQTtnQkFDQTtvQkFDQSxRQUFBLElBQUE7O29CQUVBLFFBQUEsSUFBQTtvQkFDQSxRQUFBLElBQUEsTUFBQTs7Ozs7Ozs7Ozs7Ozs7O29CQWVBLE1BQUEsTUFBQSxhQUFBLE1BQUE7b0JBQ0EsTUFBQSxNQUFBLFdBQUEsTUFBQSxRQUFBLE9BQUEsTUFBQSxRQUFBLE1BQUE7O29CQUVBLFFBQUEsSUFBQSxNQUFBOztvQkFFQSxZQUFBLGNBQUEsTUFBQSxPQUFBLEtBQUE7b0JBQ0E7O3dCQUVBLEVBQUEsYUFBQSxhQUFBOzs7Z0JBR0EsYUFBQSxTQUFBLE9BQUEsT0FBQTtnQkFDQTs7Ozs7Ozs7Ozs7Ozs7b0JBY0EsTUFBQSxNQUFBLFdBQUEsTUFBQTs7OztvQkFJQSxZQUFBLGNBQUEsTUFBQSxPQUFBLEtBQUE7b0JBQ0E7O3dCQUVBLEVBQUEsYUFBQSxhQUFBOzs7Ozs7Ozs7SUFTQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx3QkFBQSxDQUFBLFNBQUEsVUFBQSxVQUFBLGVBQUEsV0FBQSxlQUFBLGlCQUFBOzs7QUNyT0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSxlQUFBLFFBQUEsUUFBQSxTQUFBLFlBQUEsVUFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOztRQUVBLElBQUEsUUFBQSxJQUFBOztRQUVBLE9BQUEsYUFBQTtRQUNBLE9BQUEsYUFBQTs7UUFFQSxPQUFBLGdCQUFBLFNBQUE7UUFDQTtZQUNBLFdBQUEsUUFBQTs7O1FBR0EsT0FBQSxjQUFBLFNBQUE7UUFDQTtZQUNBLEdBQUEsQ0FBQSxXQUFBLFFBQUE7WUFDQTtnQkFDQSxXQUFBLFFBQUE7Ozs7UUFJQSxPQUFBLGNBQUEsU0FBQTtRQUNBO1lBQ0EsR0FBQSxDQUFBLFdBQUEsUUFBQTtZQUNBO2dCQUNBLFdBQUEsUUFBQTs7OztRQUlBLE9BQUEsZUFBQTtRQUNBO1lBQ0EsT0FBQSxhQUFBLENBQUEsT0FBQTs7Ozs7UUFLQSxPQUFBLElBQUEsZ0JBQUEsVUFBQSxPQUFBO1FBQ0E7WUFDQSxPQUFBOzs7UUFHQSxPQUFBLHlCQUFBO1FBQ0E7WUFDQSxHQUFBLE9BQUEsR0FBQSxtQkFBQSxPQUFBLEdBQUE7bUJBQ0EsT0FBQSxHQUFBLHlCQUFBLE9BQUEsR0FBQTttQkFDQSxPQUFBLEdBQUEscUJBQUEsT0FBQSxHQUFBO21CQUNBLE9BQUEsR0FBQSxnQkFBQSxPQUFBLEdBQUE7WUFDQTtnQkFDQSxPQUFBOzs7WUFHQSxPQUFBOzs7UUFHQSxPQUFBLGlCQUFBO1FBQ0E7WUFDQSxRQUFBLElBQUEsT0FBQSxTQUFBO1lBQ0EsSUFBQSxNQUFBO1lBQ0EsT0FBQSxPQUFBLFNBQUE7O2dCQUVBLEtBQUE7b0JBQ0EsTUFBQTtvQkFDQTtnQkFDQSxLQUFBO29CQUNBLE1BQUE7b0JBQ0E7Z0JBQ0EsS0FBQTtvQkFDQSxNQUFBO29CQUNBO2dCQUNBLEtBQUE7b0JBQ0EsTUFBQTtvQkFDQTtnQkFDQSxLQUFBO29CQUNBLE1BQUE7b0JBQ0E7Z0JBQ0EsS0FBQTtvQkFDQSxNQUFBO29CQUNBO2dCQUNBLEtBQUE7b0JBQ0EsTUFBQTtvQkFDQTtnQkFDQSxLQUFBO29CQUNBLE1BQUE7b0JBQ0E7OztZQUdBLE9BQUEsR0FBQTs7O1FBR0EsT0FBQSxrQkFBQTtRQUNBO1lBQ0EsT0FBQSxZQUFBOzs7UUFHQSxPQUFBLFNBQUE7UUFDQTtZQUNBLFlBQUE7WUFDQSxPQUFBLEdBQUE7Ozs7O0lBS0EsUUFBQSxPQUFBLG1CQUFBLFdBQUEsa0JBQUEsQ0FBQSxVQUFBLFVBQUEsV0FBQSxjQUFBLFlBQUEsZUFBQTs7OztBQzFHQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLHlCQUFBLE9BQUEsUUFBQSxjQUFBLGFBQUEsYUFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOztRQUVBLEtBQUEsaUJBQUE7UUFDQTtZQUNBLEtBQUEsTUFBQTs7WUFFQSxJQUFBLFVBQUEsS0FBQSxNQUFBOztZQUVBLEdBQUE7WUFDQTs7O2dCQUdBLElBQUEsSUFBQSxLQUFBOztnQkFFQSxZQUFBLElBQUEsWUFBQSxLQUFBLEdBQUEsS0FBQSxTQUFBO2dCQUNBO29CQUNBLFFBQUEsSUFBQTs7b0JBRUEsYUFBQSxLQUFBO29CQUNBLE9BQUEsR0FBQTs7bUJBRUE7Z0JBQ0E7b0JBQ0EsYUFBQSxLQUFBOzs7Ozs7O0lBT0EsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNEJBQUEsQ0FBQSxTQUFBLFVBQUEsZ0JBQUEsZUFBQSxlQUFBLGdCQUFBOzs7O0FDbkNBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEseUJBQUEsT0FBQSxRQUFBLGNBQUEsYUFBQSxhQUFBLGVBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTs7O1FBR0EsWUFBQSxZQUFBLE1BQUEsYUFBQTs7UUFFQSxLQUFBLGlCQUFBO1FBQ0E7WUFDQSxLQUFBLE1BQUE7O1lBRUEsSUFBQSxVQUFBLEtBQUEsTUFBQTs7WUFFQSxHQUFBO1lBQ0E7Z0JBQ0EsS0FBQSxTQUFBLE1BQUEsS0FBQTtnQkFDQTtvQkFDQSxhQUFBLEtBQUE7b0JBQ0EsT0FBQSxHQUFBOzttQkFFQTtnQkFDQTtvQkFDQSxhQUFBLEtBQUE7b0JBQ0EsUUFBQSxJQUFBOzs7OztRQUtBLEtBQUEsaUJBQUE7UUFDQTtZQUNBLEtBQUEsU0FBQSxTQUFBLEtBQUE7WUFDQTtnQkFDQSxhQUFBLEtBQUE7Z0JBQ0EsT0FBQSxHQUFBO2VBQ0E7WUFDQTtnQkFDQSxhQUFBLEtBQUE7Ozs7OztRQU1BLEtBQUEsb0JBQUEsU0FBQTtRQUNBO1lBQ0EsSUFBQSxTQUFBLGNBQUEsUUFBQSxJQUFBLG9CQUFBO1lBQ0EsT0FBQSxLQUFBO2dCQUNBO29CQUNBLEtBQUE7O2dCQUVBO2dCQUNBOzs7Ozs7SUFNQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw0QkFBQSxDQUFBLFNBQUEsVUFBQSxnQkFBQSxlQUFBLGVBQUEsaUJBQUEsZ0JBQUE7Ozs7QUMzREEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSxtQkFBQSxPQUFBLFFBQUEsYUFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOztRQUVBLFlBQUEsZ0JBQUE7Ozs7SUFJQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxzQkFBQSxDQUFBLFNBQUEsVUFBQSxlQUFBLGVBQUE7Ozs7QUNYQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLHNCQUFBLE9BQUEsUUFBQSxhQUFBLGFBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTs7UUFFQSxLQUFBLFFBQUE7O1FBRUEsS0FBQSxjQUFBO1FBQ0E7WUFDQSxLQUFBLE1BQUE7O1lBRUEsSUFBQSxVQUFBLEtBQUEsTUFBQTs7O1lBR0EsR0FBQTtZQUNBOzs7Z0JBR0EsSUFBQSxJQUFBLEtBQUE7Ozs7Z0JBSUEsWUFBQSxJQUFBLFNBQUEsS0FBQSxHQUFBLEtBQUEsU0FBQTtnQkFDQTtvQkFDQSxRQUFBLElBQUE7b0JBQ0EsYUFBQSxLQUFBO29CQUNBLE9BQUEsR0FBQTs7Ozs7Ozs7SUFRQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx5QkFBQSxDQUFBLFNBQUEsVUFBQSxlQUFBLGVBQUEsZ0JBQUE7Ozs7QUNwQ0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSxzQkFBQSxPQUFBLFFBQUEsYUFBQSxhQUFBLGNBQUEsY0FBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOztRQUVBLEtBQUEsa0JBQUE7UUFDQSxLQUFBLG1CQUFBOzs7UUFHQSxZQUFBLFNBQUEsTUFBQSxhQUFBO1FBQ0EsWUFBQSxlQUFBOztRQUVBLEtBQUEsY0FBQTtRQUNBO1lBQ0EsS0FBQSxNQUFBOztZQUVBLElBQUEsVUFBQSxLQUFBLE1BQUE7OztZQUdBLEdBQUE7WUFDQTs7Z0JBRUEsS0FBQSxNQUFBLE1BQUEsS0FBQTtnQkFDQTs7b0JBRUEsYUFBQSxLQUFBO29CQUNBLE9BQUEsR0FBQTttQkFDQTtnQkFDQTtvQkFDQSxhQUFBLEtBQUE7b0JBQ0EsUUFBQSxJQUFBOzs7OztRQUtBLEtBQUEsYUFBQTtRQUNBO1lBQ0EsUUFBQSxJQUFBLEtBQUE7O1lBRUEsS0FBQSxNQUFBLGVBQUEsS0FBQTtnQkFDQSxVQUFBLEtBQUEsTUFBQTtnQkFDQSxZQUFBLEtBQUEsZ0JBQUE7Z0JBQ0EsVUFBQSxLQUFBO2dCQUNBLFNBQUEsS0FBQTs7O1lBR0EsS0FBQSxrQkFBQTtZQUNBLEtBQUEsbUJBQUE7OztRQUdBLEtBQUEsZ0JBQUEsU0FBQSxHQUFBO1FBQ0E7WUFDQSxJQUFBO1lBQ0EsSUFBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsTUFBQSxlQUFBLFFBQUE7WUFDQTtnQkFDQSxHQUFBLGFBQUEsS0FBQSxNQUFBLGVBQUEsR0FBQTtnQkFDQTtvQkFDQSxnQkFBQTtvQkFDQTs7OztZQUlBLFFBQUEsSUFBQTtZQUNBLEtBQUEsTUFBQSxlQUFBLE9BQUEsZUFBQTs7WUFFQSxFQUFBOzs7UUFHQSxLQUFBLGNBQUE7UUFDQTtZQUNBLEtBQUEsTUFBQSxTQUFBLEtBQUE7WUFDQTtnQkFDQSxhQUFBLEtBQUE7Z0JBQ0EsUUFBQSxJQUFBO2dCQUNBLE9BQUEsR0FBQTtlQUNBO1lBQ0E7Z0JBQ0EsYUFBQSxLQUFBOzs7Ozs7UUFNQSxLQUFBLG9CQUFBLFNBQUE7UUFDQTtZQUNBLElBQUEsU0FBQSxjQUFBLFFBQUEsSUFBQSxpQkFBQTtZQUNBLE9BQUEsS0FBQTtnQkFDQTtvQkFDQSxLQUFBOztnQkFFQTtnQkFDQTs7Ozs7O0lBTUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEseUJBQUEsQ0FBQSxTQUFBLFVBQUEsZUFBQSxlQUFBLGdCQUFBLGdCQUFBLGlCQUFBOzs7O0FDbkdBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEsZ0JBQUEsT0FBQSxRQUFBLGFBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTs7UUFFQSxZQUFBLGFBQUE7OztJQUdBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG1CQUFBLENBQUEsU0FBQSxVQUFBLGVBQUEsZUFBQTs7OztBQ1ZBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEsaUJBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTtRQUNBLEtBQUEsY0FBQSxVQUFBLE9BQUE7OztJQUdBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG9CQUFBLENBQUEsV0FBQTs7OztBQ1RBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEsaUJBQUEsT0FBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOztRQUVBLEtBQUEsYUFBQSxVQUFBLE9BQUE7O1FBRUEsS0FBQSxrQkFBQSxXQUFBO1lBQ0EsT0FBQSxNQUFBOzs7O0lBSUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsb0JBQUEsQ0FBQSxTQUFBLFdBQUE7OztBQ2RBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEsa0JBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTs7O0lBR0EsUUFBQSxPQUFBLG1CQUFBLFdBQUEscUJBQUEsQ0FBQSxVQUFBOzs7QUNSQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLGdCQUFBLFFBQUEsUUFBQSxVQUFBLGVBQUEsYUFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBO1FBQ0EsS0FBQSxRQUFBO1FBQ0EsS0FBQSxXQUFBOztRQUVBLEdBQUEsU0FBQSxJQUFBO1FBQ0E7WUFDQSxLQUFBLFFBQUEsU0FBQSxJQUFBOzs7UUFHQSxJQUFBLGdCQUFBO1lBQ0EsYUFBQTtZQUNBLGVBQUE7WUFDQSxZQUFBLFNBQUEsaUJBQUEsUUFBQTtZQUNBO2dCQUNBLE9BQUEsZ0JBQUEsWUFBQTs7O29CQUdBLEdBQUEsS0FBQSxVQUFBLE1BQUEsS0FBQSxhQUFBO29CQUNBO3dCQUNBLFlBQUEsTUFBQSxLQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUE7d0JBQ0E7NEJBQ0EsUUFBQSxJQUFBOzs0QkFFQSxJQUFBLFFBQUEsSUFBQTs7NEJBRUEsSUFBQSxlQUFBLElBQUE7NEJBQ0EsYUFBQSxZQUFBLGFBQUEsZ0JBQUE7OzRCQUVBLFNBQUEsSUFBQSxhQUFBLEtBQUEsT0FBQSxFQUFBLFNBQUE7Ozs0QkFHQSxVQUFBOzRCQUNBLE9BQUEsR0FBQTs7d0JBRUE7d0JBQ0E7NEJBQ0EsTUFBQTs7Ozs7WUFLQSxPQUFBLE9BQUE7OztRQUdBLGNBQUEsV0FBQTs7UUFFQSxhQUFBOzs7O0lBSUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsbUJBQUEsQ0FBQSxVQUFBLFVBQUEsWUFBQSxpQkFBQSxlQUFBLGdCQUFBOzs7O0FDdkRBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEseUJBQUEsT0FBQSxRQUFBLGNBQUEsYUFBQSxhQUFBLG1CQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7O1FBRUEsWUFBQSxZQUFBO1FBQ0EsWUFBQSxvQkFBQTs7UUFFQSxLQUFBLGVBQUEsa0JBQUE7O1FBRUEsS0FBQSxpQkFBQTtRQUNBO1lBQ0EsS0FBQSxNQUFBOztZQUVBLElBQUEsVUFBQSxLQUFBLE1BQUE7OztZQUdBLEdBQUE7WUFDQTs7O2dCQUdBLElBQUEsSUFBQSxLQUFBOztnQkFFQSxZQUFBLElBQUEsWUFBQSxLQUFBLEdBQUEsS0FBQSxTQUFBO2dCQUNBO29CQUNBLFFBQUEsSUFBQTs7b0JBRUEsYUFBQSxLQUFBO29CQUNBLE9BQUEsR0FBQTs7bUJBRUE7Z0JBQ0E7b0JBQ0EsYUFBQSxLQUFBOzs7Ozs7OztJQVFBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDRCQUFBLENBQUEsU0FBQSxVQUFBLGdCQUFBLGVBQUEsZUFBQSxxQkFBQSxnQkFBQTs7OztBQzFDQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLHlCQUFBLE9BQUEsUUFBQSxjQUFBLGFBQUEsYUFBQSxlQUFBLG1CQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7O1FBRUEsWUFBQSxZQUFBO1FBQ0EsWUFBQSxvQkFBQTs7O1FBR0EsWUFBQSxZQUFBLE1BQUEsYUFBQTs7UUFFQSxLQUFBLGVBQUEsa0JBQUE7O1FBRUEsS0FBQSxpQkFBQTtRQUNBO1lBQ0EsS0FBQSxNQUFBOztZQUVBLElBQUEsVUFBQSxLQUFBLE1BQUE7O1lBRUEsR0FBQTtZQUNBO2dCQUNBLEtBQUEsU0FBQSxNQUFBLEtBQUE7Z0JBQ0E7b0JBQ0EsYUFBQSxLQUFBO29CQUNBLE9BQUEsR0FBQTs7bUJBRUE7Z0JBQ0E7b0JBQ0EsYUFBQSxLQUFBO29CQUNBLFFBQUEsSUFBQTs7Ozs7UUFLQSxLQUFBLGlCQUFBO1FBQ0E7WUFDQSxLQUFBLFNBQUEsU0FBQSxLQUFBO1lBQ0E7Z0JBQ0EsYUFBQSxLQUFBO2dCQUNBLE9BQUEsR0FBQTtlQUNBO1lBQ0E7Z0JBQ0EsYUFBQSxLQUFBOzs7O1FBSUEsS0FBQSxvQkFBQSxTQUFBO1FBQ0E7WUFDQSxJQUFBLFNBQUEsY0FBQSxRQUFBLElBQUEsb0JBQUE7WUFDQSxPQUFBLEtBQUE7Z0JBQ0E7b0JBQ0EsS0FBQTs7Z0JBRUE7Z0JBQ0E7Ozs7OztJQU1BLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDRCQUFBLENBQUEsU0FBQSxVQUFBLGdCQUFBLGVBQUEsZUFBQSxpQkFBQSxxQkFBQSxnQkFBQTs7OztBQzlEQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLG1CQUFBLE9BQUEsUUFBQSxhQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7O1FBRUEsWUFBQSxnQkFBQTs7OztJQUlBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHNCQUFBLENBQUEsU0FBQSxVQUFBLGVBQUEsZUFBQTs7OztBQ1hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEsc0JBQUEsUUFBQSxhQUFBLGFBQUEsZUFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBO1FBQ0EsS0FBQSxtQkFBQTs7O1FBR0EsUUFBQSxJQUFBLFNBQUE7O1FBRUEsR0FBQSxhQUFBLFFBQUEsU0FBQSx1QkFBQSxRQUFBLGFBQUEsUUFBQSxTQUFBLHVCQUFBO1FBQ0E7WUFDQSxLQUFBLGVBQUEsS0FBQSxNQUFBLGFBQUEsUUFBQSxTQUFBOzs7UUFHQTtZQUNBLEtBQUEsZUFBQTtZQUNBLGFBQUEsUUFBQSxTQUFBLG1CQUFBLEtBQUEsVUFBQSxLQUFBOzs7UUFHQTs7UUFFQSxZQUFBLGdCQUFBOztRQUVBLEtBQUEsWUFBQTtRQUNBO1lBQ0EsS0FBQSxJQUFBLEtBQUEsWUFBQTtZQUNBLEtBQUEsYUFBQSxLQUFBLEtBQUE7WUFDQSxRQUFBLElBQUEsS0FBQTs7WUFFQSxhQUFBLFFBQUEsU0FBQSxtQkFBQSxLQUFBLFVBQUEsS0FBQTs7WUFFQTs7O1FBR0EsS0FBQSxZQUFBLFNBQUEsR0FBQTtRQUNBO1lBQ0EsSUFBQSxTQUFBLGNBQUEsUUFBQSxHQUFBLHdCQUFBO1lBQ0EsT0FBQSxLQUFBO1lBQ0E7Z0JBQ0EsSUFBQTtnQkFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxhQUFBLFFBQUE7Z0JBQ0E7b0JBQ0EsR0FBQSxTQUFBLEtBQUEsYUFBQSxHQUFBO29CQUNBO3dCQUNBLGdCQUFBO3dCQUNBOzs7O2dCQUlBLEtBQUEsYUFBQSxPQUFBLGVBQUE7Z0JBQ0EsR0FBQSxLQUFBLGFBQUEsV0FBQSxHQUFBLEVBQUEsYUFBQSxXQUFBLFNBQUE7O2dCQUVBLGFBQUEsUUFBQSxTQUFBLG1CQUFBLEtBQUE7O1lBRUE7WUFDQTs7O1lBR0EsRUFBQTs7O1FBR0EsS0FBQSxpQkFBQSxTQUFBLEdBQUE7UUFDQTtZQUNBLElBQUE7WUFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxJQUFBLGtCQUFBLFFBQUE7WUFDQTtnQkFDQSxHQUFBLGNBQUEsS0FBQSxJQUFBLGtCQUFBLEdBQUE7Z0JBQ0E7b0JBQ0EsZ0JBQUE7b0JBQ0E7Ozs7WUFJQSxLQUFBLElBQUEsa0JBQUEsT0FBQSxlQUFBOztZQUVBLEVBQUE7OztRQUdBLEtBQUEsY0FBQTtRQUNBO1lBQ0EsUUFBQSxJQUFBLEtBQUE7O1lBRUEsS0FBQSxJQUFBLGtCQUFBLEtBQUE7Z0JBQ0EsYUFBQSxLQUFBLGlCQUFBO2dCQUNBLFVBQUEsS0FBQTtnQkFDQSxVQUFBLEtBQUE7OztZQUdBLEtBQUEsbUJBQUE7WUFDQSxLQUFBLG1CQUFBOzs7UUFHQSxTQUFBO1FBQ0E7WUFDQSxLQUFBLE1BQUE7WUFDQSxLQUFBLElBQUEsS0FBQTtZQUNBLEtBQUEsSUFBQSxPQUFBO1lBQ0EsS0FBQSxJQUFBLG9CQUFBOzs7OztJQUtBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHlCQUFBLENBQUEsVUFBQSxlQUFBLGVBQUEsaUJBQUEsWUFBQTs7OztBQ3hHQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLDRCQUFBLE9BQUEsUUFBQSxhQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7O1FBRUEsS0FBQSxnQkFBQTtRQUNBLEtBQUEscUJBQUE7O1FBRUEsWUFBQSxlQUFBOzs7UUFHQSxLQUFBLGFBQUE7UUFDQTtZQUNBLFFBQUEsSUFBQSxLQUFBOztZQUVBLEdBQUEsS0FBQSx1QkFBQSxXQUFBLEVBQUEsS0FBQSxxQkFBQTs7WUFFQSxLQUFBLG1CQUFBLEtBQUE7Z0JBQ0EsWUFBQSxLQUFBLGdCQUFBO2dCQUNBLFVBQUEsS0FBQTtnQkFDQSxTQUFBLEtBQUE7OztZQUdBLEtBQUEsa0JBQUE7WUFDQSxLQUFBLG1CQUFBOzs7UUFHQSxLQUFBLGdCQUFBLFNBQUEsR0FBQTtRQUNBO1lBQ0EsSUFBQTtZQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLG1CQUFBLFFBQUE7WUFDQTtnQkFDQSxHQUFBLGFBQUEsS0FBQSxtQkFBQSxHQUFBO2dCQUNBO29CQUNBLGdCQUFBO29CQUNBOzs7O1lBSUEsS0FBQSxtQkFBQSxPQUFBLGVBQUE7O1lBRUEsRUFBQTs7O1FBR0EsS0FBQSxvQkFBQTtRQUNBO1lBQ0EsSUFBQSxlQUFBO1lBQ0EsYUFBQSxPQUFBLEtBQUE7O1lBRUEsT0FBQSxLQUFBOztnQkFFQSxLQUFBO29CQUNBOztnQkFFQSxLQUFBO29CQUNBLGFBQUEsYUFBQSxLQUFBO29CQUNBLGFBQUEsV0FBQSxLQUFBO29CQUNBOzs7Z0JBR0EsS0FBQTtvQkFDQSxLQUFBLFdBQUE7b0JBQ0EsSUFBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsbUJBQUEsUUFBQTtvQkFDQTt3QkFDQSxJQUFBLE1BQUEsS0FBQSxtQkFBQTt3QkFDQSxLQUFBLFNBQUEsS0FBQSxDQUFBLElBQUEsSUFBQSxZQUFBLFVBQUEsSUFBQTs7b0JBRUE7OztZQUdBLFlBQUEsSUFBQSxnQ0FBQSxLQUFBLEVBQUEsZ0JBQUEsZUFBQSxLQUFBLFNBQUE7WUFDQTtnQkFDQSxLQUFBLFVBQUE7OztZQUdBO1lBQ0E7Ozs7WUFJQSxLQUFBLFNBQUE7Ozs7O0lBS0EsUUFBQSxPQUFBLG1CQUFBLFdBQUEsK0JBQUEsQ0FBQSxTQUFBLFVBQUEsZUFBQSxlQUFBOzs7OztBQ3ZGQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLDRCQUFBLE9BQUEsUUFBQSxjQUFBLGFBQUEsYUFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOztRQUVBLEtBQUEsb0JBQUE7UUFDQTtZQUNBLEtBQUEsTUFBQTs7WUFFQSxJQUFBLFVBQUEsS0FBQSxNQUFBOzs7WUFHQSxHQUFBO1lBQ0E7OztnQkFHQSxJQUFBLElBQUEsS0FBQTs7Z0JBRUEsWUFBQSxJQUFBLGVBQUEsS0FBQSxHQUFBLEtBQUEsU0FBQTtnQkFDQTtvQkFDQSxRQUFBLElBQUE7b0JBQ0EsYUFBQSxLQUFBO29CQUNBLE9BQUEsR0FBQTs7bUJBRUE7Z0JBQ0E7b0JBQ0EsYUFBQSxLQUFBOzs7Ozs7O0lBT0EsUUFBQSxPQUFBLG1CQUFBLFdBQUEsK0JBQUEsQ0FBQSxTQUFBLFVBQUEsZ0JBQUEsZUFBQSxlQUFBLGdCQUFBOzs7O0FDbkNBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEsNEJBQUEsT0FBQSxRQUFBLGNBQUEsYUFBQSxhQUFBLGVBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTs7O1FBR0EsWUFBQSxlQUFBLE1BQUEsYUFBQTs7UUFFQSxLQUFBLG9CQUFBO1FBQ0E7WUFDQSxLQUFBLE1BQUE7O1lBRUEsSUFBQSxVQUFBLEtBQUEsTUFBQTs7O1lBR0EsR0FBQTtZQUNBO2dCQUNBLEtBQUEsWUFBQSxNQUFBLEtBQUE7Z0JBQ0E7b0JBQ0EsYUFBQSxLQUFBO29CQUNBLE9BQUEsR0FBQTs7bUJBRUE7Z0JBQ0E7b0JBQ0EsYUFBQSxLQUFBO29CQUNBLFFBQUEsSUFBQTs7Ozs7O1FBTUEsS0FBQSxvQkFBQTtRQUNBO1lBQ0EsS0FBQSxZQUFBLFNBQUEsS0FBQTtZQUNBO2dCQUNBLGFBQUEsS0FBQTtnQkFDQSxPQUFBLEdBQUE7ZUFDQTtZQUNBO2dCQUNBLGFBQUEsS0FBQTs7Ozs7O1FBTUEsS0FBQSxvQkFBQSxTQUFBO1FBQ0E7WUFDQSxJQUFBLFNBQUEsY0FBQSxRQUFBLElBQUEsd0JBQUE7WUFDQSxPQUFBLEtBQUE7Z0JBQ0E7b0JBQ0EsS0FBQTs7Z0JBRUE7Z0JBQ0E7Ozs7OztJQU1BLFFBQUEsT0FBQSxtQkFBQSxXQUFBLCtCQUFBLENBQUEsU0FBQSxVQUFBLGdCQUFBLGVBQUEsZUFBQSxpQkFBQSxnQkFBQTs7OztBQzdEQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLHNCQUFBLE9BQUEsUUFBQSxhQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7O1FBRUEsWUFBQSxtQkFBQTs7OztJQUlBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHlCQUFBLENBQUEsU0FBQSxVQUFBLGVBQUEsZUFBQTs7OztBQ1hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEsd0JBQUEsT0FBQSxRQUFBLGFBQUEsY0FBQSxhQUFBLG1CQUFBLFVBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTs7O1FBR0EsWUFBQSxnQkFBQTs7UUFFQSxLQUFBLGVBQUEsa0JBQUE7UUFDQSxLQUFBLGVBQUEsa0JBQUE7UUFDQSxLQUFBLG1CQUFBOztRQUVBLEtBQUEsVUFBQTtRQUNBLEtBQUEsUUFBQSxnQkFBQTtRQUNBLEtBQUEsUUFBQSxnQkFBQTs7UUFFQSxHQUFBLGFBQUEsUUFBQSxTQUFBLHVCQUFBLFFBQUEsYUFBQSxRQUFBLFNBQUEsdUJBQUE7UUFDQTtZQUNBLEtBQUEsZUFBQSxLQUFBLE1BQUEsYUFBQSxRQUFBLFNBQUE7Ozs7UUFJQSxLQUFBLGdCQUFBO1FBQ0E7WUFDQSxLQUFBLE1BQUE7O1lBRUEsSUFBQSxVQUFBLEtBQUEsTUFBQTs7O1lBR0EsR0FBQTtZQUNBO2dCQUNBLFFBQUEsSUFBQSxLQUFBOztnQkFFQSxJQUFBLElBQUEsS0FBQTs7OztpQkFJQSxZQUFBLElBQUEsV0FBQSxLQUFBLEdBQUEsS0FBQSxTQUFBO2lCQUNBOzs7b0JBR0EsYUFBQSxLQUFBO29CQUNBLE9BQUEsR0FBQTtvQkFDQTtpQkFDQTtvQkFDQSxhQUFBLEtBQUE7Ozs7OztRQU1BLEtBQUEsY0FBQTtRQUNBO1lBQ0EsUUFBQSxJQUFBLEtBQUE7O1lBRUEsWUFBQSxLQUFBLGlCQUFBLElBQUEsS0FBQSxrQkFBQSxLQUFBOztZQUVBLEtBQUEsbUJBQUE7WUFDQSxLQUFBLG1CQUFBOztZQUVBLFFBQUEsSUFBQSxLQUFBOzs7UUFHQSxLQUFBLGlCQUFBO1FBQ0E7OztZQUdBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLG9CQUFBLGtCQUFBLFFBQUE7WUFDQTtnQkFDQSxJQUFBLEtBQUEsS0FBQSxvQkFBQSxrQkFBQTs7Z0JBRUEsWUFBQSxHQUFBLGFBQUEsR0FBQSxVQUFBLEdBQUE7Ozs7UUFJQSxLQUFBLGlCQUFBLFNBQUEsR0FBQTtRQUNBO1lBQ0EsSUFBQTtZQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLFFBQUEsa0JBQUEsUUFBQTtZQUNBO2dCQUNBLEdBQUEsY0FBQSxLQUFBLFFBQUEsa0JBQUEsR0FBQTtnQkFDQTtvQkFDQSxnQkFBQTtvQkFDQTs7Ozs7O1lBTUEsSUFBQSxjQUFBLFdBQUEsS0FBQSxRQUFBO1lBQ0EsSUFBQSxTQUFBLFdBQUEsS0FBQSxRQUFBLGtCQUFBLGVBQUEsU0FBQSxhQUFBLFNBQUEsS0FBQSxRQUFBLGtCQUFBLGVBQUE7WUFDQSxlQUFBO1lBQ0EsS0FBQSxRQUFBLE9BQUE7O1lBRUEsS0FBQSxRQUFBLGtCQUFBLE9BQUEsZUFBQTs7WUFFQSxFQUFBOzs7UUFHQSxTQUFBLFlBQUEsWUFBQSxVQUFBO1FBQ0E7WUFDQSxHQUFBLEtBQUEsUUFBQSxzQkFBQSxXQUFBLEVBQUEsS0FBQSxRQUFBLG9CQUFBOztZQUVBLEtBQUEsUUFBQSxrQkFBQSxLQUFBO2dCQUNBLGFBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxVQUFBOzs7WUFHQSxHQUFBLEtBQUEsUUFBQSxTQUFBLGFBQUEsS0FBQSxRQUFBLFNBQUEsTUFBQSxFQUFBLEtBQUEsUUFBQSxPQUFBO1lBQ0EsSUFBQSxjQUFBLFdBQUEsS0FBQSxRQUFBO1lBQ0EsSUFBQSxTQUFBLFdBQUEsU0FBQSxhQUFBLFdBQUE7WUFDQSxlQUFBO1lBQ0EsS0FBQSxRQUFBLE9BQUE7Ozs7O0lBS0EsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkJBQUEsQ0FBQSxTQUFBLFVBQUEsZUFBQSxnQkFBQSxlQUFBLHFCQUFBLFlBQUEsZ0JBQUE7Ozs7QUN4SEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSx3QkFBQSxPQUFBLFFBQUEsYUFBQSxhQUFBLGNBQUEsY0FBQSxlQUFBLG1CQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7OztRQUdBLFlBQUEsZ0JBQUE7UUFDQSxZQUFBLFdBQUEsTUFBQSxhQUFBOztRQUVBLEtBQUEsZUFBQSxrQkFBQTtRQUNBLEtBQUEsZUFBQSxrQkFBQTtRQUNBLEtBQUEsbUJBQUE7O1FBRUEsR0FBQSxhQUFBLFFBQUEsU0FBQSx1QkFBQSxRQUFBLGFBQUEsUUFBQSxTQUFBLHVCQUFBO1FBQ0E7WUFDQSxLQUFBLGVBQUEsS0FBQSxNQUFBLGFBQUEsUUFBQSxTQUFBOzs7O1FBSUEsS0FBQSxnQkFBQTtRQUNBO1lBQ0EsS0FBQSxNQUFBOztZQUVBLElBQUEsVUFBQSxLQUFBLE1BQUE7OztZQUdBLEdBQUE7WUFDQTs7Z0JBRUEsS0FBQSxRQUFBLE1BQUEsS0FBQTtnQkFDQTs7b0JBRUEsYUFBQSxLQUFBO29CQUNBLE9BQUEsR0FBQTttQkFDQTtnQkFDQTtvQkFDQSxhQUFBLEtBQUE7b0JBQ0EsUUFBQSxJQUFBOzs7OztRQUtBLEtBQUEsZ0JBQUE7UUFDQTtZQUNBLEtBQUEsUUFBQSxTQUFBLEtBQUE7WUFDQTtnQkFDQSxRQUFBLElBQUE7Z0JBQ0EsYUFBQSxLQUFBO2dCQUNBLE9BQUEsR0FBQTs7ZUFFQTtZQUNBO2dCQUNBLGFBQUEsS0FBQTtnQkFDQSxRQUFBLElBQUE7Ozs7UUFJQSxLQUFBLG9CQUFBLFNBQUE7UUFDQTtZQUNBLElBQUEsU0FBQSxjQUFBLFFBQUEsSUFBQSxtQkFBQTtZQUNBLE9BQUEsS0FBQTtZQUNBO2dCQUNBLEtBQUE7O1lBRUE7WUFDQTs7OztRQUlBLEtBQUEsY0FBQTtRQUNBO1lBQ0EsUUFBQSxJQUFBLEtBQUE7O1lBRUEsWUFBQSxLQUFBLGlCQUFBLElBQUEsS0FBQSxrQkFBQSxLQUFBOztZQUVBLEtBQUEsbUJBQUE7WUFDQSxLQUFBLG1CQUFBOzs7O1FBSUEsS0FBQSxpQkFBQTtRQUNBOzs7WUFHQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxvQkFBQSxrQkFBQSxRQUFBO1lBQ0E7Z0JBQ0EsSUFBQSxLQUFBLEtBQUEsb0JBQUEsa0JBQUE7O2dCQUVBLFlBQUEsR0FBQSxhQUFBLEdBQUEsVUFBQSxHQUFBOzs7O1FBSUEsS0FBQSxpQkFBQSxTQUFBLEdBQUE7UUFDQTtZQUNBLElBQUE7WUFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxRQUFBLGtCQUFBLFFBQUE7WUFDQTtnQkFDQSxHQUFBLGNBQUEsS0FBQSxRQUFBLGtCQUFBLEdBQUE7Z0JBQ0E7b0JBQ0EsZ0JBQUE7b0JBQ0E7Ozs7WUFJQSxRQUFBLElBQUE7O1lBRUEsSUFBQSxjQUFBLFdBQUEsS0FBQSxRQUFBO1lBQ0EsSUFBQSxTQUFBLFdBQUEsS0FBQSxRQUFBLGtCQUFBLGVBQUEsU0FBQSxhQUFBLFNBQUEsS0FBQSxRQUFBLGtCQUFBLGVBQUE7WUFDQSxlQUFBO1lBQ0EsS0FBQSxRQUFBLE9BQUE7OztZQUdBLEtBQUEsUUFBQSxrQkFBQSxPQUFBLGVBQUE7O1lBRUEsRUFBQTs7O1FBR0EsU0FBQSxZQUFBLFlBQUEsVUFBQTtRQUNBO1lBQ0EsR0FBQSxLQUFBLFFBQUEsc0JBQUEsV0FBQSxFQUFBLEtBQUEsUUFBQSxvQkFBQTs7WUFFQSxLQUFBLFFBQUEsa0JBQUEsS0FBQTtnQkFDQSxZQUFBLEtBQUEsUUFBQTtnQkFDQSxhQUFBO2dCQUNBLFVBQUE7Z0JBQ0EsVUFBQTs7O1lBR0EsR0FBQSxLQUFBLFFBQUEsU0FBQSxhQUFBLEtBQUEsUUFBQSxTQUFBLE1BQUEsRUFBQSxLQUFBLFFBQUEsT0FBQTtZQUNBLElBQUEsY0FBQSxXQUFBLEtBQUEsUUFBQTtZQUNBLElBQUEsU0FBQSxXQUFBLFNBQUEsYUFBQSxXQUFBO1lBQ0EsZUFBQTtZQUNBLEtBQUEsUUFBQSxPQUFBOzs7O0lBSUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkJBQUEsQ0FBQSxTQUFBLFVBQUEsZUFBQSxlQUFBLGdCQUFBLGdCQUFBLGlCQUFBLHFCQUFBLFlBQUE7Ozs7QUMxSUEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSxrQkFBQSxPQUFBLFFBQUEsYUFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBO1FBQ0EsS0FBQSxhQUFBO1FBQ0EsS0FBQSxpQkFBQTtRQUNBLEtBQUEsY0FBQTs7UUFFQSxZQUFBLGVBQUE7O1FBRUEsS0FBQSxxQkFBQSxTQUFBO1FBQ0E7WUFDQSxHQUFBLEtBQUEsZUFBQSxNQUFBLEtBQUEsbUJBQUEsTUFBQSxLQUFBLGdCQUFBO1lBQ0E7Z0JBQ0EsUUFBQSxJQUFBO2dCQUNBLElBQUEsbUJBQUE7Z0JBQ0EsT0FBQSxLQUFBOztvQkFFQSxLQUFBO3dCQUNBLG1CQUFBLFNBQUEsRUFBQTt3QkFDQTtvQkFDQSxLQUFBO3dCQUNBLG1CQUFBLFdBQUEsRUFBQTt3QkFDQTtvQkFDQSxLQUFBO3dCQUNBLG1CQUFBLFdBQUEsRUFBQTt3QkFDQTs7O2dCQUdBLEdBQUEsS0FBQSxtQkFBQTtnQkFDQTtvQkFDQSxPQUFBLG9CQUFBLFdBQUEsS0FBQTs7cUJBRUEsR0FBQSxLQUFBLG1CQUFBO2dCQUNBO29CQUNBLE9BQUEsbUJBQUEsV0FBQSxLQUFBOztxQkFFQSxHQUFBLEtBQUEsbUJBQUE7Z0JBQ0E7b0JBQ0EsT0FBQSxvQkFBQSxLQUFBOztxQkFFQSxHQUFBLEtBQUEsbUJBQUE7Z0JBQ0E7b0JBQ0EsT0FBQSxtQkFBQSxXQUFBLEtBQUE7O3FCQUVBLEdBQUEsS0FBQSxtQkFBQTtnQkFDQTtvQkFDQSxPQUFBLG9CQUFBLFdBQUEsS0FBQTs7OztZQUlBLE9BQUE7Ozs7SUFJQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxxQkFBQSxDQUFBLFNBQUEsVUFBQSxlQUFBLGVBQUE7Ozs7QUN6REEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSw4QkFBQSxPQUFBLFFBQUEsUUFBQSxTQUFBLGFBQUEsY0FBQSxhQUFBLGVBQUEsbUJBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTs7UUFFQSxZQUFBLGdCQUFBO1FBQ0EsWUFBQSxlQUFBO1FBQ0EsWUFBQSxtQkFBQTs7O1FBR0EsWUFBQSxzQkFBQSxLQUFBLFNBQUE7UUFDQTtZQUNBLEtBQUEsZ0JBQUE7OztRQUdBLEtBQUEsZ0JBQUE7UUFDQSxLQUFBLGNBQUEsY0FBQTtRQUNBLEtBQUEsY0FBQSxXQUFBO1FBQ0EsS0FBQSxjQUFBLFFBQUE7O1FBRUEsS0FBQSxjQUFBLFdBQUE7UUFDQSxLQUFBLGtCQUFBOztRQUVBLEtBQUEsY0FBQSxXQUFBO1FBQ0EsS0FBQSxrQkFBQTs7UUFFQSxLQUFBLGNBQUEsb0JBQUE7O1FBRUEsSUFBQSxnQkFBQTtRQUNBLElBQUEseUJBQUE7O1FBRUEsS0FBQSxtQkFBQSxTQUFBO1FBQ0E7WUFDQSxJQUFBLGdCQUFBO2dCQUNBLGFBQUE7Z0JBQ0EsZUFBQTtnQkFDQSxhQUFBO2dCQUNBLFlBQUEsU0FBQSxpQkFBQSxRQUFBO2dCQUNBO29CQUNBLE9BQUEsZUFBQSxrQkFBQTs7b0JBRUEsT0FBQSxnQkFBQTtvQkFDQTs7O3dCQUdBLE9BQUEsTUFBQTs7d0JBRUEsSUFBQSxVQUFBLE9BQUEsTUFBQTt3QkFDQSxHQUFBO3dCQUNBOzRCQUNBLElBQUEsSUFBQSxPQUFBLHdCQUFBOzRCQUNBLEVBQUEsT0FBQTs0QkFDQSxFQUFBLGdCQUFBOzRCQUNBLEVBQUEsZ0JBQUE7Ozs0QkFHQSxZQUFBLFdBQUEsR0FBQSxLQUFBLFNBQUE7NEJBQ0E7O2dDQUVBLElBQUEsTUFBQSxDQUFBLElBQUEsRUFBQSxPQUFBLE1BQUEsRUFBQSxNQUFBLE9BQUEsRUFBQTtnQ0FDQSxLQUFBLFNBQUEsS0FBQTtnQ0FDQSxLQUFBLGtCQUFBO2dDQUNBLGFBQUEsS0FBQTsrQkFDQTs0QkFDQTtnQ0FDQSxhQUFBLEtBQUE7Ozs0QkFHQSxVQUFBOzs7O29CQUlBLE9BQUEsZUFBQTtvQkFDQTs7d0JBRUEsVUFBQTs7O2dCQUdBLE9BQUEsT0FBQTs7O1lBR0EsY0FBQSxXQUFBOzs7O1FBSUEsS0FBQSxvQkFBQSxTQUFBO1FBQ0E7WUFDQSxJQUFBLGdCQUFBO2dCQUNBLGFBQUE7Z0JBQ0EsZUFBQTtnQkFDQSxhQUFBO2dCQUNBLFlBQUEsU0FBQSxpQkFBQSxRQUFBO2dCQUNBO29CQUNBLE9BQUEsZ0JBQUE7b0JBQ0E7Ozt3QkFHQSxPQUFBLE1BQUE7O3dCQUVBLElBQUEsVUFBQSxPQUFBLE1BQUE7d0JBQ0EsR0FBQTt3QkFDQTs0QkFDQSxJQUFBLElBQUEsT0FBQSx5QkFBQTs0QkFDQSxRQUFBLElBQUE7OzRCQUVBLFlBQUEsWUFBQSxHQUFBLEtBQUEsU0FBQTs0QkFDQTtnQ0FDQSxRQUFBLElBQUEsRUFBQTtnQ0FDQSxLQUFBLFVBQUEsS0FBQSxDQUFBLElBQUEsRUFBQSxPQUFBLFlBQUEsRUFBQSxZQUFBLFdBQUEsRUFBQTtnQ0FDQSxLQUFBLGNBQUEsY0FBQSxFQUFBO2dDQUNBLGFBQUEsS0FBQTsrQkFDQTs0QkFDQTtnQ0FDQSxhQUFBLEtBQUE7Ozs0QkFHQSxVQUFBOzs7O29CQUlBLE9BQUEsZUFBQTtvQkFDQTs7d0JBRUEsVUFBQTs7O2dCQUdBLE9BQUEsT0FBQTs7O1lBR0EsY0FBQSxXQUFBOzs7UUFHQSxLQUFBLGVBQUEsU0FBQTtRQUNBO1lBQ0EsSUFBQSxTQUFBOztZQUVBLEdBQUEsQ0FBQSxRQUFBLE1BQUE7WUFDQTs7Z0JBRUEsSUFBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsV0FBQSxRQUFBO2dCQUNBOzs7O29CQUlBLEdBQUEsT0FBQSxNQUFBLE9BQUEsS0FBQSxXQUFBLEdBQUE7b0JBQ0E7d0JBQ0EsU0FBQTt3QkFDQTs7Ozs7WUFLQSxPQUFBOzs7UUFHQSxLQUFBLHNCQUFBO1FBQ0E7WUFDQSxRQUFBLElBQUEsS0FBQTs7WUFFQSxJQUFBLElBQUEsS0FBQTs7O1lBR0EsWUFBQSxJQUFBLGlCQUFBLEtBQUEsR0FBQSxLQUFBLFNBQUE7WUFDQTtnQkFDQSxRQUFBLElBQUE7O2dCQUVBLGFBQUEsS0FBQTtnQkFDQSxHQUFBLEVBQUEsWUFBQSxFQUFBLFNBQUEsU0FBQTtnQkFDQTtvQkFDQSxJQUFBLFVBQUE7b0JBQ0EsUUFBQSxLQUFBLENBQUEsVUFBQSxnQkFBQSxTQUFBLE9BQUEsS0FBQTtvQkFDQSxRQUFBLEtBQUEsQ0FBQSxVQUFBLG1CQUFBLFNBQUEsT0FBQSxLQUFBLDZCQUFBLENBQUEsaUJBQUEsRUFBQTtvQkFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsRUFBQSxTQUFBLFFBQUE7b0JBQ0E7d0JBQ0EsUUFBQSxLQUFBLENBQUEsVUFBQSxjQUFBLEVBQUEsU0FBQSxJQUFBLFNBQUEsT0FBQSxLQUFBLHlCQUFBLENBQUEsYUFBQSxFQUFBLFNBQUE7OztvQkFHQSxPQUFBLGNBQUE7O29CQUVBLGNBQUEsYUFBQSxNQUFBLGtCQUFBOzs7Z0JBR0E7b0JBQ0EsT0FBQSxHQUFBOzs7ZUFHQTtZQUNBO2dCQUNBLGFBQUEsS0FBQTs7Ozs7UUFLQSxLQUFBLGdCQUFBO1FBQ0E7WUFDQSxHQUFBLEtBQUEsY0FBQSxZQUFBLFFBQUEsS0FBQSxjQUFBLFlBQUE7WUFDQTtnQkFDQSxLQUFBLGNBQUEsUUFBQTs7O1lBR0E7Z0JBQ0EsR0FBQSxLQUFBLGNBQUEsVUFBQTt1QkFDQSxLQUFBLGNBQUEsVUFBQTt1QkFDQSxLQUFBLGNBQUEsUUFBQTtnQkFDQTtvQkFDQSxJQUFBLGFBQUEsZ0JBQUEsS0FBQSxjQUFBO29CQUNBLGNBQUEsSUFBQSxLQUFBLGNBQUEsUUFBQSxhQUFBOzs7OztRQUtBLEtBQUEsZ0JBQUE7UUFDQTtZQUNBLEdBQUEsS0FBQSxvQkFBQTtZQUNBO2dCQUNBLEtBQUEsY0FBQSxXQUFBO2dCQUNBLEtBQUEsY0FBQSxTQUFBOzs7WUFHQTtnQkFDQSxLQUFBLGNBQUEsV0FBQTtnQkFDQSxLQUFBLGNBQUEsU0FBQTs7OztRQUlBLEtBQUEsZ0JBQUE7UUFDQTtZQUNBLElBQUEsaUJBQUE7WUFDQSxHQUFBLEtBQUEsb0JBQUE7WUFDQTtnQkFDQSxpQkFBQTs7aUJBRUEsR0FBQSxLQUFBLG9CQUFBO1lBQ0E7Z0JBQ0EsaUJBQUE7OztZQUdBLEtBQUEsY0FBQSxXQUFBOztZQUVBLEdBQUEsS0FBQSxvQkFBQTtZQUNBO2dCQUNBLEtBQUEsY0FBQSxTQUFBO2dCQUNBLEtBQUEsY0FBQSxTQUFBOztnQkFFQSxpQkFBQTtnQkFDQSxpQkFBQTs7O1lBR0EseUJBQUE7OztRQUdBLEtBQUEsYUFBQTtRQUNBO1lBQ0EsUUFBQSxJQUFBLEtBQUE7O1lBRUEsR0FBQSxLQUFBLGNBQUEsNEJBQUEsV0FBQSxFQUFBLEtBQUEsY0FBQSwwQkFBQTs7WUFFQSxLQUFBLGNBQUEsd0JBQUEsS0FBQTtnQkFDQSxZQUFBLEtBQUEsZ0JBQUE7Z0JBQ0EsVUFBQSxLQUFBO2dCQUNBLFNBQUEsS0FBQTs7O1lBR0EsR0FBQSxLQUFBLGNBQUEsVUFBQSxhQUFBLEtBQUEsY0FBQSxVQUFBLE1BQUEsRUFBQSxLQUFBLGNBQUEsUUFBQTtZQUNBLElBQUEsY0FBQSxXQUFBLEtBQUEsY0FBQTtZQUNBLElBQUEsU0FBQSxXQUFBLEtBQUEsZ0JBQUEsU0FBQSxTQUFBLEtBQUE7WUFDQSxlQUFBO1lBQ0EsS0FBQSxjQUFBLFFBQUE7WUFDQSxnQkFBQTs7WUFFQSxLQUFBLGtCQUFBO1lBQ0EsS0FBQSxtQkFBQTs7WUFFQSxRQUFBLElBQUEsS0FBQTs7O1FBR0EsS0FBQSxnQkFBQSxTQUFBLEdBQUE7UUFDQTtZQUNBLElBQUE7WUFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxjQUFBLHdCQUFBLFFBQUE7WUFDQTtnQkFDQSxHQUFBLGFBQUEsS0FBQSxjQUFBLHdCQUFBLEdBQUE7Z0JBQ0E7b0JBQ0EsZ0JBQUE7b0JBQ0E7Ozs7OztZQU1BLElBQUEsY0FBQSxXQUFBLEtBQUEsY0FBQTtZQUNBLElBQUEsU0FBQSxXQUFBLEtBQUEsY0FBQSx3QkFBQSxlQUFBLFFBQUEsU0FBQSxTQUFBLEtBQUEsY0FBQSx3QkFBQSxlQUFBO1lBQ0EsZUFBQTtZQUNBLEtBQUEsY0FBQSxRQUFBO1lBQ0EsZ0JBQUE7O1lBRUEsS0FBQSxjQUFBLHdCQUFBLE9BQUEsZUFBQTs7WUFFQSxFQUFBOzs7UUFHQSxLQUFBLHNCQUFBLFNBQUE7UUFDQTtZQUNBLEdBQUEsS0FBQSxjQUFBLDRCQUFBO1lBQ0E7Z0JBQ0EsR0FBQSxLQUFBLGNBQUEscUJBQUE7Z0JBQ0E7O29CQUVBLEtBQUE7OztnQkFHQTs7b0JBRUEsSUFBQSxvQkFBQTtvQkFDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxjQUFBLHdCQUFBLFFBQUEsS0FBQTt3QkFDQSxrQkFBQSxLQUFBOzRCQUNBLFlBQUEsS0FBQSxjQUFBLHdCQUFBLEdBQUE7NEJBQ0EsVUFBQSxLQUFBLGNBQUEsd0JBQUEsR0FBQTs7OztvQkFJQSxZQUFBLElBQUEsMkJBQUEsS0FBQSxDQUFBLG1CQUFBLG9CQUFBLEtBQUEsVUFBQSxNQUFBO3dCQUNBLFFBQUEsSUFBQSxLQUFBO3dCQUNBLElBQUEsS0FBQSxxQkFBQSxHQUFBOzs0QkFFQSxPQUFBLHFCQUFBLEtBQUE7NEJBQ0EsT0FBQSxhQUFBLEtBQUE7OzRCQUVBLGNBQUEsYUFBQSxHQUFBLHdCQUFBLFFBQUE7Z0NBQ0EsWUFBQTtvQ0FDQSxLQUFBLGNBQUEsY0FBQSxPQUFBOztvQ0FFQSxLQUFBOztnQ0FFQSxZQUFBOzs7Ozs2QkFLQTs7NEJBRUEsS0FBQTs7Ozs7Ozs7O0lBU0EsUUFBQSxPQUFBLG1CQUFBLFdBQUEsaUNBQUEsQ0FBQSxTQUFBLFVBQUEsVUFBQSxXQUFBLGVBQUEsZ0JBQUEsZUFBQSxpQkFBQSxxQkFBQSxnQkFBQTs7OztBQ2hXQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLDhCQUFBLE9BQUEsUUFBQSxRQUFBLFNBQUEsYUFBQSxhQUFBLGNBQUEsY0FBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOzs7UUFHQSxZQUFBLGdCQUFBO1FBQ0EsWUFBQSxlQUFBO1FBQ0EsWUFBQSxtQkFBQTtRQUNBLFlBQUEsaUJBQUEsTUFBQSxhQUFBOztRQUVBLFlBQUEsc0JBQUEsS0FBQSxTQUFBO1FBQ0E7WUFDQSxLQUFBLGdCQUFBOzs7UUFHQSxJQUFBLGdCQUFBOztRQUVBLEtBQUEsc0JBQUE7UUFDQTtZQUNBLEtBQUEsY0FBQSxNQUFBLEtBQUE7WUFDQTs7Z0JBRUEsYUFBQSxLQUFBO2dCQUNBLE9BQUEsR0FBQTtlQUNBO1lBQ0E7Z0JBQ0EsYUFBQSxLQUFBO2dCQUNBLFFBQUEsSUFBQTs7OztRQUlBLEtBQUEsc0JBQUE7UUFDQTtZQUNBLEtBQUEsY0FBQSxTQUFBLEtBQUE7WUFDQTtnQkFDQSxRQUFBLElBQUE7Z0JBQ0EsYUFBQSxLQUFBO2dCQUNBLE9BQUEsR0FBQTs7ZUFFQTtZQUNBO2dCQUNBLGFBQUEsS0FBQTtnQkFDQSxRQUFBLElBQUE7Ozs7UUFJQSxLQUFBLG9CQUFBLFNBQUE7UUFDQTtZQUNBLElBQUEsU0FBQSxjQUFBLFFBQUEsSUFBQSwwQkFBQTtZQUNBLE9BQUEsS0FBQTtZQUNBO2dCQUNBLEtBQUE7O1lBRUE7WUFDQTs7OztRQUlBLEtBQUEsZ0JBQUE7UUFDQTtZQUNBLEdBQUEsS0FBQSxjQUFBLFlBQUEsUUFBQSxLQUFBLGNBQUEsWUFBQTtZQUNBO2dCQUNBLEtBQUEsY0FBQSxRQUFBOzs7WUFHQTtnQkFDQSxHQUFBLEtBQUEsY0FBQSxVQUFBO3VCQUNBLEtBQUEsY0FBQSxVQUFBO3VCQUNBLEtBQUEsY0FBQSxRQUFBO2dCQUNBO29CQUNBLElBQUEsYUFBQSxnQkFBQSxLQUFBLGNBQUE7b0JBQ0EsY0FBQSxJQUFBLEtBQUEsY0FBQSxRQUFBLGFBQUE7Ozs7O1FBS0EsS0FBQSxhQUFBLFNBQUE7UUFDQTtZQUNBLFFBQUEsSUFBQSxLQUFBOztZQUVBLElBQUEsU0FBQTtnQkFDQSxZQUFBLEtBQUEsZ0JBQUE7Z0JBQ0EsVUFBQSxLQUFBO2dCQUNBLFNBQUEsS0FBQTs7O1lBR0EsWUFBQSxJQUFBLDJCQUFBLEtBQUEsQ0FBQSxtQkFBQSxDQUFBLFNBQUEsaUJBQUEsS0FBQSxjQUFBLEtBQUEsS0FBQSxTQUFBO1lBQ0E7Z0JBQ0EsUUFBQSxJQUFBLEtBQUE7O2dCQUVBLEdBQUEsS0FBQSxjQUFBLDRCQUFBLFdBQUEsRUFBQSxLQUFBLGNBQUEsMEJBQUE7Z0JBQ0EsS0FBQSxjQUFBLHdCQUFBLEtBQUE7OztnQkFHQSxHQUFBLEtBQUEsY0FBQSxVQUFBLGFBQUEsS0FBQSxjQUFBLFVBQUEsTUFBQSxFQUFBLEtBQUEsY0FBQSxRQUFBO2dCQUNBLElBQUEsY0FBQSxXQUFBLEtBQUEsY0FBQTtnQkFDQSxJQUFBLFNBQUEsV0FBQSxLQUFBLGdCQUFBLFNBQUEsU0FBQSxLQUFBO2dCQUNBLGVBQUE7Z0JBQ0EsS0FBQSxjQUFBLFFBQUE7Z0JBQ0EsZ0JBQUE7O2dCQUVBLEtBQUEsa0JBQUE7Z0JBQ0EsS0FBQSxtQkFBQTs7Z0JBRUEsR0FBQSxLQUFBLHFCQUFBO2dCQUNBOztvQkFFQSxPQUFBLHFCQUFBLEtBQUE7b0JBQ0EsT0FBQSxhQUFBLEtBQUE7O29CQUVBLGNBQUEsYUFBQSxHQUFBLHNCQUFBLFFBQUE7d0JBQ0E7d0JBQ0E7NEJBQ0EsUUFBQSxJQUFBOzs7O2VBSUE7WUFDQTtnQkFDQSxhQUFBLEtBQUE7Ozs7UUFJQSxLQUFBLGdCQUFBLFNBQUEsR0FBQTtRQUNBO1lBQ0EsSUFBQTtZQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLGNBQUEsd0JBQUEsUUFBQTtZQUNBO2dCQUNBLEdBQUEsYUFBQSxLQUFBLGNBQUEsd0JBQUEsR0FBQTtnQkFDQTtvQkFDQSxnQkFBQTtvQkFDQTs7Ozs7O1lBTUEsWUFBQSxJQUFBLG9DQUFBLEtBQUEsQ0FBQSxtQkFBQSxLQUFBLGNBQUEsSUFBQSxZQUFBLEtBQUEsY0FBQSx3QkFBQSxlQUFBLGFBQUEsS0FBQSxTQUFBO1lBQ0E7O2dCQUVBLElBQUEsY0FBQSxXQUFBLEtBQUEsY0FBQTtnQkFDQSxJQUFBLFNBQUEsV0FBQSxLQUFBLGNBQUEsd0JBQUEsZUFBQSxRQUFBLFNBQUEsU0FBQSxLQUFBLGNBQUEsd0JBQUEsZUFBQTtnQkFDQSxlQUFBO2dCQUNBLEtBQUEsY0FBQSxRQUFBO2dCQUNBLGdCQUFBOztnQkFFQSxLQUFBLGNBQUEsd0JBQUEsT0FBQSxlQUFBOztlQUVBO1lBQ0E7Z0JBQ0EsYUFBQSxLQUFBOzs7WUFHQSxFQUFBOzs7O0lBSUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsaUNBQUEsQ0FBQSxTQUFBLFVBQUEsVUFBQSxXQUFBLGVBQUEsZUFBQSxnQkFBQSxnQkFBQSxpQkFBQTs7OztBQ2hLQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLHdCQUFBLE9BQUEsUUFBQSxhQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7O1FBRUEsWUFBQSxxQkFBQTs7O0lBR0EsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkJBQUEsQ0FBQSxTQUFBLFVBQUEsZUFBQSxlQUFBOzs7O0FDVkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSxpQkFBQSxRQUFBLE9BQUEsUUFBQSxTQUFBLGFBQUEsYUFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOztRQUVBLEtBQUEsZUFBQTs7UUFFQSxHQUFBLE9BQUEsR0FBQTtRQUNBO1lBQ0E7O2FBRUEsR0FBQSxPQUFBLEdBQUE7UUFDQTtZQUNBOzthQUVBLEdBQUEsT0FBQSxHQUFBO1FBQ0E7WUFDQTs7YUFFQSxHQUFBLE9BQUEsR0FBQTtRQUNBO1lBQ0E7O2FBRUEsR0FBQSxPQUFBLEdBQUE7UUFDQTtZQUNBOzthQUVBLEdBQUEsT0FBQSxHQUFBO1FBQ0E7WUFDQTs7YUFFQSxHQUFBLE9BQUEsR0FBQTtRQUNBO1lBQ0E7OztRQUdBOzs7WUFHQTs7OztRQUlBLFNBQUE7UUFDQTtZQUNBLGFBQUEseUJBQUE7OztRQUdBLFNBQUE7UUFDQTs7WUFFQSxZQUFBLElBQUEsa0NBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7b0JBQ0EsUUFBQSxJQUFBO29CQUNBLEtBQUEsaUJBQUE7O2dCQUVBO2dCQUNBOzs7OztRQUtBLFNBQUE7UUFDQTtZQUNBLFFBQUEsSUFBQTs7O1FBR0EsU0FBQTtRQUNBO1lBQ0EsWUFBQSxnQkFBQTtZQUNBLFlBQUEsZUFBQTs7O1FBR0EsU0FBQTtRQUNBO1lBQ0EsYUFBQSxzQkFBQSxNQUFBOztZQUVBLHlCQUFBO1lBQ0EsaUJBQUE7WUFDQSx1QkFBQTs7WUFFQSxLQUFBLGFBQUE7WUFDQSxLQUFBLHdCQUFBLFNBQUEsU0FBQSxHQUFBLFFBQUE7WUFDQSxLQUFBLHNCQUFBLFNBQUE7OztRQUdBLFNBQUE7UUFDQTtZQUNBLGFBQUEsc0JBQUE7OztRQUdBLFNBQUE7UUFDQTtZQUNBLGFBQUEsdUJBQUE7OztRQUdBLFNBQUE7UUFDQTs7OztRQUlBLEtBQUEsaUJBQUE7UUFDQTtZQUNBLFFBQUEsSUFBQSxLQUFBO1lBQ0EsS0FBQSxVQUFBO1lBQ0EsS0FBQSxVQUFBOztZQUVBLFlBQUEsSUFBQSwwQkFBQSxLQUFBLEVBQUEsZ0JBQUEsS0FBQSxlQUFBLEtBQUEsU0FBQTtZQUNBO2dCQUNBLEtBQUEsVUFBQTtnQkFDQSxLQUFBLFVBQUEsS0FBQTs7OztZQUlBO1lBQ0E7Ozs7O1FBS0EsU0FBQSx3QkFBQTtRQUNBO1lBQ0EsWUFBQSxJQUFBLG1DQUFBLE1BQUEsS0FBQSxTQUFBO1lBQ0E7Z0JBQ0EsS0FBQSx1QkFBQTs7WUFFQTtZQUNBOzs7OztRQUtBLFNBQUEseUJBQUE7UUFDQTtZQUNBLFlBQUEsSUFBQSxvQ0FBQSxNQUFBLEtBQUEsU0FBQTtZQUNBO2dCQUNBLEtBQUEsd0JBQUE7OztnQkFHQSxRQUFBLElBQUE7O1lBRUE7WUFDQTs7Ozs7UUFLQSxTQUFBLGlCQUFBO1FBQ0E7WUFDQSxZQUFBLElBQUEsaUNBQUEsS0FBQSxFQUFBLGdCQUFBLEtBQUEsS0FBQSxTQUFBO2dCQUNBO29CQUNBLE1BQUEsaUJBQUE7b0JBQ0EsR0FBQSxNQUFBLGVBQUEsU0FBQTtvQkFDQTt3QkFDQSxJQUFBLElBQUEsTUFBQSxlQUFBO3dCQUNBLElBQUEsSUFBQSxJQUFBLEtBQUEsTUFBQSxlQUFBLEVBQUEsR0FBQSxNQUFBLE1BQUEsZUFBQSxFQUFBLEdBQUEsUUFBQSxHQUFBO3dCQUNBLE1BQUEsd0JBQUE7d0JBQ0EsTUFBQSx3QkFBQSxNQUFBLGVBQUEsRUFBQSxHQUFBO3dCQUNBLE1BQUEsc0JBQUEsSUFBQTs7O2dC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QUFBLGFBQUEsZUFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOzs7UUFHQSxZQUFBLFFBQUEsTUFBQSxhQUFBOztRQUVBLEtBQUEsYUFBQTtRQUNBO1lBQ0EsS0FBQSxNQUFBOztZQUVBLElBQUEsVUFBQSxLQUFBLE1BQUE7OztZQUdBLEdBQUE7WUFDQTtnQkFDQSxLQUFBLEtBQUEsTUFBQSxLQUFBO2dCQUNBO29CQUNBLGFBQUEsS0FBQTtvQkFDQSxPQUFBLEdBQUE7O21CQUVBO2dCQUNBO29CQUNBLGFBQUEsS0FBQTtvQkFDQSxRQUFBLElBQUE7Ozs7O1FBS0EsS0FBQSxhQUFBO1FBQ0E7WUFDQSxLQUFBLEtBQUEsU0FBQSxLQUFBO1lBQ0E7Z0JBQ0EsYUFBQSxLQUFBO2dCQUNBLE9BQUEsR0FBQTtlQUNBO1lBQ0E7Z0JBQ0EsYUFBQSxLQUFBOzs7Ozs7UUFNQSxLQUFBLG9CQUFBLFNBQUE7UUFDQTtZQUNBLElBQUEsU0FBQSxjQUFBLFFBQUEsSUFBQSxnQkFBQTtZQUNBLE9BQUEsS0FBQTtnQkFDQTtvQkFDQSxLQUFBOztnQkFFQTtnQkFDQTs7Ozs7O0lBTUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsd0JBQUEsQ0FBQSxTQUFBLFVBQUEsZ0JBQUEsZUFBQSxlQUFBLGlCQUFBLGdCQUFBOzs7O0FDNURBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEsZUFBQSxPQUFBLFFBQUEsYUFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOztRQUVBLFlBQUEsWUFBQTs7OztJQUlBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGtCQUFBLENBQUEsU0FBQSxVQUFBLGVBQUEsZUFBQTs7OztBQ1hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEsMEJBQUEsT0FBQSxRQUFBLGFBQUEsZUFBQSxjQUFBLFNBQUEsYUFBQSxtQkFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOztRQUVBLFlBQUEsZ0JBQUE7UUFDQSxZQUFBLGVBQUE7O1FBRUEsS0FBQSxlQUFBLGtCQUFBO1FBQ0EsS0FBQSxZQUFBOztRQUVBLEtBQUEsYUFBQSxTQUFBLE1BQUE7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S0EsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdUJBQUEsQ0FBQSxTQUFBLFVBQUEsZUFBQSxlQUFBLFdBQUE7OztBQUdBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLFxyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgJ2FwcC5jb250cm9sbGVycycsXHJcbiAgICAgICAgICAgICdhcHAuZmlsdGVycycsXHJcbiAgICAgICAgICAgICdhcHAuc2VydmljZXMnLFxyXG4gICAgICAgICAgICAnYXBwLmRpcmVjdGl2ZXMnLFxyXG4gICAgICAgICAgICAnYXBwLnJvdXRlcycsXHJcbiAgICAgICAgICAgICdhcHAuY29uZmlnJ1xyXG4gICAgICAgIF0pLmNvbnN0YW50KCdteUNvbmZpZycsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAnbWF0ZXJpYWxTZXRzTFNLZXknOiAnbWF0ZXJpYWxTZXRzJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnLCBbJ3VpLnJvdXRlcicsICdzYXRlbGxpemVyJywgJ3Jlc3Rhbmd1bGFyJywgJ2FuZ3VsYXItbW9tZW50anMnLCAnbmdNYXRlcmlhbCcsICduZ0ZpbGVVcGxvYWQnXSk7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycsIFsndWkucm91dGVyJywgJ3NhdGVsbGl6ZXInXSk7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJywgWyd1aS5yb3V0ZXInLCAnbmdNYXRlcmlhbCcsICdyZXN0YW5ndWxhcicsICdhbmd1bGFyLW1vbWVudGpzJywgJ2FwcC5zZXJ2aWNlcycsICduZ01lc3NhZ2VzJywgJ25nTWRJY29ucycsICdtZC5kYXRhLnRhYmxlJywgJ2hpZ2hjaGFydHMtbmcnLCAnbmdDb29raWVzJ10pO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJywgW10pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycsIFsnYW5ndWxhci1tb21lbnRqcycsICduZ0FuaW1hdGUnXSk7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycsIFtdKTtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIENvbmZpZ3VyYXRpb24gc3R1ZmZcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uICgkYXV0aFByb3ZpZGVyKVxyXG4gICAge1xyXG4gICAgICAgIC8vIFNhdGVsbGl6ZXIgY29uZmlndXJhdGlvbiB0aGF0IHNwZWNpZmllcyB3aGljaCBBUElcclxuICAgICAgICAvLyByb3V0ZSB0aGUgSldUIHNob3VsZCBiZSByZXRyaWV2ZWQgZnJvbVxyXG4gICAgICAgICRhdXRoUHJvdmlkZXIubG9naW5VcmwgPSAnL2FwaS9hdXRoZW50aWNhdGUnO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24gKCRtb21lbnRQcm92aWRlcilcclxuICAgIHtcclxuICAgICAgICAkbW9tZW50UHJvdmlkZXJcclxuICAgICAgICAgICAgLmFzeW5jTG9hZGluZyhmYWxzZSlcclxuICAgICAgICAgICAgLnNjcmlwdFVybCgnLy9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvbW9tZW50LmpzLzIuNS4xL21vbWVudC5taW4uanMnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKCBmdW5jdGlvbihSZXN0YW5ndWxhclByb3ZpZGVyKSB7XHJcbiAgICAgICAgUmVzdGFuZ3VsYXJQcm92aWRlclxyXG4gICAgICAgICAgICAuc2V0QmFzZVVybCgnL2FwaS8nKVxyXG4gICAgICAgICAgICAuc2V0RGVmYXVsdEhlYWRlcnMoeyBhY2NlcHQ6IFwiYXBwbGljYXRpb24veC5sYXJhdmVsLnYxK2pzb25cIiB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKCBmdW5jdGlvbigkbWRUaGVtaW5nUHJvdmlkZXIpIHtcclxuICAgICAgICAvKiBGb3IgbW9yZSBpbmZvLCB2aXNpdCBodHRwczovL21hdGVyaWFsLmFuZ3VsYXJqcy5vcmcvIy9UaGVtaW5nLzAxX2ludHJvZHVjdGlvbiAqL1xyXG5cclxuICAgICAgICB2YXIgY3VzdG9tQmx1ZU1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCdsaWdodC1ibHVlJyxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICdjb250cmFzdERlZmF1bHRDb2xvcic6ICdsaWdodCcsXHJcbiAgICAgICAgICAgICdjb250cmFzdERhcmtDb2xvcnMnOiBbJzUwJ10sXHJcbiAgICAgICAgICAgICc1MCc6ICdmZmZmZmYnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCdjdXN0b21CbHVlJywgY3VzdG9tQmx1ZU1hcCk7XHJcbiAgICAgICAgJG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0JylcclxuICAgICAgICAgICAgLnByaW1hcnlQYWxldHRlKCdjdXN0b21CbHVlJyxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgJ2RlZmF1bHQnOiAnNTAwJyxcclxuICAgICAgICAgICAgICAgICdodWUtMSc6ICc1MCdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmFjY2VudFBhbGV0dGUoJ3BpbmsnKTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbigkbWREYXRlTG9jYWxlUHJvdmlkZXIpXHJcbiAgICB7XHJcbiAgICAgICAgJG1kRGF0ZUxvY2FsZVByb3ZpZGVyLmZvcm1hdERhdGUgPSBmdW5jdGlvbihkYXRlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoZGF0ZSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUpLmZvcm1hdCgnTU0tREQtWVlZWScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIENoZWNrIGZvciBhdXRoZW50aWNhdGVkIHVzZXIgb24gZXZlcnkgcmVxdWVzdFxyXG4gICAgYXBwLnJ1bihbJyRyb290U2NvcGUnLCAnJGxvY2F0aW9uJywgJyRzdGF0ZScsICdBdXRoU2VydmljZScsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkbG9jYXRpb24sICRzdGF0ZSwgQXV0aFNlcnZpY2UpIHtcclxuXHJcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zLCBvcHRpb25zKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnQXR0ZW1wdGluZyB0byBnZXQgdXJsOiBbJyArIHRvU3RhdGUubmFtZSArICddJyk7XHJcbiAgICAgICAgICAgIC8vIExldCBhbnlvbmUgZ28gdG8gdGhlIGxvZ2luIHBhZ2UsIGNoZWNrIGF1dGggb24gYWxsIG90aGVyIHBhZ2VzXHJcbiAgICAgICAgICAgIGlmKHRvU3RhdGUubmFtZSAhPT0gJ2FwcC5sb2dpbicpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKCFBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInVzZXIgbm90IGxvZ2dlZCBpbiwgcmVkaXJlY3QgdG8gbG9naW4gcGFnZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmxvZ2luJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1dKTtcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uKClcclxue1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycpLmNvbmZpZyggZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGF1dGhQcm92aWRlciApIHtcclxuXHJcbiAgICAgICAgdmFyIGdldFZpZXcgPSBmdW5jdGlvbiggdmlld05hbWUgKXtcclxuICAgICAgICAgICAgcmV0dXJuICcvdmlld3MvYXBwLycgKyB2aWV3TmFtZSArICcuaHRtbCc7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL3B1cmNoYXNlb3JkZXJzJyk7XHJcblxyXG5cclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcCcsIHtcclxuICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2hlYWRlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSGVhZGVyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxIZWFkZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBmb290ZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2Zvb3RlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRm9vdGVyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxGb290ZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBtYWluOiB7fVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5sb2dpbicsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9sb2dpbicsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xvZ2luJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsTG9naW4nXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5sYW5kaW5nJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2xhbmRpbmcnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdsYW5kaW5nJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMYW5kaW5nQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxMYW5kaW5nJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucHJvZHVjdHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcHJvZHVjdHMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwcm9kdWN0cycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUHJvZHVjdCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnByb2R1Y3RzLmRldGFpbCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9kZXRhaWwvOnByb2R1Y3RJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3Byb2R1Y3QuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9kdWN0RGV0YWlsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQcm9kdWN0RGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucHJvZHVjdHMuY3JlYXRlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NyZWF0ZScsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3Byb2R1Y3QuY3JlYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9kdWN0Q3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQcm9kdWN0Q3JlYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuY3VzdG9tZXJzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2N1c3RvbWVycycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2N1c3RvbWVycycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ3VzdG9tZXJDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybEN1c3RvbWVyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuY3VzdG9tZXJzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdjdXN0b21lci5jcmVhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0N1c3RvbWVyQ3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxDdXN0b21lckNyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmN1c3RvbWVycy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzpjdXN0b21lcklkJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnY3VzdG9tZXIuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDdXN0b21lckRldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsQ3VzdG9tZXJEZXRhaWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC53b3Jrb3JkZXJzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3dvcmtvcmRlcnMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd3b3Jrb3JkZXJzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdXb3JrT3JkZXJDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFdvcmtPcmRlcidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLndvcmtvcmRlcnMuY3JlYXRlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NyZWF0ZScsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3dvcmtvcmRlci5jcmVhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtPcmRlckNyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsV29ya09yZGVyQ3JlYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAud29ya29yZGVycy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzp3b3JrT3JkZXJJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3dvcmtvcmRlci5kZXRhaWwnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtPcmRlckRldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsV29ya09yZGVyRGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuZXZlbnRzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2V2ZW50cycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2V2ZW50cycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRXZlbnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybEV2ZW50J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuZXZlbnRzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdldmVudC5jcmVhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0V2ZW50Q3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxFdmVudENyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmV2ZW50cy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzpldmVudElkJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnZXZlbnQuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFdmVudERldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsRXZlbnREZXRhaWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5yZXBvcnRzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3JlcG9ydHMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdyZXBvcnRzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXBvcnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFJlcG9ydCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnJlcG9ydHMuY3VycmVudHN0b2NrJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2N1cnJlbnRzdG9jaycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3JlcG9ydC5jdXJyZW50c3RvY2snKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcG9ydENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUmVwb3J0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucmVwb3J0cy5zYWxlcycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9zYWxlcycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3JlcG9ydC5zYWxlcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVwb3J0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxSZXBvcnQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5yZXBvcnRzLnNhbGVzYnltb250aCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9zYWxlc2J5bW9udGgnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdyZXBvcnQuc2FsZXNieW1vbnRoJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXBvcnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFJlcG9ydCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnJlcG9ydHMuaW5jb21lYnltb250aCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9pbmNvbWVieW1vbnRoJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncmVwb3J0LmluY29tZWJ5bW9udGgnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcG9ydENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUmVwb3J0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucmVwb3J0cy5wcm9kdWN0cHJvZml0cGVyY2VudHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcHJvZHVjdHByb2ZpdHBlcmNlbnRzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncmVwb3J0LnByb2R1Y3Rwcm9maXRwZXJjZW50cycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVwb3J0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxSZXBvcnQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5yZXBvcnRzLndlZWt3b3Jrb3JkZXJzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3dlZWt3b3Jrb3JkZXJzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncmVwb3J0LndlZWt3b3Jrb3JkZXJzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXBvcnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFJlcG9ydCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnJlcG9ydHMuYW9zJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2FvcycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3JlcG9ydC5hb3MnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcG9ydENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUmVwb3J0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAudW5pdHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvdW5pdHMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd1bml0cycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVW5pdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsVW5pdCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnVuaXRzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd1bml0LmNyZWF0ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVW5pdENyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsVW5pdENyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnVuaXRzLmRldGFpbCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9kZXRhaWwvOnVuaXRJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3VuaXQuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdVbml0RGV0YWlsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxVbml0RGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAubWF0ZXJpYWxzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL21hdGVyaWFscycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ21hdGVyaWFscycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWF0ZXJpYWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybE1hdGVyaWFsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAubWF0ZXJpYWxzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdtYXRlcmlhbC5jcmVhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01hdGVyaWFsQ3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxNYXRlcmlhbENyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLm1hdGVyaWFscy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzptYXRlcmlhbElkJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnbWF0ZXJpYWwuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNYXRlcmlhbERldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsTWF0ZXJpYWxEZXRhaWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5wdXJjaGFzZW9yZGVycycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9wdXJjaGFzZW9yZGVycycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3B1cmNoYXNlb3JkZXJzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQdXJjaGFzZU9yZGVyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQdXJjaGFzZU9yZGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucHVyY2hhc2VvcmRlcnMuY3JlYXRlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NyZWF0ZScsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3B1cmNoYXNlb3JkZXIuY3JlYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQdXJjaGFzZU9yZGVyQ3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQdXJjaGFzZU9yZGVyQ3JlYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucHVyY2hhc2VvcmRlcnMuZGV0YWlsJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2RldGFpbC86cHVyY2hhc2VPcmRlcklkJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncHVyY2hhc2VvcmRlci5kZXRhaWwnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1B1cmNoYXNlT3JkZXJEZXRhaWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFB1cmNoYXNlT3JkZXJEZXRhaWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5wYXltZW50dHlwZXMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcGF5bWVudHR5cGVzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncGF5bWVudHR5cGVzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQYXltZW50VHlwZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUGF5bWVudFR5cGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5wYXltZW50dHlwZXMuY3JlYXRlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NyZWF0ZScsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3BheW1lbnR0eXBlLmNyZWF0ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUGF5bWVudFR5cGVDcmVhdGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFBheW1lbnRUeXBlQ3JlYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucGF5bWVudHR5cGVzLmRldGFpbCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9kZXRhaWwvOnBheW1lbnRUeXBlSWQnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwYXltZW50dHlwZS5kZXRhaWwnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1BheW1lbnRUeXBlRGV0YWlsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQYXltZW50VHlwZURldGFpbCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmxvb2t1cHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvbG9va3VwcycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xvb2t1cHMnKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAubWF0ZXJpYWxzZXRzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL21hdGVyaWFsc2V0cycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ21hdGVyaWFsc2V0cycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWF0ZXJpYWxTZXRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybE1hdGVyaWFsU2V0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuYm9va2VkZGF0ZXMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYm9va2VkZGF0ZXMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdib29rZWRkYXRlcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQm9va2VkRGF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsQm9va2VkRGF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLm1hdGVyaWFsY2hlY2tsaXN0Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL21hdGVyaWFsY2hlY2tsaXN0JyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnbWF0ZXJpYWxjaGVja2xpc3QnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01hdGVyaWFsQ2hlY2tsaXN0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxNYXRlcmlhbENoZWNrbGlzdCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICA7XHJcblxyXG4gICAgfSApO1xyXG59KSgpOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnbUFwcExvYWRpbmcnLCBmdW5jdGlvbiAoJGFuaW1hdGUpXHJcbntcclxuICAgIC8vIFJldHVybiB0aGUgZGlyZWN0aXZlIGNvbmZpZ3VyYXRpb24uXHJcbiAgICByZXR1cm4oe1xyXG4gICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgcmVzdHJpY3Q6IFwiQ1wiXHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiBsaW5rKCBzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcyApXHJcbiAgICB7XHJcbiAgICAgICAgLy8gRHVlIHRvIHRoZSB3YXkgQW5ndWxhckpTIHByZXZlbnRzIGFuaW1hdGlvbiBkdXJpbmcgdGhlIGJvb3RzdHJhcFxyXG4gICAgICAgIC8vIG9mIHRoZSBhcHBsaWNhdGlvbiwgd2UgY2FuJ3QgYW5pbWF0ZSB0aGUgdG9wLWxldmVsIGNvbnRhaW5lcjsgYnV0LFxyXG4gICAgICAgIC8vIHNpbmNlIHdlIGFkZGVkIFwibmdBbmltYXRlQ2hpbGRyZW5cIiwgd2UgY2FuIGFuaW1hdGVkIHRoZSBpbm5lclxyXG4gICAgICAgIC8vIGNvbnRhaW5lciBkdXJpbmcgdGhpcyBwaGFzZS5cclxuICAgICAgICAvLyAtLVxyXG4gICAgICAgIC8vIE5PVEU6IEFtIHVzaW5nIC5lcSgxKSBzbyB0aGF0IHdlIGRvbid0IGFuaW1hdGUgdGhlIFN0eWxlIGJsb2NrLlxyXG4gICAgICAgICRhbmltYXRlLmxlYXZlKCBlbGVtZW50LmNoaWxkcmVuKCkuZXEoIDEgKSApLnRoZW4oXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNsZWFudXBBZnRlckFuaW1hdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgcm9vdCBkaXJlY3RpdmUgZWxlbWVudC5cclxuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ2xlYXIgdGhlIGNsb3NlZC1vdmVyIHZhcmlhYmxlIHJlZmVyZW5jZXMuXHJcbiAgICAgICAgICAgICAgICBzY29wZSA9IGVsZW1lbnQgPSBhdHRyaWJ1dGVzID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG59KTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBieW91bmcgb24gMy8xOC8yMDE2LlxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnZm9jdXNPbicsIGZ1bmN0aW9uICgpXHJcbntcclxuICAgIHJldHVybiBmdW5jdGlvbihzY29wZSwgZWxlbSwgYXR0cilcclxuICAgIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhhdHRyLmZvY3VzT24pO1xyXG5cclxuICAgICAgICBzY29wZS4kb24oJ2ZvY3VzT24nLCBmdW5jdGlvbihlLCBuYW1lKVxyXG4gICAgICAgIHtcclxuXHJcbmNvbnNvbGUubG9nKCduYW1lIGlzJyArIG5hbWUpO1xyXG4gICAgICAgICAgICBpZihuYW1lID09PSBhdHRyLmZvY3VzT24pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZm91bmQgZWxlbVwiKTtcclxuICAgICAgICAgICAgICAgIGVsZW1bMF0uZm9jdXMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJylcclxuICAgIC5kaXJlY3RpdmUoJ3V0Y1BhcnNlcicsIGZ1bmN0aW9uICgpXHJcbiAgICB7XHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMsIG5nTW9kZWwpIHtcclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJJbiB1dGNQYXJzZXIgZGlyZWN0aXZlXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHBhcnNlciA9IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICAgICAgICAgIHZhbCA9IG1vbWVudC51dGModmFsKS5mb3JtYXQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB2YXIgZm9ybWF0dGVyID0gZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF2YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFsID0gbmV3IERhdGUodmFsKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBuZ01vZGVsLiRwYXJzZXJzLnVuc2hpZnQocGFyc2VyKTtcclxuICAgICAgICAgICAgbmdNb2RlbC4kZm9ybWF0dGVycy51bnNoaWZ0KGZvcm1hdHRlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXF1aXJlOiAnbmdNb2RlbCcsXHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQSdcclxuICAgICAgICB9O1xyXG4gICAgfSk7IiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImFwcC5maWx0ZXJzXCIpLmZpbHRlcigndHJ1bmNhdGVOYW1lJywgZnVuY3Rpb24oKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihpbnB1dCwgbWF4TGVuZ3RoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW5wdXQgPSBpbnB1dCB8fCBcIlwiO1xyXG4gICAgICAgICAgICB2YXIgb3V0ID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGlmKGlucHV0Lmxlbmd0aCA+IG1heExlbmd0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgb3V0ID0gaW5wdXQuc3Vic3RyKDAsIG1heExlbmd0aCkgKyBcIi4uLlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgb3V0ID0gaW5wdXQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxufSkoKTtcclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgYnlvdW5nIG9uIDMvMTQvMjAxNi5cclxuICovXHJcbihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnQXV0aFNlcnZpY2UnLCBbJyRhdXRoJywgJyRzdGF0ZScsIGZ1bmN0aW9uKCRhdXRoLCAkc3RhdGUpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgICAgIGxvZ2luOiBmdW5jdGlvbihlbWFpbCwgcGFzc3dvcmQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBjcmVkZW50aWFscyA9IHsgZW1haWw6IGVtYWlsLCBwYXNzd29yZDogcGFzc3dvcmQgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGNyZWRlbnRpYWxzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBVc2UgU2F0ZWxsaXplcidzICRhdXRoIHNlcnZpY2UgdG8gbG9naW4gYmVjYXVzZSBpdCdsbCBhdXRvbWF0aWNhbGx5IHNhdmUgdGhlIEpXVCBpbiBsb2NhbFN0b3JhZ2VcclxuICAgICAgICAgICAgICAgIHJldHVybiAkYXV0aC5sb2dpbihjcmVkZW50aWFscyk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBpc0F1dGhlbnRpY2F0ZWQ6IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRhdXRoLmlzQXV0aGVudGljYXRlZCgpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgbG9nb3V0OiBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICRhdXRoLmxvZ291dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XSk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEJyZWVuIG9uIDE1LzAyLzIwMTYuXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdDaGFydFNlcnZpY2UnLCBbJyRhdXRoJywgJ1Jlc3Rhbmd1bGFyJywgJyRtb21lbnQnLCBmdW5jdGlvbigkYXV0aCwgUmVzdGFuZ3VsYXIsICRtb21lbnQpe1xyXG5cclxuICAgICAgICB2YXIgcGllQ29uZmlnID0ge1xyXG4gICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICBjaGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwaWUnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcGxvdE9wdGlvbnM6XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGllOlxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxsb3dQb2ludFNlbGVjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFMYWJlbHM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0luTGVnZW5kOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGl0bGU6XHJcbiAgICAgICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxvYWRpbmc6IHRydWUsXHJcbiAgICAgICAgICAgIHNpemU6XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiA0MDAsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDI1MFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcblxyXG4gICAgICAgICAgICBnZXRNb250aGx5U2FsZXNSZXBvcnQ6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICAgICAgc2NvcGUuY2hhcnRDb25maWcgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NvbHVtbidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeUF4aXM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbjogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICcjIG9mIHNhbGVzJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB4QXhpczpcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RhdGV0aW1lJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGVUaW1lTGFiZWxGb3JtYXRzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoOiAnJWInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHllYXI6ICclYidcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnRGF0ZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcDpcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdTYWxlcyBwZXIgbW9udGgnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3JlcG9ydHMvZ2V0TW9udGhseVNhbGVzUmVwb3J0JykucG9zdCh7ICdyZXBvcnRQYXJhbXMnOiB7fX0pLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YVNldCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9uZURhdGFQb2ludCA9IGRhdGFbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cob25lRGF0YVBvaW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVNldC5wdXNoKFtEYXRlLlVUQyhwYXJzZUludChvbmVEYXRhUG9pbnQueWVhciksIHBhcnNlSW50KG9uZURhdGFQb2ludC5tb250aCkgLSAxKSwgcGFyc2VJbnQob25lRGF0YVBvaW50LnBvY291bnQpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jaGFydENvbmZpZy5zZXJpZXMgPSBbe25hbWU6ICdTYWxlcyB0aGlzIG1vbnRoJywgZGF0YTogZGF0YVNldCB9XTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2hhcnRDb25maWcubG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRXJyb3JcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0TW9udGhseUluY29tZVJlcG9ydDogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgICAgICBzY29wZS5jaGFydENvbmZpZyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29sdW1uJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5QXhpczpcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJyQgYW1vdW50J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB4QXhpczpcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RhdGV0aW1lJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGVUaW1lTGFiZWxGb3JtYXRzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoOiAnJWInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHllYXI6ICclYidcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnRGF0ZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcDpcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdJbmNvbWUgcGVyIG1vbnRoJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmc6IHRydWVcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdyZXBvcnRzL2dldE1vbnRobHlTYWxlc1JlcG9ydCcpLnBvc3QoeyAncmVwb3J0UGFyYW1zJzoge319KS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YVNldCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9uZURhdGFQb2ludCA9IGRhdGFbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKG9uZURhdGFQb2ludCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhU2V0LnB1c2goW0RhdGUuVVRDKHBhcnNlSW50KG9uZURhdGFQb2ludC55ZWFyKSwgcGFyc2VJbnQob25lRGF0YVBvaW50Lm1vbnRoKSAtIDEpLCBwYXJzZUZsb2F0KG9uZURhdGFQb2ludC5tb250aHRvdGFsKV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5jaGFydENvbmZpZy5zZXJpZXMgPSBbe25hbWU6ICdJbmNvbWUgdGhpcyBtb250aCcsIGRhdGE6IGRhdGFTZXQgfV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5jaGFydENvbmZpZy5sb2FkaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRXJyb3JcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldFRvcFNlbGxpbmdQcm9kdWN0czogZnVuY3Rpb24oc2NvcGUsIGNoYXJ0VGl0bGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYXJ0VGl0bGUpO1xyXG4gICAgICAgICAgICAgICAgc2NvcGUudG9wU2VsbGluZ0NoYXJ0Q29uZmlnID0ge307XHJcbiAgICAgICAgICAgICAgICBzY29wZS50b3BTZWxsaW5nQ2hhcnRDb25maWcgPSBqUXVlcnkuZXh0ZW5kKHRydWUsIHt9LCBwaWVDb25maWcpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3JlcG9ydHMvZ2V0VG9wU2VsbGluZ1Byb2R1Y3RzJykuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhU2V0ID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb25lRGF0YVBvaW50ID0gZGF0YVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhvbmVEYXRhUG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhU2V0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogb25lRGF0YVBvaW50Lm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZDogKGkgPT09IDApID8gdHJ1ZSA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xpY2VkOiAoaSA9PT0gMCkgPyB0cnVlIDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBwYXJzZUludChvbmVEYXRhUG9pbnQucGNvdW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnRvcFNlbGxpbmdDaGFydENvbmZpZy5zZXJpZXMgPSBbe25hbWU6ICdTb2xkJywgZGF0YTogZGF0YVNldCB9XTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS50b3BTZWxsaW5nQ2hhcnRDb25maWcudGl0bGUudGV4dCA9IGNoYXJ0VGl0bGU7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUudG9wU2VsbGluZ0NoYXJ0Q29uZmlnLmxvYWRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEVycm9yXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldFByb2R1Y3RQcm9maXRQZXJjZW50czogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLnByb2R1Y3RQcm9maXRQZXJjZW50Q2hhcnRDb25maWcgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NvbHVtbidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB4QXhpczpcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NhdGVnb3J5J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5QXhpczpcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnUHJvZml0ICUnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnUHJvZHVjdCBQcm9maXQgJSdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3JlcG9ydHMvZ2V0UHJvZHVjdFByb2ZpdFBlcmNlbnRzJykuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFTZXQgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvbmVEYXRhUG9pbnQgPSBkYXRhW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKG9uZURhdGFQb2ludC5jb3N0ID4gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvZml0ID0gb25lRGF0YVBvaW50LnByaWNlIC0gb25lRGF0YVBvaW50LmNvc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByb2ZpdFBlcmNlbnQgPSAocHJvZml0IC8gb25lRGF0YVBvaW50LmNvc3QgKiAxMDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdQcmljZTonICsgb25lRGF0YVBvaW50LnByaWNlICsgJyBDb3N0OicgKyBvbmVEYXRhUG9pbnQuY29zdCArICcgUHJvZml0OicgKyBNYXRoLnJvdW5kKHByb2ZpdFBlcmNlbnQgKiAxMDApIC8gMTAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdQcmljZTonICsgb25lRGF0YVBvaW50LnByaWNlICsgJyBDb3N0OicgKyBvbmVEYXRhUG9pbnQuY29zdCArICcgUHJvZml0OicgKyBwcm9maXRQZXJjZW50LnRvRml4ZWQoMCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhU2V0LnB1c2goW29uZURhdGFQb2ludC5uYW1lLCBwYXJzZUludChwcm9maXRQZXJjZW50LnRvRml4ZWQoMCkpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFTZXQuc29ydChmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQoYlsxXSkgLSBwYXJzZUludChhWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhU2V0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnByb2R1Y3RQcm9maXRQZXJjZW50Q2hhcnRDb25maWcuc2VyaWVzID0gW3tuYW1lOiAnUHJvZml0ICUnLCBkYXRhOiBkYXRhU2V0IH1dO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5wcm9kdWN0UHJvZml0UGVyY2VudENoYXJ0Q29uZmlnLmxvYWRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH07XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgQnJlZW4gb24gMTUvMDIvMjAxNi5cclxuICovXHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0RpYWxvZ1NlcnZpY2UnLCBmdW5jdGlvbiggJG1kRGlhbG9nICl7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcblxyXG4gICAgICAgICAgICBmcm9tQ3VzdG9tOiBmdW5jdGlvbihvcHRpb25zKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJG1kRGlhbG9nLnNob3cob3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBmcm9tVGVtcGxhdGU6IGZ1bmN0aW9uKGV2LCB0ZW1wbGF0ZSwgc2NvcGUgKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaWFsb2dzLycgKyB0ZW1wbGF0ZSArICcuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZXNjYXBlVG9DbG9zZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gRGlhbG9nQ29udHJvbGxlcigkc2NvcGUsICRtZERpYWxvZylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jb25maXJtRGlhbG9nID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jYW5jZWxEaWFsb2cgPSBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRtZERpYWxvZy5jYW5jZWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGV2ICE9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudGFyZ2V0RXZlbnQgPSBldjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIHNjb3BlIClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnNjb3BlID0gc2NvcGUuJG5ldygpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vb3B0aW9ucy5wcmVzZXJ2ZVNjb3BlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJG1kRGlhbG9nLnNob3cob3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBoaWRlOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRtZERpYWxvZy5oaWRlKCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhbGVydDogZnVuY3Rpb24odGl0bGUsIGNvbnRlbnQpe1xyXG4gICAgICAgICAgICAgICAgJG1kRGlhbG9nLnNob3coXHJcbiAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmFsZXJ0KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRpdGxlKHRpdGxlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY29udGVudChjb250ZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAub2soJ09rJylcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBjb25maXJtOiBmdW5jdGlvbihldmVudCwgdGl0bGUsIGNvbnRlbnQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb25maXJtID0gJG1kRGlhbG9nLmNvbmZpcm0oKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aXRsZSh0aXRsZSlcclxuICAgICAgICAgICAgICAgICAgICAudGV4dENvbnRlbnQoY29udGVudClcclxuICAgICAgICAgICAgICAgICAgICAuYXJpYUxhYmVsKCcnKVxyXG4gICAgICAgICAgICAgICAgICAgIC50YXJnZXRFdmVudChldmVudClcclxuICAgICAgICAgICAgICAgICAgICAub2soJ1llcycpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhbmNlbCgnTm8nKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJG1kRGlhbG9nLnNob3coY29uZmlybSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG59KSgpOyIsIlxyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0ZvY3VzU2VydmljZScsIFsnJHJvb3RTY29wZScsICckdGltZW91dCcsIGZ1bmN0aW9uKCRyb290U2NvcGUsICR0aW1lb3V0KVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihuYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuICR0aW1lb3V0KGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRyb290U2NvcGUuJGJyb2FkY2FzdCgnZm9jdXNPbicsIG5hbWUpO1xyXG4gICAgICAgICAgICB9LDEwMCk7XHJcbiAgICAgICAgfTtcclxuICAgIH1dKTtcclxufSkoKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBieW91bmcgb24gMy8xNC8yMDE2LlxyXG4gKi9cclxuKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdHdWlkU2VydmljZScsIFtmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gczQoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKDEgKyBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDApXHJcbiAgICAgICAgICAgICAgICAudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgICAgICAgICAuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgICAgIG5ld0d1aWQ6IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHM0KCkgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArIHM0KCkgKyAnLScgK1xyXG4gICAgICAgICAgICAgICAgICAgIHM0KCkgKyAnLScgKyBzNCgpICsgczQoKSArIHM0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1dKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgQnJlZW4gb24gMTUvMDIvMjAxNi5cclxuICovXHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ1Jlc3RTZXJ2aWNlJywgWyckYXV0aCcsICdSZXN0YW5ndWxhcicsICckbW9tZW50JywgZnVuY3Rpb24oJGF1dGgsIFJlc3Rhbmd1bGFyLCAkbW9tZW50KXtcclxuXHJcbiAgICAgICAgdmFyIGJhc2VQcm9kdWN0cyA9IFJlc3Rhbmd1bGFyLmFsbCgncHJvZHVjdCcpO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICAgICAgZ2V0QWxsUHJvZHVjdHM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBiYXNlUHJvZHVjdHMuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnByb2R1Y3RzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0UHJvZHVjdDogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3Byb2R1Y3QnLCBpZCkuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSGFjayBmb3IgT0xEIG15c3FsIGRyaXZlcnMgb24gSG9zdGdhdG9yIHdoaWNoIGRvbid0IHByb3Blcmx5IGVuY29kZSBpbnRlZ2VyIGFuZCByZXR1cm4gdGhlbSBhcyBzdHJpbmdzXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5pc19jdXN0b20gPSBwYXJzZUludChkYXRhLmlzX2N1c3RvbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvZHVjdCA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEFsbEN1c3RvbWVyczogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnY3VzdG9tZXInKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY3VzdG9tZXJzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0Q3VzdG9tZXI6IGZ1bmN0aW9uKHNjb3BlLCBpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdjdXN0b21lcicsIGlkKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXN0b21lciA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEFsbFdvcmtPcmRlcnM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3dvcmtvcmRlcicpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS53b3Jrb3JkZXJzID0gZGF0YTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzY29wZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldFdvcmtPcmRlcjogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3dvcmtvcmRlcicsIGlkKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRm9ybWF0IHN0cmluZyBkYXRlcyBpbnRvIGRhdGUgb2JqZWN0c1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuc3RhcnRfZGF0ZSA9ICRtb21lbnQoZGF0YS5zdGFydF9kYXRlKTtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLmVuZF9kYXRlID0gJG1vbWVudChkYXRhLmVuZF9kYXRlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSGFjayBmb3IgT0xEIG15c3FsIGRyaXZlcnMgb24gSG9zdGdhdG9yIHdoaWNoIGRvbid0IHByb3Blcmx5IGVuY29kZSBpbnRlZ2VyIGFuZCByZXR1cm4gdGhlbSBhcyBzdHJpbmdzXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5jb21wbGV0ZWQgPSBwYXJzZUludChkYXRhLmNvbXBsZXRlZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYud29ya29yZGVyID0gZGF0YTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLndvcmtvcmRlciA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEFsbEV2ZW50czogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnZXZlbnQnKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuZXZlbnRzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0RXZlbnQ6IGZ1bmN0aW9uKHNjb3BlLCBpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdldmVudCcsIGlkKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5ldmVudCA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEFsbFVuaXRzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCd1bml0JykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnVuaXRzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0VW5pdDogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3VuaXQnLCBpZCkuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUudW5pdCA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEFsbE1hdGVyaWFsczogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnbWF0ZXJpYWwnKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUubWF0ZXJpYWxzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0TWF0ZXJpYWw6IGZ1bmN0aW9uKHNjb3BlLCBpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdtYXRlcmlhbCcsIGlkKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5tYXRlcmlhbCA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGRvU2VhcmNoOiBmdW5jdGlvbihzY29wZSwgcXVlcnkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2FsbCBXUyB3aXRoOiBcIiArIHF1ZXJ5KTtcclxuXHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3NlYXJjaCcsIHF1ZXJ5KS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEFsbFB1cmNoYXNlT3JkZXJzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdwdXJjaGFzZW9yZGVyJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnB1cmNoYXNlb3JkZXJzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0UHVyY2hhc2VPcmRlcjogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3B1cmNoYXNlb3JkZXInLCBpZCkuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEZvcm1hdCBzdHJpbmcgZGF0ZXMgaW50byBkYXRlIG9iamVjdHNcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLnBpY2t1cF9kYXRlID0gJG1vbWVudChkYXRhLnBpY2t1cF9kYXRlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSGFjayBmb3IgT0xEIG15c3FsIGRyaXZlcnMgb24gSG9zdGdhdG9yIHdoaWNoIGRvbid0IHByb3Blcmx5IGVuY29kZSBpbnRlZ2VyIGFuZCByZXR1cm4gdGhlbSBhcyBzdHJpbmdzXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5mdWxmaWxsZWQgPSBwYXJzZUludChkYXRhLmZ1bGZpbGxlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5wYWlkID0gcGFyc2VJbnQoZGF0YS5wYWlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucHVyY2hhc2VvcmRlciA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEFsbFBheW1lbnRUeXBlczogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgncGF5bWVudHR5cGUnKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucGF5bWVudHR5cGVzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0UGF5bWVudFR5cGU6IGZ1bmN0aW9uKHNjb3BlLCBpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdwYXltZW50dHlwZScsIGlkKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5wYXltZW50dHlwZSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldE1hdGVyaWFsQWxsVHlwZXM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ21hdGVyaWFsdHlwZScpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5tYXRlcmlhbHR5cGVzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0RnVsbHlCb29rZWREYXlzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdzY2hlZHVsZXIvZ2V0RnVsbHlCb29rZWREYXlzJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5ib29rZWREYXlzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRGdXR1cmVXb3JrT3JkZXJzOiBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5vbmUoJ3NjaGVkdWxlci9nZXRGdXR1cmVXb3JrT3JkZXJzJykuZ2V0TGlzdCgpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkQ3VzdG9tZXI6IGZ1bmN0aW9uKG9iailcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLmFsbCgnY3VzdG9tZXInKS5wb3N0KG9iaik7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRQcm9kdWN0OiBmdW5jdGlvbihvYmopXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5hbGwoJ3Byb2R1Y3QnKS5wb3N0KG9iaik7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRBbGxCb29raW5nczogZnVuY3Rpb24oc3RhcnQsIGVuZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLmFsbCgnYm9va2VkZGF0ZScpLmdldExpc3QoeyBzdGFydDogc3RhcnQsIGVuZDogZW5kfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRCb29raW5nOiBmdW5jdGlvbihvYmopXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5hbGwoJ2Jvb2tlZGRhdGUnKS5wb3N0KG9iaik7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICB1cGRhdGVCb29raW5nOiBmdW5jdGlvbihvYmopXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYmoucHV0KCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBkZWxldGVCb29raW5nOiBmdW5jdGlvbihvYmopXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYmoucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRBbGxTYWxlc0NoYW5uZWxzOiBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5hbGwoJ3NhbGVzY2hhbm5lbCcpLmdldExpc3QoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9O1xyXG4gICAgfV0pO1xyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEJyZWVuIG9uIDE1LzAyLzIwMTYuXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdUb2FzdFNlcnZpY2UnLCBmdW5jdGlvbiggJG1kVG9hc3QgKXtcclxuXHJcbiAgICAgICAgdmFyIGRlbGF5ID0gNjAwMCxcclxuICAgICAgICAgICAgcG9zaXRpb24gPSAndG9wIHJpZ2h0JyxcclxuICAgICAgICAgICAgYWN0aW9uID0gJ09LJztcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc2hvdzogZnVuY3Rpb24oY29udGVudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRtZFRvYXN0LnNob3coXHJcbiAgICAgICAgICAgICAgICAgICAgJG1kVG9hc3Quc2ltcGxlKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNvbnRlbnQoY29udGVudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnBvc2l0aW9uKHBvc2l0aW9uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWN0aW9uKGFjdGlvbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmhpZGVEZWxheShkZWxheSlcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdVcGxvYWRTZXJ2aWNlJywgWydVcGxvYWQnLCBmdW5jdGlvbihVcGxvYWQpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgICAgIHVwbG9hZEZpbGU6IGZ1bmN0aW9uIChmaWxlbmFtZSwgZmlsZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGFPYmogPSB7ZmlsZTogZmlsZSB9O1xyXG4gICAgICAgICAgICAgICAgaWYoZmlsZW5hbWUgIT09ICcnKSB7IGRhdGFPYmouZmlsZW5hbWUgPSBmaWxlbmFtZTsgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBVcGxvYWQudXBsb2FkKHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdhcGkvdXBsb2FkZXIvdXBsb2FkRmlsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YU9ialxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBkZWxldGVGaWxlOiBmdW5jdGlvbihmaWxlbmFtZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGFPYmogPSB7ZmlsZW5hbWU6IGZpbGVuYW1lIH07XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFVwbG9hZC51cGxvYWQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2FwaS91cGxvYWRlci9kZWxldGVGaWxlJyxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhT2JqXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XSk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGJ5b3VuZyBvbiAzLzE0LzIwMTYuXHJcbiAqL1xyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ1ZhbGlkYXRpb25TZXJ2aWNlJywgW2Z1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICAgICAgZGVjaW1hbFJlZ2V4OiBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnXlxcXFxkKlxcXFwuP1xcXFxkKiQnO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgbnVtZXJpY1JlZ2V4OiBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnXlxcXFxkKiQnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XSk7XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gQm9va2VkRGF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgJHNjb3BlLCBSZXN0YW5ndWxhciwgJG1vbWVudCwgUmVzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgZXZlbnRTb3VyY2VzID0gW107XHJcbiAgICAgICAgdmFyIHdvcmtPcmRlckV2ZW50U3JjID0geyBldmVudHM6IFtdLCBiYWNrZ3JvdW5kQ29sb3I6ICdibHVlJywgYWxsRGF5RGVmYXVsdDogdHJ1ZSwgZWRpdGFibGU6IGZhbHNlIH07XHJcblxyXG4gICAgICAgIHZhciBib29rZWREYXRlRXZlbnRzID0gW107XHJcbiAgICAgICAgdmFyIGJvb2tlZERhdGVTcmMgPSB7XHJcbiAgICAgICAgICAgIGV2ZW50czogZnVuY3Rpb24oc3RhcnQsIGVuZCwgdHosIGNhbGxiYWNrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxCb29raW5ncyhzdGFydCwgZW5kKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZXZlbnRzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGFbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHMucHVzaCh7YmRPYmo6IGRhdGFbaV0sIHRpdGxlOiBkYXRhW2ldLm5vdGVzLCBzdGFydDogZGF0YVtpXS5zdGFydF9kYXRlLCBlbmQ6IGRhdGFbaV0uZW5kX2RhdGV9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGV2ZW50cyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAsIGJhY2tncm91bmRDb2xvcjogJ29yYW5nZScsIGFsbERheURlZmF1bHQ6IHRydWUsIGVkaXRhYmxlOiB0cnVlLCBldmVudFN0YXJ0RWRpdGFibGU6IHRydWVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRGdXR1cmVXb3JrT3JkZXJzKCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YVtpXSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgb25lV08gPSBkYXRhW2ldO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygkbW9tZW50KG9uZVdPLnN0YXJ0X2RhdGUpKTtcclxuICAgICAgICAgICAgICAgIHdvcmtPcmRlckV2ZW50U3JjLmV2ZW50cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1dvcmsgT3JkZXIgJyArIG9uZVdPLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiAkbW9tZW50KG9uZVdPLnN0YXJ0X2RhdGUpLmZvcm1hdCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHdvT2JqOiBvbmVXTyxcclxuICAgICAgICAgICAgICAgICAgICBib29raW5nVHlwZTogJ3dvcmtvcmRlcidcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGV2ZW50U291cmNlcy5wdXNoKHdvcmtPcmRlckV2ZW50U3JjKTtcclxuXHJcbiAgICAgICAgICAgIC8vYm9va2VkRGF0ZUV2ZW50cy5wdXNoKHsgdGl0bGU6ICd0ZXN0IEJPenp6JywgYm9va2luZ1R5cGU6ICdib29rZWREYXRlJywgc3RhcnQ6ICRtb21lbnQoKS5mb3JtYXQoKX0pO1xyXG4gICAgICAgICAgICBldmVudFNvdXJjZXMucHVzaChib29rZWREYXRlU3JjKTtcclxuXHJcbiAgICAgICAgICAgICQoJyNjYWxlbmRhcicpLmZ1bGxDYWxlbmRhcih7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gcHV0IHlvdXIgb3B0aW9ucyBhbmQgY2FsbGJhY2tzIGhlcmVcclxuICAgICAgICAgICAgICAgIGV2ZW50U291cmNlczogZXZlbnRTb3VyY2VzLFxyXG4gICAgICAgICAgICAgICAgZXZlbnRDbGljazogZnVuY3Rpb24oY2FsRXZlbnQsIGpzRXZlbnQsIHZpZXcpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhjYWxFdmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGNhbEV2ZW50LmJvb2tpbmdUeXBlID09PSAnd29ya29yZGVyJylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS53b09iaiA9IGNhbEV2ZW50LndvT2JqO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUG9wdXAgV08gZGV0YWlscyAocmVhZG9ubHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKG51bGwsICdkbGdXb3JrT3JkZXJRdWlja1ZpZXcnLCAkc2NvcGUpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2NvbmZpcm1lZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyRzdGF0ZS5nbygnYXBwLndvcmtvcmRlcnMuZGV0YWlsJywgeyd3b3JrT3JkZXJJZCc6IGNhbEV2ZW50Lndvcmtfb3JkZXJfaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmlzRWRpdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5iZE9iaiA9IGNhbEV2ZW50LmJkT2JqO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubm90ZXMgPSBjYWxFdmVudC50aXRsZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJvb2tpbmcgRGF0ZSAoYWxsb3cgZWRpdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpYWxvZ09wdGlvbnMgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaWFsb2dzL2RsZ0FkZEJvb2tpbmdEYXRlLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXNjYXBlVG9DbG9zZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEV2ZW50OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gRGlhbG9nQ29udHJvbGxlcigkc2NvcGUsICRtZERpYWxvZylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY29uZmlybURpYWxvZyA9IGZ1bmN0aW9uICgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuYmRPYmoubm90ZXMgPSAkc2NvcGUubm90ZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc3RTZXJ2aWNlLnVwZGF0ZUJvb2tpbmcoJHNjb3BlLmJkT2JqKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2NhbGVuZGFyJykuZnVsbENhbGVuZGFyKCdyZWZldGNoRXZlbnRzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kZWxldGVCb29raW5nID0gZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzdFNlcnZpY2UuZGVsZXRlQm9va2luZygkc2NvcGUuYmRPYmopLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjY2FsZW5kYXInKS5mdWxsQ2FsZW5kYXIoJ3JlZmV0Y2hFdmVudHMnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRtZERpYWxvZy5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNhbmNlbERpYWxvZyA9IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2NhbmNlbGxlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGU6ICRzY29wZS4kbmV3KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRGlhbG9nU2VydmljZS5mcm9tQ3VzdG9tKGRpYWxvZ09wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBldmVudE1vdXNlb3ZlcjogZnVuY3Rpb24oZXZlbnQsIGpzRXZlbnQsIHZpZXcpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ2N1cnNvcicsICdwb2ludGVyJyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGF5Q2xpY2s6IGZ1bmN0aW9uKGRhdGUsIGpzRXZlbnQsIHZpZXcsIHJlc291cmNlT2JqKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGUubG9jYWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGUubG9jYWwoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRlLnRvSVNPU3RyaW5nKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaXNFZGl0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkaWFsb2dPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaWFsb2dzL2RsZ0FkZEJvb2tpbmdEYXRlLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlc2NhcGVUb0Nsb3NlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRFdmVudDogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gRGlhbG9nQ29udHJvbGxlcigkc2NvcGUsICRtZERpYWxvZylcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbmZpcm1EaWFsb2cgPSBmdW5jdGlvbiAoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjY2VwdGVkJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBldmVudE9iaiA9IHsgbm90ZXM6ICRzY29wZS5ub3RlcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRfZGF0ZTogZGF0ZS50b0RhdGUoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kX2RhdGU6IGRhdGUudG9EYXRlKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGV2ZW50T2JqKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXN0U2VydmljZS5hZGRCb29raW5nKGV2ZW50T2JqKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2V2ZW50IGFkZGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNjYWxlbmRhcicpLmZ1bGxDYWxlbmRhcigncmVmZXRjaEV2ZW50cycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyQoJyNjYWxlbmRhcicpLmZ1bGxDYWxlbmRhcigncmVtb3ZlRXZlbnRTb3VyY2UnLCBib29rZWREYXRlU3JjKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyQoJyNjYWxlbmRhcicpLmZ1bGxDYWxlbmRhcignYWRkRXZlbnRTb3VyY2UnLCBib29rZWREYXRlU3JjKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNhbmNlbERpYWxvZyA9IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdjYW5jZWxsZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGU6ICRzY29wZS4kbmV3KClcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRpYWxvZ09wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbUN1c3RvbShkaWFsb2dPcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBldmVudERyb3A6IGZ1bmN0aW9uKGV2ZW50LCBkZWx0YSwgcmV2ZXJ0RnVuYylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRlbHRhKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkZWx0YS5kYXlzKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGRlbHRhLmRheXMoKSA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5zdGFydC5hZGQoZGVsdGEuZGF5cygpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuZW5kID0gZXZlbnQuc3RhcnQ7IC8vJG1vbWVudChldmVudC5zdGFydCkuYWRkKDEsICdkYXlzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoZGVsdGEuZGF5cyA8IDApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5zdGFydC5zdWJ0cmFjdChkZWx0YS5kYXlzKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5lbmQgPSBldmVudC5zdGFydDsgLy8kbW9tZW50KGV2ZW50LnN0YXJ0KS5hZGQoMSwgJ2RheXMnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbmNvbnNvbGUubG9nKGV2ZW50KTtcclxuKi9cclxuICAgICAgICAgICAgICAgICAgICBldmVudC5iZE9iai5zdGFydF9kYXRlID0gZXZlbnQuc3RhcnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuYmRPYmouZW5kX2RhdGUgPSBldmVudC5lbmQgPT09IG51bGwgPyBldmVudC5zdGFydCA6IGV2ZW50LmVuZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXZlbnQuYmRPYmopO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBSZXN0U2VydmljZS51cGRhdGVCb29raW5nKGV2ZW50LmJkT2JqKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJkYXRlIGNoYW5nZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNjYWxlbmRhcicpLmZ1bGxDYWxlbmRhcigncmVmZXRjaEV2ZW50cycpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGV2ZW50UmVzaXplOiBmdW5jdGlvbihldmVudCwgZGVsdGEsIHJldmVydEZ1bmMpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhldmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkZWx0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICBpZihkZWx0YS5kYXlzKCkgPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuZW5kLmFkZChkZWx0YS5kYXlzKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKGRlbHRhLmRheXMgPCAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuZW5kLnN1YnRyYWN0KGRlbHRhLmRheXMoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4qL1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBldmVudC5iZE9iai5lbmRfZGF0ZSA9IGV2ZW50LmVuZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhldmVudC5iZE9iaik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIFJlc3RTZXJ2aWNlLnVwZGF0ZUJvb2tpbmcoZXZlbnQuYmRPYmopLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImRhdGUgY2hhbmdlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2NhbGVuZGFyJykuZnVsbENhbGVuZGFyKCdyZWZldGNoRXZlbnRzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0Jvb2tlZERhdGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnJHNjb3BlJywgJ1Jlc3Rhbmd1bGFyJywgJyRtb21lbnQnLCAnUmVzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsIEJvb2tlZERhdGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gQ29yZUNvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGUsICRtb21lbnQsICRtZFNpZGVuYXYsICRtZE1lZGlhLCBBdXRoU2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciB0b2RheSA9IG5ldyBEYXRlKCk7XHJcblxyXG4gICAgICAgICRzY29wZS50b2RheXNEYXRlID0gdG9kYXk7XHJcbiAgICAgICAgJHNjb3BlLnNob3dTZWFyY2ggPSBmYWxzZTtcclxuXHJcbiAgICAgICAgJHNjb3BlLnRvZ2dsZVNpZGVuYXYgPSBmdW5jdGlvbihtZW51SWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAkbWRTaWRlbmF2KG1lbnVJZCkudG9nZ2xlKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLnNob3dTaWRlTmF2ID0gZnVuY3Rpb24obWVudUlkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoISRtZFNpZGVuYXYobWVudUlkKS5pc0xvY2tlZE9wZW4oKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgJG1kU2lkZW5hdihtZW51SWQpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5oaWRlU2lkZU5hdiA9IGZ1bmN0aW9uKG1lbnVJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKCEkbWRTaWRlbmF2KG1lbnVJZCkuaXNMb2NrZWRPcGVuKCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICRtZFNpZGVuYXYobWVudUlkKS5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLnRvZ2dsZVNlYXJjaCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICRzY29wZS5zaG93U2VhcmNoID0gISRzY29wZS5zaG93U2VhcmNoO1xyXG4gICAgICAgICAgICAvL2lmKCRzY29wZS5zaG93U2VhcmNoKSB7IGNvbnNvbGUubG9nKGFuZ3VsYXIuZWxlbWVudCgnI3N1cGVyU2VhcmNoJykpOyB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gTGlzdGVuIGZvciB0b2dnbGVTZWFyY2ggZXZlbnRzXHJcbiAgICAgICAgJHNjb3BlLiRvbihcInRvZ2dsZVNlYXJjaFwiLCBmdW5jdGlvbiAoZXZlbnQsIGFyZ3MpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAkc2NvcGUudG9nZ2xlU2VhcmNoKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRzY29wZS5kZXRlcm1pbmVGYWJWaXNpYmlsaXR5ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoJHN0YXRlLmlzKFwiYXBwLnByb2R1Y3RzXCIpIHx8ICRzdGF0ZS5pcyhcImFwcC5jdXN0b21lcnNcIilcclxuICAgICAgICAgICAgICAgIHx8ICRzdGF0ZS5pcyhcImFwcC5wdXJjaGFzZW9yZGVyc1wiKSB8fCAkc3RhdGUuaXMoXCJhcHAucGF5bWVudHR5cGVzXCIpXHJcbiAgICAgICAgICAgICAgICB8fCAkc3RhdGUuaXMoXCJhcHAud29ya29yZGVyc1wiKSB8fCAkc3RhdGUuaXMoXCJhcHAuZXZlbnRzXCIpXHJcbiAgICAgICAgICAgICAgICB8fCAkc3RhdGUuaXMoXCJhcHAudW5pdHNcIikgfHwgJHN0YXRlLmlzKFwiYXBwLm1hdGVyaWFsc1wiKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuYWRkRmFiTmF2aWdhdGUgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc3RhdGUuJGN1cnJlbnQubmFtZSk7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSBcIlwiO1xyXG4gICAgICAgICAgICBzd2l0Y2goJHN0YXRlLiRjdXJyZW50Lm5hbWUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJhcHAucHJvZHVjdHNcIjpcclxuICAgICAgICAgICAgICAgICAgICB1cmwgPSBcImFwcC5wcm9kdWN0cy5jcmVhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJhcHAuY3VzdG9tZXJzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gXCJhcHAuY3VzdG9tZXJzLmNyZWF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImFwcC5wdXJjaGFzZW9yZGVyc1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IFwiYXBwLnB1cmNoYXNlb3JkZXJzLmNyZWF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImFwcC5wYXltZW50dHlwZXNcIjpcclxuICAgICAgICAgICAgICAgICAgICB1cmwgPSBcImFwcC5wYXltZW50dHlwZXMuY3JlYXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiYXBwLndvcmtvcmRlcnNcIjpcclxuICAgICAgICAgICAgICAgICAgICB1cmwgPSBcImFwcC53b3Jrb3JkZXJzLmNyZWF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImFwcC5ldmVudHNcIjpcclxuICAgICAgICAgICAgICAgICAgICB1cmwgPSBcImFwcC5ldmVudHMuY3JlYXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiYXBwLnVuaXRzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gXCJhcHAudW5pdHMuY3JlYXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiYXBwLm1hdGVyaWFsc1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IFwiYXBwLm1hdGVyaWFscy5jcmVhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHN0YXRlLmdvKHVybCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmlzQXV0aGVudGljYXRlZCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQXV0aFNlcnZpY2UubG9nb3V0KCk7XHJcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmxvZ2luJyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvcmVDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJHN0YXRlJywgJyRtb21lbnQnLCAnJG1kU2lkZW5hdicsICckbWRNZWRpYScsICdBdXRoU2VydmljZScsIENvcmVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEN1c3RvbWVyQ3JlYXRlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBUb2FzdFNlcnZpY2UsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5jcmVhdGVDdXN0b21lciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi5jdXN0b21lcik7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGMgPSBzZWxmLmN1c3RvbWVyO1xyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnY3VzdG9tZXInKS5wb3N0KGMpLnRoZW4oZnVuY3Rpb24oZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyRzdGF0ZS5nbygnYXBwLmN1c3RvbWVycy5kZXRhaWwnLCB7J2N1c3RvbWVySWQnOiBkLm5ld0lkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5jdXN0b21lcnMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBjcmVhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0N1c3RvbWVyQ3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCBDdXN0b21lckNyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gQ3VzdG9tZXJEZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0Q3VzdG9tZXIoc2VsZiwgJHN0YXRlUGFyYW1zLmN1c3RvbWVySWQpO1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZUN1c3RvbWVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jdXN0b21lci5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5jdXN0b21lcnNcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVDdXN0b21lciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuY3VzdG9tZXIucmVtb3ZlKCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGRlbGV0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAuY3VzdG9tZXJzXCIpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgRGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zaG93RGVsZXRlQ29uZmlybSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZyA9IERpYWxvZ1NlcnZpY2UuY29uZmlybShldiwgJ0RlbGV0ZSBjdXN0b21lcj8nLCAnVGhpcyB3aWxsIGFsc28gZGVsZXRlIGFueSB3b3JrIG9yZGVycyBhc3NvY2lhdGVkIHdpdGggdGhpcyBjdXN0b21lcicpO1xyXG4gICAgICAgICAgICBkaWFsb2cudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5kZWxldGVDdXN0b21lcigpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDdXN0b21lckRldGFpbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdUb2FzdFNlcnZpY2UnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsICckc3RhdGVQYXJhbXMnLCBDdXN0b21lckRldGFpbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gQ3VzdG9tZXJDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbEN1c3RvbWVycyhzZWxmKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0N1c3RvbWVyQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgQ3VzdG9tZXJDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEV2ZW50Q3JlYXRlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYuZXZlbnQgPSB7fTtcclxuXHJcbiAgICAgICAgc2VsZi5jcmVhdGVFdmVudCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi5ldmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGUgPSBzZWxmLmV2ZW50O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJGVycm9yKTtcclxuXHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ2V2ZW50JykucG9zdChlKS50aGVuKGZ1bmN0aW9uKGUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ldmVudHMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFdmVudENyZWF0ZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCBFdmVudENyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gRXZlbnREZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgJHN0YXRlUGFyYW1zLCBUb2FzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLnNlbGVjdGVkUHJvZHVjdCA9IFwiXCI7XHJcbiAgICAgICAgc2VsZi5zZWxlY3RlZFF1YW50aXR5ID0gMDtcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEV2ZW50KHNlbGYsICRzdGF0ZVBhcmFtcy5ldmVudElkKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVFdmVudCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vUmVzdFNlcnZpY2UudXBkYXRlUHJvZHVjdChzZWxmLCBzZWxmLnByb2R1Y3QuaWQpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5ldmVudC5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwidXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5ldmVudHNcIik7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFkZFByb2R1Y3QgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnNlbGVjdGVkUHJvZHVjdCk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLmV2ZW50LmV2ZW50X3Byb2R1Y3RzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgZXZlbnRfaWQ6IHNlbGYuZXZlbnQuaWQsXHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBzZWxmLnNlbGVjdGVkUHJvZHVjdC5pZCxcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiBzZWxmLnNlbGVjdGVkUXVhbnRpdHksXHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0OiBzZWxmLnNlbGVjdGVkUHJvZHVjdFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRQcm9kdWN0ID0gXCJcIjtcclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFF1YW50aXR5ID0gMDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVByb2R1Y3QgPSBmdW5jdGlvbihlLCBwcm9kdWN0SWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXhUb1JlbW92ZTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYuZXZlbnQuZXZlbnRfcHJvZHVjdHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHByb2R1Y3RJZCA9PSBzZWxmLmV2ZW50LmV2ZW50X3Byb2R1Y3RzW2ldLnByb2R1Y3RfaWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhUb1JlbW92ZSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGluZGV4VG9SZW1vdmUpO1xyXG4gICAgICAgICAgICBzZWxmLmV2ZW50LmV2ZW50X3Byb2R1Y3RzLnNwbGljZShpbmRleFRvUmVtb3ZlLCAxKTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZUV2ZW50ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5ldmVudC5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGVlbHRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5ldmVudHNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBEZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNob3dEZWxldGVDb25maXJtID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGV2LCAnRGVsZXRlIGV2ZW50PycsICcnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlRXZlbnQoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRXZlbnREZXRhaWxDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgJ1RvYXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgRXZlbnREZXRhaWxDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEV2ZW50Q29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxFdmVudHMoc2VsZik7XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0V2ZW50Q29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgRXZlbnRDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEZvb3RlckNvbnRyb2xsZXIoJG1vbWVudClcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5jdXJyZW50WWVhciA9ICRtb21lbnQoKS5mb3JtYXQoJ1lZWVknKTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRm9vdGVyQ29udHJvbGxlcicsIFsnJG1vbWVudCcsIEZvb3RlckNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gSGVhZGVyQ29udHJvbGxlcigkYXV0aCwgJG1vbWVudClcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYudG9kYXlzRGF0ZSA9ICRtb21lbnQoKS5mb3JtYXQoJ2RkZGQsIE1NTU0gRG8gWVlZWScpO1xyXG5cclxuICAgICAgICBzZWxmLmlzQXV0aGVudGljYXRlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGF1dGguaXNBdXRoZW50aWNhdGVkKCk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSGVhZGVyQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJG1vbWVudCcsIEhlYWRlckNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBMYW5kaW5nQ29udHJvbGxlcigkc3RhdGUpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMYW5kaW5nQ29udHJvbGxlcicsIFsnJHN0YXRlJywgTGFuZGluZ0NvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBMb2dpbkNvbnRyb2xsZXIoJHN0YXRlLCAkc2NvcGUsICRjb29raWVzLCBEaWFsb2dTZXJ2aWNlLCBBdXRoU2VydmljZSwgRm9jdXNTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmVtYWlsID0gJyc7XHJcbiAgICAgICAgc2VsZi5wYXNzd29yZCA9ICcnO1xyXG5cclxuICAgICAgICBpZigkY29va2llcy5nZXQoJ2xvZ2luTmFtZScpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5lbWFpbCA9ICRjb29raWVzLmdldCgnbG9naW5OYW1lJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZGlhbG9nT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvZGlhbG9ncy9kbGdMb2dpbi5odG1sJyxcclxuICAgICAgICAgICAgZXNjYXBlVG9DbG9zZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uIERpYWxvZ0NvbnRyb2xsZXIoJHNjb3BlLCAkbWREaWFsb2cpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jb25maXJtRGlhbG9nID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYuZW1haWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNlbGYuZW1haWwgIT09ICcnICYmIHNlbGYucGFzc3dvcmQgIT09ICcnKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQXV0aFNlcnZpY2UubG9naW4oc2VsZi5lbWFpbCwgc2VsZi5wYXNzd29yZCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdMb2dpbiBzdWNjZXNzJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRvZGF5ID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFyIGNvb2tpZUV4cGlyeSA9IG5ldyBEYXRlKHRvZGF5LmdldFllYXIoKSArIDEsIHRvZGF5LmdldE1vbnRoKCksIHRvZGF5LmdldERheSgpLCAwLCAwLCAwLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb29raWVFeHBpcnkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29va2llRXhwaXJ5LnNldEZ1bGxZZWFyKGNvb2tpZUV4cGlyeS5nZXRGdWxsWWVhcigpICsgMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGNvb2tpZXMucHV0KCdsb2dpbk5hbWUnLCBzZWxmLmVtYWlsLCB7IGV4cGlyZXM6IGNvb2tpZUV4cGlyeSB9KTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLnByb2R1Y3RzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0Vycm9yIGxvZ2dpbmcgaW4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2NvcGU6ICRzY29wZS4kbmV3KClcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21DdXN0b20oZGlhbG9nT3B0aW9ucyk7XHJcblxyXG4gICAgICAgIEZvY3VzU2VydmljZSgnZm9jdXNNZScpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTG9naW5Db250cm9sbGVyJywgWyckc3RhdGUnLCAnJHNjb3BlJywgJyRjb29raWVzJywgJ0RpYWxvZ1NlcnZpY2UnLCAnQXV0aFNlcnZpY2UnLCAnRm9jdXNTZXJ2aWNlJywgTG9naW5Db250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIE1hdGVyaWFsQ3JlYXRlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBUb2FzdFNlcnZpY2UsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgVmFsaWRhdGlvblNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFVuaXRzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldE1hdGVyaWFsQWxsVHlwZXMoc2VsZik7XHJcblxyXG4gICAgICAgIHNlbGYuZGVjaW1hbFJlZ2V4ID0gVmFsaWRhdGlvblNlcnZpY2UuZGVjaW1hbFJlZ2V4KCk7XHJcblxyXG4gICAgICAgIHNlbGYuY3JlYXRlTWF0ZXJpYWwgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaXNWYWxpZCk7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYubWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBtID0gc2VsZi5tYXRlcmlhbDtcclxuXHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ21hdGVyaWFsJykucG9zdChtKS50aGVuKGZ1bmN0aW9uKGQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8kc3RhdGUuZ28oJ2FwcC5jdXN0b21lcnMuZGV0YWlsJywgeydjdXN0b21lcklkJzogZC5uZXdJZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAubWF0ZXJpYWxzJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgY3JlYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTWF0ZXJpYWxDcmVhdGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJ1ZhbGlkYXRpb25TZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIE1hdGVyaWFsQ3JlYXRlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBNYXRlcmlhbERldGFpbENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgVG9hc3RTZXJ2aWNlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UsIFZhbGlkYXRpb25TZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxVbml0cyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRNYXRlcmlhbEFsbFR5cGVzKHNlbGYpO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0TWF0ZXJpYWwoc2VsZiwgJHN0YXRlUGFyYW1zLm1hdGVyaWFsSWQpO1xyXG5cclxuICAgICAgICBzZWxmLmRlY2ltYWxSZWdleCA9IFZhbGlkYXRpb25TZXJ2aWNlLmRlY2ltYWxSZWdleCgpO1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZU1hdGVyaWFsID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5tYXRlcmlhbC5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5tYXRlcmlhbHNcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVNYXRlcmlhbCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYubWF0ZXJpYWwucmVtb3ZlKCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGRlbGV0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAubWF0ZXJpYWxzXCIpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgRGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2hvd0RlbGV0ZUNvbmZpcm0gPSBmdW5jdGlvbihldilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZXYsICdEZWxldGUgbWF0ZXJpYWw/JywgJ1RoaXMgd2lsbCBhbHNvIHJlbW92ZSB0aGUgbWF0ZXJpYWwgZnJvbSBhbnkgcHJvZHVjdHMgdXNpbmcgaXQnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlTWF0ZXJpYWwoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTWF0ZXJpYWxEZXRhaWxDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJ0RpYWxvZ1NlcnZpY2UnLCAnVmFsaWRhdGlvblNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgTWF0ZXJpYWxEZXRhaWxDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIE1hdGVyaWFsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxNYXRlcmlhbHMoc2VsZik7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdNYXRlcmlhbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsIE1hdGVyaWFsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBNYXRlcmlhbFNldENvbnRyb2xsZXIoJHN0YXRlLCBSZXN0U2VydmljZSwgR3VpZFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UsIG15Q29uZmlnKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLnNlbGVjdGVkTWF0ZXJpYWwgPSAnJztcclxuICAgICAgICAvL3NlbGYuc2VsZWN0ZWRRdWFudGl0eSA9IDA7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKG15Q29uZmlnLm1hdGVyaWFsU2V0c0xTS2V5KTtcclxuXHJcbiAgICAgICAgaWYobG9jYWxTdG9yYWdlLmdldEl0ZW0obXlDb25maWcubWF0ZXJpYWxTZXRzTFNLZXkpICE9PSBudWxsICYmIGxvY2FsU3RvcmFnZS5nZXRJdGVtKG15Q29uZmlnLm1hdGVyaWFsU2V0c0xTS2V5KSAhPT0gJycpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmV4aXN0aW5nU2V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obXlDb25maWcubWF0ZXJpYWxTZXRzTFNLZXkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5leGlzdGluZ1NldHMgPSBbXTtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obXlDb25maWcubWF0ZXJpYWxTZXRzTFNLZXksIEpTT04uc3RyaW5naWZ5KHNlbGYuZXhpc3RpbmdTZXRzKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0U2V0T2JqZWN0KCk7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbE1hdGVyaWFscyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi5jcmVhdGVTZXQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLnNldC5pZCA9IEd1aWRTZXJ2aWNlLm5ld0d1aWQoKTtcclxuICAgICAgICAgICAgc2VsZi5leGlzdGluZ1NldHMucHVzaChzZWxmLnNldCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc2V0KTtcclxuXHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG15Q29uZmlnLm1hdGVyaWFsU2V0c0xTS2V5LCBKU09OLnN0cmluZ2lmeShzZWxmLmV4aXN0aW5nU2V0cykpO1xyXG5cclxuICAgICAgICAgICAgaW5pdFNldE9iamVjdCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlU2V0ID0gZnVuY3Rpb24oZSwgc2V0SWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGUsICdEZWxldGUgbWF0ZXJpYWwgc2V0PycsICcnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXhUb1JlbW92ZTtcclxuICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzZWxmLmV4aXN0aW5nU2V0cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihzZXRJZCA9PSBzZWxmLmV4aXN0aW5nU2V0c1tpXS5pZClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4VG9SZW1vdmUgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi5leGlzdGluZ1NldHMuc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5leGlzdGluZ1NldHMubGVuZ3RoID09PSAwKSB7IGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKG15Q29uZmlnLm1hdGVyaWFsU2V0c0xTS2V5KTsgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG15Q29uZmlnLm1hdGVyaWFsU2V0c0xTS2V5LCBzZWxmLmV4aXN0aW5nU2V0cyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZU1hdGVyaWFsID0gZnVuY3Rpb24oZSwgbWF0ZXJpYWxJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleFRvUmVtb3ZlO1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgc2VsZi5zZXQucHJvZHVjdF9tYXRlcmlhbHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKG1hdGVyaWFsSWQgPT0gc2VsZi5zZXQucHJvZHVjdF9tYXRlcmlhbHNbaV0ubWF0ZXJpYWxfaWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhUb1JlbW92ZSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYuc2V0LnByb2R1Y3RfbWF0ZXJpYWxzLnNwbGljZShpbmRleFRvUmVtb3ZlLCAxKTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFkZE1hdGVyaWFsID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5zZWxlY3RlZE1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc2V0LnByb2R1Y3RfbWF0ZXJpYWxzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWxfaWQ6IHNlbGYuc2VsZWN0ZWRNYXRlcmlhbC5pZCxcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiBzZWxmLnNlbGVjdGVkUXVhbnRpdHksXHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbDogc2VsZi5zZWxlY3RlZE1hdGVyaWFsXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZE1hdGVyaWFsID0gJyc7XHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRRdWFudGl0eSA9IG51bGw7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdFNldE9iamVjdCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLnNldCA9IHt9O1xyXG4gICAgICAgICAgICBzZWxmLnNldC5pZCA9ICcnO1xyXG4gICAgICAgICAgICBzZWxmLnNldC5uYW1lID0gJyc7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0LnByb2R1Y3RfbWF0ZXJpYWxzID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTWF0ZXJpYWxTZXRDb250cm9sbGVyJywgWyckc3RhdGUnLCAnUmVzdFNlcnZpY2UnLCAnR3VpZFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsICdteUNvbmZpZycsIE1hdGVyaWFsU2V0Q29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBNYXRlcmlhbENoZWNrbGlzdENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5jaGVja2xpc3Rtb2RlID0gJ3RoaXN3ZWVrJztcclxuICAgICAgICBzZWxmLmNoZWNrbGlzdF9wcm9kdWN0cyA9IFtdO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuXHJcblxyXG4gICAgICAgIHNlbGYuYWRkUHJvZHVjdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc2VsZWN0ZWRQcm9kdWN0KTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYuY2hlY2tsaXN0X3Byb2R1Y3RzID09PSB1bmRlZmluZWQpIHsgc2VsZi5jaGVja2xpc3RfcHJvZHVjdHMgPSBbXTsgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5jaGVja2xpc3RfcHJvZHVjdHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBzZWxmLnNlbGVjdGVkUHJvZHVjdC5pZCxcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiBzZWxmLnNlbGVjdGVkUXVhbnRpdHksXHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0OiBzZWxmLnNlbGVjdGVkUHJvZHVjdFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRQcm9kdWN0ID0gXCJcIjtcclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFF1YW50aXR5ID0gXCJcIjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVByb2R1Y3QgPSBmdW5jdGlvbihlLCBwcm9kdWN0SWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXhUb1JlbW92ZTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYuY2hlY2tsaXN0X3Byb2R1Y3RzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihwcm9kdWN0SWQgPT0gc2VsZi5jaGVja2xpc3RfcHJvZHVjdHNbaV0ucHJvZHVjdF9pZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleFRvUmVtb3ZlID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5jaGVja2xpc3RfcHJvZHVjdHMuc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZ2VuZXJhdGVDaGVja2xpc3QgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgcmVwb3J0UGFyYW1zID0ge307XHJcbiAgICAgICAgICAgIHJlcG9ydFBhcmFtcy5tb2RlID0gc2VsZi5jaGVja2xpc3Rtb2RlO1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoKHNlbGYuY2hlY2tsaXN0bW9kZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAndGhpc3dlZWsnOlxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ2RhdGUnOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlcG9ydFBhcmFtcy5zdGFydF9kYXRlID0gc2VsZi5zdGFydF9kYXRlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcG9ydFBhcmFtcy5lbmRfZGF0ZSA9IHNlbGYuZW5kX2RhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ3Byb2R1Y3RzJzpcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnByb2R1Y3RzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYuY2hlY2tsaXN0X3Byb2R1Y3RzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9uZSA9IHNlbGYuY2hlY2tsaXN0X3Byb2R1Y3RzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnByb2R1Y3RzLnB1c2goe2lkOiBvbmUucHJvZHVjdF9pZCwgcXVhbnRpdHk6IG9uZS5xdWFudGl0eX0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdyZXBvcnRzL2dldE1hdGVyaWFsQ2hlY2tsaXN0JykucG9zdCh7ICdyZXBvcnRQYXJhbXMnOiByZXBvcnRQYXJhbXN9KS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucmVzdWx0cyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYucmVzdWx0c1swXSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gRXJyb3JcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnJlcG9ydCA9IFtdO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdNYXRlcmlhbENoZWNrbGlzdENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsIE1hdGVyaWFsQ2hlY2tsaXN0Q29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuXHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUGF5bWVudFR5cGVDcmVhdGVDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZVBheW1lbnRUeXBlID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlzVmFsaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLnBheW1lbnR0eXBlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHNlbGYucGF5bWVudHR5cGU7XHJcblxyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdwYXltZW50dHlwZScpLnBvc3QoYykudGhlbihmdW5jdGlvbihkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucGF5bWVudHR5cGVzJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgY3JlYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQYXltZW50VHlwZUNyZWF0ZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdUb2FzdFNlcnZpY2UnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgUGF5bWVudFR5cGVDcmVhdGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFBheW1lbnRUeXBlRGV0YWlsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBUb2FzdFNlcnZpY2UsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgRGlhbG9nU2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldFBheW1lbnRUeXBlKHNlbGYsICRzdGF0ZVBhcmFtcy5wYXltZW50VHlwZUlkKTtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVQYXltZW50VHlwZSA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucGF5bWVudHR5cGUucHV0KCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgdXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAucGF5bWVudHR5cGVzXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVBheW1lbnRUeXBlID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5wYXltZW50dHlwZS5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5wYXltZW50dHlwZXNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBEZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNob3dEZWxldGVDb25maXJtID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGV2LCAnRGVsZXRlIHBheW1lbnQgdHlwZT8nLCAnJyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZVBheW1lbnRUeXBlKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1BheW1lbnRUeXBlRGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIFBheW1lbnRUeXBlRGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBQYXltZW50VHlwZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUGF5bWVudFR5cGVzKHNlbGYpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUGF5bWVudFR5cGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCBQYXltZW50VHlwZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUHJvZHVjdENyZWF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFRvYXN0U2VydmljZSwgUmVzdFNlcnZpY2UsIFZhbGlkYXRpb25TZXJ2aWNlLCBteUNvbmZpZywgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbE1hdGVyaWFscyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWNpbWFsUmVnZXggPSBWYWxpZGF0aW9uU2VydmljZS5kZWNpbWFsUmVnZXgoKTtcclxuICAgICAgICBzZWxmLm51bWVyaWNSZWdleCA9IFZhbGlkYXRpb25TZXJ2aWNlLm51bWVyaWNSZWdleCgpO1xyXG4gICAgICAgIHNlbGYuY2JBZGRNYXRlcmlhbHNCeSA9IDI7XHJcblxyXG4gICAgICAgIHNlbGYucHJvZHVjdCA9IHt9O1xyXG4gICAgICAgIHNlbGYucHJvZHVjdC5taW5pbXVtX3N0b2NrID0gMDtcclxuICAgICAgICBzZWxmLnByb2R1Y3QuY3VycmVudF9zdG9jayA9IDA7XHJcblxyXG4gICAgICAgIGlmKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG15Q29uZmlnLm1hdGVyaWFsU2V0c0xTS2V5KSAhPT0gbnVsbCAmJiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShteUNvbmZpZy5tYXRlcmlhbFNldHNMU0tleSkgIT09ICcnKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5tYXRlcmlhbFNldHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG15Q29uZmlnLm1hdGVyaWFsU2V0c0xTS2V5KSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgc2VsZi5jcmVhdGVQcm9kdWN0ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlzVmFsaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5wcm9kdWN0KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcCA9IHNlbGYucHJvZHVjdDtcclxuXHJcbiAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygkZXJyb3IpO1xyXG5cclxuICAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3Byb2R1Y3QnKS5wb3N0KHApLnRoZW4oZnVuY3Rpb24oZClcclxuICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyRzdGF0ZS5nbygnYXBwLnByb2R1Y3RzLmRldGFpbCcsIHsncHJvZHVjdElkJzogZC5uZXdJZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucHJvZHVjdHMnKTtcclxuICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgY3JlYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5hZGRNYXRlcmlhbCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc2VsZWN0ZWRNYXRlcmlhbCk7XHJcblxyXG4gICAgICAgICAgICBhZGRNYXRlcmlhbChzZWxmLnNlbGVjdGVkTWF0ZXJpYWwuaWQsIHNlbGYuc2VsZWN0ZWRRdWFudGl0eSwgc2VsZi5zZWxlY3RlZE1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRNYXRlcmlhbCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRRdWFudGl0eSA9IDA7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnByb2R1Y3QpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYWRkTWF0ZXJpYWxTZXQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYuc2VsZWN0ZWRNYXRlcmlhbFNldCk7XHJcblxyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgc2VsZi5zZWxlY3RlZE1hdGVyaWFsU2V0LnByb2R1Y3RfbWF0ZXJpYWxzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcG0gPSBzZWxmLnNlbGVjdGVkTWF0ZXJpYWxTZXQucHJvZHVjdF9tYXRlcmlhbHNbaV07XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHBtKTtcclxuICAgICAgICAgICAgICAgIGFkZE1hdGVyaWFsKHBtLm1hdGVyaWFsX2lkLCBwbS5xdWFudGl0eSwgcG0ubWF0ZXJpYWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVNYXRlcmlhbCA9IGZ1bmN0aW9uKGUsIG1hdGVyaWFsSWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXhUb1JlbW92ZTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYobWF0ZXJpYWxJZCA9PSBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHNbaV0ubWF0ZXJpYWxfaWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhUb1JlbW92ZSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaW5kZXhUb1JlbW92ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY3VycmVudENvc3QgPSBwYXJzZUZsb2F0KHNlbGYucHJvZHVjdC5jb3N0KTtcclxuICAgICAgICAgICAgdmFyIGJ0ZXN0ID0gKHBhcnNlRmxvYXQoc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzW2luZGV4VG9SZW1vdmVdLm1hdGVyaWFsLnVuaXRfY29zdCkgKiBwYXJzZUludChzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHNbaW5kZXhUb1JlbW92ZV0ucXVhbnRpdHkpKTtcclxuICAgICAgICAgICAgY3VycmVudENvc3QgLT0gYnRlc3Q7XHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5jb3N0ID0gY3VycmVudENvc3Q7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMuc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZE1hdGVyaWFsKG1hdGVyaWFsSWQsIHF1YW50aXR5LCBtYXRlcmlhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscyA9PT0gdW5kZWZpbmVkKSB7IHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscyA9IFtdOyB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbF9pZDogbWF0ZXJpYWxJZCxcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiBxdWFudGl0eSxcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsOiBtYXRlcmlhbFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYucHJvZHVjdC5jb3N0ID09PSB1bmRlZmluZWQgfHwgc2VsZi5wcm9kdWN0LmNvc3QgPT09IG51bGwpIHsgc2VsZi5wcm9kdWN0LmNvc3QgPSAwOyB9XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50Q29zdCA9IHBhcnNlRmxvYXQoc2VsZi5wcm9kdWN0LmNvc3QpO1xyXG4gICAgICAgICAgICB2YXIgYnRlc3QgPSAocGFyc2VGbG9hdChtYXRlcmlhbC51bml0X2Nvc3QpICogcGFyc2VGbG9hdChxdWFudGl0eSkpO1xyXG4gICAgICAgICAgICBjdXJyZW50Q29zdCArPSBidGVzdDtcclxuICAgICAgICAgICAgc2VsZi5wcm9kdWN0LmNvc3QgPSBjdXJyZW50Q29zdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQcm9kdWN0Q3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1RvYXN0U2VydmljZScsICdSZXN0U2VydmljZScsICdWYWxpZGF0aW9uU2VydmljZScsICdteUNvbmZpZycsICckc3RhdGVQYXJhbXMnLCBQcm9kdWN0Q3JlYXRlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBQcm9kdWN0RGV0YWlsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcywgVG9hc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCBWYWxpZGF0aW9uU2VydmljZSwgbXlDb25maWcpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsTWF0ZXJpYWxzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldFByb2R1Y3Qoc2VsZiwgJHN0YXRlUGFyYW1zLnByb2R1Y3RJZCk7XHJcblxyXG4gICAgICAgIHNlbGYuZGVjaW1hbFJlZ2V4ID0gVmFsaWRhdGlvblNlcnZpY2UuZGVjaW1hbFJlZ2V4KCk7XHJcbiAgICAgICAgc2VsZi5udW1lcmljUmVnZXggPSBWYWxpZGF0aW9uU2VydmljZS5udW1lcmljUmVnZXgoKTtcclxuICAgICAgICBzZWxmLmNiQWRkTWF0ZXJpYWxzQnkgPSAyO1xyXG5cclxuICAgICAgICBpZihsb2NhbFN0b3JhZ2UuZ2V0SXRlbShteUNvbmZpZy5tYXRlcmlhbFNldHNMU0tleSkgIT09IG51bGwgJiYgbG9jYWxTdG9yYWdlLmdldEl0ZW0obXlDb25maWcubWF0ZXJpYWxTZXRzTFNLZXkpICE9PSAnJylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYubWF0ZXJpYWxTZXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShteUNvbmZpZy5tYXRlcmlhbFNldHNMU0tleSkpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlUHJvZHVjdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vUmVzdFNlcnZpY2UudXBkYXRlUHJvZHVjdChzZWxmLCBzZWxmLnByb2R1Y3QuaWQpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wcm9kdWN0LnB1dCgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJ1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IHVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLnByb2R1Y3RzXCIpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVQcm9kdWN0ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5wcm9kdWN0LnJlbW92ZSgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRlZWx0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBkZWxldGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLnByb2R1Y3RzXCIpO1xyXG5cclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGRlbGV0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBkZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zaG93RGVsZXRlQ29uZmlybSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZyA9IERpYWxvZ1NlcnZpY2UuY29uZmlybShldiwgJ0RlbGV0ZSBwcm9kdWN0PycsICdUaGlzIHdpbGwgYWxzbyBkZWxldGUgYW55IHdvcmsgb3JkZXIgb3IgZXZlbnQgc3RvY2sgbGV2ZWxzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHByb2R1Y3QnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZVByb2R1Y3QoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYWRkTWF0ZXJpYWwgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnNlbGVjdGVkTWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICAgICAgYWRkTWF0ZXJpYWwoc2VsZi5zZWxlY3RlZE1hdGVyaWFsLmlkLCBzZWxmLnNlbGVjdGVkUXVhbnRpdHksIHNlbGYuc2VsZWN0ZWRNYXRlcmlhbCk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkTWF0ZXJpYWwgPSBcIlwiO1xyXG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkUXVhbnRpdHkgPSAwO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFkZE1hdGVyaWFsU2V0ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLnNlbGVjdGVkTWF0ZXJpYWxTZXQpO1xyXG5cclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYuc2VsZWN0ZWRNYXRlcmlhbFNldC5wcm9kdWN0X21hdGVyaWFscy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBtID0gc2VsZi5zZWxlY3RlZE1hdGVyaWFsU2V0LnByb2R1Y3RfbWF0ZXJpYWxzW2ldO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhwbSk7XHJcbiAgICAgICAgICAgICAgICBhZGRNYXRlcmlhbChwbS5tYXRlcmlhbF9pZCwgcG0ucXVhbnRpdHksIHBtLm1hdGVyaWFsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlTWF0ZXJpYWwgPSBmdW5jdGlvbihlLCBtYXRlcmlhbElkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4VG9SZW1vdmU7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKG1hdGVyaWFsSWQgPT0gc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzW2ldLm1hdGVyaWFsX2lkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4VG9SZW1vdmUgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpbmRleFRvUmVtb3ZlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50Q29zdCA9IHBhcnNlRmxvYXQoc2VsZi5wcm9kdWN0LmNvc3QpO1xyXG4gICAgICAgICAgICB2YXIgYnRlc3QgPSAocGFyc2VGbG9hdChzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHNbaW5kZXhUb1JlbW92ZV0ubWF0ZXJpYWwudW5pdF9jb3N0KSAqIHBhcnNlSW50KHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFsc1tpbmRleFRvUmVtb3ZlXS5xdWFudGl0eSkpO1xyXG4gICAgICAgICAgICBjdXJyZW50Q29zdCAtPSBidGVzdDtcclxuICAgICAgICAgICAgc2VsZi5wcm9kdWN0LmNvc3QgPSBjdXJyZW50Q29zdDtcclxuXHJcblxyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMuc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZE1hdGVyaWFsKG1hdGVyaWFsSWQsIHF1YW50aXR5LCBtYXRlcmlhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscyA9PT0gdW5kZWZpbmVkKSB7IHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscyA9IFtdOyB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBzZWxmLnByb2R1Y3QuaWQsXHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbF9pZDogbWF0ZXJpYWxJZCxcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiBxdWFudGl0eSxcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsOiBtYXRlcmlhbFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYucHJvZHVjdC5jb3N0ID09PSB1bmRlZmluZWQgfHwgc2VsZi5wcm9kdWN0LmNvc3QgPT09IG51bGwpIHsgc2VsZi5wcm9kdWN0LmNvc3QgPSAwOyB9XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50Q29zdCA9IHBhcnNlRmxvYXQoc2VsZi5wcm9kdWN0LmNvc3QpO1xyXG4gICAgICAgICAgICB2YXIgYnRlc3QgPSAocGFyc2VGbG9hdChtYXRlcmlhbC51bml0X2Nvc3QpICogcGFyc2VGbG9hdChxdWFudGl0eSkpO1xyXG4gICAgICAgICAgICBjdXJyZW50Q29zdCArPSBidGVzdDtcclxuICAgICAgICAgICAgc2VsZi5wcm9kdWN0LmNvc3QgPSBjdXJyZW50Q29zdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1Byb2R1Y3REZXRhaWxDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgJ1RvYXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgJ1ZhbGlkYXRpb25TZXJ2aWNlJywgJ215Q29uZmlnJywgUHJvZHVjdERldGFpbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUHJvZHVjdENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmZpbHRlclR5cGUgPSBcIlwiO1xyXG4gICAgICAgIHNlbGYuZmlsdGVyT3BlcmF0b3IgPSBcIlwiO1xyXG4gICAgICAgIHNlbGYuZmlsdGVyVmFsdWUgPSBcIlwiO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi5hcHBseVByb2R1Y3RGaWx0ZXIgPSBmdW5jdGlvbihwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoc2VsZi5maWx0ZXJUeXBlICE9PSBcIlwiICYmIHNlbGYuZmlsdGVyT3BlcmF0b3IgIT09IFwiXCIgJiYgc2VsZi5maWx0ZXJWYWx1ZSAhPT0gXCJcIilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJoaVwiKTtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eVRvRmlsdGVyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHN3aXRjaChzZWxmLmZpbHRlclR5cGUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInN0b2NrXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VG9GaWx0ZXIgPSBwYXJzZUludChwLmN1cnJlbnRfc3RvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicHJpY2VcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlUb0ZpbHRlciA9IHBhcnNlRmxvYXQocC5wcmljZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJjb3N0XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VG9GaWx0ZXIgPSBwYXJzZUZsb2F0KHAuY29zdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmKHNlbGYuZmlsdGVyT3BlcmF0b3IgPT09IFwiPVwiKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVRvRmlsdGVyID09IHBhcnNlRmxvYXQoc2VsZi5maWx0ZXJWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHNlbGYuZmlsdGVyT3BlcmF0b3IgPT09IFwiPlwiKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVRvRmlsdGVyID4gcGFyc2VGbG9hdChzZWxmLmZpbHRlclZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYoc2VsZi5maWx0ZXJPcGVyYXRvciA9PT0gXCI+PVwiKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVRvRmlsdGVyID49IHNlbGYuZmlsdGVyVmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHNlbGYuZmlsdGVyT3BlcmF0b3IgPT09IFwiPFwiKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVRvRmlsdGVyIDwgcGFyc2VGbG9hdChzZWxmLmZpbHRlclZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYoc2VsZi5maWx0ZXJPcGVyYXRvciA9PT0gXCI8PVwiKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVRvRmlsdGVyIDw9IHBhcnNlRmxvYXQoc2VsZi5maWx0ZXJWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1Byb2R1Y3RDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCBQcm9kdWN0Q29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBQdXJjaGFzZU9yZGVyQ3JlYXRlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCAkc2NvcGUsICRtb21lbnQsIFJlc3Rhbmd1bGFyLCBUb2FzdFNlcnZpY2UsIFJlc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCBWYWxpZGF0aW9uU2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsQ3VzdG9tZXJzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFByb2R1Y3RzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFBheW1lbnRUeXBlcyhzZWxmKTtcclxuICAgICAgICAvL1Jlc3RTZXJ2aWNlLmdldEZ1bGx5Qm9va2VkRGF5cyhzZWxmKTtcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsU2FsZXNDaGFubmVscygpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuc2FsZXNjaGFubmVscyA9IGRhdGE7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHNlbGYucHVyY2hhc2VvcmRlciA9IHt9O1xyXG4gICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5hbW91bnRfcGFpZCA9IDA7XHJcbiAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLmRpc2NvdW50ID0gMDtcclxuICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSAwO1xyXG5cclxuICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIuZGVsaXZlcnkgPSAwO1xyXG4gICAgICAgIHNlbGYuZGVsaXZlcnlfY2hhcmdlID0gMDtcclxuXHJcbiAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnNoaXBwaW5nID0gMDtcclxuICAgICAgICBzZWxmLnNoaXBwaW5nX2NoYXJnZSA9IDA7XHJcblxyXG4gICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5zdXBwcmVzc3dvcmtvcmRlciA9IDA7XHJcblxyXG4gICAgICAgIHZhciBvcmlnaW5hbFRvdGFsID0gMDtcclxuICAgICAgICB2YXIgb3JpZ2luYWxTaGlwcGluZ0NoYXJnZSA9IDA7XHJcblxyXG4gICAgICAgIHNlbGYuYWRkUHJvZHVjdElubGluZSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZ09wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaWFsb2dzL2RsZ0NyZWF0ZVByb2R1Y3RJbmxpbmUuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBlc2NhcGVUb0Nsb3NlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0RXZlbnQ6IGV2LFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gRGlhbG9nQ29udHJvbGxlcigkc2NvcGUsICRtZERpYWxvZylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGVjaW1hbFJlZ2V4ID0gVmFsaWRhdGlvblNlcnZpY2UuZGVjaW1hbFJlZ2V4KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jb25maXJtRGlhbG9nID0gZnVuY3Rpb24gKClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjY2VwdGVkJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSAkc2NvcGUuZm9ybTEuJHZhbGlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcCA9ICRzY29wZS5jdHJsUHJvZHVjdENyZWF0ZUlubGluZS5wcm9kdWN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcC5jb3N0ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHAubWluaW11bV9zdG9jayA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwLmN1cnJlbnRfc3RvY2sgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXN0U2VydmljZS5hZGRQcm9kdWN0KHApLnRoZW4oZnVuY3Rpb24oZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGQubmV3SWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb3AgPSB7aWQ6IGQubmV3SWQsIG5hbWU6IHAubmFtZSwgcHJpY2U6IHAucHJpY2V9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucHJvZHVjdHMucHVzaChwb3ApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRQcm9kdWN0ID0gcG9wO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiUHJvZHVjdCBTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGNyZWF0aW5nIHByb2R1Y3RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNhbmNlbERpYWxvZyA9IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2NhbmNlbGxlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2NvcGU6ICRzY29wZS4kbmV3KClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbUN1c3RvbShkaWFsb2dPcHRpb25zKTtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5hZGRDdXN0b21lcklubGluZSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZ09wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaWFsb2dzL2RsZ0NyZWF0ZUN1c3RvbWVySW5saW5lLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgZXNjYXBlVG9DbG9zZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRhcmdldEV2ZW50OiBldixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uIERpYWxvZ0NvbnRyb2xsZXIoJHNjb3BlLCAkbWREaWFsb2cpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbmZpcm1EaWFsb2cgPSBmdW5jdGlvbiAoKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnYWNjZXB0ZWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNWYWxpZCA9ICRzY29wZS5mb3JtMS4kdmFsaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjID0gJHNjb3BlLmN0cmxDdXN0b21lckNyZWF0ZUlubGluZS5jdXN0b21lcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc3RTZXJ2aWNlLmFkZEN1c3RvbWVyKGMpLnRoZW4oZnVuY3Rpb24oZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkLm5ld0lkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmN1c3RvbWVycy5wdXNoKHtpZDogZC5uZXdJZCwgZmlyc3RfbmFtZTogYy5maXJzdF9uYW1lLCBsYXN0X25hbWU6IGMubGFzdF9uYW1lIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5jdXN0b21lcl9pZCA9IGQubmV3SWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJDdXN0b21lciBTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGNyZWF0aW5nIGN1c3RvbWVyXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jYW5jZWxEaWFsb2cgPSBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdjYW5jZWxsZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNjb3BlOiAkc2NvcGUuJG5ldygpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21DdXN0b20oZGlhbG9nT3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5vbmx5T3BlbkRheXMgPSBmdW5jdGlvbihkYXRlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBpZighJG1vbWVudChkYXRlKS5pc0JlZm9yZSgpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGUpO1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYuYm9va2VkRGF5cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYuYm9va2VkRGF5c1tpXS5zdGFydF9kYXRlKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYuYm9va2VkRGF5c1tpXS5zdGFydF9kYXRlKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCRtb21lbnQoc2VsZi5ib29rZWREYXlzW2ldLnN0YXJ0X2RhdGUpKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihtb21lbnQoZGF0ZSkuaXNTYW1lKHNlbGYuYm9va2VkRGF5c1tpXS5zdGFydF9kYXRlKSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5jcmVhdGVQdXJjaGFzZU9yZGVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5wdXJjaGFzZW9yZGVyKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwID0gc2VsZi5wdXJjaGFzZW9yZGVyO1xyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygkZXJyb3IpO1xyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3B1cmNoYXNlb3JkZXInKS5wb3N0KHApLnRoZW4oZnVuY3Rpb24oZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgICAgICAvLyRzdGF0ZS5nbygnYXBwLnByb2R1Y3RzLmRldGFpbCcsIHsncHJvZHVjdElkJzogZC5uZXdJZH0pO1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgIGlmKGQubmV3V29JZHMgJiYgZC5uZXdXb0lkcy5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsaW5rT2JqID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgbGlua09iai5wdXNoKHtMaW5rVGV4dDogJ1ZpZXcgQWxsIFBPcycsIExpbmtVcmw6ICRzdGF0ZS5ocmVmKCdhcHAucHVyY2hhc2VvcmRlcnMnKX0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmtPYmoucHVzaCh7TGlua1RleHQ6ICdWaWV3IENyZWF0ZWQgUE8nLCBMaW5rVXJsOiAkc3RhdGUuaHJlZignYXBwLnB1cmNoYXNlb3JkZXJzLmRldGFpbCcsIHtwdXJjaGFzZU9yZGVySWQ6IGQubmV3SWR9KX0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBkLm5ld1dvSWRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlua09iai5wdXNoKHtMaW5rVGV4dDogJ1ZpZXcgV08gIycgKyBkLm5ld1dvSWRzW2ldLCBMaW5rVXJsOiAkc3RhdGUuaHJlZignYXBwLndvcmtvcmRlcnMuZGV0YWlsJywge3dvcmtPcmRlcklkOiBkLm5ld1dvSWRzW2ldfSl9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5saW5rc1RvU2hvdyA9IGxpbmtPYmo7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKG51bGwsICdkbGdMaW5rQ2hvb3NlcicsICRzY29wZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucHVyY2hhc2VvcmRlcnMnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBjcmVhdGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYXBwbHlEaXNjb3VudCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci5kaXNjb3VudCA9PSBudWxsIHx8IHNlbGYucHVyY2hhc2VvcmRlci5kaXNjb3VudCA9PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBvcmlnaW5hbFRvdGFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAmJiBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgIT09IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAmJiBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPiAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkaXNjb3VudGVkID0gb3JpZ2luYWxUb3RhbCAtIHNlbGYucHVyY2hhc2VvcmRlci5kaXNjb3VudDtcclxuICAgICAgICAgICAgICAgICAgICBkaXNjb3VudGVkID49IDAgPyBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBkaXNjb3VudGVkIDogMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYXBwbHlEZWxpdmVyeSA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHNlbGYuZGVsaXZlcnlfY2hhcmdlID09PSAxKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIuZGVsaXZlcnkgPSBkZWxpdmVyeUZlZTtcclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCArPSBkZWxpdmVyeUZlZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5kZWxpdmVyeSA9IDA7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgLT0gZGVsaXZlcnlGZWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFwcGx5U2hpcHBpbmcgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgY29zdE9mU2hpcHBpbmcgPSAwO1xyXG4gICAgICAgICAgICBpZihzZWxmLnNoaXBwaW5nX2NoYXJnZSA9PT0gJ0NETicpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvc3RPZlNoaXBwaW5nID0gc2hpcHBpbmdDYW5hZGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZihzZWxmLnNoaXBwaW5nX2NoYXJnZSA9PT0gJ1VTQScpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvc3RPZlNoaXBwaW5nID0gc2hpcHBpbmdVc2E7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5zaGlwcGluZyA9IGNvc3RPZlNoaXBwaW5nO1xyXG5cclxuICAgICAgICAgICAgaWYoc2VsZi5zaGlwcGluZ19jaGFyZ2UgIT09IG9yaWdpbmFsU2hpcHBpbmdDaGFyZ2UpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCAtPSBvcmlnaW5hbFNoaXBwaW5nQ2hhcmdlO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsICs9IGNvc3RPZlNoaXBwaW5nO1xyXG5cclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsVG90YWwgLT0gb3JpZ2luYWxTaGlwcGluZ0NoYXJnZTtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsVG90YWwgKz0gY29zdE9mU2hpcHBpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG9yaWdpbmFsU2hpcHBpbmdDaGFyZ2UgPSBjb3N0T2ZTaGlwcGluZztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNlbGYuYWRkUHJvZHVjdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc2VsZWN0ZWRQcm9kdWN0KTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cyA9PT0gdW5kZWZpbmVkKSB7IHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cyA9IFtdOyB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBzZWxmLnNlbGVjdGVkUHJvZHVjdC5pZCxcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiBzZWxmLnNlbGVjdGVkUXVhbnRpdHksXHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0OiBzZWxmLnNlbGVjdGVkUHJvZHVjdFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9PT0gdW5kZWZpbmVkIHx8IHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9PT0gbnVsbCkgeyBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSAwOyB9XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50Q29zdCA9IHBhcnNlRmxvYXQoc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsKTtcclxuICAgICAgICAgICAgdmFyIGJ0ZXN0ID0gKHBhcnNlRmxvYXQoc2VsZi5zZWxlY3RlZFByb2R1Y3QucHJpY2UpICogcGFyc2VJbnQoc2VsZi5zZWxlY3RlZFF1YW50aXR5KSk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDb3N0ICs9IGJ0ZXN0O1xyXG4gICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBjdXJyZW50Q29zdDtcclxuICAgICAgICAgICAgb3JpZ2luYWxUb3RhbCA9IGN1cnJlbnRDb3N0O1xyXG5cclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFByb2R1Y3QgPSBcIlwiO1xyXG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkUXVhbnRpdHkgPSAwO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5wdXJjaGFzZW9yZGVyKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVByb2R1Y3QgPSBmdW5jdGlvbihlLCBwcm9kdWN0SWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXhUb1JlbW92ZTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYocHJvZHVjdElkID09IHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0c1tpXS5wcm9kdWN0X2lkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4VG9SZW1vdmUgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGluZGV4VG9SZW1vdmUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRDb3N0ID0gcGFyc2VGbG9hdChzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwpO1xyXG4gICAgICAgICAgICB2YXIgYnRlc3QgPSAocGFyc2VGbG9hdChzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaW5kZXhUb1JlbW92ZV0ucHJvZHVjdC5wcmljZSkgKiBwYXJzZUludChzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaW5kZXhUb1JlbW92ZV0ucXVhbnRpdHkpKTtcclxuICAgICAgICAgICAgY3VycmVudENvc3QgLT0gYnRlc3Q7XHJcbiAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9IGN1cnJlbnRDb3N0O1xyXG4gICAgICAgICAgICBvcmlnaW5hbFRvdGFsID0gY3VycmVudENvc3Q7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMuc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGV0ZXJtaW5lV29ya09yZGVycyA9IGZ1bmN0aW9uKGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5wdXJjaGFzZW9yZGVyLnN1cHByZXNzd29ya29yZGVyID09IDEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSnVzdCBwcm9jZXNzIHRoZSBQTyBhcyBub3JtYWxcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNyZWF0ZVB1cmNoYXNlT3JkZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb2R1Y3RzVG9GdWxmaWxsID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdHNUb0Z1bGZpbGwucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaV0ucHJvZHVjdF9pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaV0ucXVhbnRpdHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3NjaGVkdWxlci9nZXRXb3JrT3JkZXJzJykucG9zdCh7cHJvZHVjdHNUb0Z1bGZpbGw6IHByb2R1Y3RzVG9GdWxmaWxsfSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLndvcmtPcmRlcnNUb0NyZWF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLndvcmtPcmRlcnNUb0NyZWF0ZSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZXJlIGFyZSB3b3Jrb3JkZXJzIG5lZWRlZCBmb3IgdGhpcyBQTywgY29uZmlybSB0aGVpciBjcmVhdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLndvcmtPcmRlcnNUb0NyZWF0ZSA9IGRhdGEud29ya09yZGVyc1RvQ3JlYXRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLndvcmtPcmRlcnMgPSBkYXRhLndvcmtPcmRlcnM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoZSwgJ2RsZ0NvbmZpcm1Xb3JrT3JkZXJzJywgJHNjb3BlKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLndvcmtfb3JkZXJzID0gJHNjb3BlLndvcmtPcmRlcnM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2NvbmZpcm1lZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNyZWF0ZVB1cmNoYXNlT3JkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnY2FuY2VsbGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEp1c3QgcHJvY2VzcyB0aGUgUE8gYXMgbm9ybWFsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNyZWF0ZVB1cmNoYXNlT3JkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1B1cmNoYXNlT3JkZXJDcmVhdGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnJHNjb3BlJywgJyRtb21lbnQnLCAnUmVzdGFuZ3VsYXInLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3RTZXJ2aWNlJywgJ0RpYWxvZ1NlcnZpY2UnLCAnVmFsaWRhdGlvblNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgUHVyY2hhc2VPcmRlckNyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUHVyY2hhc2VPcmRlckRldGFpbENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgJHNjb3BlLCAkbW9tZW50LCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcywgVG9hc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbEN1c3RvbWVycyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQYXltZW50VHlwZXMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0UHVyY2hhc2VPcmRlcihzZWxmLCAkc3RhdGVQYXJhbXMucHVyY2hhc2VPcmRlcklkKTtcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsU2FsZXNDaGFubmVscygpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuc2FsZXNjaGFubmVscyA9IGRhdGE7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciBvcmlnaW5hbFRvdGFsID0gMDtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVQdXJjaGFzZU9yZGVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnB1dCgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwidXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IHVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAucHVyY2hhc2VvcmRlcnNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlUHVyY2hhc2VPcmRlciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWVsdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5wdXJjaGFzZW9yZGVyc1wiKTtcclxuXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBkZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2hvd0RlbGV0ZUNvbmZpcm0gPSBmdW5jdGlvbihldilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZXYsICdEZWxldGUgcHVyY2hhc2Ugb3JkZXI/JywgJycpO1xyXG4gICAgICAgICAgICBkaWFsb2cudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlUHVyY2hhc2VPcmRlcigpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5hcHBseURpc2NvdW50ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoc2VsZi5wdXJjaGFzZW9yZGVyLmRpc2NvdW50ID09IG51bGwgfHwgc2VsZi5wdXJjaGFzZW9yZGVyLmRpc2NvdW50ID09IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9IG9yaWdpbmFsVG90YWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICYmIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCAhPT0gbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgICYmIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA+IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpc2NvdW50ZWQgPSBvcmlnaW5hbFRvdGFsIC0gc2VsZi5wdXJjaGFzZW9yZGVyLmRpc2NvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc2NvdW50ZWQgPj0gMCA/IHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9IGRpc2NvdW50ZWQgOiAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5hZGRQcm9kdWN0ID0gZnVuY3Rpb24oZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc2VsZWN0ZWRQcm9kdWN0KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwb3BPYmogPSB7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBzZWxmLnNlbGVjdGVkUHJvZHVjdC5pZCxcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiBzZWxmLnNlbGVjdGVkUXVhbnRpdHksXHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0OiBzZWxmLnNlbGVjdGVkUHJvZHVjdFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdzY2hlZHVsZXIvZ2V0V29ya09yZGVycycpLnBvc3Qoe3Byb2R1Y3RzVG9GdWxmaWxsOiBbcG9wT2JqXSwgcHVyY2hhc2VPcmRlcklkOiBzZWxmLnB1cmNoYXNlb3JkZXIuaWR9KS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEud29ya09yZGVyc1RvQ3JlYXRlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMgPT09IHVuZGVmaW5lZCkgeyBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMgPSBbXTsgfVxyXG4gICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzLnB1c2gocG9wT2JqKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBSZWNhbGN1bGF0ZSBQTyB0b3RhbFxyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID09PSB1bmRlZmluZWQgfHwgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID09PSBudWxsKSB7IHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9IDA7IH1cclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50Q29zdCA9IHBhcnNlRmxvYXQoc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsKTtcclxuICAgICAgICAgICAgICAgIHZhciBidGVzdCA9IChwYXJzZUZsb2F0KHNlbGYuc2VsZWN0ZWRQcm9kdWN0LnByaWNlKSAqIHBhcnNlSW50KHNlbGYuc2VsZWN0ZWRRdWFudGl0eSkpO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudENvc3QgKz0gYnRlc3Q7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBjdXJyZW50Q29zdDtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsVG90YWwgPSBjdXJyZW50Q29zdDtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkUHJvZHVjdCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkUXVhbnRpdHkgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGRhdGEud29ya09yZGVyc1RvQ3JlYXRlID4gMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBUaGVyZSBhcmUgd29ya29yZGVycyBuZWVkZWQgZm9yIHRoaXMgUE8sIGFsZXJ0IG9mIHRoZWlyIGNyZWF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLndvcmtPcmRlcnNUb0NyZWF0ZSA9IGRhdGEud29ya09yZGVyc1RvQ3JlYXRlO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS53b3JrT3JkZXJzID0gZGF0YS53b3JrT3JkZXJzO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZShlLCAnZGxnQWxlcnRXb3JrT3JkZXJzJywgJHNjb3BlKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjb25maXJtZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBhZGRpbmcgcHJvZHVjdCwgcGxlYXNlIHRyeSBhZ2FpblwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVQcm9kdWN0ID0gZnVuY3Rpb24oZSwgcHJvZHVjdElkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4VG9SZW1vdmU7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHByb2R1Y3RJZCA9PSBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaV0ucHJvZHVjdF9pZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleFRvUmVtb3ZlID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpbmRleFRvUmVtb3ZlKTtcclxuXHJcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnc2NoZWR1bGVyL3Jlc3RvcmVTdG9ja0ZvclByb2R1Y3QnKS5wb3N0KHtwdXJjaGFzZV9vcmRlcl9pZDogc2VsZi5wdXJjaGFzZW9yZGVyLmlkLCBwcm9kdWN0X2lkOiBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaW5kZXhUb1JlbW92ZV0ucHJvZHVjdF9pZH0pLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gUmVjYWxjdWxhdGUgUE8gdG90YWxcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50Q29zdCA9IHBhcnNlRmxvYXQoc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsKTtcclxuICAgICAgICAgICAgICAgIHZhciBidGVzdCA9IChwYXJzZUZsb2F0KHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0c1tpbmRleFRvUmVtb3ZlXS5wcm9kdWN0LnByaWNlKSAqIHBhcnNlSW50KHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0c1tpbmRleFRvUmVtb3ZlXS5xdWFudGl0eSkpO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudENvc3QgLT0gYnRlc3Q7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBjdXJyZW50Q29zdDtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsVG90YWwgPSBjdXJyZW50Q29zdDtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMuc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xyXG5cclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIHVwZGF0aW5nIHN0b2NrLCBwbGVhc2UgdHJ5IGFnYWluXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQdXJjaGFzZU9yZGVyRGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJyRzY29wZScsICckbW9tZW50JywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsICdUb2FzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsIFB1cmNoYXNlT3JkZXJEZXRhaWxDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFB1cmNoYXNlT3JkZXJDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFB1cmNoYXNlT3JkZXJzKHNlbGYpO1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQdXJjaGFzZU9yZGVyQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgUHVyY2hhc2VPcmRlckNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUmVwb3J0Q29udHJvbGxlcigkc2NvcGUsICRhdXRoLCAkc3RhdGUsICRtb21lbnQsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgQ2hhcnRTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5yZXBvcnRQYXJhbXMgPSB7fTtcclxuXHJcbiAgICAgICAgaWYoJHN0YXRlLmlzKCdhcHAucmVwb3J0cy5jdXJyZW50c3RvY2snKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdlbmVyYXRlQ3VycmVudFN0b2NrUmVwb3J0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoJHN0YXRlLmlzKCdhcHAucmVwb3J0cy5zYWxlcycpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2hvd1NhbGVzUmVwb3J0VmlldygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKCRzdGF0ZS5pcygnYXBwLnJlcG9ydHMuc2FsZXNieW1vbnRoJykpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzaG93U2FsZXNSZXBvcnRCeU1vbnRoVmlldygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKCRzdGF0ZS5pcygnYXBwLnJlcG9ydHMuaW5jb21lYnltb250aCcpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2hvd0luY29tZVJlcG9ydEJ5TW9udGhWaWV3KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoJHN0YXRlLmlzKCdhcHAucmVwb3J0cy5wcm9kdWN0cHJvZml0cGVyY2VudHMnKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNob3dQcm9kdWN0UHJvZml0UGVyY2VudHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZigkc3RhdGUuaXMoJ2FwcC5yZXBvcnRzLndlZWt3b3Jrb3JkZXJzJykpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzaG93V2Vla2x5V29ya09yZGVycygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKCRzdGF0ZS5pcygnYXBwLnJlcG9ydHMuYW9zJykpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzaG93QW9zUmVwb3J0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIFJlcG9ydCBob21lXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJHN0YXRlLmlzKCdhcHAucmVwb3J0cycpKTtcclxuICAgICAgICAgICAgc2hvd0Rhc2hib2FyZFdpZGdldHMoKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93UHJvZHVjdFByb2ZpdFBlcmNlbnRzKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENoYXJ0U2VydmljZS5nZXRQcm9kdWN0UHJvZml0UGVyY2VudHMoc2VsZik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93V2Vla2x5V29ya09yZGVycygpXHJcbiAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdyZXBvcnRzL2dldFdlZWtXb3JrT3JkZXJSZXBvcnQnKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi53ZWVrd29ya29yZGVycyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEVycm9yXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlQ3VycmVudFN0b2NrUmVwb3J0KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR2VuZXJhdGUgc3RvY2sgcmVycG9ydFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNob3dTYWxlc1JlcG9ydFZpZXcoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsQ3VzdG9tZXJzKHNlbGYpO1xyXG4gICAgICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNob3dEYXNoYm9hcmRXaWRnZXRzKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENoYXJ0U2VydmljZS5nZXRUb3BTZWxsaW5nUHJvZHVjdHMoc2VsZiwgJ1RvcCBTZWxsaW5nIEFsbCBUaW1lJyk7XHJcbiAgICAgICAgICAgIC8vZ2V0V29yc3RTZWxsaW5nUHJvZHVjdHMoc2VsZik7XHJcbiAgICAgICAgICAgIGdldE92ZXJkdWVQdXJjaGFzZU9yZGVycyhzZWxmKTtcclxuICAgICAgICAgICAgZ2V0TW9udGhseUluY29tZShzZWxmKTtcclxuICAgICAgICAgICAgZ2V0T3V0c3RhbmRpbmdQYXltZW50cyhzZWxmKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuZGF5cmVwb3J0cyA9IFtdO1xyXG4gICAgICAgICAgICBzZWxmLmRhaWx5X3NhbGVzX2Zyb21fZGF0ZSA9IG1vbWVudCgpLnN1YnRyYWN0KDcsICdkYXlzJykudG9EYXRlKCk7XHJcbiAgICAgICAgICAgIHNlbGYuZGFpbHlfc2FsZXNfdG9fZGF0ZSA9IG1vbWVudCgpLnRvRGF0ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2hvd1NhbGVzUmVwb3J0QnlNb250aFZpZXcoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ2hhcnRTZXJ2aWNlLmdldE1vbnRobHlTYWxlc1JlcG9ydChzZWxmKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNob3dJbmNvbWVSZXBvcnRCeU1vbnRoVmlldygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDaGFydFNlcnZpY2UuZ2V0TW9udGhseUluY29tZVJlcG9ydChzZWxmKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNob3dBb3NSZXBvcnQoKVxyXG4gICAgICAgIHtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWxmLmdldFNhbGVzUmVwb3J0ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5yZXBvcnRQYXJhbXMpO1xyXG4gICAgICAgICAgICBzZWxmLnBvVG90YWwgPSAwO1xyXG4gICAgICAgICAgICBzZWxmLnBvQ291bnQgPSAwO1xyXG5cclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdyZXBvcnRzL2dldFNhbGVzUmVwb3J0JykucG9zdCh7ICdyZXBvcnRQYXJhbXMnOiBzZWxmLnJlcG9ydFBhcmFtc30pLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5yZXN1bHRzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIHNlbGYucG9Db3VudCA9IGRhdGEubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi5yZXN1bHRzWzBdKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRXb3JzdFNlbGxpbmdQcm9kdWN0cyhzY29wZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncmVwb3J0cy9nZXRXb3JzdFNlbGxpbmdQcm9kdWN0cycpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi53b3JzdFNlbGxpbmdQcm9kdWN0cyA9IGRhdGE7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gRXJyb3JcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRPdmVyZHVlUHVyY2hhc2VPcmRlcnMoc2NvcGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3JlcG9ydHMvZ2V0T3ZlcmR1ZVB1cmNoYXNlT3JkZXJzJykuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLm92ZXJkdWVQdXJjaGFzZU9yZGVycyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAvL3NlbGYucG9Db3VudCA9IGRhdGEubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIEVycm9yXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0TW9udGhseUluY29tZShzY29wZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgncmVwb3J0cy9nZXRNb250aGx5U2FsZXNSZXBvcnQnKS5wb3N0KHsgJ3JlcG9ydFBhcmFtcyc6IHt9fSkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLm1vbnRobHlJbmNvbWVzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBpZihzY29wZS5tb250aGx5SW5jb21lcy5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGwgPSBzY29wZS5tb250aGx5SW5jb21lcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkID0gbmV3IERhdGUoc2NvcGUubW9udGhseUluY29tZXNbbC0xXS55ZWFyLCBzY29wZS5tb250aGx5SW5jb21lc1tsLTFdLm1vbnRoIC0gMSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmN1ck1vbnRobHlJbmNvbWVNb250aCA9IGQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmN1ck1vbnRobHlJbmNvbWVUb3RhbCA9IHNjb3BlLm1vbnRobHlJbmNvbWVzW2wtMV0ubW9udGh0b3RhbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY3VyTW9udGhseUluY29tZVBvcyA9IGwgLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRXJyb3JcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0T3V0c3RhbmRpbmdQYXltZW50cyhzY29wZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncmVwb3J0cy9nZXRPdXRzdGFuZGluZ1BheW1lbnRzJykuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUub3V0c3RhbmRpbmdQYXltZW50cyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc2NvcGUub3V0c3RhbmRpbmdQYXltZW50cy5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZShzY29wZS5vdXRzdGFuZGluZ1BheW1lbnRzWzBdLnllYXIsIHNjb3BlLm91dHN0YW5kaW5nUGF5bWVudHNbMF0ubW9udGggLSAxLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY3VyTW9udGhseU91dHN0YW5kaW5nTW9udGggPSBkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXJNb250aGx5T3VzdGFuZGluZ1RvdGFsID0gc2NvcGUub3V0c3RhbmRpbmdQYXltZW50c1swXS5vdXRzdGFuZGluZztcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY3VyTW9udGhseU91dHN0YW5kaW5nUG9zID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEVycm9yXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbGYuY2hhbmdlTW9udGhseU91dHN0YW5kaW5nID0gZnVuY3Rpb24oaW5jcmVtZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5jdXJNb250aGx5T3V0c3RhbmRpbmdQb3MgKz0gaW5jcmVtZW50O1xyXG5cclxuICAgICAgICAgICAgaWYoKHNlbGYuY3VyTW9udGhseU91dHN0YW5kaW5nUG9zIDwgMCkpIHsgc2VsZi5jdXJNb250aGx5T3V0c3RhbmRpbmdQb3MgPSAwOyB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoKHNlbGYuY3VyTW9udGhseU91dHN0YW5kaW5nUG9zICsgMSkgPiBzZWxmLm91dHN0YW5kaW5nUGF5bWVudHMubGVuZ3RoKSB7IHNlbGYuY3VyTW9udGhseU91dHN0YW5kaW5nUG9zID0gc2VsZi5vdXRzdGFuZGluZ1BheW1lbnRzLmxlbmd0aCAtIDE7IH1cclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYuY3VyTW9udGhseU91dHN0YW5kaW5nUG9zID49IDAgJiYgKHNlbGYuY3VyTW9udGhseU91dHN0YW5kaW5nUG9zICsgMSkgPD0gc2VsZi5vdXRzdGFuZGluZ1BheW1lbnRzLmxlbmd0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZShzZWxmLm91dHN0YW5kaW5nUGF5bWVudHNbc2VsZi5jdXJNb250aGx5T3V0c3RhbmRpbmdQb3NdLnllYXIsIHNlbGYub3V0c3RhbmRpbmdQYXltZW50c1tzZWxmLmN1ck1vbnRobHlPdXRzdGFuZGluZ1Bvc10ubW9udGggLSAxLCAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLmN1ck1vbnRobHlPdXRzdGFuZGluZ01vbnRoID0gZDtcclxuICAgICAgICAgICAgICAgIHNlbGYuY3VyTW9udGhseU91c3RhbmRpbmdUb3RhbCA9IHNlbGYub3V0c3RhbmRpbmdQYXltZW50c1tzZWxmLmN1ck1vbnRobHlPdXRzdGFuZGluZ1Bvc10ub3V0c3RhbmRpbmc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmNoYW5nZU1vbnRobHlJbmNvbWUgPSBmdW5jdGlvbihpbmNyZW1lbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdMZW46JyArIHNlbGYubW9udGhseUluY29tZXMubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi5jdXJNb250aGx5SW5jb21lUG9zKTtcclxuICAgICAgICAgICAgc2VsZi5jdXJNb250aGx5SW5jb21lUG9zICs9IGluY3JlbWVudDtcclxuXHJcbiAgICAgICAgICAgIGlmKChzZWxmLmN1ck1vbnRobHlJbmNvbWVQb3MgPCAwKSkgeyBzZWxmLmN1ck1vbnRobHlJbmNvbWVQb3MgPSAwOyB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoKHNlbGYuY3VyTW9udGhseUluY29tZVBvcyArIDEpID4gc2VsZi5tb250aGx5SW5jb21lcy5sZW5ndGgpIHsgc2VsZi5jdXJNb250aGx5SW5jb21lUG9zID0gc2VsZi5tb250aGx5SW5jb21lcy5sZW5ndGggLSAxOyB9XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYuY3VyTW9udGhseUluY29tZVBvcyk7XHJcblxyXG4gICAgICAgICAgICBpZihzZWxmLmN1ck1vbnRobHlJbmNvbWVQb3MgPj0gMCAmJiAoc2VsZi5jdXJNb250aGx5SW5jb21lUG9zICsgMSkgPD0gc2VsZi5tb250aGx5SW5jb21lcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBkID0gbmV3IERhdGUoc2VsZi5tb250aGx5SW5jb21lc1tzZWxmLmN1ck1vbnRobHlJbmNvbWVQb3NdLnllYXIsIHNlbGYubW9udGhseUluY29tZXNbc2VsZi5jdXJNb250aGx5SW5jb21lUG9zXS5tb250aCAtIDEsIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYuY3VyTW9udGhseUluY29tZU1vbnRoID0gZDtcclxuICAgICAgICAgICAgICAgIHNlbGYuY3VyTW9udGhseUluY29tZVRvdGFsID0gc2VsZi5tb250aGx5SW5jb21lc1tzZWxmLmN1ck1vbnRobHlJbmNvbWVQb3NdLm1vbnRodG90YWw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zZXRQb1RvdGFsID0gZnVuY3Rpb24oaXRlbSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0pO1xyXG4gICAgICAgICAgICBpZihpdGVtKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBvVG90YWwgKz0gcGFyc2VGbG9hdChpdGVtLnRvdGFsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZ2V0RGFpbHlTYWxlc0NzdiA9IGZ1bmN0aW9uKGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLmRhaWx5X3NhbGVzX2Zyb21fZGF0ZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuZGFpbHlfc2FsZXNfdG9fZGF0ZSk7XHJcblxyXG5cclxuICAgICAgICAgICAgc2VsZi5yZXBvcnRQYXJhbXMuZGFpbHlfc2FsZXNfZnJvbV9kYXRlICA9IHNlbGYuZGFpbHlfc2FsZXNfZnJvbV9kYXRlO1xyXG4gICAgICAgICAgICBzZWxmLnJlcG9ydFBhcmFtcy5kYWlseV9zYWxlc190b19kYXRlICA9IHNlbGYuZGFpbHlfc2FsZXNfdG9fZGF0ZTtcclxuXHJcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgncmVwb3J0cy9nZXREYWlseVNhbGVzJykucG9zdCh7ICdyZXBvcnRQYXJhbXMnOiBzZWxmLnJlcG9ydFBhcmFtc30pLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmRheXJlcG9ydHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLnJlc3VsdHNbMF0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIEVycm9yXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1JlcG9ydENvbnRyb2xsZXInLCBbJyRzY29wZScsICckYXV0aCcsICckc3RhdGUnLCAnJG1vbWVudCcsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICdDaGFydFNlcnZpY2UnLCBSZXBvcnRDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFNlYXJjaENvbnRyb2xsZXIoJHNjb3BlLCAkYXV0aCwgUmVzdGFuZ3VsYXIsICRzdGF0ZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYubm9DYWNoZSA9IHRydWU7XHJcbiAgICAgICAgc2VsZi5zZWFyY2hUZXh0ID0gXCJcIjtcclxuICAgICAgICBzZWxmLnNlbGVjdGVkUmVzdWx0ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICBzZWxmLmRvU2VhcmNoID0gZnVuY3Rpb24ocXVlcnkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL1Jlc3RTZXJ2aWNlLmRvU2VhcmNoKHNlbGYsIHNlbGYuc2VhcmNoVGV4dCk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5vbmUoJ3NlYXJjaCcsIHF1ZXJ5KS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5maXJlVG9nZ2xlU2VhcmNoRXZlbnQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAvL3NlbGYuJHJvb3QuJGJyb2FkY2FzdChcInRvZ2dsZVNlYXJjaFwiLCB7dXNlcm5hbWU6ICRzY29wZS51c2VyLnVzZXJuYW1lIH0pO1xyXG4gICAgICAgICAgICAkc2NvcGUuJHJvb3QuJGJyb2FkY2FzdChcInRvZ2dsZVNlYXJjaFwiKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmdvdG9JdGVtID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5zZWxlY3RlZFJlc3VsdCk7XHJcbiAgICAgICAgICAgIGlmKHNlbGYuc2VsZWN0ZWRSZXN1bHQgIT09IG51bGwgJiYgc2VsZi5zZWxlY3RlZFJlc3VsdCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaFRleHQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5maXJlVG9nZ2xlU2VhcmNoRXZlbnQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2goc2VsZi5zZWxlY3RlZFJlc3VsdC5jb250ZW50X3R5cGUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInByb2R1Y3RcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucHJvZHVjdHMuZGV0YWlsJywgeydwcm9kdWN0SWQnOiBzZWxmLnNlbGVjdGVkUmVzdWx0LmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiY3VzdG9tZXJcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuY3VzdG9tZXJzLmRldGFpbCcsIHsnY3VzdG9tZXJJZCc6IHNlbGYuc2VsZWN0ZWRSZXN1bHQuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJldmVudFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ldmVudHMuZGV0YWlsJywgeydldmVudElkJzogc2VsZi5zZWxlY3RlZFJlc3VsdC5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIndvcmtvcmRlclwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC53b3Jrb3JkZXJzLmRldGFpbCcsIHsnd29ya09yZGVySWQnOiBzZWxmLnNlbGVjdGVkUmVzdWx0LmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwibWF0ZXJpYWxcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAubWF0ZXJpYWxzLmRldGFpbCcsIHsnbWF0ZXJpYWxJZCc6IHNlbGYuc2VsZWN0ZWRSZXN1bHQuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwdXJjaGFzZW9yZGVyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLnB1cmNoYXNlb3JkZXJzLmRldGFpbCcsIHsncHVyY2hhc2VPcmRlcklkJzogc2VsZi5zZWxlY3RlZFJlc3VsdC5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NlYXJjaENvbnRyb2xsZXInLCBbJyRzY29wZScsICckYXV0aCcsICdSZXN0YW5ndWxhcicsICckc3RhdGUnLCBTZWFyY2hDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFVuaXRDcmVhdGVDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZVVuaXQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaXNWYWxpZCk7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYudW5pdCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHNlbGYudW5pdDtcclxuXHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3VuaXQnKS5wb3N0KGMpLnRoZW4oZnVuY3Rpb24oZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyRzdGF0ZS5nbygnYXBwLmN1c3RvbWVycy5kZXRhaWwnLCB7J2N1c3RvbWVySWQnOiBkLm5ld0lkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC51bml0cycpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGNyZWF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVW5pdENyZWF0ZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdUb2FzdFNlcnZpY2UnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgVW5pdENyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gVW5pdERldGFpbENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgVG9hc3RTZXJ2aWNlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJHN0YXRlUGFyYW1zKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRVbml0KHNlbGYsICRzdGF0ZVBhcmFtcy51bml0SWQpO1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZVVuaXQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaXNWYWxpZCk7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnVuaXQucHV0KCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgdXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAudW5pdHNcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVVbml0ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi51bml0LnJlbW92ZSgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBkZWxldGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLnVuaXRzXCIpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgRGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zaG93RGVsZXRlQ29uZmlybSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZyA9IERpYWxvZ1NlcnZpY2UuY29uZmlybShldiwgJ0RlbGV0ZSB1bml0PycsICcnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlVW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdVbml0RGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIFVuaXREZXRhaWxDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFVuaXRDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFVuaXRzKHNlbGYpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVW5pdENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsIFVuaXRDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFdvcmtPcmRlckNyZWF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFVwbG9hZFNlcnZpY2UsIFRvYXN0U2VydmljZSwgJG1vbWVudCwgUmVzdFNlcnZpY2UsIFZhbGlkYXRpb25TZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxDdXN0b21lcnMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUHJvZHVjdHMoc2VsZik7XHJcblxyXG4gICAgICAgIHNlbGYubnVtZXJpY1JlZ2V4ID0gVmFsaWRhdGlvblNlcnZpY2UubnVtZXJpY1JlZ2V4KCk7XHJcbiAgICAgICAgc2VsZi53b3Jrb3JkZXIgPSB7fTtcclxuXHJcbiAgICAgICAgc2VsZi51cGxvYWRGaWxlID0gZnVuY3Rpb24oZmlsZSwgZXJyRmlsZXMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmYgPSBmaWxlO1xyXG4gICAgICAgICAgICBzZWxmLmVyckZpbGUgPSBlcnJGaWxlcyAmJiBlcnJGaWxlc1swXTtcclxuICAgICAgICAgICAgaWYoZmlsZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVXBsb2FkU2VydmljZS51cGxvYWRGaWxlKCcnLCBmaWxlKS50aGVuKGZ1bmN0aW9uIChyZXNwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlc3AuZGF0YS5zdWNjZXNzID09IDEpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdzdWNjZXNzZnVsIHVwbG9hZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLndvcmtvcmRlci5pbWFnZV9maWxlbmFtZSA9IHJlc3AuZGF0YS5maWxlbmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnU3VjY2VzcyAnICsgcmVzcC5jb25maWcuZGF0YS5maWxlLm5hbWUgKyAndXBsb2FkZWQuIFJlc3BvbnNlOiAnICsgcmVzcC5kYXRhKTtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwLnN0YXR1cyA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVycm9yTXNnID0gcmVzcC5zdGF0dXMgKyAnOiAnICsgcmVzcC5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3Igc3RhdHVzOiAnICsgcmVzcC5zdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGV2dClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWxlLnByb2dyZXNzID0gTWF0aC5taW4oMTAwLCBwYXJzZUludCgxMDAuMCAqIGV2dC5sb2FkZWQgLyBldnQudG90YWwpKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5jcmVhdGVXb3JrT3JkZXIgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaXNWYWxpZCk7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYud29ya29yZGVyKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdyA9IHNlbGYud29ya29yZGVyO1xyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnd29ya29yZGVyJykucG9zdCh3KS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBjcmVhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vJHN0YXRlLmdvKCdhcHAud29ya29yZGVycy5kZXRhaWwnLCB7J3dvcmtPcmRlcklkJzogMX0pO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLndvcmtvcmRlcnMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1dvcmtPcmRlckNyZWF0ZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdVcGxvYWRTZXJ2aWNlJywgJ1RvYXN0U2VydmljZScsICckbW9tZW50JywgJ1Jlc3RTZXJ2aWNlJywgJ1ZhbGlkYXRpb25TZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIFdvcmtPcmRlckNyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gV29ya09yZGVyRGV0YWlsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCAkc2NvcGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFVwbG9hZFNlcnZpY2UsIFJlc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCBWYWxpZGF0aW9uU2VydmljZSwgJG1vbWVudCwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldFdvcmtPcmRlcihzZWxmLCAkc3RhdGVQYXJhbXMud29ya09yZGVySWQpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbEN1c3RvbWVycyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi5udW1lcmljUmVnZXggPSBWYWxpZGF0aW9uU2VydmljZS5udW1lcmljUmVnZXgoKTtcclxuXHJcbiAgICAgICAgc2VsZi50b2dnbGVDb21wbGV0ZSA9IGZ1bmN0aW9uKGNiU3RhdGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjYlN0YXRlKTtcclxuICAgICAgICAgICAgLy9pZihjYlN0YXRlKSB7IHNlbGYud29ya29yZGVyLmNvbXBsZXRlZCA9IDE7IH1cclxuICAgICAgICAgICAgLy9lbHNlIHsgc2VsZi53b3Jrb3JkZXIuY29tcGxldGVkID0gMDsgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYudmlld0F0dGFjaG1lbnQgPSBmdW5jdGlvbihldiwgZmlsZW5hbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAkc2NvcGUuYSA9IGF0dGFjaG1lbnRQYXRoICArICcvJyArIGZpbGVuYW1lO1xyXG5cclxuICAgICAgICAgICAgRGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoZXYsICdkbGdBdHRhY2htZW50VmlldycsICRzY29wZSkudGhlbihcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY29uZmlybWVkJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGF0dGFjaG1lbnRQYXRoICArICcvJyArIGZpbGVuYW1lKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZUF0dGFjaG1lbnQgPSBmdW5jdGlvbihldiwgZmlsZW5hbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGV2LCAnRGVsZXRlIGF0dGFjaG1lbnQ/JywgJycpO1xyXG4gICAgICAgICAgICBkaWFsb2cudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVXBsb2FkU2VydmljZS5kZWxldGVGaWxlKGZpbGVuYW1lKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYud29ya29yZGVyLmltYWdlX2ZpbGVuYW1lID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5mLnByb2dyZXNzID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZiA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkF0dGFjaGVudCBkZWxldGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3ApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGRlbGV0aW5nIGF0dGFjaG1lbnRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi51cGxvYWRGaWxlID0gZnVuY3Rpb24oZmlsZSwgZXJyRmlsZXMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmYgPSBmaWxlO1xyXG4gICAgICAgICAgICBzZWxmLmVyckZpbGUgPSBlcnJGaWxlcyAmJiBlcnJGaWxlc1swXTtcclxuICAgICAgICAgICAgaWYoZmlsZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGZuYW1lID0gJyc7XHJcbiAgICAgICAgICAgICAgICBpZihzZWxmLndvcmtvcmRlci5pbWFnZV9maWxlbmFtZSAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgc2VsZi53b3Jrb3JkZXIuaW1hZ2VfZmlsZW5hbWUgIT09IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAmJiBzZWxmLndvcmtvcmRlci5pbWFnZV9maWxlbmFtZSAhPT0gJ251bGwnXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgc2VsZi53b3Jrb3JkZXIuaW1hZ2VfZmlsZW5hbWUgIT09ICcnKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGZuYW1lID0gc2VsZi53b3Jrb3JkZXIuaW1hZ2VfZmlsZW5hbWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgVXBsb2FkU2VydmljZS51cGxvYWRGaWxlKGZuYW1lLCBmaWxlKS50aGVuKGZ1bmN0aW9uIChyZXNwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlc3AuZGF0YS5zdWNjZXNzID09IDEpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdzdWNjZXNzZnVsIHVwbG9hZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLndvcmtvcmRlci5pbWFnZV9maWxlbmFtZSA9IHJlc3AuZGF0YS5maWxlbmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnU3VjY2VzcyAnICsgcmVzcC5jb25maWcuZGF0YS5maWxlLm5hbWUgKyAndXBsb2FkZWQuIFJlc3BvbnNlOiAnICsgcmVzcC5kYXRhKTtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwLnN0YXR1cyA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmVycm9yTXNnID0gcmVzcC5zdGF0dXMgKyAnOiAnICsgcmVzcC5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3Igc3RhdHVzOiAnICsgcmVzcC5zdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGV2dClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWxlLnByb2dyZXNzID0gTWF0aC5taW4oMTAwLCBwYXJzZUludCgxMDAuMCAqIGV2dC5sb2FkZWQgLyBldnQudG90YWwpKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVXb3JrT3JkZXIgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaXNWYWxpZCk7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLndvcmtvcmRlci5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC53b3Jrb3JkZXJzXCIpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlV29ya09yZGVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi53b3Jrb3JkZXIucmVtb3ZlKCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGRlbGV0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAud29ya29yZGVyc1wiKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGRlbGV0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNob3dEZWxldGVDb25maXJtID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGV2LCAnRGVsZXRlIHdvcmsgb3JkZXI/JywgJycpO1xyXG4gICAgICAgICAgICBkaWFsb2cudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5kZWxldGVXb3JrT3JkZXIoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignV29ya09yZGVyRGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJyRzY29wZScsICdUb2FzdFNlcnZpY2UnLCAnUmVzdGFuZ3VsYXInLCAnVXBsb2FkU2VydmljZScsICdSZXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgJ1ZhbGlkYXRpb25TZXJ2aWNlJywgJyRtb21lbnQnLCAnJHN0YXRlUGFyYW1zJywgV29ya09yZGVyRGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBXb3JrT3JkZXJDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgJG1vbWVudClcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYuc2hvd0NvbXBsZXRlID0gZmFsc2U7XHJcbiAgICAgICAgdmFyIHRvZGF5c0RhdGUgPSAkbW9tZW50KCk7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFdvcmtPcmRlcnMoc2VsZik7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHNlbGYpO1xyXG5cclxuICAgICAgICBzZWxmLnNldFVyZ2VuY3kgPSBmdW5jdGlvbihvYmpEYXRlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy8gMyBkYXlzLCA3IGRheXMsIDMwIGRheXMsIHRoZSByZXN0XHJcbiAgICAgICAgICAgIHZhciBkID0gJG1vbWVudChvYmpEYXRlKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkKTtcclxuICAgICAgICAgICAgdmFyIGRheURpZmYgPSBkLmRpZmYodG9kYXlzRGF0ZSwgJ2RheXMnKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGRheURpZmYgPiAzMCkgLy8gZ3JlZW5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiZmFyV29ya09yZGVyXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZihkYXlEaWZmID4gNyAmJiBkYXlEaWZmIDw9IDMwKSAvLyBibHVlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImNsb3NlV29ya09yZGVyXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZihkYXlEaWZmID4gMyAmJiBkYXlEaWZmIDw9IDcpIC8vIG9yYW5nZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJjbG9zZXJXb3JrT3JkZXJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIC8vIHJlZFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJjbG9zZXN0V29ya09yZGVyXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZC5kaWZmKHRvZGF5c0RhdGUsICdkYXlzJykpO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnRvZ2dsZUNvbXBsZXRlT25seSA9IGZ1bmN0aW9uKGNiU3RhdGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygndG9nZ2xlJyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNiU3RhdGUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdXb3JrT3JkZXJDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnJG1vbWVudCcsIFdvcmtPcmRlckNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
