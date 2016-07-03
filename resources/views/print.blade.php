<!DOCTYPE html>
<html ng-app="app" lang="en">
<head>
    <title>Print Friendly View</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=RobotoDraft:300,400,500,700,400italic">
    <link rel="stylesheet" href="{{url('css/app.css')}}" type="text/css"/>
    <meta name="viewport" content="initial-scale=1" />
</head>
<body>

    <div>

    @if ($view === 'weekworkorders')

    @include('printreports.weekworkorders')

    @endif


    </div>

</body>
</html>