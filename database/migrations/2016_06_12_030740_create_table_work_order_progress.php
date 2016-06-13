<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableWorkOrderProgress extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('work_order_progress', function(Blueprint $table)
        {
            $table->engine = 'InnoDB';

            $table->integer('work_order_id')->unsigned();
            $table->integer('work_order_task_id')->unsigned();

            $table->foreign('work_order_id')->references('id')->on('work_orders')->onDelete('cascade');
            $table->foreign('work_order_task_id')->references('id')->on('work_order_tasks')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('work_order_progress');
    }
}
