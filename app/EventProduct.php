<?php
/**
 * Created by PhpStorm.
 * User: Breen
 * Date: 15/02/2016
 * Time: 3:58 PM
 */

namespace App;

use Illuminate\Database\Eloquent\Model;

class EventProduct extends Model
{
    protected $table = 'event_products';
    public $timestamps = false;

    protected $fillable = ['event_id', 'product_id', 'quantity'];

    public function product()
    {
        return $this->belongsTo('App\Product');
    }
}