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

    protected $dates = ['start_date', 'end_date'];

    public $timestamps = false;

    protected $fillable = ['start_date', 'end_date', 'work_order_id', 'work_order_generated', 'notes'];

}