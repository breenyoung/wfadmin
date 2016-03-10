<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableWorkOrdersAddPurchaseOrderId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('work_orders', function ($table)
        {
            $table->integer('purchase_order_id')->unsigned()->nullable()->after('product_id');
        });

        Schema::table('work_orders', function ($table)
        {
            $table->foreign('purchase_order_id')->references('id')->on('purchase_orders')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('work_orders', function ($table)
        {
            $table->dropForeign('work_orders_purchase_order_id_foreign');
            $table->dropColumn(['purchase_order_id']);
        });
    }
}
