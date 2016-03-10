/**
 * Created by Breen on 15/02/2016.
 */

(function(){
    "use strict";

    angular.module("app.services").factory('DialogService', function( $mdDialog ){

        return {
            fromTemplate: function(ev, template, scope ) {
                var options = {
                    templateUrl: '/views/dialogs/' + template + '.html',
                    targetEvent: ev,
                    controller: function DialogController($scope, $mdDialog)
                    {
                        $scope.confirmDialog = function () {
                            $mdDialog.hide();
                        };

                        $scope.cancelDialog = function()
                        {
                            $mdDialog.cancel();
                        };
                    }
                };

                if ( scope )
                {
                    //console.log(scope);
                    options.scope = scope.$new();
                    //options.preserveScope = true;
                }

                return $mdDialog.show(options);
            },

            hide: function(){
                return $mdDialog.hide();
            },

            alert: function(title, content){
                $mdDialog.show(
                    $mdDialog.alert()
                        .title(title)
                        .content(content)
                        .ok('Ok')
                );
            },

            confirm: function(event, title, content)
            {
                var confirm = $mdDialog.confirm()
                    .title(title)
                    .textContent(content)
                    .ariaLabel('')
                    .targetEvent(event)
                    .ok('Yes')
                    .cancel('No');

                return $mdDialog.show(confirm);

            }
        };
    });
})();