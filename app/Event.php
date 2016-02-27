<?php
/**
 * Created by PhpStorm.
 * User: Breen
 * Date: 15/02/2016
 * Time: 3:58 PM
 */

namespace App;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $table = 'events';

    protected $fillable = ['name', 'start_date', 'end_date', 'notes'];

    public function eventProducts()
    {
        return $this->hasMany('App\EventProduct');
    }
}