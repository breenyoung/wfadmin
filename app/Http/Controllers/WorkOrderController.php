<?php

namespace App\Http\Controllers;

use App\WorkOrderProgress;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\WorkOrder;
use App\WorkOrderTask;
use Carbon\Carbon;
use App\UploadHandler;

use \Illuminate\Support\Facades\DB;


class WorkOrderController extends Controller
{

    protected $uploadHandler;

    /**
     * WorkOrderController constructor.
     */
    public function __construct(UploadHandler $uploadHandler)
    {
        // Apply the jwt.auth middleware to all methods in this controller
        $this->middleware('jwt.auth');
        $this->uploadHandler = $uploadHandler;
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Retrieve all the work orders in the database and return them
        $workOrders = WorkOrder::with('product', 'customer', 'purchaseOrder.salesChannel')->orderBy('end_date', 'asc')->get();

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

        try
        {
            \DB::beginTransaction();

            $workOrder = new WorkOrder();
            $workOrder->customer_id = $request->input('customer_id');
            $workOrder->product_id = $request->input('product_id');
            $workOrder->quantity = $request->input('quantity');

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
            $workOrder->image_filename = $request->input('image_filename');

            $workOrder->save();

            // Give each new WorkOrder the 'Created' progress task
            WorkOrderProgress::create(['work_order_id' => $workOrder->id, 'work_order_task_id' => 1]);

            \DB::commit();
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
        $workOrder = WorkOrder::where('id', $id)->with('workOrderProgress')->first();

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
            try
            {
                \DB::beginTransaction();

                $workOrder->customer_id = $request->input('customer_id');
                $workOrder->product_id = $request->input('product_id');
                $workOrder->quantity = $request->input('quantity');

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
                $workOrder->image_filename = $request->input('image_filename');

                $workOrder->save();

                // Sync WorkOrderProgress
                WorkOrderProgress::where('work_order_id', $id)->delete();
                if($request->input('work_order_progress') && is_array($request->input('work_order_progress')))
                {
                    foreach($request->input('work_order_progress') as $wop)
                    {
                        $workOrder->workOrderProgress()->create([
                            'work_order_id' => $id,
                            'work_order_task_id' => $wop['work_order_task_id']
                        ]);
                    }
                }

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
        $workOrder = WorkOrder::find($id);
        if(isset($workOrder))
        {
            // Delete image (if any)
            $this->uploadHandler->removeFile(public_path(config('app.upload_path')), $workOrder->image_filename);

            $workOrder->delete();


        }
    }



}
