<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\EtsyService;

class EtsyController extends Controller
{
    
    protected $etsyService;

    /**
     * EtsyController constructor.
     */
    public function __construct(EtsyService $etsyService)
    {
        $this->etsyService = $etsyService;
    }
    
    public function index()
    {
        $url = $this->etsyService->getRequestToken();

        return view('auth.etsylogin')->with(['etsyloginurl' => $url]);
        
    }
    
    public function callback()
    {
        $accessToken = $this->etsyService->getTokenCredentials();


        //dd($accessToken);

        // Send a request now that we have access token
        $result = $this->etsyService->request();

        echo 'result: <pre>' . print_r($accessToken, true) . '</pre>';
        echo '<hr/>';
        echo 'result: <pre>' . print_r($result, true) . '</pre>';
    }

    public function test()
    {

        dd($this->etsyService->getTransactions(config('app.etsy_shop_id'), 25));

        $result = $this->etsyService->request();

        if($result->count > 0)
        {
            //dd($result);
            //echo $result->results[0]->user_id;
            $shopResult = $this->etsyService->getUserShops($result->results[0]->user_id);

            dd($shopResult);
        }

        //
    }
    
}
