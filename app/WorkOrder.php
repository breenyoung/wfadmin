<?php
/**
 * Created by PhpStorm.
 * User: Breen
 * Date: 15/02/2016
 * Time: 3:58 PM
 */

namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkOrder extends Model
{
    protected $table = 'work_orders';

    protected $fillable = ['customer_id', 'product_id', 'start_date', 'end_date', 'completed', 'notes'];

    public function customer()
    {
        return $this->belongsTo('App\Customer');
    }

    public function product()
    {
        return $this->belongsTo('App\Product');
    }
}