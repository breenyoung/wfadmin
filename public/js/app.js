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

    angular.module('app.services', ['ui.router', 'satellizer', 'restangular']);

    angular.module('app.routes', ['ui.router', 'satellizer']);
    angular.module('app.controllers', ['ui.router', 'ngMaterial', 'restangular', 'angular-momentjs', 'app.services']);
    angular.module('app.filters', []);

    angular.module('app.directives', []);
    angular.module('app.config', []);

    // Configuration
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
        $mdThemingProvider.theme('default')
            .primaryPalette('orange')
            .accentPalette('green')
            .warnPalette('red');
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

            ;

    }] );
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
            }
        };
    }]);
})();
/**
 * Created by Breen on 15/02/2016.
 */

(function(){
    "use strict";

    angular.module("app.services").factory('RestService', ['$auth', 'Restangular', function($auth, Restangular){

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
                });
            },

            getWorkOrder: function(scope, id)
            {
                Restangular.one('workorder', id).get().then(function(data)
                {
                    //console.log(data);
                    scope.workorder = data;
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

    function CustomerCreateController($auth, $state, Restangular, RestService, $stateParams)
    {
        var self = this;

        self.createCustomer = function()
        {
            console.log(self.customer);

            var c = self.customer;

            //Restangular.all('product').post(p).then(function()
            //{
            //console.log("created");
            $state.go('app.customers.detail', {'customerId': 1});


            //});

        };

    }

    angular.module('app.controllers').controller('CustomerCreateController', ['$auth', '$state', 'Restangular', 'RestService', '$stateParams', CustomerCreateController]);

})();

(function(){
    "use strict";

    function CustomerDetailController($auth, $state, Restangular, RestService, $stateParams)
    {
        var self = this;

        //console.log($stateParams);
        RestService.getCustomer(self, $stateParams.customerId);

        self.updateCustomer = function()
        {
            self.customer.put().then(function()
            {
                console.log("updated");
            }, function()
            {
                console.log("error updating");
            });
        };

        self.deleteCustomer = function()
        {
            self.customer.remove().then(function()
            {
                console.log("deelted");
            });

            $state.go("app.customers");
        };

    }

    angular.module('app.controllers').controller('CustomerDetailController', ['$auth', '$state', 'Restangular', 'RestService', '$stateParams', CustomerDetailController]);

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

    function FooterController($moment)
    {
        var self = this;
        self.currentYear = $moment().format('YYYY');
    }

    angular.module('app.controllers').controller('FooterController', ['$moment', FooterController]);

})();

(function(){
    "use strict";

    function HeaderController($auth)
    {
        var self = this;

        self.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };
    }

    angular.module('app.controllers').controller('HeaderController', ['$auth', HeaderController]);

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

    function ProductCreateController($auth, $state, Restangular, RestService, $stateParams)
    {
        var self = this;

        self.createProduct = function()
        {
            console.log(self.product);

            var p = self.product;

            //Restangular.all('product').post(p).then(function()
            //{
                //console.log("created");
                $state.go('app.products.detail', {'productId': 1});

            //});

        };

    }

    angular.module('app.controllers').controller('ProductCreateController', ['$auth', '$state', 'Restangular', 'RestService', '$stateParams', ProductCreateController]);

})();

(function(){
    "use strict";

    function ProductDetailController($auth, $state, Restangular, RestService, $stateParams, ToastService)
    {
        var self = this;

        //console.log($stateParams);
        RestService.getProduct(self, $stateParams.productId);

        self.updateProduct = function()
        {
            //RestService.updateProduct(self, self.product.id);
            self.product.put().then(function()
            {
                //console.log("updated");
                ToastService.show("Successfully updated");
            }, function()
            {
                console.log("error updating");
            });
        };

        self.deleteProduct = function()
        {
            self.product.remove().then(function()
            {
                console.log("deelted");
            });

            $state.go("app.products");
        };

    }

    angular.module('app.controllers').controller('ProductDetailController', ['$auth', '$state', 'Restangular', 'RestService', '$stateParams', 'ToastService', ProductDetailController]);

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

    function WorkOrderCreateController($auth, $state, Restangular, RestService, $stateParams)
    {
        var self = this;

        RestService.getAllCustomers(self);
        RestService.getAllProducts(self);

        self.createWorkOrder = function()
        {
            console.log(self.workorder);

            var w = self.workorder;

            Restangular.all('workorder').post(w).then(function()
            {
                console.log("created");
                //$state.go('app.workorders.detail', {'workOrderId': 1});
                $state.go('app.workorders');

            });

        };

    }

    angular.module('app.controllers').controller('WorkOrderCreateController', ['$auth', '$state', 'Restangular', 'RestService', '$stateParams', WorkOrderCreateController]);

})();

(function(){
    "use strict";

    function WorkOrderDetailController($auth, $state, Restangular, RestService, $stateParams)
    {
        var self = this;

        //console.log($stateParams);
        RestService.getWorkOrder(self, $stateParams.workOrderId);

        self.updateWorkOrder = function()
        {
            self.workorder.put().then(function()
            {
                console.log("updated");
            }, function()
            {
                console.log("error updating");
            });
        };

        self.deleteWorkOrder = function()
        {
            self.workorder.remove().then(function()
            {
                console.log("deelted");
            });

            $state.go("app.workorders");
        };

    }

    angular.module('app.controllers').controller('WorkOrderDetailController', ['$auth', '$state', 'Restangular', 'RestService', '$stateParams', WorkOrderDetailController]);

})();

(function(){
    "use strict";

    function WorkOrderController($auth, $state, Restangular, RestService)
    {
        var self = this;

        RestService.getAllWorkOrders(self);
    }

    angular.module('app.controllers').controller('WorkOrderController', ['$auth', '$state', 'Restangular', 'RestService', WorkOrderController]);

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHAuanMiLCJhcHAvcm91dGVzLmpzIiwiYXBwL3NlcnZpY2VzL2RpYWxvZy5qcyIsImFwcC9zZXJ2aWNlcy9yZXN0LmpzIiwiYXBwL3NlcnZpY2VzL3RvYXN0LmpzIiwiYXBwL2NvbnRyb2xsZXJzL2N1c3RvbWVycy9jdXN0b21lci5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvY3VzdG9tZXJzL2N1c3RvbWVyLmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy9jdXN0b21lcnMvY3VzdG9tZXJzLmpzIiwiYXBwL2NvbnRyb2xsZXJzL2Zvb3Rlci9mb290ZXIuanMiLCJhcHAvY29udHJvbGxlcnMvaGVhZGVyL2hlYWRlci5qcyIsImFwcC9jb250cm9sbGVycy9sYW5kaW5nL2xhbmRpbmcuanMiLCJhcHAvY29udHJvbGxlcnMvbG9naW4vbG9naW4uanMiLCJhcHAvY29udHJvbGxlcnMvcHJvZHVjdHMvcHJvZHVjdC5jcmVhdGUuanMiLCJhcHAvY29udHJvbGxlcnMvcHJvZHVjdHMvcHJvZHVjdC5kZXRhaWwuanMiLCJhcHAvY29udHJvbGxlcnMvcHJvZHVjdHMvcHJvZHVjdHMuanMiLCJhcHAvY29udHJvbGxlcnMvd29ya29yZGVycy93b3Jrb3JkZXIuY3JlYXRlLmpzIiwiYXBwL2NvbnRyb2xsZXJzL3dvcmtvcmRlcnMvd29ya29yZGVyLmRldGFpbC5qcyIsImFwcC9jb250cm9sbGVycy93b3Jrb3JkZXJzL3dvcmtvcmRlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsSUFBQSxNQUFBLFFBQUEsT0FBQTtRQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBOzs7SUFHQSxRQUFBLE9BQUEsZ0JBQUEsQ0FBQSxhQUFBLGNBQUE7O0lBRUEsUUFBQSxPQUFBLGNBQUEsQ0FBQSxhQUFBO0lBQ0EsUUFBQSxPQUFBLG1CQUFBLENBQUEsYUFBQSxjQUFBLGVBQUEsb0JBQUE7SUFDQSxRQUFBLE9BQUEsZUFBQTs7SUFFQSxRQUFBLE9BQUEsa0JBQUE7SUFDQSxRQUFBLE9BQUEsY0FBQTs7O0lBR0EsUUFBQSxPQUFBLGNBQUEseUJBQUEsVUFBQTtJQUNBOzs7UUFHQSxjQUFBLFdBQUE7OztJQUdBLFFBQUEsT0FBQSxjQUFBLDJCQUFBLFVBQUE7SUFDQTtRQUNBO2FBQ0EsYUFBQTthQUNBLFVBQUE7OztJQUdBLFFBQUEsT0FBQSxjQUFBLGdDQUFBLFNBQUEscUJBQUE7UUFDQTthQUNBLFdBQUE7YUFDQSxrQkFBQSxFQUFBLFFBQUE7OztJQUdBLFFBQUEsT0FBQSxjQUFBLCtCQUFBLFNBQUEsb0JBQUE7O1FBRUEsbUJBQUEsTUFBQTthQUNBLGVBQUE7YUFDQSxjQUFBO2FBQ0EsWUFBQTs7OztBQ2hEQSxDQUFBO0FBQ0E7SUFDQTtJQUNBLFFBQUEsT0FBQSxjQUFBLGtFQUFBLFNBQUEsZ0JBQUEsb0JBQUEsZ0JBQUE7O1FBRUEsSUFBQSxVQUFBLFVBQUEsVUFBQTtZQUNBLE9BQUEsZ0JBQUEsV0FBQTs7O1FBR0EsbUJBQUEsVUFBQTs7O1FBR0E7YUFDQSxNQUFBLE9BQUE7Z0JBQ0EsVUFBQTtnQkFDQSxPQUFBO29CQUNBLFFBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7b0JBRUEsUUFBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOztvQkFFQSxNQUFBOzs7YUFHQSxNQUFBLGFBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxPQUFBO29CQUNBLFNBQUE7d0JBQ0EsYUFBQSxRQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTs7OzthQUlBLE1BQUEsZUFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxnQkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSx1QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSx1QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxpQkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSx3QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSx3QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSxrQkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSx5QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7O2FBSUEsTUFBQSx5QkFBQTtnQkFDQSxLQUFBO2dCQUNBLE9BQUE7b0JBQ0EsU0FBQTt3QkFDQSxhQUFBLFFBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBOzs7Ozs7Ozs7Ozs7O0FDbklBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSxnQkFBQSxRQUFBLCtCQUFBLFVBQUEsV0FBQTs7UUFFQSxPQUFBO1lBQ0EsY0FBQSxVQUFBLFVBQUEsU0FBQTs7Z0JBRUEsSUFBQSxVQUFBO29CQUNBLGFBQUEsb0JBQUEsV0FBQSxNQUFBLFdBQUE7OztnQkFHQSxLQUFBLFFBQUE7b0JBQ0EsUUFBQSxRQUFBLE9BQUE7OztnQkFHQSxPQUFBLFVBQUEsS0FBQTs7O1lBR0EsTUFBQSxVQUFBO2dCQUNBLE9BQUEsVUFBQTs7O1lBR0EsT0FBQSxTQUFBLE9BQUEsUUFBQTtnQkFDQSxVQUFBO29CQUNBLFVBQUE7eUJBQ0EsTUFBQTt5QkFDQSxRQUFBO3lCQUNBLEdBQUE7Ozs7Ozs7Ozs7QUM1QkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsZUFBQSxDQUFBLFNBQUEsZUFBQSxTQUFBLE9BQUEsWUFBQTs7UUFFQSxJQUFBLGVBQUEsWUFBQSxJQUFBOztRQUVBLE9BQUE7O1lBRUEsZ0JBQUEsU0FBQTtZQUNBO2dCQUNBLGFBQUEsVUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsV0FBQTs7OztZQUlBLFlBQUEsU0FBQSxPQUFBO1lBQ0E7Z0JBQ0EsWUFBQSxJQUFBLFdBQUEsSUFBQSxNQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxVQUFBOzs7O1lBSUEsaUJBQUEsU0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxZQUFBLFVBQUEsS0FBQSxTQUFBO2dCQUNBO29CQUNBLFFBQUEsSUFBQTtvQkFDQSxNQUFBLFlBQUE7Ozs7WUFJQSxhQUFBLFNBQUEsT0FBQTtZQUNBO2dCQUNBLFlBQUEsSUFBQSxZQUFBLElBQUEsTUFBQSxLQUFBLFNBQUE7Z0JBQ0E7O29CQUVBLE1BQUEsV0FBQTs7OztZQUlBLGtCQUFBLFNBQUE7WUFDQTtnQkFDQSxZQUFBLElBQUEsYUFBQSxVQUFBLEtBQUEsU0FBQTtnQkFDQTs7b0JBRUEsTUFBQSxhQUFBOzs7O1lBSUEsY0FBQSxTQUFBLE9BQUE7WUFDQTtnQkFDQSxZQUFBLElBQUEsYUFBQSxJQUFBLE1BQUEsS0FBQSxTQUFBO2dCQUNBOztvQkFFQSxNQUFBLFlBQUE7Ozs7Ozs7Ozs7QUMzREEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBLGdCQUFBLFFBQUEsNkJBQUEsVUFBQSxVQUFBOztRQUVBLElBQUEsUUFBQTtZQUNBLFdBQUE7WUFDQSxTQUFBOztRQUVBLE9BQUE7WUFDQSxNQUFBLFNBQUEsU0FBQTtnQkFDQSxPQUFBLFNBQUE7b0JBQ0EsU0FBQTt5QkFDQSxRQUFBO3lCQUNBLFNBQUE7eUJBQ0EsT0FBQTt5QkFDQSxVQUFBOzs7Ozs7QUNwQkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSx5QkFBQSxPQUFBLFFBQUEsYUFBQSxhQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7O1FBRUEsS0FBQSxpQkFBQTtRQUNBO1lBQ0EsUUFBQSxJQUFBLEtBQUE7O1lBRUEsSUFBQSxJQUFBLEtBQUE7Ozs7O1lBS0EsT0FBQSxHQUFBLHdCQUFBLENBQUEsY0FBQTs7Ozs7Ozs7O0lBU0EsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNEJBQUEsQ0FBQSxTQUFBLFVBQUEsZUFBQSxlQUFBLGdCQUFBOzs7O0FDekJBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEseUJBQUEsT0FBQSxRQUFBLGFBQUEsYUFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOzs7UUFHQSxZQUFBLFlBQUEsTUFBQSxhQUFBOztRQUVBLEtBQUEsaUJBQUE7UUFDQTtZQUNBLEtBQUEsU0FBQSxNQUFBLEtBQUE7WUFDQTtnQkFDQSxRQUFBLElBQUE7ZUFDQTtZQUNBO2dCQUNBLFFBQUEsSUFBQTs7OztRQUlBLEtBQUEsaUJBQUE7UUFDQTtZQUNBLEtBQUEsU0FBQSxTQUFBLEtBQUE7WUFDQTtnQkFDQSxRQUFBLElBQUE7OztZQUdBLE9BQUEsR0FBQTs7Ozs7SUFLQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw0QkFBQSxDQUFBLFNBQUEsVUFBQSxlQUFBLGVBQUEsZ0JBQUE7Ozs7QUNqQ0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSxtQkFBQSxPQUFBLFFBQUEsYUFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOztRQUVBLFlBQUEsZ0JBQUE7Ozs7SUFJQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxzQkFBQSxDQUFBLFNBQUEsVUFBQSxlQUFBLGVBQUE7Ozs7QUNYQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLGlCQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7UUFDQSxLQUFBLGNBQUEsVUFBQSxPQUFBOzs7SUFHQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxvQkFBQSxDQUFBLFdBQUE7Ozs7QUNUQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLGlCQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7O1FBRUEsS0FBQSxrQkFBQSxXQUFBO1lBQ0EsT0FBQSxNQUFBOzs7O0lBSUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsb0JBQUEsQ0FBQSxTQUFBOzs7QUNaQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLGtCQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7OztJQUdBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHFCQUFBLENBQUEsVUFBQTs7O0FDUkEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSxnQkFBQSxPQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7O1FBRUEsS0FBQSxRQUFBOztRQUVBLEtBQUEsZUFBQTtRQUNBO1lBQ0EsSUFBQSxjQUFBLEVBQUEsT0FBQSxLQUFBLE9BQUEsVUFBQSxLQUFBOzs7OztZQUtBLE1BQUEsTUFBQSxhQUFBLEtBQUEsVUFBQTtZQUNBOztnQkFFQSxPQUFBLEdBQUE7ZUFDQSxNQUFBLFNBQUE7WUFDQTtnQkFDQSxNQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0lBZ0JBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLG1CQUFBLENBQUEsU0FBQSxVQUFBOzs7O0FDdENBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEsd0JBQUEsT0FBQSxRQUFBLGFBQUEsYUFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOztRQUVBLEtBQUEsZ0JBQUE7UUFDQTtZQUNBLFFBQUEsSUFBQSxLQUFBOztZQUVBLElBQUEsSUFBQSxLQUFBOzs7OztnQkFLQSxPQUFBLEdBQUEsdUJBQUEsQ0FBQSxhQUFBOzs7Ozs7OztJQVFBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDJCQUFBLENBQUEsU0FBQSxVQUFBLGVBQUEsZUFBQSxnQkFBQTs7OztBQ3hCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLHdCQUFBLE9BQUEsUUFBQSxhQUFBLGFBQUEsY0FBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOzs7UUFHQSxZQUFBLFdBQUEsTUFBQSxhQUFBOztRQUVBLEtBQUEsZ0JBQUE7UUFDQTs7WUFFQSxLQUFBLFFBQUEsTUFBQSxLQUFBO1lBQ0E7O2dCQUVBLGFBQUEsS0FBQTtlQUNBO1lBQ0E7Z0JBQ0EsUUFBQSxJQUFBOzs7O1FBSUEsS0FBQSxnQkFBQTtRQUNBO1lBQ0EsS0FBQSxRQUFBLFNBQUEsS0FBQTtZQUNBO2dCQUNBLFFBQUEsSUFBQTs7O1lBR0EsT0FBQSxHQUFBOzs7OztJQUtBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLDJCQUFBLENBQUEsU0FBQSxVQUFBLGVBQUEsZUFBQSxnQkFBQSxnQkFBQTs7OztBQ25DQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLGtCQUFBLE9BQUEsUUFBQSxhQUFBO0lBQ0E7UUFDQSxJQUFBLE9BQUE7O1FBRUEsWUFBQSxlQUFBOzs7SUFHQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSxxQkFBQSxDQUFBLFNBQUEsVUFBQSxlQUFBLGVBQUE7Ozs7QUNWQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxTQUFBLDBCQUFBLE9BQUEsUUFBQSxhQUFBLGFBQUE7SUFDQTtRQUNBLElBQUEsT0FBQTs7UUFFQSxZQUFBLGdCQUFBO1FBQ0EsWUFBQSxlQUFBOztRQUVBLEtBQUEsa0JBQUE7UUFDQTtZQUNBLFFBQUEsSUFBQSxLQUFBOztZQUVBLElBQUEsSUFBQSxLQUFBOztZQUVBLFlBQUEsSUFBQSxhQUFBLEtBQUEsR0FBQSxLQUFBO1lBQ0E7Z0JBQ0EsUUFBQSxJQUFBOztnQkFFQSxPQUFBLEdBQUE7Ozs7Ozs7O0lBUUEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsNkJBQUEsQ0FBQSxTQUFBLFVBQUEsZUFBQSxlQUFBLGdCQUFBOzs7O0FDNUJBLENBQUEsVUFBQTtJQUNBOztJQUVBLFNBQUEsMEJBQUEsT0FBQSxRQUFBLGFBQUEsYUFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOzs7UUFHQSxZQUFBLGFBQUEsTUFBQSxhQUFBOztRQUVBLEtBQUEsa0JBQUE7UUFDQTtZQUNBLEtBQUEsVUFBQSxNQUFBLEtBQUE7WUFDQTtnQkFDQSxRQUFBLElBQUE7ZUFDQTtZQUNBO2dCQUNBLFFBQUEsSUFBQTs7OztRQUlBLEtBQUEsa0JBQUE7UUFDQTtZQUNBLEtBQUEsVUFBQSxTQUFBLEtBQUE7WUFDQTtnQkFDQSxRQUFBLElBQUE7OztZQUdBLE9BQUEsR0FBQTs7Ozs7SUFLQSxRQUFBLE9BQUEsbUJBQUEsV0FBQSw2QkFBQSxDQUFBLFNBQUEsVUFBQSxlQUFBLGVBQUEsZ0JBQUE7Ozs7QUNqQ0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSxvQkFBQSxPQUFBLFFBQUEsYUFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOztRQUVBLFlBQUEsaUJBQUE7OztJQUdBLFFBQUEsT0FBQSxtQkFBQSxXQUFBLHVCQUFBLENBQUEsU0FBQSxVQUFBLGVBQUEsZUFBQTs7O0FBR0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsXHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICAnYXBwLmNvbnRyb2xsZXJzJyxcclxuICAgICAgICAgICAgJ2FwcC5maWx0ZXJzJyxcclxuICAgICAgICAgICAgJ2FwcC5zZXJ2aWNlcycsXHJcbiAgICAgICAgICAgICdhcHAuZGlyZWN0aXZlcycsXHJcbiAgICAgICAgICAgICdhcHAucm91dGVzJyxcclxuICAgICAgICAgICAgJ2FwcC5jb25maWcnXHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycsIFsndWkucm91dGVyJywgJ3NhdGVsbGl6ZXInLCAncmVzdGFuZ3VsYXInXSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnLCBbJ3VpLnJvdXRlcicsICdzYXRlbGxpemVyJ10pO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycsIFsndWkucm91dGVyJywgJ25nTWF0ZXJpYWwnLCAncmVzdGFuZ3VsYXInLCAnYW5ndWxhci1tb21lbnRqcycsICdhcHAuc2VydmljZXMnXSk7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmZpbHRlcnMnLCBbXSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJywgW10pO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnLCBbXSk7XHJcblxyXG4gICAgLy8gQ29uZmlndXJhdGlvblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoZnVuY3Rpb24gKCRhdXRoUHJvdmlkZXIpXHJcbiAgICB7XHJcbiAgICAgICAgLy8gU2F0ZWxsaXplciBjb25maWd1cmF0aW9uIHRoYXQgc3BlY2lmaWVzIHdoaWNoIEFQSVxyXG4gICAgICAgIC8vIHJvdXRlIHRoZSBKV1Qgc2hvdWxkIGJlIHJldHJpZXZlZCBmcm9tXHJcbiAgICAgICAgJGF1dGhQcm92aWRlci5sb2dpblVybCA9ICcvYXBpL2F1dGhlbnRpY2F0ZSc7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoJG1vbWVudFByb3ZpZGVyKVxyXG4gICAge1xyXG4gICAgICAgICRtb21lbnRQcm92aWRlclxyXG4gICAgICAgICAgICAuYXN5bmNMb2FkaW5nKGZhbHNlKVxyXG4gICAgICAgICAgICAuc2NyaXB0VXJsKCcvL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9tb21lbnQuanMvMi41LjEvbW9tZW50Lm1pbi5qcycpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoIGZ1bmN0aW9uKFJlc3Rhbmd1bGFyUHJvdmlkZXIpIHtcclxuICAgICAgICBSZXN0YW5ndWxhclByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zZXRCYXNlVXJsKCcvYXBpLycpXHJcbiAgICAgICAgICAgIC5zZXREZWZhdWx0SGVhZGVycyh7IGFjY2VwdDogXCJhcHBsaWNhdGlvbi94LmxhcmF2ZWwudjEranNvblwiIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnKS5jb25maWcoIGZ1bmN0aW9uKCRtZFRoZW1pbmdQcm92aWRlcikge1xyXG4gICAgICAgIC8qIEZvciBtb3JlIGluZm8sIHZpc2l0IGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhcmpzLm9yZy8jL1RoZW1pbmcvMDFfaW50cm9kdWN0aW9uICovXHJcbiAgICAgICAgJG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0JylcclxuICAgICAgICAgICAgLnByaW1hcnlQYWxldHRlKCdvcmFuZ2UnKVxyXG4gICAgICAgICAgICAuYWNjZW50UGFsZXR0ZSgnZ3JlZW4nKVxyXG4gICAgICAgICAgICAud2FyblBhbGV0dGUoJ3JlZCcpO1xyXG4gICAgfSk7XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbigpXHJcbntcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnKS5jb25maWcoIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRhdXRoUHJvdmlkZXIgKSB7XHJcblxyXG4gICAgICAgIHZhciBnZXRWaWV3ID0gZnVuY3Rpb24oIHZpZXdOYW1lICl7XHJcbiAgICAgICAgICAgIHJldHVybiAnL3ZpZXdzL2FwcC8nICsgdmlld05hbWUgKyAnLmh0bWwnO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9sb2dpbicpO1xyXG5cclxuXHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAnLCB7XHJcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdoZWFkZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0hlYWRlckNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsSGVhZGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZm9vdGVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdmb290ZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0Zvb3RlckNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsRm9vdGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbWFpbjoge31cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAubG9naW4nLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvbG9naW4nLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdsb2dpbicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9naW5Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybExvZ2luJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAubGFuZGluZycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9sYW5kaW5nJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnbGFuZGluZycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTGFuZGluZ0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsTGFuZGluZydcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnByb2R1Y3RzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3Byb2R1Y3RzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygncHJvZHVjdHMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Byb2R1Y3RDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFByb2R1Y3QnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5wcm9kdWN0cy5kZXRhaWwnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsLzpwcm9kdWN0SWQnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwcm9kdWN0LmRldGFpbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdERldGFpbENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUHJvZHVjdERldGFpbCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnByb2R1Y3RzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwcm9kdWN0LmNyZWF0ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdENyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUHJvZHVjdENyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmN1c3RvbWVycycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jdXN0b21lcnMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdjdXN0b21lcnMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0N1c3RvbWVyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxDdXN0b21lcidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmN1c3RvbWVycy5jcmVhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvY3JlYXRlJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0VmlldygnY3VzdG9tZXIuY3JlYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDdXN0b21lckNyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsQ3VzdG9tZXJDcmVhdGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5jdXN0b21lcnMuZGV0YWlsJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2RldGFpbC86Y3VzdG9tZXJJZCcsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2N1c3RvbWVyLmRldGFpbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ3VzdG9tZXJEZXRhaWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybEN1c3RvbWVyRGV0YWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAud29ya29yZGVycycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy93b3Jrb3JkZXJzJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21haW5AJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZ2V0Vmlldygnd29ya29yZGVycycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnV29ya09yZGVyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxXb3JrT3JkZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC53b3Jrb3JkZXJzLmNyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9jcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd3b3Jrb3JkZXIuY3JlYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdXb3JrT3JkZXJDcmVhdGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFdvcmtPcmRlckNyZWF0ZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLndvcmtvcmRlcnMuZGV0YWlsJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2RldGFpbC86d29ya09yZGVySWQnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCd3b3Jrb3JkZXIuZGV0YWlsJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdXb3JrT3JkZXJEZXRhaWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybFdvcmtPcmRlckRldGFpbCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICA7XHJcblxyXG4gICAgfSApO1xyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEJyZWVuIG9uIDE1LzAyLzIwMTYuXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdEaWFsb2dTZXJ2aWNlJywgZnVuY3Rpb24oICRtZERpYWxvZyApe1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBmcm9tVGVtcGxhdGU6IGZ1bmN0aW9uKCB0ZW1wbGF0ZSwgJHNjb3BlICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpYWxvZ3MvJyArIHRlbXBsYXRlICsgJy8nICsgdGVtcGxhdGUgKyAnLmh0bWwnXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggJHNjb3BlICl7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5zY29wZSA9ICRzY29wZS4kbmV3KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRtZERpYWxvZy5zaG93KG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgaGlkZTogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkbWREaWFsb2cuaGlkZSgpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWxlcnQ6IGZ1bmN0aW9uKHRpdGxlLCBjb250ZW50KXtcclxuICAgICAgICAgICAgICAgICRtZERpYWxvZy5zaG93KFxyXG4gICAgICAgICAgICAgICAgICAgICRtZERpYWxvZy5hbGVydCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aXRsZSh0aXRsZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNvbnRlbnQoY29udGVudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm9rKCdPaycpXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEJyZWVuIG9uIDE1LzAyLzIwMTYuXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdSZXN0U2VydmljZScsIFsnJGF1dGgnLCAnUmVzdGFuZ3VsYXInLCBmdW5jdGlvbigkYXV0aCwgUmVzdGFuZ3VsYXIpe1xyXG5cclxuICAgICAgICB2YXIgYmFzZVByb2R1Y3RzID0gUmVzdGFuZ3VsYXIuYWxsKCdwcm9kdWN0Jyk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcblxyXG4gICAgICAgICAgICBnZXRBbGxQcm9kdWN0czogZnVuY3Rpb24oc2NvcGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGJhc2VQcm9kdWN0cy5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvZHVjdHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRQcm9kdWN0OiBmdW5jdGlvbihzY29wZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncHJvZHVjdCcsIGlkKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5wcm9kdWN0ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0QWxsQ3VzdG9tZXJzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdjdXN0b21lcicpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY3VzdG9tZXJzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0Q3VzdG9tZXI6IGZ1bmN0aW9uKHNjb3BlLCBpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdjdXN0b21lcicsIGlkKS5nZXQoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXN0b21lciA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEFsbFdvcmtPcmRlcnM6IGZ1bmN0aW9uKHNjb3BlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3dvcmtvcmRlcicpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS53b3Jrb3JkZXJzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0V29ya09yZGVyOiBmdW5jdGlvbihzY29wZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnd29ya29yZGVyJywgaWQpLmdldCgpLnRoZW4oZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLndvcmtvcmRlciA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgQnJlZW4gb24gMTUvMDIvMjAxNi5cclxuICovXHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ1RvYXN0U2VydmljZScsIGZ1bmN0aW9uKCAkbWRUb2FzdCApe1xyXG5cclxuICAgICAgICB2YXIgZGVsYXkgPSA2MDAwLFxyXG4gICAgICAgICAgICBwb3NpdGlvbiA9ICd0b3AgcmlnaHQnLFxyXG4gICAgICAgICAgICBhY3Rpb24gPSAnT0snO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzaG93OiBmdW5jdGlvbihjb250ZW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJG1kVG9hc3Quc2hvdyhcclxuICAgICAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaW1wbGUoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY29udGVudChjb250ZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucG9zaXRpb24ocG9zaXRpb24pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hY3Rpb24oYWN0aW9uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuaGlkZURlbGF5KGRlbGF5KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEN1c3RvbWVyQ3JlYXRlQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCBSZXN0YW5ndWxhciwgUmVzdFNlcnZpY2UsICRzdGF0ZVBhcmFtcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYuY3JlYXRlQ3VzdG9tZXIgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLmN1c3RvbWVyKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjID0gc2VsZi5jdXN0b21lcjtcclxuXHJcbiAgICAgICAgICAgIC8vUmVzdGFuZ3VsYXIuYWxsKCdwcm9kdWN0JykucG9zdChwKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgLy97XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJjcmVhdGVkXCIpO1xyXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5jdXN0b21lcnMuZGV0YWlsJywgeydjdXN0b21lcklkJzogMX0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vfSk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDdXN0b21lckNyZWF0ZUNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCBDdXN0b21lckNyZWF0ZUNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gQ3VzdG9tZXJEZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEN1c3RvbWVyKHNlbGYsICRzdGF0ZVBhcmFtcy5jdXN0b21lcklkKTtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVDdXN0b21lciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYuY3VzdG9tZXIucHV0KCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHVwZGF0aW5nXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRlbGV0ZUN1c3RvbWVyID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZi5jdXN0b21lci5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWVsdGVkXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5jdXN0b21lcnNcIik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0N1c3RvbWVyRGV0YWlsQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIEN1c3RvbWVyRGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBDdXN0b21lckNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsQ3VzdG9tZXJzKHNlbGYpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ3VzdG9tZXJDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCBDdXN0b21lckNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gRm9vdGVyQ29udHJvbGxlcigkbW9tZW50KVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmN1cnJlbnRZZWFyID0gJG1vbWVudCgpLmZvcm1hdCgnWVlZWScpO1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdGb290ZXJDb250cm9sbGVyJywgWyckbW9tZW50JywgRm9vdGVyQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBIZWFkZXJDb250cm9sbGVyKCRhdXRoKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5pc0F1dGhlbnRpY2F0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRhdXRoLmlzQXV0aGVudGljYXRlZCgpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hlYWRlckNvbnRyb2xsZXInLCBbJyRhdXRoJywgSGVhZGVyQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIExhbmRpbmdDb250cm9sbGVyKCRzdGF0ZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0xhbmRpbmdDb250cm9sbGVyJywgWyckc3RhdGUnLCBMYW5kaW5nQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIExvZ2luQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi50aXRsZSA9ICdMb2dpbic7XHJcblxyXG4gICAgICAgIHNlbGYucmVxdWVzdFRva2VuID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGNyZWRlbnRpYWxzID0geyBlbWFpbDogc2VsZi5lbWFpbCwgcGFzc3dvcmQ6IHNlbGYucGFzc3dvcmQgfTtcclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coY3JlZGVudGlhbHMpO1xyXG5cclxuICAgICAgICAgICAgLy8gVXNlIFNhdGVsbGl6ZXIncyAkYXV0aCBzZXJ2aWNlIHRvIGxvZ2luIGJlY2F1c2UgaXQnbGwgYXV0b21hdGljYWxseSBzYXZlIHRoZSBKV1QgaW4gbG9jYWxTdG9yYWdlXHJcbiAgICAgICAgICAgICRhdXRoLmxvZ2luKGNyZWRlbnRpYWxzKS50aGVuKGZ1bmN0aW9uIChkYXRhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiBsb2dpbiBpcyBzdWNjZXNzZnVsLCByZWRpcmVjdCB0byB0aGUgdXNlcnMgc3RhdGVcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmxhbmRpbmcnKTtcclxuICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ0Vycm9yIGxvZ2dpbmcgaW4nKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gVGhpcyByZXF1ZXN0IHdpbGwgaGl0IHRoZSBnZXREYXRhIG1ldGhvZCBpbiB0aGUgQXV0aGVudGljYXRlQ29udHJvbGxlclxyXG4gICAgICAgIC8vIG9uIHRoZSBMYXJhdmVsIHNpZGUgYW5kIHdpbGwgcmV0dXJuIHlvdXIgZGF0YSB0aGF0IHJlcXVpcmUgYXV0aGVudGljYXRpb25cclxuICAgICAgICAvKlxyXG4gICAgICAgICAkc2NvcGUuZ2V0RGF0YSA9IGZ1bmN0aW9uKClcclxuICAgICAgICAge1xyXG4gICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ2F1dGhlbnRpY2F0ZS9kYXRhJykuZ2V0KCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2Upe1xyXG5cclxuICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKXt9KTtcclxuICAgICAgICAgfTtcclxuICAgICAgICAgKi9cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTG9naW5Db250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCBMb2dpbkNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUHJvZHVjdENyZWF0ZUNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZVByb2R1Y3QgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnByb2R1Y3QpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHAgPSBzZWxmLnByb2R1Y3Q7XHJcblxyXG4gICAgICAgICAgICAvL1Jlc3Rhbmd1bGFyLmFsbCgncHJvZHVjdCcpLnBvc3QocCkudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIC8ve1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImNyZWF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5wcm9kdWN0cy5kZXRhaWwnLCB7J3Byb2R1Y3RJZCc6IDF9KTtcclxuXHJcbiAgICAgICAgICAgIC8vfSk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQcm9kdWN0Q3JlYXRlQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIFByb2R1Y3RDcmVhdGVDb250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFByb2R1Y3REZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgJHN0YXRlUGFyYW1zLCBUb2FzdFNlcnZpY2UpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRzdGF0ZVBhcmFtcyk7XHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0UHJvZHVjdChzZWxmLCAkc3RhdGVQYXJhbXMucHJvZHVjdElkKTtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGVQcm9kdWN0ID0gZnVuY3Rpb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9SZXN0U2VydmljZS51cGRhdGVQcm9kdWN0KHNlbGYsIHNlbGYucHJvZHVjdC5pZCk7XHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5wdXQoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICBUb2FzdFNlcnZpY2Uuc2hvdyhcIlN1Y2Nlc3NmdWxseSB1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgdXBkYXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuZGVsZXRlUHJvZHVjdCA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYucHJvZHVjdC5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWVsdGVkXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5wcm9kdWN0c1wiKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignUHJvZHVjdERldGFpbENvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCAnVG9hc3RTZXJ2aWNlJywgUHJvZHVjdERldGFpbENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gUHJvZHVjdENvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSwgUmVzdGFuZ3VsYXIsIFJlc3RTZXJ2aWNlKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsUHJvZHVjdHMoc2VsZik7XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1Byb2R1Y3RDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCBQcm9kdWN0Q29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBXb3JrT3JkZXJDcmVhdGVDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgUmVzdFNlcnZpY2UuZ2V0QWxsQ3VzdG9tZXJzKHNlbGYpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFByb2R1Y3RzKHNlbGYpO1xyXG5cclxuICAgICAgICBzZWxmLmNyZWF0ZVdvcmtPcmRlciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYud29ya29yZGVyKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB3ID0gc2VsZi53b3Jrb3JkZXI7XHJcblxyXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3dvcmtvcmRlcicpLnBvc3QodykudGhlbihmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY3JlYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgIC8vJHN0YXRlLmdvKCdhcHAud29ya29yZGVycy5kZXRhaWwnLCB7J3dvcmtPcmRlcklkJzogMX0pO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAud29ya29yZGVycycpO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdXb3JrT3JkZXJDcmVhdGVDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgV29ya09yZGVyQ3JlYXRlQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBXb3JrT3JkZXJEZXRhaWxDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSwgJHN0YXRlUGFyYW1zKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldFdvcmtPcmRlcihzZWxmLCAkc3RhdGVQYXJhbXMud29ya09yZGVySWQpO1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZVdvcmtPcmRlciA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGYud29ya29yZGVyLnB1dCgpLnRoZW4oZnVuY3Rpb24oKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInVwZGF0ZWRcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZ1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5kZWxldGVXb3JrT3JkZXIgPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxmLndvcmtvcmRlci5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWVsdGVkXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC53b3Jrb3JkZXJzXCIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdXb3JrT3JkZXJEZXRhaWxDb250cm9sbGVyJywgWyckYXV0aCcsICckc3RhdGUnLCAnUmVzdGFuZ3VsYXInLCAnUmVzdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgV29ya09yZGVyRGV0YWlsQ29udHJvbGxlcl0pO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBXb3JrT3JkZXJDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFdvcmtPcmRlcnMoc2VsZik7XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1dvcmtPcmRlckNvbnRyb2xsZXInLCBbJyRhdXRoJywgJyRzdGF0ZScsICdSZXN0YW5ndWxhcicsICdSZXN0U2VydmljZScsIFdvcmtPcmRlckNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
