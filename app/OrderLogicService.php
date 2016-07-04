<?php
/**
 * Created by PhpStorm.
 * User: Breen
 * Date: 6/24/2016
 * Time: 3:04 PM
 */

namespace App;

use App\PurchaseOrder;
use App\WorkOrder;
use App\WorkOrderProgress;
use App\WorkOrderTask;


class OrderLogicService
{

    /**
     * OrderLogicService constructor.
     */
    public function __construct()
    {

    }

    public function finalizePurchaseOrder($poId)
    {
        $returnData = [];

        try
        {
            \DB::beginTransaction();

            // Mark completed field for all work orders for this PO
            WorkOrder::where('purchase_order_id', $poId)->update(['completed' => 1]);

            // Get all work orders for this PO
            $workOrderIds = WorkOrder::where('purchase_order_id', $poId)->select(['id'])->get();

            // Get all WorkOrderTask statuses
            $workOrderTaskIds = WorkOrderTask::select(['id'])->where('active', 1)->get();

            foreach($workOrderIds as $woId)
            {
                // Delete all existing progress rows first
                WorkOrderProgress::where('work_order_id', $woId)->delete();
            }

            /*
            foreach($workOrderIds as $woId)
            {
                // Create full set of statuses for this work order
                foreach($workOrderTaskIds as $woTaskId)
                {
                    WorkOrderProgress::create([
                        'work_order_id' => $woId,
                        'work_order_task_id' => $woTaskId
                    ]);
                }
            }
            */

            // Future PO finalization stuff goes here.

            \DB::commit();

            //return $returnData;
        }
        catch(\Exception $ex)
        {
            \DB::rollBack();
            throw $ex;
        }
    }

}