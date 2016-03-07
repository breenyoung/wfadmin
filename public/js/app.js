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
    angular.module('app.controllers', ['ui.router', 'ngMaterial', 'restangular', 'angular-momentjs', 'app.services', 'ngMessages', 'ngMdIcons', 'md.data.table']);
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
                        controllerAs: 'ctrlReports'
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
            fromTemplate: function( template, $scope ) {

                var options = {
                    templateUrl: '/views/dialogs/' + template + '/' + template + '.html'
                };

                if ( $scope ){
                    options.scope = $scope.$new();
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

        RestService.getAllProducts(self);
    }

    angular.module('app.controllers').controller('ProductController', ['$auth', '$state', 'Restangular', 'RestService', ProductController]);

})();

(function(){
    "use strict";

    function PurchaseOrderCreateController($auth, $state, Restangular, ToastService, RestService, $stateParams)
    {
        var self = this;

        RestService.getAllCustomers(self);
        RestService.getAllProducts(self);
        RestService.getAllPaymentTypes(self);

        self.purchaseorder = {};
        self.purchaseorder.amount_paid = 0;
        self.purchaseorder.total = 0;


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

        self.addPurchaseOrder = function()
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

            self.selectedProduct = "";
            self.selectedQuantity = 0;

            console.log(self.purchaseorder);
        };

        self.deletePurchaseOrder = function(e, productId)
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

            self.purchaseorder.purchase_order_products.splice(indexToRemove, 1);

            e.preventDefault();
        };

    }

    angular.module('app.controllers').controller('PurchaseOrderCreateController', ['$auth', '$state', 'Restangular', 'ToastService', 'RestService', '$stateParams', PurchaseOrderCreateController]);

})();

