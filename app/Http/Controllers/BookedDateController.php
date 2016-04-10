<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\BookedDate;

class BookedDateController extends Controller
{
    /**
     * BookedDateController constructor.
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
        //TODO
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $bookedDate = new BookedDate();
        $bookedDate->booked_date = $request->input('booked_date');
        $bookedDate->work_order_id = $request->input('work_order_id');
        $bookedDate->work_order_generated = $request->input('work_order_generated');
        $bookedDate->notes = $request->input('notes');

        $bookedDate->save();

        return response()->json(['newId' => $bookedDate->id]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $bookedDate = BookedDate::where('id', '=', $id)->first();

        return $bookedDate;
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
        $bookedDate = BookedDate::find($id);
        if(isset($bookedDate))
        {
            $bookedDate->booked_date = $request->input('booked_date');
            $bookedDate->work_order_id = $request->input('work_order_id');
            $bookedDate->work_order_generated = $request->input('work_order_generated');
            $bookedDate->notes = $request->input('notes');

            $bookedDate->save();
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
        $bookedDate = BookedDate::find($id);
        if(isset($bookedDate))
        {
            $bookedDate->delete();
        }
    }
}
