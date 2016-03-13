<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\WorkOrder;
use App\Product;
use App\PurchaseOrder;

class ReportController extends Controller
{
    public function currentStock()
    {
        $productStock = Product::select('id', 'name', 'current_stock');
    }

    public function getSalesReport(Request $request)
    {
        \DB::enableQueryLog();

        $reportParams = $request->input('reportParams');

        $query = PurchaseOrder::select('purchase_orders.id', 'purchase_orders.customer_id', 'purchase_orders.total', 'purchase_orders.created_at', 'purchase_orders.customer_id', 'customers.first_name', 'customers.last_name');
        $query->join('purchase_order_products', 'purchase_orders.id', '=', 'purchase_order_products.purchase_order_id');
        $query->join('customers', 'purchase_orders.customer_id', '=', 'customers.id');

        if(isset($reportParams['customer_id']) && $reportParams['customer_id'] !== '')
        {
            $query->where('purchase_orders.customer_id', $reportParams['customer_id']);
        }

        if(isset($reportParams['start_date']) && $reportParams['start_date'] !== '')
        {
            $sDate = new Carbon($reportParams['start_date']);
            $query->whereDate('purchase_orders.created_at', '>=', $sDate->toDateString());
        }

        if(isset($reportParams['end_date']) && $reportParams['end_date'] !== '')
        {
            $eDate = new Carbon($reportParams['end_date']);
            $query->whereDate('purchase_orders.created_at', '<=', $eDate->toDateString());
        }

        if(isset($reportParams['product_id']) && $reportParams['product_id'] !== '')
        {
            $query->where('purchase_order_products.product_id', $reportParams['product_id']);
        }

        $query->groupBy('purchase_orders.id');

        return response()->json($query->get());

    }
}
