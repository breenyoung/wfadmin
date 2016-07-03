<style type="text/css">

    label {
        display: inline;
    }
</style>

<table width="100%" border="1">
    <thead>
    <tr>
        <th width="10%">W.O #</th>
        <th width="20%">Product</th>
        <th width="20%">Customer</th>
        <th width="10%">Amount Owing</th>
        <th width="10%">Due Date</th>
        <th>Notes</th>
    </tr>
    </thead>
    <tbody>
    @foreach ($results as $result)
        <tr>
            <td>W.O #{{$result['id']}}</td>
            <td>{{$result['product']['name']}}</td>
            <td>{{$result['customer']['first_name']}} {{$result['customer']['last_name']}}</td>
            <td>{{$result['purchaseOrder']['total'] - $result['purchaseOrder']['amount_paid']}}</td>
            <td>{{\Carbon\Carbon::instance($result['end_date'])->format('m-d-Y')}}</td>
            <td>{{$result['notes']}}</td>
        </tr>

        @if($args['detailsview'] === 1)

        <tr>
            <td colspan="6">
            <span style="margin-left: 25px;">
            @foreach ($workordertasks as $workordertask)

                @if ($result['workOrderProgress']->contains('work_order_task_id', $workordertask['id']))
                    <?php $checked = 'checked="checked"' ?>
                @else
                    <?php $checked = '' ?>
                @endif

                <input id="prog_{{$workordertask['id']}}" type="checkbox" {{$checked}} class="regular-checkbox big-checkbox" disabled="disabled"/><label for="prog_{{$workordertask['id']}}"></label>
                {{$workordertask['name']}}

            @endforeach
            </span>
            </td>
        </tr>

        @endif

    @endforeach
    </tbody>
</table>