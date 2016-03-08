<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableMaterialsAddMaterialTypeId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('materials', function ($table)
        {
            $table->integer('material_type_id')->unsigned()->nullable()->after('unit_cost');
        });

        Schema::table('materials', function ($table)
        {
            $table->foreign('material_type_id')->references('id')->on('material_types')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('materials', function ($table)
        {
            $table->dropForeign('materials_material_type_id_foreign');
            $table->dropColumn(['material_type_id']);
        });
    }
}
