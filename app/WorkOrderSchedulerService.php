<?php
/**
 * Created by PhpStorm.
 * User: byoung
 * Date: 3/7/2016
 * Time: 3:56 PM
 */

namespace App;

use \DB;
use Carbon\Carbon;

use App\PurchaseOrder;
use App\WorkOrder;
use App\Product;
use App\Material;

class WorkOrderSchedulerService
{
    protected $today;
    protected $workOrdersDonePerWeek;
    protected $workOrdersOverflowPerWeek;

    /**
     * WorkOrderSchedulerService constructor.
     */
    public function __construct()
    {
        $this->today = Carbon::today('America/Halifax');
        $this->workOrdersDonePerWeek = config('scheduling_work_orders_done_per_week');
        $this->workOrdersOverflowPerWeek = config('scheduling_work_orders_done_per_week_overflow');
    }

    public function getWorkOrdersForThisWeek()
    {
        $this->getWorkOrdersForWeek($this->today);
    }

    public function getWorkOrdersForWeek($date)
    {
        // Convert to Carbon date if this is just a vanilla PHP DateTime class
        if($date instanceof DateTime)
        {
            $date = Carbon::instance($date);
        }

        $startOfTheWeek = $date->startOfTheWeek();
        $endOfTheWeek = $date->endOfTheWeek();

        $workOrdersThisWeek = WorkOrder::whereDate('start_date', '>=', $startOfTheWeek)->whereDate('start_date', '<=', $endOfTheWeek)->get();

        $workOrderCount = $workOrdersThisWeek->count();

    }

    public function getProductStock($productIds)
    {
        return Product::whereIn('id', $productIds)->select('id', 'current_stock')->get();
    }


}