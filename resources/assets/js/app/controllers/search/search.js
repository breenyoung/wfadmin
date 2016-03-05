(function(){
    "use strict";

    function SearchController($scope, $auth, Restangular, RestService)
    {
        var self = this;

        self.noCache = true;
        self.searchText = "";

        self.doSearch = function(query)
        {
            //RestService.doSearch(self, self.searchText);
            return Restangular.one('search', query).getList().then(function(data)
            {
                console.log(data);
                return data;
            });

        };
    }

    angular.module('app.controllers').controller('SearchController', ['$scope', '$auth', 'Restangular', 'RestService', SearchController]);

})();
