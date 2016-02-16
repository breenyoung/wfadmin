<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        DB::table('users')->delete();

        $users = array(
            ['name' => 'Breen Young', 'email' => 'breen.young@gmail.com', 'password' => Hash::make('password11')],
            ['name' => 'Anne Young', 'email' => 'anne.young@gmail.com', 'password' => Hash::make('sammoo00')],
        );

        // Loop through each user above and create the record for them in the database
        foreach ($users as $user)
        {
            User::create($user);
        }

        Model::reguard();
    }
}
