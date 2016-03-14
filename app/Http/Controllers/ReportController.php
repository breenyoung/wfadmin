<?php

namespace App\Http\Controllers;

use App\PurchaseOrderProduct;
use DB;
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

    public function getSalesByMonth()
    {
        //SELECT date_format(created_at, '%Y-%m') as month, sum(total) as monthtotal from purchase_orders group by date_format(created_at, '%Y-%m')

        $dataPoints = DB::select('SELECT date_format(created_at, \'%Y\') as year, date_format(created_at, \'%m\') as month, count(id) as pocount, sum(total) as monthtotal from purchase_orders group by date_format(created_at, \'%Y-%m\')');


        return response()->json($dataPoints);

    }

    public function getTopSellingProducts()
    {
        $dataPoints = DB::table('purchase_order_products')
                    ->join('products', 'purchase_order_products.product_id', '=', 'products.id')
                    ->select('purchase_order_products.product_id', 'products.name', DB::Raw('count(purchase_order_products.product_id) as pcount'))
                    ->groupBy('purchase_order_products.product_id')
                    ->orderBy('pcount', 'desc')
                    ->take(10)
                    ->get();

        //DB::select('select pop.product_id, p.name, count(pop.product_id) as pcount')

        return $dataPoints;
    }

    public function getWorstSellingProducts()
    {
        $dataPoints = DB::table('purchase_order_products')
            ->join('products', 'purchase_order_products.product_id', '=', 'products.id')
            ->select('purchase_order_products.product_id', 'products.name', DB::Raw('count(purchase_order_products.product_id) as pcount'))
            ->where('products.is_custom', 0)
            ->groupBy('purchase_order_products.product_id')
            ->orderBy('pcount', 'asc')
            ->take(5)
            ->get();

        return $dataPoints;
    }
}
