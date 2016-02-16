(function()
{
    "use strict";
    angular.module('app.routes').config( function($stateProvider, $urlRouterProvider, $authProvider ) {

        console.log($authProvider);
        var getView = function( viewName ){
            return '/views/app/' + viewName + '/' + viewName + '.html';
        };

        $urlRouterProvider.otherwise('/login');


        $stateProvider
            .state('app', {
                abstract: true,
                views: {
                    header: {
                        templateUrl: getView('header'),
                        controller: 'HeaderController',
                        controllerAs: 'ctrl'
                    },
                    footer: {
                        templateUrl: getView('footer'),
                        controller: 'FooterController',
                        controllerAs: 'ctrl'
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
                        controllerAs: 'ctrl'
                    }
                }
            })
            .state('app.landing', {
                url: '/landing',
                views: {
                    'main@': {
                        templateUrl: getView('landing')
                    }
                }
            })
            .state('app.products', {
                url: '/products',
                views: {
                    'main@': {
                        templateUrl: getView('products'),
                        controller: 'ProductController',
                        controllerAs: 'ctrl'
                    }
                }

            })
            ;

    } );
})();