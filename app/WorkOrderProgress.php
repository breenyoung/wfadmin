<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkOrderProgress extends Model
{
    protected $table = 'work_order_progress';
    public $timestamps = false;

    protected $fillable = ['work_order_id', 'work_order_task_id'];

    public function workOrder()
    {
        return $this->belongsTo('App\WorkOrder');
    }
}
