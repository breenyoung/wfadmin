<?php
/**
 * Created by PhpStorm.
 * User: Breen
 * Date: 19/03/2016
 * Time: 10:20 AM
 */

namespace App;

use \RocketCode\Shopify\ShopifyServiceProvider;


class ShopifyService
{

    protected $api;

    /**
     * ShopifyService constructor.
     */
    public function __construct()
    {
        $this->api = \App::make('ShopifyAPI');
        $this->api->setup([ 'API_KEY' => config('app.shopify_api_key'),
                            'API_SECRET' => config('app.shopify_api_secret'),
                            'SHOP_DOMAIN' => config('app.shopify_shop_domain'),
                            'ACCESS_TOKEN' => config('app.shopify_access_token')
                        ]);

        $this->api->installURL(['permissions' => array('read_orders', 'read_products')]);
    }

    public function getProducts()
    {
        try
        {
            $call = $this->api->call(['URL' => 'products.json', 'METHOD' => 'GET', 'DATA' => ['published_status' => 'any']]);
        }
        catch(\Exception $ex)
        {
            $call = $ex->getMessage();
        }

        echo '<pre>';
        var_dump($call);
        echo '</pre>';
    }
}