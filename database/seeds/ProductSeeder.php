<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        DB::table('products')->delete();

        $products = array(
            ['name' => 'Product 1', 'sku' => 'PROD01', 'description' => 'Desc for prod1', 'price' => 20, 'sale_price' => 15, 'cost' => 6.40, 'active' => 1],
            ['name' => 'Product 2', 'sku' => 'PROD02', 'description' => 'Desc for prod2', 'price' => 35, 'sale_price' => 25, 'cost' => 8.50, 'active' => 1],
        );

        foreach ($products as $p)
        {
            Product::create($p);
        }

        Model::reguard();
    }
}
