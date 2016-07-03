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

}