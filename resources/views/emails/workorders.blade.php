<html>
<head>

</head>

<body>

<div>

    <div>
        <h2>Work Order Report for <b>{{todaysDate}}</b></h2>
    </div>

    <div>
        You have <b>{{startCount}}</b> work orders that need to be started today
        <hr/>
        <ul>
        @foreach ($startWorkOrders as $swo)
                <li>{{$swo->customer_id}} for product: {{$swo->product_id}}</li>
        @endforeach
        </ul>
    </div>

    <div>
        You have <b>{{endCount}}</b> work orders that are due in <b>2</b> days ({{endDueDate}})
        <hr/>
        <ul>
        @foreach ($endWorkOrders as $ewo)
            <li>{{$ewo->customer_id}} for product: {{$ewo->product_id}}</li>
        @endforeach
        </ul>
    </div>

</div>

</body>
</html>