<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
    protected $table = 'purchase_orders';

    protected $fillable = ['customer_id', 'fulfilled', 'paid', 'payment_type_id', 'amount_paid', 'total', 'pickup_date', 'notes'];

    public function customer()
    {
        return $this->belongsTo('App\Customer');
    }

    public function purchaseOrderProducts()
    {
        //return $this->belongsToMany('App\Material', 'product_materials', 'product_id', 'material_id');
        return $this->hasMany('App\PurchaseOrderProduct');
    }

    public function paymentType()
    {
        return $this->hasOne('App\PaymentType');
    }
}
