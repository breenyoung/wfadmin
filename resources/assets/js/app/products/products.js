(function(){
    "use strict";

    angular.module('app.controllers').controller('ProductController', ['$auth', '$state', 'Restangular', function($auth, $state, Restangular)
    {
        var self = this;

        var baseProducts = Restangular.all('product');

        baseProducts.getList().then(function(data)
        {
            self.products = data;
        });


    }]);

})();
