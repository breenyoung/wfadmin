<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\WorkOrder;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Mail;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //$this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('home');
    }

    public function testMethod()
    {
        $pickupDateReminder = config('app.pickup_reminder_days_to_remind');
        $today = Carbon::today('America/Halifax');
        $twoDaysFromNow = Carbon::today('America/Halifax')->addDay($pickupDateReminder);


        $startWorkOrders = WorkOrder::whereDate('start_date', '=', $today)->get();
        $startCount = $startWorkOrders->count();

        $endWorkOrders = WorkOrder::whereDate('end_date', '=', $twoDaysFromNow)->with('product', 'customer')->get();
        $endCount = $endWorkOrders->count();
        $endDueDate = $twoDaysFromNow->toFormattedDateString();

        $viewData = [
            'todaysDate' => $today->toFormattedDateString(),
            'startCount' => $startCount,
            'endCount' => $endCount,
            'startWorkOrders' => $startWorkOrders,
            'endWorkOrders' => $endWorkOrders,
            'endDueDate' => $endDueDate,
            'pickupDateReminder' => $pickupDateReminder
        ];

        $to = config('app.pickup_reminder_email_to');
        $from = config('app.pickup_reminder_email_from');
        $subject = config('app.pickup_reminder_email_subject');
        $view = config('app.pickup_reminder_email_view');



        Mail::send($view, ['viewdata' => $viewData], function($message) use($viewData, $to, $from, $subject)
        {
            $message->from($from);
            $message->to($to);
            $message->subject($subject);
        });

        /*
        return view(config('app.pickup_reminder_email_view'))->with(['todaysDate' => $today->toFormattedDateString(),
                                            'startCount' => $startCount,
                                            'endCount' => $endCount,
                                            'startWorkOrders' => $startWorkOrders,
                                            'endWorkOrders' => $endWorkOrders,
                                            'endDueDate' => $endDueDate,
                                            'pickupDateReminder' => $pickupDateReminder

        ]);
        */

        echo 'Done';
    }
}
