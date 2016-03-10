(function(){
    "use strict";

    function PurchaseOrderCreateController($auth, $state, $scope, Restangular, ToastService, RestService, DialogService, $stateParams)
    {
        var self = this;

        RestService.getAllCustomers(self);
        RestService.getAllProducts(self);
        RestService.getAllPaymentTypes(self);

        self.purchaseorder = {};
        self.purchaseorder.amount_paid = 0;
        self.purchaseorder.total = 0;


        self.createPurchaseOrder = function()
        {
            console.log(self.purchaseorder);

            var p = self.purchaseorder;

            //console.log($error);

            Restangular.all('purchaseorder').post(p).then(function(d)
            {
                //console.log(d);
                //$state.go('app.products.detail', {'productId': d.newId});
                ToastService.show("Successfully created");
                $state.go('app.purchaseorders');
            }, function()
            {
                ToastService.show("Error creating");
            });
        };

        self.addProduct = function()
        {
            console.log(self.selectedProduct);

            if(self.purchaseorder.purchase_order_products === undefined) { self.purchaseorder.purchase_order_products = []; }

            self.purchaseorder.purchase_order_products.push({
                product_id: self.selectedProduct.id,
                quantity: self.selectedQuantity,
                product: self.selectedProduct
            });

            if(self.purchaseorder.total === undefined || self.purchaseorder.total === null) { self.purchaseorder.total = 0; }
            var currentCost = parseFloat(self.purchaseorder.total);
            var btest = (parseFloat(self.selectedProduct.price) * parseInt(self.selectedQuantity));
            currentCost += btest;
            self.purchaseorder.total = currentCost;

            self.selectedProduct = "";
            self.selectedQuantity = 0;

            console.log(self.purchaseorder);
        };

        self.deleteProduct = function(e, productId)
        {
            var indexToRemove;
            for(var i = 0; i < self.purchaseorder.purchase_order_products.length; i++)
            {
                if(productId == self.purchaseorder.purchase_order_products[i].product_id)
                {
                    indexToRemove = i;
                    break;
                }
            }

            console.log(indexToRemove);

            var currentCost = parseFloat(self.purchaseorder.total);
            var btest = (parseFloat(self.purchaseorder.purchase_order_products[indexToRemove].product.price) * parseInt(self.purchaseorder.purchase_order_products[indexToRemove].quantity));
            currentCost -= btest;
            self.purchaseorder.total = currentCost;

            self.purchaseorder.purchase_order_products.splice(indexToRemove, 1);

            e.preventDefault();
        };

        self.determineWorkOrders = function(e)
        {
            if(self.purchaseorder.purchase_order_products !== undefined)
            {
                var productsToFulfill = [];
                for(var i = 0; i < self.purchaseorder.purchase_order_products.length; i++)
                {
                    productsToFulfill.push({
                        product_id: self.purchaseorder.purchase_order_products[i].product_id,
                        quantity: self.purchaseorder.purchase_order_products[i].quantity
                    });
                }

                Restangular.all('scheduler/getWorkOrders').post({productsToFulfill: productsToFulfill}).then(function(data)
                {
                    console.log(data.workOrdersToCreate);
                    if(data.workOrdersToCreate > 0)
                    {
                        // There are workorders needed for this PO, confirm their creation
                        $scope.workOrdersToCreate = data.workOrdersToCreate;
                        $scope.workOrders = data.workOrders;

                        DialogService.fromTemplate(e, 'dlgConfirmWorkOrders', $scope).then(
                            function()
                            {
                                self.purchaseorder.work_orders = $scope.workOrders;
                                //console.log('confirmed');
                                self.createPurchaseOrder();
                            },
                            function()
                            {
                                //console.log('cancelled');
                            }
                        );
                    }
                    else
                    {
                        // Just process the PO as normal
                        self.createPurchaseOrder();
                    }
                });
            }
        };

    }

    angular.module('app.controllers').controller('PurchaseOrderCreateController', ['$auth', '$state', '$scope', 'Restangular', 'ToastService', 'RestService', 'DialogService', '$stateParams', PurchaseOrderCreateController]);

})();
