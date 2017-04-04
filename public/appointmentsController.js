hiamsApp.controller('appointmentsController', ['$scope', '$compile', 'appointmentsService', function ($scope, $compile, appointmentsService) {


    // $scope.events = [
    //   {title: 'All Day Event',start: new Date('Thu Oct 17 2013 09:00:00 GMT+0530 (IST)')},
    //   {title: 'Long Event',start: new Date('Thu Oct 17 2013 10:00:00 GMT+0530 (IST)'),end: new Date('Thu Oct 17 2013 17:00:00 GMT+0530 (IST)')},
    //   {id: 999,title: 'Repeating Event',start: new Date('Thu Oct 17 2013 09:00:00 GMT+0530 (IST)'),allDay: false},
    //   {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
    //   {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
    //   {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    // ];

    //$scope.events = [{title: 'first chop', start: '2017-03-31T10:30:00', end: '2017-03-31T11:30:00'}];


    // var e = function(start, end, timezone, callback){
    //     var events = [{title: 'first chop', start: '2017-03-31T10:30:00', end: '2017-03-31T11:30:00'}];
    //     callback(events);
    // };

    // $scope.eventSources = [$scope.events];


// ('#calendar').fullCalendar(uiConfig);

function addCalendarEvent(eventObject){
    $('#calendar').fullCalendar('renderEvent', eventObject, true);
}

var removeCalendarEvent = function(event){
    //alert('removed');
    $('#calendar').fullCalendar('removeEvents', event._id);
};

	
$('#calendar').fullCalendar({
        // put your options and callbacks here
        header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'},
        hiddenDays: [0,1],
        businessHours: [{dow:[2,3,4,5], start: '09:00', end: '19:00'}, {dow:[6], start: '09:30', end: '13:00'}],
        defaultView: 'agendaDay',
        editable: true,
        eventStartEditable: true,
        events: appointmentsService.readAppointments,
        selectable: true,
        select: function(start, end, allDay){
            var title = prompt('Event Title:');
            if (title){
                var event = {start : start,
                             end   : end,
                             title : title};
                 console.log('select');
                 appointmentsService.addAppointment(event)
                     .then(function(response){
                        console.log(response.data);
                        addCalendarEvent(response.data);
                     })
                     .catch(function(response){
                        console.log(response);
                     });
                
            }
        },
        eventDrop: function(event, delta, revertFunc){
                            console.log('eventDrop');
                            var resizedEvent = {_id : event._id,
                                start : event.start.format(),
                                end   : event.end.format(),
                                title : event.title};
                            appointmentsService.addAppointment(resizedEvent)
                                .then(function(response){   
                                    console.log(response.data); 
                                })
                                .catch(function(response){
                                    revertFunc();
                                });
                        },
        eventClick: function(event, jsEvent, view){
            //alert(event._id);
        },
        eventResize: function(event, delta, revertFunc){
                            var resizedEvent = {_id : event._id,
                                                start : event.start.format(),
                                                end   : event.end.format(),
                                                title : event.title};
                            appointmentsService.updateAppointment(resizedEvent)
                                .then(function(response){ 
                                    event.color = response.color;
                                    // console.log('eventResize then ');
                                    // console.log('response ' + response.data);   
                                })
                                .catch(function(response){
                                    // console.log('eventResize catch ');
                                    // console.log('response ' + response.data); 
                                    revertFunc();
                                });
        },
        slotMinutes: '00:15:00',
        snapDuration: '00:15:00',
        slotLabelInterval: '00:15:00',
        displayEventEnd: true,
        viewSubSlotLabel:true,
        minTime: '08:00:00',
        maxTime: '19:00:00',
        contentHeight: 'auto',
        eventRender: function(event, element) { 
           element.find(".fc-bg").css("pointer-events","none");
           var newElement = "<div id='events-layer' class='fc-transparent' style='position:absolute;top:-1px;right:0em; z-index:100' ><button type='button' id='btnDeleteEvent' class='btn btn-block btn-primary btn-flat'>X</button></div>";
           element.append(newElement);
           
           element.find("#btnDeleteEvent").click(function(){
                appointmentsService.deleteAppointment({_id: event._id}).then(function(response){
                    removeCalendarEvent(event);
                });
           });
         }
});
	
}]);

