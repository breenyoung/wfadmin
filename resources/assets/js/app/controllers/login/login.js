(function(){
    "use strict";

    function LoginController($auth, $state, DialogService)
    {
        var self = this;

        self.title = 'Login';


        DialogService.fromTemplate(null, 'dlgLogin').then(
            function () {

                //console.log('confirmed');
                self.createPurchaseOrder();
            },
            function () {
                //console.log('cancelled');
            }
        );



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

    angular.module('app.controllers').controller('LoginController', ['$auth', '$state', 'DialogService', LoginController]);

})();
