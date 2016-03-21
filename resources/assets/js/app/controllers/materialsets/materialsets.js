(function(){
    "use strict";

    function MaterialSetController($auth, $state, RestService)
    {
        var self = this;
        self.selectedMaterial = '';
        self.selectedQuantity = 0;
        self.existingSets = [];
        initSetObject();

        RestService.getAllMaterials(self);

        self.createSet = function()
        {
            console.log(self.set);
        };

        self.deleteMaterial = function(e, materialId)
        {
            var indexToRemove;
            for(var i = 0; i < self.set.product_materials.length; i++)
            {
                if(materialId == self.set.product_materials[i].material_id)
                {
                    indexToRemove = i;
                    break;
                }
            }

            self.set.product_materials.splice(indexToRemove, 1);

            e.preventDefault();
        };

        self.addMaterial = function()
        {
            console.log(self.selectedMaterial);

            self.set.product_materials.push({
                material_id: self.selectedMaterial.id,
                quantity: self.selectedQuantity,
                material: self.selectedMaterial
            });

            self.selectedMaterial = '';
            self.selectedQuantity = 0;
        };

        function initSetObject()
        {
            self.set = {};
            self.set.name = '';
            self.set.product_materials = [];
        }

    }

    angular.module('app.controllers').controller('MaterialSetController', ['$auth', '$state', 'RestService', MaterialSetController]);

})();
