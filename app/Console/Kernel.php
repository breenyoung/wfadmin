<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

use App\WorkOrder;
use DB;
use Mail;
use Carbon\Carbon;
use Log;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        // Commands\Inspire::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('inspire')
        //          ->hourly();

        $schedule->call(function()
        {

            Log::info('=============================================');
            Log::info('Starting work order reminder service');

            // Setup the dates
            $pickupDateReminder = config('app.pickup_reminder_days_to_remind');
            $today = Carbon::today('America/Halifax');
            $twoDaysFromNow = Carbon::today('America/Halifax')->addDay($pickupDateReminder);

            Log::info('The date is: ' . $today->toFormattedDateString() . ' (America/Halifax)');

            // Get work orders to start today
            $startWorkOrders = WorkOrder::whereDate('start_date', '=', $today)->get();
            $startCount = $startWorkOrders->count();

            Log::info('Start Work Orders found: '.$startCount);

            // Get work orders due for pick up in [$pickupDateReminder] days
            $endWorkOrders = WorkOrder::whereDate('end_date', '<=', $twoDaysFromNow)->with('product', 'customer')->get();
            $endCount = $endWorkOrders->count();
            $endDueDate = $twoDaysFromNow->toFormattedDateString();

            Log::info('Sending end reminders for work orders due in [' . $pickupDateReminder . '] day(s) - [' . $endDueDate . ']');
            Log::info('End Work Orders found: '.$endCount);

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
            $subject = config('app.pickup_reminder_email_subject') . $today->toFormattedDateString();
            $view = config('app.pickup_reminder_email_view');

            Log::info('Sending work order reminder email to: ' . $to);

            Mail::send($view, ['viewdata' => $viewData], function($message) use($viewData, $to, $from, $subject)
            {
                $message->from($from);
                $message->to($to);
                $message->subject($subject);
            });


            Log::info('Ending work order reminder service');
            Log::info('=============================================');

        })->daily()->timezone('America/Halifax');
    }
}
