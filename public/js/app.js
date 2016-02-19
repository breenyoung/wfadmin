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
            .primaryPalette('teal')
            .accentPalette('cyan')
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
                'main@': {
                    url: '/products/:productId',
                    templateUrl: getView('products.details'),
                    controller: 'ProductC'
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

    function ProductController($auth, $state, Restangular, RestService)
    {
        var self = this;

        RestService.getAllProducts(self);
    }

    angular.module('app.controllers').controller('ProductController', ['$auth', '$state', 'Restangular', 'RestService', ProductController]);

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHAuanMiLCJhcHAvcm91dGVzLmpzIiwiYXBwL3NlcnZpY2VzL2RpYWxvZy5qcyIsImFwcC9zZXJ2aWNlcy9yZXN0LmpzIiwiYXBwL3NlcnZpY2VzL3RvYXN0LmpzIiwiYXBwL2NvbnRyb2xsZXJzL2Zvb3Rlci9mb290ZXIuanMiLCJhcHAvY29udHJvbGxlcnMvaGVhZGVyL2hlYWRlci5qcyIsImFwcC9jb250cm9sbGVycy9sYW5kaW5nL2xhbmRpbmcuanMiLCJhcHAvY29udHJvbGxlcnMvbG9naW4vbG9naW4uanMiLCJhcHAvY29udHJvbGxlcnMvcHJvZHVjdHMvcHJvZHVjdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsSUFBQSxNQUFBLFFBQUEsT0FBQTtRQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBOzs7SUFHQSxRQUFBLE9BQUEsZ0JBQUEsQ0FBQSxhQUFBLGNBQUE7O0lBRUEsUUFBQSxPQUFBLGNBQUEsQ0FBQSxhQUFBO0lBQ0EsUUFBQSxPQUFBLG1CQUFBLENBQUEsYUFBQSxjQUFBLGVBQUEsb0JBQUE7SUFDQSxRQUFBLE9BQUEsZUFBQTs7SUFFQSxRQUFBLE9BQUEsa0JBQUE7SUFDQSxRQUFBLE9BQUEsY0FBQTs7O0lBR0EsUUFBQSxPQUFBLGNBQUEseUJBQUEsVUFBQTtJQUNBOzs7UUFHQSxjQUFBLFdBQUE7OztJQUdBLFFBQUEsT0FBQSxjQUFBLDJCQUFBLFVBQUE7SUFDQTtRQUNBO2FBQ0EsYUFBQTthQUNBLFVBQUE7OztJQUdBLFFBQUEsT0FBQSxjQUFBLGdDQUFBLFNBQUEscUJBQUE7UUFDQTthQUNBLFdBQUE7YUFDQSxrQkFBQSxFQUFBLFFBQUE7OztJQUdBLFFBQUEsT0FBQSxjQUFBLCtCQUFBLFNBQUEsb0JBQUE7O1FBRUEsbUJBQUEsTUFBQTthQUNBLGVBQUE7YUFDQSxjQUFBO2FBQ0EsWUFBQTs7OztBQ2hEQSxDQUFBO0FBQ0E7SUFDQTtJQUNBLFFBQUEs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RUEsS0FBQSxlQUFBO1FBQ0E7WUFDQSxJQUFBLGNBQUEsRUFBQSxPQUFBLEtBQUEsT0FBQSxVQUFBLEtBQUE7Ozs7O1lBS0EsTUFBQSxNQUFBLGFBQUEsS0FBQSxVQUFBO1lBQ0E7O2dCQUVBLE9BQUEsR0FBQTtlQUNBLE1BQUEsU0FBQTtZQUNBO2dCQUNBLE1BQUE7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnQkEsUUFBQSxPQUFBLG1CQUFBLFdBQUEsbUJBQUEsQ0FBQSxTQUFBLFVBQUE7Ozs7QUN0Q0EsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsU0FBQSxrQkFBQSxPQUFBLFFBQUEsYUFBQTtJQUNBO1FBQ0EsSUFBQSxPQUFBOztRQUVBLFlBQUEsZUFBQTs7O0lBR0EsUUFBQSxPQUFBLG1CQUFBLFdBQUEscUJBQUEsQ0FBQSxTQUFBLFVBQUEsZUFBQSxlQUFBOzs7QUFHQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJyxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgICdhcHAuY29udHJvbGxlcnMnLFxyXG4gICAgICAgICAgICAnYXBwLmZpbHRlcnMnLFxyXG4gICAgICAgICAgICAnYXBwLnNlcnZpY2VzJyxcclxuICAgICAgICAgICAgJ2FwcC5kaXJlY3RpdmVzJyxcclxuICAgICAgICAgICAgJ2FwcC5yb3V0ZXMnLFxyXG4gICAgICAgICAgICAnYXBwLmNvbmZpZydcclxuICAgICAgICBdKTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJywgWyd1aS5yb3V0ZXInLCAnc2F0ZWxsaXplcicsICdyZXN0YW5ndWxhciddKTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycsIFsndWkucm91dGVyJywgJ3NhdGVsbGl6ZXInXSk7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJywgWyd1aS5yb3V0ZXInLCAnbmdNYXRlcmlhbCcsICdyZXN0YW5ndWxhcicsICdhbmd1bGFyLW1vbWVudGpzJywgJ2FwcC5zZXJ2aWNlcyddKTtcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsdGVycycsIFtdKTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnLCBbXSk7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycsIFtdKTtcclxuXHJcbiAgICAvLyBDb25maWd1cmF0aW9uXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyhmdW5jdGlvbiAoJGF1dGhQcm92aWRlcilcclxuICAgIHtcclxuICAgICAgICAvLyBTYXRlbGxpemVyIGNvbmZpZ3VyYXRpb24gdGhhdCBzcGVjaWZpZXMgd2hpY2ggQVBJXHJcbiAgICAgICAgLy8gcm91dGUgdGhlIEpXVCBzaG91bGQgYmUgcmV0cmlldmVkIGZyb21cclxuICAgICAgICAkYXV0aFByb3ZpZGVyLmxvZ2luVXJsID0gJy9hcGkvYXV0aGVudGljYXRlJztcclxuICAgIH0pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJykuY29uZmlnKGZ1bmN0aW9uICgkbW9tZW50UHJvdmlkZXIpXHJcbiAgICB7XHJcbiAgICAgICAgJG1vbWVudFByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5hc3luY0xvYWRpbmcoZmFsc2UpXHJcbiAgICAgICAgICAgIC5zY3JpcHRVcmwoJy8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL21vbWVudC5qcy8yLjUuMS9tb21lbnQubWluLmpzJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyggZnVuY3Rpb24oUmVzdGFuZ3VsYXJQcm92aWRlcikge1xyXG4gICAgICAgIFJlc3Rhbmd1bGFyUHJvdmlkZXJcclxuICAgICAgICAgICAgLnNldEJhc2VVcmwoJy9hcGkvJylcclxuICAgICAgICAgICAgLnNldERlZmF1bHRIZWFkZXJzKHsgYWNjZXB0OiBcImFwcGxpY2F0aW9uL3gubGFyYXZlbC52MStqc29uXCIgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycpLmNvbmZpZyggZnVuY3Rpb24oJG1kVGhlbWluZ1Byb3ZpZGVyKSB7XHJcbiAgICAgICAgLyogRm9yIG1vcmUgaW5mbywgdmlzaXQgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyanMub3JnLyMvVGhlbWluZy8wMV9pbnRyb2R1Y3Rpb24gKi9cclxuICAgICAgICAkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2RlZmF1bHQnKVxyXG4gICAgICAgICAgICAucHJpbWFyeVBhbGV0dGUoJ3RlYWwnKVxyXG4gICAgICAgICAgICAuYWNjZW50UGFsZXR0ZSgnY3lhbicpXHJcbiAgICAgICAgICAgIC53YXJuUGFsZXR0ZSgncmVkJyk7XHJcbiAgICB9KTtcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uKClcclxue1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnJvdXRlcycpLmNvbmZpZyggZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGF1dGhQcm92aWRlciApIHtcclxuXHJcbiAgICAgICAgdmFyIGdldFZpZXcgPSBmdW5jdGlvbiggdmlld05hbWUgKXtcclxuICAgICAgICAgICAgcmV0dXJuICcvdmlld3MvYXBwLycgKyB2aWV3TmFtZSArICcuaHRtbCc7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2xvZ2luJyk7XHJcblxyXG5cclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcCcsIHtcclxuICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2hlYWRlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSGVhZGVyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxIZWFkZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBmb290ZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2Zvb3RlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRm9vdGVyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxGb290ZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBtYWluOiB7fVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5sb2dpbicsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9sb2dpbicsXHJcbiAgICAgICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ2xvZ2luJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsTG9naW4nXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5sYW5kaW5nJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2xhbmRpbmcnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdsYW5kaW5nJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMYW5kaW5nQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmxMYW5kaW5nJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucHJvZHVjdHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcHJvZHVjdHMnLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWFpbkAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBnZXRWaWV3KCdwcm9kdWN0cycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsUHJvZHVjdCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnByb2R1Y3RzLmRldGFpbCcsIHtcclxuICAgICAgICAgICAgICAgICdtYWluQCc6IHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvcHJvZHVjdHMvOnByb2R1Y3RJZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGdldFZpZXcoJ3Byb2R1Y3RzLmRldGFpbHMnKSxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdEMnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIDtcclxuXHJcbiAgICB9ICk7XHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgQnJlZW4gb24gMTUvMDIvMjAxNi5cclxuICovXHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0RpYWxvZ1NlcnZpY2UnLCBmdW5jdGlvbiggJG1kRGlhbG9nICl7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGZyb21UZW1wbGF0ZTogZnVuY3Rpb24oIHRlbXBsYXRlLCAkc2NvcGUgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvZGlhbG9ncy8nICsgdGVtcGxhdGUgKyAnLycgKyB0ZW1wbGF0ZSArICcuaHRtbCdcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCAkc2NvcGUgKXtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnNjb3BlID0gJHNjb3BlLiRuZXcoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJG1kRGlhbG9nLnNob3cob3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBoaWRlOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRtZERpYWxvZy5oaWRlKCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhbGVydDogZnVuY3Rpb24odGl0bGUsIGNvbnRlbnQpe1xyXG4gICAgICAgICAgICAgICAgJG1kRGlhbG9nLnNob3coXHJcbiAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmFsZXJ0KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRpdGxlKHRpdGxlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY29udGVudChjb250ZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAub2soJ09rJylcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgQnJlZW4gb24gMTUvMDIvMjAxNi5cclxuICovXHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ1Jlc3RTZXJ2aWNlJywgWyckYXV0aCcsICdSZXN0YW5ndWxhcicsIGZ1bmN0aW9uKCRhdXRoLCBSZXN0YW5ndWxhcil7XHJcblxyXG4gICAgICAgIHZhciBiYXNlUHJvZHVjdHMgPSBSZXN0YW5ndWxhci5hbGwoJ3Byb2R1Y3QnKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgICAgIGdldEFsbFByb2R1Y3RzOiBmdW5jdGlvbihzY29wZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYmFzZVByb2R1Y3RzLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5wcm9kdWN0cyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgQnJlZW4gb24gMTUvMDIvMjAxNi5cclxuICovXHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ1RvYXN0U2VydmljZScsIGZ1bmN0aW9uKCAkbWRUb2FzdCApe1xyXG5cclxuICAgICAgICB2YXIgZGVsYXkgPSA2MDAwLFxyXG4gICAgICAgICAgICBwb3NpdGlvbiA9ICd0b3AgcmlnaHQnLFxyXG4gICAgICAgICAgICBhY3Rpb24gPSAnT0snO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzaG93OiBmdW5jdGlvbihjb250ZW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJG1kVG9hc3Quc2hvdyhcclxuICAgICAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaW1wbGUoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY29udGVudChjb250ZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucG9zaXRpb24ocG9zaXRpb24pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hY3Rpb24oYWN0aW9uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuaGlkZURlbGF5KGRlbGF5KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIEZvb3RlckNvbnRyb2xsZXIoJG1vbWVudClcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5jdXJyZW50WWVhciA9ICRtb21lbnQoKS5mb3JtYXQoJ1lZWVknKTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignRm9vdGVyQ29udHJvbGxlcicsIFsnJG1vbWVudCcsIEZvb3RlckNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gSGVhZGVyQ29udHJvbGxlcigkYXV0aClcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYuaXNBdXRoZW50aWNhdGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdIZWFkZXJDb250cm9sbGVyJywgWyckYXV0aCcsIEhlYWRlckNvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBMYW5kaW5nQ29udHJvbGxlcigkc3RhdGUpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMYW5kaW5nQ29udHJvbGxlcicsIFsnJHN0YXRlJywgTGFuZGluZ0NvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBMb2dpbkNvbnRyb2xsZXIoJGF1dGgsICRzdGF0ZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYudGl0bGUgPSAnTG9naW4nO1xyXG5cclxuICAgICAgICBzZWxmLnJlcXVlc3RUb2tlbiA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBjcmVkZW50aWFscyA9IHsgZW1haWw6IHNlbGYuZW1haWwsIHBhc3N3b3JkOiBzZWxmLnBhc3N3b3JkIH07XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGNyZWRlbnRpYWxzKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFVzZSBTYXRlbGxpemVyJ3MgJGF1dGggc2VydmljZSB0byBsb2dpbiBiZWNhdXNlIGl0J2xsIGF1dG9tYXRpY2FsbHkgc2F2ZSB0aGUgSldUIGluIGxvY2FsU3RvcmFnZVxyXG4gICAgICAgICAgICAkYXV0aC5sb2dpbihjcmVkZW50aWFscykudGhlbihmdW5jdGlvbiAoZGF0YSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgbG9naW4gaXMgc3VjY2Vzc2Z1bCwgcmVkaXJlY3QgdG8gdGhlIHVzZXJzIHN0YXRlXHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5sYW5kaW5nJyk7XHJcbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCdFcnJvciBsb2dnaW5nIGluJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIFRoaXMgcmVxdWVzdCB3aWxsIGhpdCB0aGUgZ2V0RGF0YSBtZXRob2QgaW4gdGhlIEF1dGhlbnRpY2F0ZUNvbnRyb2xsZXJcclxuICAgICAgICAvLyBvbiB0aGUgTGFyYXZlbCBzaWRlIGFuZCB3aWxsIHJldHVybiB5b3VyIGRhdGEgdGhhdCByZXF1aXJlIGF1dGhlbnRpY2F0aW9uXHJcbiAgICAgICAgLypcclxuICAgICAgICAgJHNjb3BlLmdldERhdGEgPSBmdW5jdGlvbigpXHJcbiAgICAgICAgIHtcclxuICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdhdXRoZW50aWNhdGUvZGF0YScpLmdldCgpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXtcclxuXHJcbiAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcil7fSk7XHJcbiAgICAgICAgIH07XHJcbiAgICAgICAgICovXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0xvZ2luQ29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgTG9naW5Db250cm9sbGVyXSk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIFByb2R1Y3RDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsIFJlc3Rhbmd1bGFyLCBSZXN0U2VydmljZSlcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIFJlc3RTZXJ2aWNlLmdldEFsbFByb2R1Y3RzKHNlbGYpO1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdQcm9kdWN0Q29udHJvbGxlcicsIFsnJGF1dGgnLCAnJHN0YXRlJywgJ1Jlc3Rhbmd1bGFyJywgJ1Jlc3RTZXJ2aWNlJywgUHJvZHVjdENvbnRyb2xsZXJdKTtcclxuXHJcbn0pKCk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
