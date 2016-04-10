<?php
/**
 * Created by PhpStorm.
 * User: Breen
 * Date: 4/10/2016
 * Time: 1:33 AM
 */

namespace App;

use Illuminate\Database\Eloquent\Model;

class BookedDate extends Model
{
    protected $table = 'booked_dates';

    public $timestamps = false;

    protected $fillable = ['booked_date', 'work_order_id', 'work_order_generated', 'notes'];

}