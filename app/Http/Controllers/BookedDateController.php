<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \Carbon\Carbon;

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
    public function index(Request $request)
    {
        $sdate = Carbon::createFromFormat('Y-m-d', str_replace('"', '', $request->input('start')));
        $edate = Carbon::createFromFormat('Y-m-d', str_replace('"', '', $request->input('end')));

        $bookingDates = BookedDate::whereDate('start_date', '>=', $sdate)->whereDate('end_date', '<=', $edate)->get();

        return response()->json($bookingDates);
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

        //$bookedDate->start_date = $request->input('start_date');
        if($request->input('start_date'))
        {
            $strStartDate = substr($request->input('start_date'), 0, strpos($request->input('start_date'), 'T'));
            $startDate = Carbon::createFromFormat('Y-m-d', $strStartDate);
            $bookedDate->start_date = $startDate;
        }

        //$bookedDate->end_date = $request->input('end_date');
        if($request->input('end_date'))
        {
            $strEndDate = substr($request->input('end_date'), 0, strpos($request->input('end_date'), 'T'));
            $endDate = Carbon::createFromFormat('Y-m-d', $strEndDate);
            $bookedDate->end_date = $endDate;
        }

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
            $bookedDate->start_date = $request->input('start_date');

            if($request->input('end_date') && strpos($request->input('end_date'), 'T') !== false)
            {
                $strEndDate = substr($request->input('end_date'), 0, strpos($request->input('end_date'), 'T'));
                $endDate = Carbon::createFromFormat('Y-m-d', $strEndDate);
                $bookedDate->end_date = $endDate;
            }
            else
            {
                $bookedDate->end_date = $request->input('end_date');
            }

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
