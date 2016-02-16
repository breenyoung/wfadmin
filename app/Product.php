<?php
/**
 * Created by PhpStorm.
 * User: Breen
 * Date: 15/02/2016
 * Time: 3:58 PM
 */

namespace App;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';

    protected $fillable = ['name', 'sku', 'description', 'price', 'sale_price', 'cost', 'active'];

    public function workOrders()
    {
        return $this->hasMany('App\WorkOrder');
    }
}