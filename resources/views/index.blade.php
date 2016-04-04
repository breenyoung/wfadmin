<!DOCTYPE html>
<html ng-app="app" lang="en">
<head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=RobotoDraft:300,400,500,700,400italic">

    <link rel="stylesheet" href="{{url('/css/vendor.css')}}">
    <link rel="stylesheet" href="{{url('/css/app.css')}}">

    <meta name="viewport" content="initial-scale=1" />
</head>
<body layout="column" ng-controller="CoreController">

<!--
    BEGIN: App-Loading Screen.
    --
    Until the AngularJS application code is loaded and bootstrapped, this is just
    "static HTML." Meaning, the [class-based] directive, "mAppLoading", won't
    actually do anything until the application is initialized. As such, we'll give
    it just enough CSS to "fail open"; then, when the AngularJS app loads, the
    directive will run and we'll remove this loading screen.

    NOTES ON ANIMATION:

    When the AngularJS application is loaded and starts bootstrapping, all
    animations are disabled until all the routing information and templating
    information is loaded AND at least two digests have run (in order to prevent
    a flurry of animation activity). As such, we can't animate the root of the
    directive. Instead, we have to add "ngAnimateChildren" to the root element
    and then animate the inner container. The "ngAnimateChildren" directive allows
    us to override the animation-blocking within the bounds of our directive, which
    is fine since it only runs once.
-->
<div class="m-app-loading" ng-animate-children>

    <!--
        HACKY CODE WARNING: I'm putting Style block inside directive so that it
        will be removed from the DOM when we remove the directive container.
    -->
    <style type="text/css">

        div.m-app-loading {
            position: fixed ;
        }

        div.m-app-loading div.animated-container {
            background-color: #333333 ;
            bottom: 0px ;
            left: 0px ;
            opacity: 1 ;
            position: fixed ;
            right: 0px ;
            top: 0px ;
            z-index: 999999 ;
        }

        /* Used to initialize the ng-leave animation state. */
        div.m-app-loading div.animated-container.ng-leave {
            opacity: 1.0 ;
            transition: all linear 200ms ;
            -webkit-transition: all linear 200ms ;
        }

        /* Used to set the end properties of the ng-leave animation state. */
        div.m-app-loading div.animated-container.ng-leave-active {
            opacity: 0 ;
        }

        div.m-app-loading div.messaging {
            color: #FFFFFF ;
            font-family: monospace ;
            left: 0px ;
            margin-top: -37px ;
            position: absolute ;
            right: 0px ;
            text-align: center ;
            top: 50% ;
        }

        div.m-app-loading h1 {
            font-size: 26px ;
            line-height: 35px ;
            margin: 0px 0px 20px 0px ;
        }

        div.m-app-loading p {
            font-size: 18px ;
            line-height: 14px ;
            margin: 0px 0px 0px 0px ;
        }

    </style>


    <!-- BEGIN: Actual animated container. -->
    <div class="animated-container">

        <div class="messaging">

            <h1>
                App is Loading
            </h1>

            <p>
                Please stand by
            </p>

        </div>

    </div>
    <!-- END: Actual animated container. -->

