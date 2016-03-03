<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\Unit;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        DB::table('units')->delete();

        $units = array(
            ['name' => 'Feet'],
            ['name' => 'Inches'],
            ['name' => 'Each'],
            ['name' => 'Ounces'],
            ['name' => 'Square Foot']
        );

        foreach ($units as $u)
        {
            Unit::create($u);
        }

        Model::reguard();
    }
}
