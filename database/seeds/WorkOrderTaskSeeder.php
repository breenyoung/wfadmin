<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\WorkOrderTask;

class WorkOrderTaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        DB::table('work_order_tasks')->delete();

        $work_order_tasks = array(
            ['name' => 'Created'],
            ['name' => 'Approved'],
            ['name' => 'Cut'],
            ['name' => 'Based'],
            ['name' => 'Stencil Cut'],
            ['name' => 'Painted'],
            ['name' => 'Hardware / Stamped'],
            ['name' => 'Completed']
        );

        foreach ($work_order_tasks as $wot)
        {
            WorkOrderTask::create($wot);
        }

        Model::reguard();
    }
}