</div>
<!-- END: App-Loading Screen. -->



    <md-toolbar layout="row" ng-show="!showSearch">
        <div class="md-toolbar-tools">

            <md-button ng-click="toggleSidenav('left')" hide-gt-sm class="md-icon-button">
                <md-icon aria-label="Menu" md-svg-icon="{{url('/img/menu.svg')}}"></md-icon>
            </md-button>

            <span hide show-gt-sm>Wood Finds - @{{todaysDate | amDateFormat: "dddd, MMMM Do YYYY"}}</span>
            <span hide-gt-sm>WF - @{{todaysDate | amDateFormat: "YYYY-MM-DD"}}</span>

            <span flex></span>

            <md-button class="md-icon-button" aria-label="Search" ng-click="toggleSearch()">
                <ng-md-icon icon="search"></ng-md-icon>
            </md-button>
        </div>
    </md-toolbar>

    <md-toolbar ng-show="showSearch" class="animate-show md-hue-1 md-whiteframe-z1">
        <div class="md-toolbar-tools">

            <md-button class="md-icon-button" ng-click="toggleSearch()" aria-label="Menu">
                <ng-md-icon icon="arrow_back" aria-label="Back"></ng-md-icon>
            </md-button>

            <h3 role="button" ng-click="toggleSearch()">Back</h3>

            <span flex="5"></span>

            <span ng-controller="SearchController as ctrlSearch" flex>
                <md-autocomplete
                                 md-input-id="superSearch"
                                 md-input-name="autocompleteField"
                                 md-no-cache="ctrlSearch.noCache"
                                 md-selected-item="ctrlSearch.selectedResult"
                                 md-search-text="ctrlSearch.searchText"
                                 md-items="item in ctrlSearch.doSearch(ctrlSearch.searchText)"
                                 md-item-text="item.name"
                                 md-min-length="3"
                                 md-delay="1000"
                                 md-selected-item-change="ctrlSearch.gotoItem()"
                                 placeholder="Search">

                    <md-item-template>
                        <span><strong>@{{item.content_type }}</strong> - @{{item.name}}</span>
                    </md-item-template>

                    <md-not-found>No matches found.</md-not-found>

                </md-autocomplete>
            </span>
        </div>
    </md-toolbar>

    <div layout="row" flex>
        <md-sidenav layout="column" class="md-sidenav-left md-whiteframe-z2" md-component-id="left" md-is-locked-open="$mdMedia('gt-sm')" md-swipe-left="hideSideNav('left')">
            <md-list>
                <md-list-item>
                    <a href="#/purchaseorders" ng-click="hideSideNav('left')" class="nounderline">
                        <md-item-content md-ink-ripple layout="row" layout-align="start center">
                            <div class="inset">
                                <ng-md-icon icon="assignment"></ng-md-icon>
                            </div>
                            <div class="inset">Purchase Orders</div>
                        </md-item-content>
                    </a>
                </md-list-item>
                <md-divider></md-divider>
                <md-list-item>
                    <a href="#/workorders" ng-click="hideSideNav('left')" class="nounderline">
                        <md-item-content md-ink-ripple layout="row" layout-align="start center">
                            <div class="inset">
                                <ng-md-icon icon="my_library_books"></ng-md-icon>
                            </div>
                            <div class="inset">Work Orders</div>
                        </md-item-content>
                    </a>
                </md-list-item>
                <md-divider></md-divider>
                <md-list-item >
                    <a href="#/products" ng-click="hideSideNav('left')" class="nounderline">
                        <md-item-content md-ink-ripple layout="row" layout-align="start center">
                            <div class="inset">
                                <ng-md-icon icon="shopping_cart"></ng-md-icon>
                            </div>
                            <div class="inset">Products</div>
                        </md-item-content>
                    </a>
                </md-list-item>
                <md-divider></md-divider>
                <md-list-item>
                    <a href="#/customers" ng-click="hideSideNav('left')" class="nounderline">
                        <md-item-content md-ink-ripple layout="row" layout-align="start center">
                            <div class="inset">
                                <ng-md-icon icon="people"></ng-md-icon>
                            </div>
                            <div class="inset">Customers</div>
                        </md-item-content>
                    </a>
                </md-list-item>
                <md-divider></md-divider>
                <md-list-item>
                    <a href="#/events" ng-click="hideSideNav('left')" class="nounderline">
                        <md-item-content md-ink-ripple layout="row" layout-align="start center">
                            <div class="inset">
                                <ng-md-icon icon="event_available"></ng-md-icon>
                            </div>
                            <div class="inset">Events</div>
                        </md-item-content>
                    </a>
                </md-list-item>
                <md-divider></md-divider>
                <md-list-item>
                    <a href="#/reports" ng-click="hideSideNav('left')" class="nounderline">
                        <md-item-content md-ink-ripple layout="row" layout-align="start center">
                            <div class="inset">
                                <ng-md-icon icon="poll"></ng-md-icon>
                            </div>
                            <div class="inset">Reports</div>
                        </md-item-content>
                    </a>
                </md-list-item>
                <md-divider></md-divider>

                <md-list-item>
                    <a href="#/lookups" ng-click="hideSideNav('left')" class="nounderline">
                        <md-item-content md-ink-ripple layout="row" layout-align="start center">
                            <div class="inset">
                                <ng-md-icon icon="book"></ng-md-icon>
                            </div>
                            <div class="inset">Other</div>
                        </md-item-content>
                    </a>
                </md-list-item>


                <md-list-item ng-show="isAuthenticated()">
                    <a ng-click="logout()" class="nounderline">
                        <md-item-content md-ink-ripple layout="row" layout-align="start center">
                            <div class="inset">
                                <ng-md-icon icon="logout"></ng-md-icon>
                            </div>
                            <div class="inset">Logout</div>
                        </md-item-content>
                    </a>
                </md-list-item>


            </md-list>
        </md-sidenav>

        <div layout="column" flex="5" md-swipe-right="showSideNav('left')" hide-gt-sm><!-- EDGE GRAB FOR FLYOUT MENU --></div>

        <div layout="column" flex id="content">

            <md-button class="md-fab md-fab-bottom-right" aria-label=”Add” ng-click="addFabNavigate()" ng-show="determineFabVisibility()">
                <ng-md-icon icon="add"></ng-md-icon>
            </md-button>

            <md-content layout="column" flex class="md-padding">
                <!-- START MAIN PAGE CONTENT -->
                <div ui-view="main"></div>
                <!-- END MAIN PAGE CONTENT -->
            </md-content>

        </div>
    </div>

<script type="text/ng-template" id="error-messages">
    <div class="errorMessage" ng-message="required">This field is required</div>
    <div class="errorMessage" ng-message="minlength">This field is too short</div>
    <div class="errorMessage" ng-message="maxlength">This field is too long</div>
    <div class="errorMessage" ng-message="nan">This field is not a number</div>
    <div class="errorMessage" ng-message="email">This field is not a email</div>
</script>

<script>
    var deliveryFee = {{config('app.delivery_charge')}};
    var shippingCanada = {{config('app.shipping_charge_canada')}};
    var shippingUsa = {{config('app.shipping_charge_usa')}};

</script>
<script src="{{url('/js/vendor.js')}}"></script>
<script src="{{url('/js/app.js')}}"></script>
</body>
</html>