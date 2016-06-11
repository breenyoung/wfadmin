<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\PurchaseOrder;
use App\PurchaseOrderProduct;
use App\WorkOrder;
use App\Product;
use App\WorkOrderSchedulerService;


class PurchaseOrderController extends Controller
{
    protected $daysLeadTimeFromPickup;

    /**
     * PurchaseOrderController constructor.
     */
    public function __construct()
    {
        // Apply the jwt.auth middleware to all methods in this controller
        $this->middleware('jwt.auth');

        $this->daysLeadTimeFromPickup = config('app.scheduler_days_lead_time_from_pickup_date');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Retrieve all the purchase orders in the database and return them
        $purchaseOrders = PurchaseOrder::with('customer')->orderBy('created_at', 'desc')->get();
        return $purchaseOrders;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $workOrderScheduleService = new WorkOrderSchedulerService();

        try
        {
            \DB::beginTransaction();

            // First create the PO object
            $purchaseOrder = new PurchaseOrder();
            $purchaseOrder->customer_id = $request->input('customer_id');
            $purchaseOrder->fulfilled = ($request->input('fulfilled') ? 1 : 0);
            $purchaseOrder->paid = ($request->input('paid') ? 1 : 0);
            $purchaseOrder->delivery = $request->input('delivery');
            $purchaseOrder->shipping = $request->input('shipping');
            $purchaseOrder->payment_type_id = $request->input('payment_type_id');
            $purchaseOrder->amount_paid = $request->input('amount_paid');
            $purchaseOrder->discount = $request->input('discount');
            $purchaseOrder->total = $request->input('total');
            $purchaseOrder->pickup_date = $request->input('pickup_date');
            $purchaseOrder->notes = $request->input('notes');
            $purchaseOrder->sales_channel_id = $request->input('sales_channel_id');

            // TEMP StuFF TODO: REMOVE LATER
            if ($request->input('created_at')) {
                $strStartDate = substr($request->input('created_at'), 0, strpos($request->input('created_at'), 'T'));
                $startDate = \Carbon\Carbon::createFromFormat('Y-m-d', $strStartDate);
                $purchaseOrder->created_at = $startDate;
            }
            //////////////////////////////

            $purchaseOrder->save();

            // Now add purchase order products for PO
            if ($request->input('purchase_order_products')
                && is_array($request->input('purchase_order_products')))
            {
                foreach ($request->input('purchase_order_products') as $pop) {
                    $purchaseOrder->purchaseOrderProducts()->create([
                        'purchase_order_id' => $purchaseOrder->id,
                        'product_id' => $pop['product_id'],
                        'quantity' => $pop['quantity']
                    ]);
                }
            }

            $newWoIds = [];
            if($request->input('suppressworkorder') != "1")
            {
                // If there are work orders needed for this PO, add them now
                $newWoIds = $workOrderScheduleService->generateWorkOrdersForPo($purchaseOrder, $request->input('work_orders'), $request->input('start_date'));

                // Lastly, deduct the quantity ordered from the current stock for the product
                $workOrderScheduleService->deductStockFromProducts($request->input('purchase_order_products'));
            }

            \DB::commit();

            return response()->json(['newId' => $purchaseOrder->id, 'newWoIds' => $newWoIds]);

        }
        catch(\Exception $ex)
        {
            \DB::rollBack();
            throw $ex;
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $purchaseOrder = PurchaseOrder::where('id', $id)->with('purchaseOrderProducts.product')->with('workorders')->first();

        return $purchaseOrder;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $purchaseOrder = PurchaseOrder::find($id);
        if(isset($purchaseOrder))
        {
            try
            {
                \DB::beginTransaction();

                $purchaseOrder->customer_id = $request->input('customer_id');
                $purchaseOrder->fulfilled = (int)$request->input('fulfilled');
                $purchaseOrder->paid = ($request->input('paid') ? 1 : 0);
                $purchaseOrder->payment_type_id = $request->input('payment_type_id');
                $purchaseOrder->amount_paid = $request->input('amount_paid');
                $purchaseOrder->discount = $request->input('discount');
                $purchaseOrder->total = $request->input('total');
                $purchaseOrder->pickup_date = $request->input('pickup_date');
                $purchaseOrder->notes = $request->input('notes');
                $purchaseOrder->sales_channel_id = $request->input('sales_channel_id');

                /*
                // Sync purchase order products now
                PurchaseOrderProduct::where('purchase_order_id', $purchaseOrder->id)->delete();
                if($request->input('purchase_order_products') && is_array($request->input('purchase_order_products')))
                {
                    foreach($request->input('purchase_order_products') as $pop)
                    {
                        $purchaseOrder->purchaseOrderProducts()->create(['purchase_order_id' => $purchaseOrder->id,
                            'product_id' => $pop['product_id'],
                            'quantity' => $pop['quantity']
                        ]);
                    }
                }
                */

                $purchaseOrder->save();


                \DB::commit();
            }
            catch(\Exception $ex)
            {
                \DB::rollBack();
                throw $ex;
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $purchaseOrder = PurchaseOrder::where('id', $id)->first();

        if(isset($purchaseOrder))
        {
            try
            {
                $workOrderScheduleService = new WorkOrderSchedulerService();


                \DB::beginTransaction();

                // Restore stock for any non workorder quantities
                $workOrderScheduleService->restoreStockForProducts($purchaseOrder->id);

                // Delete any work orders for this PO
                $workOrderScheduleService->deleteWorkOrdersForPo($purchaseOrder->id);

                // Now delete the PO itself
                $purchaseOrder->delete();

                \DB::commit();
            }
            catch(\Exception $ex)
            {
                \DB::rollBack();
                throw $ex;
            }
        }
    }
}
