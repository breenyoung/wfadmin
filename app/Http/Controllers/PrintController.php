<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class PrintController extends Controller
{

    /**
     * PrintController constructor.
     */
    public function __construct()
    {

    }

    public function index(Request $request)
    {
        $returnVals = array();

        $returnVals['view'] = $request['view'];
        return view('print')->with($returnVals);
    }
}
