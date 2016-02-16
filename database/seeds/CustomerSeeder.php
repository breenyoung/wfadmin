<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\Customer;


class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        DB::table('customers')->delete();

        $customers = array(
            ['first_name' => 'John', 'last_name' => 'Doe', 'email' => 'john@doe.com', 'notes' => 'Parts unknown'],
            ['first_name' => 'Jane', 'last_name' => 'Smith', 'email' => 'jane@smith.com'],
        );

        foreach ($customers as $c)
        {
            Customer::create($c);
        }

        Model::reguard();
    }
}
