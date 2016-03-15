(function(){
    "use strict";

    function MaterialDetailController($auth, $state, ToastService, Restangular, RestService, DialogService, ValidationService, $stateParams)
    {
        var self = this;

        RestService.getAllUnits(self);
        RestService.getMaterialAllTypes(self);

        //console.log($stateParams);
        RestService.getMaterial(self, $stateParams.materialId);

        self.decimalRegex = ValidationService.decimalRegex();

        self.updateMaterial = function()
        {
            self.form1.$setSubmitted();

            var isValid = self.form1.$valid;

            if(isValid)
            {
                self.material.put().then(function()
                {
                    ToastService.show("Successfully updated");
                    $state.go("app.materials");

                }, function()
                {
                    ToastService.show("Error updating");
                    console.log("error updating");
                });
            }
        };

        self.deleteMaterial = function()
        {
            self.material.remove().then(function()
            {
                ToastService.show("Successfully deleted");
                $state.go("app.materials");
            }, function()
            {
                ToastService.show("Error Deleting");
            });
        };

        self.showDeleteConfirm = function(ev)
        {
            var dialog = DialogService.confirm(ev, 'Delete material?', 'This will also remove the material from any products using it');
            dialog.then(function()
                {
                    self.deleteMaterial();
                },
                function()
                {
                });
        };

    }

    angular.module('app.controllers').controller('MaterialDetailController', ['$auth', '$state', 'ToastService', 'Restangular', 'RestService', 'DialogService', 'ValidationService', '$stateParams', MaterialDetailController]);

})();
