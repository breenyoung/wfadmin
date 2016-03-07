<?php
/**
 * Created by PhpStorm.
 * User: byoung
 * Date: 3/7/2016
 * Time: 3:56 PM
 */

namespace App;

use \DB;
use Carbon\Carbon;

use App\PurchaseOrder;
use App\WorkOrder;

class WorkOrderScheduler
{
    protected $today;

    /**
     * WorkOrderScheduler constructor.
     */
    public function __construct()
    {
        $this->today = Carbon::today('America/Halifax');
    }

    public function getWorkOrdersForThisWeek()
    {
        $this->getWorkOrdersForWeek($this->today);
    }

    public function getWorkOrdersForWeek($date)
    {
        // Convert to Carbon date if this is just a vanilla PHP DateTime class
        if($date instanceof DateTime)
        {
            $date = Carbon::instance($date);
        }

        $startOfTheWeek = $date->startOfTheWeek();
        $endOfTheWeek = $date->endOfTheWeek();
    }


}