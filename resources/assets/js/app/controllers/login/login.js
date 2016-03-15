(function(){
    "use strict";

    function LoginController($state, $scope, DialogService, AuthService)
    {
        var self = this;
        self.email = '';
        self.password = '';

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

    }

    angular.module('app.controllers').controller('LoginController', ['$state', '$scope', 'DialogService', 'AuthService', LoginController]);

})();
