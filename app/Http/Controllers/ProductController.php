<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Product;

class ProductController extends Controller
{
    /**
     * ProductController constructor.
     */
    public function __construct()
    {
        // Apply the jwt.auth middleware to all methods in this controller
        //$this->middleware('jwt.auth');
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Retrieve all the products in the database and return them
        $products = Product::all();
        return $products;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $product = new Product();
        $product->name = $request->input('name');
        $product->sku = $request->input('sku');
        $product->description = $request->input('description');
        $product->price = $request->input('price');
        $product->cost = $request->input('cost');
        $product->minimum_stock = $request->input('minimum_stock');
        $product->current_stock = $request->input('current_stock');
        //$product->name = $request->input('active');

        $product->save();

        return response()->json(['newId' => $product->id]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $product = Product::find($id);

        return $product;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        if(isset($product))
        {
            $product->name = $request->input('name');
            $product->sku = $request->input('sku');
            $product->description = $request->input('description');
            $product->price = $request->input('price');
            $product->cost = $request->input('cost');
            $product->minimum_stock = $request->input('minimum_stock');
            $product->current_stock = $request->input('current_stock');
            //$product->name = $request->input('active');

            $product->save();
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $product = Product::find($id);
        if(isset($product))
        {
            $product->delete();
        }
    }
}
