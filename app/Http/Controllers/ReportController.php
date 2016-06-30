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


    /**
     * ReportController constructor.
     */
    public function __construct()
    {
        // Apply the jwt.auth middleware to all methods in this controller
        $this->middleware('jwt.auth');
    }

    public function currentStock()
    {
        $productStock = Product::select('id', 'name', 'current_stock');
    }

    public function getSalesReport(Request $request)
    {
        //\DB::enableQueryLog();

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
        $dataPoints = DB::table('products')
            ->join('purchase_order_products', 'products.id', '=', 'purchase_order_products.product_id', 'left outer')
            ->select('products.id as product_id', 'products.name', DB::Raw('count(purchase_order_products.product_id) as pcount'))
            ->where('products.is_custom', 0)
            ->groupBy('products.id')
            ->orderBy('pcount', 'asc')
            ->take(5)
            ->get();

        return $dataPoints;
    }

    public function getOverduePurchaseOrders()
    {
        $results = DB::table('purchase_orders')
                ->join('customers', 'purchase_orders.customer_id', '=', 'customers.id')
                ->join('work_orders', 'purchase_orders.id', '=', 'work_orders.purchase_order_id')
                ->select('purchase_orders.id', 'purchase_orders.pickup_date', 'purchase_orders.total', 'purchase_orders.amount_paid', 'purchase_orders.customer_id', 'customers.first_name', 'customers.last_name', DB::raw('count(work_orders.id) AS wocount'), DB::raw('sum(work_orders.completed) AS wocomplete'))
                ->where('purchase_orders.paid', 0)
                ->whereRaw('DATE(purchase_orders.pickup_date) <= CURDATE()')
                ->groupBy('purchase_orders.id')
                ->orderBy('purchase_orders.pickup_date')
                ->get();

        return response()->json($results);
    }

    public function getProductProfitPercents()
    {
        $results = DB::table('products')
                    ->select('id', 'name', 'price', 'cost')
                    ->get();

        return $results;
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


        return response()->json($results);
    }

    public function getOutstandingPayments()
    {
        $dataPoints = DB::select('select date_format(purchase_orders.pickup_date, \'%Y\') as year, date_format(purchase_orders.pickup_date, \'%m\') as month, sum(purchase_orders.total - purchase_orders.amount_paid) as outstanding from purchase_orders where purchase_orders.paid = 0 group by date_format(pickup_date, \'%Y-%m\') order by purchase_orders.pickup_date');

        return response()->json($dataPoints);

    }

    public function getMaterialChecklist(Request $request)
    {
        $checklist = [];

        $reportParams = $request->input('reportParams');

        $mode = $reportParams['mode'];

        if($mode === 'thisweek' || $mode === 'date')
        {
            if($mode === 'thisweek')
            {
                $startOfWeek = Carbon::today('America/Halifax')->startOfWeek();
                $endOfWeek = Carbon::today('America/Halifax')->endOfWeek();
            }
            else
            {
                $startOfWeek = $reportParams['start_date'];
                $endOfWeek = $reportParams['end_date'];
            }

            $workOrders = WorkOrder::select('product_materials.material_id', 'materials.name', DB::raw('sum(product_materials.quantity * work_orders.quantity) as material_quantity'), 'units.name as unit_name')
                ->join('product_materials', 'work_orders.product_id', '=', 'product_materials.product_id')
                ->join('materials', 'product_materials.material_id', '=', 'materials.id')
                ->join('units', 'materials.unit_id', '=', 'units.id')
                ->whereDate('work_orders.start_date', '>=', $startOfWeek)
                ->whereDate('work_orders.start_date', '<=', $endOfWeek)
                ->where('work_orders.completed', 0)
                ->groupBy('product_materials.material_id')
                ->orderBy('materials.name', 'asc')
                ->get();

        }
        else if($mode === 'products')
        {

        }

        return response()->json($workOrders );
    }

    public function getDailySales(Request $request)
    {
        $query = PurchaseOrder::select(DB::raw('date_format(created_at, \'%m/%d/%Y\') as podate'), DB::raw('count(id) as pocount'), DB::raw('sum(total) as daytotal'));

        $reportParams = $request->input('reportParams');
        if(isset($reportParams['daily_sales_from_date']) && $reportParams['daily_sales_from_date'] !== '')
        {
            $sDate = new Carbon($reportParams['daily_sales_from_date']);
            $query->whereDate('purchase_orders.created_at', '>=', $sDate->toDateString());
        }

        if(isset($reportParams['daily_sales_to_date']) && $reportParams['daily_sales_to_date'] !== '')
        {
            $eDate = new Carbon($reportParams['daily_sales_to_date']);
            $query->whereDate('purchase_orders.created_at', '<=', $eDate->toDateString());
        }

        $query->groupBy(DB::raw('date_format(purchase_orders.created_at, \'%d\')'));
        $query->orderBy('purchase_orders.created_at', 'asc');

        $dataPoints = $query->get();

        //select date_format(created_at, '%d') as day, count(id) as salescount, sum(total) as total from purchase_orders group by date_format(created_at, '%d')
        //$dataPoints = DB::select('SELECT date_format(created_at, \'%m/%d/%Y\') as podate, count(id) as pocount, sum(total) as daytotal from purchase_orders group by date_format(created_at, \'%d\') order by created_at');

        return response()->json($dataPoints);

    }

    public function getSalesChannelReport(Request $request)
    {
        $query = PurchaseOrder::select(DB::raw('sales_channels.name'), DB::raw('count(purchase_orders.id) as pocount'), DB::raw('sum(purchase_orders.total) as pototal'));

        $reportParams = $request->input('reportParams');
        if(isset($reportParams['sales_channel_from_date']) && $reportParams['sales_channel_from_date'] !== '')
        {
            $sDate = new Carbon($reportParams['sales_channel_from_date']);
            $query->whereDate('purchase_orders.created_at', '>=', $sDate->toDateString());
        }

        if(isset($reportParams['sales_channel_to_date']) && $reportParams['sales_channel_to_date'] !== '')
        {
            $eDate = new Carbon($reportParams['sales_channel_to_date']);
            $query->whereDate('purchase_orders.created_at', '<=', $eDate->toDateString());
        }

        $query->join('sales_channels', 'purchase_orders.sales_channel_id', '=', 'sales_channels.id');
        $query->groupBy(DB::raw('purchase_orders.sales_channel_id'));
        $query->orderBy('sales_channels.name', 'asc');

        $dataPoints = $query->get();

        return response()->json($dataPoints);

    }

}
