<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\SalesChannel;

class SalesChannelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        DB::table('sales_channels')->delete();

        $sales_channels = array(
            ['name' => 'Craft Show'],
            ['name' => 'Facebook'],
            ['name' => 'Etsy'],
            ['name' => 'Amazon'],
            ['name' => 'Shopify'],
            ['name' => 'Other'],
            ['name' => 'Kijiji']
        );

        foreach ($sales_channels as $sc)
        {
            SalesChannel::create($sc);
        }

        Model::reguard();
    }
}
