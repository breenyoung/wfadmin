<?php
/**
 * Created by PhpStorm.
 * User: byoung
 * Date: 3/7/2016
 * Time: 3:56 PM
 */

namespace App;

use \DB;
use \Carbon\Carbon;
use Log;
use Mail;

use App\PurchaseOrder;
use App\WorkOrder;
use App\WorkOrderTask;
use App\Product;
use App\Material;

class WorkOrderSchedulerService
{
    protected $today;
    protected $daysLeadTimeFromPickup;
    protected $maxWorkOrdersPerDay;

    /**
     * WorkOrderSchedulerService constructor.
     */
    public function __construct()
    {
        $this->today = Carbon::today('America/Halifax');
        $this->daysLeadTimeFromPickup = config('app.scheduler_days_lead_time_from_pickup_date');
        $this->maxWorkOrdersPerDay = config('app.scheduler_max_workorders_per_day');
    }

    public function determineWorkOrdersForPo($productsToFulfill)
    {
        $workOrdersToCreate = 0;
        $workOrders = [];
        $workOrderSchedule = [];

        // ===============================================================================
        // Determine first if any work orders actually have to be done for this PO
        // ===============================================================================
        foreach($productsToFulfill as $p)
        {
            $product_id = $p['product_id'];
            $quantity = $p['quantity'];

            $productStock = $this->getProductStock($product_id);

            if($productStock->current_stock < $quantity)
            {
                // We have less then the quantity the PO needs, find out exact number we're missing
                $stockDiff = $quantity - $productStock->current_stock;
                $workOrdersToCreate += $stockDiff;
                //$workOrdersToCreate += 1;

                array_push($workOrders, ['product_id' => $productStock->id, 'product_name' => $productStock->name, 'quantity_to_create' => $stockDiff]);
            }
        }

        $workOrderSchedule['workOrdersToCreate'] = $workOrdersToCreate;
        $workOrderSchedule['workOrders'] = $workOrders;

        return $workOrderSchedule;
    }

    public function deductStockFromProducts($products)
    {
        if ($products && is_array($products))
        {
            foreach ($products as $p)
            {
                $product = Product::find($p['product_id']);
                if(isset($product))
                {
                    $newStock = $product->current_stock - $p['quantity'];
                    $product->current_stock = ($newStock < 0) ? 0 : $newStock;
                    $product->save();
                }
            }
        }
    }

    public function restoreStockForProducts($purchaseOrderId, $productId = null)
    {
        // First get any open work orders for this PO
        //  We will need to deduct those quantities from the total PO quantity
        // as we're only restoring stock that was actually made at the time of the PO

        $query = PurchaseOrderProduct::where('purchase_order_id', $purchaseOrderId);
        if($productId != null) { $query->where('product_id', $productId); }

        $pops = $query->get();

        $workOrders = $this->getWorkOrdersForPo($purchaseOrderId);

        foreach($pops as $pop)
        {
            $totalQuantity = $pop->quantity;

            $wosForPop = $workOrders->where('product_id', $pop->product_id);

            $quantityToRestore = $totalQuantity;

            // Now remove any quantities from WO's for the PO since they weren't actually real inventory
            foreach($wosForPop as $wfp)
            {
                $quantityToRestore -= $wfp->quantity;
            }

            $product = Product::where('id', $pop->product_id)->first();
            if(isset($product))
            {
                $product->current_stock += $quantityToRestore;
                $product->save();
            }
        }
    }

    public function generateWorkOrdersForPo($po, $workOrders, $startDate = null)
    {
        $newWoIds = [];

        if($workOrders && is_array($workOrders))
        {
            $pickupDate = new Carbon($po->pickup_date);
            $pickupDate->timezone = 'America/Halifax';

            if($startDate != null)
            {
                $workOrderStart = new Carbon($startDate);
            }
            else
            {
                $workOrderStart = $pickupDate->copy()->subDays($this->daysLeadTimeFromPickup);
            }

            $workOrderEnd = $pickupDate;

            foreach($workOrders as $wo)
            {
                $quantityToCreate = $wo['quantity_to_create'];

                for($i = 0; $i < $quantityToCreate; $i++)
                {
                    $newWo = WorkOrder::create(['customer_id' => $po->customer_id,
                        'product_id' => $wo['product_id'],
                        'purchase_order_id' => $po->id,
                        'quantity' => 1,
                        'start_date' => $workOrderStart,
                        'end_date' => $workOrderEnd,
                        'completed' => 0,
                        'notes' => 'Generated by PO #' . $po->id
                    ]);

                    array_push($newWoIds, $newWo->id);
                }

/*
                $newWo = WorkOrder::create(['customer_id' => $po->customer_id,
                    'product_id' => $wo['product_id'],
                    'purchase_order_id' => $po->id,
                    'quantity' => $wo['quantity_to_create'],
                    'start_date' => $workOrderStart,
                    'end_date' => $workOrderEnd,
                    'completed' => 0,
                    'notes' => 'Generated by PO #' . $po->id
                ]);

                array_push($newWoIds, $newWo->id);
*/
            }
        }

        return $newWoIds;
    }

