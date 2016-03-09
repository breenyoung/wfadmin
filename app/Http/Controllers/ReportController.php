<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Product;

class ReportController extends Controller
{
    public function currentStock()
    {
        $productStock = Product::select('id', 'name', 'current_stock');
    }
}
