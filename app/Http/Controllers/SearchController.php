<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use \DB;

class SearchController extends Controller
{
    public function index($query)
    {
        $searchType = '';

        if(strrpos($query, 'pr:', -strlen($query)) !== false)
        {
            $searchType = 'product';
            $query = substr($query, 3);
        }
        else if(strrpos($query, 'cu:', -strlen($query)) !== false)
        {
            $searchType = 'customer';
            $query = substr($query, 3);

        }
        else if(strrpos($query, 'ma:', -strlen($query)) !== false)
        {
            $searchType = 'material';
            $query = substr($query, 3);
        }
        else if(strrpos($query, 'ev:', -strlen($query)) !== false)
        {
            $searchType = 'event';
            $query = substr($query, 3);
        }
        else if(strrpos($query, 'wo:', -strlen($query)) !== false)
        {
            $searchType = 'workorder';
            $query = substr($query, 3);
        }
        else if(strrpos($query, 'po:', -strlen($query)) !== false)
        {
            $searchType = 'purchaseorder';
            $query = substr($query, 3);
        }

        $productSearch = DB::table('products')
            ->select('id', 'name', DB::raw('\'product\' as content_type'))
            ->where('name', 'like', '%' . $query . '%');

        $customerSearch = DB::table('customers')
            ->select('id', DB::raw('concat(first_name, \' \',last_name) as name'), DB::raw('\'customer\' as content_type'))
            ->where('first_name', 'like', '%' . $query . '%')
            ->orWhere('last_name', 'like', '%' . $query . '%');

        $materialSearch = DB::table('materials')
            ->select('id', 'name', DB::raw('\'material\' as content_type'))
            ->where('name', 'like', '%' . $query . '%');

        $workOrderCustomerSearch = DB::table('work_orders')
            ->select('work_orders.id', DB::raw('concat(\'Work Order \', work_orders.id, \' for \',customers.first_name, \' \', customers.last_name) as name'), DB::raw('\'workorder\' as content_type'))
            ->join('customers', 'work_orders.customer_id', '=', 'customers.id')
            ->where('work_orders.completed', 0)
            ->where(function ($subQuery) use(&$query)
            {
                $subQuery->where('customers.first_name', 'like', '%' . $query . '%')
                    ->orWhere('customers.last_name', 'like', '%' . $query . '%');
            })
        ;

        $workOrderProductSearch = DB::table('work_orders')
            ->select('work_orders.id', DB::raw('concat(\'Work Order \', work_orders.id, \' using \',products.name) as name'), DB::raw('\'workorder\' as content_type'))
            ->join('products', 'work_orders.product_id', '=', 'products.id')
            ->where('work_orders.completed', 0)
            ->where('products.name', 'like', '%' . $query . '%')
        ;

        $purchaseOrderProductSearch = DB::table('purchase_order_products')
            ->select('purchase_order_products.purchase_order_id', DB::raw('concat(\'Purchase Order \', purchase_order_products.purchase_order_id, \' using \',products.name) as name'), DB::raw('\'purchaseorder\' as content_type'))
            ->join('products', 'purchase_order_products.product_id', '=', 'products.id')
            //->where('purchase_orders.completed', 0)
            ->where('products.name', 'like', '%' . $query . '%')
        ;

        $purchaseOrderCustomerSearch = DB::table('purchase_orders')
            ->select('purchase_orders.id', DB::raw('concat(\'Purchase Order \', purchase_orders.id, \' for \',customers.first_name, \' \', customers.last_name) as name'), DB::raw('\'purchaseorder\' as content_type'))
            ->join('customers', 'purchase_orders.customer_id', '=', 'customers.id')
            //->where('purchase_orders.completed', 0)
            ->where(function ($subQuery) use(&$query)
            {
                $subQuery->where('customers.first_name', 'like', '%' . $query . '%')
                    ->orWhere('customers.last_name', 'like', '%' . $query . '%');
            })
        ;

        $eventSearch = DB::table('events')
            ->select('id', 'name', DB::raw('\'event\' as content_type'))
            ->where('name', 'like', '%' . $query . '%');


        $searchResults = null;
        if($searchType === 'product')
        {
            $searchResults = $productSearch->get();
        }
        else if($searchType === 'customer')
        {
            $searchResults = $customerSearch->get();
        }
        else if($searchType === 'material')
        {
            $searchResults = $materialSearch->get();
        }
        else if($searchType === 'workorder')
        {
            $searchResults = $workOrderCustomerSearch->union($workOrderProductSearch)->get();
        }
        else if($searchType === 'purchaseorder')
        {
            $searchResults = $purchaseOrderProductSearch->union($purchaseOrderCustomerSearch)->get();
        }
        else if($searchType === 'event')
        {
            $searchResults = $eventSearch->get();
        }
        else
        {
            $searchResults = $eventSearch
                ->union($productSearch)
                ->union($customerSearch)
                ->union($materialSearch)
                ->union($workOrderCustomerSearch)
                ->union($workOrderProductSearch)
                ->union($purchaseOrderProductSearch)
                ->union($purchaseOrderCustomerSearch)
                ->get();
        }




        //dd(DB::getQueryLog());
        //dd($productSearch);

        return response()->json($searchResults);

    }
}
