<?php

namespace App\Http\Controllers;

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
            $workOrdersToCreate = $this->workOrderSchedulerService->determineWorkOrdersForPo($request->input('productsToFulfill'));

            return response()->json($workOrdersToCreate);
        }
    }

    public function restoreStockForProduct(Request $request)
    {
        $purchaseOrderId = $request->input('purchase_order_id');
        $productId =  $request->input('product_id');

        $this->workOrderSchedulerService->restoreStockForProducts($purchaseOrderId, $productId);

    }
}
