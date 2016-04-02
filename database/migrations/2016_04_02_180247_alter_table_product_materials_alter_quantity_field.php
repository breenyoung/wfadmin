<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableProductMaterialsAlterQuantityField extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('product_materials', function ($table)
        {
            $table->decimal('quantity', 6, 2)->unsigned()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('product_materials', function ($table)
        {
            $table->integer('quantity')->unsigned()->change();
        });
    }
}
