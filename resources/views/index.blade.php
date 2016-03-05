<!DOCTYPE html>
<html ng-app="app" lang="en">
<head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=RobotoDraft:300,400,500,700,400italic">
    <link rel="stylesheet" href="{{url('/css/vendor.css')}}">
    <link rel="stylesheet" href="{{url('/css/app.css')}}">

    <meta name="viewport" content="initial-scale=1" />
</head>
<body layout="column" ng-controller="CoreController">

    <md-toolbar layout="row">
        <div class="md-toolbar-tools">
            <md-button ng-click="toggleSidenav('left')" hide-gt-sm class="md-icon-button">
                <md-icon aria-label="Menu" md-svg-icon="https://s3-us-west-2.amazonaws.com/s.cdpn.io/68133/menu.svg"></md-icon>
            </md-button>
            <h1>Wood Finds</h1>
            &nbsp; - @{{todaysDate}}
        </div>
    </md-toolbar>

    <div layout="row" flex>
        <md-sidenav layout="column" class="md-sidenav-left md-whiteframe-z2" md-component-id="left" md-is-locked-open="$mdMedia('gt-sm')">
            <md-list>
                <md-list-item >
                    <a href="#/products">
                        <md-item-content md-ink-ripple layout="row" layout-align="start center">
                            <div class="inset">
                                <ng-md-icon icon="shopping_cart"></ng-md-icon>
                            </div>
                            <div class="inset">Products</div>
                        </md-item-content>
                    </a>
                </md-list-item>
                <md-list-item>
                    <a href="#/customers">
                        <md-item-content md-ink-ripple layout="row" layout-align="start center">
                            <div class="inset">
                                <ng-md-icon icon="people"></ng-md-icon>
                            </div>
                            <div class="inset">Customers</div>
                        </md-item-content>
                    </a>
                </md-list-item>
                <md-list-item>
                    <a href="#/workorders">
                        <md-item-content md-ink-ripple layout="row" layout-align="start center">
                            <div class="inset">
                                <ng-md-icon icon="my_library_books"></ng-md-icon>
                            </div>
                            <div class="inset">Work Orders</div>
                        </md-item-content>
                    </a>
                </md-list-item>
                <md-list-item>
                    <a href="#/events">
                        <md-item-content md-ink-ripple layout="row" layout-align="start center">
                            <div class="inset">
                                <ng-md-icon icon="event_available"></ng-md-icon>
                            </div>
                            <div class="inset">Events</div>
                        </md-item-content>
                    </a>
                </md-list-item>
                <md-list-item>
                    <a href="#/units">
                        <md-item-content md-ink-ripple layout="row" layout-align="start center">
                            <div class="inset">
                                <ng-md-icon icon="sync"></ng-md-icon>
                            </div>
                            <div class="inset">Units</div>
                        </md-item-content>
                    </a>
                </md-list-item>
                <md-list-item>
                    <a href="#/materials">
                        <md-item-content md-ink-ripple layout="row" layout-align="start center">
                            <div class="inset">
                                <ng-md-icon icon="work"></ng-md-icon>
                            </div>
                            <div class="inset">Materials</div>
                        </md-item-content>
                    </a>
                </md-list-item>
                <md-list-item>
                    <a href="#/reports">
                        <md-item-content md-ink-ripple layout="row" layout-align="start center">
                            <div class="inset">
                                <ng-md-icon icon="poll"></ng-md-icon>
                            </div>
                            <div class="inset">Reports</div>
                        </md-item-content>
                    </a>
                </md-list-item>
            </md-list>
        </md-sidenav>

        <div layout="column" flex id="content">
            <md-content layout="column" flex class="md-padding">
                <!-- START MAIN PAGE CONTENT -->
                <div ui-view="main"></div>
                <!-- END MAIN PAGE CONTENT -->
            </md-content>
        </div>
    </div>


<script src="{{url('/js/vendor.js')}}"></script>
<script src="{{url('/js/app.js')}}"></script>
</body>
</html>