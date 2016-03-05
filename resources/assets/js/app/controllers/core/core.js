(function(){
    "use strict";

    function CoreController($scope, $auth, $moment, $mdSidenav)
    {
        var self = this;

        $scope.todaysDate = $moment().format('dddd, MMMM Do YYYY');

        $scope.toggleSidenav = function(menuId)
        {
            $mdSidenav(menuId).toggle();
        };

    }

    angular.module('app.controllers').controller('CoreController', ['$scope', '$auth', '$moment', '$mdSidenav', CoreController]);

})();
