<?php
/**
 * Created by PhpStorm.
 * User: byoung
 * Date: 3/7/2016
 * Time: 3:36 PM
 */

namespace App;


use Illuminate\Support\Facades\Cache;

class CacheManager
{
    /**
     * CacheManager constructor.
     */
    public function __construct()
    {

    }

    public function isInCache($store, $key)
    {
        return Cache::store($store)->has($key);
    }

    public function getItem($store, $key, $defaultValue = null)
    {
        return Cache::store($store)->get($key, $defaultValue);
    }

    public function getItemAndDelete($store, $key)
    {
        return Cache::store($store)->pull($key);
    }

    public function setItem($store, $key, $value, $expiry)
    {
        Cache::store($store)->put($key, $value, $expiry);
    }

    public function setItemNew($store, $key, $value, $expiry)
    {
        return Cache::store($store)->add($key, $value, $expiry);
    }

    public function setItemInfinite($store, $key, $value)
    {
        Cache::store($store)->forever($key, $value);
    }

    public function deleteItem($store, $key)
    {
        Cache::store($store)->forget($key);
    }

    public function flushCache($store)
    {
        Cache::store($store)->flush();
    }
}