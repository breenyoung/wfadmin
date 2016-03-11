<?php

namespace App\Http\Controllers;

use App\PurchaseOrder;
use App\PurchaseOrderProduct;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\WorkOrderSchedulerService;

class SchedulerController extends Controller
{

    protected $workOrderSchedulerService;

    /**
     * SchedulerController constructor.
     */
    public function __construct()
    {
        $this->workOrderSchedulerService = new WorkOrderSchedulerService();
    }

    public function determineWorkOrders(Request $request)
    {
        if($request->input('productsToFulfill') && is_array($request->input('productsToFulfill')))
        {
            try
            {
                \DB::beginTransaction();

                // Determine work orders (if any for these PO products
                $workOrdersToCreate = $this->workOrderSchedulerService->determineWorkOrdersForPo($request->input('productsToFulfill'));

                if($request->input('purchaseOrderId'))
                {
                    // This is on the detail page, instead of just previewing
                    // the PO products and the workorders actually create them now.
                    $po = PurchaseOrder::where('id', $request->input('purchaseOrderId'))->first();

                    foreach($request->input('productsToFulfill') as $p)
                    {
                        PurchaseOrderProduct::create(['purchase_order_id' => $po->id,
                            'product_id' =>  $p['product_id'],
                            'quantity' => $p['quantity']
                        ]);

                        // Deduct the quantity ordered from the current stock for the product
                        $this->workOrderSchedulerService->deductStockFromProducts([$p]);

                    }


                    if($workOrdersToCreate['workOrdersToCreate'] > 0)
                    {
                        if(isset($po))
                        {
                            // Create any work orders for the PO product
                            $this->workOrderSchedulerService->generateWorkOrdersForPo($po, $workOrdersToCreate['workOrders']);
                        }
                    }

                }

                \DB::commit();

                return response()->json($workOrdersToCreate);
            }
            catch(\Exception $ex)
            {
                \DB::rollBack();
                throw $ex;
            }
        }
    }

    public function restoreStockForProduct(Request $request)
    {
        $purchaseOrderId = $request->input('purchase_order_id');
        $productId =  $request->input('product_id');

        try
        {
            \DB::beginTransaction();

            // First restore the stock levels for the product deleted from the PO
            $this->workOrderSchedulerService->restoreStockForProducts($purchaseOrderId, $productId);

            // Now delete any workorders for this product generated by the PO
            $this->workOrderSchedulerService->deleteWorkOrdersForPo($purchaseOrderId, $productId);

            // Finally delete the actual purchaseOrderProduct row
            $this->workOrderSchedulerService->deletePurchaseOrderProduct($purchaseOrderId, $productId);

            \DB::commit();

        }
        catch(\Exception $ex)
        {
            \DB::rollBack();
            throw $ex;

        }
    }

    public function getFullyBookedDays()
    {
        return $this->workOrderSchedulerService->getFullyBookedDays();
    }

}
