<?php

namespace App\Http\Controllers;

use App\ProductMaterial;
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
        $products = Product::orderBy('name', 'asc')->get();
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
        //$product->name = $request->input('active');
        $product->minimum_stock = $request->input('minimum_stock');
        $product->current_stock = $request->input('current_stock');
        $product->is_custom = ($request->input('is_custom') ? 1 : 0);

        $product->save();

        // Add product materials now
        if($request->input('product_materials') && is_array($request->input('product_materials')))
        {
            foreach($request->input('product_materials') as $pm)
            {
                $product->productMaterials()->create(['product_id' => $product->id,
                    'material_id' => $pm['material_id'],
                    'quantity' => $pm['quantity']
                ]);
            }
        }

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
        $product = Product::where('id', $id)->with('productMaterials.material')->first();

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
            //$product->name = $request->input('active');
            $product->minimum_stock = $request->input('minimum_stock');
            $product->current_stock = $request->input('current_stock');
            $product->is_custom = ($request->input('is_custom') ? 1 : 0);


            // Sync event product materials
            ProductMaterial::where('product_id', $product->id)->delete();
            if($request->input('product_materials') && is_array($request->input('product_materials')))
            {
                foreach($request->input('product_materials') as $pm)
                {
                    $product->productMaterials()->create(['product_id' => $product->id,
                        'material_id' => $pm['material_id'],
                        'quantity' => $pm['quantity']
                    ]);
                }
            }

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
