/**
 * Created by byoung on 3/14/2016.
 */
(function(){
    "use strict";

    angular.module("app.services").factory('ValidationService', [function() {

        return {

            decimalRegex: function()
            {
                return '/^\\d*\\.?\\d*$/';
            }
        };

    }]);

})();