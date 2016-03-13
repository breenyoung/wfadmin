<?php

namespace App\Console;

use App\WorkOrderSchedulerService;
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
            $workOrderSchedulerService = new WorkOrderSchedulerService();
            $workOrderSchedulerService->sendWorkOrderReport();

        })->daily()->timezone('America/Halifax');
    }
}
