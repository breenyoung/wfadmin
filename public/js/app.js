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

    angular.module('app.services', ['ui.router', 'satellizer', 'restangular', 'angular-momentjs']);
    angular.module('app.routes', ['ui.router', 'satellizer']);
    angular.module('app.controllers', ['ui.router', 'ngMaterial', 'restangular', 'angular-momentjs', 'app.services', 'ngMessages', 'ngMdIcons', 'md.data.table', 'highcharts-ng']);
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



})();
(function()
{
    "use strict";
    angular.module('app.routes').config( ["$stateProvider", "$urlRouterProvider", "$authProvider", function($stateProvider, $urlRouterProvider, $authProvider ) {

        var getView = function( viewName ){
            return '/views/app/' + viewName + '.html';
        };

        $urlRouterProvider.otherwise('/login');


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
 * Created by Breen on 15/02/2016.
 */

(function(){
    "use strict";

    angular.module("app.services").factory('DialogService', ["$mdDialog", function( $mdDialog ){

        return {
            fromTemplate: function(ev, template, scope ) {
                var options = {
                    templateUrl: '/views/dialogs/' + template + '.html',
                    targetEvent: ev,
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
                    console.log(data);
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

                    console.log(scope);
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
                    console.log(data);
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
                    console.log(data);
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
                    console.log(data);
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
                   console.log(data);

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

                    scope.purchaseorder = data;
                });
            },

            getAllPaymentTypes: function(scope)
            {
                Restangular.all('paymenttype').getList().then(function(data)
                {
                    console.log(data);
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
                    console.log(data);
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

    function CoreController($scope, $auth, $moment, $mdSidenav, $mdMedia)
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
        };

        // Listen for toggleSearch events
        $scope.$on("toggleSearch", function (event, args)
        {
            $scope.toggleSearch();
        });

    }

    angular.module('app.controllers').controller('CoreController', ['$scope', '$auth', '$moment', '$mdSidenav', '$mdMedia', CoreController]);

})();

(function(){
    "use strict";

    function CustomerCreateController($auth, $state, ToastService, Restangular, RestService, $stateParams)
    {
        var self = this;

        self.createCustomer = function()
        {
            console.log(self.customer);

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
            self.customer.put().then(function()
            {
                ToastService.show("Successfully updated");
                $state.go("app.customers");

            }, function()
            {
                ToastService.show("Error updating");
                console.log("error updating");
            });
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
            console.log(self.event);

            var e = self.event;

            //console.log($error);

            Restangular.all('event').post(e).then(function(e)
            {
                console.log(e);
                ToastService.show("Successfully created");
                $state.go('app.events');

            });

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

    function LoginController($auth, $state)
    {
        var self = this;

        self.title = 'Login';

        self.requestToken = function()
        {
            var credentials = { email: self.email, password: self.password };

            //console.log(credentials);

            // Use Satellizer's $auth service to login because it'll automatically save the JWT in localStorage
            $auth.login(credentials).then(function (data)
            {
                // If login is successful, redirect to the users state
                $state.go('app.landing');
            }).catch(function(data)
            {
                alert('Error logging in');
            });
        };

        // This request will hit the getData method in the AuthenticateController
        // on the Laravel side and will return your data that require authentication
        /*
         $scope.getData = function()
         {
         Restangular.all('authenticate/data').get().then(function (response){

         }, function (error){});
         };
         */
    }

    angular.module('app.controllers').controller('LoginController', ['$auth', '$state', LoginController]);

})();

(function(){
    "use strict";

    function MaterialCreateController($auth, $state, ToastService, Restangular, RestService, $stateParams)
    {
        var self = this;

        RestService.getAllUnits(self);
        RestService.getMaterialAllTypes(self);

        self.createMaterial = function()
        {
            console.log(self.material);

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

        };

    }

    angular.module('app.controllers').controller('MaterialCreateController', ['$auth', '$state', 'ToastService', 'Restangular', 'RestService', '$stateParams', MaterialCreateController]);

})();

(function(){
    "use strict";

    function MaterialDetailController($auth, $state, ToastService, Restangular, RestService, DialogService, $stateParams)
    {
        var self = this;

        RestService.getAllUnits(self);
        RestService.getMaterialAllTypes(self);

        //console.log($stateParams);
        RestService.getMaterial(self, $stateParams.materialId);

        self.updateMaterial = function()
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

    angular.module('app.controllers').controller('MaterialDetailController', ['$auth', '$state', 'ToastService', 'Restangular', 'RestService', 'DialogService', '$stateParams', MaterialDetailController]);

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
            console.log(self.paymenttype);

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
            self.paymenttype.put().then(function()
            {
                ToastService.show("Successfully updated");
                $state.go("app.paymenttypes");

            }, function()
            {
                ToastService.show("Error updating");
                console.log("error updating");
            });
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

    function ProductCreateController($auth, $state, Restangular, ToastService, RestService, $stateParams)
    {
        var self = this;

        RestService.getAllMaterials(self);

        self.product = {};
        self.product.cost = 0;

        self.createProduct = function()
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

    angular.module('app.controllers').controller('ProductCreateController', ['$auth', '$state', 'Restangular', 'ToastService', 'RestService', '$stateParams', ProductCreateController]);

})();

(function(){
    "use strict";

    function ProductDetailController($auth, $state, Restangular, RestService, $stateParams, ToastService, DialogService)
    {
        var self = this;

        //console.log($stateParams);
        RestService.getAllMaterials(self);
        RestService.getProduct(self, $stateParams.productId);

        self.updateProduct = function()
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

    angular.module('app.controllers').controller('ProductDetailController', ['$auth', '$state', 'Restangular', 'RestService', '$stateParams', 'ToastService', 'DialogService', ProductDetailController]);

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

        self.purchaseorder.suppressworkorder = 0;

        var originalTotal = 0;

        self.onlyOpenDays = function(date)
        {
            var result = true;
            for(var i = 0; i < self.bookedDays.length; i++)
            {
                //console.log(self.bookedDays[i].start_date);
                //console.log($moment(self.bookedDays[i].start_date));
                result = !$moment(date).isSame(self.bookedDays[i].start_date);
                break;
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
            console.log(self.unit);

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
            self.unit.put().then(function()
            {
                ToastService.show("Successfully updated");
                $state.go("app.units");

            }, function()
            {
                ToastService.show("Error updating");
                console.log("error updating");
            });
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

    function WorkOrderCreateController($auth, $state, Restangular, ToastService, $moment, RestService, $stateParams)
    {
        var self = this;

        RestService.getAllCustomers(self);
        RestService.getAllProducts(self);

        self.createWorkOrder = function()
        {
            //Tue Feb 02 2016 00:00:00 GMT-0400 (Atlantic Standard Time)
            console.log(self.workorder);

            var w = self.workorder;

            Restangular.all('workorder').post(w).then(function()
            {
                ToastService.show("Successfully created");
                //$state.go('app.workorders.detail', {'workOrderId': 1});
                $state.go('app.workorders');

            });
        };
    }

    angular.module('app.controllers').controller('WorkOrderCreateController', ['$auth', '$state', 'Restangular', 'ToastService', '$moment', 'RestService', '$stateParams', WorkOrderCreateController]);

})();

(function(){
    "use strict";

    function WorkOrderDetailController($auth, $state, ToastService, Restangular, RestService, DialogService, $moment, $stateParams)
    {
        var self = this;

        //console.log($stateParams);
        RestService.getWorkOrder(self, $stateParams.workOrderId);
        RestService.getAllCustomers(self);
        RestService.getAllProducts(self);


        self.toggleComplete = function(cbState)
        {
            console.log(cbState);
            //if(cbState) { self.workorder.completed = 1; }
            //else { self.workorder.completed = 0; }
        };

        self.updateWorkOrder = function()
        {
            self.workorder.put().then(function()
            {
                ToastService.show("Successfully updated");
                $state.go("app.workorders");
            }, function()
            {
                ToastService.show("Error updating");
            });
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

    angular.module('app.controllers').controller('WorkOrderDetailController', ['$auth', '$state', 'ToastService', 'Restangular', 'RestService', 'DialogService', '$moment', '$stateParams', WorkOrderDetailController]);

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHAuanMiLCJhcHAvcm91dGVzLmpzIiwiYXBwL2RpcmVjdGl2ZXMvdXRjLXBhcnNlci5kaXJlY3RpdmUuanMiLCJhcHAvZmlsdGVycy90cnVuY2F0ZU5hbWUuanMiLCJhcHAvc2VydmljZXMvZGlhbG9nLmpzIiwiYXBwL3NlcnZpY2VzL3Jlc3QuanMiLCJhcHAvc2VydmljZXMvdG9hc3QuanMiLCJhcHAvY29udHJvbGxlcnMvY29yZS9jb3JlLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2N1c3RvbWVycy9jdXN0b21lci5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvY3VzdG9tZXJzL2N1c3RvbWVyLmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy9jdXN0b21lcnMvY3VzdG9tZXJzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2V2ZW50cy9ldmVudC5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvZXZlbnRzL2V2ZW50LmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy9ldmVudHMvZXZlbnRzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2Zvb3Rlci9mb290ZXIuanMiLCJhcHAvY29udHJvbGxlcnMvaGVhZGVyL2hlYWRlci5qcyIsImFwcC9jb250cm9sbGVycy9sYW5kaW5nL2xhbmRpbmcuanMiLCJhcHAvY29udHJvbGxlcnMvbG9naW4vbG9naW4uanMiLCJhcHAvY29udHJvbGxlcnMvbWF0ZXJpYWxzL21hdGVyaWFsLmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy9tYXRlcmlhbHMvbWF0ZXJpYWwuZGV0YWlsLmpzIiwiYXBwL2NvbnRyb2xsZXJzL21hdGVyaWFscy9tYXRlcmlhbHMuanMiLCJhcHAvY29udHJvbGxlcnMvcGF5bWVudF90eXBlcy9wYXltZW50dHlwZS5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvcGF5bWVudF90eXBlcy9wYXltZW50dHlwZS5kZXRhaWwuanMiLCJhcHAvY29udHJvbGxlcnMvcGF5bWVudF90eXBlcy9wYXltZW50dHlwZXMuanMiLCJhcHAvY29udHJvbGxlcnMvcHJvZHVjdHMvcHJvZHVjdC5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvcHJvZHVjdHMvcHJvZHVjdC5kZXRhaWwuanMiLCJhcHAvY29udHJvbGxlcnMvcHJvZHVjdHMvcHJvZHVjdHMuanMiLCJhcHAvY29udHJvbGxlcnMvcHVyY2hhc2VvcmRlcnMvcHVyY2hhc2VvcmRlci5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvcHVyY2hhc2VvcmRlcnMvcHVyY2hhc2VvcmRlci5kZXRhaWwuanMiLCJhcHAvY29udHJvbGxlcnMvcHVyY2hhc2VvcmRlcnMvcHVyY2hhc2VvcmRlcnMuanMiLCJhcHAvY29udHJvbGxlcnMvcmVwb3J0cy9yZXBvcnRzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3NlYXJjaC9zZWFyY2guanMiLCJhcHAvY29udHJvbGxlcnMvdW5pdHMvdW5pdC5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvdW5pdHMvdW5pdC5kZXRhaWwuanMiLCJhcHAvY29udHJvbGxlcnMvdW5pdHMvdW5pdHMuanMiLCJhcHAvY29udHJvbGxlcnMvd29ya29yZGVycy93b3Jrb3JkZXIuY3JlYXRlLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3dvcmtvcmRlcnMvd29ya29yZGVyLmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy93b3Jrb3JkZXJzL3dvcmtvcmRlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsSUFBQSxNQUFBLFFBQUEsT0FBQTtRQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBOzs7SUFHQSxRQUFBLE9BQUEsZ0JBQUEsQ0FBQSxhQUFBLGNBQUEsZUFBQTtJQUNBLFFBQUEsT0FBQSxjQUFBLENBQUEsYUFBQTtJQUNBLFFBQUEsT0FBQSxtQkFBQSxDQUFBLGFBQUEsY0FBQSxlQUFBLG9CQUFBLGdCQUFBLGNBQUEsYUFBQSxpQkFBQTtJQUNBLFFBQUEsT0FBQSxlQUFBOztJQUVBLFFBQUEsT0FBQSxrQkFBQSxDQUFBO0lBQ0EsUUFBQSxPQUFBLGNBQUE7Ozs7OztJQU1BLFFBQUEsT0FBQSxjQUFBLHlCQUFBLFVBQUE7SUFDQTs7O1FBR0EsY0FBQSxXQUFBOzs7SUFHQSxRQUFBLE9BQUEsY0FBQSwyQkFBQSxVQUFBO0lBQ0E7UUFDQTthQUNBLGFBQUE7YUFDQSxVQUFBOzs7SUFHQSxRQUFBLE9BQUEsY0FBQSxnQ0FBQSxTQUFBLHFCQUFBO1FBQ0E7YUFDQSxXQUFBO2FBQ0Esa0JBQUEsRUFBQSxRQUFBOzs7SUFHQSxRQUFBLE9BQUEsY0FBQSwrQkFBQSxTQUFBLG9CQUFBOzs7UUFHQSxJQUFBLGdCQUFBLG1CQUFBLGNBQUE7UUFDQTtZQUNBLHdCQUFBO1lBQ0Esc0JBQUEsQ0FBQTtZQUNBLE1BQUE7OztRQUdBLG1CQUFBLGNBQUEsY0FBQTtRQUNBLG1CQUFBLE1BQUE7YUFDQSxlQUFBO1lBQ0E7Z0JBQ0EsV0FBQTtnQkFDQSxTQUFBOzthQUVBLGNBQUE7Ozs7SUFJQSxRQUFBLE9BQUEsY0FBQSxpQ0FBQSxTQUFBO0lBQ0E7UUFDQSxzQkFBQSxhQUFBLFNBQUE7UUFDQTtZQUNBLEdBQUEsU0FBQTtZQUNBO2dCQUNBLE9BQUEsT0FBQSxNQUFBLE9BQUE7OztZQUdBLE9BQUE7Ozs7Ozs7QUMzRUEsQ0FBQTtBQUNBO0lBQ0E7SUFDQSxRQUFBLE9BQUEsY0FBQSxrRUFBQSxTQUFBLGdCQUFBLG9CQUFBLGdCQUFBOztRQUVBLElBQUEsVUFBQSxVQUFBLFVBQUE7WUFDQSxPQUFBLGdCQUFBLFdBQUE7OztRQUdBLG1CQUFBLFVBQUE7OztRQUdBO2FBQ0EsTUFBQSxPQUFBO2dCQUNBLFVBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxRQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7O29CQUVBLFFBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7b0JBRUEsTUFBQTs7O2FBR0EsTUFBQSxhQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLGVBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsZ0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsdUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsdUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsaUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsd0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsd0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsa0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEseUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEseUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsY0FBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxxQkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxxQkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxlQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLDRCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLHFCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLDRCQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLGFBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsb0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsb0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsaUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsd0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsd0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsc0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsNkJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsNkJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsb0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsMkJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsMkJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7Ozs7Ozs7OztBQ3JVQTs7QUFFQSxRQUFBLE9BQUE7S0FDQSxVQUFBLGFBQUE7SUFDQTtRQUNBLFNBQUEsS0FBQSxPQUFBLFNBQUEsT0FBQSxTQUFBOzs7O1lBSUEsSUFBQSxTQUFBLFVBQUEsS0FBQTtnQkFDQSxNQUFBLE9BQUEsSUFBQSxLQUFBO2dCQUNBLE9BQUE7OztZQUdBLElBQUEsWUFBQSxVQUFBLEtBQUE7Z0JBQ0EsSUFBQSxDQUFBLEtBQUE7b0JBQ0EsT0FBQTs7Z0JBRUEsTUFBQSxJQUFBLEtBQUE7Z0JBQ0EsT0FBQTs7O1lBR0EsUUFBQSxTQUFBLFFBQUE7WUFDQSxRQUFBLFlBQUEsUUFBQTs7O1FBR0EsT0FBQTtZQUNBLFNBQUE7WUFDQSxNQUFBO1lBQ0EsVUFBQTs7O0FDN0JBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxlQUFBLE9BQUEsZ0JBQUE7SUFDQTtRQUNBLE9BQUEsU0FBQSxPQUFBO1FBQ0E7WUFDQSxRQUFBLFNBQUE7WUFDQSxJQUFBLE1BQUE7O1lBRUEsR0FBQSxNQUFBLFNBQUE7WUFDQTtnQkFDQSxNQUFBLE1BQUEsT0FBQSxHQUFBLGFBQUE7OztZQUdBO2dCQUNBLE1BQUE7OztZQUdBLE9BQUE7Ozs7Ozs7Ozs7QUNmQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSwrQkFBQSxVQUFBLFdBQUE7O1FBRUEsT0FBQTtZQUNBLGNBQUEsU0FBQSxJQUFBLFVBQUEsUUFBQTtnQkFDQSxJQUFBLFVBQUE7b0JBQ0EsYUFBQSxvQkFBQSxXQUFBO29CQUNBLGFBQUE7b0JBQ0EsWUFBQSxTQUFBLGlCQUFBLFFBQUE7b0JBQ0E7d0JBQ0EsT0FBQSxnQkFBQSxZQUFBOzRCQUNBLFVBQUE7Ozt3QkFHQSxPQUFBLGVBQUE7d0JBQ0E7NEJBQ0EsVUFBQTs7Ozs7Z0JBS0EsS0FBQTtnQkFDQTs7b0JBRUEsUUFBQSxRQUFBLE1BQUE7Ozs7Z0JBSUEsT0FBQSxVQUFBLEtBQUE7OztZQUdBLE1BQUEsVUFBQTtnQkFDQSxPQUFBLFVBQUE7OztZQUdBLE9BQUEsU0FBQSxPQUFBLFFBQUE7Z0JBQ0EsVUFBQTtvQkFDQSxVQUFBO3lCQUNBLE1BQUE7eUJBQ0EsUUFBQTt5QkFDQSxHQUFBOzs7O1lBSUEsU0FBQSxTQUFBLE9BQUEsT0FBQTtZQUNBO2dCQUNBLElBQUEsVUFBQSxVQUFBO3FCQUNBLE1BQUE7cUJBQ0EsWUFBQTtxQkFDQSxVQUFBO3FCQUNBLFlBQUE7cUJBQ0EsR0FBQTtxQkFDQSxPQUFBOztnQkFFQSxPQUFBLFVBQUEsS0FBQTs7Ozs7Ozs7OztBQ3hEQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxlQUFBLENBQUEsU0FBQSxlQUFBLFdBQUEsU0FBQSxPQUFBLGFBQUEsUUFBQTs7UUFFQSxJQUFBLGVBQUEsWUFBQSxJQUFBOztRQUVBLE9BQUE7O1lBRUEsZ0JBQUEsU0FBQTtZQUNBO2dCQUNBLGFBQUEsVUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsV0FBQTs7OztZQUlBLFlBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLFdBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtnQkFDQTs7O29CQUdBLEtBQUEsWUFBQSxTQUFBLEtBQUE7b0JBQ0EsTUFBQSxVQUFBOzs7O1lBSUEsaUJBQUEsU0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxZQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBO29CQUNBLFFBQUEsSUFBQTtvQkFDQSxNQUFBLFlBQUE7Ozs7WUFJQSxhQUFBLFNBQUEsT0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxZQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsV0FBQTs7OztZQUlBLGtCQUFBLFNBQUE7WUFDQTtnQkFDQSxZQUFBLElBQUEsYUFBQSxVQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxhQUFBOztvQkFFQSxRQUFBLElBQUE7Ozs7WUFJQSxjQUFBLFNBQUEsT0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxhQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7Ozs7b0JBSUEsS0FBQSxhQUFBLFFBQUEsS0FBQTtvQkFDQSxLQUFBLFdBQUEsUUFBQSxLQUFBOzs7b0JBR0EsS0FBQSxZQUFBLFNBQUEsS0FBQTs7b0JBRUEsS0FBQSxZQUFBOzs7b0JBR0EsTUFBQSxZQUFBOzs7O1lBSUEsY0FBQSxTQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLFNBQUEsVUFBQSxLQUFBLFNBQUE7Z0JBQ0E7b0JBQ0EsUUFBQSxJQUFBO29CQUNBLE1BQUEsU0FBQTs7OztZQUlBLFVBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLFNBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxRQUFBOzs7O1lBSUEsYUFBQSxTQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLFFBQUEsVUFBQSxLQUFBLFNBQUE7Z0JBQ0E7b0JBQ0EsUUFBQSxJQUFBO29CQUNBLE1BQUEsUUFBQTs7OztZQUlBLFNBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLFFBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxPQUFBOzs7O1lBSUEsaUJBQUEsU0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxZQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBO29CQUNBLFFBQUEsSUFBQTtvQkFDQSxNQUFBLFlBQUE7Ozs7WUFJQSxhQUFBLFNBQUEsT0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxZQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsV0FBQTs7OztZQUlBLFVBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsUUFBQSxJQUFBLG1CQUFBOztnQkFFQSxZQUFBLElBQUEsVUFBQSxPQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBO21CQUNBLFFBQUEsSUFBQTs7Ozs7WUFLQSxzQkFBQSxTQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLGlCQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBOztvQkFFQSxNQUFBLGlCQUFBOzs7O1lBSUEsa0JBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLGlCQUFBLElBQUEs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ZUFBQTtZQUNBLEtBQUEsUUFBQSxPQUFBOztZQUVBLEtBQUEsbUJBQUE7WUFDQSxLQUFBLG1CQUFBOztZQUVBLFFBQUEsSUFBQSxLQUFBOzs7UUFHQSxLQUFBLGlCQUFBLFNBQUEsR0FBQTtRQUNBO1lBQ0EsSUFBQTtZQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLFFBQUEsa0JBQUEsUUFBQTtZQUNBO2dCQUNBLEdBQUEsY0FBQSxLQUFBLFFBQUEsa0JBQUEsR0FBQTtnQkFDQTtvQkFDQSxnQkFBQTtvQkFDQTs7OztZQUlBLFFBQUEsSUFBQTs7WUFFQSxJQUFBLGNBQUEsV0FBQSxLQUFBLFFBQUE7WUFDQSxJQUFBLFNBQUEsV0FBQSxLQUFBLFFBQUEsa0JBQUEsZUFBQSxTQUFBLGFBQUEsU0FBQSxLQUFBLFFBQUEsa0JBQUEsZUFBQTtZQUNBLGVBQUE7WUFDQSxLQUFBLFFBQUEsT0FBQTs7WUFFQSxLQUFBLFFBQUEsa0JBQUEsT0FBQSxlQUFBOztZQUVBLEVBQUE7Ozs7O0lBS0EsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkJBQUEsQ0FBQSxTQUFBLFVBQUEsZUFBQSxnQkFBQSxlQUFBLGdCQUFBOzs7O0FDbEZBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEsd0JBQUEsT0FBQSxRQUFBLGFBQUEsYUFBQSxjQUFBLGNBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTs7O1FBR0EsWUFBQSxnQkFBQTtRQUNBLFlBQUEsV0FBQSxNQUFBLGFBQUE7O1FBRUEsS0FBQSxnQkFBQTtRQUNBOztZQUVBLEtBQUEsUUFBQSxNQUFBLEtBQUE7WUFDQTs7Z0JBRUEsYUFBQSxLQUFBO2dCQUNBLE9BQUEsR0FBQTtlQUNBO1lBQ0E7Z0JBQ0EsYUFBQSxLQUFBO2dCQUNBLFFBQUEsSUFBQTs7OztRQUlBLEtBQUEsZ0JBQUE7UUFDQTtZQUNBLEtBQUEsUUFBQSxTQUFBLEtBQUE7WUFDQTtnQkFDQSxRQUFBLElBQUE7Z0JBQ0EsYUFBQSxLQUFBO2dCQUNBLE9BQUEsR0FBQTs7ZUFFQTtZQUNBO2dCQUNBLGFBQUEsS0FB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TUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNkJBQUEsQ0FBQSxTQUFBLFVBQUEsZ0JBQUEsZUFBQSxlQUFBLGlCQUFBLFdBQUEsZ0JBQUE7Ozs7QUMxREEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSxvQkFBQSxPQUFBLFFBQUEsYUFBQSxhQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7O1FBRUEsS0FBQSxlQUFBO1FBQ0EsSUFBQSxhQUFBOztRQUVBLFlBQUEsaUJBQUE7O1FBRUEsUUFBQSxJQUFBOztRQUVBLEtBQUEsYUFBQSxTQUFBO1FBQ0E7O1lBRUEsSUFBQSxJQUFBLFFBQUE7O1lBRUEsSUFBQSxVQUFBLEVBQUEsS0FBQSxZQUFBOztZQUVBLEdBQUEsVUFBQTtZQUNBO2dCQUNBLE9BQUE7O2lCQUVBLEdBQUEsVUFBQSxLQUFBLFdBQUE7WUFDQTtnQkFDQSxPQUFBOztpQkFFQSxHQUFBLFVBQUEsS0FBQSxXQUFBO1lBQ0E7Z0JBQ0EsT0FBQTs7O1lBR0E7Z0JBQ0EsT0FBQTs7Ozs7OztRQU9BLEtBQUEscUJBQUEsU0FBQTtRQUNBO1lBQ0EsUUFBQSxJQUFBO1lBQ0EsUUFBQSxJQUFBOzs7OztJQUtBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHVCQUFBLENBQUEsU0FBQSxVQUFBLGVBQUEsZUFBQSxXQUFBOzs7QUFHQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJyxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgICdhcHAuY29udHJvbGxlcnMnLFxyXG4gICAgICAgICAgICAnYXBwLmZpbHRlcnMnLFxyXG4gICAgICAgICAgICAnYXBwLnNlcnZpY2VzJyxcclxuICAgICAgICAgICAgJ2FwcC5kaXJlY3RpdmVzJyxcclxuICAgICAgICAgICAgJ2FwcC5yb3V0ZXMnLFxyXG4gICAgICAgICAgICAnYXBwLmNvbmZpZydcclxuICAgICAgICBdKTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJywgWyd1aS5yb3V0ZXInLCAnc2F0ZWxsaXplcicsICdyZXN0YW5ndWxhcicsICdhbmd1bGFyLW1vbWVudGpzJ10pO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnLCBbJ3VpLnJvdXRlcicsICdzYXRlbGxpemVyJ10pO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycsIFsndWkucm91dGVyJywgJ25nTWF0ZXJpYWwnLCAncmVzdGFuZ3VsYXInLCAnYW5ndWxhci1tb21lbnRqcycsICdhcHAuc2VydmljZXMnLCAnbmdNZXNzYWdlcycsICduZ01kSWNvbnMnLCAnbWQuZGF0YS50YWJsZScsICdoaWdoY2hhcnRzLW5nJ10pO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJywgW10pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycsIFsnYW5ndWxhci1tb21lbnRqcyddKTtcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJywgW10pO1xyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gQ29uZmlndXJhdGlvbiBzdHVmZlxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24gKCRhdXRoUHJvdmlkZXIpXHJcbiAgICB7XHJcbiAgICAgICAgLy8gU2F0ZWxsaXplciBjb25maWd1cmF0aW9uIHRoYXQgc3BlY2lmaWVzIHdoaWNoIEFQSVxyXG4gICAgICAgIC8vIHJvdXRlIHRoZSBKV1Qgc2hvdWxkIGJlIHJldHJpZXZlZCBmcm9tXHJcbiAgICAgICAgJGF1dGhQcm92aWRlci5sb2dpblVybCA9ICcvYXBpL2F1dGhlbnRpY2F0ZSc7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoJG1vbWVudFByb3ZpZGVyKVxyXG4gICAge1xyXG4gICAgICAgICRtb21lbnRQcm92aWRlclxyXG4gICAgICAgICAgICAuYXN5bmNMb2FkaW5nKGZhbHNlKVxyXG4gICAgICAgICAgICAuc2NyaXB0VXJsKCcvL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9tb21lbnQuanMvMi41LjEvbW9tZW50Lm1pbi5qcycpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoIGZ1bmN0aW9uKFJlc3Rhbmd1bGFyUHJvdmlkZXIpIHtcclxuICAgICAgICBSZXN0YW5ndWxhclByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zZXRCYXNlVXJsKCcvYXBpLycpXHJcbiAgICAgICAgICAgIC5zZXREZWZhdWx0SGVhZGVycyh7IGFjY2VwdDogXCJhcHBsaWNhdGlvbi94LmxhcmF2ZWwudjEranNvblwiIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoIGZ1bmN0aW9uKCRtZFRoZW1pbmdQcm92aWRlcikge1xyXG4gICAgICAgIC8qIEZvciBtb3JlIGluZm8sIHZpc2l0IGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhcmpzLm9yZy8jL1RoZW1pbmcvMDFfaW50cm9kdWN0aW9uICovXHJcblxyXG4gICAgICAgIHZhciBjdXN0b21CbHVlTWFwID0gJG1kVGhlbWluZ1Byb3ZpZGVyLmV4dGVuZFBhbGV0dGUoJ2xpZ2h0LWJsdWUnLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgJ2NvbnRyYXN0RGVmYXVsdENvbG9yJzogJ2xpZ2h0JyxcclxuICAgICAgICAgICAgJ2NvbnRyYXN0RGFya0NvbG9ycyc6IFsnNTAnXSxcclxuICAgICAgICAgICAgJzUwJzogJ2ZmZmZmZidcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJG1kVGhlbWluZ1Byb3ZpZGVyLmRlZmluZVBhbGV0dGUoJ2N1c3RvbUJsdWUnLCBjdXN0b21CbHVlTWFwKTtcclxuICAgICAgICAkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2RlZmF1bHQnKVxyXG4gICAgICAgICAgICAucHJpbWFyeVBhbGV0dGUoJ2N1c3RvbUJsdWUnLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAnZGVmYXVsdCc6ICc1MDAnLFxyXG4gICAgICAgICAgICAgICAgJ2h1ZS0xJzogJzUwJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYWNjZW50UGFsZXR0ZSgncGluaycpO1xyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uKCRtZERhdGVMb2NhbGVQcm92aWRlcilcclxuICAgIHtcclxuICAgICAgICAkbWREYXRlTG9jYWxlUHJvdmlkZXIuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZihkYXRlICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSkuZm9ybWF0KCdNTS1ERC1ZWVlZJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG5cclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uKClcclxue1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycpLmNvbmZpZyggZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGF1dGhQcm92aWRlciApIHtcclxuXHJcbiAgICAgICAgdmFyIGdldFZpZXcgPSBmdW5jdGlvbiggdmlld05hbWUgKXtcclxuICAgICAgICAgICAgcmV0dXJuICcvdmlld3MvYXBwLycgKyB2aWV3TmFtZSArICcuaHRtbCc7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2xvZ2luJyk7XHJcblxyXG5cclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcCcsIHtcclxuICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2hlYWRlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSGVhZGVyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxIZWFkZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBmb290ZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2Zvb3RlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRm9vdGVyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxGb290ZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBtYWluOiB7fVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5sb2dpbicsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9sb2dpbicsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xvZ2luJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsTG9naW4nXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5sYW5kaW5nJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2xhbmRpbmcnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdsYW5kaW5nJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMYW5kaW5nQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxMYW5kaW5nJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucHJvZHVjdHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcHJvZHVjdHMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwcm9kdWN0cycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUHJvZHVjdCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnByb2R1Y3RzLmRldGFpbCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9kZXRhaWwvOnByb2R1Y3RJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3Byb2R1Y3QuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9kdWN0RGV0YWlsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQcm9kdWN0RGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucHJvZHVjdHMuY3JlYXRlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NyZWF0ZScsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3Byb2R1Y3QuY3JlYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9kdWN0Q3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQcm9kdWN0Q3JlYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuY3VzdG9tZXJzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2N1c3RvbWVycycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2N1c3RvbWVycycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ3VzdG9tZXJDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybEN1c3RvbWVyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuY3VzdG9tZXJzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdjdXN0b21lci5jcmVhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0N1c3RvbWVyQ3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxDdXN0b21lckNyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmN1c3RvbWVycy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzpjdXN0b21lcklkJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnY3VzdG9tZXIuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDdXN0b21lckRldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsQ3VzdG9tZXJEZXRhaWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC53b3Jrb3JkZXJzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3dvcmtvcmRlcnMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd3b3Jrb3JkZXJzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdXb3JrT3JkZXJDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFdvcmtPcmRlcidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLndvcmtvcmRlcnMuY3JlYXRlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NyZWF0ZScsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3dvcmtvcmRlci5jcmVhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtPcmRlckNyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsV29ya09yZGVyQ3JlYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAud29ya29yZGVycy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzp3b3JrT3JkZXJJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3dvcmtvcmRlci5kZXRhaWwnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1dvcmtPcmRlckRldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsV29ya09yZGVyRGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuZXZlbnRzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2V2ZW50cycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2V2ZW50cycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRXZlbnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybEV2ZW50J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuZXZlbnRzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdldmVudC5jcmVhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0V2ZW50Q3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxFdmVudENyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmV2ZW50cy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzpldmVudElkJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnZXZlbnQuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFdmVudERldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsRXZlbnREZXRhaWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5yZXBvcnRzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3JlcG9ydHMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdyZXBvcnRzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXBvcnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFJlcG9ydCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnJlcG9ydHMuY3VycmVudHN0b2NrJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2N1cnJlbnRzdG9jaycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3JlcG9ydC5jdXJyZW50c3RvY2snKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcG9ydENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUmVwb3J0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucmVwb3J0cy5zYWxlcycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9zYWxlcycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3JlcG9ydC5zYWxlcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVwb3J0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxSZXBvcnQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5yZXBvcnRzLnNhbGVzYnltb250aCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9zYWxlc2J5bW9udGgnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdyZXBvcnQuc2FsZXNieW1vbnRoJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXBvcnRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFJlcG9ydCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnVuaXRzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3VuaXRzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygndW5pdHMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VuaXRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFVuaXQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC51bml0cy5jcmVhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvY3JlYXRlJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygndW5pdC5jcmVhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VuaXRDcmVhdGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFVuaXRDcmVhdGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC51bml0cy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzp1bml0SWQnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd1bml0LmRldGFpbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVW5pdERldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsVW5pdERldGFpbCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLm1hdGVyaWFscycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9tYXRlcmlhbHMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdtYXRlcmlhbHMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01hdGVyaWFsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxNYXRlcmlhbCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLm1hdGVyaWFscy5jcmVhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvY3JlYXRlJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnbWF0ZXJpYWwuY3JlYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNYXRlcmlhbENyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsTWF0ZXJpYWxDcmVhdGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5tYXRlcmlhbHMuZGV0YWlsJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2RldGFpbC86bWF0ZXJpYWxJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ21hdGVyaWFsLmRldGFpbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWF0ZXJpYWxEZXRhaWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybE1hdGVyaWFsRGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucHVyY2hhc2VvcmRlcnMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcHVyY2hhc2VvcmRlcnMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwdXJjaGFzZW9yZGVycycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHVyY2hhc2VPcmRlckNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUHVyY2hhc2VPcmRlcidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnB1cmNoYXNlb3JkZXJzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwdXJjaGFzZW9yZGVyLmNyZWF0ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHVyY2hhc2VPcmRlckNyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUHVyY2hhc2VPcmRlckNyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnB1cmNoYXNlb3JkZXJzLmRldGFpbCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9kZXRhaWwvOnB1cmNoYXNlT3JkZXJJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3B1cmNoYXNlb3JkZXIuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQdXJjaGFzZU9yZGVyRGV0YWlsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQdXJjaGFzZU9yZGVyRGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucGF5bWVudHR5cGVzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3BheW1lbnR0eXBlcycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3BheW1lbnR0eXBlcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUGF5bWVudFR5cGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFBheW1lbnRUeXBlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucGF5bWVudHR5cGVzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwYXltZW50dHlwZS5jcmVhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1BheW1lbnRUeXBlQ3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQYXltZW50VHlwZUNyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnBheW1lbnR0eXBlcy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzpwYXltZW50VHlwZUlkJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncGF5bWVudHR5cGUuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQYXltZW50VHlwZURldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUGF5bWVudFR5cGVEZXRhaWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuXHJcbiAgICAgICAgICAgIDtcclxuXHJcbiAgICB9ICk7XHJcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJylcclxuICAgIC5kaXJlY3RpdmUoJ3V0Y1BhcnNlcicsIGZ1bmN0aW9uICgpXHJcbiAgICB7XHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMsIG5nTW9kZWwpIHtcclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJJbiB1dGNQYXJzZXIgZGlyZWN0aXZlXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHBhcnNlciA9IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICAgICAgICAgIHZhbCA9IG1vbWVudC51dGModmFsKS5mb3JtYXQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB2YXIgZm9ybWF0dGVyID0gZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF2YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFsID0gbmV3IERhdGUodmFsKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBuZ01vZGVsLiRwYXJzZXJzLnVuc2hpZnQocGFyc2VyKTtcclxuICAgICAgICAgICAgbmdNb2RlbC4kZm9ybWF0dGVycy51bnNoaWZ0KGZvcm1hdHRlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXF1aXJlOiAnbmdNb2RlbCcsXHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQSdcclxuICAgICAgICB9O1xyXG4gICAgfSk7IiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImFwcC5maWx0ZXJzXCIpLmZpbHRlcigndHJ1bmNhdGVOYW1lJywgZnVuY3Rpb24oKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihpbnB1dCwgbWF4TGVuZ3RoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW5wdXQgPSBpbnB1dCB8fCBcIlwiO1xyXG4gICAgICAgICAgICB2YXIgb3V0ID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGlmKGlucHV0Lmxlbmd0aCA+IG1heExlbmd0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgb3V0ID0gaW5wdXQuc3Vic3RyKDAsIG1heExlbmd0aCkgKyBcIi4uLlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgb3V0ID0gaW5wdXQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxufSkoKTtcclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgQnJlZW4gb24gMTUvMDIvMjAxNi5cclxuICovXHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0RpYWxvZ1NlcnZpY2UnLCBmdW5jdGlvbiggJG1kRGlhbG9nICl7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGZyb21UZW1wbGF0ZTogZnVuY3Rpb24oZXYsIHRlbXBsYXRlLCBzY29wZSApIHtcclxuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpYWxvZ3MvJyArIHRlbXBsYXRlICsgJy5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRFdmVudDogZXYsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gRGlhbG9nQ29udHJvbGxlcigkc2NvcGUsICRtZERpYWxvZylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jb25maXJtRGlhbG9nID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jYW5jZWxEaWFsb2cgPSBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRtZERpYWxvZy5jYW5jZWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggc2NvcGUgKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2NvcGUgPSBzY29wZS4kbmV3KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9vcHRpb25zLnByZXNlcnZlU2NvcGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiAkbWREaWFsb2cuc2hvdyhvcHRpb25zKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGhpZGU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJG1kRGlhbG9nLmhpZGUoKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFsZXJ0OiBmdW5jdGlvbih0aXRsZSwgY29udGVudCl7XHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuc2hvdyhcclxuICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuYWxlcnQoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGl0bGUodGl0bGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jb250ZW50KGNvbnRlbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vaygnT2snKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGNvbmZpcm06IGZ1bmN0aW9uKGV2ZW50LCB0aXRsZSwgY29udGVudClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbmZpcm0gPSAkbWREaWFsb2cuY29uZmlybSgpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRpdGxlKHRpdGxlKVxyXG4gICAgICAgICAgICAgICAgICAgIC50ZXh0Q29udGVudChjb250ZW50KVxyXG4gICAgICAgICAgICAgICAgICAgIC5hcmlhTGFiZWwoJycpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRhcmdldEV2ZW50KGV2ZW50KVxyXG4gICAgICAgICAgICAgICAgICAgIC5vaygnWWVzJylcclxuICAgICAgICAgICAgICAgICAgICAuY2FuY2VsKCdObycpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiAkbWREaWFsb2cuc2hvdyhjb25maXJtKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgQnJlZW4gb24gMTUvMDIvMjAxNi5cclxuICovXHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ1Jlc3RTZXJ2aWNlJywgWyckYXV0aCcsICdSZXN0YW5ndWxhcicsICckbW9tZW50JywgZnVuY3Rpb24oJGF1dGgsIFJlc3Rhbmd1bGFyLCAkbW9tZW50KXtcclxuXHJcbiAgICAgICAgdmFyIGJhc2VQcm9kdWN0cyA9IFJlc3Rhbmd1bGFyLmFsbCgncHJvZHVjdCcpO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICAgICAgZ2V0QWxsUHJvZHVjdHM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBiYXNlUHJvZHVjdHMuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnByb2R1Y3RzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0UHJvZHVjdDogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3Byb2R1Y3QnLCBpZCkuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSGFjayBmb3IgT0xEIG15c3FsIGRyaXZlcnMgb24gSG9zdGdhdG9yIHdoaWNoIGRvbid0IHByb3Blcmx5IGVuY29kZSBpbnRlZ2VyIGFuZCByZXR1cm4gdGhlbSBhcyBzdHJpbmdzXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5pc19jdXN0b20gPSBwYXJzZUludChkYXRhLmlzX2N1c3RvbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvZHVjdCA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEFsbEN1c3RvbWVyczogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnY3VzdG9tZXInKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmN1c3RvbWVycyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEN1c3RvbWVyOiBmdW5jdGlvbihzY29wZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnY3VzdG9tZXInLCBpZCkuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY3VzdG9tZXIgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRBbGxXb3JrT3JkZXJzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCd3b3Jrb3JkZXInKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUud29ya29yZGVycyA9IGRhdGE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0V29ya09yZGVyOiBmdW5jdGlvbihzY29wZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnd29ya29yZGVyJywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBGb3JtYXQgc3RyaW5nIGRhdGVzIGludG8gZGF0ZSBvYmplY3RzXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5zdGFydF9kYXRlID0gJG1vbWVudChkYXRhLnN0YXJ0X2RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuZW5kX2RhdGUgPSAkbW9tZW50KGRhdGEuZW5kX2RhdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBIYWNrIGZvciBPTEQgbXlzcWwgZHJpdmVycyBvbiBIb3N0Z2F0b3Igd2hpY2ggZG9uJ3QgcHJvcGVybHkgZW5jb2RlIGludGVnZXIgYW5kIHJldHVybiB0aGVtIGFzIHN0cmluZ3NcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLmNvbXBsZXRlZCA9IHBhcnNlSW50KGRhdGEuY29tcGxldGVkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi53b3Jrb3JkZXIgPSBkYXRhO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUud29ya29yZGVyID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsRXZlbnRzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdldmVudCcpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuZXZlbnRzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0RXZlbnQ6IGZ1bmN0aW9uKHNjb3BlLCBpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdldmVudCcsIGlkKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5ldmVudCA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEFsbFVuaXRzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCd1bml0JykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS51bml0cyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldFVuaXQ6IGZ1bmN0aW9uKHNjb3BlLCBpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCd1bml0JywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnVuaXQgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRBbGxNYXRlcmlhbHM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ21hdGVyaWFsJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5tYXRlcmlhbHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRNYXRlcmlhbDogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ21hdGVyaWFsJywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLm1hdGVyaWFsID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZG9TZWFyY2g6IGZ1bmN0aW9uKHNjb3BlLCBxdWVyeSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDYWxsIFdTIHdpdGg6IFwiICsgcXVlcnkpO1xyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnc2VhcmNoJywgcXVlcnkpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEFsbFB1cmNoYXNlT3JkZXJzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdwdXJjaGFzZW9yZGVyJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnB1cmNoYXNlb3JkZXJzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0UHVyY2hhc2VPcmRlcjogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3B1cmNoYXNlb3JkZXInLCBpZCkuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEZvcm1hdCBzdHJpbmcgZGF0ZXMgaW50byBkYXRlIG9iamVjdHNcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLnBpY2t1cF9kYXRlID0gJG1vbWVudChkYXRhLnBpY2t1cF9kYXRlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSGFjayBmb3IgT0xEIG15c3FsIGRyaXZlcnMgb24gSG9zdGdhdG9yIHdoaWNoIGRvbid0IHByb3Blcmx5IGVuY29kZSBpbnRlZ2VyIGFuZCByZXR1cm4gdGhlbSBhcyBzdHJpbmdzXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5mdWxmaWxsZWQgPSBwYXJzZUludChkYXRhLmZ1bGZpbGxlZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnB1cmNoYXNlb3JkZXIgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRBbGxQYXltZW50VHlwZXM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3BheW1lbnR0eXBlJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5wYXltZW50dHlwZXMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRQYXltZW50VHlwZTogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3BheW1lbnR0eXBlJywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnBheW1lbnR0eXBlID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0TWF0ZXJpYWxBbGxUeXBlczogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnbWF0ZXJpYWx0eXBlJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5tYXRlcmlhbHR5cGVzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0RnVsbHlCb29rZWREYXlzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdzY2hlZHVsZXIvZ2V0RnVsbHlCb29rZWREYXlzJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5ib29rZWREYXlzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfTtcclxuICAgIH1dKTtcclxufSkoKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBCcmVlbiBvbiAxNS8wMi8yMDE2LlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnVG9hc3RTZXJ2aWNlJywgZnVuY3Rpb24oICRtZFRvYXN0ICl7XHJcblxyXG4gICAgICAgIHZhciBkZWxheSA9IDYwMDAsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gJ3RvcCByaWdodCcsXHJcbiAgICAgICAgICAgIGFjdGlvbiA9ICdPSyc7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHNob3c6IGZ1bmN0aW9uKGNvbnRlbnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkbWRUb2FzdC5zaG93KFxyXG4gICAgICAgICAgICAgICAgICAgICRtZFRvYXN0LnNpbXBsZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jb250ZW50KGNvbnRlbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5wb3NpdGlvbihwb3NpdGlvbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFjdGlvbihhY3Rpb24pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5oaWRlRGVsYXkoZGVsYXkpXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gQ29yZUNvbnRyb2xsZXIoJHNjb3BlLCAkYXV0aCwgJG1vbWVudCwgJG1kU2lkZW5hdiwgJG1kTWVkaWEpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG5cclxuICAgICAgICAkc2NvcGUudG9kYXlzRGF0ZSA9IHRvZGF5O1xyXG4gICAgICAgICRzY29wZS5zaG93U2VhcmNoID0gZmFsc2U7XHJcblxyXG4gICAgICAgICRzY29wZS50b2dnbGVTaWRlbmF2ID0gZnVuY3Rpb24obWVudUlkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgJG1kU2lkZW5hdihtZW51SWQpLnRvZ2dsZSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5zaG93U2lkZU5hdiA9IGZ1bmN0aW9uKG1lbnVJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKCEkbWRTaWRlbmF2KG1lbnVJZCkuaXNMb2NrZWRPcGVuKCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICRtZFNpZGVuYXYobWVudUlkKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuaGlkZVNpZGVOYXYgPSBmdW5jdGlvbihtZW51SWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZighJG1kU2lkZW5hdihtZW51SWQpLmlzTG9ja2VkT3BlbigpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAkbWRTaWRlbmF2KG1lbnVJZCkuY2xvc2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS50b2dnbGVTZWFyY2ggPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAkc2NvcGUuc2hvd1NlYXJjaCA9ICEkc2NvcGUuc2hvd1NlYXJjaDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBMaXN0ZW4gZm9yIHRvZ2dsZVNlYXJjaCBldmVudHNcclxuICAgICAgICAkc2NvcGUuJG9uKFwidG9nZ2xlU2VhcmNoXCIsIGZ1bmN0aW9uIChldmVudCwgYXJncylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICRzY29wZS50b2dnbGVTZWFyY2goKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvcmVDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJGF1dGgnLCAnJG1vbWVudCcsICckbWRTaWRlbmF2JywgJyRtZE1lZGlhJywgQ29yZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gQ3VzdG9tZXJDcmVhdGVDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZUN1c3RvbWVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5jdXN0b21lcik7XHJcblxyXG4gICAgICAgICAgICB2YXIgYyA9IHNlbGYuY3VzdG9tZXI7XHJcblxyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ2N1c3RvbWVyJykucG9zdChjKS50aGVuKGZ1bmN0aW9uKGQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGQpO1xyXG4gICAgICAgICAgICAgICAgLy8kc3RhdGUuZ28oJ2FwcC5jdXN0b21lcnMuZGV0YWlsJywgeydjdXN0b21lcklkJzogZC5uZXdJZH0pO1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmN1c3RvbWVycycpO1xyXG5cclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGNyZWF0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0N1c3RvbWVyQ3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCBDdXN0b21lckNyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gQ3VzdG9tZXJEZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0Q3VzdG9tZXIoc2VsZiwgJHN0YXRlUGFyYW1zLmN1c3RvbWVySWQpO1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZUN1c3RvbWVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5jdXN0b21lci5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgdXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5jdXN0b21lcnNcIik7XHJcblxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZUN1c3RvbWVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5jdXN0b21lci5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5jdXN0b21lcnNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBEZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNob3dEZWxldGVDb25maXJtID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGV2LCAnRGVsZXRlIGN1c3RvbWVyPycsICdUaGlzIHdpbGwgYWxzbyBkZWxldGUgYW55IHdvcmsgb3JkZXJzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGN1c3RvbWVyJyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZUN1c3RvbWVyKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0N1c3RvbWVyRGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIEN1c3RvbWVyRGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBDdXN0b21lckNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsQ3VzdG9tZXJzKHNlbGYpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ3VzdG9tZXJDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCBDdXN0b21lckNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gRXZlbnRDcmVhdGVDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5ldmVudCA9IHt9O1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZUV2ZW50ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5ldmVudCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZSA9IHNlbGYuZXZlbnQ7XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCRlcnJvcik7XHJcblxyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ2V2ZW50JykucG9zdChlKS50aGVuKGZ1bmN0aW9uKGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmV2ZW50cycpO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFdmVudENyZWF0ZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCBFdmVudENyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gRXZlbnREZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgJHN0YXRlUGFyYW1zLCBUb2FzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLnNlbGVjdGVkUHJvZHVjdCA9IFwiXCI7XHJcbiAgICAgICAgc2VsZi5zZWxlY3RlZFF1YW50aXR5ID0gMDtcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEV2ZW50KHNlbGYsICRzdGF0ZVBhcmFtcy5ldmVudElkKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuXHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlRXZlbnQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL1Jlc3RTZXJ2aWNlLnVwZGF0ZVByb2R1Y3Qoc2VsZiwgc2VsZi5wcm9kdWN0LmlkKTtcclxuICAgICAgICAgICAgc2VsZi5ldmVudC5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLmV2ZW50c1wiKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5hZGRQcm9kdWN0ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5zZWxlY3RlZFByb2R1Y3QpO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5ldmVudC5ldmVudF9wcm9kdWN0cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGV2ZW50X2lkOiBzZWxmLmV2ZW50LmlkLFxyXG4gICAgICAgICAgICAgICAgcHJvZHVjdF9pZDogc2VsZi5zZWxlY3RlZFByb2R1Y3QuaWQsXHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eTogc2VsZi5zZWxlY3RlZFF1YW50aXR5LFxyXG4gICAgICAgICAgICAgICAgcHJvZHVjdDogc2VsZi5zZWxlY3RlZFByb2R1Y3RcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkUHJvZHVjdCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRRdWFudGl0eSA9IDA7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVQcm9kdWN0ID0gZnVuY3Rpb24oZSwgcHJvZHVjdElkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4VG9SZW1vdmU7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzZWxmLmV2ZW50LmV2ZW50X3Byb2R1Y3RzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihwcm9kdWN0SWQgPT0gc2VsZi5ldmVudC5ldmVudF9wcm9kdWN0c1tpXS5wcm9kdWN0X2lkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4VG9SZW1vdmUgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpbmRleFRvUmVtb3ZlKTtcclxuICAgICAgICAgICAgc2VsZi5ldmVudC5ldmVudF9wcm9kdWN0cy5zcGxpY2UoaW5kZXhUb1JlbW92ZSwgMSk7XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVFdmVudCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuZXZlbnQucmVtb3ZlKCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGRlbGV0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRlZWx0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAuZXZlbnRzXCIpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgRGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zaG93RGVsZXRlQ29uZmlybSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZyA9IERpYWxvZ1NlcnZpY2UuY29uZmlybShldiwgJ0RlbGV0ZSBldmVudD8nLCAnJyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZUV2ZW50KCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0V2ZW50RGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsICdUb2FzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsIEV2ZW50RGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBFdmVudENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsRXZlbnRzKHNlbGYpO1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFdmVudENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsIEV2ZW50Q29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBGb290ZXJDb250cm9sbGVyKCRtb21lbnQpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYuY3VycmVudFllYXIgPSAkbW9tZW50KCkuZm9ybWF0KCdZWVlZJyk7XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0Zvb3RlckNvbnRyb2xsZXInLCBbJyRtb21lbnQnLCBGb290ZXJDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEhlYWRlckNvbnRyb2xsZXIoJGF1dGgsICRtb21lbnQpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLnRvZGF5c0RhdGUgPSAkbW9tZW50KCkuZm9ybWF0KCdkZGRkLCBNTU1NIERvIFlZWVknKTtcclxuXHJcbiAgICAgICAgc2VsZi5pc0F1dGhlbnRpY2F0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRhdXRoLmlzQXV0aGVudGljYXRlZCgpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hlYWRlckNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRtb21lbnQnLCBIZWFkZXJDb250cm9sbGVyXSk7XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gTGFuZGluZ0NvbnRyb2xsZXIoJHN0YXRlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTGFuZGluZ0NvbnRyb2xsZXInLCBbJyRzdGF0ZScsIExhbmRpbmdDb250cm9sbGVyXSk7XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gTG9naW5Db250cm9sbGVyKCRhdXRoLCAkc3RhdGUpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLnRpdGxlID0gJ0xvZ2luJztcclxuXHJcbiAgICAgICAgc2VsZi5yZXF1ZXN0VG9rZW4gPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgY3JlZGVudGlhbHMgPSB7IGVtYWlsOiBzZWxmLmVtYWlsLCBwYXNzd29yZDogc2VsZi5wYXNzd29yZCB9O1xyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhjcmVkZW50aWFscyk7XHJcblxyXG4gICAgICAgICAgICAvLyBVc2UgU2F0ZWxsaXplcidzICRhdXRoIHNlcnZpY2UgdG8gbG9naW4gYmVjYXVzZSBpdCdsbCBhdXRvbWF0aWNhbGx5IHNhdmUgdGhlIEpXVCBpbiBsb2NhbFN0b3JhZ2VcclxuICAgICAgICAgICAgJGF1dGgubG9naW4oY3JlZGVudGlhbHMpLnRoZW4oZnVuY3Rpb24gKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIElmIGxvZ2luIGlzIHN1Y2Nlc3NmdWwsIHJlZGlyZWN0IHRvIHRoZSB1c2VycyBzdGF0ZVxyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAubGFuZGluZycpO1xyXG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnRXJyb3IgbG9nZ2luZyBpbicpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBUaGlzIHJlcXVlc3Qgd2lsbCBoaXQgdGhlIGdldERhdGEgbWV0aG9kIGluIHRoZSBBdXRoZW50aWNhdGVDb250cm9sbGVyXHJcbiAgICAgICAgLy8gb24gdGhlIExhcmF2ZWwgc2lkZSBhbmQgd2lsbCByZXR1cm4geW91ciBkYXRhIHRoYXQgcmVxdWlyZSBhdXRoZW50aWNhdGlvblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICRzY29wZS5nZXREYXRhID0gZnVuY3Rpb24oKVxyXG4gICAgICAgICB7XHJcbiAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnYXV0aGVudGljYXRlL2RhdGEnKS5nZXQoKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7XHJcblxyXG4gICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3Ipe30pO1xyXG4gICAgICAgICB9O1xyXG4gICAgICAgICAqL1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMb2dpbkNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsIExvZ2luQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBNYXRlcmlhbENyZWF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgVG9hc3RTZXJ2aWNlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFVuaXRzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldE1hdGVyaWFsQWxsVHlwZXMoc2VsZik7XHJcblxyXG4gICAgICAgIHNlbGYuY3JlYXRlTWF0ZXJpYWwgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLm1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBtID0gc2VsZi5tYXRlcmlhbDtcclxuXHJcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnbWF0ZXJpYWwnKS5wb3N0KG0pLnRoZW4oZnVuY3Rpb24oZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgICAgICAvLyRzdGF0ZS5nbygnYXBwLmN1c3RvbWVycy5kZXRhaWwnLCB7J2N1c3RvbWVySWQnOiBkLm5ld0lkfSk7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBjcmVhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAubWF0ZXJpYWxzJyk7XHJcblxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgY3JlYXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTWF0ZXJpYWxDcmVhdGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIE1hdGVyaWFsQ3JlYXRlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBNYXRlcmlhbERldGFpbENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgVG9hc3RTZXJ2aWNlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFVuaXRzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldE1hdGVyaWFsQWxsVHlwZXMoc2VsZik7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJHN0YXRlUGFyYW1zKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRNYXRlcmlhbChzZWxmLCAkc3RhdGVQYXJhbXMubWF0ZXJpYWxJZCk7XHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlTWF0ZXJpYWwgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLm1hdGVyaWFsLnB1dCgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLm1hdGVyaWFsc1wiKTtcclxuXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlTWF0ZXJpYWwgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLm1hdGVyaWFsLnJlbW92ZSgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBkZWxldGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLm1hdGVyaWFsc1wiKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIERlbGV0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNob3dEZWxldGVDb25maXJtID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGV2LCAnRGVsZXRlIG1hdGVyaWFsPycsICdUaGlzIHdpbGwgYWxzbyByZW1vdmUgdGhlIG1hdGVyaWFsIGZyb20gYW55IHByb2R1Y3RzIHVzaW5nIGl0Jyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZU1hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ01hdGVyaWFsRGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIE1hdGVyaWFsRGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBNYXRlcmlhbENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsTWF0ZXJpYWxzKHNlbGYpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTWF0ZXJpYWxDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCBNYXRlcmlhbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUGF5bWVudFR5cGVDcmVhdGVDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZVBheW1lbnRUeXBlID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5wYXltZW50dHlwZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYyA9IHNlbGYucGF5bWVudHR5cGU7XHJcblxyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3BheW1lbnR0eXBlJykucG9zdChjKS50aGVuKGZ1bmN0aW9uKGQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGQpO1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLnBheW1lbnR0eXBlcycpO1xyXG5cclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGNyZWF0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1BheW1lbnRUeXBlQ3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCBQYXltZW50VHlwZUNyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUGF5bWVudFR5cGVEZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0UGF5bWVudFR5cGUoc2VsZiwgJHN0YXRlUGFyYW1zLnBheW1lbnRUeXBlSWQpO1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZVBheW1lbnRUeXBlID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5wYXltZW50dHlwZS5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgdXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5wYXltZW50dHlwZXNcIik7XHJcblxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVBheW1lbnRUeXBlID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5wYXltZW50dHlwZS5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5wYXltZW50dHlwZXNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBEZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNob3dEZWxldGVDb25maXJtID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGV2LCAnRGVsZXRlIHBheW1lbnQgdHlwZT8nLCAnJyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZVBheW1lbnRUeXBlKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1BheW1lbnRUeXBlRGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIFBheW1lbnRUeXBlRGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBQYXltZW50VHlwZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUGF5bWVudFR5cGVzKHNlbGYpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUGF5bWVudFR5cGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCBQYXltZW50VHlwZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUHJvZHVjdENyZWF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFRvYXN0U2VydmljZSwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbE1hdGVyaWFscyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi5wcm9kdWN0ID0ge307XHJcbiAgICAgICAgc2VsZi5wcm9kdWN0LmNvc3QgPSAwO1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZVByb2R1Y3QgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnByb2R1Y3QpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHAgPSBzZWxmLnByb2R1Y3Q7XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCRlcnJvcik7XHJcblxyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3Byb2R1Y3QnKS5wb3N0KHApLnRoZW4oZnVuY3Rpb24oZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkKTtcclxuICAgICAgICAgICAgICAgIC8vJHN0YXRlLmdvKCdhcHAucHJvZHVjdHMuZGV0YWlsJywgeydwcm9kdWN0SWQnOiBkLm5ld0lkfSk7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBjcmVhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucHJvZHVjdHMnKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGNyZWF0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFkZE1hdGVyaWFsID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5zZWxlY3RlZE1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscyA9PT0gdW5kZWZpbmVkKSB7IHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscyA9IFtdOyB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbF9pZDogc2VsZi5zZWxlY3RlZE1hdGVyaWFsLmlkLFxyXG4gICAgICAgICAgICAgICAgcXVhbnRpdHk6IHNlbGYuc2VsZWN0ZWRRdWFudGl0eSxcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsOiBzZWxmLnNlbGVjdGVkTWF0ZXJpYWxcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZihzZWxmLnByb2R1Y3QuY29zdCA9PT0gdW5kZWZpbmVkIHx8IHNlbGYucHJvZHVjdC5jb3N0ID09PSBudWxsKSB7IHNlbGYucHJvZHVjdC5jb3N0ID0gMDsgfVxyXG4gICAgICAgICAgICB2YXIgY3VycmVudENvc3QgPSBwYXJzZUZsb2F0KHNlbGYucHJvZHVjdC5jb3N0KTtcclxuICAgICAgICAgICAgdmFyIGJ0ZXN0ID0gKHBhcnNlRmxvYXQoc2VsZi5zZWxlY3RlZE1hdGVyaWFsLnVuaXRfY29zdCkgKiBwYXJzZUludChzZWxmLnNlbGVjdGVkUXVhbnRpdHkpKTtcclxuICAgICAgICAgICAgY3VycmVudENvc3QgKz0gYnRlc3Q7XHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5jb3N0ID0gY3VycmVudENvc3Q7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkTWF0ZXJpYWwgPSBcIlwiO1xyXG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkUXVhbnRpdHkgPSAwO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5wcm9kdWN0KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZU1hdGVyaWFsID0gZnVuY3Rpb24oZSwgbWF0ZXJpYWxJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleFRvUmVtb3ZlO1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihtYXRlcmlhbElkID09IHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFsc1tpXS5tYXRlcmlhbF9pZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleFRvUmVtb3ZlID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coaW5kZXhUb1JlbW92ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY3VycmVudENvc3QgPSBwYXJzZUZsb2F0KHNlbGYucHJvZHVjdC5jb3N0KTtcclxuICAgICAgICAgICAgdmFyIGJ0ZXN0ID0gKHBhcnNlRmxvYXQoc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzW2luZGV4VG9SZW1vdmVdLm1hdGVyaWFsLnVuaXRfY29zdCkgKiBwYXJzZUludChzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHNbaW5kZXhUb1JlbW92ZV0ucXVhbnRpdHkpKTtcclxuICAgICAgICAgICAgY3VycmVudENvc3QgLT0gYnRlc3Q7XHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5jb3N0ID0gY3VycmVudENvc3Q7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMuc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQcm9kdWN0Q3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1RvYXN0U2VydmljZScsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCBQcm9kdWN0Q3JlYXRlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBQcm9kdWN0RGV0YWlsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcywgVG9hc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbE1hdGVyaWFscyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRQcm9kdWN0KHNlbGYsICRzdGF0ZVBhcmFtcy5wcm9kdWN0SWQpO1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZVByb2R1Y3QgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL1Jlc3RTZXJ2aWNlLnVwZGF0ZVByb2R1Y3Qoc2VsZiwgc2VsZi5wcm9kdWN0LmlkKTtcclxuICAgICAgICAgICAgc2VsZi5wcm9kdWN0LnB1dCgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwidXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IHVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAucHJvZHVjdHNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlUHJvZHVjdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWVsdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5wcm9kdWN0c1wiKTtcclxuXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBkZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2hvd0RlbGV0ZUNvbmZpcm0gPSBmdW5jdGlvbihldilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZXYsICdEZWxldGUgcHJvZHVjdD8nLCAnVGhpcyB3aWxsIGFsc28gZGVsZXRlIGFueSB3b3JrIG9yZGVyIG9yIGV2ZW50IHN0b2NrIGxldmVscyBhc3NvY2lhdGVkIHdpdGggdGhpcyBwcm9kdWN0Jyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5kZWxldGVQcm9kdWN0KCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFkZE1hdGVyaWFsID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5zZWxlY3RlZE1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscyA9PT0gdW5kZWZpbmVkKSB7IHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscyA9IFtdOyB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBzZWxmLnByb2R1Y3QuaWQsXHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbF9pZDogc2VsZi5zZWxlY3RlZE1hdGVyaWFsLmlkLFxyXG4gICAgICAgICAgICAgICAgcXVhbnRpdHk6IHNlbGYuc2VsZWN0ZWRRdWFudGl0eSxcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsOiBzZWxmLnNlbGVjdGVkTWF0ZXJpYWxcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY3VycmVudENvc3QgPSBwYXJzZUZsb2F0KHNlbGYucHJvZHVjdC5jb3N0KTtcclxuICAgICAgICAgICAgdmFyIGJ0ZXN0ID0gKHBhcnNlRmxvYXQoc2VsZi5zZWxlY3RlZE1hdGVyaWFsLnVuaXRfY29zdCkgKiBwYXJzZUludChzZWxmLnNlbGVjdGVkUXVhbnRpdHkpKTtcclxuICAgICAgICAgICAgY3VycmVudENvc3QgKz0gYnRlc3Q7XHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5jb3N0ID0gY3VycmVudENvc3Q7XHJcblxyXG5cclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZE1hdGVyaWFsID0gXCJcIjtcclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFF1YW50aXR5ID0gMDtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVNYXRlcmlhbCA9IGZ1bmN0aW9uKGUsIG1hdGVyaWFsSWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXhUb1JlbW92ZTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYobWF0ZXJpYWxJZCA9PSBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHNbaV0ubWF0ZXJpYWxfaWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhUb1JlbW92ZSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGluZGV4VG9SZW1vdmUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRDb3N0ID0gcGFyc2VGbG9hdChzZWxmLnByb2R1Y3QuY29zdCk7XHJcbiAgICAgICAgICAgIHZhciBidGVzdCA9IChwYXJzZUZsb2F0KHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFsc1tpbmRleFRvUmVtb3ZlXS5tYXRlcmlhbC51bml0X2Nvc3QpICogcGFyc2VJbnQoc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzW2luZGV4VG9SZW1vdmVdLnF1YW50aXR5KSk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDb3N0IC09IGJ0ZXN0O1xyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QuY29zdCA9IGN1cnJlbnRDb3N0O1xyXG5cclxuXHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscy5zcGxpY2UoaW5kZXhUb1JlbW92ZSwgMSk7XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUHJvZHVjdERldGFpbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCAnVG9hc3RTZXJ2aWNlJywgJ0RpYWxvZ1NlcnZpY2UnLCBQcm9kdWN0RGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBQcm9kdWN0Q29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYuZmlsdGVyVHlwZSA9IFwiXCI7XHJcbiAgICAgICAgc2VsZi5maWx0ZXJPcGVyYXRvciA9IFwiXCI7XHJcbiAgICAgICAgc2VsZi5maWx0ZXJWYWx1ZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFByb2R1Y3RzKHNlbGYpO1xyXG5cclxuICAgICAgICBzZWxmLmFwcGx5UHJvZHVjdEZpbHRlciA9IGZ1bmN0aW9uKHApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZihzZWxmLmZpbHRlclR5cGUgIT09IFwiXCIgJiYgc2VsZi5maWx0ZXJPcGVyYXRvciAhPT0gXCJcIiAmJiBzZWxmLmZpbHRlclZhbHVlICE9PSBcIlwiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImhpXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5VG9GaWx0ZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoKHNlbGYuZmlsdGVyVHlwZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwic3RvY2tcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlUb0ZpbHRlciA9IHBhcnNlSW50KHAuY3VycmVudF9zdG9jayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwcmljZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVRvRmlsdGVyID0gcGFyc2VGbG9hdChwLnByaWNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImNvc3RcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlUb0ZpbHRlciA9IHBhcnNlRmxvYXQocC5jb3N0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5maWx0ZXJPcGVyYXRvciA9PT0gXCI9XCIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VG9GaWx0ZXIgPT0gcGFyc2VGbG9hdChzZWxmLmZpbHRlclZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYoc2VsZi5maWx0ZXJPcGVyYXRvciA9PT0gXCI+XCIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VG9GaWx0ZXIgPiBwYXJzZUZsb2F0KHNlbGYuZmlsdGVyVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihzZWxmLmZpbHRlck9wZXJhdG9yID09PSBcIj49XCIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VG9GaWx0ZXIgPj0gc2VsZi5maWx0ZXJWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYoc2VsZi5maWx0ZXJPcGVyYXRvciA9PT0gXCI8XCIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VG9GaWx0ZXIgPCBwYXJzZUZsb2F0KHNlbGYuZmlsdGVyVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihzZWxmLmZpbHRlck9wZXJhdG9yID09PSBcIjw9XCIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VG9GaWx0ZXIgPD0gcGFyc2VGbG9hdChzZWxmLmZpbHRlclZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUHJvZHVjdENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsIFByb2R1Y3RDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFB1cmNoYXNlT3JkZXJDcmVhdGVDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsICRzY29wZSwgJG1vbWVudCwgUmVzdGFuZ3VsYXIsIFRvYXN0U2VydmljZSwgUmVzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbEN1c3RvbWVycyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQYXltZW50VHlwZXMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0RnVsbHlCb29rZWREYXlzKHNlbGYpO1xyXG5cclxuICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIgPSB7fTtcclxuICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIuYW1vdW50X3BhaWQgPSAwO1xyXG4gICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5kaXNjb3VudCA9IDA7XHJcbiAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID0gMDtcclxuXHJcbiAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnN1cHByZXNzd29ya29yZGVyID0gMDtcclxuXHJcbiAgICAgICAgdmFyIG9yaWdpbmFsVG90YWwgPSAwO1xyXG5cclxuICAgICAgICBzZWxmLm9ubHlPcGVuRGF5cyA9IGZ1bmN0aW9uKGRhdGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYuYm9va2VkRGF5cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLmJvb2tlZERheXNbaV0uc3RhcnRfZGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCRtb21lbnQoc2VsZi5ib29rZWREYXlzW2ldLnN0YXJ0X2RhdGUpKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9ICEkbW9tZW50KGRhdGUpLmlzU2FtZShzZWxmLmJvb2tlZERheXNbaV0uc3RhcnRfZGF0ZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZVB1cmNoYXNlT3JkZXIgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnB1cmNoYXNlb3JkZXIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHAgPSBzZWxmLnB1cmNoYXNlb3JkZXI7XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCRlcnJvcik7XHJcblxyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3B1cmNoYXNlb3JkZXInKS5wb3N0KHApLnRoZW4oZnVuY3Rpb24oZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkKTtcclxuICAgICAgICAgICAgICAgIC8vJHN0YXRlLmdvKCdhcHAucHJvZHVjdHMuZGV0YWlsJywgeydwcm9kdWN0SWQnOiBkLm5ld0lkfSk7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBjcmVhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucHVyY2hhc2VvcmRlcnMnKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGNyZWF0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFwcGx5RGlzY291bnQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIuZGlzY291bnQgPT0gbnVsbCB8fCBzZWxmLnB1cmNoYXNlb3JkZXIuZGlzY291bnQgPT0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID0gb3JpZ2luYWxUb3RhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsICE9PSBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID4gMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGlzY291bnRlZCA9IG9yaWdpbmFsVG90YWwgLSBzZWxmLnB1cmNoYXNlb3JkZXIuZGlzY291bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzY291bnRlZCA+PSAwID8gc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID0gZGlzY291bnRlZCA6IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFkZFByb2R1Y3QgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnNlbGVjdGVkUHJvZHVjdCk7XHJcblxyXG4gICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMgPT09IHVuZGVmaW5lZCkgeyBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMgPSBbXTsgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgcHJvZHVjdF9pZDogc2VsZi5zZWxlY3RlZFByb2R1Y3QuaWQsXHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eTogc2VsZi5zZWxlY3RlZFF1YW50aXR5LFxyXG4gICAgICAgICAgICAgICAgcHJvZHVjdDogc2VsZi5zZWxlY3RlZFByb2R1Y3RcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPT09IHVuZGVmaW5lZCB8fCBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPT09IG51bGwpIHsgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID0gMDsgfVxyXG4gICAgICAgICAgICB2YXIgY3VycmVudENvc3QgPSBwYXJzZUZsb2F0KHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCk7XHJcbiAgICAgICAgICAgIHZhciBidGVzdCA9IChwYXJzZUZsb2F0KHNlbGYuc2VsZWN0ZWRQcm9kdWN0LnByaWNlKSAqIHBhcnNlSW50KHNlbGYuc2VsZWN0ZWRRdWFudGl0eSkpO1xyXG4gICAgICAgICAgICBjdXJyZW50Q29zdCArPSBidGVzdDtcclxuICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID0gY3VycmVudENvc3Q7XHJcbiAgICAgICAgICAgIG9yaWdpbmFsVG90YWwgPSBjdXJyZW50Q29zdDtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRQcm9kdWN0ID0gXCJcIjtcclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFF1YW50aXR5ID0gMDtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYucHVyY2hhc2VvcmRlcik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVQcm9kdWN0ID0gZnVuY3Rpb24oZSwgcHJvZHVjdElkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4VG9SZW1vdmU7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHByb2R1Y3RJZCA9PSBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaV0ucHJvZHVjdF9pZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleFRvUmVtb3ZlID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coaW5kZXhUb1JlbW92ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY3VycmVudENvc3QgPSBwYXJzZUZsb2F0KHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCk7XHJcbiAgICAgICAgICAgIHZhciBidGVzdCA9IChwYXJzZUZsb2F0KHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0c1tpbmRleFRvUmVtb3ZlXS5wcm9kdWN0LnByaWNlKSAqIHBhcnNlSW50KHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0c1tpbmRleFRvUmVtb3ZlXS5xdWFudGl0eSkpO1xyXG4gICAgICAgICAgICBjdXJyZW50Q29zdCAtPSBidGVzdDtcclxuICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID0gY3VycmVudENvc3Q7XHJcbiAgICAgICAgICAgIG9yaWdpbmFsVG90YWwgPSBjdXJyZW50Q29zdDtcclxuXHJcbiAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cy5zcGxpY2UoaW5kZXhUb1JlbW92ZSwgMSk7XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZXRlcm1pbmVXb3JrT3JkZXJzID0gZnVuY3Rpb24oZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cyAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIuc3VwcHJlc3N3b3Jrb3JkZXIgPT0gMSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBKdXN0IHByb2Nlc3MgdGhlIFBPIGFzIG5vcm1hbFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY3JlYXRlUHVyY2hhc2VPcmRlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvZHVjdHNUb0Z1bGZpbGwgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0c1RvRnVsZmlsbC5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2R1Y3RfaWQ6IHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0c1tpXS5wcm9kdWN0X2lkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHk6IHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0c1tpXS5xdWFudGl0eVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnc2NoZWR1bGVyL2dldFdvcmtPcmRlcnMnKS5wb3N0KHtwcm9kdWN0c1RvRnVsZmlsbDogcHJvZHVjdHNUb0Z1bGZpbGx9KS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEud29ya09yZGVyc1RvQ3JlYXRlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEud29ya09yZGVyc1RvQ3JlYXRlID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlcmUgYXJlIHdvcmtvcmRlcnMgbmVlZGVkIGZvciB0aGlzIFBPLCBjb25maXJtIHRoZWlyIGNyZWF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUud29ya09yZGVyc1RvQ3JlYXRlID0gZGF0YS53b3JrT3JkZXJzVG9DcmVhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUud29ya09yZGVycyA9IGRhdGEud29ya09yZGVycztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEaWFsb2dTZXJ2aWNlLmZyb21UZW1wbGF0ZShlLCAnZGxnQ29uZmlybVdvcmtPcmRlcnMnLCAkc2NvcGUpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIud29ya19vcmRlcnMgPSAkc2NvcGUud29ya09yZGVycztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnY29uZmlybWVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY3JlYXRlUHVyY2hhc2VPcmRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdjYW5jZWxsZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSnVzdCBwcm9jZXNzIHRoZSBQTyBhcyBub3JtYWxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY3JlYXRlUHVyY2hhc2VPcmRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUHVyY2hhc2VPcmRlckNyZWF0ZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICckc2NvcGUnLCAnJG1vbWVudCcsICdSZXN0YW5ndWxhcicsICdUb2FzdFNlcnZpY2UnLCAnUmVzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsICckc3RhdGVQYXJhbXMnLCBQdXJjaGFzZU9yZGVyQ3JlYXRlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBQdXJjaGFzZU9yZGVyRGV0YWlsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCAkc2NvcGUsICRtb21lbnQsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgJHN0YXRlUGFyYW1zLCBUb2FzdFNlcnZpY2UsIERpYWxvZ1NlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsQ3VzdG9tZXJzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFByb2R1Y3RzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFBheW1lbnRUeXBlcyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRQdXJjaGFzZU9yZGVyKHNlbGYsICRzdGF0ZVBhcmFtcy5wdXJjaGFzZU9yZGVySWQpO1xyXG5cclxuICAgICAgICB2YXIgb3JpZ2luYWxUb3RhbCA9IDA7XHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlUHVyY2hhc2VPcmRlciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLnB1cmNoYXNlb3JkZXJzXCIpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVB1cmNoYXNlT3JkZXIgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIucmVtb3ZlKCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGVlbHRlZFwiKTtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGRlbGV0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAucHVyY2hhc2VvcmRlcnNcIik7XHJcblxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgZGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGRlbGV0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNob3dEZWxldGVDb25maXJtID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGV2LCAnRGVsZXRlIHB1cmNoYXNlIG9yZGVyPycsICcnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZVB1cmNoYXNlT3JkZXIoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYXBwbHlEaXNjb3VudCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci5kaXNjb3VudCA9PSBudWxsIHx8IHNlbGYucHVyY2hhc2VvcmRlci5kaXNjb3VudCA9PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBvcmlnaW5hbFRvdGFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAmJiBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgIT09IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAmJiBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPiAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkaXNjb3VudGVkID0gb3JpZ2luYWxUb3RhbCAtIHNlbGYucHVyY2hhc2VvcmRlci5kaXNjb3VudDtcclxuICAgICAgICAgICAgICAgICAgICBkaXNjb3VudGVkID49IDAgPyBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSBkaXNjb3VudGVkIDogMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYWRkUHJvZHVjdCA9IGZ1bmN0aW9uKGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnNlbGVjdGVkUHJvZHVjdCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcG9wT2JqID0ge1xyXG4gICAgICAgICAgICAgICAgcHJvZHVjdF9pZDogc2VsZi5zZWxlY3RlZFByb2R1Y3QuaWQsXHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eTogc2VsZi5zZWxlY3RlZFF1YW50aXR5LFxyXG4gICAgICAgICAgICAgICAgcHJvZHVjdDogc2VsZi5zZWxlY3RlZFByb2R1Y3RcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnc2NoZWR1bGVyL2dldFdvcmtPcmRlcnMnKS5wb3N0KHtwcm9kdWN0c1RvRnVsZmlsbDogW3BvcE9ial0sIHB1cmNoYXNlT3JkZXJJZDogc2VsZi5wdXJjaGFzZW9yZGVyLmlkfSkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLndvcmtPcmRlcnNUb0NyZWF0ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzID09PSB1bmRlZmluZWQpIHsgc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzID0gW107IH1cclxuICAgICAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cy5wdXNoKHBvcE9iaik7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUmVjYWxjdWxhdGUgUE8gdG90YWxcclxuICAgICAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9PT0gdW5kZWZpbmVkIHx8IHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9PT0gbnVsbCkgeyBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPSAwOyB9XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudENvc3QgPSBwYXJzZUZsb2F0KHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgYnRlc3QgPSAocGFyc2VGbG9hdChzZWxmLnNlbGVjdGVkUHJvZHVjdC5wcmljZSkgKiBwYXJzZUludChzZWxmLnNlbGVjdGVkUXVhbnRpdHkpKTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRDb3N0ICs9IGJ0ZXN0O1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID0gY3VycmVudENvc3Q7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFRvdGFsID0gY3VycmVudENvc3Q7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFByb2R1Y3QgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFF1YW50aXR5ID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihkYXRhLndvcmtPcmRlcnNUb0NyZWF0ZSA+IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlcmUgYXJlIHdvcmtvcmRlcnMgbmVlZGVkIGZvciB0aGlzIFBPLCBhbGVydCBvZiB0aGVpciBjcmVhdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS53b3JrT3JkZXJzVG9DcmVhdGUgPSBkYXRhLndvcmtPcmRlcnNUb0NyZWF0ZTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUud29ya09yZGVycyA9IGRhdGEud29ya09yZGVycztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgRGlhbG9nU2VydmljZS5mcm9tVGVtcGxhdGUoZSwgJ2RsZ0FsZXJ0V29ya09yZGVycycsICRzY29wZSkudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY29uZmlybWVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgYWRkaW5nIHByb2R1Y3QsIHBsZWFzZSB0cnkgYWdhaW5cIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlUHJvZHVjdCA9IGZ1bmN0aW9uKGUsIHByb2R1Y3RJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleFRvUmVtb3ZlO1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihwcm9kdWN0SWQgPT0gc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzW2ldLnByb2R1Y3RfaWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhUb1JlbW92ZSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaW5kZXhUb1JlbW92ZSk7XHJcblxyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3NjaGVkdWxlci9yZXN0b3JlU3RvY2tGb3JQcm9kdWN0JykucG9zdCh7cHVyY2hhc2Vfb3JkZXJfaWQ6IHNlbGYucHVyY2hhc2VvcmRlci5pZCwgcHJvZHVjdF9pZDogc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzW2luZGV4VG9SZW1vdmVdLnByb2R1Y3RfaWR9KS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIFJlY2FsY3VsYXRlIFBPIHRvdGFsXHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudENvc3QgPSBwYXJzZUZsb2F0KHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgYnRlc3QgPSAocGFyc2VGbG9hdChzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaW5kZXhUb1JlbW92ZV0ucHJvZHVjdC5wcmljZSkgKiBwYXJzZUludChzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaW5kZXhUb1JlbW92ZV0ucXVhbnRpdHkpKTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRDb3N0IC09IGJ0ZXN0O1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID0gY3VycmVudENvc3Q7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFRvdGFsID0gY3VycmVudENvc3Q7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzLnNwbGljZShpbmRleFRvUmVtb3ZlLCAxKTtcclxuXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZyBzdG9jaywgcGxlYXNlIHRyeSBhZ2FpblwiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUHVyY2hhc2VPcmRlckRldGFpbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICckc2NvcGUnLCAnJG1vbWVudCcsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCAnVG9hc3RTZXJ2aWNlJywgJ0RpYWxvZ1NlcnZpY2UnLCBQdXJjaGFzZU9yZGVyRGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBQdXJjaGFzZU9yZGVyQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQdXJjaGFzZU9yZGVycyhzZWxmKTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUHVyY2hhc2VPcmRlckNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsIFB1cmNoYXNlT3JkZXJDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFJlcG9ydENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5yZXBvcnRQYXJhbXMgPSB7fTtcclxuXHJcbiAgICAgICAgaWYoJHN0YXRlLmlzKCdhcHAucmVwb3J0cy5jdXJyZW50c3RvY2snKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdlbmVyYXRlQ3VycmVudFN0b2NrUmVwb3J0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoJHN0YXRlLmlzKCdhcHAucmVwb3J0cy5zYWxlcycpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2hvd1NhbGVzUmVwb3J0VmlldygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKCRzdGF0ZS5pcygnYXBwLnJlcG9ydHMuc2FsZXNieW1vbnRoJykpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzaG93U2FsZXNSZXBvcnRCeU1vbnRoVmlldygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBSZXBvcnQgaG9tZVxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZS5pcygnYXBwLnJlcG9ydHMnKSk7XHJcbiAgICAgICAgICAgIHNob3dEYXNoYm9hcmRXaWRnZXRzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZUN1cnJlbnRTdG9ja1JlcG9ydCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdlbmVyYXRlIHN0b2NrIHJlcnBvcnRcIik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2hvd1NhbGVzUmVwb3J0VmlldygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxDdXN0b21lcnMoc2VsZik7XHJcbiAgICAgICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFByb2R1Y3RzKHNlbGYpO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93RGFzaGJvYXJkV2lkZ2V0cygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLnRvcFNlbGxpbmdDaGFydENvbmZpZyA9IHtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncGllJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcGxvdE9wdGlvbnM6XHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbG93UG9pbnRTZWxlY3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFMYWJlbHM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdUb3Agc2VsbGluZyBwcm9kdWN0cyBhbGwgdGltZSdcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgbG9hZGluZzogdHJ1ZVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdyZXBvcnRzL2dldFRvcFNlbGxpbmdQcm9kdWN0cycpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGFTZXQgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvbmVEYXRhUG9pbnQgPSBkYXRhW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG9uZURhdGFQb2ludCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFTZXQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBvbmVEYXRhUG9pbnQubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkOiAoaSA9PT0gMCkgPyB0cnVlIDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGljZWQ6IChpID09PSAwKSA/IHRydWUgOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IHBhcnNlSW50KG9uZURhdGFQb2ludC5wY291bnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYudG9wU2VsbGluZ0NoYXJ0Q29uZmlnLnNlcmllcyA9IFt7bmFtZTogJ1NvbGQnLCBkYXRhOiBkYXRhU2V0IH1dO1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYudG9wU2VsbGluZ0NoYXJ0Q29uZmlnLmxvYWRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gRXJyb3JcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNob3dTYWxlc1JlcG9ydEJ5TW9udGhWaWV3KClcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICBzZWxmLmNoYXJ0Q29uZmlnID0ge1xyXG4gICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjb2x1bW4nXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB5QXhpczpcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbjogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICcjIG9mIHNhbGVzJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB4QXhpczpcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkYXRldGltZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGVUaW1lTGFiZWxGb3JtYXRzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb250aDogJyViJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHllYXI6ICclYidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdEYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB0b29sdGlwOlxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdTYWxlcyBwZXIgbW9udGgnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIGxvYWRpbmc6IHRydWVcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgncmVwb3J0cy9nZXRNb250aGx5U2FsZXNSZXBvcnQnKS5wb3N0KHsgJ3JlcG9ydFBhcmFtcyc6IHt9fSkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFTZXQgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvbmVEYXRhUG9pbnQgPSBkYXRhW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhvbmVEYXRhUG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhU2V0LnB1c2goW0RhdGUuVVRDKHBhcnNlSW50KG9uZURhdGFQb2ludC55ZWFyKSwgcGFyc2VJbnQob25lRGF0YVBvaW50Lm1vbnRoKSAtIDEpLCBwYXJzZUludChvbmVEYXRhUG9pbnQucG9jb3VudCldKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY2hhcnRDb25maWcuc2VyaWVzID0gW3tuYW1lOiAnU2FsZXMgdGhpcyBtb250aCcsIGRhdGE6IGRhdGFTZXQgfV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY2hhcnRDb25maWcubG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnN3YXBDaGFydFR5cGUgPSBmdW5jdGlvbiAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuY2hhcnRDb25maWcub3B0aW9ucy5jaGFydC50eXBlID09PSAnbGluZScpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuY2hhcnRDb25maWcub3B0aW9ucy5jaGFydC50eXBlID0gJ2Jhcic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmNoYXJ0Q29uZmlnLm9wdGlvbnMuY2hhcnQudHlwZSA9ICdsaW5lJztcclxuICAgICAgICAgICAgICAgIHNlbGYuY2hhcnRDb25maWcub3B0aW9ucy5jaGFydC56b29tVHlwZSA9ICd4JztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHNlbGYuZ2V0U2FsZXNSZXBvcnQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnJlcG9ydFBhcmFtcyk7XHJcbiAgICAgICAgICAgIHNlbGYucG9Ub3RhbCA9IDA7XHJcbiAgICAgICAgICAgIHNlbGYucG9Db3VudCA9IDA7XHJcblxyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3JlcG9ydHMvZ2V0U2FsZXNSZXBvcnQnKS5wb3N0KHsgJ3JlcG9ydFBhcmFtcyc6IHNlbGYucmVwb3J0UGFyYW1zfSkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnJlc3VsdHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wb0NvdW50ID0gZGF0YS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxmLnJlc3VsdHNbMF0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIEVycm9yXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2V0UG9Ub3RhbCA9IGZ1bmN0aW9uKGl0ZW0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKTtcclxuICAgICAgICAgICAgaWYoaXRlbSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wb1RvdGFsICs9IHBhcnNlRmxvYXQoaXRlbS50b3RhbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1JlcG9ydENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsIFJlcG9ydENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gU2VhcmNoQ29udHJvbGxlcigkc2NvcGUsICRhdXRoLCBSZXN0YW5ndWxhciwgJHN0YXRlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5ub0NhY2hlID0gdHJ1ZTtcclxuICAgICAgICBzZWxmLnNlYXJjaFRleHQgPSBcIlwiO1xyXG4gICAgICAgIHNlbGYuc2VsZWN0ZWRSZXN1bHQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIHNlbGYuZG9TZWFyY2ggPSBmdW5jdGlvbihxdWVyeSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vUmVzdFNlcnZpY2UuZG9TZWFyY2goc2VsZiwgc2VsZi5zZWFyY2hUZXh0KTtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLm9uZSgnc2VhcmNoJywgcXVlcnkpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmZpcmVUb2dnbGVTZWFyY2hFdmVudCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIC8vc2VsZi4kcm9vdC4kYnJvYWRjYXN0KFwidG9nZ2xlU2VhcmNoXCIsIHt1c2VybmFtZTogJHNjb3BlLnVzZXIudXNlcm5hbWUgfSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kcm9vdC4kYnJvYWRjYXN0KFwidG9nZ2xlU2VhcmNoXCIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZ290b0l0ZW0gPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnNlbGVjdGVkUmVzdWx0KTtcclxuICAgICAgICAgICAgaWYoc2VsZi5zZWxlY3RlZFJlc3VsdCAhPT0gbnVsbCAmJiBzZWxmLnNlbGVjdGVkUmVzdWx0ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoVGV4dCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmZpcmVUb2dnbGVTZWFyY2hFdmVudCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHN3aXRjaChzZWxmLnNlbGVjdGVkUmVzdWx0LmNvbnRlbnRfdHlwZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicHJvZHVjdFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5wcm9kdWN0cy5kZXRhaWwnLCB7J3Byb2R1Y3RJZCc6IHNlbGYuc2VsZWN0ZWRSZXN1bHQuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJjdXN0b21lclwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5jdXN0b21lcnMuZGV0YWlsJywgeydjdXN0b21lcklkJzogc2VsZi5zZWxlY3RlZFJlc3VsdC5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImV2ZW50XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmV2ZW50cy5kZXRhaWwnLCB7J2V2ZW50SWQnOiBzZWxmLnNlbGVjdGVkUmVzdWx0LmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwid29ya29yZGVyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLndvcmtvcmRlcnMuZGV0YWlsJywgeyd3b3JrT3JkZXJJZCc6IHNlbGYuc2VsZWN0ZWRSZXN1bHQuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJtYXRlcmlhbFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5tYXRlcmlhbHMuZGV0YWlsJywgeydtYXRlcmlhbElkJzogc2VsZi5zZWxlY3RlZFJlc3VsdC5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInB1cmNoYXNlb3JkZXJcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucHVyY2hhc2VvcmRlcnMuZGV0YWlsJywgeydwdXJjaGFzZU9yZGVySWQnOiBzZWxmLnNlbGVjdGVkUmVzdWx0LmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2VhcmNoQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRhdXRoJywgJ1Jlc3Rhbmd1bGFyJywgJyRzdGF0ZScsIFNlYXJjaENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gVW5pdENyZWF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgVG9hc3RTZXJ2aWNlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYuY3JlYXRlVW5pdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYudW5pdCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYyA9IHNlbGYudW5pdDtcclxuXHJcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgndW5pdCcpLnBvc3QoYykudGhlbihmdW5jdGlvbihkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkKTtcclxuICAgICAgICAgICAgICAgIC8vJHN0YXRlLmdvKCdhcHAuY3VzdG9tZXJzLmRldGFpbCcsIHsnY3VzdG9tZXJJZCc6IGQubmV3SWR9KTtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC51bml0cycpO1xyXG5cclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGNyZWF0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1VuaXRDcmVhdGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIFVuaXRDcmVhdGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFVuaXREZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0VW5pdChzZWxmLCAkc3RhdGVQYXJhbXMudW5pdElkKTtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVVbml0ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi51bml0LnB1dCgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLnVuaXRzXCIpO1xyXG5cclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVVbml0ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi51bml0LnJlbW92ZSgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBkZWxldGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLnVuaXRzXCIpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgRGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zaG93RGVsZXRlQ29uZmlybSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZyA9IERpYWxvZ1NlcnZpY2UuY29uZmlybShldiwgJ0RlbGV0ZSB1bml0PycsICcnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlVW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdVbml0RGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIFVuaXREZXRhaWxDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFVuaXRDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFVuaXRzKHNlbGYpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVW5pdENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsIFVuaXRDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFdvcmtPcmRlckNyZWF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFRvYXN0U2VydmljZSwgJG1vbWVudCwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbEN1c3RvbWVycyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi5jcmVhdGVXb3JrT3JkZXIgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL1R1ZSBGZWIgMDIgMjAxNiAwMDowMDowMCBHTVQtMDQwMCAoQXRsYW50aWMgU3RhbmRhcmQgVGltZSlcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi53b3Jrb3JkZXIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHcgPSBzZWxmLndvcmtvcmRlcjtcclxuXHJcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnd29ya29yZGVyJykucG9zdCh3KS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgIC8vJHN0YXRlLmdvKCdhcHAud29ya29yZGVycy5kZXRhaWwnLCB7J3dvcmtPcmRlcklkJzogMX0pO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAud29ya29yZGVycycpO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignV29ya09yZGVyQ3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1RvYXN0U2VydmljZScsICckbW9tZW50JywgJ1Jlc3RTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIFdvcmtPcmRlckNyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gV29ya09yZGVyRGV0YWlsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBUb2FzdFNlcnZpY2UsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgRGlhbG9nU2VydmljZSwgJG1vbWVudCwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldFdvcmtPcmRlcihzZWxmLCAkc3RhdGVQYXJhbXMud29ya09yZGVySWQpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbEN1c3RvbWVycyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuXHJcblxyXG4gICAgICAgIHNlbGYudG9nZ2xlQ29tcGxldGUgPSBmdW5jdGlvbihjYlN0YXRlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coY2JTdGF0ZSk7XHJcbiAgICAgICAgICAgIC8vaWYoY2JTdGF0ZSkgeyBzZWxmLndvcmtvcmRlci5jb21wbGV0ZWQgPSAxOyB9XHJcbiAgICAgICAgICAgIC8vZWxzZSB7IHNlbGYud29ya29yZGVyLmNvbXBsZXRlZCA9IDA7IH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZVdvcmtPcmRlciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYud29ya29yZGVyLnB1dCgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLndvcmtvcmRlcnNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVXb3JrT3JkZXIgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLndvcmtvcmRlci5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC53b3Jrb3JkZXJzXCIpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgZGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2hvd0RlbGV0ZUNvbmZpcm0gPSBmdW5jdGlvbihldilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZXYsICdEZWxldGUgd29yayBvcmRlcj8nLCAnJyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZVdvcmtPcmRlcigpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdXb3JrT3JkZXJEZXRhaWxDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnVG9hc3RTZXJ2aWNlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJ0RpYWxvZ1NlcnZpY2UnLCAnJG1vbWVudCcsICckc3RhdGVQYXJhbXMnLCBXb3JrT3JkZXJEZXRhaWxDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFdvcmtPcmRlckNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCAkbW9tZW50KVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5zaG93Q29tcGxldGUgPSBmYWxzZTtcclxuICAgICAgICB2YXIgdG9kYXlzRGF0ZSA9ICRtb21lbnQoKTtcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsV29ya09yZGVycyhzZWxmKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coc2VsZik7XHJcblxyXG4gICAgICAgIHNlbGYuc2V0VXJnZW5jeSA9IGZ1bmN0aW9uKG9iakRhdGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyAzIGRheXMsIDcgZGF5cywgMzAgZGF5cywgdGhlIHJlc3RcclxuICAgICAgICAgICAgdmFyIGQgPSAkbW9tZW50KG9iakRhdGUpO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGQpO1xyXG4gICAgICAgICAgICB2YXIgZGF5RGlmZiA9IGQuZGlmZih0b2RheXNEYXRlLCAnZGF5cycpO1xyXG5cclxuICAgICAgICAgICAgaWYoZGF5RGlmZiA+IDMwKSAvLyBncmVlblxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJmYXJXb3JrT3JkZXJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKGRheURpZmYgPiA3ICYmIGRheURpZmYgPD0gMzApIC8vIGJsdWVcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiY2xvc2VXb3JrT3JkZXJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKGRheURpZmYgPiAzICYmIGRheURpZmYgPD0gNykgLy8gb3JhbmdlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImNsb3NlcldvcmtPcmRlclwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgLy8gcmVkXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImNsb3Nlc3RXb3JrT3JkZXJcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkLmRpZmYodG9kYXlzRGF0ZSwgJ2RheXMnKSk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYudG9nZ2xlQ29tcGxldGVPbmx5ID0gZnVuY3Rpb24oY2JTdGF0ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0b2dnbGUnKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coY2JTdGF0ZSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1dvcmtPcmRlckNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckbW9tZW50JywgV29ya09yZGVyQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
