<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\PurchaseOrder;
use App\PurchaseOrderProduct;

class PurchaseOrderController extends Controller
{
    /**
     * PurchaseOrderController constructor.
     */
    public function __construct()
    {
        // Apply the jwt.auth middleware to all methods in this controller
        //$this->middleware('jwt.auth');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Retrieve all the purchase orders in the database and return them
        $purchaseOrders = PurchaseOrder::with('customer')->orderBy('pickup_date', 'asc')->get();
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
        $purchaseOrder = new PurchaseOrder();
        $purchaseOrder->customer_id = $request->input('customer_id');
        $purchaseOrder->fulfilled = ($request->input('fulfilled') ? 1 : 0);
        $purchaseOrder->paid = ($request->input('paid') ? 1 : 0);
        $purchaseOrder->payment_type_id = $request->input('payment_type_id');
        $purchaseOrder->amount_paid = $request->input('amount_paid');
        $purchaseOrder->total = $request->input('total');
        $purchaseOrder->pickup_date = $request->input('pickup_date');
        $purchaseOrder->notes = $request->input('notes');

        // TEMP StuFF TODO: REMOVE LATER
        if($request->input('created_at'))
        {
            $strStartDate = substr($request->input('created_at'), 0, strpos($request->input('created_at'), 'T'));
            $startDate = \Carbon\Carbon::createFromFormat('Y-m-d', $strStartDate);
            $purchaseOrder->created_at = $startDate;
        }
        //////////////////////////////

        $purchaseOrder->save();

        // Add purchase order products now
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

        return response()->json(['newId' => $purchaseOrder->id]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $purchaseOrder = PurchaseOrder::where('id', $id)->with('purchaseOrderProducts.product')->first();

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
            $purchaseOrder->customer_id = $request->input('customer_id');
            $purchaseOrder->fulfilled = (int)$request->input('fulfilled');
            $purchaseOrder->paid = ($request->input('paid') ? 1 : 0);
            $purchaseOrder->payment_type_id = $request->input('payment_type_id');
            $purchaseOrder->amount_paid = $request->input('amount_paid');
            $purchaseOrder->total = $request->input('total');
            $purchaseOrder->pickup_date = $request->input('pickup_date');
            $purchaseOrder->notes = $request->input('notes');


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

            $purchaseOrder->save();
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
        $purchaseOrder = PurchaseOrder::find($id);
        if(isset($purchaseOrder))
        {
            $purchaseOrder->delete();
        }
    }
}
