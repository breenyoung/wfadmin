(function(){
    "use strict";

    angular.module('app.controllers').controller('FooterController', ['$moment', function($moment)
    {
        var self = this;
        self.currentYear = $moment().format('YYYY');
    }]);

})();
