<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkOrderTask extends Model
{
    protected $table = 'work_order_tasks';

    protected $fillable = ['name'];
}
