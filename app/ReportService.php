<?php
/**
 * Created by PhpStorm.
 * User: Breen
 * Date: 7/3/2016
 * Time: 9:17 AM
 */

namespace App;

use DB;
use Carbon\Carbon;

use App\WorkOrder;
use App\Product;
use App\PurchaseOrder;
use App\PurchaseOrderProduct;
use App\WorkOrderProgress;


class ReportService
{
    /**
     * ReportService constructor.
     */
    public function __construct()
    {

    }

    public function getWeekWorkOrderReport()
    {
        $startOfWeek = Carbon::today('America/Halifax')->startOfWeek();
        $endOfWeek = Carbon::today('America/Halifax')->endOfWeek();

        /*
        $results = WorkOrder::whereDate('start_date', '>=', $startOfWeek)
                                ->whereDate('start_date', '<=', $endOfWeek)
                                ->where('completed', 0)
                                ->with(['product', 'customer', 'purchaseOrder'])
                                ->orderBy('start_date', 'asc')
                                ->get();
        */

        $results = WorkOrder::whereDate('start_date', '<=', $endOfWeek)
            ->where('completed', 0)
            ->with(['product', 'customer', 'purchaseOrder', 'workOrderProgress'])
            ->orderBy('end_date', 'asc')
            ->get();


        return $results;
    }

    public function getPendingApprovalWorkOrders()
    {
        $results = DB::table('work_orders')
            ->select('work_orders.id', 'work_orders.end_date', 'work_orders.customer_id', 'customers.first_name', 'customers.last_name', 'work_orders.product_id', 'products.name')
            ->leftJoin('work_order_progress', 'work_orders.id', '=', 'work_order_progress.work_order_id')
            ->join('products', 'work_orders.product_id', '=', 'products.id')
            ->join('customers', 'work_orders.customer_id', '=', 'customers.id')
            ->where('work_orders.completed', 0)
            ->where('products.is_custom', 1)
            ->whereNull('work_order_progress.work_order_task_id')
            ->orderBy('work_orders.end_date', 'asc')
            ->get();


        return $results;
    }


}