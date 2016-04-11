(function(){
    "use strict";

    function BookedDateController($auth, $state, $scope, Restangular, $moment, RestService, DialogService)
    {
        var self = this;

        var eventSources = [];
        var workOrderEventSrc = { events: [], backgroundColor: 'blue', allDayDefault: true, editable: false };

        var bookedDateEvents = [];
        var bookedDateSrc = {events: bookedDateEvents, backgroundColor: 'orange', allDayDefault: true, editable: true };

        RestService.getFutureWorkOrders().then(function(data)
        {
            //console.log(data);

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
            eventSources.push(workOrderEventSrc);

            bookedDateEvents.push({ title: 'test BOzzz', bookingType: 'bookedDate', start: $moment().format()});
            eventSources.push(bookedDateSrc);

            $('#calendar').fullCalendar({

                // put your options and callbacks here
                eventSources: eventSources,
                eventClick: function(calEvent, jsEvent, view)
                {
                    $scope.woObj = calEvent.woObj;

                    //console.log(calEvent);

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
                    else
                    {
                        // Booking Date (allow edit)
                        DialogService.fromTemplate(null, 'dlgAddBookingDate', $scope).then(
                            function ()
                            {
                                console.log('confirmed');
                            }
                        );
                    }

                },
                eventMouseover: function(event, jsEvent, view)
                {
                    $(this).css('cursor', 'pointer');
                },
                dayClick: function(date, jsEvent, view, resourceObj)
                {
                    DialogService.fromTemplate(null, 'dlgAddBookingDate', $scope).then(
                        function ()
                        {
                            //$('#calendar').fullCalendar('renderEvent', eventObj, true);
                            $('#calendar').fullCalendar('removeEventSource', bookedDateSrc);
alert($scope.ctrlBookingCreate.notes);
                            var eventObj = { title: 'From Dialog', bookingType: 'bookedDate', start: $moment().format()};
                            bookedDateSrc.events.push(eventObj);

                            $('#calendar').fullCalendar('addEventSource', bookedDateSrc);
                            console.log('confirmed');
                        },
                        function()
                        {
                            console.log('cancel');
                        }
                    );
                }
            });

        });

    }

    angular.module('app.controllers').controller('BookedDateController', ['$auth', '$state', '$scope', 'Restangular', '$moment', 'RestService', 'DialogService', BookedDateController]);

})();