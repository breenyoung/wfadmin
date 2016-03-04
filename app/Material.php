<?php

/**
 * Created by PhpStorm.
 * User: Breen
 * Date: 03/03/2016
 * Time: 5:59 PM
 */

namespace App;

use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    protected $table = 'materials';

    protected $fillable = ['name', 'unit_cost', 'unit_id'];

    public function unit()
    {
        return $this->belongsTo('App\Unit');
    }

}