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
            .state('app.saleschannels', {
                url: '/saleschannels',
                views: {
                    'main@': {
                        templateUrl: getView('saleschannels'),
                        controller: 'SalesChannelController',
                        controllerAs: 'ctrlSalesChannel'
                    }
                }
            })
            .state('app.saleschannels.create', {
                url: '/create',
                views: {
                    'main@': {
                        templateUrl: getView('saleschannel.create'),
                        controller: 'SalesChannelCreateController',
                        controllerAs: 'ctrlSalesChannelCreate'
                    }
                }
            })
            .state('app.saleschannels.detail', {
                url: '/detail/:salesChannelId',
                views: {
                    'main@': {
                        templateUrl: getView('saleschannel.detail'),
                        controller: 'SalesChannelDetailController',
                        controllerAs: 'ctrlSalesChannelDetail'
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
 * Checklist-model
 * AngularJS directive for list of checkboxes
 * https://github.com/vitalets/checklist-model
 * License: MIT http://opensource.org/licenses/MIT
 */

angular.module('app.directives')
    .directive('checklistModel', ['$parse', '$compile', function($parse, $compile) {
        // contains
        function contains(arr, item, comparator) {
            if (angular.isArray(arr)) {
                for (var i = arr.length; i--;) {
                    if (comparator(arr[i], item)) {
                        return true;
                    }
                }
            }
            return false;
        }

        // add
        function add(arr, item, comparator) {
            arr = angular.isArray(arr) ? arr : [];
            if(!contains(arr, item, comparator)) {
                arr.push(item);
            }
            return arr;
        }

        // remove
        function remove(arr, item, comparator) {
            if (angular.isArray(arr)) {
                for (var i = arr.length; i--;) {
                    if (comparator(arr[i], item)) {
                        arr.splice(i, 1);
                        break;
                    }
                }
            }
            return arr;
        }

        // http://stackoverflow.com/a/19228302/1458162
        function postLinkFn(scope, elem, attrs) {
            // exclude recursion, but still keep the model
            var checklistModel = attrs.checklistModel;
            attrs.$set("checklistModel", null);
            // compile with `ng-model` pointing to `checked`
            $compile(elem)(scope);
            attrs.$set("checklistModel", checklistModel);

            // getter / setter for original model
            var getter = $parse(checklistModel);
            var setter = getter.assign;
            var checklistChange = $parse(attrs.checklistChange);
            var checklistBeforeChange = $parse(attrs.checklistBeforeChange);

            // value added to list
            var value = attrs.checklistValue ? $parse(attrs.checklistValue)(scope.$parent) : attrs.value;


            var comparator = angular.equals;

            if (attrs.hasOwnProperty('checklistComparator')){
                if (attrs.checklistComparator[0] == '.') {
                    var comparatorExpression = attrs.checklistComparator.substring(1);
                    comparator = function (a, b) {
                        return a[comparatorExpression] === b[comparatorExpression];
                    };

                } else {
                    comparator = $parse(attrs.checklistComparator)(scope.$parent);
                }
            }

            // watch UI checked change
            scope.$watch(attrs.ngModel, function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                if (checklistBeforeChange && (checklistBeforeChange(scope) === false)) {
                    scope[attrs.ngModel] = contains(getter(scope.$parent), value, comparator);
                    return;
                }

                setValueInChecklistModel(value, newValue);

                if (checklistChange) {
                    checklistChange(scope);
                }
            });

            function setValueInChecklistModel(value, checked) {
                var current = getter(scope.$parent);
                if (angular.isFunction(setter)) {
                    if (checked === true) {
                        setter(scope.$parent, add(current, value, comparator));
                    } else {
                        setter(scope.$parent, remove(current, value, comparator));
                    }
                }

            }

            // declare one function to be used for both $watch functions
            function setChecked(newArr, oldArr) {
                if (checklistBeforeChange && (checklistBeforeChange(scope) === false)) {
                    setValueInChecklistModel(value, scope[attrs.ngModel]);
                    return;
                }
                scope[attrs.ngModel] = contains(newArr, value, comparator);
            }

            // watch original model change
            // use the faster $watchCollection method if it's available
            if (angular.isFunction(scope.$parent.$watchCollection)) {
                scope.$parent.$watchCollection(checklistModel, setChecked);
            } else {
                scope.$parent.$watch(checklistModel, setChecked, true);
            }
        }

        return {
            restrict: 'A',
            priority: 1000,
            terminal: true,
            scope: true,
            compile: function(tElement, tAttrs) {
                if ((tElement[0].tagName !== 'INPUT' || tAttrs.type !== 'checkbox') && (tElement[0].tagName !== 'MD-CHECKBOX') && (!tAttrs.btnCheckbox)) {
                    throw 'checklist-model should be applied to `input[type="checkbox"]` or `md-checkbox`.';
                }

                if (!tAttrs.checklistValue && !tAttrs.value) {
                    throw 'You should provide `value` or `checklist-value`.';
                }

                // by default ngModel is 'checked', so we set it if not specified
                if (!tAttrs.ngModel) {
                    // local scope var storing individual checkbox model
                    tAttrs.$set("ngModel", "checked");
                }

                return postLinkFn;
            }
        };
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

    angular.module("app.services").factory('RestService', ['$q', '$auth', 'Restangular', '$moment', function($q, $auth, Restangular, $moment){

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

            getWorkOrder: function(id)
            {
                var p = Restangular.one('workorder', id).get().then(function(data)
                {
                    //console.log(data);

                    // Format string dates into date objects
                    data.start_date = $moment(data.start_date);
                    data.end_date = $moment(data.end_date);

                    // Hack for OLD mysql drivers on Hostgator which don't properly encode integer and return them as strings
                    data.completed = parseInt(data.completed);

                    // More Hostgator shit
                    if(data.work_order_progress && data.work_order_progress.length > 0)
                    {
                        for(var i = 0; i < data.work_order_progress.length; i++)
                        {
                            data.work_order_progress[i].work_order_id = parseInt(data.work_order_progress[i].work_order_id);
                            data.work_order_progress[i].work_order_task_id = parseInt(data.work_order_progress[i].work_order_task_id);
                        }
                    }

                    // Count work order progress states
                    //scope.completedProgressCount = data.work_order_progress.length;

                    //scope.workorder = data;

                    return data;
                });

                return p;
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
            },

            getSalesChannel: function(id)
            {
                return Restangular.one('saleschannel', id).get();
            },

            getAllWorkOrderTasks: function()
            {
                return Restangular.all('workordertask').getList();
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
                || $state.is("app.units") || $state.is("app.materials")
                || $state.is("app.saleschannels"))
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
                case "app.saleschannels":
                    url = "app.saleschannels.create";
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

(function(){
    "use strict";

    function SalesChannelCreateController($auth, $state, ToastService, Restangular, $stateParams)
    {
        var self = this;

        self.createSalesChannel = function()
        {
            self.form1.$setSubmitted();

            var isValid = self.form1.$valid;
            //console.log(isValid);

            if(isValid)
            {
                //console.log(self.paymenttype);

                var c = self.saleschannel;

                Restangular.all('saleschannel').post(c).then(function(d)
                {
                    //console.log(d);
                    ToastService.show("Successfully created");
                    $state.go('app.saleschannels');

                }, function()
                {
                    ToastService.show("Error creating");
                });
            }
        };

    }

    angular.module('app.controllers').controller('SalesChannelCreateController', ['$auth', '$state', 'ToastService', 'Restangular', '$stateParams', SalesChannelCreateController]);

})();

(function(){
    "use strict";

    function SalesChannelDetailController($auth, $state, ToastService, RestService, DialogService, $stateParams)
    {
        var self = this;

        //console.log($stateParams);
        RestService.getSalesChannel($stateParams.salesChannelId).then(function(data)
        {
            self.saleschannel = data;
        });

        self.updateSalesChannel = function()
        {
            self.form1.$setSubmitted();

            var isValid = self.form1.$valid;
            //console.log(isValid);

            if(isValid)
            {
                self.saleschannel.put().then(function()
                {
                    ToastService.show("Successfully updated");
                    $state.go("app.saleschannels");

                }, function()
                {
                    ToastService.show("Error updating");
                    console.log("error updating");
                });
            }

        };

        self.deleteSalesChannel = function()
        {
            self.saleschannel.remove().then(function()
            {
                ToastService.show("Successfully deleted");
                $state.go("app.saleschannels");
            }, function()
            {
                ToastService.show("Error Deleting");
            });


        };

        self.showDeleteConfirm = function(ev)
        {
            var dialog = DialogService.confirm(ev, 'Delete sales channel?', '');
            dialog.then(function()
                {
                    self.deleteSalesChannel();
                },
                function()
                {
                });
        };

    }

    angular.module('app.controllers').controller('SalesChannelDetailController', ['$auth', '$state', 'ToastService', 'RestService', 'DialogService', '$stateParams', SalesChannelDetailController]);

})();

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
        RestService.getWorkOrder($stateParams.workOrderId).then(function(data)
        {
            //console.log(data);
            self.workorder = data;

            RestService.getAllWorkOrderTasks().then(function(data)
            {
                self.workordertasks = data;
            });

        });

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
                console.log(self.workorder);

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHAuanMiLCJhcHAvcm91dGVzLmpzIiwiYXBwL2RpcmVjdGl2ZXMvYXBwTG9hZGluZy5qcyIsImFwcC9kaXJlY3RpdmVzL2NoZWNrbGlzdE1vZGVsLmpzIiwiYXBwL2RpcmVjdGl2ZXMvZm9jdXNPbi5qcyIsImFwcC9kaXJlY3RpdmVzL3V0Yy1wYXJzZXIuZGlyZWN0aXZlLmpzIiwiYXBwL2ZpbHRlcnMvdHJ1bmNhdGVOYW1lLmpzIiwiYXBwL3NlcnZpY2VzL2F1dGguanMiLCJhcHAvc2VydmljZXMvY2hhcnQuanMiLCJhcHAvc2VydmljZXMvZGlhbG9nLmpzIiwiYXBwL3NlcnZpY2VzL2ZvY3VzLmpzIiwiYXBwL3NlcnZpY2VzL2d1aWQuanMiLCJhcHAvc2VydmljZXMvcmVzdC5qcyIsImFwcC9zZXJ2aWNlcy90b2FzdC5qcyIsImFwcC9zZXJ2aWNlcy91cGxvYWQuanMiLCJhcHAvc2VydmljZXMvdmFsaWRhdGlvbi5qcyIsImFwcC9jb250cm9sbGVycy9ib29rZWRkYXRlcy9ib29rZWRkYXRlcy5qcyIsImFwcC9jb250cm9sbGVycy9jb3JlL2NvcmUuanMiLCJhcHAvY29udHJvbGxlcnMvY3VzdG9tZXJzL2N1c3RvbWVyLmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy9jdXN0b21lcnMvY3VzdG9tZXIuZGV0YWlsLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2N1c3RvbWVycy9jdXN0b21lcnMuanMiLCJhcHAvY29udHJvbGxlcnMvZXZlbnRzL2V2ZW50LmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy9ldmVudHMvZXZlbnQuZGV0YWlsLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2V2ZW50cy9ldmVudHMuanMiLCJhcHAvY29udHJvbGxlcnMvZm9vdGVyL2Zvb3Rlci5qcyIsImFwcC9jb250cm9sbGVycy9oZWFkZXIvaGVhZGVyLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2xhbmRpbmcvbGFuZGluZy5qcyIsImFwcC9jb250cm9sbGVycy9sb2dpbi9sb2dpbi5qcyIsImFwcC9jb250cm9sbGVycy9tYXRlcmlhbHMvbWF0ZXJpYWwuY3JlYXRlLmpzIiwiYXBwL2NvbnRyb2xsZXJzL21hdGVyaWFscy9tYXRlcmlhbC5kZXRhaWwuanMiLCJhcHAvY29udHJvbGxlcnMvbWF0ZXJpYWxzL21hdGVyaWFscy5qcyIsImFwcC9jb250cm9sbGVycy9tYXRlcmlhbHNldHMvbWF0ZXJpYWxzZXRzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL21hdGVyaWFsX2NoZWNrbGlzdC9tYXRlcmlhbF9jaGVja2xpc3QuanMiLCJhcHAvY29udHJvbGxlcnMvcGF5bWVudF90eXBlcy9wYXltZW50dHlwZS5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvcGF5bWVudF90eXBlcy9wYXltZW50dHlwZS5kZXRhaWwuanMiLCJhcHAvY29udHJvbGxlcnMvcGF5bWVudF90eXBlcy9wYXltZW50dHlwZXMuanMiLCJhcHAvY29udHJvbGxlcnMvcHJvZHVjdHMvcHJvZHVjdC5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvcHJvZHVjdHMvcHJvZHVjdC5kZXRhaWwuanMiLCJhcHAvY29udHJvbGxlcnMvcHJvZHVjdHMvcHJvZHVjdHMuanMiLCJhcHAvY29udHJvbGxlcnMvcHVyY2hhc2VvcmRlcnMvcHVyY2hhc2VvcmRlci5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvcHVyY2hhc2VvcmRlcnMvcHVyY2hhc2VvcmRlci5kZXRhaWwuanMiLCJhcHAvY29udHJvbGxlcnMvcHVyY2hhc2VvcmRlcnMvcHVyY2hhc2VvcmRlcnMuanMiLCJhcHAvY29udHJvbGxlcnMvcmVwb3J0cy9yZXBvcnRzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3NhbGVzX2NoYW5uZWxzL3NhbGVzY2hhbm5lbC5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvc2FsZXNfY2hhbm5lbHMvc2FsZXNjaGFubmVsLmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy9zYWxlc19jaGFubmVscy9zYWxlc2NoYW5uZWxzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3NlYXJjaC9zZWFyY2guanMiLCJhcHAvY29udHJvbGxlcnMvdW5pdHMvdW5pdC5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvdW5pdHMvdW5pdC5kZXRhaWwuanMiLCJhcHAvY29udHJvbGxlcnMvdW5pdHMvdW5pdHMuanMiLCJhcHAvY29udHJvbGxlcnMvd29ya29yZGVycy93b3Jrb3JkZXIuY3JlYXRlLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3dvcmtvcmRlcnMvd29ya29yZGVyLmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy93b3Jrb3JkZXJzL3dvcmtvcmRlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsSUFBQSxNQUFBLFFBQUEsT0FBQTtRQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1dBQ0EsU0FBQTtRQUNBO1lBQ0EscUJBQUE7OztJQUdBLFFBQUEsT0FBQSxnQkFBQSxDQUFBLGFBQUEsY0FBQSxlQUFBLG9CQUFBLGNBQUE7SUFDQSxRQUFBLE9BQUEsY0FBQSxDQUFBLGFBQUE7SUFDQSxRQUFBLE9BQUEsbUJBQUEsQ0FBQSxhQUFBLGNBQUEsZUFBQSxvQkFBQSxnQkFBQSxjQUFBLGFBQUEsaUJBQUEsaUJBQUE7SUFDQSxRQUFBLE9BQUEsZUFBQTs7SUFFQSxRQUFBLE9BQUEsa0JBQUEsQ0FBQSxvQkFBQTtJQUNBLFFBQUEsT0FBQSxjQUFBOzs7Ozs7SUFNQSxRQUFBLE9BQUEsY0FBQSx5QkFBQSxVQUFBO0lBQ0E7OztRQUdBLGNBQUEsV0FBQTs7O0lBR0EsUUFBQSxPQUFBLGNBQUEsMkJBQUEsVUFBQTtJQUNBO1FBQ0E7YUFDQSxhQUFBO2FBQ0EsVUFBQTs7O0lBR0EsUUFBQSxPQUFBLGNBQUEsZ0NBQUEsU0FBQSxxQkFBQTtRQUNBO2FBQ0EsV0FBQTthQUNBLGtCQUFBLEVBQUEsUUFBQTs7O0lBR0EsUUFBQSxPQUFBLGNBQUEsK0JBQUEsU0FBQSxvQkFBQTs7O1FBR0EsSUFBQSxnQkFBQSxtQkFBQSxjQUFBO1FBQ0E7WUFDQSx3QkFBQTtZQUNBLHNCQUFBLENBQUE7WUFDQSxNQUFBOzs7UUFHQSxtQkFBQSxjQUFBLGNBQUE7UUFDQSxtQkFBQSxNQUFBO2FBQ0EsZUFBQTtZQUNBO2dCQUNBLFdBQUE7Z0JBQ0EsU0FBQTs7YUFFQSxjQUFBOzs7O0lBSUEsUUFBQSxPQUFBLGNBQUEsaUNBQUEsU0FBQTtJQUNBO1FBQ0Esc0JBQUEsYUFBQSxTQUFBO1FBQ0E7WUFDQSxHQUFBLFNBQUE7WUFDQTtnQkFDQSxPQUFBLE9BQUEsTUFBQSxPQUFBOzs7WUFHQSxPQUFBOzs7OztJQUtBLElBQUEsSUFBQSxDQUFBLGNBQUEsYUFBQSxVQUFBLGVBQUEsVUFBQSxZQUFBLFdBQUEsUUFBQSxhQUFBOztRQUVBLFdBQUEsSUFBQSxxQkFBQSxVQUFBLE9BQUEsU0FBQSxVQUFBLFdBQUEsWUFBQTtRQUNBOzs7WUFHQSxHQUFBLFFBQUEsU0FBQTtZQUNBO2dCQUNBLEdBQUEsQ0FBQSxZQUFBO2dCQUNBO29CQUNBLFFBQUEsSUFBQTtvQkFDQSxNQUFBO29CQUNBLE9BQUEsR0FBQTs7Ozs7OztBQy9GQSxDQUFBO0FBQ0E7SUFDQTtJQUNBLFFBQUEsT0FBQSxjQUFBLGtFQUFBLFNBQUEsZ0JBQUEsb0JBQUEsZ0JBQUE7O1FBRUEsSUFBQSxVQUFBLFVBQUEsVUFBQTtZQUNBLE9BQUEsZ0JBQUEsV0FBQTs7O1FBR0EsbUJBQUEsVUFBQTs7O1FBR0E7YUFDQSxNQUFBLE9BQUE7Z0JBQ0EsVUFBQTtnQkFDQSxPQUFBO29CQUNBLFFBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7b0JBRUEsUUFBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOztvQkFFQSxNQUFBOzs7YUFHQSxNQUFBLGFBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsZUFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxnQkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSx1QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSx1QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxpQkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSx3QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSx3QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxrQkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSx5QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSx5QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxjQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLHFCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLHFCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLGVBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsNEJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEscUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsNEJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsNkJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEscUNBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsOEJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsbUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsYUFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxvQkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxvQkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxpQkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSx3QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSx3QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxzQkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSw2QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSw2QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxvQkFBQTtnQkFDQSxLQUFBO2dCQUNB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QkFHQSxTQUFBOzs7Z0JBR0EsWUFBQSxJQUFBLGlDQUFBLEtBQUEsRUFBQSxnQkFBQSxLQUFBLEtBQUEsU0FBQTtnQkFDQTtvQkFDQSxJQUFBLFVBQUE7b0JBQ0EsSUFBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsUUFBQTtvQkFDQTt3QkFDQSxJQUFBLGVBQUEsS0FBQTs7d0JBRUEsUUFBQSxLQUFBLENBQUEsS0FBQSxJQUFBLFNBQUEsYUFBQSxPQUFBLFNBQUEsYUFBQSxTQUFBLElBQUEsU0FBQSxhQUFBOzs7b0JBR0EsTUFBQSxZQUFBLFNBQUEsQ0FBQSxDQUFBLE1BQUEsb0JBQUEsTUFBQTs7b0JBRUEsTUFBQSxZQUFBLFVBQUE7OztnQkFHQTtnQkFDQTs7Ozs7WUFLQSx3QkFBQSxTQUFBO1lBQ0E7O2dCQUVBLE1BQUEsY0FBQTtvQkFDQSxTQUFBO3dCQUNBLE9BQUE7NEJBQ0EsTUFBQTs7d0JBRUE7d0JBQ0E7NEJBQ0EsS0FBQTs0QkFDQTs0QkFDQTtnQ0FDQSxNQUFBOzs7d0JBR0E7d0JBQ0E7NEJBQ0EsTUFBQTs0QkFDQTs0QkFDQTtnQ0FDQSxPQUFBO2dDQUNBLE1BQUE7OzRCQUVBOzRCQUNBO2dDQUNBLE1BQUE7Ozt3QkFHQTt3QkFDQTs7Ozs7b0JBS0EsT0FBQTt3QkFDQSxNQUFBOzs7b0JBR0EsU0FBQTs7O2dCQUdBLFlBQUEsSUFBQSxpQ0FBQSxLQUFBLEVBQUEsZ0JBQUEsS0FBQSxLQUFBLFNBQUE7b0JBQ0E7d0JBQ0EsSUFBQSxVQUFBO3dCQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLFFBQUE7d0JBQ0E7NEJBQ0EsSUFBQSxlQUFBLEtBQUE7OzRCQUVBLFFBQUEsS0FBQSxDQUFBLEtBQUEsSUFBQSxTQUFBLGFBQUEsT0FBQSxTQUFBLGFBQUEsU0FBQSxJQUFBLFdBQUEsYUFBQTs7O3dCQUdBLE1BQUEsWUFBQSxTQUFBLENBQUEsQ0FBQSxNQUFBLHFCQUFBLE1BQUE7O3dCQUVBLE1BQUEsWUFBQSxVQUFBOzs7b0JBR0E7b0JBQ0E7Ozs7O1lBS0EsdUJBQUEsU0FB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LFNBQUEsT0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxZQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsV0FBQTs7OztZQUlBLFVBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsUUFBQSxJQUFBLG1CQUFBOztnQkFFQSxZQUFBLElBQUEsVUFBQSxPQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBOzs7Ozs7WUFNQSxzQkFBQSxTQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLGlCQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBOztvQkFFQSxNQUFBLGlCQUFBOzs7O1lBSUEsa0JBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLGlCQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7Ozs7b0JBSUEsS0FBQSxjQUFBLFFBQUEsS0FBQTs7O29CQUdBLEtBQUEsWUFBQSxTQUFBLEtBQUE7b0JBQ0EsS0FBQSxPQUFBLFNBQUEsS0FBQTs7b0JBRUEsTUFBQSxnQkFBQTs7OztZQUlBLG9CQUFBLFNBQUE7WUFDQTtnQkFDQSxZQUFBLElBQUEsZUFBQSxVQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxlQUFBOzs7O1lBSUEsZ0JBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLGVBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxjQUFBOzs7O1lBSUEscUJBQUEsU0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxnQkFBQSxVQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxnQkFBQTs7OztZQUlBLG9CQUFBLFNBQUE7WUFDQTtnQkFDQSxZQUFBLElBQUEsZ0NBQUEsVUFBQSxLQUFBLFNBQUE7Z0JBQ0E7b0JBQ0EsTUFBQSxhQUFBOzs7OztZQUtBLHFCQUFBO1lBQ0E7Z0JBQ0EsT0FBQSxZQUFBLElBQUEsaUNBQUE7OztZQUdBLGFBQUEsU0FBQTtZQUNBO2dCQUNBLE9BQUEsWUFBQSxJQUFBLFlBQUEsS0FBQTs7O1lBR0EsWUFBQSxT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SUFFQSxTQUFBLGlCQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7UUFDQSxLQUFBLGNBQUEsVUFBQSxPQUFBOzs7SUFHQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxvQkFBQSxDQUFBLFdBQUE7Ozs7QUNUQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLGlCQUFBLE9BQUE7SUFDQTtRQUNBLElBQUEsT0FBQTs7UUFFQSxLQUFBLGFBQUEsVUFBQSxPQUFBOztRQUVBLEtBQUEsa0JBQUEsV0FBQTtZQUNBLE9BQUEsTUFBQTs7OztJQUlBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG9CQUFBLENBQUEsU0FBQSxXQUFBOzs7QUNkQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLGtCQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7OztJQUdBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHFCQUFBLENBQUEsVUFBQTs7O0FDUkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSxnQkFBQSxRQUFBLFFBQUEsVUFBQSxlQUFBLGFBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTtRQUNBLEtBQUEsUUFBQTtRQUNBLEtBQUEsV0FBQTs7UUFFQSxHQUFBLFNBQUEsSUFBQTtRQUNBO1lBQ0EsS0FBQSxRQUFBLFNBQUEsSUFBQTs7O1FBR0EsSUFBQSxnQkFBQTtZQUNBLGFBQUE7WUFDQSxlQUFBO1lBQ0EsWUFBQSxTQUFBLGlCQUFBLFFBQUE7WUFDQTtnQkFDQSxPQUFBLGdCQUFBLFlBQUE7OztvQkFHQSxHQUFBLEtBQUEsVUFBQSxNQUFBLEtBQUEsYUFBQTtvQkFDQTt3QkFDQSxZQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsVUFBQSxLQUFBO3dCQUNBOzRCQUNBLFFBQUEsSUFBQTs7NEJBRUEsSUFBQSxRQUFBLElBQUE7OzRCQUVBLElBQUEsZUFBQSxJQUFBOzRCQUNBLGFBQUEsWUFBQSxhQUFBLGdCQUFBOzs0QkFFQSxTQUFBLElBQUEsYUFBQSxLQUFBLE9BQUEsRUFBQSxTQUFBOzs7NEJBR0EsVUFBQTs0QkFDQSxPQUFBLEdBQUE7O3dCQUVBO3dC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SUFBQSxpQ0FBQSxLQUFBLEVBQUEsZ0JBQUEsS0FBQSxLQUFBLFNBQUE7Z0JBQ0E7b0JBQ0EsTUFBQSxpQkFBQTtvQkFDQSxHQUFBLE1BQUEsZUFBQSxTQUFBO29CQUNBO3dCQUNBLElBQUEsSUFBQSxNQUFBLGVBQUE7d0JBQ0EsSUFBQSxJQUFBLElBQUEsS0FBQSxNQUFBLGVBQUEsRUFBQSxHQUFBLE1BQUEsTUFBQSxlQUFBLEVBQUEsR0FBQSxRQUFBLEdBQUE7d0JBQ0EsTUFBQSx3QkFBQTt3QkFDQSxNQUFBLHdCQUFBLE1BQUEsZUFBQSxFQUFBLEdBQUE7d0JBQ0EsTUFBQSxzQkFBQSxJQUFBOzs7Z0JBR0E7Z0JBQ0E7Ozs7O1FBS0EsU0FBQSx1QkFBQTtRQUNBO1lBQ0EsWUFBQSxJQUFBLGtDQUFBLE1BQUEsS0FBQSxTQUFBO2dCQUNBOztvQkFFQSxNQUFBLHNCQUFBO29CQUNBLEdBQUEsTUFBQSxvQkFBQSxTQUFBO29CQUNBO3dCQUNBLElBQUEsSUFBQSxJQUFBLEtBQUEsTUFBQSxvQkFBQSxHQUFBLE1BQUEsTUFBQSxvQkFBQSxHQUFBLFFBQUEsR0FBQTt3QkFDQSxNQUFBLDZCQUFBO3dCQUNBLE1BQUEsNEJBQUEsTUFBQSxvQkFBQSxHQUFBO3dCQUNBLE1BQUEsMkJBQUE7OztnQkFHQTtnQkFDQTs7Ozs7UUFLQSxLQUFBLDJCQUFBLFNBQUE7UUFDQTtZQUNBLEtBQUEsNEJBQUE7O1lBRUEsSUFBQSxLQUFBLDJCQUFBLElBQUEsRUFBQSxLQUFBLDJCQUFBO2lCQUNBLEdBQUEsQ0FBQSxLQUFBLDJCQUFBLEtBQUEsS0FBQSxvQkFBQSxRQUFBLEVBQUEsS0FBQSwyQkFBQSxLQUFBLG9CQUFBLFNBQUE7O1lBRUEsR0FBQSxLQUFBLDRCQUFBLEtBQUEsQ0FBQSxLQUFBLDJCQUFBLE1BQUEsS0FBQSxvQkFBQTtZQUNBO2dCQUNBLElBQUEsSUFBQSxJQUFBLEtBQUEsS0FBQSxvQkFBQSxLQUFBLDBCQUFBLE1BQUEsS0FBQSxvQkFBQSxLQUFBLDBCQUFBLFFBQUEsR0FBQTs7Z0JBRUEsS0FBQSw2QkFBQTtnQkFDQSxLQUFBLDRCQUFBLEtBQUEsb0JBQUEsS0FBQSwwQkFBQTs7OztRQUlBLEtBQUEsc0JBQUEsU0FBQTtRQUNBOzs7O1lBSUEsS0FBQSx1QkFBQTs7WUFFQSxJQUFBLEtBQUEsc0JBQUEsSUFBQSxFQUFBLEtBQUEsc0JBQUE7aUJBQ0EsR0FBQSxDQUFBLEtBQUEsc0JBQUEsS0FBQSxLQUFBLGVBQUEsUUFBQSxFQUFBLEtBQUEsc0JBQUEsS0FBQSxlQUFBLFNBQUE7Ozs7WUFJQSxHQUFBLEtBQUEsdUJBQUEsS0FBQSxDQUFBLEtBQUEsc0JBQUEsTUFBQSxLQUFBLGVBQUE7WUFDQTtnQkFDQSxJQUFBLElBQUEsSUFBQSxLQUFBLEtBQUEsZUFBQSxLQUFBLHFCQUFBLE1BQUEsS0FBQSxlQUFBLEtBQUEscUJBQUEsUUFBQSxHQUFBOztnQkFFQSxLQUFBLHdCQUFBO2dCQUNBLEtBQUEsd0JBQUEsS0FBQSxlQUFBLEtBQUEscUJBQUE7Ozs7O1FBS0EsS0FBQSxhQUFBLFNBQUE7UUFDQTtZQUNBLFFBQUEsSUFBQTtZQUNBLEdBQUE7WUFDQTtnQkFDQSxLQUFBLFdBQUEsV0FBQSxLQUFBOzs7O1FBSUEsS0FBQSxtQkFBQSxTQUFBO1FBQ0E7WUFDQSxRQUFBLElBQUEsS0FBQTtZQUNBLFFBQUEsSUFBQSxLQUFBOzs7WUFHQSxLQUFBLGFBQUEseUJBQUEsS0FBQTtZQUNBLEtBQUEsYUFBQSx1QkFBQSxLQUFBOztZQUVBLFlBQUEsSUFBQSx5QkFBQSxLQUFBLEVBQUEsZ0JBQUEsS0FBQSxlQUFBLEtBQUEsU0FBQTtZQUNBO2dCQUNBLFFBQUEsSUFBQTtnQkFDQSxLQUFBLGFBQUE7OztZQUdBO1lBQ0E7Ozs7Ozs7UUFPQSxLQUFBLG1CQUFBLFNBQUE7UUFDQTtZQUNBLFFBQUEsSUFBQSxLQUFBO1lBQ0EsUUFBQSxJQUFBLEtBQUE7OztZQUdBLEtBQUEsYUFBQSwyQkFBQSxLQUFBO1lBQ0EsS0FBQSxhQUFBLHlCQUFBLEtBQUE7O1lBRUEsWUFBQSxJQUFBLGlDQUFBLEtBQUEsRUFBQSxnQkFBQSxLQUFBLGVBQUEsS0FBQSxTQUFBO2dCQUNBO29CQUNBLFFBQUEsSUFBQTtvQkFDQSxLQUFBLGlCQUFBOzs7Z0JBR0E7Z0JBQ0E7Ozs7Ozs7SUFPQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxvQkFBQSxDQUFBLFVBQUEsU0FBQSxVQUFBLFdBQUEsZUFBQSxlQUFBLGdCQUFBOzs7O0FDM1NBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEsNkJBQUEsT0FBQSxRQUFBLGNBQUEsYUFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOztRQUVBLEtBQUEscUJBQUE7UUFDQTtZQUNBLEtBQUEsTUFBQTs7WUFFQSxJQUFBLFVBQUEsS0FBQSxNQUFBOzs7WUFHQSxHQUFBO1lBQ0E7OztnQkFHQSxJQUFBLElBQUEsS0FBQTs7Z0JBRUEsWUFBQSxJQUFBLGdCQUFBLEtBQUEsR0FBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLGFBQUEsS0FBQTtvQkFDQSxPQUFBLEdBQUE7O21CQUVBO2dCQUNBO29CQUNBLGFBQUEsS0FBQTs7Ozs7OztJQU9BLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGdDQUFBLENBQUEsU0FBQSxVQUFBLGdCQUFBLGVBQUEsZ0JBQUE7Ozs7QUNuQ0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSw2QkFBQSxPQUFBLFFBQUEsY0FBQSxhQUFBLGVBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTs7O1FBR0EsWUFBQSxnQkFBQSxhQUFBLGdCQUFBLEtBQUEsU0FBQTtRQUNBO1lBQ0EsS0FBQSxlQUFBOzs7UUFHQSxLQUFBLHFCQUFBO1FBQ0E7WUFDQSxLQUFBLE1BQUE7O1lBRUEsSUFBQSxVQUFBLEtBQUEsTUFBQTs7O1lBR0EsR0FBQTtZQUNBO2dCQUNBLEtBQUEsYUFBQSxNQUFBLEtBQUE7Z0JBQ0E7b0JBQ0EsYUFBQSxLQUFBO29CQUNBLE9BQUEsR0FBQTs7bUJBRUE7Z0JBQ0E7b0JBQ0EsYUFBQSxLQUFBO29CQUNBLFFBQUEsSUFBQTs7Ozs7O1FBTUEsS0FBQSxxQkFBQTtRQUNBO1lBQ0EsS0FBQSxhQUFBLFNBQUEsS0FBQTtZQUNBO2dCQUNBLGFBQUEsS0FBQTtnQkFDQSxPQUFBLEdBQUE7ZUFDQTtZQUNBO2dCQUNBLGFBQUEsS0FBQTs7Ozs7O1FBTUEsS0FBQSxvQkFBQSxTQUFBO1FBQ0E7WUFDQSxJQUFBLFNBQUEsY0FBQSxRQUFBLElBQUEseUJBQUE7WUFDQSxPQUFBLEtBQUE7Z0JBQ0E7b0JBQ0EsS0FBQTs7Z0JBRUE7Z0JBQ0E7Ozs7OztJQU1BLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGdDQUFBLENBQUEsU0FBQSxVQUFBLGdCQUFBLGVBQUEsaUJBQUEsZ0JBQUE7Ozs7QUNoRUEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSx1QkFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOztRQUVBLFlBQUEsb0JBQUEsTUFBQSxLQUFBLFNBQUE7UUFDQTtZQUNBLEtBQUEsZ0JBQUE7Ozs7O0lBS0EsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMEJBQUEsQ0FBQSxlQUFBOzs7O0FDZEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSxpQkFBQSxRQUFBLE9BQUEsYUFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOztRQUVBLEtBQUEsVUFBQTtRQUNBLEtBQUEsYUFBQTtRQUNBLEtBQUEsaUJBQUE7O1FBRUEsS0FBQSxXQUFBLFNBQUE7UUFDQTs7WUFFQSxPQUFBLFlBQUEsSUFBQSxVQUFBLE9BQUEsVUFBQSxLQUFBLFNBQUE7WUFDQTtnQkFDQSxRQUFBLElBQUE7Z0JBQ0EsT0FBQTs7Ozs7UUFLQSxLQUFBLHdCQUFBLFVBQUE7O1lBRUEsT0FBQSxNQUFBLFdBQUE7OztRQUdBLEtBQUEsV0FBQTtRQUNBO1lBQ0EsUUFBQSxJQUFBLEtBQUE7WUFDQSxHQUFBLEtBQUEsbUJBQUEsUUFBQSxLQUFBLG1CQUFBO1lBQ0E7Z0JBQ0EsS0FBQSxhQUFBO2dCQUNBLEtBQUE7O2dCQUVBLE9BQUEsS0FBQSxlQUFBOztvQkFFQSxLQUFBO3dCQUNBLE9BQUEsR0FBQSx1QkFBQSxDQUFBLGFBQUEsS0FBQSxlQUFBO3dCQUNBOztvQkFFQSxLQUFBO3dCQUNBLE9BQUEsR0FBQSx3QkFBQSxDQUFBLGNBQUEsS0FBQSxlQUFBO3dCQUNBOztvQkFFQSxLQUFBO3dCQUNBLE9BQUEsR0FBQSxxQkFBQSxDQUFBLFdBQUEsS0FBQSxlQUFBO3dCQUNBOztvQkFFQSxLQUFBO3dCQUNBLE9BQUEsR0FBQSx5QkFBQSxDQUFBLGVBQUEsS0FBQSxlQUFBO3dCQUNBOztvQkFFQSxLQUFBO3dCQUNBLE9BQUEsR0FBQSx3QkFBQSxDQUFBLGNBQUEsS0FBQSxlQUFBO3dCQUNBOztvQkFFQSxLQUFBO3dCQUNBLE9BQUEsR0FBQSw2QkFBQSxDQUFBLG1CQUFBLEtBQUEsZUFBQTt3QkFDQTs7Ozs7O0lBTUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsb0JBQUEsQ0FBQSxVQUFBLFNBQUEsZUFBQSxVQUFBOzs7O0FDakVBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEscUJBQUEsT0FBQSxRQUFBLGNBQUEsYUFBQSxhQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7O1FBRUEsS0FBQSxhQUFBO1FBQ0E7WUFDQSxLQUFBLE1BQUE7O1lBRUEsSUFBQSxVQUFBLEtBQUEsTUFBQTs7O1lBR0EsR0FBQTtZQUNBOztnQkFFQSxJQUFBLElBQUEsS0FBQTs7Z0JBRUEsWUFBQSxJQUFBLFFBQUEsS0FBQSxHQUFBLEtBQUEsU0FBQTtnQkFDQTtvQkFDQSxRQUFBLElBQUE7O29CQUVBLGFBQUEsS0FBQTtvQkFDQSxPQUFBLEdBQUE7O21CQUVBO2dCQUNBO29CQUNBLGFBQUEsS0FBQTs7Ozs7OztJQU9BLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHdCQUFBLENBQUEsU0FBQSxVQUFBLGdCQUFBLGVBQUEsZUFBQSxnQkFBQTs7OztBQ25DQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLHFCQUFBLE9BQUEsUUFBQSxjQUFBLGFBQUEsYUFBQSxlQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7OztRQUdBLFlBQUEsUUFBQSxNQUFBLGFBQUE7O1FBRUEsS0FBQSxhQUFBO1FBQ0E7WUFDQSxLQUFBLE1BQUE7O1lBRUEsSUFBQSxVQUFBLEtBQUEsTUFBQTs7O1lBR0EsR0FBQTtZQUNBO2dCQUNBLEtBQUEsS0FBQSxNQUFBLEtBQUE7Z0JBQ0E7b0JBQ0EsYUFBQSxLQUFBO29CQUNBLE9BQUEsR0FBQTs7bUJBRUE7Z0JBQ0E7b0JBQ0EsYUFBQSxLQUFBO29CQUNBLFFBQUEsSUFBQTs7Ozs7UUFLQSxLQUFBLGFBQUE7UUFDQTtZQUNBLEtBQUEsS0FBQSxTQUFBLEtBQUE7WUFDQTtnQkFDQSxhQUFBLEtBQUE7Z0JBQ0EsT0FBQSxHQUFBO2VBQ0E7WUFDQTtnQkFDQSxhQUFBLEtBQUE7Ozs7OztRQU1BLEtBQUEsb0JBQUEsU0FBQTtRQUNBO1lBQ0EsSUFBQSxTQUFBLGNBQUEsUUFBQSxJQUFBLGdCQUFBO1lBQ0EsT0FBQSxLQUFBO2dCQUNBO29CQUNBLEtBQUE7O2dCQUVBO2dCQUNBOzs7Ozs7SUFNQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSx3QkFBQSxDQUFBLFNBQUEsVUFBQSxnQkFBQSxlQUFBLGVBQUEsaUJBQUEsZ0JBQUE7Ozs7QUM1REEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSxlQUFBLE9BQUEsUUFBQSxhQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7O1FBRUEsWUFBQSxZQUFBOzs7O0lBSUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsa0JBQUEsQ0FBQSxTQUFBLFVBQUEsZUFBQSxlQUFBOzs7O0FDWEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSwwQkFBQSxPQUFBLFFBQUEsYUFBQSxlQUFBLGNBQUEsU0FBQSxhQUFBLG1CQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7O1FBRUEsWUFBQSxnQkFBQTtRQUNBLFlBQUEsZUFBQTs7UUFFQSxLQUFBLGVBQUEsa0JBQUE7UUFDQSxLQUFBLFlBQUE7O1FBRUEsS0FBQSxhQUFBLFNBQUEsTUFBQTtRQUNBO1lBQ0EsS0FBQSxJQUFBO1lBQ0EsS0FBQSxVQUFBLFlBQUEsU0FBQTtZQUNBLEdBQUE7WUFDQTtnQkFDQSxjQUFBLFdBQUEsSUFBQSxNQUFBLEtBQUEsVUFBQTtnQkFDQTtvQkFDQSxHQUFBLEtBQUEsS0FBQSxXQUFBO29CQUNBOzt3QkFFQSxLQUFBLFVBQUEsaUJBQUEsS0FBQSxLQUFBOzs7bUJBR0EsVUFBQTtnQkFDQTtvQkFDQSxJQUFBLEtBQUEsU0FBQTtvQkFDQTt3QkFDQSxLQUFBLFdBQUEsS0FBQSxTQUFBLE9BQUEsS0FBQTs7b0JBRUEsUUFBQSxJQUFBLG1CQUFBLEtBQUE7bUJBQ0EsVUFBQTtnQkFDQTtvQkFDQSxLQUFBLFdBQUEsS0FBQSxJQUFBLEtBQUEsU0FBQSxRQUFBLElBQUEsU0FBQSxJQUFBOzs7OztRQUtBLEtBQUEsa0JBQUE7UUFDQTtZQUNBLEtBQUEsTUFBQTs7WUFFQSxJQUFBLFVBQUEsS0FBQSxNQUFBOzs7WUFHQSxHQUFBO1lBQ0E7OztnQkFHQSxJQUFBLElBQUEsS0FBQTs7Z0JBRUEsWUFBQSxJQUFBLGFBQUEsS0FBQSxHQUFBLEtBQUE7Z0JBQ0E7b0JBQ0EsYUFBQSxLQUFBOztvQkFFQSxPQUFBLEdBQUE7Ozs7Ozs7SUFPQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw2QkFBQSxDQUFBLFNBQUEsVUFBQSxlQUFBLGlCQUFBLGdCQUFBLFdBQUEsZUFBQSxxQkFBQSxnQkFBQTs7OztBQ2pFQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLDBCQUFBLE9BQUEsUUFBQSxRQUFBLGNBQUEsYUFBQSxlQUFBLGFBQUEsZUFBQSxtQkFBQSxTQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7OztRQUdBLFlBQUEsYUFBQSxhQUFBLGFBQUEsS0FBQSxTQUFBO1FBQ0E7O1lBRUEsS0FBQSxZQUFBOztZQUVBLFlBQUEsdUJBQUEsS0FBQSxTQUFBO1lBQ0E7Z0JBQ0EsS0FBQSxpQkFBQTs7Ozs7UUFLQSxZQUFBLGdCQUFBO1FBQ0EsWUFBQSxlQUFBOzs7O1FBSUEsS0FBQSxlQUFBLGtCQUFBOztRQUVBLEtBQUEsaUJBQUEsU0FBQTtRQUNBO1lBQ0EsUUFBQSxJQUFBOzs7OztRQUtBLEtBQUEsaUJBQUEsU0FBQSxJQUFBO1FBQ0E7WUFDQSxPQUFBLElBQUEsa0JBQUEsTUFBQTs7WUFFQSxjQUFBLGFBQUEsSUFBQSxxQkFBQSxRQUFBO2dCQUNBO2dCQUNBO29CQUNBLFFBQUEsSUFBQTs7O1lBR0EsUUFBQSxJQUFBLGtCQUFBLE1BQUE7OztRQUdBLEtBQUEsbUJBQUEsU0FBQSxJQUFBO1FBQ0E7WUFDQSxJQUFBLFNBQUEsY0FBQSxRQUFBLElBQUEsc0JBQUE7WUFDQSxPQUFBLEtBQUE7Z0JBQ0E7b0JBQ0EsY0FBQSxXQUFBLFVBQUEsS0FBQTtvQkFDQTt3QkFDQSxLQUFBLFVBQUEsaUJBQUE7d0JBQ0EsS0FBQSxFQUFBLFdBQUEsQ0FBQTt3QkFDQSxLQUFBLElBQUE7O3dCQUVBLGFBQUEsS0FBQTt1QkFDQSxTQUFBO29CQUNBO3dCQUNBLGFBQUEsS0FBQTs7O2dCQUdBO2dCQUNBOzs7O1FBSUEsS0FBQSxhQUFBLFNBQUEsTUFBQTtRQUNBO1lBQ0EsS0FBQSxJQUFBO1lBQ0EsS0FBQSxVQUFBLFlBQUEsU0FBQTtZQUNBLEdBQUE7WUFDQTtnQkFDQSxJQUFBLFFBQUE7Z0JBQ0EsR0FBQSxLQUFBLFVBQUEsbUJBQUE7dUJBQ0EsS0FBQSxVQUFBLG1CQUFBO3VCQUNBLEtBQUEsVUFBQSxtQkFBQTt1QkFDQSxLQUFBLFVBQUEsbUJBQUE7Z0JBQ0E7b0JBQ0EsUUFBQSxLQUFBLFVBQUE7OztnQkFHQSxjQUFBLFdBQUEsT0FBQSxNQUFBLEtBQUEsVUFBQTtnQkFDQTtvQkFDQSxHQUFBLEtBQUEsS0FBQSxXQUFBO29CQUNBOzt3QkFFQSxLQUFBLFVBQUEsaUJBQUEsS0FBQSxLQUFBOzs7bUJBR0EsVUFBQTtnQkFDQTtvQkFDQSxJQUFBLEtBQUEsU0FBQTtvQkFDQTt3QkFDQSxLQUFBLFdBQUEsS0FBQSxTQUFBLE9BQUEsS0FBQTs7b0JBRUEsUUFBQSxJQUFBLG1CQUFBLEtBQUE7bUJBQ0EsVUFBQTtnQkFDQTtvQkFDQSxLQUFBLFdBQUEsS0FBQSxJQUFBLEtBQUEsU0FBQSxRQUFBLElBQUEsU0FBQSxJQUFBOzs7OztRQUtBLEtBQUEsa0JBQUE7UUFDQTtZQUNBLEtBQUEsTUFBQTs7WUFFQSxJQUFBLFVBQUEsS0FBQSxNQUFBOzs7WUFHQSxHQUFBO1lBQ0E7Z0JBQ0EsUUFBQSxJQUFBLEtBQUE7O2dCQUVBLEtBQUEsVUFBQSxNQUFBLEtBQUE7Z0JBQ0E7b0JBQ0EsYUFBQSxLQUFBO29CQUNBLE9BQUEsR0FBQTttQkFDQTtnQkFDQTtvQkFDQSxhQUFBLEtBQUE7Ozs7OztRQU1BLEtBQUEsa0JBQUE7UUFDQTtZQUNBLEtBQUEsVUFBQSxTQUFBLEtBQUE7WUFDQTtnQkFDQSxhQUFBLEtBQUE7Z0JBQ0EsT0FBQSxHQUFBO2VBQ0E7WUFDQTtnQkFDQSxhQUFBLEtBQUE7Ozs7UUFJQSxLQUFBLG9CQUFBLFNBQUE7UUFDQTtZQUNBLElBQUEsU0FBQSxjQUFBLFFBQUEsSUFBQSxzQkFBQTtZQUNBLE9BQUEsS0FBQTtnQkFDQTtvQkFDQSxLQUFBOztnQkFFQTtnQkFDQTs7Ozs7O0lBTUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNkJBQUEsQ0FBQSxTQUFBLFVBQUEsVUFBQSxnQkFBQSxlQUFBLGlCQUFBLGVBQUEsaUJBQUEscUJBQUEsV0FBQSxnQkFBQTs7OztBQzNKQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLG9CQUFBLE9BQUEsUUFBQSxhQUFBLGFBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTs7UUFFQSxLQUFBLGVBQUE7UUFDQSxJQUFBLGFBQUE7O1FBRUEsWUFBQSxpQkFBQTs7UUFFQSxRQUFBLElBQUE7O1FBRUEsS0FBQSxhQUFBLFNBQUE7UUFDQTs7WUFFQSxJQUFBLElBQUEsUUFBQTs7WUFFQSxJQUFBLFVBQUEsRUFBQSxLQUFBLFlBQUE7O1lBRUEsR0FBQSxVQUFBO1lBQ0E7Z0JBQ0EsT0FBQTs7aUJBRUEsR0FBQSxVQUFBLEtBQUEsV0FBQTtZQUNBO2dCQUNBLE9BQUE7O2lCQUVBLEdBQUEsVUFBQSxLQUFBLFdBQUE7WUFDQTtnQkFDQSxPQUFBOzs7WUFHQTtnQkFDQSxPQUFBOzs7Ozs7O1FBT0EsS0FBQSxxQkFBQSxTQUFBO1FBQ0E7WUFDQSxRQUFBLElBQUE7WUFDQSxRQUFBLElBQUE7Ozs7O0lBS0EsUUFBQSxPQUFBLG1CQUFBLFdBQUEsdUJBQUEsQ0FBQSxTQUFBLFVBQUEsZUFBQSxlQUFBLFdBQUE7OztBQUdBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLFxyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgJ2FwcC5jb250cm9sbGVycycsXHJcbiAgICAgICAgICAgICdhcHAuZmlsdGVycycsXHJcbiAgICAgICAgICAgICdhcHAuc2VydmljZXMnLFxyXG4gICAgICAgICAgICAnYXBwLmRpcmVjdGl2ZXMnLFxyXG4gICAgICAgICAgICAnYXBwLnJvdXRlcycsXHJcbiAgICAgICAgICAgICdhcHAuY29uZmlnJ1xyXG4gICAgICAgIF0pLmNvbnN0YW50KCdteUNvbmZpZycsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAnbWF0ZXJpYWxTZXRzTFNLZXknOiAnbWF0ZXJpYWxTZXRzJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnLCBbJ3VpLnJvdXRlcicsICdzYXRlbGxpemVyJywgJ3Jlc3Rhbmd1bGFyJywgJ2FuZ3VsYXItbW9tZW50anMnLCAnbmdNYXRlcmlhbCcsICduZ0ZpbGVVcGxvYWQnXSk7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycsIFsndWkucm91dGVyJywgJ3NhdGVsbGl6ZXInXSk7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJywgWyd1aS5yb3V0ZXInLCAnbmdNYXRlcmlhbCcsICdyZXN0YW5ndWxhcicsICdhbmd1bGFyLW1vbWVudGpzJywgJ2FwcC5zZXJ2aWNlcycsICduZ01lc3NhZ2VzJywgJ25nTWRJY29ucycsICdtZC5kYXRhLnRhYmxlJywgJ2hpZ2hjaGFydHMtbmcnLCAnbmdDb29raWVzJ10pO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJywgW10pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycsIFsnYW5ndWxhci1tb21lbnRqcycsICduZ0FuaW1hdGUnXSk7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycsIFtdKTtcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIENvbmZpZ3VyYXRpb24gc3R1ZmZcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uICgkYXV0aFByb3ZpZGVyKVxyXG4gICAge1xyXG4gICAgICAgIC8vIFNhdGVsbGl6ZXIgY29uZmlndXJhdGlvbiB0aGF0IHNwZWNpZmllcyB3aGljaCBBUElcclxuICAgICAgICAvLyByb3V0ZSB0aGUgSldUIHNob3VsZCBiZSByZXRyaWV2ZWQgZnJvbVxyXG4gICAgICAgICRhdXRoUHJvdmlkZXIubG9naW5VcmwgPSAnL2FwaS9hdXRoZW50aWNhdGUnO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24gKCRtb21lbnRQcm92aWRlcilcclxuICAgIHtcclxuICAgICAgICAkbW9tZW50UHJvdmlkZXJcclxuICAgICAgICAgICAgLmFzeW5jTG9hZGluZyhmYWxzZSlcclxuICAgICAgICAgICAgLnNjcmlwdFVybCgnLy9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvbW9tZW50LmpzLzIuNS4xL21vbWVudC5taW4uanMnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKCBmdW5jdGlvbihSZXN0YW5ndWxhclByb3ZpZGVyKSB7XHJcbiAgICAgICAgUmVzdGFuZ3VsYXJQcm92aWRlclxyXG4gICAgICAgICAgICAuc2V0QmFzZVVybCgnL2FwaS8nKVxyXG4gICAgICAgICAgICAuc2V0RGVmYXVsdEhlYWRlcnMoeyBhY2NlcHQ6IFwiYXBwbGljYXRpb24veC5sYXJhdmVsLnYxK2pzb25cIiB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKCBmdW5jdGlvbigkbWRUaGVtaW5nUHJvdmlkZXIpIHtcclxuICAgICAgICAvKiBGb3IgbW9yZSBpbmZvLCB2aXNpdCBodHRwczovL21hdGVyaWFsLmFuZ3VsYXJqcy5vcmcvIy9UaGVtaW5nLzAxX2ludHJvZHVjdGlvbiAqL1xyXG5cclxuICAgICAgICB2YXIgY3VzdG9tQmx1ZU1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCdsaWdodC1ibHVlJyxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICdjb250cmFzdERlZmF1bHRDb2xvcic6ICdsaWdodCcsXHJcbiAgICAgICAgICAgICdjb250cmFzdERhcmtDb2xvcnMnOiBbJzUwJ10sXHJcbiAgICAgICAgICAgICc1MCc6ICdmZmZmZmYnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCdjdXN0b21CbHVlJywgY3VzdG9tQmx1ZU1hcCk7XHJcbiAgICAgICAgJG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0JylcclxuICAgICAgICAgICAgLnByaW1hcnlQYWxldHRlKCdjdXN0b21CbHVlJyxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgJ2RlZmF1bHQnOiAnNTAwJyxcclxuICAgICAgICAgICAgICAgICdodWUtMSc6ICc1MCdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmFjY2VudFBhbGV0dGUoJ3BpbmsnKTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbigkbWREYXRlTG9jYWxlUHJvdmlkZXIpXHJcbiAgICB7XHJcbiAgICAgICAgJG1kRGF0ZUxvY2FsZVByb3ZpZGVyLmZvcm1hdERhdGUgPSBmdW5jdGlvbihkYXRlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoZGF0ZSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUpLmZvcm1hdCgnTU0tREQtWVlZWScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIENoZWNrIGZvciBhdXRoZW50aWNhdGVkIHVzZXIgb24gZXZlcnkgcmVxdWVzdFxyXG4gICAgYXBwLnJ1bihbJyRyb290U2NvcGUnLCAnJGxvY2F0aW9uJywgJyRzdGF0ZScsICdBdXRoU2VydmljZScsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkbG9jYXRpb24sICRzdGF0ZSwgQXV0aFNlcnZpY2UpIHtcclxuXHJcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zLCBvcHRpb25zKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnQXR0ZW1wdGluZyB0byBnZXQgdXJsOiBbJyArIHRvU3RhdGUubmFtZSArICddJyk7XHJcbiAgICAgICAgICAgIC8vIExldCBhbnlvbmUgZ28gdG8gdGhlIGxvZ2luIHBhZ2UsIGNoZWNrIGF1dGggb24gYWxsIG90aGVyIHBhZ2VzXHJcbiAgICAgICAgICAgIGlmKHRvU3RhdGUubmFtZSAhPT0gJ2FwcC5sb2dpbicpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKCFBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInVzZXIgbm90IGxvZ2dlZCBpbiwgcmVkaXJlY3QgdG8gbG9naW4gcGFnZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmxvZ2luJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1dKTtcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uKClcclxue1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycpLmNvbmZpZyggZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGF1dGhQcm92aWRlciApIHtcclxuXHJcbiAgICAgICAgdmFyIGdldFZpZXcgPSBmdW5jdGlvbiggdmlld05hbWUgKXtcclxuICAgICAgICAgICAgcmV0dXJuICcvdmlld3MvYXBwLycgKyB2aWV3TmFtZSArICcuaHRtbCc7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL3B1cmNoYXNlb3JkZXJzJyk7XHJcblxyXG5cclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcCcsIHtcclxuICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2hlYWRlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSGVhZGVyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxIZWFkZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBmb290ZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2Zvb3RlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRm9vdGVyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxGb290ZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBtYWluOiB7fVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5sb2dpbicsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9sb2dpbicsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xvZ2luJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsTG9naW4nXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5sYW5kaW5nJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2xhbmRpbmcnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdsYW5kaW5nJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMYW5kaW5nQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxMYW5kaW5nJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucHJvZHVjdHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcHJvZHVjdHMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwcm9kdWN0cycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUHJvZHVjdCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnByb2R1Y3RzLmRldGFpbCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9kZXRhaWwvOnByb2R1Y3RJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3Byb2R1Y3QuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9kdWN0RGV0YWlsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQcm9kdWN0RGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucHJvZHVjdHMuY3JlYXRlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NyZWF0ZScsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3Byb2R1Y3QuY3JlYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9kdWN0Q3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQcm9kdWN0Q3JlYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuY3VzdG9tZXJzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2N1c3RvbWVycycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2N1c3RvbWVycycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ3VzdG9tZXJDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybEN1c3RvbWVyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuY3VzdG9tZXJzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdjdXN0b21lci5jcmVhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0N1c3RvbWVyQ3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxDdXN0b21lckNyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmN1c3RvbWVycy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzpjdXN0b21lcklkJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnY3VzdG9tZXIuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDdXN0b21lckRldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsQ3VzdG9tZXJEZXRhaWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC53b3Jrb3JkZXJzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3dvcmtvcmRlcnMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd3b3Jrb3JkZXJzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdXb3JrT3JkZXJDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFdvcmtPcmRlcidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLndvcmtvcmRlcnMuY3JlYXRlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NyZWF0ZScsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3dvcmtvcmRlci5jcmVhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtPcmRlckNyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsV29ya09yZGVyQ3JlYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAud29ya29yZGVycy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzp3b3JrT3JkZXJJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3dvcmtvcmRlci5kZXRhaWwnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtPcmRlckRldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsV29ya09yZGVyRGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuZXZlbnRzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2V2ZW50cycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2V2ZW50cycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRXZlbnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybEV2ZW50J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuZXZlbnRzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdldmVudC5jcmVhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0V2ZW50Q3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxFdmVudENyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmV2ZW50cy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzpldmVudElkJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnZXZlbnQuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFdmVudERldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsRXZlbnREZXRhaWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5yZXBvcnRzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3JlcG9ydHMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdyZXBvcnRzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXBvcnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFJlcG9ydCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnJlcG9ydHMuY3VycmVudHN0b2NrJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2N1cnJlbnRzdG9jaycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3JlcG9ydC5jdXJyZW50c3RvY2snKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcG9ydENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUmVwb3J0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucmVwb3J0cy5zYWxlcycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9zYWxlcycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3JlcG9ydC5zYWxlcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVwb3J0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxSZXBvcnQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5yZXBvcnRzLnNhbGVzYnltb250aCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9zYWxlc2J5bW9udGgnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdyZXBvcnQuc2FsZXNieW1vbnRoJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXBvcnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFJlcG9ydCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnJlcG9ydHMuaW5jb21lYnltb250aCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9pbmNvbWVieW1vbnRoJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncmVwb3J0LmluY29tZWJ5bW9udGgnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcG9ydENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUmVwb3J0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucmVwb3J0cy5wcm9kdWN0cHJvZml0cGVyY2VudHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcHJvZHVjdHByb2ZpdHBlcmNlbnRzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncmVwb3J0LnByb2R1Y3Rwcm9maXRwZXJjZW50cycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVwb3J0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxSZXBvcnQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5yZXBvcnRzLndlZWt3b3Jrb3JkZXJzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3dlZWt3b3Jrb3JkZXJzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncmVwb3J0LndlZWt3b3Jrb3JkZXJzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXBvcnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFJlcG9ydCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnJlcG9ydHMuYW9zJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2FvcycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3JlcG9ydC5hb3MnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcG9ydENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUmVwb3J0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAudW5pdHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvdW5pdHMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd1bml0cycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVW5pdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsVW5pdCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnVuaXRzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd1bml0LmNyZWF0ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVW5pdENyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsVW5pdENyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnVuaXRzLmRldGFpbCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9kZXRhaWwvOnVuaXRJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3VuaXQuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdVbml0RGV0YWlsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxVbml0RGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAubWF0ZXJpYWxzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL21hdGVyaWFscycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ21hdGVyaWFscycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWF0ZXJpYWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybE1hdGVyaWFsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAubWF0ZXJpYWxzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdtYXRlcmlhbC5jcmVhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01hdGVyaWFsQ3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxNYXRlcmlhbENyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLm1hdGVyaWFscy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzptYXRlcmlhbElkJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnbWF0ZXJpYWwuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNYXRlcmlhbERldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsTWF0ZXJpYWxEZXRhaWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5wdXJjaGFzZW9yZGVycycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9wdXJjaGFzZW9yZGVycycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3B1cmNoYXNlb3JkZXJzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQdXJjaGFzZU9yZGVyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQdXJjaGFzZU9yZGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucHVyY2hhc2VvcmRlcnMuY3JlYXRlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NyZWF0ZScsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3B1cmNoYXNlb3JkZXIuY3JlYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQdXJjaGFzZU9yZGVyQ3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQdXJjaGFzZU9yZGVyQ3JlYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucHVyY2hhc2VvcmRlcnMuZGV0YWlsJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2RldGFpbC86cHVyY2hhc2VPcmRlcklkJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncHVyY2hhc2VvcmRlci5kZXRhaWwnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1B1cmNoYXNlT3JkZXJEZXRhaWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFB1cmNoYXNlT3JkZXJEZXRhaWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5wYXltZW50dHlwZXMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcGF5bWVudHR5cGVzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncGF5bWVudHR5cGVzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQYXltZW50VHlwZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUGF5bWVudFR5cGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5wYXltZW50dHlwZXMuY3JlYXRlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NyZWF0ZScsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3BheW1lbnR0eXBlLmNyZWF0ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUGF5bWVudFR5cGVDcmVhdGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFBheW1lbnRUeXBlQ3JlYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucGF5bWVudHR5cGVzLmRldGFpbCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9kZXRhaWwvOnBheW1lbnRUeXBlSWQnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwYXltZW50dHlwZS5kZXRhaWwnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1BheW1lbnRUeXBlRGV0YWlsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQYXltZW50VHlwZURldGFpbCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmxvb2t1cHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvbG9va3VwcycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xvb2t1cHMnKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAubWF0ZXJpYWxzZXRzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL21hdGVyaWFsc2V0cycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ21hdGVyaWFsc2V0cycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWF0ZXJpYWxTZXRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybE1hdGVyaWFsU2V0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuYm9va2VkZGF0ZXMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYm9va2VkZGF0ZXMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdib29rZWRkYXRlcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQm9va2VkRGF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsQm9va2VkRGF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLm1hdGVyaWFsY2hlY2tsaXN0Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL21hdGVyaWFsY2hlY2tsaXN0JyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnbWF0ZXJpYWxjaGVja2xpc3QnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01hdGVyaWFsQ2hlY2tsaXN0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxNYXRlcmlhbENoZWNrbGlzdCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnNhbGVzY2hhbm5lbHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvc2FsZXNjaGFubmVscycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3NhbGVzY2hhbm5lbHMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1NhbGVzQ2hhbm5lbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsU2FsZXNDaGFubmVsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuc2FsZXNjaGFubmVscy5jcmVhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvY3JlYXRlJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0Vmlldygnc2FsZXNjaGFubmVsLmNyZWF0ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnU2FsZXNDaGFubmVsQ3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxTYWxlc0NoYW5uZWxDcmVhdGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5zYWxlc2NoYW5uZWxzLmRldGFpbCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9kZXRhaWwvOnNhbGVzQ2hhbm5lbElkJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0Vmlldygnc2FsZXNjaGFubmVsLmRldGFpbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnU2FsZXNDaGFubmVsRGV0YWlsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxTYWxlc0NoYW5uZWxEZXRhaWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgO1xyXG5cclxuICAgIH0gKTtcclxufSkoKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ21BcHBMb2FkaW5nJywgZnVuY3Rpb24gKCRhbmltYXRlKVxyXG57XHJcbiAgICAvLyBSZXR1cm4gdGhlIGRpcmVjdGl2ZSBjb25maWd1cmF0aW9uLlxyXG4gICAgcmV0dXJuKHtcclxuICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgIHJlc3RyaWN0OiBcIkNcIlxyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gbGluayggc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZXMgKVxyXG4gICAge1xyXG4gICAgICAgIC8vIER1ZSB0byB0aGUgd2F5IEFuZ3VsYXJKUyBwcmV2ZW50cyBhbmltYXRpb24gZHVyaW5nIHRoZSBib290c3RyYXBcclxuICAgICAgICAvLyBvZiB0aGUgYXBwbGljYXRpb24sIHdlIGNhbid0IGFuaW1hdGUgdGhlIHRvcC1sZXZlbCBjb250YWluZXI7IGJ1dCxcclxuICAgICAgICAvLyBzaW5jZSB3ZSBhZGRlZCBcIm5nQW5pbWF0ZUNoaWxkcmVuXCIsIHdlIGNhbiBhbmltYXRlZCB0aGUgaW5uZXJcclxuICAgICAgICAvLyBjb250YWluZXIgZHVyaW5nIHRoaXMgcGhhc2UuXHJcbiAgICAgICAgLy8gLS1cclxuICAgICAgICAvLyBOT1RFOiBBbSB1c2luZyAuZXEoMSkgc28gdGhhdCB3ZSBkb24ndCBhbmltYXRlIHRoZSBTdHlsZSBibG9jay5cclxuICAgICAgICAkYW5pbWF0ZS5sZWF2ZSggZWxlbWVudC5jaGlsZHJlbigpLmVxKCAxICkgKS50aGVuKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjbGVhbnVwQWZ0ZXJBbmltYXRpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIHJvb3QgZGlyZWN0aXZlIGVsZW1lbnQuXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENsZWFyIHRoZSBjbG9zZWQtb3ZlciB2YXJpYWJsZSByZWZlcmVuY2VzLlxyXG4gICAgICAgICAgICAgICAgc2NvcGUgPSBlbGVtZW50ID0gYXR0cmlidXRlcyA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxufSk7IiwiLyoqXHJcbiAqIENoZWNrbGlzdC1tb2RlbFxyXG4gKiBBbmd1bGFySlMgZGlyZWN0aXZlIGZvciBsaXN0IG9mIGNoZWNrYm94ZXNcclxuICogaHR0cHM6Ly9naXRodWIuY29tL3ZpdGFsZXRzL2NoZWNrbGlzdC1tb2RlbFxyXG4gKiBMaWNlbnNlOiBNSVQgaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxyXG4gKi9cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycpXHJcbiAgICAuZGlyZWN0aXZlKCdjaGVja2xpc3RNb2RlbCcsIFsnJHBhcnNlJywgJyRjb21waWxlJywgZnVuY3Rpb24oJHBhcnNlLCAkY29tcGlsZSkge1xyXG4gICAgICAgIC8vIGNvbnRhaW5zXHJcbiAgICAgICAgZnVuY3Rpb24gY29udGFpbnMoYXJyLCBpdGVtLCBjb21wYXJhdG9yKSB7XHJcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkoYXJyKSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IGFyci5sZW5ndGg7IGktLTspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcGFyYXRvcihhcnJbaV0sIGl0ZW0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBhZGRcclxuICAgICAgICBmdW5jdGlvbiBhZGQoYXJyLCBpdGVtLCBjb21wYXJhdG9yKSB7XHJcbiAgICAgICAgICAgIGFyciA9IGFuZ3VsYXIuaXNBcnJheShhcnIpID8gYXJyIDogW107XHJcbiAgICAgICAgICAgIGlmKCFjb250YWlucyhhcnIsIGl0ZW0sIGNvbXBhcmF0b3IpKSB7XHJcbiAgICAgICAgICAgICAgICBhcnIucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlXHJcbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlKGFyciwgaXRlbSwgY29tcGFyYXRvcikge1xyXG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KGFycikpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBhcnIubGVuZ3RoOyBpLS07KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBhcmF0b3IoYXJyW2ldLCBpdGVtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGFycjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE5MjI4MzAyLzE0NTgxNjJcclxuICAgICAgICBmdW5jdGlvbiBwb3N0TGlua0ZuKHNjb3BlLCBlbGVtLCBhdHRycykge1xyXG4gICAgICAgICAgICAvLyBleGNsdWRlIHJlY3Vyc2lvbiwgYnV0IHN0aWxsIGtlZXAgdGhlIG1vZGVsXHJcbiAgICAgICAgICAgIHZhciBjaGVja2xpc3RNb2RlbCA9IGF0dHJzLmNoZWNrbGlzdE1vZGVsO1xyXG4gICAgICAgICAgICBhdHRycy4kc2V0KFwiY2hlY2tsaXN0TW9kZWxcIiwgbnVsbCk7XHJcbiAgICAgICAgICAgIC8vIGNvbXBpbGUgd2l0aCBgbmctbW9kZWxgIHBvaW50aW5nIHRvIGBjaGVja2VkYFxyXG4gICAgICAgICAgICAkY29tcGlsZShlbGVtKShzY29wZSk7XHJcbiAgICAgICAgICAgIGF0dHJzLiRzZXQoXCJjaGVja2xpc3RNb2RlbFwiLCBjaGVja2xpc3RNb2RlbCk7XHJcblxyXG4gICAgICAgICAgICAvLyBnZXR0ZXIgLyBzZXR0ZXIgZm9yIG9yaWdpbmFsIG1vZGVsXHJcbiAgICAgICAgICAgIHZhciBnZXR0ZXIgPSAkcGFyc2UoY2hlY2tsaXN0TW9kZWwpO1xyXG4gICAgICAgICAgICB2YXIgc2V0dGVyID0gZ2V0dGVyLmFzc2lnbjtcclxuICAgICAgICAgICAgdmFyIGNoZWNrbGlzdENoYW5nZSA9ICRwYXJzZShhdHRycy5jaGVja2xpc3RDaGFuZ2UpO1xyXG4gICAgICAgICAgICB2YXIgY2hlY2tsaXN0QmVmb3JlQ2hhbmdlID0gJHBhcnNlKGF0dHJzLmNoZWNrbGlzdEJlZm9yZUNoYW5nZSk7XHJcblxyXG4gICAgICAgICAgICAvLyB2YWx1ZSBhZGRlZCB0byBsaXN0XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGF0dHJzLmNoZWNrbGlzdFZhbHVlID8gJHBhcnNlKGF0dHJzLmNoZWNrbGlzdFZhbHVlKShzY29wZS4kcGFyZW50KSA6IGF0dHJzLnZhbHVlO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHZhciBjb21wYXJhdG9yID0gYW5ndWxhci5lcXVhbHM7XHJcblxyXG4gICAgICAgICAgICBpZiAoYXR0cnMuaGFzT3duUHJvcGVydHkoJ2NoZWNrbGlzdENvbXBhcmF0b3InKSl7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXR0cnMuY2hlY2tsaXN0Q29tcGFyYXRvclswXSA9PSAnLicpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29tcGFyYXRvckV4cHJlc3Npb24gPSBhdHRycy5jaGVja2xpc3RDb21wYXJhdG9yLnN1YnN0cmluZygxKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21wYXJhdG9yID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFbY29tcGFyYXRvckV4cHJlc3Npb25dID09PSBiW2NvbXBhcmF0b3JFeHByZXNzaW9uXTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcGFyYXRvciA9ICRwYXJzZShhdHRycy5jaGVja2xpc3RDb21wYXJhdG9yKShzY29wZS4kcGFyZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gd2F0Y2ggVUkgY2hlY2tlZCBjaGFuZ2VcclxuICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGF0dHJzLm5nTW9kZWwsIGZ1bmN0aW9uKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlID09PSBvbGRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tsaXN0QmVmb3JlQ2hhbmdlICYmIChjaGVja2xpc3RCZWZvcmVDaGFuZ2Uoc2NvcGUpID09PSBmYWxzZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZVthdHRycy5uZ01vZGVsXSA9IGNvbnRhaW5zKGdldHRlcihzY29wZS4kcGFyZW50KSwgdmFsdWUsIGNvbXBhcmF0b3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzZXRWYWx1ZUluQ2hlY2tsaXN0TW9kZWwodmFsdWUsIG5ld1ZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tsaXN0Q2hhbmdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tsaXN0Q2hhbmdlKHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBzZXRWYWx1ZUluQ2hlY2tsaXN0TW9kZWwodmFsdWUsIGNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50ID0gZ2V0dGVyKHNjb3BlLiRwYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihzZXR0ZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrZWQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGVyKHNjb3BlLiRwYXJlbnQsIGFkZChjdXJyZW50LCB2YWx1ZSwgY29tcGFyYXRvcikpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRlcihzY29wZS4kcGFyZW50LCByZW1vdmUoY3VycmVudCwgdmFsdWUsIGNvbXBhcmF0b3IpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBkZWNsYXJlIG9uZSBmdW5jdGlvbiB0byBiZSB1c2VkIGZvciBib3RoICR3YXRjaCBmdW5jdGlvbnNcclxuICAgICAgICAgICAgZnVuY3Rpb24gc2V0Q2hlY2tlZChuZXdBcnIsIG9sZEFycikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrbGlzdEJlZm9yZUNoYW5nZSAmJiAoY2hlY2tsaXN0QmVmb3JlQ2hhbmdlKHNjb3BlKSA9PT0gZmFsc2UpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VmFsdWVJbkNoZWNrbGlzdE1vZGVsKHZhbHVlLCBzY29wZVthdHRycy5uZ01vZGVsXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc2NvcGVbYXR0cnMubmdNb2RlbF0gPSBjb250YWlucyhuZXdBcnIsIHZhbHVlLCBjb21wYXJhdG9yKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gd2F0Y2ggb3JpZ2luYWwgbW9kZWwgY2hhbmdlXHJcbiAgICAgICAgICAgIC8vIHVzZSB0aGUgZmFzdGVyICR3YXRjaENvbGxlY3Rpb24gbWV0aG9kIGlmIGl0J3MgYXZhaWxhYmxlXHJcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oc2NvcGUuJHBhcmVudC4kd2F0Y2hDb2xsZWN0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuJHBhcmVudC4kd2F0Y2hDb2xsZWN0aW9uKGNoZWNrbGlzdE1vZGVsLCBzZXRDaGVja2VkKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLiRwYXJlbnQuJHdhdGNoKGNoZWNrbGlzdE1vZGVsLCBzZXRDaGVja2VkLCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICAgICAgcHJpb3JpdHk6IDEwMDAsXHJcbiAgICAgICAgICAgIHRlcm1pbmFsOiB0cnVlLFxyXG4gICAgICAgICAgICBzY29wZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24odEVsZW1lbnQsIHRBdHRycykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCh0RWxlbWVudFswXS50YWdOYW1lICE9PSAnSU5QVVQnIHx8IHRBdHRycy50eXBlICE9PSAnY2hlY2tib3gnKSAmJiAodEVsZW1lbnRbMF0udGFnTmFtZSAhPT0gJ01ELUNIRUNLQk9YJykgJiYgKCF0QXR0cnMuYnRuQ2hlY2tib3gpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgJ2NoZWNrbGlzdC1tb2RlbCBzaG91bGQgYmUgYXBwbGllZCB0byBgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdYCBvciBgbWQtY2hlY2tib3hgLic7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCF0QXR0cnMuY2hlY2tsaXN0VmFsdWUgJiYgIXRBdHRycy52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93ICdZb3Ugc2hvdWxkIHByb3ZpZGUgYHZhbHVlYCBvciBgY2hlY2tsaXN0LXZhbHVlYC4nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIGJ5IGRlZmF1bHQgbmdNb2RlbCBpcyAnY2hlY2tlZCcsIHNvIHdlIHNldCBpdCBpZiBub3Qgc3BlY2lmaWVkXHJcbiAgICAgICAgICAgICAgICBpZiAoIXRBdHRycy5uZ01vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbG9jYWwgc2NvcGUgdmFyIHN0b3JpbmcgaW5kaXZpZHVhbCBjaGVja2JveCBtb2RlbFxyXG4gICAgICAgICAgICAgICAgICAgIHRBdHRycy4kc2V0KFwibmdNb2RlbFwiLCBcImNoZWNrZWRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBvc3RMaW5rRm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfV0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGJ5b3VuZyBvbiAzLzE4LzIwMTYuXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdmb2N1c09uJywgZnVuY3Rpb24gKClcclxue1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbGVtLCBhdHRyKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGF0dHIuZm9jdXNPbik7XHJcblxyXG4gICAgICAgIHNjb3BlLiRvbignZm9jdXNPbicsIGZ1bmN0aW9uKGUsIG5hbWUpXHJcbiAgICAgICAge1xyXG5cclxuY29uc29sZS5sb2coJ25hbWUgaXMnICsgbmFtZSk7XHJcbiAgICAgICAgICAgIGlmKG5hbWUgPT09IGF0dHIuZm9jdXNPbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmb3VuZCBlbGVtXCIpO1xyXG4gICAgICAgICAgICAgICAgZWxlbVswXS5mb2N1cygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKVxyXG4gICAgLmRpcmVjdGl2ZSgndXRjUGFyc2VyJywgZnVuY3Rpb24gKClcclxuICAgIHtcclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbmdNb2RlbCkge1xyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkluIHV0Y1BhcnNlciBkaXJlY3RpdmVcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgcGFyc2VyID0gZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICAgICAgdmFsID0gbW9tZW50LnV0Yyh2YWwpLmZvcm1hdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtYXR0ZXIgPSBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YWwgPSBuZXcgRGF0ZSh2YWwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIG5nTW9kZWwuJHBhcnNlcnMudW5zaGlmdChwYXJzZXIpO1xyXG4gICAgICAgICAgICBuZ01vZGVsLiRmb3JtYXR0ZXJzLnVuc2hpZnQoZm9ybWF0dGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJ1xyXG4gICAgICAgIH07XHJcbiAgICB9KTsiLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLmZpbHRlcnNcIikuZmlsdGVyKCd0cnVuY2F0ZU5hbWUnLCBmdW5jdGlvbigpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBtYXhMZW5ndGgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnB1dCA9IGlucHV0IHx8IFwiXCI7XHJcbiAgICAgICAgICAgIHZhciBvdXQgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgaWYoaW5wdXQubGVuZ3RoID4gbWF4TGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBvdXQgPSBpbnB1dC5zdWJzdHIoMCwgbWF4TGVuZ3RoKSArIFwiLi4uXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBvdXQgPSBpbnB1dDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG91dDtcclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBieW91bmcgb24gMy8xNC8yMDE2LlxyXG4gKi9cclxuKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdBdXRoU2VydmljZScsIFsnJGF1dGgnLCAnJHN0YXRlJywgZnVuY3Rpb24oJGF1dGgsICRzdGF0ZSkge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICAgICAgbG9naW46IGZ1bmN0aW9uKGVtYWlsLCBwYXNzd29yZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNyZWRlbnRpYWxzID0geyBlbWFpbDogZW1haWwsIHBhc3N3b3JkOiBwYXNzd29yZCB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coY3JlZGVudGlhbHMpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFVzZSBTYXRlbGxpemVyJ3MgJGF1dGggc2VydmljZSB0byBsb2dpbiBiZWNhdXNlIGl0J2xsIGF1dG9tYXRpY2FsbHkgc2F2ZSB0aGUgSldUIGluIGxvY2FsU3RvcmFnZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRhdXRoLmxvZ2luKGNyZWRlbnRpYWxzKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGlzQXV0aGVudGljYXRlZDogZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGF1dGguaXNBdXRoZW50aWNhdGVkKCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBsb2dvdXQ6IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgJGF1dGgubG9nb3V0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1dKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgQnJlZW4gb24gMTUvMDIvMjAxNi5cclxuICovXHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0NoYXJ0U2VydmljZScsIFsnJGF1dGgnLCAnUmVzdGFuZ3VsYXInLCAnJG1vbWVudCcsIGZ1bmN0aW9uKCRhdXRoLCBSZXN0YW5ndWxhciwgJG1vbWVudCl7XHJcblxyXG4gICAgICAgIHZhciBwaWVDb25maWcgPSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIGNoYXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3BpZSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBwbG90T3B0aW9uczpcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBwaWU6XHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxvd1BvaW50U2VsZWN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUxhYmVsczpcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93SW5MZWdlbmQ6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0aXRsZTpcclxuICAgICAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbG9hZGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgc2l6ZTpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDQwMCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogMjUwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgICAgIGdldE1vbnRobHlTYWxlc1JlcG9ydDogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgICAgICBzY29wZS5jaGFydENvbmZpZyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29sdW1uJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5QXhpczpcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJyMgb2Ygc2FsZXMnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhBeGlzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZGF0ZXRpbWUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZVRpbWVMYWJlbEZvcm1hdHM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9udGg6ICclYicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeWVhcjogJyViJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdEYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1NhbGVzIHBlciBtb250aCdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgncmVwb3J0cy9nZXRNb250aGx5U2FsZXNSZXBvcnQnKS5wb3N0KHsgJ3JlcG9ydFBhcmFtcyc6IHt9fSkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhU2V0ID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb25lRGF0YVBvaW50ID0gZGF0YVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhvbmVEYXRhUG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhU2V0LnB1c2goW0RhdGUuVVRDKHBhcnNlSW50KG9uZURhdGFQb2ludC55ZWFyKSwgcGFyc2VJbnQob25lRGF0YVBvaW50Lm1vbnRoKSAtIDEpLCBwYXJzZUludChvbmVEYXRhUG9pbnQucG9jb3VudCldKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmNoYXJ0Q29uZmlnLnNlcmllcyA9IFt7bmFtZTogJ1NhbGVzIHRoaXMgbW9udGgnLCBkYXRhOiBkYXRhU2V0IH1dO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jaGFydENvbmZpZy5sb2FkaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRNb250aGx5SW5jb21lUmVwb3J0OiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgICAgIHNjb3BlLmNoYXJ0Q29uZmlnID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjb2x1bW4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHlBeGlzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnJCBhbW91bnQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhBeGlzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZGF0ZXRpbWUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZVRpbWVMYWJlbEZvcm1hdHM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9udGg6ICclYicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeWVhcjogJyViJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdEYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ0luY29tZSBwZXIgbW9udGgnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3JlcG9ydHMvZ2V0TW9udGhseVNhbGVzUmVwb3J0JykucG9zdCh7ICdyZXBvcnRQYXJhbXMnOiB7fX0pLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhU2V0ID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb25lRGF0YVBvaW50ID0gZGF0YVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cob25lRGF0YVBvaW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFTZXQucHVzaChbRGF0ZS5VVEMocGFyc2VJbnQob25lRGF0YVBvaW50LnllYXIpLCBwYXJzZUludChvbmVEYXRhUG9pbnQubW9udGgpIC0gMSksIHBhcnNlRmxvYXQob25lRGF0YVBvaW50Lm1vbnRodG90YWwpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmNoYXJ0Q29uZmlnLnNlcmllcyA9IFt7bmFtZTogJ0luY29tZSB0aGlzIG1vbnRoJywgZGF0YTogZGF0YVNldCB9XTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmNoYXJ0Q29uZmlnLmxvYWRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0VG9wU2VsbGluZ1Byb2R1Y3RzOiBmdW5jdGlvbihzY29wZSwgY2hhcnRUaXRsZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhcnRUaXRsZSk7XHJcbiAgICAgICAgICAgICAgICBzY29wZS50b3BTZWxsaW5nQ2hhcnRDb25maWcgPSB7fTtcclxuICAgICAgICAgICAgICAgIHNjb3BlLnRvcFNlbGxpbmdDaGFydENvbmZpZyA9IGpRdWVyeS5leHRlbmQodHJ1ZSwge30sIHBpZUNvbmZpZyk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncmVwb3J0cy9nZXRUb3BTZWxsaW5nUHJvZHVjdHMnKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFTZXQgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvbmVEYXRhUG9pbnQgPSBkYXRhW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKG9uZURhdGFQb2ludCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFTZXQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBvbmVEYXRhUG9pbnQubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkOiAoaSA9PT0gMCkgPyB0cnVlIDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGljZWQ6IChpID09PSAwKSA/IHRydWUgOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IHBhcnNlSW50KG9uZURhdGFQb2ludC5wY291bnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUudG9wU2VsbGluZ0NoYXJ0Q29uZmlnLnNlcmllcyA9IFt7bmFtZTogJ1NvbGQnLCBkYXRhOiBkYXRhU2V0IH1dO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnRvcFNlbGxpbmdDaGFydENvbmZpZy50aXRsZS50ZXh0ID0gY2hhcnRUaXRsZTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS50b3BTZWxsaW5nQ2hhcnRDb25maWcubG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRXJyb3JcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0UHJvZHVjdFByb2ZpdFBlcmNlbnRzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUucHJvZHVjdFByb2ZpdFBlcmNlbnRDaGFydENvbmZpZyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29sdW1uJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhBeGlzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY2F0ZWdvcnknXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHlBeGlzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdQcm9maXQgJSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdQcm9kdWN0IFByb2ZpdCAlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmc6IHRydWVcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncmVwb3J0cy9nZXRQcm9kdWN0UHJvZml0UGVyY2VudHMnKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YVNldCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9uZURhdGFQb2ludCA9IGRhdGFbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYob25lRGF0YVBvaW50LmNvc3QgPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9maXQgPSBvbmVEYXRhUG9pbnQucHJpY2UgLSBvbmVEYXRhUG9pbnQuY29zdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvZml0UGVyY2VudCA9IChwcm9maXQgLyBvbmVEYXRhUG9pbnQuY29zdCAqIDEwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ1ByaWNlOicgKyBvbmVEYXRhUG9pbnQucHJpY2UgKyAnIENvc3Q6JyArIG9uZURhdGFQb2ludC5jb3N0ICsgJyBQcm9maXQ6JyArIE1hdGgucm91bmQocHJvZml0UGVyY2VudCAqIDEwMCkgLyAxMDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ1ByaWNlOicgKyBvbmVEYXRhUG9pbnQucHJpY2UgKyAnIENvc3Q6JyArIG9uZURhdGFQb2ludC5jb3N0ICsgJyBQcm9maXQ6JyArIHByb2ZpdFBlcmNlbnQudG9GaXhlZCgwKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFTZXQucHVzaChbb25lRGF0YVBvaW50Lm5hbWUsIHBhcnNlSW50KHByb2ZpdFBlcmNlbnQudG9GaXhlZCgwKSldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVNldC5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludChiWzFdKSAtIHBhcnNlSW50KGFbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGFTZXQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvZHVjdFByb2ZpdFBlcmNlbnRDaGFydENvbmZpZy5zZXJpZXMgPSBbe25hbWU6ICdQcm9maXQgJScsIGRhdGE6IGRhdGFTZXQgfV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnByb2R1Y3RQcm9maXRQZXJjZW50Q2hhcnRDb25maWcubG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfTtcclxuICAgIH1dKTtcclxufSkoKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBCcmVlbiBvbiAxNS8wMi8yMDE2LlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnRGlhbG9nU2VydmljZScsIGZ1bmN0aW9uKCAkbWREaWFsb2cgKXtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgICAgIGZyb21DdXN0b206IGZ1bmN0aW9uKG9wdGlvbnMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkbWREaWFsb2cuc2hvdyhvcHRpb25zKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGZyb21UZW1wbGF0ZTogZnVuY3Rpb24oZXYsIHRlbXBsYXRlLCBzY29wZSApIHtcclxuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpYWxvZ3MvJyArIHRlbXBsYXRlICsgJy5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBlc2NhcGVUb0Nsb3NlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiBEaWFsb2dDb250cm9sbGVyKCRzY29wZSwgJG1kRGlhbG9nKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbmZpcm1EaWFsb2cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNhbmNlbERpYWxvZyA9IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmNhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoZXYgIT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy50YXJnZXRFdmVudCA9IGV2O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggc2NvcGUgKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2NvcGUgPSBzY29wZS4kbmV3KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9vcHRpb25zLnByZXNlcnZlU2NvcGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiAkbWREaWFsb2cuc2hvdyhvcHRpb25zKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGhpZGU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJG1kRGlhbG9nLmhpZGUoKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFsZXJ0OiBmdW5jdGlvbih0aXRsZSwgY29udGVudCl7XHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuc2hvdyhcclxuICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuYWxlcnQoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGl0bGUodGl0bGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jb250ZW50KGNvbnRlbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vaygnT2snKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGNvbmZpcm06IGZ1bmN0aW9uKGV2ZW50LCB0aXRsZSwgY29udGVudClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbmZpcm0gPSAkbWREaWFsb2cuY29uZmlybSgpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRpdGxlKHRpdGxlKVxyXG4gICAgICAgICAgICAgICAgICAgIC50ZXh0Q29udGVudChjb250ZW50KVxyXG4gICAgICAgICAgICAgICAgICAgIC5hcmlhTGFiZWwoJycpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRhcmdldEV2ZW50KGV2ZW50KVxyXG4gICAgICAgICAgICAgICAgICAgIC5vaygnWWVzJylcclxuICAgICAgICAgICAgICAgICAgICAuY2FuY2VsKCdObycpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiAkbWREaWFsb2cuc2hvdyhjb25maXJtKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbn0pKCk7IiwiXHJcbihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnRm9jdXNTZXJ2aWNlJywgWyckcm9vdFNjb3BlJywgJyR0aW1lb3V0JywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHRpbWVvdXQpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG5hbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdmb2N1c09uJywgbmFtZSk7XHJcbiAgICAgICAgICAgIH0sMTAwKTtcclxuICAgICAgICB9O1xyXG4gICAgfV0pO1xyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGJ5b3VuZyBvbiAzLzE0LzIwMTYuXHJcbiAqL1xyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0d1aWRTZXJ2aWNlJywgW2Z1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBzNCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMClcclxuICAgICAgICAgICAgICAgIC50b1N0cmluZygxNilcclxuICAgICAgICAgICAgICAgIC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICAgICAgbmV3R3VpZDogZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gczQoKSArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArXHJcbiAgICAgICAgICAgICAgICAgICAgczQoKSArICctJyArIHM0KCkgKyBzNCgpICsgczQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfV0pO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBCcmVlbiBvbiAxNS8wMi8yMDE2LlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnUmVzdFNlcnZpY2UnLCBbJyRxJywgJyRhdXRoJywgJ1Jlc3Rhbmd1bGFyJywgJyRtb21lbnQnLCBmdW5jdGlvbigkcSwgJGF1dGgsIFJlc3Rhbmd1bGFyLCAkbW9tZW50KXtcclxuXHJcbiAgICAgICAgdmFyIGJhc2VQcm9kdWN0cyA9IFJlc3Rhbmd1bGFyLmFsbCgncHJvZHVjdCcpO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICAgICAgZ2V0QWxsUHJvZHVjdHM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBiYXNlUHJvZHVjdHMuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnByb2R1Y3RzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0UHJvZHVjdDogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3Byb2R1Y3QnLCBpZCkuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSGFjayBmb3IgT0xEIG15c3FsIGRyaXZlcnMgb24gSG9zdGdhdG9yIHdoaWNoIGRvbid0IHByb3Blcmx5IGVuY29kZSBpbnRlZ2VyIGFuZCByZXR1cm4gdGhlbSBhcyBzdHJpbmdzXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5pc19jdXN0b20gPSBwYXJzZUludChkYXRhLmlzX2N1c3RvbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvZHVjdCA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEFsbEN1c3RvbWVyczogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnY3VzdG9tZXInKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY3VzdG9tZXJzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0Q3VzdG9tZXI6IGZ1bmN0aW9uKHNjb3BlLCBpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdjdXN0b21lcicsIGlkKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXN0b21lciA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEFsbFdvcmtPcmRlcnM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3dvcmtvcmRlcicpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS53b3Jrb3JkZXJzID0gZGF0YTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzY29wZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldFdvcmtPcmRlcjogZnVuY3Rpb24oaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBwID0gUmVzdGFuZ3VsYXIub25lKCd3b3Jrb3JkZXInLCBpZCkuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEZvcm1hdCBzdHJpbmcgZGF0ZXMgaW50byBkYXRlIG9iamVjdHNcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLnN0YXJ0X2RhdGUgPSAkbW9tZW50KGRhdGEuc3RhcnRfZGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5lbmRfZGF0ZSA9ICRtb21lbnQoZGF0YS5lbmRfZGF0ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEhhY2sgZm9yIE9MRCBteXNxbCBkcml2ZXJzIG9uIEhvc3RnYXRvciB3aGljaCBkb24ndCBwcm9wZXJseSBlbmNvZGUgaW50ZWdlciBhbmQgcmV0dXJuIHRoZW0gYXMgc3RyaW5nc1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuY29tcGxldGVkID0gcGFyc2VJbnQoZGF0YS5jb21wbGV0ZWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBNb3JlIEhvc3RnYXRvciBzaGl0XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS53b3JrX29yZGVyX3Byb2dyZXNzICYmIGRhdGEud29ya19vcmRlcl9wcm9ncmVzcy5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGRhdGEud29ya19vcmRlcl9wcm9ncmVzcy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS53b3JrX29yZGVyX3Byb2dyZXNzW2ldLndvcmtfb3JkZXJfaWQgPSBwYXJzZUludChkYXRhLndvcmtfb3JkZXJfcHJvZ3Jlc3NbaV0ud29ya19vcmRlcl9pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLndvcmtfb3JkZXJfcHJvZ3Jlc3NbaV0ud29ya19vcmRlcl90YXNrX2lkID0gcGFyc2VJbnQoZGF0YS53b3JrX29yZGVyX3Byb2dyZXNzW2ldLndvcmtfb3JkZXJfdGFza19pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIENvdW50IHdvcmsgb3JkZXIgcHJvZ3Jlc3Mgc3RhdGVzXHJcbiAgICAgICAgICAgICAgICAgICAgLy9zY29wZS5jb21wbGV0ZWRQcm9ncmVzc0NvdW50ID0gZGF0YS53b3JrX29yZGVyX3Byb2dyZXNzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9zY29wZS53b3Jrb3JkZXIgPSBkYXRhO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBwO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsRXZlbnRzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdldmVudCcpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5ldmVudHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRFdmVudDogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ2V2ZW50JywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmV2ZW50ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsVW5pdHM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3VuaXQnKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUudW5pdHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRVbml0OiBmdW5jdGlvbihzY29wZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgndW5pdCcsIGlkKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS51bml0ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsTWF0ZXJpYWxzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdtYXRlcmlhbCcpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5tYXRlcmlhbHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRNYXRlcmlhbDogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ21hdGVyaWFsJywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLm1hdGVyaWFsID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZG9TZWFyY2g6IGZ1bmN0aW9uKHNjb3BlLCBxdWVyeSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDYWxsIFdTIHdpdGg6IFwiICsgcXVlcnkpO1xyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnc2VhcmNoJywgcXVlcnkpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsUHVyY2hhc2VPcmRlcnM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3B1cmNoYXNlb3JkZXInKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucHVyY2hhc2VvcmRlcnMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRQdXJjaGFzZU9yZGVyOiBmdW5jdGlvbihzY29wZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncHVyY2hhc2VvcmRlcicsIGlkKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRm9ybWF0IHN0cmluZyBkYXRlcyBpbnRvIGRhdGUgb2JqZWN0c1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEucGlja3VwX2RhdGUgPSAkbW9tZW50KGRhdGEucGlja3VwX2RhdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBIYWNrIGZvciBPTEQgbXlzcWwgZHJpdmVycyBvbiBIb3N0Z2F0b3Igd2hpY2ggZG9uJ3QgcHJvcGVybHkgZW5jb2RlIGludGVnZXIgYW5kIHJldHVybiB0aGVtIGFzIHN0cmluZ3NcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLmZ1bGZpbGxlZCA9IHBhcnNlSW50KGRhdGEuZnVsZmlsbGVkKTtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLnBhaWQgPSBwYXJzZUludChkYXRhLnBhaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5wdXJjaGFzZW9yZGVyID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsUGF5bWVudFR5cGVzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdwYXltZW50dHlwZScpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5wYXltZW50dHlwZXMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRQYXltZW50VHlwZTogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3BheW1lbnR0eXBlJywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnBheW1lbnR0eXBlID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0TWF0ZXJpYWxBbGxUeXBlczogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnbWF0ZXJpYWx0eXBlJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLm1hdGVyaWFsdHlwZXMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRGdWxseUJvb2tlZERheXM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3NjaGVkdWxlci9nZXRGdWxseUJvb2tlZERheXMnKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmJvb2tlZERheXMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEZ1dHVyZVdvcmtPcmRlcnM6IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLm9uZSgnc2NoZWR1bGVyL2dldEZ1dHVyZVdvcmtPcmRlcnMnKS5nZXRMaXN0KCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRDdXN0b21lcjogZnVuY3Rpb24ob2JqKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIuYWxsKCdjdXN0b21lcicpLnBvc3Qob2JqKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZFByb2R1Y3Q6IGZ1bmN0aW9uKG9iailcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLmFsbCgncHJvZHVjdCcpLnBvc3Qob2JqKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEFsbEJvb2tpbmdzOiBmdW5jdGlvbihzdGFydCwgZW5kKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIuYWxsKCdib29rZWRkYXRlJykuZ2V0TGlzdCh7IHN0YXJ0OiBzdGFydCwgZW5kOiBlbmR9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZEJvb2tpbmc6IGZ1bmN0aW9uKG9iailcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLmFsbCgnYm9va2VkZGF0ZScpLnBvc3Qob2JqKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHVwZGF0ZUJvb2tpbmc6IGZ1bmN0aW9uKG9iailcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iai5wdXQoKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGRlbGV0ZUJvb2tpbmc6IGZ1bmN0aW9uKG9iailcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iai5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEFsbFNhbGVzQ2hhbm5lbHM6IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLmFsbCgnc2FsZXNjaGFubmVsJykuZ2V0TGlzdCgpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0U2FsZXNDaGFubmVsOiBmdW5jdGlvbihpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLm9uZSgnc2FsZXNjaGFubmVsJywgaWQpLmdldCgpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsV29ya09yZGVyVGFza3M6IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLmFsbCgnd29ya29yZGVydGFzaycpLmdldExpc3QoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9O1xyXG4gICAgfV0pO1xyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEJyZWVuIG9uIDE1LzAyLzIwMTYuXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdUb2FzdFNlcnZpY2UnLCBmdW5jdGlvbiggJG1kVG9hc3QgKXtcclxuXHJcbiAgICAgICAgdmFyIGRlbGF5ID0gNjAwMCxcclxuICAgICAgICAgICAgcG9zaXRpb24gPSAndG9wIHJpZ2h0JyxcclxuICAgICAgICAgICAgYWN0aW9uID0gJ09LJztcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc2hvdzogZnVuY3Rpb24oY29udGVudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRtZFRvYXN0LnNob3coXHJcbiAgICAgICAgICAgICAgICAgICAgJG1kVG9hc3Quc2ltcGxlKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNvbnRlbnQoY29udGVudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnBvc2l0aW9uKHBvc2l0aW9uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWN0aW9uKGFjdGlvbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmhpZGVEZWxheShkZWxheSlcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdVcGxvYWRTZXJ2aWNlJywgWydVcGxvYWQnLCBmdW5jdGlvbihVcGxvYWQpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgICAgIHVwbG9hZEZpbGU6IGZ1bmN0aW9uIChmaWxlbmFtZSwgZmlsZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGFPYmogPSB7ZmlsZTogZmlsZSB9O1xyXG4gICAgICAgICAgICAgICAgaWYoZmlsZW5hbWUgIT09ICcnKSB7IGRhdGFPYmouZmlsZW5hbWUgPSBmaWxlbmFtZTsgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBVcGxvYWQudXBsb2FkKHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdhcGkvdXBsb2FkZXIvdXBsb2FkRmlsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YU9ialxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBkZWxldGVGaWxlOiBmdW5jdGlvbihmaWxlbmFtZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGFPYmogPSB7ZmlsZW5hbWU6IGZpbGVuYW1lIH07XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFVwbG9hZC51cGxvYWQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2FwaS91cGxvYWRlci9kZWxldGVGaWxlJyxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhT2JqXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XSk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGJ5b3VuZyBvbiAzLzE0LzIwMTYuXHJcbiAqL1xyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ1ZhbGlkYXRpb25TZXJ2aWNlJywgW2Z1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICAgICAgZGVjaW1hbFJlZ2V4OiBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnXlxcXFxkKlxcXFwuP1xcXFxkKiQnO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgbnVtZXJpY1JlZ2V4OiBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnXlxcXFxkKiQnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XSk7XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gQm9va2VkRGF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgJHNjb3BlLCBSZXN0YW5ndWxhciwgJG1vbWVudCwgUmVzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgZXZlbnRTb3VyY2VzID0gW107XHJcbiAgICAgICAgdmFyIHdvcmtPcmRlckV2ZW50U3JjID0geyBldmVudHM6IFtdLCBiYWNrZ3JvdW5kQ29sb3I6ICdibHVlJywgYWxsRGF5RGVmYXVsdDogdHJ1ZSwgZWRpdGFibGU6IGZhbHNlIH07XHJcblxyXG4gICAgICAgIHZhciBib29rZWREYXRlRXZlbnRzID0gW107XHJcbiAgICAgICAgdmFyIGJvb2tlZERhdGVTcmMgPSB7XHJcbiAgICAgICAgICAgIGV2ZW50czogZnVuY3Rpb24oc3RhcnQsIGVuZCwgdHosIGNhbGxiYWNrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxCb29raW5ncyhzdGFydCwgZW5kKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZXZlbnRzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGFbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHMucHVzaCh7YmRPYmo6IGRhdGFbaV0sIHRpdGxlOiBkYXRhW2ldLm5vdGVzLCBzdGFydDogZGF0YVtpXS5zdGFydF9kYXRlLCBlbmQ6IGRhdGFbaV0uZW5kX2RhdGV9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGV2ZW50cyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAsIGJhY2tncm91bmRDb2xvcjogJ29yYW5nZScsIGFsbERheURlZmF1bHQ6IHRydWUsIGVkaXRhYmxlOiB0cnVlLCBldmVudFN0YXJ0RWRpdGFibGU6IHRydWVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRGdXR1cmVXb3JrT3JkZXJzKCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YVtpXSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgb25lV08gPSBkYXRhW2ldO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygkbW9tZW50KG9uZVdPLnN0YXJ0X2RhdGUpKTtcclxuICAgICAgICAgICAgICAgIHdvcmtPcmRlckV2ZW50U3JjLmV2ZW50cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1dvcmsgT3JkZXIgJyArIG9uZVdPLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiAkbW9tZW50KG9uZVdPLnN0YXJ0X2RhdGUpLmZvcm1hdCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHdvT2JqOiBvbmVXTyxcclxuICAgICAgICAgICAgICAgICAgICBib29raW5nVHlwZTogJ3dvcmtvcmRlcidcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGV2ZW50U291cmNlcy5wdXNoKHdvcmtPcmRlckV2ZW50U3JjKTtcclxuXHJcbiAgICAgICAgICAgIC8vYm9va2VkRGF0ZUV2ZW50cy5wdXNoKHsgdGl0bGU6ICd0ZXN0IEJPenp6JywgYm9va2luZ1R5cGU6ICdib29rZWREYXRlJywgc3RhcnQ6ICRtb21lbnQoKS5mb3JtYXQoKX0pO1xyXG4gICAgICAgICAgICBldmVudFNvdXJjZXMucHVzaChib29rZWREYXRlU3JjKTtcclxuXHJcbiAgICAgICAgICAgICQoJyNjYWxlbmRhcicpLmZ1bGxDYWxlbmRhcih7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gcHV0IHlvdXIgb3B0aW9ucyBhbmQgY2FsbGJhY2tzIGhlcmVcclxuICAgICAgICAgICAgICAgIGV2ZW50U291cmNlczogZXZlbnRTb3VyY2VzLFxyXG4gICAgICAgICAgICAgICAgZXZlbnRDbGljazogZnVuY3Rpb24oY2FsRXZlbnQsIGpzRXZlbnQsIHZpZXcpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhjYWxFdmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGNhbEV2ZW50LmJvb2tpbmdUeXBlID09PSAnd29ya29yZGVyJylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS53b09iaiA9IGNhbEV2ZW50LndvT2JqO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUG9wdXAgV08gZGV0YWlscyAocmVhZG9ubHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKG51bGwsICdkbGdXb3JrT3JkZXJRdWlja1ZpZXcnLCAkc2NvcGUpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2NvbmZpcm1lZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyRzdGF0ZS5nbygnYXBwLndvcmtvcmRlcnMuZGV0YWlsJywgeyd3b3JrT3JkZXJJZCc6IGNhbEV2ZW50Lndvcmtfb3JkZXJfaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmlzRWRpdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5iZE9iaiA9IGNhbEV2ZW50LmJkT2JqO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubm90ZXMgPSBjYWxFdmVudC50aXRsZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJvb2tpbmcgRGF0ZSAoYWxsb3cgZWRpdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpYWxvZ09wdGlvbnMgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaWFsb2dzL2RsZ0FkZEJvb2tpbmdEYXRlLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXNjYXBlVG9DbG9zZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEV2ZW50OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gRGlhbG9nQ29udHJvbGxlcigkc2NvcGUsICRtZERpYWxvZylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY29uZmlybURpYWxvZyA9IGZ1bmN0aW9uICgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuYmRPYmoubm90ZXMgPSAkc2NvcGUubm90ZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc3RTZXJ2aWNlLnVwZGF0ZUJvb2tpbmcoJHNjb3BlLmJkT2JqKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2NhbGVuZGFyJykuZnVsbENhbGVuZGFyKCdyZWZldGNoRXZlbnRzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kZWxldGVCb29raW5nID0gZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzdFNlcnZpY2UuZGVsZXRlQm9va2luZygkc2NvcGUuYmRPYmopLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjY2FsZW5kYXInKS5mdWxsQ2FsZW5kYXIoJ3JlZmV0Y2hFdmVudHMnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRtZERpYWxvZy5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNhbmNlbERpYWxvZyA9IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2NhbmNlbGxlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGU6ICRzY29wZS4kbmV3KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRGlhbG9nU2VydmljZS5mcm9tQ3VzdG9tKGRpYWxvZ09wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBldmVudE1vdXNlb3ZlcjogZnVuY3Rpb24oZXZlbnQsIGpzRXZlbnQsIHZpZXcpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ2N1cnNvcicsICdwb2ludGVyJyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGF5Q2xpY2s6IGZ1bmN0aW9uKGRhdGUsIGpzRXZlbnQsIHZpZXcsIHJlc291cmNlT2JqKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGUubG9jYWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGUubG9jYWwoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRlLnRvSVNPU3RyaW5nKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaXNFZGl0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkaWFsb2dPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaWFsb2dzL2RsZ0FkZEJvb2tpbmdEYXRlLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlc2NhcGVUb0Nsb3NlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRFdmVudDogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gRGlhbG9nQ29udHJvbGxlcigkc2NvcGUsICRtZERpYWxvZylcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbmZpcm1EaWFsb2cgPSBmdW5jdGlvbiAoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjY2VwdGVkJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBldmVudE9iaiA9IHsgbm90ZXM6ICRzY29wZS5ub3RlcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRfZGF0ZTogZGF0ZS50b0RhdGUoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kX2RhdGU6IGRhdGUudG9EYXRlKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGV2ZW50T2JqKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXN0U2VydmljZS5hZGRCb29raW5nKGV2ZW50T2JqKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2V2ZW50IGFkZGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNjYWxlbmRhcicpLmZ1bGxDYWxlbmRhcigncmVmZXRjaEV2ZW50cycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyQoJyNjYWxlbmRhcicpLmZ1bGxDYWxlbmRhcigncmVtb3ZlRXZlbnRTb3VyY2UnLCBib29rZWREYXRlU3JjKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyQoJyNjYWxlbmRhcicpLmZ1bGxDYWxlbmRhcignYWRkRXZlbnRTb3VyY2UnLCBib29rZWREYXRlU3JjKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNhbmNlbERpYWxvZyA9IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdjYW5jZWxsZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGU6ICRzY29wZS4kbmV3KClcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRpYWxvZ09wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbUN1c3RvbShkaWFsb2dPcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBldmVudERyb3A6IGZ1bmN0aW9uKGV2ZW50LCBkZWx0YSwgcmV2ZXJ0RnVuYylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRlbHRhKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkZWx0YS5kYXlzKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGRlbHRhLmRheXMoKSA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5zdGFydC5hZGQoZGVsdGEuZGF5cygpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuZW5kID0gZXZlbnQuc3RhcnQ7IC8vJG1vbWVudChldmVudC5zdGFydCkuYWRkKDEsICdkYXlzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoZGVsdGEuZGF5cyA8IDApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5zdGFydC5zdWJ0cmFjdChkZWx0YS5kYXlzKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5lbmQgPSBldmVudC5zdGFydDsgLy8kbW9tZW50KGV2ZW50LnN0YXJ0KS5hZGQoMSwgJ2RheXMnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbmNvbnNvbGUubG9nKGV2ZW50KTtcclxuKi9cclxuICAgICAgICAgICAgICAgICAgICBldmVudC5iZE9iai5zdGFydF9kYXRlID0gZXZlbnQuc3RhcnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuYmRPYmouZW5kX2RhdGUgPSBldmVudC5lbmQgPT09IG51bGwgPyBldmVudC5zdGFydCA6IGV2ZW50LmVuZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXZlbnQuYmRPYmopO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBSZXN0U2VydmljZS51cGRhdGVCb29raW5nKGV2ZW50LmJkT2JqKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJkYXRlIGNoYW5nZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNjYWxlbmRhcicpLmZ1bGxDYWxlbmRhcigncmVmZXRjaEV2ZW50cycpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGV2ZW50UmVzaXplOiBmdW5jdGlvbihldmVudCwgZGVsdGEsIHJldmVydEZ1bmMpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhldmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkZWx0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICBpZihkZWx0YS5kYXlzKCkgPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuZW5kLmFkZChkZWx0YS5kYXlzKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKGRlbHRhLmRheXMgPCAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuZW5kLnN1YnRyYWN0KGRlbHRhLmRheXMoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4qL1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBldmVudC5iZE9iai5lbmRfZGF0ZSA9IGV2ZW50LmVuZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhldmVudC5iZE9iaik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIFJlc3RTZXJ2aWNlLnVwZGF0ZUJvb2tpbmcoZXZlbnQuYmRPYmopLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImRhdGUgY2hhbmdlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2NhbGVuZGFyJykuZnVsbENhbGVuZGFyKCdyZWZldGNoRXZlbnRzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0Jvb2tlZERhdGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnJHNjb3BlJywgJ1Jlc3Rhbmd1bGFyJywgJyRtb21lbnQnLCAnUmVzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsIEJvb2tlZERhdGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gQ29yZUNvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGUsICRtb21lbnQsICRtZFNpZGVuYXYsICRtZE1lZGlhLCBBdXRoU2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciB0b2RheSA9IG5ldyBEYXRlKCk7XHJcblxyXG4gICAgICAgICRzY29wZS50b2RheXNEYXRlID0gdG9kYXk7XHJcbiAgICAgICAgJHNjb3BlLnNob3dTZWFyY2ggPSBmYWxzZTtcclxuXHJcbiAgICAgICAgJHNjb3BlLnRvZ2dsZVNpZGVuYXYgPSBmdW5jdGlvbihtZW51SWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAkbWRTaWRlbmF2KG1lbnVJZCkudG9nZ2xlKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLnNob3dTaWRlTmF2ID0gZnVuY3Rpb24obWVudUlkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoISRtZFNpZGVuYXYobWVudUlkKS5pc0xvY2tlZE9wZW4oKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgJG1kU2lkZW5hdihtZW51SWQpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5oaWRlU2lkZU5hdiA9IGZ1bmN0aW9uKG1lbnVJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKCEkbWRTaWRlbmF2KG1lbnVJZCkuaXNMb2NrZWRPcGVuKCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICRtZFNpZGVuYXYobWVudUlkKS5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLnRvZ2dsZVNlYXJjaCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICRzY29wZS5zaG93U2VhcmNoID0gISRzY29wZS5zaG93U2VhcmNoO1xyXG4gICAgICAgICAgICAvL2lmKCRzY29wZS5zaG93U2VhcmNoKSB7IGNvbnNvbGUubG9nKGFuZ3VsYXIuZWxlbWVudCgnI3N1cGVyU2VhcmNoJykpOyB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gTGlzdGVuIGZvciB0b2dnbGVTZWFyY2ggZXZlbnRzXHJcbiAgICAgICAgJHNjb3BlLiRvbihcInRvZ2dsZVNlYXJjaFwiLCBmdW5jdGlvbiAoZXZlbnQsIGFyZ3MpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAkc2NvcGUudG9nZ2xlU2VhcmNoKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRzY29wZS5kZXRlcm1pbmVGYWJWaXNpYmlsaXR5ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoJHN0YXRlLmlzKFwiYXBwLnByb2R1Y3RzXCIpIHx8ICRzdGF0ZS5pcyhcImFwcC5jdXN0b21lcnNcIilcclxuICAgICAgICAgICAgICAgIHx8ICRzdGF0ZS5pcyhcImFwcC5wdXJjaGFzZW9yZGVyc1wiKSB8fCAkc3RhdGUuaXMoXCJhcHAucGF5bWVudHR5cGVzXCIpXHJcbiAgICAgICAgICAgICAgICB8fCAkc3RhdGUuaXMoXCJhcHAud29ya29yZGVyc1wiKSB8fCAkc3RhdGUuaXMoXCJhcHAuZXZlbnRzXCIpXHJcbiAgICAgICAgICAgICAgICB8fCAkc3RhdGUuaXMoXCJhcHAudW5pdHNcIikgfHwgJHN0YXRlLmlzKFwiYXBwLm1hdGVyaWFsc1wiKVxyXG4gICAgICAgICAgICAgICAgfHwgJHN0YXRlLmlzKFwiYXBwLnNhbGVzY2hhbm5lbHNcIikpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmFkZEZhYk5hdmlnYXRlID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJHN0YXRlLiRjdXJyZW50Lm5hbWUpO1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gXCJcIjtcclxuICAgICAgICAgICAgc3dpdGNoKCRzdGF0ZS4kY3VycmVudC5uYW1lKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiYXBwLnByb2R1Y3RzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gXCJhcHAucHJvZHVjdHMuY3JlYXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiYXBwLmN1c3RvbWVyc1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IFwiYXBwLmN1c3RvbWVycy5jcmVhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJhcHAucHVyY2hhc2VvcmRlcnNcIjpcclxuICAgICAgICAgICAgICAgICAgICB1cmwgPSBcImFwcC5wdXJjaGFzZW9yZGVycy5jcmVhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJhcHAucGF5bWVudHR5cGVzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gXCJhcHAucGF5bWVudHR5cGVzLmNyZWF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImFwcC53b3Jrb3JkZXJzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gXCJhcHAud29ya29yZGVycy5jcmVhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJhcHAuZXZlbnRzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gXCJhcHAuZXZlbnRzLmNyZWF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImFwcC51bml0c1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IFwiYXBwLnVuaXRzLmNyZWF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImFwcC5tYXRlcmlhbHNcIjpcclxuICAgICAgICAgICAgICAgICAgICB1cmwgPSBcImFwcC5tYXRlcmlhbHMuY3JlYXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiYXBwLnNhbGVzY2hhbm5lbHNcIjpcclxuICAgICAgICAgICAgICAgICAgICB1cmwgPSBcImFwcC5zYWxlc2NoYW5uZWxzLmNyZWF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHN0YXRlLmdvKHVybCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmlzQXV0aGVudGljYXRlZCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQXV0aFNlcnZpY2UubG9nb3V0KCk7XHJcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmxvZ2luJyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvcmVDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJHN0YXRlJywgJyRtb21lbnQnLCAnJG1kU2lkZW5hdicsICckbWRNZWRpYScsICdBdXRoU2VydmljZScsIENvcmVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEN1c3RvbWVyQ3JlYXRlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBUb2FzdFNlcnZpY2UsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5jcmVhdGVDdXN0b21lciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi5jdXN0b21lcik7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGMgPSBzZWxmLmN1c3RvbWVyO1xyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnY3VzdG9tZXInKS5wb3N0KGMpLnRoZW4oZnVuY3Rpb24oZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyRzdGF0ZS5nbygnYXBwLmN1c3RvbWVycy5kZXRhaWwnLCB7J2N1c3RvbWVySWQnOiBkLm5ld0lkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5jdXN0b21lcnMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBjcmVhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0N1c3RvbWVyQ3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCBDdXN0b21lckNyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gQ3VzdG9tZXJEZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0Q3VzdG9tZXIoc2VsZiwgJHN0YXRlUGFyYW1zLmN1c3RvbWVySWQpO1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZUN1c3RvbWVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jdXN0b21lci5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5jdXN0b21lcnNcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVDdXN0b21lciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuY3VzdG9tZXIucmVtb3ZlKCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGRlbGV0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAuY3VzdG9tZXJzXCIpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgRGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zaG93RGVsZXRlQ29uZmlybSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZyA9IERpYWxvZ1NlcnZpY2UuY29uZmlybShldiwgJ0RlbGV0ZSBjdXN0b21lcj8nLCAnVGhpcyB3aWxsIGFsc28gZGVsZXRlIGFueSB3b3JrIG9yZGVycyBhc3NvY2lhdGVkIHdpdGggdGhpcyBjdXN0b21lcicpO1xyXG4gICAgICAgICAgICBkaWFsb2cudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5kZWxldGVDdXN0b21lcigpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDdXN0b21lckRldGFpbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdUb2FzdFNlcnZpY2UnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsICckc3RhdGVQYXJhbXMnLCBDdXN0b21lckRldGFpbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gQ3VzdG9tZXJDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbEN1c3RvbWVycyhzZWxmKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0N1c3RvbWVyQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgQ3VzdG9tZXJDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEV2ZW50Q3JlYXRlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYuZXZlbnQgPSB7fTtcclxuXHJcbiAgICAgICAgc2VsZi5jcmVhdGVFdmVudCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi5ldmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGUgPSBzZWxmLmV2ZW50O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJGVycm9yKTtcclxuXHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ2V2ZW50JykucG9zdChlKS50aGVuKGZ1bmN0aW9uKGUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ldmVudHMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFdmVudENyZWF0ZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCBFdmVudENyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gRXZlbnREZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgJHN0YXRlUGFyYW1zLCBUb2FzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLnNlbGVjdGVkUHJvZHVjdCA9IFwiXCI7XHJcbiAgICAgICAgc2VsZi5zZWxlY3RlZFF1YW50aXR5ID0gMDtcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEV2ZW50KHNlbGYsICRzdGF0ZVBhcmFtcy5ldmVudElkKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVFdmVudCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vUmVzdFNlcnZpY2UudXBkYXRlUHJvZHVjdChzZWxmLCBzZWxmLnByb2R1Y3QuaWQpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5ldmVudC5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwidXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5ldmVudHNcIik7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFkZFByb2R1Y3QgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnNlbGVjdGVkUHJvZHVjdCk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLmV2ZW50LmV2ZW50X3Byb2R1Y3RzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgZXZlbnRfaWQ6IHNlbGYuZXZlbnQuaWQsXHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBzZWxmLnNlbGVjdGVkUHJvZHVjdC5pZCxcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiBzZWxmLnNlbGVjdGVkUXVhbnRpdHksXHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0OiBzZWxmLnNlbGVjdGVkUHJvZHVjdFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRQcm9kdWN0ID0gXCJcIjtcclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFF1YW50aXR5ID0gMDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVByb2R1Y3QgPSBmdW5jdGlvbihlLCBwcm9kdWN0SWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXhUb1JlbW92ZTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYuZXZlbnQuZXZlbnRfcHJvZHVjdHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHByb2R1Y3RJZCA9PSBzZWxmLmV2ZW50LmV2ZW50X3Byb2R1Y3RzW2ldLnByb2R1Y3RfaWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhUb1JlbW92ZSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGluZGV4VG9SZW1vdmUpO1xyXG4gICAgICAgICAgICBzZWxmLmV2ZW50LmV2ZW50X3Byb2R1Y3RzLnNwbGljZShpbmRleFRvUmVtb3ZlLCAxKTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZUV2ZW50ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5ldmVudC5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGVlbHRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5ldmVudHNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBEZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNob3dEZWxldGVDb25maXJtID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGV2LCAnRGVsZXRlIGV2ZW50PycsICcnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlRXZlbnQoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRXZlbnREZXRhaWxDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgJ1RvYXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgRXZlbnREZXRhaWxDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEV2ZW50Q29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxFdmVudHMoc2VsZik7XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0V2ZW50Q29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgRXZlbnRDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEZvb3RlckNvbnRyb2xsZXIoJG1vbWVudClcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5jdXJyZW50WWVhciA9ICRtb21lbnQoKS5mb3JtYXQoJ1lZWVknKTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRm9vdGVyQ29udHJvbGxlcicsIFsnJG1vbWVudCcsIEZvb3RlckNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gSGVhZGVyQ29udHJvbGxlcigkYXV0aCwgJG1vbWVudClcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYudG9kYXlzRGF0ZSA9ICRtb21lbnQoKS5mb3JtYXQoJ2RkZGQsIE1NTU0gRG8gWVlZWScpO1xyXG5cclxuICAgICAgICBzZWxmLmlzQXV0aGVudGljYXRlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGF1dGguaXNBdXRoZW50aWNhdGVkKCk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSGVhZGVyQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJG1vbWVudCcsIEhlYWRlckNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBMYW5kaW5nQ29udHJvbGxlcigkc3RhdGUpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMYW5kaW5nQ29udHJvbGxlcicsIFsnJHN0YXRlJywgTGFuZGluZ0NvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBMb2dpbkNvbnRyb2xsZXIoJHN0YXRlLCAkc2NvcGUsICRjb29raWVzLCBEaWFsb2dTZXJ2aWNlLCBBdXRoU2VydmljZSwgRm9jdXNTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmVtYWlsID0gJyc7XHJcbiAgICAgICAgc2VsZi5wYXNzd29yZCA9ICcnO1xyXG5cclxuICAgICAgICBpZigkY29va2llcy5nZXQoJ2xvZ2luTmFtZScpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5lbWFpbCA9ICRjb29raWVzLmdldCgnbG9naW5OYW1lJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZGlhbG9nT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvZGlhbG9ncy9kbGdMb2dpbi5odG1sJyxcclxuICAgICAgICAgICAgZXNjYXBlVG9DbG9zZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uIERpYWxvZ0NvbnRyb2xsZXIoJHNjb3BlLCAkbWREaWFsb2cpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jb25maXJtRGlhbG9nID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYuZW1haWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNlbGYuZW1haWwgIT09ICcnICYmIHNlbGYucGFzc3dvcmQgIT09ICcnKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQXV0aFNlcnZpY2UubG9naW4oc2VsZi5lbWFpbCwgc2VsZi5wYXNzd29yZCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdMb2dpbiBzdWNjZXNzJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRvZGF5ID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFyIGNvb2tpZUV4cGlyeSA9IG5ldyBEYXRlKHRvZGF5LmdldFllYXIoKSArIDEsIHRvZGF5LmdldE1vbnRoKCksIHRvZGF5LmdldERheSgpLCAwLCAwLCAwLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb29raWVFeHBpcnkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29va2llRXhwaXJ5LnNldEZ1bGxZZWFyKGNvb2tpZUV4cGlyeS5nZXRGdWxsWWVhcigpICsgMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGNvb2tpZXMucHV0KCdsb2dpbk5hbWUnLCBzZWxmLmVtYWlsLCB7IGV4cGlyZXM6IGNvb2tpZUV4cGlyeSB9KTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLnByb2R1Y3RzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0Vycm9yIGxvZ2dpbmcgaW4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2NvcGU6ICRzY29wZS4kbmV3KClcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21DdXN0b20oZGlhbG9nT3B0aW9ucyk7XHJcblxyXG4gICAgICAgIEZvY3VzU2VydmljZSgnZm9jdXNNZScpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTG9naW5Db250cm9sbGVyJywgWyckc3RhdGUnLCAnJHNjb3BlJywgJyRjb29raWVzJywgJ0RpYWxvZ1NlcnZpY2UnLCAnQXV0aFNlcnZpY2UnLCAnRm9jdXNTZXJ2aWNlJywgTG9naW5Db250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIE1hdGVyaWFsQ3JlYXRlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBUb2FzdFNlcnZpY2UsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgVmFsaWRhdGlvblNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFVuaXRzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldE1hdGVyaWFsQWxsVHlwZXMoc2VsZik7XHJcblxyXG4gICAgICAgIHNlbGYuZGVjaW1hbFJlZ2V4ID0gVmFsaWRhdGlvblNlcnZpY2UuZGVjaW1hbFJlZ2V4KCk7XHJcblxyXG4gICAgICAgIHNlbGYuY3JlYXRlTWF0ZXJpYWwgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmZvcm0xLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gc2VsZi5mb3JtMS4kdmFsaWQ7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaXNWYWxpZCk7XHJcblxyXG4gICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYubWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBtID0gc2VsZi5tYXRlcmlhbDtcclxuXHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ21hdGVyaWFsJykucG9zdChtKS50aGVuKGZ1bmN0aW9uKGQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8kc3RhdGUuZ28oJ2FwcC5jdXN0b21lcnMuZGV0YWlsJywgeydjdXN0b21lcklkJzogZC5uZXdJZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAubWF0ZXJpYWxzJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgY3JlYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTWF0ZXJpYWxDcmVhdGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJ1ZhbGlkYXRpb25TZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIE1hdGVyaWFsQ3JlYXRlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBNYXRlcmlhbERldGFpbENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgVG9hc3RTZXJ2aWNlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UsIFZhbGlkYXRpb25TZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxVbml0cyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRNYXRlcmlhbEFsbFR5cGVzKHNlbGYpO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0TWF0ZXJpYWwoc2VsZiwgJHN0YXRlUGFyYW1zLm1hdGVyaWFsSWQpO1xyXG5cclxuICAgICAgICBzZWxmLmRlY2ltYWxSZWdleCA9IFZhbGlkYXRpb25TZXJ2aWNlLmRlY2ltYWxSZWdleCgpO1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZU1hdGVyaWFsID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5tYXRlcmlhbC5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5tYXRlcmlhbHNcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVNYXRlcmlhbCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYubWF0ZXJpYWwucmVtb3ZlKCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGRlbGV0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAubWF0ZXJpYWxzXCIpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgRGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2hvd0RlbGV0ZUNvbmZpcm0gPSBmdW5jdGlvbihldilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZXYsICdEZWxldGUgbWF0ZXJpYWw/JywgJ1RoaXMgd2lsbCBhbHNvIHJlbW92ZSB0aGUgbWF0ZXJpYWwgZnJvbSBhbnkgcHJvZHVjdHMgdXNpbmcgaXQnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlTWF0ZXJpYWwoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTWF0ZXJpYWxEZXRhaWxDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJ0RpYWxvZ1NlcnZpY2UnLCAnVmFsaWRhdGlvblNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgTWF0ZXJpYWxEZXRhaWxDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIE1hdGVyaWFsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxNYXRlcmlhbHMoc2VsZik7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdNYXRlcmlhbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsIE1hdGVyaWFsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBNYXRlcmlhbFNldENvbnRyb2xsZXIoJHN0YXRlLCBSZXN0U2VydmljZSwgR3VpZFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UsIG15Q29uZmlnKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLnNlbGVjdGVkTWF0ZXJpYWwgPSAnJztcclxuICAgICAgICAvL3NlbGYuc2VsZWN0ZWRRdWFudGl0eSA9IDA7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKG15Q29uZmlnLm1hdGVyaWFsU2V0c0xTS2V5KTtcclxuXHJcbiAgICAgICAgaWYobG9jYWxTdG9yYWdlLmdldEl0ZW0obXlDb25maWcubWF0ZXJpYWxTZXRzTFNLZXkpICE9PSBudWxsICYmIGxvY2FsU3RvcmFnZS5nZXRJdGVtKG15Q29uZmlnLm1hdGVyaWFsU2V0c0xTS2V5KSAhPT0gJycpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmV4aXN0aW5nU2V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0obXlDb25maWcubWF0ZXJpYWxTZXRzTFNLZXkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5leGlzdGluZ1NldHMgPSBbXTtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obXlDb25maWcubWF0ZXJpYWxTZXRzTFNLZXksIEpTT04uc3RyaW5naWZ5KHNlbGYuZXhpc3RpbmdTZXRzKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0U2V0T2JqZWN0KCk7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbE1hdGVyaWFscyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi5jcmVhdGVTZXQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLnNldC5pZCA9IEd1aWRTZXJ2aWNlLm5ld0d1aWQoKTtcclxuICAgICAgICAgICAgc2VsZi5leGlzdGluZ1NldHMucHVzaChzZWxmLnNldCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc2V0KTtcclxuXHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG15Q29uZmlnLm1hdGVyaWFsU2V0c0xTS2V5LCBKU09OLnN0cmluZ2lmeShzZWxmLmV4aXN0aW5nU2V0cykpO1xyXG5cclxuICAgICAgICAgICAgaW5pdFNldE9iamVjdCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlU2V0ID0gZnVuY3Rpb24oZSwgc2V0SWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGUsICdEZWxldGUgbWF0ZXJpYWwgc2V0PycsICcnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXhUb1JlbW92ZTtcclxuICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzZWxmLmV4aXN0aW5nU2V0cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihzZXRJZCA9PSBzZWxmLmV4aXN0aW5nU2V0c1tpXS5pZClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4VG9SZW1vdmUgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi5leGlzdGluZ1NldHMuc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5leGlzdGluZ1NldHMubGVuZ3RoID09PSAwKSB7IGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKG15Q29uZmlnLm1hdGVyaWFsU2V0c0xTS2V5KTsgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG15Q29uZmlnLm1hdGVyaWFsU2V0c0xTS2V5LCBzZWxmLmV4aXN0aW5nU2V0cyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZU1hdGVyaWFsID0gZnVuY3Rpb24oZSwgbWF0ZXJpYWxJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleFRvUmVtb3ZlO1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgc2VsZi5zZXQucHJvZHVjdF9tYXRlcmlhbHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKG1hdGVyaWFsSWQgPT0gc2VsZi5zZXQucHJvZHVjdF9tYXRlcmlhbHNbaV0ubWF0ZXJpYWxfaWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhUb1JlbW92ZSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYuc2V0LnByb2R1Y3RfbWF0ZXJpYWxzLnNwbGljZShpbmRleFRvUmVtb3ZlLCAxKTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFkZE1hdGVyaWFsID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5zZWxlY3RlZE1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc2V0LnByb2R1Y3RfbWF0ZXJpYWxzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWxfaWQ6IHNlbGYuc2VsZWN0ZWRNYXRlcmlhbC5pZCxcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiBzZWxmLnNlbGVjdGVkUXVhbnRpdHksXHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbDogc2VsZi5zZWxlY3RlZE1hdGVyaWFsXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZE1hdGVyaWFsID0gJyc7XHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRRdWFudGl0eSA9IG51bGw7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdFNldE9iamVjdCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLnNldCA9IHt9O1xyXG4gICAgICAgICAgICBzZWxmLnNldC5pZCA9ICcnO1xyXG4gICAgICAgICAgICBzZWxmLnNldC5uYW1lID0gJyc7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0LnByb2R1Y3RfbWF0ZXJpYWxzID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTWF0ZXJpYWxTZXRDb250cm9sbGVyJywgWyckc3RhdGUnLCAnUmVzdFNlcnZpY2UnLCAnR3VpZFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsICdteUNvbmZpZycsIE1hdGVyaWFsU2V0Q29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBNYXRlcmlhbENoZWNrbGlzdENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5jaGVja2xpc3Rtb2RlID0gJ3RoaXN3ZWVrJztcclxuICAgICAgICBzZWxmLmNoZWNrbGlzdF9wcm9kdWN0cyA9IFtdO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuXHJcblxyXG4gICAgICAgIHNlbGYuYWRkUHJvZHVjdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc2VsZWN0ZWRQcm9kdWN0KTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYuY2hlY2tsaXN0X3Byb2R1Y3RzID09PSB1bmRlZmluZWQpIHsgc2VsZi5jaGVja2xpc3RfcHJvZHVjdHMgPSBbXTsgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5jaGVja2xpc3RfcHJvZHVjdHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBzZWxmLnNlbGVjdGVkUHJvZHVjdC5pZCxcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiBzZWxmLnNlbGVjdGVkUXVhbnRpdHksXHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0OiBzZWxmLnNlbGVjdGVkUHJvZHVjdFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRQcm9kdWN0ID0gXCJcIjtcclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFF1YW50aXR5ID0gXCJcIjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVByb2R1Y3QgPSBmdW5jdGlvbihlLCBwcm9kdWN0SWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXhUb1JlbW92ZTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYuY2hlY2tsaXN0X3Byb2R1Y3RzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihwcm9kdWN0SWQgPT0gc2VsZi5jaGVja2xpc3RfcHJvZHVjdHNbaV0ucHJvZHVjdF9pZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleFRvUmVtb3ZlID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5jaGVja2xpc3RfcHJvZHVjdHMuc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZ2VuZXJhdGVDaGVja2xpc3QgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgcmVwb3J0UGFyYW1zID0ge307XHJcbiAgICAgICAgICAgIHJlcG9ydFBhcmFtcy5tb2RlID0gc2VsZi5jaGVja2xpc3Rtb2RlO1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoKHNlbGYuY2hlY2tsaXN0bW9kZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAndGhpc3dlZWsnOlxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ2RhdGUnOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlcG9ydFBhcmFtcy5zdGFydF9kYXRlID0gc2VsZi5zdGFydF9kYXRlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcG9ydFBhcmFtcy5lbmRfZGF0ZSA9IHNlbGYuZW5kX2RhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ3Byb2R1Y3RzJzpcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnByb2R1Y3RzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYuY2hlY2tsaXN0X3Byb2R1Y3RzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9uZSA9IHNlbGYuY2hlY2tsaXN0X3Byb2R1Y3RzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnByb2R1Y3RzLnB1c2goe2lkOiBvbmUucHJvZHVjdF9pZCwgcXVhbnRpdHk6IG9uZS5xdWFudGl0eX0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdyZXBvcnRzL2dldE1hdGVyaWFsQ2hlY2tsaXN0JykucG9zdCh7ICdyZXBvcnRQYXJhbXMnOiByZXBvcnRQYXJhbXN9KS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucmVzdWx0cyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYucmVzdWx0c1swXSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gRXJyb3JcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnJlcG9ydCA9IFtdO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdNYXRlcmlhbENoZWNrbGlzdENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsIE1hdGVyaWFsQ2hlY2tsaXN0Q29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuXHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUGF5bWVudFR5cGVDcmVhdGVDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZVBheW1lbnRUeXBlID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlzVmFsaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLnBheW1lbnR0eXBlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHNlbGYucGF5bWVudHR5cGU7XHJcblxyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdwYXltZW50dHlwZScpLnBvc3QoYykudGhlbihmdW5jdGlvbihkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucGF5bWVudHR5cGVzJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgY3JlYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQYXltZW50VHlwZUNyZWF0ZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdUb2FzdFNlcnZpY2UnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgUGF5bWVudFR5cGVDcmVhdGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFBheW1lbnRUeXBlRGV0YWlsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBUb2FzdFNlcnZpY2UsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgRGlhbG9nU2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldFBheW1lbnRUeXBlKHNlbGYsICRzdGF0ZVBhcmFtcy5wYXltZW50VHlwZUlkKTtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVQYXltZW50VHlwZSA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucGF5bWVudHR5cGUucHV0KCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgdXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAucGF5bWVudHR5cGVzXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVBheW1lbnRUeXBlID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5wYXltZW50dHlwZS5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5wYXltZW50dHlwZXNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBEZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNob3dEZWxldGVDb25maXJtID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGV2LCAnRGVsZXRlIHBheW1lbnQgdHlwZT8nLCAnJyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZVBheW1lbnRUeXBlKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1BheW1lbnRUeXBlRGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIFBheW1lbnRUeXBlRGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBQYXltZW50VHlwZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUGF5bWVudFR5cGVzKHNlbGYpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUGF5bWVudFR5cGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCBQYXltZW50VHlwZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUHJvZHVjdENyZWF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFRvYXN0U2VydmljZSwgUmVzdFNlcnZpY2UsIFZhbGlkYXRpb25TZXJ2aWNlLCBteUNvbmZpZywgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbE1hdGVyaWFscyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWNpbWFsUmVnZXggPSBWYWxpZGF0aW9uU2VydmljZS5kZWNpbWFsUmVnZXgoKTtcclxuICAgICAgICBzZWxmLm51bWVyaWNSZWdleCA9IFZhbGlkYXRpb25TZXJ2aWNlLm51bWVyaWNSZWdleCgpO1xyXG4gICAgICAgIHNlbGYuY2JBZGRNYXRlcmlhbHNCeSA9IDI7XHJcblxyXG4gICAgICAgIHNlbGYucHJvZHVjdCA9IHt9O1xyXG4gICAgICAgIHNlbGYucHJvZHVjdC5taW5pbXVtX3N0b2NrID0gMDtcclxuICAgICAgICBzZWxmLnByb2R1Y3QuY3VycmVudF9zdG9jayA9IDA7XHJcblxyXG4gICAgICAgIGlmKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG15Q29uZmlnLm1hdGVyaWFsU2V0c0xTS2V5KSAhPT0gbnVsbCAmJiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShteUNvbmZpZy5tYXRlcmlhbFNldHNMU0tleSkgIT09ICcnKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5tYXRlcmlhbFNldHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKG15Q29uZmlnLm1hdGVyaWFsU2V0c0xTS2V5KSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgc2VsZi5jcmVhdGVQcm9kdWN0ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlzVmFsaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5wcm9kdWN0KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcCA9IHNlbGYucHJvZHVjdDtcclxuXHJcbiAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygkZXJyb3IpO1xyXG5cclxuICAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3Byb2R1Y3QnKS5wb3N0KHApLnRoZW4oZnVuY3Rpb24oZClcclxuICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyRzdGF0ZS5nbygnYXBwLnByb2R1Y3RzLmRldGFpbCcsIHsncHJvZHVjdElkJzogZC5uZXdJZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucHJvZHVjdHMnKTtcclxuICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgY3JlYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5hZGRNYXRlcmlhbCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc2VsZWN0ZWRNYXRlcmlhbCk7XHJcblxyXG4gICAgICAgICAgICBhZGRNYXRlcmlhbChzZWxmLnNlbGVjdGVkTWF0ZXJpYWwuaWQsIHNlbGYuc2VsZWN0ZWRRdWFudGl0eSwgc2VsZi5zZWxlY3RlZE1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRNYXRlcmlhbCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRRdWFudGl0eSA9IDA7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnByb2R1Y3QpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYWRkTWF0ZXJpYWxTZXQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYuc2VsZWN0ZWRNYXRlcmlhbFNldCk7XHJcblxyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgc2VsZi5zZWxlY3RlZE1hdGVyaWFsU2V0LnByb2R1Y3RfbWF0ZXJpYWxzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcG0gPSBzZWxmLnNlbGVjdGVkTWF0ZXJpYWxTZXQucHJvZHVjdF9tYXRlcmlhbHNbaV07XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHBtKTtcclxuICAgICAgICAgICAgICAgIGFkZE1hdGVyaWFsKHBtLm1hdGVyaWFsX2lkLCBwbS5xdWFudGl0eSwgcG0ubWF0ZXJpYWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVNYXRlcmlhbCA9IGZ1bmN0aW9uKGUsIG1hdGVyaWFsSWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXhUb1JlbW92ZTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYobWF0ZXJpYWxJZCA9PSBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHNbaV0ubWF0ZXJpYWxfaWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhUb1JlbW92ZSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaW5kZXhUb1JlbW92ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY3VycmVudENvc3QgPSBwYXJzZUZsb2F0KHNlbGYucHJvZHVjdC5jb3N0KTtcclxuICAgICAgICAgICAgdmFyIGJ0ZXN0ID0gKHBhcnNlRmxvYXQoc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzW2luZGV4VG9SZW1vdmVdLm1hdGVyaWFsLnVuaXRfY29zdCkgKiBwYXJzZUludChzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHNbaW5kZXhUb1JlbW92ZV0ucXVhbnRpdHkpKTtcclxuICAgICAgICAgICAgY3VycmVudENvc3QgLT0gYnRlc3Q7XHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5jb3N0ID0gY3VycmVudENvc3Q7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMuc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZE1hdGVyaWFsKG1hdGVyaWFsSWQsIHF1YW50aXR5LCBtYXRlcmlhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscyA9PT0gdW5kZWZpbmVkKSB7IHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscyA9IFtdOyB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbF9pZDogbWF0ZXJpYWxJZCxcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiBxdWFudGl0eSxcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsOiBtYXRlcmlhbFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYucHJvZHVjdC5jb3N0ID09PSB1bmRlZmluZWQgfHwgc2VsZi5wcm9kdWN0LmNvc3QgPT09IG51bGwpIHsgc2VsZi5wcm9kdWN0LmNvc3QgPSAwOyB9XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50Q29zdCA9IHBhcnNlRmxvYXQoc2VsZi5wcm9kdWN0LmNvc3QpO1xyXG4gICAgICAgICAgICB2YXIgYnRlc3QgPSAocGFyc2VGbG9hdChtYXRlcmlhbC51bml0X2Nvc3QpICogcGFyc2VGbG9hdChxdWFudGl0eSkpO1xyXG4gICAgICAgICAgICBjdXJyZW50Q29zdCArPSBidGVzdDtcclxuICAgICAgICAgICAgc2VsZi5wcm9kdWN0LmNvc3QgPSBjdXJyZW50Q29zdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQcm9kdWN0Q3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1RvYXN0U2VydmljZScsICdSZXN0U2VydmljZScsICdWYWxpZGF0aW9uU2VydmljZScsICdteUNvbmZpZycsICckc3RhdGVQYXJhbXMnLCBQcm9kdWN0Q3JlYXRlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBQcm9kdWN0RGV0YWlsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcywgVG9hc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCBWYWxpZGF0aW9uU2VydmljZSwgbXlDb25maWcpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsTWF0ZXJpYWxzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldFByb2R1Y3Qoc2VsZiwgJHN0YXRlUGFyYW1zLnByb2R1Y3RJZCk7XHJcblxyXG4gICAgICAgIHNlbGYuZGVjaW1hbFJlZ2V4ID0gVmFsaWRhdGlvblNlcnZpY2UuZGVjaW1hbFJlZ2V4KCk7XHJcbiAgICAgICAgc2VsZi5udW1lcmljUmVnZXggPSBWYWxpZGF0aW9uU2VydmljZS5udW1lcmljUmVnZXgoKTtcclxuICAgICAgICBzZWxmLmNiQWRkTWF0ZXJpYWxzQnkgPSAyO1xyXG5cclxuICAgICAgICBpZihsb2NhbFN0b3JhZ2UuZ2V0SXRlbShteUNvbmZpZy5tYXRlcmlhbFNldHNMU0tleSkgIT09IG51bGwgJiYgbG9jYWxTdG9yYWdlLmdldEl0ZW0obXlDb25maWcubWF0ZXJpYWxTZXRzTFNLZXkpICE9PSAnJylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYubWF0ZXJpYWxTZXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShteUNvbmZpZy5tYXRlcmlhbFNldHNMU0tleSkpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlUHJvZHVjdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vUmVzdFNlcnZpY2UudXBkYXRlUHJvZHVjdChzZWxmLCBzZWxmLnByb2R1Y3QuaWQpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wcm9kdWN0LnB1dCgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJ1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IHVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLnByb2R1Y3RzXCIpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVQcm9kdWN0ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5wcm9kdWN0LnJlbW92ZSgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRlZWx0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBkZWxldGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLnByb2R1Y3RzXCIpO1xyXG5cclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGRlbGV0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBkZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zaG93RGVsZXRlQ29uZmlybSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZyA9IERpYWxvZ1NlcnZpY2UuY29uZmlybShldiwgJ0RlbGV0ZSBwcm9kdWN0PycsICdUaGlzIHdpbGwgYWxzbyBkZWxldGUgYW55IHdvcmsgb3JkZXIgb3IgZXZlbnQgc3RvY2sgbGV2ZWxzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHByb2R1Y3QnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZVByb2R1Y3QoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYWRkTWF0ZXJpYWwgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnNlbGVjdGVkTWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICAgICAgYWRkTWF0ZXJpYWwoc2VsZi5zZWxlY3RlZE1hdGVyaWFsLmlkLCBzZWxmLnNlbGVjdGVkUXVhbnRpdHksIHNlbGYuc2VsZWN0ZWRNYXRlcmlhbCk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkTWF0ZXJpYWwgPSBcIlwiO1xyXG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkUXVhbnRpdHkgPSAwO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFkZE1hdGVyaWFsU2V0ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLnNlbGVjdGVkTWF0ZXJpYWxTZXQpO1xyXG5cclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYuc2VsZWN0ZWRNYXRlcmlhbFNldC5wcm9kdWN0X21hdGVyaWFscy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBtID0gc2VsZi5zZWxlY3RlZE1hdGVyaWFsU2V0LnByb2R1Y3RfbWF0ZXJpYWxzW2ldO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhwbSk7XHJcbiAgICAgICAgICAgICAgICBhZGRNYXRlcmlhbChwbS5tYXRlcmlhbF9pZCwgcG0ucXVhbnRpdHksIHBtLm1hdGVyaWFsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlTWF0ZXJpYWwgPSBmdW5jdGlvbihlLCBtYXRlcmlhbElkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4VG9SZW1vdmU7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKG1hdGVyaWFsSWQgPT0gc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzW2ldLm1hdGVyaWFsX2lkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4VG9SZW1vdmUgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpbmRleFRvUmVtb3ZlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50Q29zdCA9IHBhcnNlRmxvYXQoc2VsZi5wcm9kdWN0LmNvc3QpO1xyXG4gICAgICAgICAgICB2YXIgYnRlc3QgPSAocGFyc2VGbG9hdChzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHNbaW5kZXhUb1JlbW92ZV0ubWF0ZXJpYWwudW5pdF9jb3N0KSAqIHBhcnNlSW50KHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFsc1tpbmRleFRvUmVtb3ZlXS5xdWFudGl0eSkpO1xyXG4gICAgICAgICAgICBjdXJyZW50Q29zdCAtPSBidGVzdDtcclxuICAgICAgICAgICAgc2VsZi5wcm9kdWN0LmNvc3QgPSBjdXJyZW50Q29zdDtcclxuXHJcblxyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMuc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZE1hdGVyaWFsKG1hdGVyaWFsSWQsIHF1YW50aXR5LCBtYXRlcmlhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscyA9PT0gdW5kZWZpbmVkKSB7IHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscyA9IFtdOyB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBzZWxmLnByb2R1Y3QuaWQsXHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbF9pZDogbWF0ZXJpYWxJZCxcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiBxdWFudGl0eSxcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsOiBtYXRlcmlhbFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYucHJvZHVjdC5jb3N0ID09PSB1bmRlZmluZWQgfHwgc2VsZi5wcm9kdWN0LmNvc3QgPT09IG51bGwpIHsgc2VsZi5wcm9kdWN0LmNvc3QgPSAwOyB9XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50Q29zdCA9IHBhcnNlRmxvYXQoc2VsZi5wcm9kdWN0LmNvc3QpO1xyXG4gICAgICAgICAgICB2YXIgYnRlc3QgPSAocGFyc2VGbG9hdChtYXRlcmlhbC51bml0X2Nvc3QpICogcGFyc2VGbG9hdChxdWFudGl0eSkpO1xyXG4gICAgICAgICAgICBjdXJyZW50Q29zdCArPSBidGVzdDtcclxuICAgICAgICAgICAgc2VsZi5wcm9kdWN0LmNvc3QgPSBjdXJyZW50Q29zdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1Byb2R1Y3REZXRhaWxDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgJ1RvYXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgJ1ZhbGlkYXRpb25TZXJ2aWNlJywgJ215Q29uZmlnJywgUHJvZHVjdERldGFpbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUHJvZHVjdENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmZpbHRlclR5cGUgPSBcIlwiO1xyXG4gICAgICAgIHNlbGYuZmlsdGVyT3BlcmF0b3IgPSBcIlwiO1xyXG4gICAgICAgIHNlbGYuZmlsdGVyVmFsdWUgPSBcIlwiO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi5hcHBseVByb2R1Y3RGaWx0ZXIgPSBmdW5jdGlvbihwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoc2VsZi5maWx0ZXJUeXBlICE9PSBcIlwiICYmIHNlbGYuZmlsdGVyT3BlcmF0b3IgIT09IFwiXCIgJiYgc2VsZi5maWx0ZXJWYWx1ZSAhPT0gXCJcIilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJoaVwiKTtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eVRvRmlsdGVyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHN3aXRjaChzZWxmLmZpbHRlclR5cGUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInN0b2NrXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VG9GaWx0ZXIgPSBwYXJzZUludChwLmN1cnJlbnRfc3RvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicHJpY2VcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlUb0ZpbHRlciA9IHBhcnNlRmxvYXQocC5wcmljZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJjb3N0XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VG9GaWx0ZXIgPSBwYXJzZUZsb2F0KHAuY29zdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmKHNlbGYuZmlsdGVyT3BlcmF0b3IgPT09IFwiPVwiKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVRvRmlsdGVyID09IHBhcnNlRmxvYXQoc2VsZi5maWx0ZXJWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHNlbGYuZmlsdGVyT3BlcmF0b3IgPT09IFwiPlwiKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVRvRmlsdGVyID4gcGFyc2VGbG9hdChzZWxmLmZpbHRlclZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYoc2VsZi5maWx0ZXJPcGVyYXRvciA9PT0gXCI+PVwiKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVRvRmlsdGVyID49IHNlbGYuZmlsdGVyVmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHNlbGYuZmlsdGVyT3BlcmF0b3IgPT09IFwiPFwiKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVRvRmlsdGVyIDwgcGFyc2VGbG9hdChzZWxmLmZpbHRlclZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYoc2VsZi5maWx0ZXJPcGVyYXRvciA9PT0gXCI8PVwiKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVRvRmlsdGVyIDw9IHBhcnNlRmxvYXQoc2VsZi5maWx0ZXJWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1Byb2R1Y3RDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCBQcm9kdWN0Q29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBQdXJjaGFzZU9yZGVyQ3JlYXRlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCAkc2NvcGUsICRtb21lbnQsIFJlc3Rhbmd1bGFyLCBUb2FzdFNlcnZpY2UsIFJlc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCBWYWxpZGF0aW9uU2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsQ3VzdG9tZXJzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFByb2R1Y3RzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFBheW1lbnRUeXBlcyhzZWxmKTtcclxuICAgICAgICAvL1Jlc3RTZXJ2aWNlLmdldEZ1bGx5Qm9va2VkRGF5cyhzZWxmKTtcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsU2FsZXNDaGFubmVscygpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuc2FsZXNjaGFubmVscyA9IGRhdGE7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHNlbGYucHVyY2hhc2VvcmRlciA9IHt9O1xyXG4gICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5hbW91bnRfcGFpZCA9IDA7XHJcbiAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLmRpc2NvdW50ID0gMDtcclxuICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSAwO1xyXG5cclxuICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIuZGVsaXZlcnkgPSAwO1xyXG4gICAgICAgIHNlbGYuZGVsaXZlcnlfY2hhcmdlID0gMDtcclxuXHJcbiAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnNoaXBwaW5nID0gMDtcclxuICAgICAgICBzZWxmLnNoaXBwaW5nX2NoYXJnZSA9IDA7XHJcblxyXG4gICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5zdXBwcmVzc3dvcmtvcmRlciA9IDA7XHJcblxyXG4gICAgICAgIHZhciBvcmlnaW5hbFRvdGFsID0gMDtcclxuICAgICAgICB2YXIgb3JpZ2luYWxTaGlwcGluZ0NoYXJnZSA9IDA7XHJcblxyXG4gICAgICAgIHNlbGYuYWRkUHJvZHVjdElubGluZSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZ09wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaWFsb2dzL2RsZ0NyZWF0ZVByb2R1Y3RJbmxpbmUuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBlc2NhcGVUb0Nsb3NlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0RXZlbnQ6IGV2LFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gRGlhbG9nQ29udHJvbGxlcigkc2NvcGUsICRtZERpYWxvZylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGVjaW1hbFJlZ2V4ID0gVmFsaWRhdGlvblNlcnZpY2UuZGVjaW1hbFJlZ2V4KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jb25maXJtRGlhbG9nID0gZnVuY3Rpb24gKClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjY2VwdGVkJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSAkc2NvcGUuZm9ybTEuJHZhbGlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihpc1ZhbGlkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcCA9ICRzY29wZS5jdHJsUHJvZHVjdENyZWF0ZUlubGluZS5wcm9kdWN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcC5jb3N0ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHAubWluaW11bV9zdG9jayA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwLmN1cnJlbnRfc3RvY2sgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXN0U2VydmljZS5hZGRQcm9kdWN0KHApLnRoZW4oZnVuY3Rpb24oZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGQubmV3SWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb3AgPSB7aWQ6IGQubmV3SWQsIG5hbWU6IHAubmFtZSwgcHJpY2U6IHAucHJpY2V9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucHJvZHVjdHMucHVzaChwb3ApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRQcm9kdWN0ID0gcG9wO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiUHJvZHVjdCBTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGNyZWF0aW5nIHByb2R1Y3RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNhbmNlbERpYWxvZyA9IGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2NhbmNlbGxlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2NvcGU6ICRzY29wZS4kbmV3KClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbUN1c3RvbShkaWFsb2dPcHRpb25zKTtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5hZGRDdXN0b21lcklubGluZSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZ09wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaWFsb2dzL2RsZ0NyZWF0ZUN1c3RvbWVySW5saW5lLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgZXNjYXBlVG9DbG9zZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRhcmdldEV2ZW50OiBldixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uIERpYWxvZ0NvbnRyb2xsZXIoJHNjb3BlLCAkbWREaWFsb2cpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbmZpcm1EaWFsb2cgPSBmdW5jdGlvbiAoKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnYWNjZXB0ZWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNWYWxpZCA9ICRzY29wZS5mb3JtMS4kdmFsaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjID0gJHNjb3BlLmN0cmxDdXN0b21lckNyZWF0ZUlubGluZS5jdXN0b21lcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc3RTZXJ2aWNlLmFkZEN1c3RvbWVyKGMpLnRoZW4oZnVuY3Rpb24oZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkLm5ld0lkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmN1c3RvbWVycy5wdXNoKHtpZDogZC5uZXdJZCwgZmlyc3RfbmFtZTogYy5maXJzdF9uYW1lLCBsYXN0X25hbWU6IGMubGFzdF9uYW1lIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5jdXN0b21lcl9pZCA9IGQubmV3SWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJDdXN0b21lciBTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGNyZWF0aW5nIGN1c3RvbWVyXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jYW5jZWxEaWFsb2cgPSBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdjYW5jZWxsZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNjb3BlOiAkc2NvcGUuJG5ldygpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21DdXN0b20oZGlhbG9nT3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5vbmx5T3BlbkRheXMgPSBmdW5jdGlvbihkYXRlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBpZighJG1vbWVudChkYXRlKS5pc0JlZm9yZSgpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGUpO1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYuYm9va2VkRGF5cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYuYm9va2VkRGF5c1tpXS5zdGFydF9kYXRlKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYuYm9va2VkRGF5c1tpXS5zdGFydF9kYXRlKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCRtb21lbnQoc2VsZi5ib29rZWREYXlzW2ldLnN0YXJ0X2RhdGUpKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihtb21lbnQoZGF0ZSkuaXNTYW1lKHNlbGYuYm9va2VkRGF5c1tpXS5zdGFydF9kYXRlKSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5jcmVhdGVQdXJjaGFzZU9yZGVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5wdXJjaGFzZW9yZGVyKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwID0gc2VsZi5wdXJjaGFzZW9yZGVyO1xyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygkZXJyb3IpO1xyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3B1cmNoYXNlb3JkZXInKS5wb3N0KHApLnRoZW4oZnVuY3Rpb24oZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgICAgICAvLyRzdGF0ZS5nbygnYXBwLnByb2R1Y3RzLmRldGFpbCcsIHsncHJvZHVjdElkJzogZC5uZXdJZH0pO1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgIGlmKGQubmV3V29JZHMgJiYgZC5uZXdXb0lkcy5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsaW5rT2JqID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgbGlua09iai5wdXNoKHtMaW5rVGV4dDogJ1ZpZXcgQWxsIFBPcycsIExpbmtVcmw6ICRzdGF0ZS5ocmVmKCdhcHAucHVyY2hhc2VvcmRlcnMnKX0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmtPYmoucHVzaCh7TGlua1RleHQ6ICdWaWV3IENyZWF0ZWQgUE8nLCBMaW5rVXJsOiAkc3RhdGUuaHJlZignYXBwLnB1cmNoYXNlb3JkZXJzLmRldGFpbCcsIHtwdXJjaGFzZU9yZGVySWQ6IGQubmV3SWR9KX0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBkLm5ld1dvSWRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlua09iai5wdXNoKHtMaW5rVGV4dDogJ1ZpZXcgV08gIycgKyBkLm5ld1dvSWRzW2ldLCBMaW5rVXJsOiAkc3RhdGUuaHJlZignYXBwLndvcmtvcmRlcnMuZGV0YWlsJywge3dvcmtPcmRlcklkOiBkLm5ld1dvSWRzW2ldfSl9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5saW5rc1RvU2hvdyA9IGxpbmtPYmo7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIERpYWxvZ1NlcnZpY2UuZnJvbVRlbXBsYXRlKG51bGwsICdkbGdMaW5rQ2hvb3NlcicsICRzY29wZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucHVyY2hhc2VvcmRlcnMnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBjcmVhdGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYXBwbHlEaXNjb3VudCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci5kaXNjb3VudCA9PSBudWxsIHx8IHNlbGYucHVyY2hhc2VvcmRlci5kaXNjb3VudCA9PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBvcmlnaW5hbFRvdGFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAmJiBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgIT09IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAmJiBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPiAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkaXNjb3VudGVkID0gb3JpZ2luYWxUb3RhbCAtIHNlbGYucHVyY2hhc2VvcmRlci5kaXNjb3VudDtcclxuICAgICAgICAgICAgICAgICAgICBkaXNjb3VudGVkID49IDAgPyBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBkaXNjb3VudGVkIDogMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYXBwbHlEZWxpdmVyeSA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHNlbGYuZGVsaXZlcnlfY2hhcmdlID09PSAxKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIuZGVsaXZlcnkgPSBkZWxpdmVyeUZlZTtcclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCArPSBkZWxpdmVyeUZlZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5kZWxpdmVyeSA9IDA7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgLT0gZGVsaXZlcnlGZWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFwcGx5U2hpcHBpbmcgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgY29zdE9mU2hpcHBpbmcgPSAwO1xyXG4gICAgICAgICAgICBpZihzZWxmLnNoaXBwaW5nX2NoYXJnZSA9PT0gJ0NETicpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvc3RPZlNoaXBwaW5nID0gc2hpcHBpbmdDYW5hZGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZihzZWxmLnNoaXBwaW5nX2NoYXJnZSA9PT0gJ1VTQScpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvc3RPZlNoaXBwaW5nID0gc2hpcHBpbmdVc2E7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5zaGlwcGluZyA9IGNvc3RPZlNoaXBwaW5nO1xyXG5cclxuICAgICAgICAgICAgaWYoc2VsZi5zaGlwcGluZ19jaGFyZ2UgIT09IG9yaWdpbmFsU2hpcHBpbmdDaGFyZ2UpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCAtPSBvcmlnaW5hbFNoaXBwaW5nQ2hhcmdlO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsICs9IGNvc3RPZlNoaXBwaW5nO1xyXG5cclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsVG90YWwgLT0gb3JpZ2luYWxTaGlwcGluZ0NoYXJnZTtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsVG90YWwgKz0gY29zdE9mU2hpcHBpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG9yaWdpbmFsU2hpcHBpbmdDaGFyZ2UgPSBjb3N0T2ZTaGlwcGluZztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNlbGYuYWRkUHJvZHVjdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc2VsZWN0ZWRQcm9kdWN0KTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cyA9PT0gdW5kZWZpbmVkKSB7IHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cyA9IFtdOyB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBzZWxmLnNlbGVjdGVkUHJvZHVjdC5pZCxcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiBzZWxmLnNlbGVjdGVkUXVhbnRpdHksXHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0OiBzZWxmLnNlbGVjdGVkUHJvZHVjdFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9PT0gdW5kZWZpbmVkIHx8IHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9PT0gbnVsbCkgeyBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSAwOyB9XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50Q29zdCA9IHBhcnNlRmxvYXQoc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsKTtcclxuICAgICAgICAgICAgdmFyIGJ0ZXN0ID0gKHBhcnNlRmxvYXQoc2VsZi5zZWxlY3RlZFByb2R1Y3QucHJpY2UpICogcGFyc2VJbnQoc2VsZi5zZWxlY3RlZFF1YW50aXR5KSk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDb3N0ICs9IGJ0ZXN0O1xyXG4gICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBjdXJyZW50Q29zdDtcclxuICAgICAgICAgICAgb3JpZ2luYWxUb3RhbCA9IGN1cnJlbnRDb3N0O1xyXG5cclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFByb2R1Y3QgPSBcIlwiO1xyXG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkUXVhbnRpdHkgPSAwO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5wdXJjaGFzZW9yZGVyKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVByb2R1Y3QgPSBmdW5jdGlvbihlLCBwcm9kdWN0SWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXhUb1JlbW92ZTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYocHJvZHVjdElkID09IHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0c1tpXS5wcm9kdWN0X2lkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4VG9SZW1vdmUgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGluZGV4VG9SZW1vdmUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRDb3N0ID0gcGFyc2VGbG9hdChzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwpO1xyXG4gICAgICAgICAgICB2YXIgYnRlc3QgPSAocGFyc2VGbG9hdChzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaW5kZXhUb1JlbW92ZV0ucHJvZHVjdC5wcmljZSkgKiBwYXJzZUludChzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaW5kZXhUb1JlbW92ZV0ucXVhbnRpdHkpKTtcclxuICAgICAgICAgICAgY3VycmVudENvc3QgLT0gYnRlc3Q7XHJcbiAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9IGN1cnJlbnRDb3N0O1xyXG4gICAgICAgICAgICBvcmlnaW5hbFRvdGFsID0gY3VycmVudENvc3Q7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMuc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGV0ZXJtaW5lV29ya09yZGVycyA9IGZ1bmN0aW9uKGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5wdXJjaGFzZW9yZGVyLnN1cHByZXNzd29ya29yZGVyID09IDEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSnVzdCBwcm9jZXNzIHRoZSBQTyBhcyBub3JtYWxcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNyZWF0ZVB1cmNoYXNlT3JkZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb2R1Y3RzVG9GdWxmaWxsID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdHNUb0Z1bGZpbGwucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaV0ucHJvZHVjdF9pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaV0ucXVhbnRpdHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3NjaGVkdWxlci9nZXRXb3JrT3JkZXJzJykucG9zdCh7cHJvZHVjdHNUb0Z1bGZpbGw6IHByb2R1Y3RzVG9GdWxmaWxsfSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLndvcmtPcmRlcnNUb0NyZWF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLndvcmtPcmRlcnNUb0NyZWF0ZSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZXJlIGFyZSB3b3Jrb3JkZXJzIG5lZWRlZCBmb3IgdGhpcyBQTywgY29uZmlybSB0aGVpciBjcmVhdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLndvcmtPcmRlcnNUb0NyZWF0ZSA9IGRhdGEud29ya09yZGVyc1RvQ3JlYXRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLndvcmtPcmRlcnMgPSBkYXRhLndvcmtPcmRlcnM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoZSwgJ2RsZ0NvbmZpcm1Xb3JrT3JkZXJzJywgJHNjb3BlKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLndvcmtfb3JkZXJzID0gJHNjb3BlLndvcmtPcmRlcnM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2NvbmZpcm1lZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNyZWF0ZVB1cmNoYXNlT3JkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnY2FuY2VsbGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEp1c3QgcHJvY2VzcyB0aGUgUE8gYXMgbm9ybWFsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNyZWF0ZVB1cmNoYXNlT3JkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1B1cmNoYXNlT3JkZXJDcmVhdGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnJHNjb3BlJywgJyRtb21lbnQnLCAnUmVzdGFuZ3VsYXInLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3RTZXJ2aWNlJywgJ0RpYWxvZ1NlcnZpY2UnLCAnVmFsaWRhdGlvblNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgUHVyY2hhc2VPcmRlckNyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUHVyY2hhc2VPcmRlckRldGFpbENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgJHNjb3BlLCAkbW9tZW50LCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcywgVG9hc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbEN1c3RvbWVycyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQYXltZW50VHlwZXMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0UHVyY2hhc2VPcmRlcihzZWxmLCAkc3RhdGVQYXJhbXMucHVyY2hhc2VPcmRlcklkKTtcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsU2FsZXNDaGFubmVscygpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuc2FsZXNjaGFubmVscyA9IGRhdGE7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciBvcmlnaW5hbFRvdGFsID0gMDtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVQdXJjaGFzZU9yZGVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnB1dCgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwidXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IHVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAucHVyY2hhc2VvcmRlcnNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlUHVyY2hhc2VPcmRlciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWVsdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5wdXJjaGFzZW9yZGVyc1wiKTtcclxuXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBkZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2hvd0RlbGV0ZUNvbmZpcm0gPSBmdW5jdGlvbihldilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZXYsICdEZWxldGUgcHVyY2hhc2Ugb3JkZXI/JywgJycpO1xyXG4gICAgICAgICAgICBkaWFsb2cudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlUHVyY2hhc2VPcmRlcigpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5hcHBseURpc2NvdW50ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoc2VsZi5wdXJjaGFzZW9yZGVyLmRpc2NvdW50ID09IG51bGwgfHwgc2VsZi5wdXJjaGFzZW9yZGVyLmRpc2NvdW50ID09IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9IG9yaWdpbmFsVG90YWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICYmIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCAhPT0gbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgICYmIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA+IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpc2NvdW50ZWQgPSBvcmlnaW5hbFRvdGFsIC0gc2VsZi5wdXJjaGFzZW9yZGVyLmRpc2NvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc2NvdW50ZWQgPj0gMCA/IHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9IGRpc2NvdW50ZWQgOiAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5hZGRQcm9kdWN0ID0gZnVuY3Rpb24oZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc2VsZWN0ZWRQcm9kdWN0KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwb3BPYmogPSB7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBzZWxmLnNlbGVjdGVkUHJvZHVjdC5pZCxcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiBzZWxmLnNlbGVjdGVkUXVhbnRpdHksXHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0OiBzZWxmLnNlbGVjdGVkUHJvZHVjdFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdzY2hlZHVsZXIvZ2V0V29ya09yZGVycycpLnBvc3Qoe3Byb2R1Y3RzVG9GdWxmaWxsOiBbcG9wT2JqXSwgcHVyY2hhc2VPcmRlcklkOiBzZWxmLnB1cmNoYXNlb3JkZXIuaWR9KS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEud29ya09yZGVyc1RvQ3JlYXRlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMgPT09IHVuZGVmaW5lZCkgeyBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMgPSBbXTsgfVxyXG4gICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzLnB1c2gocG9wT2JqKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBSZWNhbGN1bGF0ZSBQTyB0b3RhbFxyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID09PSB1bmRlZmluZWQgfHwgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID09PSBudWxsKSB7IHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9IDA7IH1cclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50Q29zdCA9IHBhcnNlRmxvYXQoc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsKTtcclxuICAgICAgICAgICAgICAgIHZhciBidGVzdCA9IChwYXJzZUZsb2F0KHNlbGYuc2VsZWN0ZWRQcm9kdWN0LnByaWNlKSAqIHBhcnNlSW50KHNlbGYuc2VsZWN0ZWRRdWFudGl0eSkpO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudENvc3QgKz0gYnRlc3Q7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBjdXJyZW50Q29zdDtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsVG90YWwgPSBjdXJyZW50Q29zdDtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkUHJvZHVjdCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkUXVhbnRpdHkgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGRhdGEud29ya09yZGVyc1RvQ3JlYXRlID4gMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBUaGVyZSBhcmUgd29ya29yZGVycyBuZWVkZWQgZm9yIHRoaXMgUE8sIGFsZXJ0IG9mIHRoZWlyIGNyZWF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLndvcmtPcmRlcnNUb0NyZWF0ZSA9IGRhdGEud29ya09yZGVyc1RvQ3JlYXRlO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS53b3JrT3JkZXJzID0gZGF0YS53b3JrT3JkZXJzO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZShlLCAnZGxnQWxlcnRXb3JrT3JkZXJzJywgJHNjb3BlKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjb25maXJtZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBhZGRpbmcgcHJvZHVjdCwgcGxlYXNlIHRyeSBhZ2FpblwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVQcm9kdWN0ID0gZnVuY3Rpb24oZSwgcHJvZHVjdElkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4VG9SZW1vdmU7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHByb2R1Y3RJZCA9PSBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaV0ucHJvZHVjdF9pZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleFRvUmVtb3ZlID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpbmRleFRvUmVtb3ZlKTtcclxuXHJcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnc2NoZWR1bGVyL3Jlc3RvcmVTdG9ja0ZvclByb2R1Y3QnKS5wb3N0KHtwdXJjaGFzZV9vcmRlcl9pZDogc2VsZi5wdXJjaGFzZW9yZGVyLmlkLCBwcm9kdWN0X2lkOiBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaW5kZXhUb1JlbW92ZV0ucHJvZHVjdF9pZH0pLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gUmVjYWxjdWxhdGUgUE8gdG90YWxcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50Q29zdCA9IHBhcnNlRmxvYXQoc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsKTtcclxuICAgICAgICAgICAgICAgIHZhciBidGVzdCA9IChwYXJzZUZsb2F0KHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0c1tpbmRleFRvUmVtb3ZlXS5wcm9kdWN0LnByaWNlKSAqIHBhcnNlSW50KHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0c1tpbmRleFRvUmVtb3ZlXS5xdWFudGl0eSkpO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudENvc3QgLT0gYnRlc3Q7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBjdXJyZW50Q29zdDtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsVG90YWwgPSBjdXJyZW50Q29zdDtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMuc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xyXG5cclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIHVwZGF0aW5nIHN0b2NrLCBwbGVhc2UgdHJ5IGFnYWluXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQdXJjaGFzZU9yZGVyRGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJyRzY29wZScsICckbW9tZW50JywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsICdUb2FzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsIFB1cmNoYXNlT3JkZXJEZXRhaWxDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFB1cmNoYXNlT3JkZXJDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFB1cmNoYXNlT3JkZXJzKHNlbGYpO1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQdXJjaGFzZU9yZGVyQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgUHVyY2hhc2VPcmRlckNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUmVwb3J0Q29udHJvbGxlcigkc2NvcGUsICRhdXRoLCAkc3RhdGUsICRtb21lbnQsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgQ2hhcnRTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5yZXBvcnRQYXJhbXMgPSB7fTtcclxuXHJcbiAgICAgICAgaWYoJHN0YXRlLmlzKCdhcHAucmVwb3J0cy5jdXJyZW50c3RvY2snKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdlbmVyYXRlQ3VycmVudFN0b2NrUmVwb3J0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoJHN0YXRlLmlzKCdhcHAucmVwb3J0cy5zYWxlcycpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2hvd1NhbGVzUmVwb3J0VmlldygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKCRzdGF0ZS5pcygnYXBwLnJlcG9ydHMuc2FsZXNieW1vbnRoJykpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzaG93U2FsZXNSZXBvcnRCeU1vbnRoVmlldygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKCRzdGF0ZS5pcygnYXBwLnJlcG9ydHMuaW5jb21lYnltb250aCcpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2hvd0luY29tZVJlcG9ydEJ5TW9udGhWaWV3KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoJHN0YXRlLmlzKCdhcHAucmVwb3J0cy5wcm9kdWN0cHJvZml0cGVyY2VudHMnKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNob3dQcm9kdWN0UHJvZml0UGVyY2VudHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZigkc3RhdGUuaXMoJ2FwcC5yZXBvcnRzLndlZWt3b3Jrb3JkZXJzJykpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzaG93V2Vla2x5V29ya09yZGVycygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKCRzdGF0ZS5pcygnYXBwLnJlcG9ydHMuYW9zJykpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzaG93QW9zUmVwb3J0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIFJlcG9ydCBob21lXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJHN0YXRlLmlzKCdhcHAucmVwb3J0cycpKTtcclxuICAgICAgICAgICAgc2hvd0Rhc2hib2FyZFdpZGdldHMoKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93UHJvZHVjdFByb2ZpdFBlcmNlbnRzKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENoYXJ0U2VydmljZS5nZXRQcm9kdWN0UHJvZml0UGVyY2VudHMoc2VsZik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93V2Vla2x5V29ya09yZGVycygpXHJcbiAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsV29ya09yZGVyVGFza3MoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYud29ya29yZGVydGFza3MgPSBkYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncmVwb3J0cy9nZXRXZWVrV29ya09yZGVyUmVwb3J0JykuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIE1vcmUgSG9zdGdhdG9yIHNoaXRcclxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3byA9IGRhdGFbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaiA9IDA7IGogPCB3by53b3JrX29yZGVyX3Byb2dyZXNzLmxlbmd0aDsgaisrKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3by53b3JrX29yZGVyX3Byb2dyZXNzW2pdLndvcmtfb3JkZXJfaWQgPSBwYXJzZUludCh3by53b3JrX29yZGVyX3Byb2dyZXNzW2pdLndvcmtfb3JkZXJfaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd28ud29ya19vcmRlcl9wcm9ncmVzc1tqXS53b3JrX29yZGVyX3Rhc2tfaWQgPSBwYXJzZUludCh3by53b3JrX29yZGVyX3Byb2dyZXNzW2pdLndvcmtfb3JkZXJfdGFza19pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi53ZWVrd29ya29yZGVycyA9IGRhdGE7XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZUN1cnJlbnRTdG9ja1JlcG9ydCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdlbmVyYXRlIHN0b2NrIHJlcnBvcnRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93U2FsZXNSZXBvcnRWaWV3KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbEN1c3RvbWVycyhzZWxmKTtcclxuICAgICAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUHJvZHVjdHMoc2VsZik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93RGFzaGJvYXJkV2lkZ2V0cygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDaGFydFNlcnZpY2UuZ2V0VG9wU2VsbGluZ1Byb2R1Y3RzKHNlbGYsICdUb3AgU2VsbGluZyBBbGwgVGltZScpO1xyXG4gICAgICAgICAgICAvL2dldFdvcnN0U2VsbGluZ1Byb2R1Y3RzKHNlbGYpO1xyXG4gICAgICAgICAgICBnZXRPdmVyZHVlUHVyY2hhc2VPcmRlcnMoc2VsZik7XHJcbiAgICAgICAgICAgIGdldE1vbnRobHlJbmNvbWUoc2VsZik7XHJcbiAgICAgICAgICAgIGdldE91dHN0YW5kaW5nUGF5bWVudHMoc2VsZik7XHJcblxyXG4gICAgICAgICAgICBzZWxmLmRheXJlcG9ydHMgPSBbXTtcclxuICAgICAgICAgICAgc2VsZi5kYWlseV9zYWxlc19mcm9tX2RhdGUgPSBtb21lbnQoKS5zdWJ0cmFjdCg3LCAnZGF5cycpLnRvRGF0ZSgpO1xyXG4gICAgICAgICAgICBzZWxmLmRhaWx5X3NhbGVzX3RvX2RhdGUgPSBtb21lbnQoKS50b0RhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNob3dTYWxlc1JlcG9ydEJ5TW9udGhWaWV3KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENoYXJ0U2VydmljZS5nZXRNb250aGx5U2FsZXNSZXBvcnQoc2VsZik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93SW5jb21lUmVwb3J0QnlNb250aFZpZXcoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ2hhcnRTZXJ2aWNlLmdldE1vbnRobHlJbmNvbWVSZXBvcnQoc2VsZik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93QW9zUmVwb3J0KClcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VsZi5nZXRTYWxlc1JlcG9ydCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYucmVwb3J0UGFyYW1zKTtcclxuICAgICAgICAgICAgc2VsZi5wb1RvdGFsID0gMDtcclxuICAgICAgICAgICAgc2VsZi5wb0NvdW50ID0gMDtcclxuXHJcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgncmVwb3J0cy9nZXRTYWxlc1JlcG9ydCcpLnBvc3QoeyAncmVwb3J0UGFyYW1zJzogc2VsZi5yZXBvcnRQYXJhbXN9KS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucmVzdWx0cyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnBvQ291bnQgPSBkYXRhLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYucmVzdWx0c1swXSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gRXJyb3JcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0V29yc3RTZWxsaW5nUHJvZHVjdHMoc2NvcGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3JlcG9ydHMvZ2V0V29yc3RTZWxsaW5nUHJvZHVjdHMnKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYud29yc3RTZWxsaW5nUHJvZHVjdHMgPSBkYXRhO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIEVycm9yXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0T3ZlcmR1ZVB1cmNoYXNlT3JkZXJzKHNjb3BlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdyZXBvcnRzL2dldE92ZXJkdWVQdXJjaGFzZU9yZGVycycpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5vdmVyZHVlUHVyY2hhc2VPcmRlcnMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgLy9zZWxmLnBvQ291bnQgPSBkYXRhLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldE1vbnRobHlJbmNvbWUoc2NvcGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3JlcG9ydHMvZ2V0TW9udGhseVNhbGVzUmVwb3J0JykucG9zdCh7ICdyZXBvcnRQYXJhbXMnOiB7fX0pLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5tb250aGx5SW5jb21lcyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc2NvcGUubW9udGhseUluY29tZXMubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsID0gc2NvcGUubW9udGhseUluY29tZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKHNjb3BlLm1vbnRobHlJbmNvbWVzW2wtMV0ueWVhciwgc2NvcGUubW9udGhseUluY29tZXNbbC0xXS5tb250aCAtIDEsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXJNb250aGx5SW5jb21lTW9udGggPSBkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXJNb250aGx5SW5jb21lVG90YWwgPSBzY29wZS5tb250aGx5SW5jb21lc1tsLTFdLm1vbnRodG90YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmN1ck1vbnRobHlJbmNvbWVQb3MgPSBsIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEVycm9yXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldE91dHN0YW5kaW5nUGF5bWVudHMoc2NvcGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3JlcG9ydHMvZ2V0T3V0c3RhbmRpbmdQYXltZW50cycpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLm91dHN0YW5kaW5nUGF5bWVudHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNjb3BlLm91dHN0YW5kaW5nUGF5bWVudHMubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkID0gbmV3IERhdGUoc2NvcGUub3V0c3RhbmRpbmdQYXltZW50c1swXS55ZWFyLCBzY29wZS5vdXRzdGFuZGluZ1BheW1lbnRzWzBdLm1vbnRoIC0gMSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmN1ck1vbnRobHlPdXRzdGFuZGluZ01vbnRoID0gZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY3VyTW9udGhseU91c3RhbmRpbmdUb3RhbCA9IHNjb3BlLm91dHN0YW5kaW5nUGF5bWVudHNbMF0ub3V0c3RhbmRpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmN1ck1vbnRobHlPdXRzdGFuZGluZ1BvcyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWxmLmNoYW5nZU1vbnRobHlPdXRzdGFuZGluZyA9IGZ1bmN0aW9uKGluY3JlbWVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuY3VyTW9udGhseU91dHN0YW5kaW5nUG9zICs9IGluY3JlbWVudDtcclxuXHJcbiAgICAgICAgICAgIGlmKChzZWxmLmN1ck1vbnRobHlPdXRzdGFuZGluZ1BvcyA8IDApKSB7IHNlbGYuY3VyTW9udGhseU91dHN0YW5kaW5nUG9zID0gMDsgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKChzZWxmLmN1ck1vbnRobHlPdXRzdGFuZGluZ1BvcyArIDEpID4gc2VsZi5vdXRzdGFuZGluZ1BheW1lbnRzLmxlbmd0aCkgeyBzZWxmLmN1ck1vbnRobHlPdXRzdGFuZGluZ1BvcyA9IHNlbGYub3V0c3RhbmRpbmdQYXltZW50cy5sZW5ndGggLSAxOyB9XHJcblxyXG4gICAgICAgICAgICBpZihzZWxmLmN1ck1vbnRobHlPdXRzdGFuZGluZ1BvcyA+PSAwICYmIChzZWxmLmN1ck1vbnRobHlPdXRzdGFuZGluZ1BvcyArIDEpIDw9IHNlbGYub3V0c3RhbmRpbmdQYXltZW50cy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBkID0gbmV3IERhdGUoc2VsZi5vdXRzdGFuZGluZ1BheW1lbnRzW3NlbGYuY3VyTW9udGhseU91dHN0YW5kaW5nUG9zXS55ZWFyLCBzZWxmLm91dHN0YW5kaW5nUGF5bWVudHNbc2VsZi5jdXJNb250aGx5T3V0c3RhbmRpbmdQb3NdLm1vbnRoIC0gMSwgMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi5jdXJNb250aGx5T3V0c3RhbmRpbmdNb250aCA9IGQ7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmN1ck1vbnRobHlPdXN0YW5kaW5nVG90YWwgPSBzZWxmLm91dHN0YW5kaW5nUGF5bWVudHNbc2VsZi5jdXJNb250aGx5T3V0c3RhbmRpbmdQb3NdLm91dHN0YW5kaW5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5jaGFuZ2VNb250aGx5SW5jb21lID0gZnVuY3Rpb24oaW5jcmVtZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnTGVuOicgKyBzZWxmLm1vbnRobHlJbmNvbWVzLmxlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGYuY3VyTW9udGhseUluY29tZVBvcyk7XHJcbiAgICAgICAgICAgIHNlbGYuY3VyTW9udGhseUluY29tZVBvcyArPSBpbmNyZW1lbnQ7XHJcblxyXG4gICAgICAgICAgICBpZigoc2VsZi5jdXJNb250aGx5SW5jb21lUG9zIDwgMCkpIHsgc2VsZi5jdXJNb250aGx5SW5jb21lUG9zID0gMDsgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKChzZWxmLmN1ck1vbnRobHlJbmNvbWVQb3MgKyAxKSA+IHNlbGYubW9udGhseUluY29tZXMubGVuZ3RoKSB7IHNlbGYuY3VyTW9udGhseUluY29tZVBvcyA9IHNlbGYubW9udGhseUluY29tZXMubGVuZ3RoIC0gMTsgfVxyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLmN1ck1vbnRobHlJbmNvbWVQb3MpO1xyXG5cclxuICAgICAgICAgICAgaWYoc2VsZi5jdXJNb250aGx5SW5jb21lUG9zID49IDAgJiYgKHNlbGYuY3VyTW9udGhseUluY29tZVBvcyArIDEpIDw9IHNlbGYubW9udGhseUluY29tZXMubGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKHNlbGYubW9udGhseUluY29tZXNbc2VsZi5jdXJNb250aGx5SW5jb21lUG9zXS55ZWFyLCBzZWxmLm1vbnRobHlJbmNvbWVzW3NlbGYuY3VyTW9udGhseUluY29tZVBvc10ubW9udGggLSAxLCAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLmN1ck1vbnRobHlJbmNvbWVNb250aCA9IGQ7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmN1ck1vbnRobHlJbmNvbWVUb3RhbCA9IHNlbGYubW9udGhseUluY29tZXNbc2VsZi5jdXJNb250aGx5SW5jb21lUG9zXS5tb250aHRvdGFsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2V0UG9Ub3RhbCA9IGZ1bmN0aW9uKGl0ZW0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKTtcclxuICAgICAgICAgICAgaWYoaXRlbSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wb1RvdGFsICs9IHBhcnNlRmxvYXQoaXRlbS50b3RhbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmdldERhaWx5U2FsZXNDc3YgPSBmdW5jdGlvbihlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5kYWlseV9zYWxlc19mcm9tX2RhdGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLmRhaWx5X3NhbGVzX3RvX2RhdGUpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHNlbGYucmVwb3J0UGFyYW1zLmRhaWx5X3NhbGVzX2Zyb21fZGF0ZSAgPSBzZWxmLmRhaWx5X3NhbGVzX2Zyb21fZGF0ZTtcclxuICAgICAgICAgICAgc2VsZi5yZXBvcnRQYXJhbXMuZGFpbHlfc2FsZXNfdG9fZGF0ZSAgPSBzZWxmLmRhaWx5X3NhbGVzX3RvX2RhdGU7XHJcblxyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3JlcG9ydHMvZ2V0RGFpbHlTYWxlcycpLnBvc3QoeyAncmVwb3J0UGFyYW1zJzogc2VsZi5yZXBvcnRQYXJhbXN9KS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5kYXlyZXBvcnRzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi5yZXN1bHRzWzBdKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZ2V0U2FsZXNDaGFubmVscyA9IGZ1bmN0aW9uKGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnNhbGVzX2NoYW5uZWxfZnJvbV9kYXRlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5zYWxlc19jaGFubmVsX3RvX2RhdGUpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHNlbGYucmVwb3J0UGFyYW1zLnNhbGVzX2NoYW5uZWxfZnJvbV9kYXRlICA9IHNlbGYuc2FsZXNfY2hhbm5lbF9mcm9tX2RhdGU7XHJcbiAgICAgICAgICAgIHNlbGYucmVwb3J0UGFyYW1zLnNhbGVzX2NoYW5uZWxfdG9fZGF0ZSAgPSBzZWxmLnNhbGVzX2NoYW5uZWxfdG9fZGF0ZTtcclxuXHJcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgncmVwb3J0cy9nZXRTYWxlc0NoYW5uZWxSZXBvcnQnKS5wb3N0KHsgJ3JlcG9ydFBhcmFtcyc6IHNlbGYucmVwb3J0UGFyYW1zfSkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY2hhbm5lbHJlcG9ydHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi5yZXN1bHRzWzBdKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRXJyb3JcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdSZXBvcnRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJGF1dGgnLCAnJHN0YXRlJywgJyRtb21lbnQnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnQ2hhcnRTZXJ2aWNlJywgUmVwb3J0Q29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBTYWxlc0NoYW5uZWxDcmVhdGVDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYuY3JlYXRlU2FsZXNDaGFubmVsID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlzVmFsaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLnBheW1lbnR0eXBlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHNlbGYuc2FsZXNjaGFubmVsO1xyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnc2FsZXNjaGFubmVsJykucG9zdChjKS50aGVuKGZ1bmN0aW9uKGQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkKTtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBjcmVhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLnNhbGVzY2hhbm5lbHMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBjcmVhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NhbGVzQ2hhbm5lbENyZWF0ZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdUb2FzdFNlcnZpY2UnLCAnUmVzdGFuZ3VsYXInLCAnJHN0YXRlUGFyYW1zJywgU2FsZXNDaGFubmVsQ3JlYXRlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBTYWxlc0NoYW5uZWxEZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJHN0YXRlUGFyYW1zKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRTYWxlc0NoYW5uZWwoJHN0YXRlUGFyYW1zLnNhbGVzQ2hhbm5lbElkKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLnNhbGVzY2hhbm5lbCA9IGRhdGE7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlU2FsZXNDaGFubmVsID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5mb3JtMS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IHNlbGYuZm9ybTEuJHZhbGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlzVmFsaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNWYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zYWxlc2NoYW5uZWwucHV0KCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgdXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAuc2FsZXNjaGFubmVsc1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVTYWxlc0NoYW5uZWwgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLnNhbGVzY2hhbm5lbC5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5zYWxlc2NoYW5uZWxzXCIpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgRGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zaG93RGVsZXRlQ29uZmlybSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZyA9IERpYWxvZ1NlcnZpY2UuY29uZmlybShldiwgJ0RlbGV0ZSBzYWxlcyBjaGFubmVsPycsICcnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlU2FsZXNDaGFubmVsKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NhbGVzQ2hhbm5lbERldGFpbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdUb2FzdFNlcnZpY2UnLCAnUmVzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsICckc3RhdGVQYXJhbXMnLCBTYWxlc0NoYW5uZWxEZXRhaWxDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFNhbGVzQ2hhbm5lbENvbnRyb2xsZXIoUmVzdFNlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxTYWxlc0NoYW5uZWxzKHNlbGYpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuc2FsZXNjaGFubmVscyA9IGRhdGE7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTYWxlc0NoYW5uZWxDb250cm9sbGVyJywgWydSZXN0U2VydmljZScsIFNhbGVzQ2hhbm5lbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gU2VhcmNoQ29udHJvbGxlcigkc2NvcGUsICRhdXRoLCBSZXN0YW5ndWxhciwgJHN0YXRlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5ub0NhY2hlID0gdHJ1ZTtcclxuICAgICAgICBzZWxmLnNlYXJjaFRleHQgPSBcIlwiO1xyXG4gICAgICAgIHNlbGYuc2VsZWN0ZWRSZXN1bHQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIHNlbGYuZG9TZWFyY2ggPSBmdW5jdGlvbihxdWVyeSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vUmVzdFNlcnZpY2UuZG9TZWFyY2goc2VsZiwgc2VsZi5zZWFyY2hUZXh0KTtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLm9uZSgnc2VhcmNoJywgcXVlcnkpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmZpcmVUb2dnbGVTZWFyY2hFdmVudCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIC8vc2VsZi4kcm9vdC4kYnJvYWRjYXN0KFwidG9nZ2xlU2VhcmNoXCIsIHt1c2VybmFtZTogJHNjb3BlLnVzZXIudXNlcm5hbWUgfSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kcm9vdC4kYnJvYWRjYXN0KFwidG9nZ2xlU2VhcmNoXCIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZ290b0l0ZW0gPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnNlbGVjdGVkUmVzdWx0KTtcclxuICAgICAgICAgICAgaWYoc2VsZi5zZWxlY3RlZFJlc3VsdCAhPT0gbnVsbCAmJiBzZWxmLnNlbGVjdGVkUmVzdWx0ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoVGV4dCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmZpcmVUb2dnbGVTZWFyY2hFdmVudCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHN3aXRjaChzZWxmLnNlbGVjdGVkUmVzdWx0LmNvbnRlbnRfdHlwZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicHJvZHVjdFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5wcm9kdWN0cy5kZXRhaWwnLCB7J3Byb2R1Y3RJZCc6IHNlbGYuc2VsZWN0ZWRSZXN1bHQuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJjdXN0b21lclwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5jdXN0b21lcnMuZGV0YWlsJywgeydjdXN0b21lcklkJzogc2VsZi5zZWxlY3RlZFJlc3VsdC5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImV2ZW50XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmV2ZW50cy5kZXRhaWwnLCB7J2V2ZW50SWQnOiBzZWxmLnNlbGVjdGVkUmVzdWx0LmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwid29ya29yZGVyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLndvcmtvcmRlcnMuZGV0YWlsJywgeyd3b3JrT3JkZXJJZCc6IHNlbGYuc2VsZWN0ZWRSZXN1bHQuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJtYXRlcmlhbFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5tYXRlcmlhbHMuZGV0YWlsJywgeydtYXRlcmlhbElkJzogc2VsZi5zZWxlY3RlZFJlc3VsdC5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInB1cmNoYXNlb3JkZXJcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucHVyY2hhc2VvcmRlcnMuZGV0YWlsJywgeydwdXJjaGFzZU9yZGVySWQnOiBzZWxmLnNlbGVjdGVkUmVzdWx0LmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2VhcmNoQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRhdXRoJywgJ1Jlc3Rhbmd1bGFyJywgJyRzdGF0ZScsIFNlYXJjaENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gVW5pdENyZWF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgVG9hc3RTZXJ2aWNlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYuY3JlYXRlVW5pdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi51bml0KTtcclxuICAgICAgICAgICAgICAgIHZhciBjID0gc2VsZi51bml0O1xyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgndW5pdCcpLnBvc3QoYykudGhlbihmdW5jdGlvbihkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vJHN0YXRlLmdvKCdhcHAuY3VzdG9tZXJzLmRldGFpbCcsIHsnY3VzdG9tZXJJZCc6IGQubmV3SWR9KTtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBjcmVhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLnVuaXRzJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgY3JlYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdVbml0Q3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCBVbml0Q3JlYXRlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBVbml0RGV0YWlsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBUb2FzdFNlcnZpY2UsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgRGlhbG9nU2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldFVuaXQoc2VsZiwgJHN0YXRlUGFyYW1zLnVuaXRJZCk7XHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlVW5pdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYudW5pdC5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC51bml0c1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVVuaXQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLnVuaXQucmVtb3ZlKCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGRlbGV0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAudW5pdHNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBEZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNob3dEZWxldGVDb25maXJtID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGV2LCAnRGVsZXRlIHVuaXQ/JywgJycpO1xyXG4gICAgICAgICAgICBkaWFsb2cudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5kZWxldGVVbml0KCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1VuaXREZXRhaWxDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJ0RpYWxvZ1NlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgVW5pdERldGFpbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gVW5pdENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsVW5pdHMoc2VsZik7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdVbml0Q29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgVW5pdENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gV29ya09yZGVyQ3JlYXRlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgVXBsb2FkU2VydmljZSwgVG9hc3RTZXJ2aWNlLCAkbW9tZW50LCBSZXN0U2VydmljZSwgVmFsaWRhdGlvblNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbEN1c3RvbWVycyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi5udW1lcmljUmVnZXggPSBWYWxpZGF0aW9uU2VydmljZS5udW1lcmljUmVnZXgoKTtcclxuICAgICAgICBzZWxmLndvcmtvcmRlciA9IHt9O1xyXG5cclxuICAgICAgICBzZWxmLnVwbG9hZEZpbGUgPSBmdW5jdGlvbihmaWxlLCBlcnJGaWxlcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZiA9IGZpbGU7XHJcbiAgICAgICAgICAgIHNlbGYuZXJyRmlsZSA9IGVyckZpbGVzICYmIGVyckZpbGVzWzBdO1xyXG4gICAgICAgICAgICBpZihmaWxlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBVcGxvYWRTZXJ2aWNlLnVwbG9hZEZpbGUoJycsIGZpbGUpLnRoZW4oZnVuY3Rpb24gKHJlc3ApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzcC5kYXRhLnN1Y2Nlc3MgPT0gMSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3N1Y2Nlc3NmdWwgdXBsb2FkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYud29ya29yZGVyLmltYWdlX2ZpbGVuYW1lID0gcmVzcC5kYXRhLmZpbGVuYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdTdWNjZXNzICcgKyByZXNwLmNvbmZpZy5kYXRhLmZpbGUubmFtZSArICd1cGxvYWRlZC4gUmVzcG9uc2U6ICcgKyByZXNwLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3ApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3Auc3RhdHVzID4gMClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZXJyb3JNc2cgPSByZXNwLnN0YXR1cyArICc6ICcgKyByZXNwLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBzdGF0dXM6ICcgKyByZXNwLnN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXZ0KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGUucHJvZ3Jlc3MgPSBNYXRoLm1pbigxMDAsIHBhcnNlSW50KDEwMC4wICogZXZ0LmxvYWRlZCAvIGV2dC50b3RhbCkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZVdvcmtPcmRlciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2VsZi53b3Jrb3JkZXIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB3ID0gc2VsZi53b3Jrb3JkZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCd3b3Jrb3JkZXInKS5wb3N0KHcpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8kc3RhdGUuZ28oJ2FwcC53b3Jrb3JkZXJzLmRldGFpbCcsIHsnd29ya09yZGVySWQnOiAxfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAud29ya29yZGVycycpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignV29ya09yZGVyQ3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1VwbG9hZFNlcnZpY2UnLCAnVG9hc3RTZXJ2aWNlJywgJyRtb21lbnQnLCAnUmVzdFNlcnZpY2UnLCAnVmFsaWRhdGlvblNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgV29ya09yZGVyQ3JlYXRlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBXb3JrT3JkZXJEZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsICRzY29wZSwgVG9hc3RTZXJ2aWNlLCBSZXN0YW5ndWxhciwgVXBsb2FkU2VydmljZSwgUmVzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UsIFZhbGlkYXRpb25TZXJ2aWNlLCAkbW9tZW50LCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0V29ya09yZGVyKCRzdGF0ZVBhcmFtcy53b3JrT3JkZXJJZCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgc2VsZi53b3Jrb3JkZXIgPSBkYXRhO1xyXG5cclxuICAgICAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsV29ya09yZGVyVGFza3MoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYud29ya29yZGVydGFza3MgPSBkYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbEN1c3RvbWVycyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuXHJcblxyXG5cclxuICAgICAgICBzZWxmLm51bWVyaWNSZWdleCA9IFZhbGlkYXRpb25TZXJ2aWNlLm51bWVyaWNSZWdleCgpO1xyXG5cclxuICAgICAgICBzZWxmLnRvZ2dsZUNvbXBsZXRlID0gZnVuY3Rpb24oY2JTdGF0ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNiU3RhdGUpO1xyXG4gICAgICAgICAgICAvL2lmKGNiU3RhdGUpIHsgc2VsZi53b3Jrb3JkZXIuY29tcGxldGVkID0gMTsgfVxyXG4gICAgICAgICAgICAvL2Vsc2UgeyBzZWxmLndvcmtvcmRlci5jb21wbGV0ZWQgPSAwOyB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi52aWV3QXR0YWNobWVudCA9IGZ1bmN0aW9uKGV2LCBmaWxlbmFtZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICRzY29wZS5hID0gYXR0YWNobWVudFBhdGggICsgJy8nICsgZmlsZW5hbWU7XHJcblxyXG4gICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZShldiwgJ2RsZ0F0dGFjaG1lbnRWaWV3JywgJHNjb3BlKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjb25maXJtZWQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYXR0YWNobWVudFBhdGggICsgJy8nICsgZmlsZW5hbWUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlQXR0YWNobWVudCA9IGZ1bmN0aW9uKGV2LCBmaWxlbmFtZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZXYsICdEZWxldGUgYXR0YWNobWVudD8nLCAnJyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBVcGxvYWRTZXJ2aWNlLmRlbGV0ZUZpbGUoZmlsZW5hbWUpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi53b3Jrb3JkZXIuaW1hZ2VfZmlsZW5hbWUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmYucHJvZ3Jlc3MgPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5mID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiQXR0YWNoZW50IGRlbGV0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzcClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgZGVsZXRpbmcgYXR0YWNobWVudFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnVwbG9hZEZpbGUgPSBmdW5jdGlvbihmaWxlLCBlcnJGaWxlcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZiA9IGZpbGU7XHJcbiAgICAgICAgICAgIHNlbGYuZXJyRmlsZSA9IGVyckZpbGVzICYmIGVyckZpbGVzWzBdO1xyXG4gICAgICAgICAgICBpZihmaWxlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZm5hbWUgPSAnJztcclxuICAgICAgICAgICAgICAgIGlmKHNlbGYud29ya29yZGVyLmltYWdlX2ZpbGVuYW1lICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAmJiBzZWxmLndvcmtvcmRlci5pbWFnZV9maWxlbmFtZSAhPT0gbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgICYmIHNlbGYud29ya29yZGVyLmltYWdlX2ZpbGVuYW1lICE9PSAnbnVsbCdcclxuICAgICAgICAgICAgICAgICAgICAmJiBzZWxmLndvcmtvcmRlci5pbWFnZV9maWxlbmFtZSAhPT0gJycpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm5hbWUgPSBzZWxmLndvcmtvcmRlci5pbWFnZV9maWxlbmFtZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBVcGxvYWRTZXJ2aWNlLnVwbG9hZEZpbGUoZm5hbWUsIGZpbGUpLnRoZW4oZnVuY3Rpb24gKHJlc3ApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzcC5kYXRhLnN1Y2Nlc3MgPT0gMSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3N1Y2Nlc3NmdWwgdXBsb2FkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYud29ya29yZGVyLmltYWdlX2ZpbGVuYW1lID0gcmVzcC5kYXRhLmZpbGVuYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdTdWNjZXNzICcgKyByZXNwLmNvbmZpZy5kYXRhLmZpbGUubmFtZSArICd1cGxvYWRlZC4gUmVzcG9uc2U6ICcgKyByZXNwLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3ApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3Auc3RhdHVzID4gMClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZXJyb3JNc2cgPSByZXNwLnN0YXR1cyArICc6ICcgKyByZXNwLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBzdGF0dXM6ICcgKyByZXNwLnN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXZ0KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGUucHJvZ3Jlc3MgPSBNYXRoLm1pbigxMDAsIHBhcnNlSW50KDEwMC4wICogZXZ0LmxvYWRlZCAvIGV2dC50b3RhbCkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZVdvcmtPcmRlciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZm9ybTEuJHNldFN1Ym1pdHRlZCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBzZWxmLmZvcm0xLiR2YWxpZDtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpc1ZhbGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGlzVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYud29ya29yZGVyKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLndvcmtvcmRlci5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC53b3Jrb3JkZXJzXCIpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVdvcmtPcmRlciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYud29ya29yZGVyLnJlbW92ZSgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBkZWxldGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLndvcmtvcmRlcnNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBkZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zaG93RGVsZXRlQ29uZmlybSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZyA9IERpYWxvZ1NlcnZpY2UuY29uZmlybShldiwgJ0RlbGV0ZSB3b3JrIG9yZGVyPycsICcnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlV29ya09yZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1dvcmtPcmRlckRldGFpbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICckc2NvcGUnLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3Rhbmd1bGFyJywgJ1VwbG9hZFNlcnZpY2UnLCAnUmVzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsICdWYWxpZGF0aW9uU2VydmljZScsICckbW9tZW50JywgJyRzdGF0ZVBhcmFtcycsIFdvcmtPcmRlckRldGFpbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gV29ya09yZGVyQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRtb21lbnQpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLnNob3dDb21wbGV0ZSA9IGZhbHNlO1xyXG4gICAgICAgIHZhciB0b2RheXNEYXRlID0gJG1vbWVudCgpO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxXb3JrT3JkZXJzKHNlbGYpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi5zZXRVcmdlbmN5ID0gZnVuY3Rpb24ob2JqRGF0ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIDMgZGF5cywgNyBkYXlzLCAzMCBkYXlzLCB0aGUgcmVzdFxyXG4gICAgICAgICAgICB2YXIgZCA9ICRtb21lbnQob2JqRGF0ZSk7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgIHZhciBkYXlEaWZmID0gZC5kaWZmKHRvZGF5c0RhdGUsICdkYXlzJyk7XHJcblxyXG4gICAgICAgICAgICBpZihkYXlEaWZmID4gMzApIC8vIGdyZWVuXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImZhcldvcmtPcmRlclwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoZGF5RGlmZiA+IDcgJiYgZGF5RGlmZiA8PSAzMCkgLy8gYmx1ZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJjbG9zZVdvcmtPcmRlclwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoZGF5RGlmZiA+IDMgJiYgZGF5RGlmZiA8PSA3KSAvLyBvcmFuZ2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiY2xvc2VyV29ya09yZGVyXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSAvLyByZWRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiY2xvc2VzdFdvcmtPcmRlclwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGQuZGlmZih0b2RheXNEYXRlLCAnZGF5cycpKTtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi50b2dnbGVDb21wbGV0ZU9ubHkgPSBmdW5jdGlvbihjYlN0YXRlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RvZ2dsZScpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjYlN0YXRlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignV29ya09yZGVyQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJyRtb21lbnQnLCBXb3JrT3JkZXJDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
