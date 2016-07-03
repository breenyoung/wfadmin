<?php

namespace App\Http\Controllers;

use App\ReportService;
use App\WorkOrderTask;
use Illuminate\Http\Request;

use App\Http\Requests;

class PrintController extends Controller
{

    protected $reportService;

    /**
     * PrintController constructor.
     */
    public function __construct(ReportService $rs)
    {
        $this->reportService = $rs;
    }

    public function index(Request $request)
    {
        $returnVals = array();

        $requestedReport = $request['view'];

        $returnVals['view'] = $requestedReport;
        $returnVals['args'] = array();

        switch($requestedReport)
        {
            case 'weekworkorders':
                $returnVals['workordertasks'] = WorkOrderTask::select(['id', 'name'])->where('active', 1)->orderBy('order', 'asc')->get();
                $returnVals['args']['detailsview'] = intval($request['details']);
                $returnVals['results'] = $this->reportService->getWeekWorkOrderReport();
                break;
        }

        //dd($returnVals);

        return view('print')->with($returnVals);
    }
}
