<?php
/**
 * Created by PhpStorm.
 * User: Breen
 * Date: 15/02/2016
 * Time: 3:58 PM
 */

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProductMaterial extends Model
{
    protected $table = 'product_materials';
    public $timestamps = false;

    protected $fillable = ['product_id', 'material_id', 'quantity'];

    public function material()
    {
        return $this->belongsTo('App\Material');
    }
}