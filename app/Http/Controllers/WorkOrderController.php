<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\WorkOrder;
use Carbon\Carbon;

use \Illuminate\Support\Facades\DB;


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
        $workOrders = WorkOrder::with('product', 'customer')->orderBy('start_date', 'asc')->orderBy('end_date', 'asc')->get();

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

        if($request->input('start_date'))
        {
            $strStartDate = substr($request->input('start_date'), 0, strpos($request->input('start_date'), 'T'));
            $startDate = Carbon::createFromFormat('Y-m-d', $strStartDate);
            $workOrder->start_date = $startDate;
        }

        if($request->input('end_date'))
        {
            $strEndDate = substr($request->input('end_date'), 0, strpos($request->input('end_date'), 'T'));
            $endDate = Carbon::createFromFormat('Y-m-d', $strEndDate);
            $workOrder->end_date = $endDate;
        }

        $workOrder->completed = $request->input('completed') ? 1 : 0;
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
            $workOrder->customer_id = $request->input('customer_id');
            $workOrder->product_id = $request->input('product_id');

            if($request->input('start_date'))
            {
                $strStartDate = substr($request->input('start_date'), 0, strpos($request->input('start_date'), 'T'));
                $startDate = Carbon::createFromFormat('Y-m-d', $strStartDate);
                $workOrder->start_date = $startDate;
            }

            if($request->input('end_date'))
            {
                $strEndDate = substr($request->input('end_date'), 0, strpos($request->input('end_date'), 'T'));
                $endDate = Carbon::createFromFormat('Y-m-d', $strEndDate);
                $workOrder->end_date = $endDate;
            }

            //$workOrder->completed = $request->input('completed') ? 1 : 0;
            $workOrder->completed = (int)$request->input('completed');
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
