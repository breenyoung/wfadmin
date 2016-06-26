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


        // Mark completed field for all work orders for this PO
        // This field will be going away at some point
        // TODO: remove this when we remove 'completed' field from work_orders table
        WorkOrder::where('purchase_order_id', $poId)->update(['completed' => 1]);

        // Get all work orders for this PO
        $workOrderIds = WorkOrder::where('purchase_order_id', $poId)->select(['id'])->get();

        // Get all WorkOrderTask statuses
        $workOrderTaskIds = WorkOrderTask::select(['id'])->get();

        foreach($workOrderIds as $woId)
        {
            // Delete all existing progress rows first
            WorkOrderProgress::where('work_order_id', $woId)->delete();

            // Create full set of statuses for this work order
            foreach($workOrderTaskIds as $woTaskId)
            {
                WorkOrderProgress::create([
                    'work_order_id' => $woId,
                    'work_order_task_id' => $woTaskId
                ]);
            }
        }

        // Future PO finalization stuff goes here.


        return $returnData;
    }

}