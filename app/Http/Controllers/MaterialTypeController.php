<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\MaterialType;

class MaterialTypeController extends Controller
{
    /**
     * MaterialTypeController constructor.
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
        $materialTypes = MaterialType::orderBy('name', 'asc')->get();
        return $materialTypes;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $materialType = new MaterialType();
        $materialType->name = $request->input('name');

        $materialType->save();

        return response()->json(['newId' => $materialType->id]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $materialType = MaterialType::find($id);

        return $materialType;
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
        $materialType = MaterialType::find($id);
        if(isset($materialType))
        {
            $materialType->name = $request->input('name');
            $materialType->save();
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
        $materialType = MaterialType::find($id);
        if(isset($materialType))
        {
            $materialType->delete();
        }
    }
}
