<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTablePurchaseOrdersAddFieldsDeliveryShipping extends Migration
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
            $table->decimal('delivery', 6, 2)->unsigned()->default(0)->after('paid');
            $table->decimal('shipping', 6, 2)->unsigned()->default(0)->after('delivery');
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
            $table->dropColumn(['delivery', 'shipping']);
        });
    }
}
