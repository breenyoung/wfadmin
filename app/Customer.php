<?php
/**
 * Created by PhpStorm.
 * User: Breen
 * Date: 15/02/2016
 * Time: 3:58 PM
 */

namespace App;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $table = 'customers';

    protected $fillable = ['first_name', 'last_name', 'email', 'notes'];

    public function purchaseOrders()
    {
        return $this->hasMany('App\PurchaseOrder');
    }

    public function workOrders()
    {
        return $this->hasMany('App\WorkOrder');
    }
}