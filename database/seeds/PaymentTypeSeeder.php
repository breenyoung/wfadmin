<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\PaymentType;

class PaymentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        DB::table('payment_types')->delete();

        $payment_types = array(
            ['name' => 'Cash'],
            ['name' => 'Cheque'],
            ['name' => 'Credit Card'],
            ['name' => 'E-Transfer'],
            ['name' => 'Paypal'],
            ['name' => 'Other']
        );

        foreach ($payment_types as $pt)
        {
            PaymentType::create($pt);
        }

        Model::reguard();
    }
}
