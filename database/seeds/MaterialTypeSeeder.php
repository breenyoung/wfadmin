<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\MaterialType;

class MaterialTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        DB::table('material_types')->delete();

        $material_types = array(
            ['name' => 'Build'],
            ['name' => 'Shipping']
        );

        foreach ($material_types as $mt)
        {
            MaterialType::create($mt);
        }

        Model::reguard();
    }
}
