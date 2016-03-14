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

                console.log(credentials);

                // Use Satellizer's $auth service to login because it'll automatically save the JWT in localStorage
                $auth.login(credentials).then(function (data)
                {
                    // If login is successful, redirect to the users state
                    //$state.go('app.landing');
                    console.log('successful login');

                    return 1;
                }).catch(function(data)
                {
                    console.log('Error logging in');
                    return 0;
                });
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