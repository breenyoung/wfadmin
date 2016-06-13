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
            ['name' => 'Created', 'order' => 1],
            ['name' => 'Approved', 'order' => 2],
            ['name' => 'Cut', 'order' => 3],
            ['name' => 'Based', 'order' => 4],
            ['name' => 'Stencil Cut', 'order' => 5],
            ['name' => 'Painted', 'order' => 6],
            ['name' => 'Hardware / Stamp', 'order' => 7],
            ['name' => 'Completed', 'order' => 8]
        );

        foreach ($work_order_tasks as $wot)
        {
            WorkOrderTask::create($wot);
        }

        Model::reguard();
    }
}
