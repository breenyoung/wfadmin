<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTablePurchaseOrdersAddFieldsPaidPaymentTypeAmountPaidTotal extends Migration
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
            $table->boolean('paid')->default(0)->after('fulfilled');
            $table->integer('payment_type_id')->unsigned()->after('paid');
            $table->decimal('amount_paid', 6, 2)->unsigned()->after('payment_type_id');
            $table->decimal('total', 6, 2)->unsigned()->after('amount_paid');

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
            $table->dropColumn(['paid', 'payment_type_id', 'amount_paid', 'total']);
        });
    }
}
