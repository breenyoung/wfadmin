<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // $this->call(UserTableSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(CustomerSeeder::class);
        $this->call(ProductSeeder::class);
        $this->call(UnitSeeder::class);
        $this->call(PaymentTypeSeeder::class);
        $this->call(MaterialTypeSeeder::class);
        $this->call(SalesChannelSeeder::class);
        $this->call(WorkOrderTaskSeeder::class);

    }
}