(function(){
    "use strict";

    function PurchaseOrderDetailController($auth, $state, Restangular, RestService, $stateParams, ToastService, DialogService)
    {
        var self = this;

        //console.log($stateParams);
        RestService.getAllCustomers(self);
        RestService.getAllProducts(self);
        RestService.getAllPaymentTypes(self);
        RestService.getPurchaseOrder(self, $stateParams.purchaseOrderId);

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

        self.addProduct = function()
        {
            console.log(self.selectedProduct);

            if(self.purchaseorder.purchase_order_products === undefined) { self.purchaseorder.purchase_order_products = []; }

            self.purchaseorder.purchase_order_products.push({
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
            for(var i = 0; i < self.purchaseorder.purchase_order_products.length; i++)
            {
                if(productId == self.purchaseorder.purchase_order_products[i].product_id)
                {
                    indexToRemove = i;
                    break;
                }
            }

            console.log(indexToRemove);

            self.purchaseorder.purchase_order_products.splice(indexToRemove, 1);

            e.preventDefault();
        };
    }

    angular.module('app.controllers').controller('PurchaseOrderDetailController', ['$auth', '$state', 'Restangular', 'RestService', '$stateParams', 'ToastService', 'DialogService', PurchaseOrderDetailController]);

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
        self.selectedResult;

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
            if(self.selectedResult != null && self.selectedResult != undefined)
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
                }
            }
        }
    }

    angular.module('app.controllers').controller('SearchController', ['$scope', '$auth', 'Restangular', '$state', SearchController]);

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHAuanMiLCJhcHAvcm91dGVzLmpzIiwiYXBwL2RpcmVjdGl2ZXMvdXRjLXBhcnNlci5kaXJlY3RpdmUuanMiLCJhcHAvZmlsdGVycy90cnVuY2F0ZU5hbWUuanMiLCJhcHAvc2VydmljZXMvZGlhbG9nLmpzIiwiYXBwL3NlcnZpY2VzL3Jlc3QuanMiLCJhcHAvc2VydmljZXMvdG9hc3QuanMiLCJhcHAvY29udHJvbGxlcnMvY29yZS9jb3JlLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2N1c3RvbWVycy9jdXN0b21lci5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvY3VzdG9tZXJzL2N1c3RvbWVyLmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy9jdXN0b21lcnMvY3VzdG9tZXJzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2V2ZW50cy9ldmVudC5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvZXZlbnRzL2V2ZW50LmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy9ldmVudHMvZXZlbnRzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2Zvb3Rlci9mb290ZXIuanMiLCJhcHAvY29udHJvbGxlcnMvaGVhZGVyL2hlYWRlci5qcyIsImFwcC9jb250cm9sbGVycy9sYW5kaW5nL2xhbmRpbmcuanMiLCJhcHAvY29udHJvbGxlcnMvbG9naW4vbG9naW4uanMiLCJhcHAvY29udHJvbGxlcnMvbWF0ZXJpYWxzL21hdGVyaWFsLmNyZWF0ZS5qcyIsImFwcC9jb250cm9sbGVycy9tYXRlcmlhbHMvbWF0ZXJpYWwuZGV0YWlsLmpzIiwiYXBwL2NvbnRyb2xsZXJzL21hdGVyaWFscy9tYXRlcmlhbHMuanMiLCJhcHAvY29udHJvbGxlcnMvcGF5bWVudF90eXBlcy9wYXltZW50dHlwZS5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvcGF5bWVudF90eXBlcy9wYXltZW50dHlwZS5kZXRhaWwuanMiLCJhcHAvY29udHJvbGxlcnMvcGF5bWVudF90eXBlcy9wYXltZW50dHlwZXMuanMiLCJhcHAvY29udHJvbGxlcnMvcHJvZHVjdHMvcHJvZHVjdC5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvcHJvZHVjdHMvcHJvZHVjdC5kZXRhaWwuanMiLCJhcHAvY29udHJvbGxlcnMvcHJvZHVjdHMvcHJvZHVjdHMuanMiLCJhcHAvY29udHJvbGxlcnMvcHVyY2hhc2VvcmRlcnMvcHVyY2hhc2VvcmRlci5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvcHVyY2hhc2VvcmRlcnMvcHVyY2hhc2VvcmRlci5kZXRhaWwuanMiLCJhcHAvY29udHJvbGxlcnMvcHVyY2hhc2VvcmRlcnMvcHVyY2hhc2VvcmRlcnMuanMiLCJhcHAvY29udHJvbGxlcnMvcmVwb3J0cy9yZXBvcnRzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3NlYXJjaC9zZWFyY2guanMiLCJhcHAvY29udHJvbGxlcnMvd29ya29yZGVycy93b3Jrb3JkZXIuY3JlYXRlLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3dvcmtvcmRlcnMvd29ya29yZGVyLmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy93b3Jrb3JkZXJzL3dvcmtvcmRlcnMuanMiLCJhcHAvY29udHJvbGxlcnMvdW5pdHMvdW5pdC5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvdW5pdHMvdW5pdC5kZXRhaWwuanMiLCJhcHAvY29udHJvbGxlcnMvdW5pdHMvdW5pdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsSUFBQSxNQUFBLFFBQUEsT0FBQTtRQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBOzs7SUFHQSxRQUFBLE9BQUEsZ0JBQUEsQ0FBQSxhQUFBLGNBQUEsZUFBQTtJQUNBLFFBQUEsT0FBQSxjQUFBLENBQUEsYUFBQTtJQUNBLFFBQUEsT0FBQSxtQkFBQSxDQUFBLGFBQUEsY0FBQSxlQUFBLG9CQUFBLGdCQUFBLGNBQUEsYUFBQTtJQUNBLFFBQUEsT0FBQSxlQUFBOztJQUVBLFFBQUEsT0FBQSxrQkFBQSxDQUFBO0lBQ0EsUUFBQSxPQUFBLGNBQUE7Ozs7OztJQU1BLFFBQUEsT0FBQSxjQUFBLHlCQUFBLFVBQUE7SUFDQTs7O1FBR0EsY0FBQSxXQUFBOzs7SUFHQSxRQUFBLE9BQUEsY0FBQSwyQkFBQSxVQUFBO0lBQ0E7UUFDQTthQUNBLGFBQUE7YUFDQSxVQUFBOzs7SUFHQSxRQUFBLE9BQUEsY0FBQSxnQ0FBQSxTQUFBLHFCQUFBO1FBQ0E7YUFDQSxXQUFBO2FBQ0Esa0JBQUEsRUFBQSxRQUFBOzs7SUFHQSxRQUFBLE9BQUEsY0FBQSwrQkFBQSxTQUFBLG9CQUFBOzs7UUFHQSxJQUFBLGdCQUFBLG1CQUFBLGNBQUE7UUFDQTtZQUNBLHdCQUFBO1lBQ0Esc0JBQUEsQ0FBQTtZQUNBLE1BQUE7OztRQUdBLG1CQUFBLGNBQUEsY0FBQTtRQUNBLG1CQUFBLE1BQUE7YUFDQSxlQUFBO1lBQ0E7Z0JBQ0EsV0FBQTtnQkFDQSxTQUFBOzthQUVBLGNBQUE7Ozs7Ozs7QUM5REEsQ0FBQTtBQUNBO0lBQ0E7SUFDQSxRQUFBLE9BQUEsY0FBQSxrRUFBQSxTQUFBLGdCQUFBLG9CQUFBLGdCQUFBOztRQUVBLElBQUEsVUFBQSxVQUFBLFVBQUE7WUFDQSxPQUFBLGdCQUFBLFdBQUE7OztRQUdBLG1CQUFBLFVBQUE7OztRQUdBO2FBQ0EsTUFBQSxPQUFBO2dCQUNBLFVBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxRQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7O29CQUVBLFFBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7b0JBRUEsTUFBQTs7O2FBR0EsTUFBQSxhQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLGVBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsZ0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsdUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsdUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsaUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsd0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsd0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsa0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEseUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEseUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsY0FBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxxQkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxxQkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxlQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBO3dCQUNBLGFBQUEsUUFBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7Ozs7YUFJQSxNQUFBLGFBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsb0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsb0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsaUJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsd0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsd0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsc0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsNkJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsNkJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsb0JBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsMkJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsMkJBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7Ozs7Ozs7OztBQ3ZTQTs7QUFFQSxRQUFBLE9BQUE7S0FDQSxVQUFBLGFBQUE7SUFDQTtRQUNBLFNBQUEsS0FBQSxPQUFBLFNBQUEsT0FBQSxTQUFBOzs7O1lBSUEsSUFBQSxTQUFBLFVBQUEsS0FBQTtnQkFDQSxNQUFBLE9BQUEsSUFBQSxLQUFBO2dCQUNBLE9BQUE7OztZQUdBLElBQUEsWUFBQSxVQUFBLEtBQUE7Z0JBQ0EsSUFBQSxDQUFBLEtBQUE7b0JBQ0EsT0FBQTs7Z0JBRUEsTUFBQSxJQUFBLEtBQUE7Z0JBQ0EsT0FBQTs7O1lBR0EsUUFBQSxTQUFBLFFBQUE7WUFDQSxRQUFBLFlBQUEsUUFBQTs7O1FBR0EsT0FBQTtZQUNBLFNBQUE7WUFDQSxNQUFBO1lBQ0EsVUFBQTs7O0FDN0JBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxlQUFBLE9BQUEsZ0JBQUE7SUFDQTtRQUNBLE9BQUEsU0FBQSxPQUFBO1FBQ0E7WUFDQSxRQUFBLFNBQUE7WUFDQSxJQUFBLE1BQUE7O1lBRUEsR0FBQSxNQUFBLFNBQUE7WUFDQTtnQkFDQSxNQUFBLE1BQUEsT0FBQSxHQUFBLGFBQUE7OztZQUdBO2dCQUNBLE1BQUE7OztZQUdBLE9BQUE7Ozs7Ozs7Ozs7QUNmQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSwrQkFBQSxVQUFBLFdBQUE7O1FBRUEsT0FBQTtZQUNBLGNBQUEsVUFBQSxVQUFBLFNBQUE7O2dCQUVBLElBQUEsVUFBQTtvQkFDQSxhQUFBLG9CQUFBLFdBQUEsTUFBQSxXQUFBOzs7Z0JBR0EsS0FBQSxRQUFBO29CQUNBLFFBQUEsUUFBQSxPQUFBOzs7Z0JBR0EsT0FBQSxVQUFBLEtBQUE7OztZQUdBLE1BQUEsVUFBQTtnQkFDQSxPQUFBLFVBQUE7OztZQUdBLE9BQUEsU0FBQSxPQUFBLFFBQUE7Z0JBQ0EsVUFBQTtvQkFDQSxVQUFBO3lCQUNBLE1BQUE7eUJBQ0EsUUFBQTt5QkFDQSxHQUFBOzs7O1lBSUEsU0FBQSxTQUFBLE9BQUEsT0FBQTtZQUNBO2dCQUNBLElBQUEsVUFBQSxVQUFBO3FCQUNBLE1BQUE7cUJBQ0EsWUFBQTtxQkFDQSxVQUFBO3FCQUNBLFlBQUE7cUJBQ0EsR0FBQTtxQkFDQSxPQUFBOztnQkFFQSxPQUFBLFVBQUEsS0FBQTs7Ozs7Ozs7OztBQzFDQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUEsZ0JBQUEsUUFBQSxlQUFBLENBQUEsU0FBQSxlQUFBLFdBQUEsU0FBQSxPQUFBLGFBQUEsUUFBQTs7UUFFQSxJQUFBLGVBQUEsWUFBQSxJQUFBOztRQUVBLE9BQUE7O1lBRUEsZ0JBQUEsU0FBQTtZQUNBO2dCQUNBLGFBQUEsVUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsV0FBQTs7OztZQUlBLFlBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLFdBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtnQkFDQTs7O29CQUdBLEtBQUEsWUFBQSxTQUFBLEtBQUE7b0JBQ0EsTUFBQSxVQUFBOzs7O1lBSUEsaUJBQUEsU0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxZQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBO29CQUNBLFFBQUEsSUFBQTtvQkFDQSxNQUFBLFlBQUE7Ozs7WUFJQSxhQUFBLFNBQUEsT0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxZQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsV0FBQTs7OztZQUlBLGtCQUFBLFNBQUE7WUFDQTtnQkFDQSxZQUFBLElBQUEsYUFBQSxVQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxhQUFBOztvQkFFQSxRQUFBLElBQUE7Ozs7WUFJQSxjQUFBLFNBQUEsT0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxhQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7Ozs7b0JBSUEsS0FBQSxhQUFBLFFBQUEsS0FBQTtvQkFDQSxLQUFBLFdBQUEsUUFBQSxLQUFBOzs7b0JBR0EsS0FBQSxZQUFBLFNBQUEsS0FBQTs7b0JBRUEsS0FBQSxZQUFBOzs7b0JBR0EsTUFBQSxZQUFBOzs7O1lBSUEsY0FBQSxTQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLFNBQUEsVUFBQSxLQUFBLFNBQUE7Z0JBQ0E7b0JBQ0EsUUFBQSxJQUFBO29CQUNBLE1BQUEsU0FBQTs7OztZQUlBLFVBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLFNBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxRQUFBOzs7O1lBSUEsYUFBQSxTQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLFFBQUEsVUFBQSxLQUFBLFNBQUE7Z0JBQ0E7b0JBQ0EsUUFBQSxJQUFBO29CQUNBLE1BQUEsUUFBQTs7OztZQUlBLFNBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLFFBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxPQUFBOzs7O1lBSUEsaUJBQUEsU0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxZQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBO29CQUNBLFFBQUEsSUFBQTtvQkFDQSxNQUFBLFlBQUE7Ozs7WUFJQSxhQUFBLFNBQUEsT0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxZQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsV0FBQTs7OztZQUlBLFVBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsUUFBQSxJQUFBLG1CQUFBOztnQkFFQSxZQUFBLElBQUEsVUFBQSxPQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBO21CQUNBLFFBQUEsSUFBQTs7Ozs7WUFLQSxzQkFBQSxTQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLGlCQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBOztvQkFFQSxNQUFBLGlCQUFBOzs7O1lBSUEsa0JBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLGlCQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7Ozs7b0JBSUEsS0FBQSxjQUFBLFFBQUEsS0FBQTs7O29CQUdBLEtBQUEsWUFBQSxTQUFBLEtBQUE7O29CQUVBLE1BQUEsZ0JBQUE7Ozs7WUFJQSxvQkFBQSxTQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLGVBQUEsVUFBQSxLQUFBLFNBQUE7Z0JBQ0E7b0JBQ0EsUUFBQSxJQUFBO29CQUNBLE1BQUEsZUFBQTs7OztZQUlBLGdCQUFBLFNBQUEsT0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxlQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsY0FBQTs7Ozs7Ozs7Ozs7QUN0TEEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsNkJBQUEsVUFBQSxVQUFBOztRQUVBLElBQUEsUUFBQTtZQUNBLFdBQUE7WUFDQSxTQUFBOztRQUVBLE9BQUE7WUFDQSxNQUFBLFNBQUEsU0FBQTtnQkFDQSxPQUFBLFNBQUE7b0JBQ0EsU0FBQTt5QkFDQSxRQUFBO3lCQUNBLFNBQUE7eUJBQ0EsT0FBQTt5QkFDQSxVQUFBOzs7Ozs7QUNwQkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSxlQUFBLFFBQUEsT0FBQSxTQUFBLFlBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTs7UUFFQSxJQUFBLFFBQUEsSUFBQTs7UUFFQSxPQUFBLGFBQUE7UUFDQSxPQUFBLGFBQUE7O1FBRUEsT0FBQSxnQkFBQSxTQUFBO1FBQ0E7WUFDQSxXQUFBLFFBQUE7OztRQUdBLE9BQUEsY0FBQSxTQUFBO1FBQ0E7WUFDQSxHQUFBLENBQUEsV0FBQSxRQUFBO1lBQ0E7Z0JBQ0EsV0FBQSxRQUFBOzs7O1FBSUEsT0FBQSxjQUFBLFNBQUE7UUFDQTtZQUNBLEdBQUEsQ0FBQSxXQUFBLFFBQUE7WUFDQTtnQkFDQSxXQUFBLFFBQUE7Ozs7UUFJQSxPQUFBLGVBQUE7UUFDQTtZQUNBLE9BQUEsYUFBQSxDQUFBLE9BQUE7Ozs7UUFJQSxPQUFBLElBQUEsZ0JBQUEsVUFBQSxPQUFBO1FBQ0E7WUFDQSxPQUFBOzs7OztJQUtBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLGtCQUFBLENBQUEsVUFBQSxTQUFBLFdBQUEsY0FBQSxZQUFBOzs7O0FDOUNBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEseUJBQUEsT0FBQSxRQUFBLGNBQUEsYUFBQSxhQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7O1FBRUEsS0FBQSxpQkFBQTtRQUNBO1lBQ0EsUUFBQSxJQUFBLEtBQUE7O1lBRUEsSUFBQSxJQUFBLEtBQUE7O1lBRUEsWUFBQSxJQUFBLFlBQUEsS0FBQSxHQUFBLEtBQUEsU0FBQTtZQUNBO2dCQUNBLFFBQUEsSUFBQTs7Z0JBRUEsYUFBQSxLQUFBO2dCQUNBLE9BQUEsR0FBQTs7ZUFFQTtZQUNBO2dCQUNBLGFBQUEsS0FBQTs7Ozs7OztJQU9BLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDRCQUFBLENBQUEsU0FBQSxVQUFBLGdCQUFBLGVBQUEsZUFBQSxnQkFBQTs7OztBQzdCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLHlCQUFBLE9BQUEsUUFBQSxjQUFBLGFBQUEsYUFBQSxlQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7OztRQUdBLFlBQUEsWUFBQSxNQUFBLGFBQUE7O1FBRUEsS0FBQSxpQkFBQTtRQUNBO1lBQ0EsS0FBQSxTQUFBLE1BQUEsS0FBQTtZQUNBO2dCQUNBLGFBQUEsS0FBQTtnQkFDQSxPQUFBLEdBQUE7O2VBRUE7WUFDQTtnQkFDQSxhQUFBLEtBQUE7Z0JBQ0EsUUFBQSxJQUFBOzs7O1FBSUEsS0FBQSxpQkFBQTtRQUNBO1lBQ0EsS0FBQSxTQUFBLFNBQUEsS0FBQTtZQUNBO2dCQUNBLGFBQUEsS0FBQTtnQkFDQSxPQUFBLEdBQUE7ZUFDQTtZQUNBO2dCQUNBLGFBQUEsS0FBQTs7Ozs7O1FBTUEsS0FBQSxvQkFBQSxTQUFBO1FBQ0E7WUFDQSxJQUFBLFNBQUEsY0FBQSxRQUFBLElBQUEsb0JBQUE7WUFDQSxPQUFBLEtBQUE7Z0JBQ0E7b0JBQ0EsS0FBQTs7Z0JBRUE7Z0JBQ0E7Ozs7OztJQU1BLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDRCQUFBLENBQUEsU0FBQSxVQUFBLGdCQUFBLGVBQUEsZUFBQSxpQkFBQSxnQkFBQTs7OztBQ3BEQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLG1CQUFBLE9BQUEsUUFBQSxhQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7O1FBRUEsWUFBQSxnQkFBQTs7OztJQUlBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHNCQUFBLENBQUEsU0FBQSxVQUFBLGVBQUEsZUFBQTs7OztBQ1hBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEsc0JBQUEsT0FBQSxRQUFBLGFBQUEsYUFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOztRQUVBLEtBQUEsUUFBQTs7UUFFQSxLQUFBLGNBQUE7UUFDQTtZQUNBLFFBQUEsSUFBQSxLQUFBOztZQUVBLElBQUEsSUFBQSxLQUFBOzs7O1lBSUEsWUFBQSxJQUFBLFNBQUEsS0FBQSxHQUFBLEtBQUEsU0FBQTtZQUNBO2dCQUNBLFFBQUEsSUFBQTtnQkFDQSxhQUFBLEtBQUE7Z0JBQ0EsT0FBQSxHQUFBOzs7Ozs7OztJQVFBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHlCQUFBLENBQUEsU0FBQSxVQUFBLGVBQUEsZUFBQSxnQkFBQTs7OztBQzdCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLHNCQUFBLE9BQUEsUUFBQSxhQUFBLGFBQUEsY0FBQSxjQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7O1FBRUEsS0FBQSxrQkFBQTtRQUNBLEtBQUEsbUJBQUE7OztRQUdBLFlBQUEsU0FBQSxNQUFBLGFBQUE7UUFDQSxZQUFBLGVBQUE7OztRQUdBLEtBQUEsY0FBQTtRQUNBOztZQUVBLEtBQUEsTUFBQSxNQUFBLEtBQUE7WUFDQTs7Z0JBRUEsYUFBQSxLQUFBO2dCQUNBLE9BQUEsR0FBQTtlQUNBO1lBQ0E7Z0JBQ0EsYUFBQSxLQUFBO2dCQUNBLFFBQUEsSUFBQTs7OztRQUlBLEtBQUEsYUFBQTtRQUNBO1lBQ0EsUUFBQSxJQUFBLEtBQUE7O1lBRUEsS0FBQSxNQUFBLGVBQUEsS0FBQTtnQkFDQSxVQUFBLEtBQUEsTUFBQTtnQkFDQSxZQUFBLEtBQUEsZ0JBQUE7Z0JBQ0EsVUFBQSxLQUFBO2dCQUNBLFNBQUEsS0FBQTs7O1lBR0EsS0FBQSxrQkFBQTtZQUNBLEtBQUEsbUJBQUE7OztRQUdBLEtBQUEsZ0JBQUEsU0FBQSxHQUFBO1FBQ0E7WUFDQSxJQUFBO1lBQ0EsSUFBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsTUFBQSxlQUFBLFFBQUE7WUFDQTtnQkFDQSxHQUFBLGFBQUEsS0FBQSxNQUFBLGVBQUEsR0FBQTtnQkFDQTtvQkFDQSxnQkFBQTtvQkFDQTs7OztZQUlBLFFBQUEsSUFBQTtZQUNBLEtBQUEsTUFBQSxlQUFBLE9BQUEsZUFBQTs7WUFFQSxFQUFBOzs7UUFHQSxLQUFBLGNBQUE7UUFDQTtZQUNBLEtBQUEsTUFBQSxTQUFBLEtBQUE7WUFDQTtnQkFDQSxhQUFBLEtBQUE7Z0JBQ0EsUUFBQSxJQUFBO2dCQUNBLE9BQUEsR0FBQTtlQUNBO1lBQ0E7Z0JBQ0EsYUFBQSxLQUFBOzs7Ozs7UUFNQSxLQUFBLG9CQUFBLFNBQUE7UUFDQTtZQUNBLElB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S0FBQTtnQkFDQSxVQUFBLEtBQUE7OztZQUdBLEdBQUEsS0FBQSxRQUFBLFNBQUEsYUFBQSxLQUFBLFFBQUEsU0FBQSxNQUFBLEVBQUEsS0FBQSxRQUFBLE9BQUE7WUFDQSxJQUFBLGNBQUEsV0FBQSxLQUFBLFFBQUE7WUFDQSxJQUFBLFNBQUEsV0FBQSxLQUFBLGlCQUFBLGFBQUEsU0FBQSxLQUFBO1lBQ0EsZUFBQTtZQUNBLEtBQUEsUUFBQSxPQUFBOztZQUVBLEtBQUEsbUJBQUE7WUFDQSxLQUFBLG1CQUFBOztZQUVBLFFBQUEsSUFBQSxLQUFBOzs7UUFHQSxLQUFBLGlCQUFBLFNBQUEsR0FBQTtRQUNBO1lBQ0EsSUFBQTtZQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLFFBQUEsa0JBQUEsUUFBQTtZQUNBO2dCQUNBLEdBQUEsY0FBQSxLQUFBLFFBQUEsa0JBQUEsR0FBQTtnQkFDQTtvQkFDQSxnQkFBQTtvQkFDQTs7OztZQUlBLFFBQUEsSUFBQTs7WUFFQSxJQUFBLGNBQUEsV0FBQSxLQUFBLFFBQUE7WUFDQSxJQUFBLFNBQUEsV0FBQSxLQUFBLFFBQUEsa0JBQUEsZUFBQSxTQUFBLGFBQUEsU0FBQSxLQUFBLFFBQUEsa0JBQUEsZUFBQTtZQUNBLGVBQUE7WUFDQSxLQUFBLFFBQUEsT0FBQTs7WUFFQSxLQUFBLFFBQUEsa0JBQUEsT0FBQSxlQUFBOztZQUVBLEVBQUE7Ozs7O0lBS0EsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkJBQUEsQ0FBQSxTQUFBLFVBQUEsZUFBQSxnQkFBQSxlQUFBLGdCQUFBOzs7O0FDbEZBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEsd0JBQUEsT0FBQSxRQUFBLGFBQUEsYUFBQSxjQUFBLGNBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTs7O1FBR0EsWUFBQSxnQkFBQTtRQUNBLFlBQUEsV0FBQSxNQUFBLGFBQUE7O1FBRUEsS0FBQSxnQkFBQTtRQUNBOztZQUVBLEtBQUEsUUFBQSxNQUFBLEtBQUE7WUFDQTs7Z0JBRUEsYUFBQSxLQUFBO2dCQUNBLE9BQUEsR0FBQTtlQUNBO1lBQ0E7Z0JBQ0EsYUFBQSxLQUFBO2dCQUNBLFFBQUEsSUFBQTs7OztRQUlBLEtBQUEsZ0JBQUE7UUFDQTtZQUNBLEtBQUEsUUFBQSxTQUFBLEtBQUE7WUFDQTtnQkFDQSxRQUFBLElBQUE7Z0JBQ0EsYUFBQSxLQUFBO2dCQUNBLE9BQUEsR0FBQTs7ZUFFQTtZQUNBO2dCQUNBLGFBQUEsS0FBQTtnQkFDQSxRQUFBLElBQUE7Ozs7UUFJQSxLQUFBLG9CQUFBLFNBQUE7UUFDQTtZQUNBLElBQUEsU0FBQSxjQUFBLFFBQUEsSUFBQSxtQkFBQTtZQUNBLE9BQUEsS0FBQTtZQUNBO2dCQUNBLEtBQUE7O1lBRUE7WUFDQTs7OztRQUlBLEtBQUEsY0FBQTtRQUNBO1lBQ0EsUUFBQSxJQUFBLEtBQUE7O1lBRUEsR0FBQSxLQUFBLFFBQUEsc0JBQUEsV0FBQSxFQUFBLEtBQUEsUUFBQSxvQkFBQTs7WUFFQSxLQUFBLFFBQUEsa0JBQUEsS0FBQTtnQkFDQSxZQUFBLEtBQUEsUUFBQTtnQkFDQSxhQUFBLEtBQUEsaUJBQUE7Z0JBQ0EsVUFBQSxLQUFBO2dCQUNBLFVBQUEsS0FBQTs7O1lBR0EsSUFBQSxjQUFBLFdBQUEsS0FBQSxRQUFBO1lBQ0EsSUFBQSxTQUFBLFdBQUEsS0FBQSxpQkFBQSxhQUFBLFNBQUEsS0FBQTtZQUNBLGVBQUE7WUFDQSxLQUFBLFFBQUEsT0FBQTs7O1lBR0EsS0FBQSxtQkFBQTtZQUNBLEtBQUEsbUJBQUE7Ozs7UUFJQSxLQUFBLGlCQUFBLFNBQUEsR0FBQTtRQUNBO1lBQ0EsSUFBQTtZQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLFFBQUEsa0JBQUEsUUFBQTtZQUNBO2dCQUNBLEdBQUEsY0FBQSxLQUFBLFFBQUEsa0JBQUEsR0FBQTtnQkFDQTtvQkFDQSxnQkFBQTtvQkFDQTs7OztZQUlBLFFBQUEsSUFBQTs7WUFFQSxJQUFBLGNBQUEsV0FBQSxLQUFBLFFBQUE7WUFDQSxJQUFBLFNBQUEsV0FBQSxLQUFBLFFBQUEsa0JBQUEsZUFBQSxTQUFBLGFBQUEsU0FBQSxLQUFBLFFBQUEsa0JBQUEsZUFBQTtZQUNBLGVBQUE7WUFDQSxLQUFBLFFBQUEsT0FBQTs7O1lBR0EsS0FBQSxRQUFBLGtCQUFBLE9BQUEsZUFBQTs7WUFFQSxFQUFBOzs7O0lBSUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsMkJBQUEsQ0FBQSxTQUFBLFVBQUEsZUFBQSxlQUFBLGdCQUFBLGdCQUFBLGlCQUFBOzs7O0FDdkdBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEsa0JBQUEsT0FBQSxRQUFBLGFBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTs7UUFFQSxZQUFBLGVBQUE7OztJQUdBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHFCQUFBLENBQUEsU0FBQSxVQUFBLGVBQUEsZUFBQTs7OztBQ1ZBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEsOEJBQUEsT0FBQSxRQUFBLGFBQUEsY0FBQSxhQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7O1FBRUEsWUFBQSxnQkFBQTtRQUNBLFlBQUEsZUFBQTtRQUNBLFlBQUEsbUJBQUE7O1FBRUEsS0FBQSxnQkFBQTtRQUNBLEtBQUEsY0FBQSxjQUFBO1FBQ0EsS0FBQSxjQUFBLFFBQUE7OztRQUdBLEtBQUEsc0JBQUE7UUFDQTtZQUNBLFFBQUEsSUFBQSxLQUFBOztZQUVBLElBQUEsSUFBQSxLQUFBOzs7O1lBSUEsWUFBQSxJQUFBLGlCQUFBLEtBQUEsR0FBQSxLQUFBLFNBQUE7WUFDQTs7O2dCQUdBLGFBQUEsS0FBQTtnQkFDQSxPQUFBLEdBQUE7ZUFDQTtZQUNBO2dCQUNBLGFBQUEsS0FBQTs7OztRQUlBLEtBQUEsbUJBQUE7UUFDQTtZQUNBLFFBQUEsSUFBQSxLQUFBOztZQUVBLEdBQUEsS0FBQSxjQUFBLDRCQUFBLFdBQUEsRUFBQSxLQUFBLGNBQUEsMEJBQUE7O1lBRUEsS0FBQSxjQUFBLHdCQUFBLEtBQUE7Z0JBQ0EsWUFBQSxLQUFBLGdCQUFBO2dCQUNBLFVBQUEsS0FBQTtnQkFDQSxTQUFBLEtBQUE7OztZQUdBLEdBQUEsS0FBQSxjQUFBLFVBQUEsYUFBQSxLQUFBLGNBQUEsVUFBQSxNQUFBLEVBQUEsS0FBQSxjQUFBLFFBQUE7WUFDQSxJQUFBLGNBQUEsV0FBQSxLQUFBLGNBQUE7WUFDQSxJQUFBLFNBQUEsV0FBQSxLQUFBLGdCQUFBLFNBQUEsU0FBQSxLQUFBO1lBQ0EsZUFBQTtZQUNBLEtBQUEsY0FBQSxRQUFBOztZQUVBLEtBQUEsa0JBQUE7WUFDQSxLQUFBLG1CQUFBOztZQUVBLFFBQUEsSUFBQSxLQUFBOzs7UUFHQSxLQUFBLHNCQUFBLFNBQUEsR0FBQTtRQUNBO1lBQ0EsSUFBQTtZQUNBLElBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLGNBQUEsd0JBQUEsUUFBQTtZQUNBO2dCQUNBLEdBQUEsYUFBQSxLQUFBLGNBQUEsd0JBQUEsR0FBQTtnQkFDQTtvQkFDQSxnQkFBQTtvQkFDQTs7OztZQUlBLFFBQUEsSUFBQTs7WUFFQSxJQUFBLGNBQUEsV0FBQSxLQUFBLGNBQUE7WUFDQSxJQUFBLFNBQUEsV0FBQSxLQUFBLGNBQUEsd0JBQUEsZUFBQSxRQUFBLFNBQUEsU0FBQSxLQUFBLGNBQUEsd0JBQUEsZUFBQTtZQUNBLGVBQUE7WUFDQSxLQUFBLGNBQUEsUUFBQTs7WUFFQSxLQUFBLGNBQUEsd0JBQUEsT0FBQSxlQUFBOztZQUVBLEVBQUE7Ozs7O0lBS0EsUUFBQSxPQUFBLG1CQUFBLFdBQUEsaUNBQUEsQ0FBQSxTQUFBLFVBQUEsZUFBQSxnQkFBQSxlQUFBLGdCQUFBOzs7O0FDdEZBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEsOEJBQUEsT0FBQSxRQUFBLGFBQUEsYUFBQSxjQUFBLGNBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTs7O1FBR0EsWUFBQSxnQkFBQTtRQUNBLFlBQUEsZUFBQTtRQUNBLFlBQUEsbUJBQUE7UUFDQSxZQUFBLGlCQUFBLE1BQUEsYUFBQTs7UUFFQSxLQUFBLHNCQUFBO1FBQ0E7WUFDQSxLQUFBLGNBQUEsTUFBQSxLQUFBO1lBQ0E7O2dCQUVBLGFBQUEsS0FBQTtnQkFDQSxPQUFBLEdBQUE7ZUFDQTtZQUNBO2dCQUNBLGFBQUEsS0FBQTtnQkFDQSxRQUFBLElBQUE7Ozs7UUFJQSxLQUFBLHNCQUFBO1FBQ0E7WUFDQSxLQUFBLGNBQUEsU0FBQSxLQUFBO1lBQ0E7Z0JBQ0EsUUFBQSxJQUFBO2dCQUNBLGFBQUEsS0FBQTtnQkFDQSxPQUFBLEdBQUE7O2VBRUE7WUFDQTtnQkFDQSxhQUFBLEtBQUE7Z0JBQ0EsUUFBQSxJQUFBOzs7O1FBSUEsS0FBQSxvQkFBQSxTQUFBO1FBQ0E7WUFDQSxJQUFBLFNBQUEsY0FBQSxRQUFBLElBQUEsMEJBQUE7WUFDQSxPQUFBLEtBQUE7WUFDQTtnQkFDQSxLQUFBOztZQUVBO1lBQ0E7Ozs7UUFJQSxLQUFBLGFBQUE7UUFDQTtZQUNBLFFBQUEsSUFBQSxLQUFBOztZQUVBLEdBQUEsS0FBQSxjQUFBLDRCQUFBLFdBQUEsRUFBQSxLQUFBLGNBQUEsMEJBQUE7O1lBRUEsS0FBQSxjQUFBLHdCQUFBLEtBQUE7Z0JBQ0EsWUFBQSxLQUFBLGdCQUFBO2dCQUNBLFVBQUEsS0FBQTtnQkFDQSxTQUFBLEtBQUE7OztZQUdBLEtBQUEsa0JBQUE7WUFDQSxLQUFBLG1CQUFBOzs7O1FBSUEsS0FBQSxnQkFBQSxTQUFBLEdBQUE7UUFDQTtZQUNBLElBQUE7WUFDQSxJQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxjQUFBLHdCQUFBLFFBQUE7WUFDQTtnQkFDQSxHQUFBLGFBQUEsS0FBQSxjQUFBLHdCQUFBLEdBQUE7Z0JBQ0E7b0JBQ0EsZ0JBQUE7b0JBQ0E7Ozs7WUFJQSxRQUFBLElBQUE7O1lBRUEsS0FBQSxjQUFBLHdCQUFBLE9BQUEsZUFBQTs7WUFFQSxFQUFBOzs7O0lBSUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsaUNBQUEsQ0FBQSxTQUFBLFVBQUEsZUFBQSxlQUFBLGdCQUFBLGdCQUFBLGlCQUFBOzs7O0FDM0ZBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEsd0JBQUEsT0FBQSxRQUFBLGFBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTs7UUFFQSxZQUFBLHFCQUFBOzs7SUFHQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSwyQkFBQSxDQUFBLFNBQUEsVUFBQSxlQUFBLGVBQUE7Ozs7QUNWQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLGlCQUFBLE9BQUEsUUFBQSxhQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7Ozs7O0lBS0EsUUFBQSxPQUFBLG1CQUFBLFdBQUEsb0JBQUEsQ0FBQSxTQUFBLFVBQUEsZUFBQSxlQUFBOzs7O0FDVkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSxpQkFBQSxRQUFBLE9BQUEsYUFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOztRQUVBLEtBQUEsVUFBQTtRQUNBLEtBQUEsYUFBQTtRQUNBLEtBQUE7O1FBRUEsS0FBQSxXQUFBLFNBQUE7UUFDQTs7WUFFQSxPQUFBLFlBQUEsSUFBQSxVQUFBLE9BQUEsVUFBQSxLQUFBLFNBQUE7WUFDQTtnQkFDQSxRQUFBLElBQUE7Z0JBQ0EsT0FBQTs7Ozs7UUFLQSxLQUFBLHdCQUFBLFVBQUE7O1lBRUEsT0FBQSxNQUFBLFdBQUE7OztRQUdBLEtBQUEsV0FBQTtRQUNBO1lBQ0EsUUFBQSxJQUFBLEtBQUE7WUFDQSxHQUFBLEtBQUEsa0JBQUEsUUFBQSxLQUFBLGtCQUFBO1lBQ0E7Z0JBQ0EsS0FBQSxhQUFBO2dCQUNBLEtBQUE7O2dCQUVBLE9BQUEsS0FBQSxlQUFBOztvQkFFQSxLQUFBO3dCQUNBLE9BQUEsR0FBQSx1QkFBQSxDQUFBLGFBQUEsS0FBQSxlQUFBO3dCQUNBOztvQkFFQSxLQUFBO3dCQUNBLE9BQUEsR0FBQSx3QkFBQSxDQUFBLGNBQUEsS0FBQSxlQUFBO3dCQUNBOztvQkFFQSxLQUFBO3dCQUNBLE9BQUEsR0FBQSxxQkFBQSxDQUFBLFdBQUEsS0FBQSxlQUFBO3dCQUNBOztvQkFFQSxLQUFBO3dCQUNBLE9BQUEsR0FBQSx5QkFBQSxDQUFBLGVBQUEsS0FBQSxlQUFBO3dCQUNBOztvQkFFQSxLQUFBO3dCQUNBLE9BQUEsR0FBQSx3QkFBQSxDQUFBLGNBQUEsS0FBQSxlQUFBO3dCQUNBOzs7Ozs7SUFNQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxvQkFBQSxDQUFBLFVBQUEsU0FBQSxlQUFBLFVBQUE7Ozs7QUM3REEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSwwQkFBQSxPQUFBLFFBQUEsYUFBQSxjQUFBLFNBQUEsYUFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOztRQUVBLFlBQUEsZ0JBQUE7UUFDQSxZQUFBLGVBQUE7O1FBRUEsS0FBQSxrQkFBQTtRQUNBOztZQUVBLFFBQUEsSUFBQSxLQUFBOztZQUVBLElBQUEsSUFBQSxLQUFBOztZQUVBLFlBQUEsSUFBQSxhQUFBLEtBQUEsR0FBQSxLQUFBO1lBQ0E7Z0JBQ0EsYUFBQSxLQUFBOztnQkFFQSxPQUFBLEdBQUE7Ozs7OztJQU1BLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDZCQUFBLENBQUEsU0FBQSxVQUFBLGVBQUEsZ0JBQUEsV0FBQSxlQUFBLGdCQUFBOzs7O0FDM0JBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEsMEJBQUEsT0FBQSxRQUFBLGNBQUEsYUFBQSxhQUFBLGVBQUEsU0FBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOzs7UUFHQSxZQUFBLGFBQUEsTUFBQSxhQUFBO1FBQ0EsWUFBQSxnQkFBQTtRQUNBLFlBQUEsZUFBQTs7O1FBR0EsS0FBQSxpQkFBQSxTQUFBO1FBQ0E7WUFDQSxRQUFBLElBQUE7Ozs7O1FBS0EsS0FBQSxrQkFBQTtRQUNBO1lBQ0EsS0FBQSxVQUFBLE1BQUEsS0FBQTtZQUNBO2dCQUNBLGFBQUEsS0FBQTtnQkFDQSxPQUFBLEdBQUE7ZUFDQTtZQUNBO2dCQUNBLGFBQUEsS0FBQTs7OztRQUlBLEtBQUEsa0JBQUE7UUFDQTtZQUNBLEtBQUEsVUFBQSxTQUFBLEtBQUE7WUFDQTtnQkFDQSxhQUFBLEtBQUE7Z0JBQ0EsT0FBQSxHQUFBO2VBQ0E7WUFDQTtnQkFDQSxhQUFBLEtBQUE7Ozs7UUFJQSxLQUFBLG9CQUFBLFNBQUE7UUFDQTtZQUNBLElBQUEsU0FBQSxjQUFBLFFBQUEsSUFBQSxzQkFBQTtZQUNBLE9BQUEsS0FBQTtnQkFDQTtvQkFDQSxLQUFBOztnQkFFQTtnQkFDQTs7Ozs7O0lBTUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNkJBQUEsQ0FBQSxTQUFBLFVBQUEsZ0JBQUEsZUFBQSxlQUFBLGlCQUFBLFdBQUEsZ0JBQUE7Ozs7QUMxREEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSxvQkFBQSxPQUFBLFFBQUEsYUFBQSxhQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7O1FBRUEsS0FBQSxlQUFBO1FBQ0EsSUFBQSxhQUFBOztRQUVBLFlBQUEsaUJBQUE7O1FBRUEsUUFBQSxJQUFBOztRQUVBLEtBQUEsYUFBQSxTQUFBO1FBQ0E7O1lBRUEsSUFBQSxJQUFBLFFBQUE7O1lBRUEsSUFBQSxVQUFBLEVBQUEsS0FBQSxZQUFBOztZQUVBLEdBQUEsVUFBQTtZQUNBO2dCQUNBLE9BQUE7O2lCQUVBLEdBQUEsVUFBQSxLQUFBLFdBQUE7WUFDQTtnQkFDQSxPQUFBOztpQkFFQSxHQUFBLFVBQUEsS0FBQSxXQUFBO1lBQ0E7Z0JBQ0EsT0FBQTs7O1lBR0E7Z0JBQ0EsT0FBQTs7Ozs7OztRQU9BLEtBQUEscUJBQUEsU0FBQTtRQUNBO1lBQ0EsUUFBQSxJQUFBO1lBQ0EsUUFBQSxJQUFBOzs7OztJQUtBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHVCQUFBLENBQUEsU0FBQSxVQUFBLGVBQUEsZUFBQSxXQUFBOzs7O0FDbERBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEscUJBQUEsT0FBQSxRQUFBLGNBQUEsYUFBQSxhQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7O1FBRUEsS0FBQSxhQUFBO1FBQ0E7WUFDQSxRQUFBLElBQUEsS0FBQTs7WUFFQSxJQUFBLElBQUEsS0FBQTs7WUFFQSxZQUFBLElBQUEsUUFBQSxLQUFBLEdBQUEsS0FBQSxTQUFBO1lBQ0E7Z0JBQ0EsUUFBQSxJQUFBOztnQkFFQSxhQUFBLEtBQUE7Z0JBQ0EsT0FBQSxHQUFBOztlQUVBO1lBQ0E7Z0JBQ0EsYUFBQSxLQUFBOzs7Ozs7O0lBT0EsUUFBQSxPQUFBLG1CQUFBLFdBQUEsd0JBQUEsQ0FBQSxTQUFBLFVBQUEsZ0JBQUEsZUFBQSxlQUFBLGdCQUFBOzs7O0FDN0JBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEscUJBQUEsT0FBQSxRQUFBLGNBQUEsYUFBQSxhQUFBLGVBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTs7O1FBR0EsWUFBQSxRQUFBLE1BQUEsYUFBQTs7UUFFQSxLQUFBLGFBQUE7UUFDQTtZQUNBLEtBQUEsS0FBQSxNQUFBLEtBQUE7WUFDQTtnQkFDQSxhQUFBLEtBQUE7Z0JBQ0EsT0FBQSxHQUFBOztlQUVBO1lBQ0E7Z0JBQ0EsYUFBQSxLQUFBO2dCQUNBLFFBQUEsSUFBQTs7OztRQUlBLEtBQUEsYUFBQTtRQUNBO1lBQ0EsS0FBQSxLQUFBLFNBQUEsS0FBQTtZQUNBO2dCQUNBLGFBQUEsS0FBQTtnQkFDQSxPQUFBLEdBQUE7ZUFDQTtZQUNBO2dCQUNBLGFBQUEsS0FBQTs7Ozs7O1FBTUEsS0FBQSxvQkFBQSxTQUFBO1FBQ0E7WUFDQSxJQUFBLFNBQUEsY0FBQSxRQUFBLElBQUEsZ0JBQUE7WUFDQSxPQUFBLEtBQUE7Z0JBQ0E7b0JBQ0EsS0FBQTs7Z0JBRUE7Z0JBQ0E7Ozs7OztJQU1BLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHdCQUFBLENBQUEsU0FBQSxVQUFBLGdCQUFBLGVBQUEsZUFBQSxpQkFBQSxnQkFBQTs7OztBQ3BEQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLGVBQUEsT0FBQSxRQUFBLGFBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTs7UUFFQSxZQUFBLFlBQUE7Ozs7SUFJQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxrQkFBQSxDQUFBLFNBQUEsVUFBQSxlQUFBLGVBQUE7OztBQUdBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLFxyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgJ2FwcC5jb250cm9sbGVycycsXHJcbiAgICAgICAgICAgICdhcHAuZmlsdGVycycsXHJcbiAgICAgICAgICAgICdhcHAuc2VydmljZXMnLFxyXG4gICAgICAgICAgICAnYXBwLmRpcmVjdGl2ZXMnLFxyXG4gICAgICAgICAgICAnYXBwLnJvdXRlcycsXHJcbiAgICAgICAgICAgICdhcHAuY29uZmlnJ1xyXG4gICAgICAgIF0pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VydmljZXMnLCBbJ3VpLnJvdXRlcicsICdzYXRlbGxpemVyJywgJ3Jlc3Rhbmd1bGFyJywgJ2FuZ3VsYXItbW9tZW50anMnXSk7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycsIFsndWkucm91dGVyJywgJ3NhdGVsbGl6ZXInXSk7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJywgWyd1aS5yb3V0ZXInLCAnbmdNYXRlcmlhbCcsICdyZXN0YW5ndWxhcicsICdhbmd1bGFyLW1vbWVudGpzJywgJ2FwcC5zZXJ2aWNlcycsICduZ01lc3NhZ2VzJywgJ25nTWRJY29ucycsICdtZC5kYXRhLnRhYmxlJ10pO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5maWx0ZXJzJywgW10pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycsIFsnYW5ndWxhci1tb21lbnRqcyddKTtcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJywgW10pO1xyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gQ29uZmlndXJhdGlvbiBzdHVmZlxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24gKCRhdXRoUHJvdmlkZXIpXHJcbiAgICB7XHJcbiAgICAgICAgLy8gU2F0ZWxsaXplciBjb25maWd1cmF0aW9uIHRoYXQgc3BlY2lmaWVzIHdoaWNoIEFQSVxyXG4gICAgICAgIC8vIHJvdXRlIHRoZSBKV1Qgc2hvdWxkIGJlIHJldHJpZXZlZCBmcm9tXHJcbiAgICAgICAgJGF1dGhQcm92aWRlci5sb2dpblVybCA9ICcvYXBpL2F1dGhlbnRpY2F0ZSc7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoJG1vbWVudFByb3ZpZGVyKVxyXG4gICAge1xyXG4gICAgICAgICRtb21lbnRQcm92aWRlclxyXG4gICAgICAgICAgICAuYXN5bmNMb2FkaW5nKGZhbHNlKVxyXG4gICAgICAgICAgICAuc2NyaXB0VXJsKCcvL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9tb21lbnQuanMvMi41LjEvbW9tZW50Lm1pbi5qcycpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoIGZ1bmN0aW9uKFJlc3Rhbmd1bGFyUHJvdmlkZXIpIHtcclxuICAgICAgICBSZXN0YW5ndWxhclByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zZXRCYXNlVXJsKCcvYXBpLycpXHJcbiAgICAgICAgICAgIC5zZXREZWZhdWx0SGVhZGVycyh7IGFjY2VwdDogXCJhcHBsaWNhdGlvbi94LmxhcmF2ZWwudjEranNvblwiIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoIGZ1bmN0aW9uKCRtZFRoZW1pbmdQcm92aWRlcikge1xyXG4gICAgICAgIC8qIEZvciBtb3JlIGluZm8sIHZpc2l0IGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhcmpzLm9yZy8jL1RoZW1pbmcvMDFfaW50cm9kdWN0aW9uICovXHJcblxyXG4gICAgICAgIHZhciBjdXN0b21CbHVlTWFwID0gJG1kVGhlbWluZ1Byb3ZpZGVyLmV4dGVuZFBhbGV0dGUoJ2xpZ2h0LWJsdWUnLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgJ2NvbnRyYXN0RGVmYXVsdENvbG9yJzogJ2xpZ2h0JyxcclxuICAgICAgICAgICAgJ2NvbnRyYXN0RGFya0NvbG9ycyc6IFsnNTAnXSxcclxuICAgICAgICAgICAgJzUwJzogJ2ZmZmZmZidcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJG1kVGhlbWluZ1Byb3ZpZGVyLmRlZmluZVBhbGV0dGUoJ2N1c3RvbUJsdWUnLCBjdXN0b21CbHVlTWFwKTtcclxuICAgICAgICAkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2RlZmF1bHQnKVxyXG4gICAgICAgICAgICAucHJpbWFyeVBhbGV0dGUoJ2N1c3RvbUJsdWUnLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAnZGVmYXVsdCc6ICc1MDAnLFxyXG4gICAgICAgICAgICAgICAgJ2h1ZS0xJzogJzUwJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYWNjZW50UGFsZXR0ZSgncGluaycpO1xyXG5cclxuICAgIH0pO1xyXG5cclxuXHJcblxyXG59KSgpOyIsIihmdW5jdGlvbigpXHJcbntcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnKS5jb25maWcoIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRhdXRoUHJvdmlkZXIgKSB7XHJcblxyXG4gICAgICAgIHZhciBnZXRWaWV3ID0gZnVuY3Rpb24oIHZpZXdOYW1lICl7XHJcbiAgICAgICAgICAgIHJldHVybiAnL3ZpZXdzL2FwcC8nICsgdmlld05hbWUgKyAnLmh0bWwnO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9sb2dpbicpO1xyXG5cclxuXHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAnLCB7XHJcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdoZWFkZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0hlYWRlckNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsSGVhZGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZm9vdGVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdmb290ZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0Zvb3RlckNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsRm9vdGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbWFpbjoge31cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAubG9naW4nLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvbG9naW4nLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdsb2dpbicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9naW5Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybExvZ2luJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAubGFuZGluZycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9sYW5kaW5nJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnbGFuZGluZycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTGFuZGluZ0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsTGFuZGluZydcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnByb2R1Y3RzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3Byb2R1Y3RzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncHJvZHVjdHMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Byb2R1Y3RDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFByb2R1Y3QnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5wcm9kdWN0cy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzpwcm9kdWN0SWQnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwcm9kdWN0LmRldGFpbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdERldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUHJvZHVjdERldGFpbCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnByb2R1Y3RzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwcm9kdWN0LmNyZWF0ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdENyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUHJvZHVjdENyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmN1c3RvbWVycycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jdXN0b21lcnMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdjdXN0b21lcnMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0N1c3RvbWVyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxDdXN0b21lcidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmN1c3RvbWVycy5jcmVhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvY3JlYXRlJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnY3VzdG9tZXIuY3JlYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDdXN0b21lckNyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsQ3VzdG9tZXJDcmVhdGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5jdXN0b21lcnMuZGV0YWlsJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2RldGFpbC86Y3VzdG9tZXJJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2N1c3RvbWVyLmRldGFpbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ3VzdG9tZXJEZXRhaWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybEN1c3RvbWVyRGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAud29ya29yZGVycycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy93b3Jrb3JkZXJzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0Vmlldygnd29ya29yZGVycycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnV29ya09yZGVyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxXb3JrT3JkZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC53b3Jrb3JkZXJzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd3b3Jrb3JkZXIuY3JlYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdXb3JrT3JkZXJDcmVhdGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFdvcmtPcmRlckNyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLndvcmtvcmRlcnMuZGV0YWlsJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2RldGFpbC86d29ya09yZGVySWQnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd3b3Jrb3JkZXIuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdXb3JrT3JkZXJEZXRhaWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFdvcmtPcmRlckRldGFpbCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmV2ZW50cycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9ldmVudHMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdldmVudHMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0V2ZW50Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxFdmVudCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmV2ZW50cy5jcmVhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvY3JlYXRlJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnZXZlbnQuY3JlYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFdmVudENyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsRXZlbnRDcmVhdGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5ldmVudHMuZGV0YWlsJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2RldGFpbC86ZXZlbnRJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2V2ZW50LmRldGFpbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRXZlbnREZXRhaWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybEV2ZW50RGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucmVwb3J0cycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9yZXBvcnRzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncmVwb3J0cycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVwb3J0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxSZXBvcnRzJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAudW5pdHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvdW5pdHMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd1bml0cycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVW5pdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsVW5pdCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnVuaXRzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd1bml0LmNyZWF0ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVW5pdENyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsVW5pdENyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnVuaXRzLmRldGFpbCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9kZXRhaWwvOnVuaXRJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3VuaXQuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdVbml0RGV0YWlsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxVbml0RGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAubWF0ZXJpYWxzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL21hdGVyaWFscycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ21hdGVyaWFscycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWF0ZXJpYWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybE1hdGVyaWFsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAubWF0ZXJpYWxzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdtYXRlcmlhbC5jcmVhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01hdGVyaWFsQ3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxNYXRlcmlhbENyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLm1hdGVyaWFscy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzptYXRlcmlhbElkJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnbWF0ZXJpYWwuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNYXRlcmlhbERldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsTWF0ZXJpYWxEZXRhaWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5wdXJjaGFzZW9yZGVycycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9wdXJjaGFzZW9yZGVycycsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3B1cmNoYXNlb3JkZXJzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQdXJjaGFzZU9yZGVyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQdXJjaGFzZU9yZGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucHVyY2hhc2VvcmRlcnMuY3JlYXRlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NyZWF0ZScsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3B1cmNoYXNlb3JkZXIuY3JlYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQdXJjaGFzZU9yZGVyQ3JlYXRlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQdXJjaGFzZU9yZGVyQ3JlYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucHVyY2hhc2VvcmRlcnMuZGV0YWlsJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2RldGFpbC86cHVyY2hhc2VPcmRlcklkJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncHVyY2hhc2VvcmRlci5kZXRhaWwnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1B1cmNoYXNlT3JkZXJEZXRhaWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFB1cmNoYXNlT3JkZXJEZXRhaWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5wYXltZW50dHlwZXMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcGF5bWVudHR5cGVzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncGF5bWVudHR5cGVzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQYXltZW50VHlwZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUGF5bWVudFR5cGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5wYXltZW50dHlwZXMuY3JlYXRlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NyZWF0ZScsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3BheW1lbnR0eXBlLmNyZWF0ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUGF5bWVudFR5cGVDcmVhdGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFBheW1lbnRUeXBlQ3JlYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucGF5bWVudHR5cGVzLmRldGFpbCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9kZXRhaWwvOnBheW1lbnRUeXBlSWQnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwYXltZW50dHlwZS5kZXRhaWwnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1BheW1lbnRUeXBlRGV0YWlsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxQYXltZW50VHlwZURldGFpbCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG5cclxuICAgICAgICAgICAgO1xyXG5cclxuICAgIH0gKTtcclxufSkoKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnKVxyXG4gICAgLmRpcmVjdGl2ZSgndXRjUGFyc2VyJywgZnVuY3Rpb24gKClcclxuICAgIHtcclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbmdNb2RlbCkge1xyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkluIHV0Y1BhcnNlciBkaXJlY3RpdmVcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgcGFyc2VyID0gZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICAgICAgdmFsID0gbW9tZW50LnV0Yyh2YWwpLmZvcm1hdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtYXR0ZXIgPSBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YWwgPSBuZXcgRGF0ZSh2YWwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIG5nTW9kZWwuJHBhcnNlcnMudW5zaGlmdChwYXJzZXIpO1xyXG4gICAgICAgICAgICBuZ01vZGVsLiRmb3JtYXR0ZXJzLnVuc2hpZnQoZm9ybWF0dGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJ1xyXG4gICAgICAgIH07XHJcbiAgICB9KTsiLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLmZpbHRlcnNcIikuZmlsdGVyKCd0cnVuY2F0ZU5hbWUnLCBmdW5jdGlvbigpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBtYXhMZW5ndGgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnB1dCA9IGlucHV0IHx8IFwiXCI7XHJcbiAgICAgICAgICAgIHZhciBvdXQgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgaWYoaW5wdXQubGVuZ3RoID4gbWF4TGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBvdXQgPSBpbnB1dC5zdWJzdHIoMCwgbWF4TGVuZ3RoKSArIFwiLi4uXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBvdXQgPSBpbnB1dDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG91dDtcclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBCcmVlbiBvbiAxNS8wMi8yMDE2LlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZXNcIikuZmFjdG9yeSgnRGlhbG9nU2VydmljZScsIGZ1bmN0aW9uKCAkbWREaWFsb2cgKXtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZnJvbVRlbXBsYXRlOiBmdW5jdGlvbiggdGVtcGxhdGUsICRzY29wZSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaWFsb2dzLycgKyB0ZW1wbGF0ZSArICcvJyArIHRlbXBsYXRlICsgJy5odG1sJ1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoICRzY29wZSApe1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2NvcGUgPSAkc2NvcGUuJG5ldygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiAkbWREaWFsb2cuc2hvdyhvcHRpb25zKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGhpZGU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJG1kRGlhbG9nLmhpZGUoKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFsZXJ0OiBmdW5jdGlvbih0aXRsZSwgY29udGVudCl7XHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuc2hvdyhcclxuICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuYWxlcnQoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGl0bGUodGl0bGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jb250ZW50KGNvbnRlbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vaygnT2snKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGNvbmZpcm06IGZ1bmN0aW9uKGV2ZW50LCB0aXRsZSwgY29udGVudClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbmZpcm0gPSAkbWREaWFsb2cuY29uZmlybSgpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRpdGxlKHRpdGxlKVxyXG4gICAgICAgICAgICAgICAgICAgIC50ZXh0Q29udGVudChjb250ZW50KVxyXG4gICAgICAgICAgICAgICAgICAgIC5hcmlhTGFiZWwoJycpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRhcmdldEV2ZW50KGV2ZW50KVxyXG4gICAgICAgICAgICAgICAgICAgIC5vaygnWWVzJylcclxuICAgICAgICAgICAgICAgICAgICAuY2FuY2VsKCdObycpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiAkbWREaWFsb2cuc2hvdyhjb25maXJtKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgQnJlZW4gb24gMTUvMDIvMjAxNi5cclxuICovXHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ1Jlc3RTZXJ2aWNlJywgWyckYXV0aCcsICdSZXN0YW5ndWxhcicsICckbW9tZW50JywgZnVuY3Rpb24oJGF1dGgsIFJlc3Rhbmd1bGFyLCAkbW9tZW50KXtcclxuXHJcbiAgICAgICAgdmFyIGJhc2VQcm9kdWN0cyA9IFJlc3Rhbmd1bGFyLmFsbCgncHJvZHVjdCcpO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICAgICAgZ2V0QWxsUHJvZHVjdHM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBiYXNlUHJvZHVjdHMuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnByb2R1Y3RzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0UHJvZHVjdDogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3Byb2R1Y3QnLCBpZCkuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSGFjayBmb3IgT0xEIG15c3FsIGRyaXZlcnMgb24gSG9zdGdhdG9yIHdoaWNoIGRvbid0IHByb3Blcmx5IGVuY29kZSBpbnRlZ2VyIGFuZCByZXR1cm4gdGhlbSBhcyBzdHJpbmdzXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5pc19jdXN0b20gPSBwYXJzZUludChkYXRhLmlzX2N1c3RvbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvZHVjdCA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEFsbEN1c3RvbWVyczogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnY3VzdG9tZXInKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmN1c3RvbWVycyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEN1c3RvbWVyOiBmdW5jdGlvbihzY29wZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnY3VzdG9tZXInLCBpZCkuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY3VzdG9tZXIgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRBbGxXb3JrT3JkZXJzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCd3b3Jrb3JkZXInKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUud29ya29yZGVycyA9IGRhdGE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0V29ya09yZGVyOiBmdW5jdGlvbihzY29wZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnd29ya29yZGVyJywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBGb3JtYXQgc3RyaW5nIGRhdGVzIGludG8gZGF0ZSBvYmplY3RzXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5zdGFydF9kYXRlID0gJG1vbWVudChkYXRhLnN0YXJ0X2RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuZW5kX2RhdGUgPSAkbW9tZW50KGRhdGEuZW5kX2RhdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBIYWNrIGZvciBPTEQgbXlzcWwgZHJpdmVycyBvbiBIb3N0Z2F0b3Igd2hpY2ggZG9uJ3QgcHJvcGVybHkgZW5jb2RlIGludGVnZXIgYW5kIHJldHVybiB0aGVtIGFzIHN0cmluZ3NcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLmNvbXBsZXRlZCA9IHBhcnNlSW50KGRhdGEuY29tcGxldGVkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi53b3Jrb3JkZXIgPSBkYXRhO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUud29ya29yZGVyID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsRXZlbnRzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdldmVudCcpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuZXZlbnRzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0RXZlbnQ6IGZ1bmN0aW9uKHNjb3BlLCBpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdldmVudCcsIGlkKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5ldmVudCA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEFsbFVuaXRzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCd1bml0JykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS51bml0cyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldFVuaXQ6IGZ1bmN0aW9uKHNjb3BlLCBpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCd1bml0JywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnVuaXQgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRBbGxNYXRlcmlhbHM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ21hdGVyaWFsJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5tYXRlcmlhbHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRNYXRlcmlhbDogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ21hdGVyaWFsJywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLm1hdGVyaWFsID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZG9TZWFyY2g6IGZ1bmN0aW9uKHNjb3BlLCBxdWVyeSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDYWxsIFdTIHdpdGg6IFwiICsgcXVlcnkpO1xyXG5cclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnc2VhcmNoJywgcXVlcnkpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEFsbFB1cmNoYXNlT3JkZXJzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdwdXJjaGFzZW9yZGVyJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnB1cmNoYXNlb3JkZXJzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0UHVyY2hhc2VPcmRlcjogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3B1cmNoYXNlb3JkZXInLCBpZCkuZ2V0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEZvcm1hdCBzdHJpbmcgZGF0ZXMgaW50byBkYXRlIG9iamVjdHNcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLnBpY2t1cF9kYXRlID0gJG1vbWVudChkYXRhLnBpY2t1cF9kYXRlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSGFjayBmb3IgT0xEIG15c3FsIGRyaXZlcnMgb24gSG9zdGdhdG9yIHdoaWNoIGRvbid0IHByb3Blcmx5IGVuY29kZSBpbnRlZ2VyIGFuZCByZXR1cm4gdGhlbSBhcyBzdHJpbmdzXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5mdWxmaWxsZWQgPSBwYXJzZUludChkYXRhLmZ1bGZpbGxlZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnB1cmNoYXNlb3JkZXIgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRBbGxQYXltZW50VHlwZXM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3BheW1lbnR0eXBlJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5wYXltZW50dHlwZXMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRQYXltZW50VHlwZTogZnVuY3Rpb24oc2NvcGUsIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3BheW1lbnR0eXBlJywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnBheW1lbnR0eXBlID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH07XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgQnJlZW4gb24gMTUvMDIvMjAxNi5cclxuICovXHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ1RvYXN0U2VydmljZScsIGZ1bmN0aW9uKCAkbWRUb2FzdCApe1xyXG5cclxuICAgICAgICB2YXIgZGVsYXkgPSA2MDAwLFxyXG4gICAgICAgICAgICBwb3NpdGlvbiA9ICd0b3AgcmlnaHQnLFxyXG4gICAgICAgICAgICBhY3Rpb24gPSAnT0snO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzaG93OiBmdW5jdGlvbihjb250ZW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJG1kVG9hc3Quc2hvdyhcclxuICAgICAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaW1wbGUoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY29udGVudChjb250ZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucG9zaXRpb24ocG9zaXRpb24pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hY3Rpb24oYWN0aW9uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuaGlkZURlbGF5KGRlbGF5KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIENvcmVDb250cm9sbGVyKCRzY29wZSwgJGF1dGgsICRtb21lbnQsICRtZFNpZGVuYXYsICRtZE1lZGlhKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIHRvZGF5ID0gbmV3IERhdGUoKTtcclxuXHJcbiAgICAgICAgJHNjb3BlLnRvZGF5c0RhdGUgPSB0b2RheTtcclxuICAgICAgICAkc2NvcGUuc2hvd1NlYXJjaCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAkc2NvcGUudG9nZ2xlU2lkZW5hdiA9IGZ1bmN0aW9uKG1lbnVJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICRtZFNpZGVuYXYobWVudUlkKS50b2dnbGUoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuc2hvd1NpZGVOYXYgPSBmdW5jdGlvbihtZW51SWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZighJG1kU2lkZW5hdihtZW51SWQpLmlzTG9ja2VkT3BlbigpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAkbWRTaWRlbmF2KG1lbnVJZCkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmhpZGVTaWRlTmF2ID0gZnVuY3Rpb24obWVudUlkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoISRtZFNpZGVuYXYobWVudUlkKS5pc0xvY2tlZE9wZW4oKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgJG1kU2lkZW5hdihtZW51SWQpLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUudG9nZ2xlU2VhcmNoID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgJHNjb3BlLnNob3dTZWFyY2ggPSAhJHNjb3BlLnNob3dTZWFyY2g7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gTGlzdGVuIGZvciB0b2dnbGVTZWFyY2ggZXZlbnRzXHJcbiAgICAgICAgJHNjb3BlLiRvbihcInRvZ2dsZVNlYXJjaFwiLCBmdW5jdGlvbiAoZXZlbnQsIGFyZ3MpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAkc2NvcGUudG9nZ2xlU2VhcmNoKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb3JlQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRhdXRoJywgJyRtb21lbnQnLCAnJG1kU2lkZW5hdicsICckbWRNZWRpYScsIENvcmVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEN1c3RvbWVyQ3JlYXRlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBUb2FzdFNlcnZpY2UsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5jcmVhdGVDdXN0b21lciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuY3VzdG9tZXIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGMgPSBzZWxmLmN1c3RvbWVyO1xyXG5cclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdjdXN0b21lcicpLnBvc3QoYykudGhlbihmdW5jdGlvbihkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkKTtcclxuICAgICAgICAgICAgICAgIC8vJHN0YXRlLmdvKCdhcHAuY3VzdG9tZXJzLmRldGFpbCcsIHsnY3VzdG9tZXJJZCc6IGQubmV3SWR9KTtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5jdXN0b21lcnMnKTtcclxuXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBjcmVhdGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDdXN0b21lckNyZWF0ZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdUb2FzdFNlcnZpY2UnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgQ3VzdG9tZXJDcmVhdGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEN1c3RvbWVyRGV0YWlsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBUb2FzdFNlcnZpY2UsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgRGlhbG9nU2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEN1c3RvbWVyKHNlbGYsICRzdGF0ZVBhcmFtcy5jdXN0b21lcklkKTtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVDdXN0b21lciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuY3VzdG9tZXIucHV0KCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IHVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAuY3VzdG9tZXJzXCIpO1xyXG5cclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVDdXN0b21lciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuY3VzdG9tZXIucmVtb3ZlKCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGRlbGV0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAuY3VzdG9tZXJzXCIpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgRGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zaG93RGVsZXRlQ29uZmlybSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZyA9IERpYWxvZ1NlcnZpY2UuY29uZmlybShldiwgJ0RlbGV0ZSBjdXN0b21lcj8nLCAnVGhpcyB3aWxsIGFsc28gZGVsZXRlIGFueSB3b3JrIG9yZGVycyBhc3NvY2lhdGVkIHdpdGggdGhpcyBjdXN0b21lcicpO1xyXG4gICAgICAgICAgICBkaWFsb2cudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5kZWxldGVDdXN0b21lcigpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDdXN0b21lckRldGFpbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdUb2FzdFNlcnZpY2UnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsICckc3RhdGVQYXJhbXMnLCBDdXN0b21lckRldGFpbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gQ3VzdG9tZXJDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbEN1c3RvbWVycyhzZWxmKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0N1c3RvbWVyQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgQ3VzdG9tZXJDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEV2ZW50Q3JlYXRlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYuZXZlbnQgPSB7fTtcclxuXHJcbiAgICAgICAgc2VsZi5jcmVhdGVFdmVudCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuZXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGUgPSBzZWxmLmV2ZW50O1xyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygkZXJyb3IpO1xyXG5cclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdldmVudCcpLnBvc3QoZSkudGhlbihmdW5jdGlvbihlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ldmVudHMnKTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRXZlbnRDcmVhdGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgRXZlbnRDcmVhdGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEV2ZW50RGV0YWlsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcywgVG9hc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5zZWxlY3RlZFByb2R1Y3QgPSBcIlwiO1xyXG4gICAgICAgIHNlbGYuc2VsZWN0ZWRRdWFudGl0eSA9IDA7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJHN0YXRlUGFyYW1zKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRFdmVudChzZWxmLCAkc3RhdGVQYXJhbXMuZXZlbnRJZCk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUHJvZHVjdHMoc2VsZik7XHJcblxyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZUV2ZW50ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9SZXN0U2VydmljZS51cGRhdGVQcm9kdWN0KHNlbGYsIHNlbGYucHJvZHVjdC5pZCk7XHJcbiAgICAgICAgICAgIHNlbGYuZXZlbnQucHV0KCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJ1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgdXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5ldmVudHNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYWRkUHJvZHVjdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc2VsZWN0ZWRQcm9kdWN0KTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuZXZlbnQuZXZlbnRfcHJvZHVjdHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBldmVudF9pZDogc2VsZi5ldmVudC5pZCxcclxuICAgICAgICAgICAgICAgIHByb2R1Y3RfaWQ6IHNlbGYuc2VsZWN0ZWRQcm9kdWN0LmlkLFxyXG4gICAgICAgICAgICAgICAgcXVhbnRpdHk6IHNlbGYuc2VsZWN0ZWRRdWFudGl0eSxcclxuICAgICAgICAgICAgICAgIHByb2R1Y3Q6IHNlbGYuc2VsZWN0ZWRQcm9kdWN0XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFByb2R1Y3QgPSBcIlwiO1xyXG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkUXVhbnRpdHkgPSAwO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlUHJvZHVjdCA9IGZ1bmN0aW9uKGUsIHByb2R1Y3RJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleFRvUmVtb3ZlO1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgc2VsZi5ldmVudC5ldmVudF9wcm9kdWN0cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYocHJvZHVjdElkID09IHNlbGYuZXZlbnQuZXZlbnRfcHJvZHVjdHNbaV0ucHJvZHVjdF9pZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleFRvUmVtb3ZlID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coaW5kZXhUb1JlbW92ZSk7XHJcbiAgICAgICAgICAgIHNlbGYuZXZlbnQuZXZlbnRfcHJvZHVjdHMuc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlRXZlbnQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLmV2ZW50LnJlbW92ZSgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBkZWxldGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWVsdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLmV2ZW50c1wiKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIERlbGV0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2hvd0RlbGV0ZUNvbmZpcm0gPSBmdW5jdGlvbihldilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZXYsICdEZWxldGUgZXZlbnQ/JywgJycpO1xyXG4gICAgICAgICAgICBkaWFsb2cudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5kZWxldGVFdmVudCgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFdmVudERldGFpbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCAnVG9hc3RTZXJ2aWNlJywgJ0RpYWxvZ1NlcnZpY2UnLCBFdmVudERldGFpbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gRXZlbnRDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbEV2ZW50cyhzZWxmKTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRXZlbnRDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCBFdmVudENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gRm9vdGVyQ29udHJvbGxlcigkbW9tZW50KVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmN1cnJlbnRZZWFyID0gJG1vbWVudCgpLmZvcm1hdCgnWVlZWScpO1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdGb290ZXJDb250cm9sbGVyJywgWyckbW9tZW50JywgRm9vdGVyQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBIZWFkZXJDb250cm9sbGVyKCRhdXRoLCAkbW9tZW50KVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi50b2RheXNEYXRlID0gJG1vbWVudCgpLmZvcm1hdCgnZGRkZCwgTU1NTSBEbyBZWVlZJyk7XHJcblxyXG4gICAgICAgIHNlbGYuaXNBdXRoZW50aWNhdGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdIZWFkZXJDb250cm9sbGVyJywgWyckYXV0aCcsICckbW9tZW50JywgSGVhZGVyQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIExhbmRpbmdDb250cm9sbGVyKCRzdGF0ZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0xhbmRpbmdDb250cm9sbGVyJywgWyckc3RhdGUnLCBMYW5kaW5nQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIExvZ2luQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi50aXRsZSA9ICdMb2dpbic7XHJcblxyXG4gICAgICAgIHNlbGYucmVxdWVzdFRva2VuID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGNyZWRlbnRpYWxzID0geyBlbWFpbDogc2VsZi5lbWFpbCwgcGFzc3dvcmQ6IHNlbGYucGFzc3dvcmQgfTtcclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coY3JlZGVudGlhbHMpO1xyXG5cclxuICAgICAgICAgICAgLy8gVXNlIFNhdGVsbGl6ZXIncyAkYXV0aCBzZXJ2aWNlIHRvIGxvZ2luIGJlY2F1c2UgaXQnbGwgYXV0b21hdGljYWxseSBzYXZlIHRoZSBKV1QgaW4gbG9jYWxTdG9yYWdlXHJcbiAgICAgICAgICAgICRhdXRoLmxvZ2luKGNyZWRlbnRpYWxzKS50aGVuKGZ1bmN0aW9uIChkYXRhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiBsb2dpbiBpcyBzdWNjZXNzZnVsLCByZWRpcmVjdCB0byB0aGUgdXNlcnMgc3RhdGVcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmxhbmRpbmcnKTtcclxuICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ0Vycm9yIGxvZ2dpbmcgaW4nKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gVGhpcyByZXF1ZXN0IHdpbGwgaGl0IHRoZSBnZXREYXRhIG1ldGhvZCBpbiB0aGUgQXV0aGVudGljYXRlQ29udHJvbGxlclxyXG4gICAgICAgIC8vIG9uIHRoZSBMYXJhdmVsIHNpZGUgYW5kIHdpbGwgcmV0dXJuIHlvdXIgZGF0YSB0aGF0IHJlcXVpcmUgYXV0aGVudGljYXRpb25cclxuICAgICAgICAvKlxyXG4gICAgICAgICAkc2NvcGUuZ2V0RGF0YSA9IGZ1bmN0aW9uKClcclxuICAgICAgICAge1xyXG4gICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ2F1dGhlbnRpY2F0ZS9kYXRhJykuZ2V0KCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2Upe1xyXG5cclxuICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKXt9KTtcclxuICAgICAgICAgfTtcclxuICAgICAgICAgKi9cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTG9naW5Db250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCBMb2dpbkNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gTWF0ZXJpYWxDcmVhdGVDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxVbml0cyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi5jcmVhdGVNYXRlcmlhbCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYubWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICAgICAgdmFyIG0gPSBzZWxmLm1hdGVyaWFsO1xyXG5cclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdtYXRlcmlhbCcpLnBvc3QobSkudGhlbihmdW5jdGlvbihkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkKTtcclxuICAgICAgICAgICAgICAgIC8vJHN0YXRlLmdvKCdhcHAuY3VzdG9tZXJzLmRldGFpbCcsIHsnY3VzdG9tZXJJZCc6IGQubmV3SWR9KTtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5tYXRlcmlhbHMnKTtcclxuXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBjcmVhdGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdNYXRlcmlhbENyZWF0ZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdUb2FzdFNlcnZpY2UnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgTWF0ZXJpYWxDcmVhdGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIE1hdGVyaWFsRGV0YWlsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBUb2FzdFNlcnZpY2UsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgRGlhbG9nU2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsVW5pdHMoc2VsZik7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJHN0YXRlUGFyYW1zKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRNYXRlcmlhbChzZWxmLCAkc3RhdGVQYXJhbXMubWF0ZXJpYWxJZCk7XHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlTWF0ZXJpYWwgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLm1hdGVyaWFsLnB1dCgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLm1hdGVyaWFsc1wiKTtcclxuXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlTWF0ZXJpYWwgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLm1hdGVyaWFsLnJlbW92ZSgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBkZWxldGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLm1hdGVyaWFsc1wiKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIERlbGV0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNob3dEZWxldGVDb25maXJtID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGV2LCAnRGVsZXRlIG1hdGVyaWFsPycsICdUaGlzIHdpbGwgYWxzbyByZW1vdmUgdGhlIG1hdGVyaWFsIGZyb20gYW55IHByb2R1Y3RzIHVzaW5nIGl0Jyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZU1hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ01hdGVyaWFsRGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIE1hdGVyaWFsRGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBNYXRlcmlhbENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsTWF0ZXJpYWxzKHNlbGYpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTWF0ZXJpYWxDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCBNYXRlcmlhbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUGF5bWVudFR5cGVDcmVhdGVDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZVBheW1lbnRUeXBlID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5wYXltZW50dHlwZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYyA9IHNlbGYucGF5bWVudHR5cGU7XHJcblxyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3BheW1lbnR0eXBlJykucG9zdChjKS50aGVuKGZ1bmN0aW9uKGQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGQpO1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLnBheW1lbnR0eXBlcycpO1xyXG5cclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGNyZWF0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1BheW1lbnRUeXBlQ3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCBQYXltZW50VHlwZUNyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUGF5bWVudFR5cGVEZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0UGF5bWVudFR5cGUoc2VsZiwgJHN0YXRlUGFyYW1zLnBheW1lbnRUeXBlSWQpO1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZVBheW1lbnRUeXBlID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5wYXltZW50dHlwZS5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgdXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5wYXltZW50dHlwZXNcIik7XHJcblxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVBheW1lbnRUeXBlID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5wYXltZW50dHlwZS5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5wYXltZW50dHlwZXNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBEZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNob3dEZWxldGVDb25maXJtID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGV2LCAnRGVsZXRlIHBheW1lbnQgdHlwZT8nLCAnJyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZVBheW1lbnRUeXBlKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1BheW1lbnRUeXBlRGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIFBheW1lbnRUeXBlRGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBQYXltZW50VHlwZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUGF5bWVudFR5cGVzKHNlbGYpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUGF5bWVudFR5cGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCBQYXltZW50VHlwZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUHJvZHVjdENyZWF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFRvYXN0U2VydmljZSwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbE1hdGVyaWFscyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi5wcm9kdWN0ID0ge307XHJcbiAgICAgICAgc2VsZi5wcm9kdWN0LmNvc3QgPSAwO1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZVByb2R1Y3QgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnByb2R1Y3QpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHAgPSBzZWxmLnByb2R1Y3Q7XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCRlcnJvcik7XHJcblxyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3Byb2R1Y3QnKS5wb3N0KHApLnRoZW4oZnVuY3Rpb24oZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkKTtcclxuICAgICAgICAgICAgICAgIC8vJHN0YXRlLmdvKCdhcHAucHJvZHVjdHMuZGV0YWlsJywgeydwcm9kdWN0SWQnOiBkLm5ld0lkfSk7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBjcmVhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucHJvZHVjdHMnKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGNyZWF0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFkZE1hdGVyaWFsID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5zZWxlY3RlZE1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscyA9PT0gdW5kZWZpbmVkKSB7IHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscyA9IFtdOyB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbF9pZDogc2VsZi5zZWxlY3RlZE1hdGVyaWFsLmlkLFxyXG4gICAgICAgICAgICAgICAgcXVhbnRpdHk6IHNlbGYuc2VsZWN0ZWRRdWFudGl0eSxcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsOiBzZWxmLnNlbGVjdGVkTWF0ZXJpYWxcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZihzZWxmLnByb2R1Y3QuY29zdCA9PT0gdW5kZWZpbmVkIHx8IHNlbGYucHJvZHVjdC5jb3N0ID09PSBudWxsKSB7IHNlbGYucHJvZHVjdC5jb3N0ID0gMDsgfVxyXG4gICAgICAgICAgICB2YXIgY3VycmVudENvc3QgPSBwYXJzZUZsb2F0KHNlbGYucHJvZHVjdC5jb3N0KTtcclxuICAgICAgICAgICAgdmFyIGJ0ZXN0ID0gKHBhcnNlRmxvYXQoc2VsZi5zZWxlY3RlZE1hdGVyaWFsLnVuaXRfY29zdCkgKiBwYXJzZUludChzZWxmLnNlbGVjdGVkUXVhbnRpdHkpKTtcclxuICAgICAgICAgICAgY3VycmVudENvc3QgKz0gYnRlc3Q7XHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5jb3N0ID0gY3VycmVudENvc3Q7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkTWF0ZXJpYWwgPSBcIlwiO1xyXG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkUXVhbnRpdHkgPSAwO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5wcm9kdWN0KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZU1hdGVyaWFsID0gZnVuY3Rpb24oZSwgbWF0ZXJpYWxJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleFRvUmVtb3ZlO1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihtYXRlcmlhbElkID09IHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFsc1tpXS5tYXRlcmlhbF9pZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleFRvUmVtb3ZlID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coaW5kZXhUb1JlbW92ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY3VycmVudENvc3QgPSBwYXJzZUZsb2F0KHNlbGYucHJvZHVjdC5jb3N0KTtcclxuICAgICAgICAgICAgdmFyIGJ0ZXN0ID0gKHBhcnNlRmxvYXQoc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzW2luZGV4VG9SZW1vdmVdLm1hdGVyaWFsLnVuaXRfY29zdCkgKiBwYXJzZUludChzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHNbaW5kZXhUb1JlbW92ZV0ucXVhbnRpdHkpKTtcclxuICAgICAgICAgICAgY3VycmVudENvc3QgLT0gYnRlc3Q7XHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5jb3N0ID0gY3VycmVudENvc3Q7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMuc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQcm9kdWN0Q3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1RvYXN0U2VydmljZScsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCBQcm9kdWN0Q3JlYXRlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBQcm9kdWN0RGV0YWlsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcywgVG9hc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbE1hdGVyaWFscyhzZWxmKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRQcm9kdWN0KHNlbGYsICRzdGF0ZVBhcmFtcy5wcm9kdWN0SWQpO1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZVByb2R1Y3QgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL1Jlc3RTZXJ2aWNlLnVwZGF0ZVByb2R1Y3Qoc2VsZiwgc2VsZi5wcm9kdWN0LmlkKTtcclxuICAgICAgICAgICAgc2VsZi5wcm9kdWN0LnB1dCgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwidXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IHVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAucHJvZHVjdHNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlUHJvZHVjdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWVsdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5wcm9kdWN0c1wiKTtcclxuXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBkZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2hvd0RlbGV0ZUNvbmZpcm0gPSBmdW5jdGlvbihldilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZXYsICdEZWxldGUgcHJvZHVjdD8nLCAnVGhpcyB3aWxsIGFsc28gZGVsZXRlIGFueSB3b3JrIG9yZGVyIG9yIGV2ZW50IHN0b2NrIGxldmVscyBhc3NvY2lhdGVkIHdpdGggdGhpcyBwcm9kdWN0Jyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5kZWxldGVQcm9kdWN0KCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFkZE1hdGVyaWFsID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5zZWxlY3RlZE1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscyA9PT0gdW5kZWZpbmVkKSB7IHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscyA9IFtdOyB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBzZWxmLnByb2R1Y3QuaWQsXHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbF9pZDogc2VsZi5zZWxlY3RlZE1hdGVyaWFsLmlkLFxyXG4gICAgICAgICAgICAgICAgcXVhbnRpdHk6IHNlbGYuc2VsZWN0ZWRRdWFudGl0eSxcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsOiBzZWxmLnNlbGVjdGVkTWF0ZXJpYWxcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY3VycmVudENvc3QgPSBwYXJzZUZsb2F0KHNlbGYucHJvZHVjdC5jb3N0KTtcclxuICAgICAgICAgICAgdmFyIGJ0ZXN0ID0gKHBhcnNlRmxvYXQoc2VsZi5zZWxlY3RlZE1hdGVyaWFsLnVuaXRfY29zdCkgKiBwYXJzZUludChzZWxmLnNlbGVjdGVkUXVhbnRpdHkpKTtcclxuICAgICAgICAgICAgY3VycmVudENvc3QgKz0gYnRlc3Q7XHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5jb3N0ID0gY3VycmVudENvc3Q7XHJcblxyXG5cclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZE1hdGVyaWFsID0gXCJcIjtcclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFF1YW50aXR5ID0gMDtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVNYXRlcmlhbCA9IGZ1bmN0aW9uKGUsIG1hdGVyaWFsSWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXhUb1JlbW92ZTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYobWF0ZXJpYWxJZCA9PSBzZWxmLnByb2R1Y3QucHJvZHVjdF9tYXRlcmlhbHNbaV0ubWF0ZXJpYWxfaWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhUb1JlbW92ZSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGluZGV4VG9SZW1vdmUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRDb3N0ID0gcGFyc2VGbG9hdChzZWxmLnByb2R1Y3QuY29zdCk7XHJcbiAgICAgICAgICAgIHZhciBidGVzdCA9IChwYXJzZUZsb2F0KHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFsc1tpbmRleFRvUmVtb3ZlXS5tYXRlcmlhbC51bml0X2Nvc3QpICogcGFyc2VJbnQoc2VsZi5wcm9kdWN0LnByb2R1Y3RfbWF0ZXJpYWxzW2luZGV4VG9SZW1vdmVdLnF1YW50aXR5KSk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDb3N0IC09IGJ0ZXN0O1xyXG4gICAgICAgICAgICBzZWxmLnByb2R1Y3QuY29zdCA9IGN1cnJlbnRDb3N0O1xyXG5cclxuXHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5wcm9kdWN0X21hdGVyaWFscy5zcGxpY2UoaW5kZXhUb1JlbW92ZSwgMSk7XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUHJvZHVjdERldGFpbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCAnVG9hc3RTZXJ2aWNlJywgJ0RpYWxvZ1NlcnZpY2UnLCBQcm9kdWN0RGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBQcm9kdWN0Q29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxQcm9kdWN0cyhzZWxmKTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUHJvZHVjdENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsIFByb2R1Y3RDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFB1cmNoYXNlT3JkZXJDcmVhdGVDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBUb2FzdFNlcnZpY2UsIFJlc3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxDdXN0b21lcnMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUHJvZHVjdHMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUGF5bWVudFR5cGVzKHNlbGYpO1xyXG5cclxuICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIgPSB7fTtcclxuICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIuYW1vdW50X3BhaWQgPSAwO1xyXG4gICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9IDA7XHJcblxyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZVB1cmNoYXNlT3JkZXIgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnB1cmNoYXNlb3JkZXIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHAgPSBzZWxmLnB1cmNoYXNlb3JkZXI7XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCRlcnJvcik7XHJcblxyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3B1cmNoYXNlb3JkZXInKS5wb3N0KHApLnRoZW4oZnVuY3Rpb24oZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkKTtcclxuICAgICAgICAgICAgICAgIC8vJHN0YXRlLmdvKCdhcHAucHJvZHVjdHMuZGV0YWlsJywgeydwcm9kdWN0SWQnOiBkLm5ld0lkfSk7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBjcmVhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucHVyY2hhc2VvcmRlcnMnKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIGNyZWF0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmFkZFB1cmNoYXNlT3JkZXIgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnNlbGVjdGVkUHJvZHVjdCk7XHJcblxyXG4gICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMgPT09IHVuZGVmaW5lZCkgeyBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMgPSBbXTsgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgcHJvZHVjdF9pZDogc2VsZi5zZWxlY3RlZFByb2R1Y3QuaWQsXHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eTogc2VsZi5zZWxlY3RlZFF1YW50aXR5LFxyXG4gICAgICAgICAgICAgICAgcHJvZHVjdDogc2VsZi5zZWxlY3RlZFByb2R1Y3RcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZihzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPT09IHVuZGVmaW5lZCB8fCBzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwgPT09IG51bGwpIHsgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID0gMDsgfVxyXG4gICAgICAgICAgICB2YXIgY3VycmVudENvc3QgPSBwYXJzZUZsb2F0KHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCk7XHJcbiAgICAgICAgICAgIHZhciBidGVzdCA9IChwYXJzZUZsb2F0KHNlbGYuc2VsZWN0ZWRQcm9kdWN0LnByaWNlKSAqIHBhcnNlSW50KHNlbGYuc2VsZWN0ZWRRdWFudGl0eSkpO1xyXG4gICAgICAgICAgICBjdXJyZW50Q29zdCArPSBidGVzdDtcclxuICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnRvdGFsID0gY3VycmVudENvc3Q7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkUHJvZHVjdCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRRdWFudGl0eSA9IDA7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnB1cmNoYXNlb3JkZXIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlUHVyY2hhc2VPcmRlciA9IGZ1bmN0aW9uKGUsIHByb2R1Y3RJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleFRvUmVtb3ZlO1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihwcm9kdWN0SWQgPT0gc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzW2ldLnByb2R1Y3RfaWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhUb1JlbW92ZSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGluZGV4VG9SZW1vdmUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRDb3N0ID0gcGFyc2VGbG9hdChzZWxmLnB1cmNoYXNlb3JkZXIudG90YWwpO1xyXG4gICAgICAgICAgICB2YXIgYnRlc3QgPSAocGFyc2VGbG9hdChzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaW5kZXhUb1JlbW92ZV0ucHJvZHVjdC5wcmljZSkgKiBwYXJzZUludChzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaW5kZXhUb1JlbW92ZV0ucXVhbnRpdHkpKTtcclxuICAgICAgICAgICAgY3VycmVudENvc3QgLT0gYnRlc3Q7XHJcbiAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci50b3RhbCA9IGN1cnJlbnRDb3N0O1xyXG5cclxuICAgICAgICAgICAgc2VsZi5wdXJjaGFzZW9yZGVyLnB1cmNoYXNlX29yZGVyX3Byb2R1Y3RzLnNwbGljZShpbmRleFRvUmVtb3ZlLCAxKTtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUHVyY2hhc2VPcmRlckNyZWF0ZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdUb2FzdFNlcnZpY2UnLCAnUmVzdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgUHVyY2hhc2VPcmRlckNyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUHVyY2hhc2VPcmRlckRldGFpbENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMsIFRvYXN0U2VydmljZSwgRGlhbG9nU2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJHN0YXRlUGFyYW1zKTtcclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxDdXN0b21lcnMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUHJvZHVjdHMoc2VsZik7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUGF5bWVudFR5cGVzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldFB1cmNoYXNlT3JkZXIoc2VsZiwgJHN0YXRlUGFyYW1zLnB1cmNoYXNlT3JkZXJJZCk7XHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlUHVyY2hhc2VPcmRlciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYucHVyY2hhc2VvcmRlci5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLnB1cmNoYXNlb3JkZXJzXCIpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVB1cmNoYXNlT3JkZXIgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIucmVtb3ZlKCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGVlbHRlZFwiKTtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IGRlbGV0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAucHVyY2hhc2VvcmRlcnNcIik7XHJcblxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiRXJyb3IgZGVsZXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGRlbGV0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLnNob3dEZWxldGVDb25maXJtID0gZnVuY3Rpb24oZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gRGlhbG9nU2VydmljZS5jb25maXJtKGV2LCAnRGVsZXRlIHB1cmNoYXNlIG9yZGVyPycsICcnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZVB1cmNoYXNlT3JkZXIoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuYWRkUHJvZHVjdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc2VsZWN0ZWRQcm9kdWN0KTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cyA9PT0gdW5kZWZpbmVkKSB7IHNlbGYucHVyY2hhc2VvcmRlci5wdXJjaGFzZV9vcmRlcl9wcm9kdWN0cyA9IFtdOyB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBzZWxmLnNlbGVjdGVkUHJvZHVjdC5pZCxcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiBzZWxmLnNlbGVjdGVkUXVhbnRpdHksXHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0OiBzZWxmLnNlbGVjdGVkUHJvZHVjdFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRQcm9kdWN0ID0gXCJcIjtcclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFF1YW50aXR5ID0gMDtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVQcm9kdWN0ID0gZnVuY3Rpb24oZSwgcHJvZHVjdElkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4VG9SZW1vdmU7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHByb2R1Y3RJZCA9PSBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHNbaV0ucHJvZHVjdF9pZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleFRvUmVtb3ZlID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coaW5kZXhUb1JlbW92ZSk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnB1cmNoYXNlb3JkZXIucHVyY2hhc2Vfb3JkZXJfcHJvZHVjdHMuc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1B1cmNoYXNlT3JkZXJEZXRhaWxDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgJ1RvYXN0U2VydmljZScsICdEaWFsb2dTZXJ2aWNlJywgUHVyY2hhc2VPcmRlckRldGFpbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUHVyY2hhc2VPcmRlckNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUHVyY2hhc2VPcmRlcnMoc2VsZik7XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1B1cmNoYXNlT3JkZXJDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCBQdXJjaGFzZU9yZGVyQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBSZXBvcnRDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUmVwb3J0Q29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgUmVwb3J0Q29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBTZWFyY2hDb250cm9sbGVyKCRzY29wZSwgJGF1dGgsIFJlc3Rhbmd1bGFyLCAkc3RhdGUpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLm5vQ2FjaGUgPSB0cnVlO1xyXG4gICAgICAgIHNlbGYuc2VhcmNoVGV4dCA9IFwiXCI7XHJcbiAgICAgICAgc2VsZi5zZWxlY3RlZFJlc3VsdDtcclxuXHJcbiAgICAgICAgc2VsZi5kb1NlYXJjaCA9IGZ1bmN0aW9uKHF1ZXJ5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9SZXN0U2VydmljZS5kb1NlYXJjaChzZWxmLCBzZWxmLnNlYXJjaFRleHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIub25lKCdzZWFyY2gnLCBxdWVyeSkuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZmlyZVRvZ2dsZVNlYXJjaEV2ZW50ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgLy9zZWxmLiRyb290LiRicm9hZGNhc3QoXCJ0b2dnbGVTZWFyY2hcIiwge3VzZXJuYW1lOiAkc2NvcGUudXNlci51c2VybmFtZSB9KTtcclxuICAgICAgICAgICAgJHNjb3BlLiRyb290LiRicm9hZGNhc3QoXCJ0b2dnbGVTZWFyY2hcIik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5nb3RvSXRlbSA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc2VsZWN0ZWRSZXN1bHQpO1xyXG4gICAgICAgICAgICBpZihzZWxmLnNlbGVjdGVkUmVzdWx0ICE9IG51bGwgJiYgc2VsZi5zZWxlY3RlZFJlc3VsdCAhPSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoVGV4dCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmZpcmVUb2dnbGVTZWFyY2hFdmVudCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHN3aXRjaChzZWxmLnNlbGVjdGVkUmVzdWx0LmNvbnRlbnRfdHlwZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicHJvZHVjdFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5wcm9kdWN0cy5kZXRhaWwnLCB7J3Byb2R1Y3RJZCc6IHNlbGYuc2VsZWN0ZWRSZXN1bHQuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJjdXN0b21lclwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5jdXN0b21lcnMuZGV0YWlsJywgeydjdXN0b21lcklkJzogc2VsZi5zZWxlY3RlZFJlc3VsdC5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImV2ZW50XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmV2ZW50cy5kZXRhaWwnLCB7J2V2ZW50SWQnOiBzZWxmLnNlbGVjdGVkUmVzdWx0LmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwid29ya29yZGVyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLndvcmtvcmRlcnMuZGV0YWlsJywgeyd3b3JrT3JkZXJJZCc6IHNlbGYuc2VsZWN0ZWRSZXN1bHQuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJtYXRlcmlhbFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5tYXRlcmlhbHMuZGV0YWlsJywgeydtYXRlcmlhbElkJzogc2VsZi5zZWxlY3RlZFJlc3VsdC5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2VhcmNoQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRhdXRoJywgJ1Jlc3Rhbmd1bGFyJywgJyRzdGF0ZScsIFNlYXJjaENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gV29ya09yZGVyQ3JlYXRlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgVG9hc3RTZXJ2aWNlLCAkbW9tZW50LCBSZXN0U2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsQ3VzdG9tZXJzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFByb2R1Y3RzKHNlbGYpO1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZVdvcmtPcmRlciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vVHVlIEZlYiAwMiAyMDE2IDAwOjAwOjAwIEdNVC0wNDAwIChBdGxhbnRpYyBTdGFuZGFyZCBUaW1lKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLndvcmtvcmRlcik7XHJcblxyXG4gICAgICAgICAgICB2YXIgdyA9IHNlbGYud29ya29yZGVyO1xyXG5cclxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCd3b3Jrb3JkZXInKS5wb3N0KHcpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBjcmVhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8kc3RhdGUuZ28oJ2FwcC53b3Jrb3JkZXJzLmRldGFpbCcsIHsnd29ya09yZGVySWQnOiAxfSk7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC53b3Jrb3JkZXJzJyk7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdXb3JrT3JkZXJDcmVhdGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnVG9hc3RTZXJ2aWNlJywgJyRtb21lbnQnLCAnUmVzdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgV29ya09yZGVyQ3JlYXRlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBXb3JrT3JkZXJEZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCBEaWFsb2dTZXJ2aWNlLCAkbW9tZW50LCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0V29ya09yZGVyKHNlbGYsICRzdGF0ZVBhcmFtcy53b3JrT3JkZXJJZCk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsQ3VzdG9tZXJzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFByb2R1Y3RzKHNlbGYpO1xyXG5cclxuXHJcbiAgICAgICAgc2VsZi50b2dnbGVDb21wbGV0ZSA9IGZ1bmN0aW9uKGNiU3RhdGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjYlN0YXRlKTtcclxuICAgICAgICAgICAgLy9pZihjYlN0YXRlKSB7IHNlbGYud29ya29yZGVyLmNvbXBsZXRlZCA9IDE7IH1cclxuICAgICAgICAgICAgLy9lbHNlIHsgc2VsZi53b3Jrb3JkZXIuY29tcGxldGVkID0gMDsgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlV29ya09yZGVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi53b3Jrb3JkZXIucHV0KCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRvYXN0U2VydmljZS5zaG93KFwiU3VjY2Vzc2Z1bGx5IHVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAud29ya29yZGVyc1wiKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZVdvcmtPcmRlciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYud29ya29yZGVyLnJlbW92ZSgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBkZWxldGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLndvcmtvcmRlcnNcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBkZWxldGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5zaG93RGVsZXRlQ29uZmlybSA9IGZ1bmN0aW9uKGV2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRpYWxvZyA9IERpYWxvZ1NlcnZpY2UuY29uZmlybShldiwgJ0RlbGV0ZSB3b3JrIG9yZGVyPycsICcnKTtcclxuICAgICAgICAgICAgZGlhbG9nLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlV29ya09yZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1dvcmtPcmRlckRldGFpbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdUb2FzdFNlcnZpY2UnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsICckbW9tZW50JywgJyRzdGF0ZVBhcmFtcycsIFdvcmtPcmRlckRldGFpbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gV29ya09yZGVyQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRtb21lbnQpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLnNob3dDb21wbGV0ZSA9IGZhbHNlO1xyXG4gICAgICAgIHZhciB0b2RheXNEYXRlID0gJG1vbWVudCgpO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxXb3JrT3JkZXJzKHNlbGYpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhzZWxmKTtcclxuXHJcbiAgICAgICAgc2VsZi5zZXRVcmdlbmN5ID0gZnVuY3Rpb24ob2JqRGF0ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIDMgZGF5cywgNyBkYXlzLCAzMCBkYXlzLCB0aGUgcmVzdFxyXG4gICAgICAgICAgICB2YXIgZCA9ICRtb21lbnQob2JqRGF0ZSk7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgIHZhciBkYXlEaWZmID0gZC5kaWZmKHRvZGF5c0RhdGUsICdkYXlzJyk7XHJcblxyXG4gICAgICAgICAgICBpZihkYXlEaWZmID4gMzApIC8vIGdyZWVuXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImZhcldvcmtPcmRlclwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoZGF5RGlmZiA+IDcgJiYgZGF5RGlmZiA8PSAzMCkgLy8gYmx1ZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJjbG9zZVdvcmtPcmRlclwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoZGF5RGlmZiA+IDMgJiYgZGF5RGlmZiA8PSA3KSAvLyBvcmFuZ2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiY2xvc2VyV29ya09yZGVyXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSAvLyByZWRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiY2xvc2VzdFdvcmtPcmRlclwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGQuZGlmZih0b2RheXNEYXRlLCAnZGF5cycpKTtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi50b2dnbGVDb21wbGV0ZU9ubHkgPSBmdW5jdGlvbihjYlN0YXRlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RvZ2dsZScpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjYlN0YXRlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignV29ya09yZGVyQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJyRtb21lbnQnLCBXb3JrT3JkZXJDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFVuaXRDcmVhdGVDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFRvYXN0U2VydmljZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZVVuaXQgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnVuaXQpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGMgPSBzZWxmLnVuaXQ7XHJcblxyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3VuaXQnKS5wb3N0KGMpLnRoZW4oZnVuY3Rpb24oZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgICAgICAvLyRzdGF0ZS5nbygnYXBwLmN1c3RvbWVycy5kZXRhaWwnLCB7J2N1c3RvbWVySWQnOiBkLm5ld0lkfSk7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSBjcmVhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAudW5pdHMnKTtcclxuXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciBjcmVhdGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdVbml0Q3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1RvYXN0U2VydmljZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCBVbml0Q3JlYXRlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBVbml0RGV0YWlsQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBUb2FzdFNlcnZpY2UsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgRGlhbG9nU2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldFVuaXQoc2VsZiwgJHN0YXRlUGFyYW1zLnVuaXRJZCk7XHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlVW5pdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYudW5pdC5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgdXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC51bml0c1wiKTtcclxuXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJFcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlVW5pdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYudW5pdC5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVG9hc3RTZXJ2aWNlLnNob3coXCJTdWNjZXNzZnVsbHkgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC51bml0c1wiKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIkVycm9yIERlbGV0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuc2hvd0RlbGV0ZUNvbmZpcm0gPSBmdW5jdGlvbihldilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaWFsb2cgPSBEaWFsb2dTZXJ2aWNlLmNvbmZpcm0oZXYsICdEZWxldGUgdW5pdD8nLCAnJyk7XHJcbiAgICAgICAgICAgIGRpYWxvZy50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZVVuaXQoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVW5pdERldGFpbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdUb2FzdFNlcnZpY2UnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnRGlhbG9nU2VydmljZScsICckc3RhdGVQYXJhbXMnLCBVbml0RGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBVbml0Q29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBSZXN0U2VydmljZS5nZXRBbGxVbml0cyhzZWxmKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1VuaXRDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCBVbml0Q29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
