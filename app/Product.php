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

    protected $fillable = ['name', 'sku', 'description', 'price', 'cost', 'active', 'minimum_stock', 'current_stock', 'is_custom'];

    public function workOrders()
    {
        return $this->hasMany('App\WorkOrder');
    }

    public function productMaterials()
    {
        //return $this->belongsToMany('App\Material', 'product_materials', 'product_id', 'material_id');
        return $this->hasMany('App\ProductMaterial');
    }
}