<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTablePurchaseOrdersAddSalesChannel extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('purchase_orders', function ($table)
        {
            $table->integer('sales_channel_id')->unsigned()->nullable()->after('payment_type_id');
            $table->foreign('sales_channel_id')->references('id')->on('sales_channels')->onDelete('restrict');

        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('purchase_orders', function ($table)
        {
            $table->dropColumn(['sales_channel_id']);
            $table->dropForeign('sales_channel_id_foreign');
        });
    }
}
