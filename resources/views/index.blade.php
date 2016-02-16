<!DOCTYPE html>
<html ng-app="app" lang="en">
<head>
    <link rel="stylesheet" href="{{url('/css/vendor.css')}}">
    <link rel="stylesheet" href="{{url('/css/app.css')}}">
</head>
<body>

<h1>Wood Finds</h1>

<div ui-view="header"></div>
<div ui-view="main"></div>
<div ui-view="footer"></div>

<script src="{{url('/js/vendor.js')}}"></script>
<script src="{{url('/js/app.js')}}"></script>
</body>
</html>