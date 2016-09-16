<?php
/**
 * Created by PhpStorm.
 * User: Breen
 * Date: 5/19/2016
 * Time: 11:49 PM
 */

namespace App;

use OAuth\OAuth1\Service\Etsy;
use OAuth\Common\Storage\Session;
use OAuth\Common\Consumer\Credentials;
use OAuth\Common\Http\Uri\UriFactory;

class EtsyService
{

    protected $etsyKey;
    protected $etsySecret;
    protected $etsyCallbackUrl;
    protected $storage;
    protected $credentials;
    protected $service;
    protected $token;

    /**
     * EtsyService constructor.
     */
    public function __construct()
    {
        $this->etsyKey = config('app.etsy_api_key');
        $this->etsySecret = config('app.etsy_api_secret');
        $this->etsyCallbackUrl = config('app.etsy_callback_url');

        $this->storage = new Session();

        $uriFactory = new UriFactory();
        $currentUri = $uriFactory->createFromSuperGlobalArray($_SERVER);
        $currentUri->setQuery('');

        $this->credentials = new Credentials(
            $this->etsyKey,
            $this->etsySecret,
            //$currentUri->getAbsoluteUri()
            url($this->etsyCallbackUrl)
        );

        // Instantiate the Etsy service using the credentials, http client and storage mechanism for the token
        $serviceFactory = new \OAuth\ServiceFactory();
        $this->service = $serviceFactory->createService('Etsy', $this->credentials, $this->storage);

    }

    public function getRequestToken()
    {
        $this->service->setScopes(['transactions_r']);

        $response = $this->service->requestRequestToken();

        $extra = $response->getExtraParams();
        $url = $extra['login_url'];

        return $url;
    }

    public function getTokenCredentials()
    {
        $this->token = $this->storage->retrieveAccessToken('Etsy');
        //dd($this->token);


        // This was a callback request from Etsy, get the token


        $this->service->requestAccessToken(
            $_GET['oauth_token'],
            $_GET['oauth_verifier'],
            $this->token->getRequestTokenSecret()
        );

        return $this->token;

    }

    public function getTransactions($shopId, $limit = 25, $offset = 0)
    {

        $url = sprintf('/shops/%s/transactions?limit=%s&offset=%s', $shopId, $limit, $offset);

        return $this->makeRequest($url);

    }

    public function getUserShops()
    {
        return $this->makeRequest('/users/' . config('app.etsy_user_id') . '/shops');
    }

    public function getScopes()
    {
        return $this->makeRequest('/oauth/scopes');
    }

    public function getUser()
    {
        return $this->makeRequest('/private/users/__SELF__');
    }

    public function request()
    {
        $result = json_decode($this->service->request('/private/users/__SELF__'));

        return $result;
    }

    private function makeRequest($uri, $method = 'GET', $body = null, $extraHeaders = array())
    {
        return json_decode($this->service->request($uri, $method, $body, $extraHeaders));
    }
}