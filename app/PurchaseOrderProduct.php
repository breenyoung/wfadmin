<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrderProduct extends Model
{
    protected $table = 'purchase_order_products';
    public $timestamps = false;

    protected $fillable = ['purchase_order_id', 'product_id', 'quantity'];

    public function purchaseOrder()
    {
        return $this->belongsTo('App\PurchaseOrder');
    }
}
