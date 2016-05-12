<?php
/**
 * Created by PhpStorm.
 * User: Breen
 * Date: 5/12/2016
 * Time: 12:29 PM
 */

namespace App;

use Illuminate\Database\Eloquent\Model;

class SalesChannel extends Model
{
    protected $table = 'sales_channels';

    protected $fillable = ['name'];
}