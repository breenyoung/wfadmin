<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\SalesChannel;

class SalesChannelController extends Controller
{
    /**
     * SalesChannelController constructor.
     */
    public function __construct()
    {
        // Apply the jwt.auth middleware to all methods in this controller
        $this->middleware('jwt.auth');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $salesChannels = SalesChannel::orderBy('name', 'asc')->get();
        return $salesChannels;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $sales_channel = new SalesChannel();
        $sales_channel->name = $request->input('name');

        $sales_channel->save();

        return response()->json(['newId' => $sales_channel->id]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $sales_channel = SalesChannel::find($id);

        return $sales_channel;
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
        $sales_channel = SalesChannel::find($id);
        if(isset($sales_channel))
        {
            $sales_channel->name = $request->input('name');
            $sales_channel->save();
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
        $sales_channel = SalesChannel::find($id);
        if(isset($sales_channel))
        {
            $sales_channel->delete();
        }
    }
}
