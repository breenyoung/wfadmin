<?php
/**
 * Created by PhpStorm.
 * User: Breen
 * Date: 03/03/2016
 * Time: 5:58 PM
 */

namespace App;

use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    protected $table = 'units';

    protected $fillable = ['name'];

}