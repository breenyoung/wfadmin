(function(){
    "use strict";

    function BookedDateController($auth, $state, $scope, Restangular, $moment, RestService, DialogService)
    {
        var self = this;

        var eventSources = [];
        var workOrderEventSrc = { events: [], backgroundColor: 'blue', allDayDefault: true, editable: false };

        var bookedDateEvents = [];
        var bookedDateSrc = {
            events: function(start, end, tz, callback)
            {
                RestService.getAllBookings(start, end).then(function(data)
                {
                    //console.log(data);
                    var events = [];
                    for(var i = 0; i < data.length; i++)
                    {
                        events.push({bId: data[i].id, title: data[i].notes, start: data[i].start_date, end: data[i].end_date});
                    }

                    callback(events);
                });
            }
            , backgroundColor: 'orange', allDayDefault: true, editable: true, eventStartEditable: true
        };

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

            //bookedDateEvents.push({ title: 'test BOzzz', bookingType: 'bookedDate', start: $moment().format()});
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
                        var dialogOptions = {
                            templateUrl: '/views/dialogs/dlgAddBookingDate.html',
                            escapeToClose: true,
                            targetEvent: null,
                            controller: function DialogController($scope, $mdDialog)
                            {
                                $scope.confirmDialog = function ()
                                {
                                    console.log('accepted');
                                    $mdDialog.hide();
                                };

                                $scope.cancelDialog = function()
                                {
                                    //console.log('cancelled');
                                    $mdDialog.hide();
                                };
                            },
                            scope: $scope.$new()
                        };
                        DialogService.fromCustom(dialogOptions);
                    }

                },
                eventMouseover: function(event, jsEvent, view)
                {
                    $(this).css('cursor', 'pointer');
                },
                dayClick: function(date, jsEvent, view, resourceObj)
                {
                    console.log(date);

                    var dialogOptions = {
                        templateUrl: '/views/dialogs/dlgAddBookingDate.html',
                        escapeToClose: true,
                        targetEvent: null,
                        controller: function DialogController($scope, $mdDialog)
                        {
                            $scope.confirmDialog = function ()
                            {
                                console.log('accepted');

                                /*
                                var eventObj = { notes: $scope.ctrlBookingCreate.notes, start: date.format()};
                                RestService.addBooking(eventObj).then(function()
                                {

                                });
                                */

                                //$('#calendar').fullCalendar('renderEvent', eventObj, true);
                                //$('#calendar').fullCalendar('removeEventSource', bookedDateSrc);
                                //$('#calendar').fullCalendar('refetchEvents');
                                //bookedDateSrc.events.push(eventObj);
                                //$('#calendar').fullCalendar('addEventSource', bookedDateSrc);
                                //$('#calendar').fullCalendar('refetchEvents');

                                $mdDialog.hide();
                            };

                            $scope.cancelDialog = function()
                            {
                                //console.log('cancelled');
                                $mdDialog.hide();
                            };
                        },
                        scope: $scope.$new()
                    };
                    DialogService.fromCustom(dialogOptions);
                },
                eventDrop: function(event, delta, revertFunc)
                {
                    console.log(event);
                    console.log(delta);

                    var e = $('#calendar').fullCalendar('clientEvents', event._id);
                    //e[0].start = e[0].start.add(delta);
                    $('#calendar').fullCalendar('updateEvent', e[0]);
                    $('#calendar').fullCalendar('refetchEvents');
                    console.log(e[0]);

                }
            });

        });

    }

    angular.module('app.controllers').controller('BookedDateController', ['$auth', '$state', '$scope', 'Restangular', '$moment', 'RestService', 'DialogService', BookedDateController]);

})();