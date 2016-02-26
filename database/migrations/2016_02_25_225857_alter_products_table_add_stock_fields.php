<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterProductsTableAddStockFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('products', function ($table)
        {
            $table->integer('minimum_stock')->default(0)->after('active');
            $table->integer('current_stock')->default(0)->after('minimum_stock');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('products', function ($table)
        {
            $table->dropColumn(['minimum_stock', 'current_stock']);
        });
    }
}
