<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\WorkOrder;

class WorkOrderController extends Controller
{
    /**
     * WorkOrderController constructor.
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
        // Retrieve all the work orders in the database and return them
        $workOrders = WorkOrder::all();
        return $workOrders;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $workOrder = new WorkOrder();
        $workOrder->customer_id = $request->input('customer_id');
        $workOrder->product_id = $request->input('product_id');
        $workOrder->start_date = $request->input('start_date');
        $workOrder->end_date = $request->input('end_date');
        $workOrder->completed = $request->input('completed');
        $workOrder->notes = $request->input('notes');

        $workOrder->save();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $workOrder = WorkOrder::find($id);

        return $workOrder;
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
        $workOrder = WorkOrder::find($id);
        if(isset($workOrder))
        {
            $workOrder = new WorkOrder();
            $workOrder->customer_id = $request->input('customer_id');
            $workOrder->product_id = $request->input('product_id');
            $workOrder->start_date = $request->input('start_date');
            $workOrder->end_date = $request->input('end_date');
            $workOrder->completed = $request->input('completed');
            $workOrder->notes = $request->input('notes');

            $workOrder->save();
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
        $workOrder = WorkOrder::find($id);
        if(isset($workOrder))
        {
            $workOrder->delete();
        }
    }
}
