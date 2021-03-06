<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \Illuminate\Support\Facades\DB;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Event;
use App\EventProduct;

class EventController extends Controller
{
    /**
     * EventController constructor.
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
        $events = Event::all();
        return $events;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $event = new Event();
        $event->name = $request->input('name');
        $event->start_date = $request->input('start_date');
        $event->end_date = $request->input('end_date');
        $event->notes = $request->input('notes');

        $event->save();

        return response()->json(['newId' => $event->id]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $event = Event::where('id', '=', $id)->with('eventProducts.product')->first();

        return $event;
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
        $event = Event::find($id);
        if(isset($event))
        {
            $event->name = $request->input('name');
            $event->start_date = $request->input('start_date');
            $event->end_date = $request->input('end_date');
            $event->notes = $request->input('notes');

            // Sync event products
            EventProduct::where('event_id', $event->id)->delete();
            //$pIds = [];
            if($request->input('event_products') && is_array($request->input('event_products')))
            {
                foreach($request->input('event_products') as $ep)
                {
                    //array_push($pIds, $ep['product_id']);
                    $event->eventProducts()->create(['event_id' => $event->id,
                        'product_id' => $ep['product_id'],
                        'quantity' => $ep['quantity']
                    ]);
                }
            }

            $event->save();
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
        $event = Event::find($id);
        if(isset($event))
        {
            $event->delete();
        }
    }
}