    public function getWorkOrdersForPo($purchaseOrderId, $incompleteOnly = true)
    {
        $query = WorkOrder::where('purchase_order_id', $purchaseOrderId);
        if($incompleteOnly) { $query->where('completed', 0); }

        $workOrders = $query->get();

        return $workOrders;
    }

    public function deleteWorkOrdersForPo($purchaseOrderId, $productId = null)
    {
        $query = WorkOrder::where('purchase_order_id', $purchaseOrderId);
        if($productId != null) { $query->where('product_id', $productId); }

        $query->delete();
    }

    public function deletePurchaseOrderProduct($purchaseOrderId, $productId)
    {
        PurchaseOrderProduct::where('purchase_order_id', $purchaseOrderId)->where('product_id', $productId)->delete();
    }

    public function getFullyBookedDays($includeNonWorkOrderDates = false)
    {
        $arrBookedDays = [];

        $bookedDays = \DB::table('work_orders')->select(\DB::raw('start_date, count(start_date) as wocount'))
                            ->groupBy('start_date')
                            ->having('wocount', '>=', $this->maxWorkOrdersPerDay)
                            ->orderBy('start_date', 'asc')->get();

        foreach($bookedDays as $bd)
        {
            array_push($arrBookedDays, ['start_date' => $bd->start_date, 'wocount' => $bd->wocount]);
        }

        if($includeNonWorkOrderDates)
        {
            $nonWorkOrderDates = \DB::table('booked_dates')->select('start_date', 'end_date')->orderBy('start_date', 'asc')->get();
            foreach($nonWorkOrderDates as $nwod)
            {
                $sDate = new Carbon($nwod->start_date);
                //$sDate->timezone = 'America/Halifax';
                $eDate = new Carbon($nwod->end_date);
                //$eDate->timezone = 'America/Halifax';

                if($sDate->isSameDay($eDate))
                {
                    // One day event only, just add the Start Date
                    array_push($arrBookedDays, ['start_date' => $nwod->start_date, 'wocount' => $this->maxWorkOrdersPerDay]);
                }
                else
                {
                    // This is a date range, add each day in the range
                    for($date = $sDate; $date->lt($eDate); $date->addDay())
                    {
                        array_push($arrBookedDays, ['start_date' => $date->format('Y-m-d'), 'wocount' => $this->maxWorkOrdersPerDay]);
                    }
                }
            }
        }

        //return $bookedDays->get();
        return $arrBookedDays;
    }

    public function getFutureWorkOrders()
    {
        $startOfWeek = Carbon::today('America/Halifax')->startOfWeek();

        //$results = WorkOrder::whereDate('start_date', '>=', $startOfWeek)
        $results = WorkOrder::where('completed', 0)
            ->with(['product' => function($query)
                {
                    $query->addSelect(array('id', 'name'));
                },
                'customer' => function($query)
                {
                    $query->addSelect(array('id', 'first_name', 'last_name'));
                },])
            ->select('id', 'customer_id', 'product_id', 'purchase_order_id', 'start_date', 'end_date', 'quantity')
            ->orderBy('start_date', 'asc')
            ->get();

        return response()->json($results);
    }


    public function sendWorkOrderReport()
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
        $endWorkOrders = WorkOrder::whereDate('end_date', '>=', $today)->whereDate('end_date', '<=', $twoDaysFromNow)->with('product', 'customer')->get();
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

    }

    private function getProductStock($productId)
    {
        return Product::where('id', $productId)->select('id', 'name', 'current_stock')->first();
    }

}