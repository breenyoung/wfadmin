<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTablePurchaseOrdersAddPaymentTypeFk extends Migration
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
            $table->foreign('payment_type_id')->references('id')->on('payment_types')->onDelete('restrict');
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
            $table->dropForeign('purchase_orders_payment_type_id_foreign');
        });
    }
}
