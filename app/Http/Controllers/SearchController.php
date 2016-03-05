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

        $eventSearch = DB::table('events')
            ->select('id', 'name', DB::raw('\'event\' as content_type'))
            ->where('name', 'like', '%' . $query . '%')
            ->union($productSearch)
            ->union($customerSearch)
            ->union($materialSearch)
            ->get();

        //dd(DB::getQueryLog());
        //dd($productSearch);

        return response()->json($eventSearch);

    }
}