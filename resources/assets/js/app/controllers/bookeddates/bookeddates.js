(function(){
    "use strict";

    function BookedDateController($auth, $state, $scope, Restangular, $moment, RestService, DialogService)
    {
        var self = this;

        RestService.getFutureWorkOrders().then(function(data)
        {
            var eventSources = [];

            //console.log(data);

            var workOrderEventSrc = {};
            workOrderEventSrc.events = [];
            for(var i = 0; i < data.length; i++)
            {
                //console.log(data[i]);
                var oneWO = data[i];
                //console.log($moment(oneWO.start_date));
                workOrderEventSrc.events.push({
                    title: 'Work Order ' + oneWO.id,
                    start: $moment(oneWO.start_date).format(),
                    woObj: oneWO,
                    bookingType: 'workorder'
                });
            }
            workOrderEventSrc.backgroundColor = 'blue';
            workOrderEventSrc.allDayDefault = true;
            workOrderEventSrc.editable = false;

            eventSources.push(workOrderEventSrc);

            $('#calendar').fullCalendar({

                // put your options and callbacks here
                eventSources: eventSources,
                eventClick: function(calEvent, jsEvent, view)
                {
                    $scope.woObj = calEvent.woObj;

                    console.log(calEvent);

                    if(calEvent.bookingType === 'workorder')
                    {
                        // Popup WO details (readonly)
                        DialogService.fromTemplate(null, 'dlgWorkOrderQuickView', $scope).then(
                            function ()
                            {
                                console.log('confirmed');
                            }
                        );
                        //$state.go('app.workorders.detail', {'workOrderId': calEvent.work_order_id});
                    }

                },
                eventMouseover: function(event, jsEvent, view)
                {
                    $(this).css('cursor', 'pointer');
                }
            });

        });

    }

    angular.module('app.controllers').controller('BookedDateController', ['$auth', '$state', '$scope', 'Restangular', '$moment', 'RestService', 'DialogService', BookedDateController]);

})();