<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MaterialType extends Model
{
    protected $table = 'material_types';

    protected $fillable = ['name'];
}
