<html>
<head>

</head>

<body>

<div>

    <div>
        <h2>Work Order Report for <b>{{$viewdata['todaysDate']}}</b></h2>
    </div>

    <div>
        You have <b>{{$viewdata['startCount']}}</b> work order(s) that need to be started today
        <ul>
        @foreach ($viewdata['startWorkOrders'] as $swo)
                <li><a href="{{url('/#/workorders/detail', $swo->id)}}">{{$swo->customer->first_name}} {{$swo->customer->last_name}} for product: {{$swo->product->name}}</a></li>
        @endforeach
        </ul>
    </div>

    <hr/>

    <div>
        You have <b>{{$viewdata['endCount']}}</b> work order(s) that are due in <b>{{$viewdata['pickupDateReminder']}}</b> days ({{$viewdata['endDueDate']}})
        <ul>
        @foreach ($viewdata['endWorkOrders'] as $ewo)
            <li><a href="{{url('/#/workorders/detail', $ewo->id)}}">{{$ewo->customer->first_name}} {{$ewo->customer->last_name}} for product: {{$ewo->product->name}}</a></li>
        @endforeach
        </ul>
    </div>

</div>

</body>
</html>