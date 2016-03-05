(function(){
    "use strict";

    function CoreController($scope, $auth, $moment, $mdSidenav, $mdMedia)
    {
        var self = this;

        var today = new Date();

        $scope.todaysDate = today;

        $scope.toggleSidenav = function(menuId)
        {
            $mdSidenav(menuId).toggle();
        };

    }

    angular.module('app.controllers').controller('CoreController', ['$scope', '$auth', '$moment', '$mdSidenav', '$mdMedia', CoreController]);

})();
