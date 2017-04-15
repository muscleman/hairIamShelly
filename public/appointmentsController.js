hiamsApp.controller('appointmentsController', ['$scope', '$compile', '$uibModal', '$log', 'appointmentsService', function ($scope, $compile, $uibModal, $log, appointmentsService) {


  $scope.open = function (event) {

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      // size: size,
      resolve: {
        event: function () {
          return event;
        }
      }
    });

    modalInstance.result.then(function (event) {
        if (event.success){
          appointmentsService.save(event).$promise.then(function(response){
            console.log('SAVED');
            addCalendarEvent(response);
          })
          .catch(function(response){
            console.log('NOT SAVED');
          });            
        }
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

function addCalendarEvent(eventObject){
    $('#calendar').fullCalendar('renderEvent', eventObject, true);
}

var removeCalendarEvent = function(event){
    $('#calendar').fullCalendar('removeEvents', event._id);
};

	
$('#calendar').fullCalendar({
        // put your options and callbacks here
        header: {
				left: 'prev,next today',
				center: 'title',
        theme: true,
				right: 'month,agendaWeek,agendaDay'},
        hiddenDays: [0,1],
        businessHours: [{dow:[2,3,4,5], start: '09:00', end: '19:00'}, {dow:[6], start: '09:30', end: '13:00'}],
        defaultView: 'agendaDay',
        editable: true,
        eventStartEditable: true,
        // events: appointmentsService.readAppointments,
        // events: function(start, end, timezone, callback){
        //           appointmentsService.list().$promise.then(function(response) {
        //           callback(response.data);
        //         });
        //       },
        events: function(start, end, timezone, callback){
                  appointmentsService.query().$promise.then(function(response) {
                  callback(response);
                })
                .catch(function(response){
                  console.log('LOAD FAILED');
                });
              },
        selectable: true,
        select: function(start, end, allDay){
            $scope.open({start: start, end: end, title : 'My Appointment', success: false});
        },
        // eventDrop: function(event, delta, revertFunc){
        //                     console.log('eventDrop');
        //                     var resizedEvent = {_id : event._id,
        //                         start : event.start.format(),
        //                         end   : event.end.format(),
        //                         title : event.title};
        //                     appointmentsService.addAppointment(resizedEvent)
        //                         .then(function(response){   
        //                             console.log(response.data); 
        //                         })
        //                         .catch(function(response){
        //                             revertFunc();
        //                         });
        //                 },
        eventDrop: function(event, delta, revertFunc){
                            console.log('eventDrop');
                            var resizedEvent = {_id : event._id,
                                start : event.start.format(),
                                end   : event.end.format(),
                                title : event.title};
                                appointmentsService.update(resizedEvent).$promise.then(function(){
                                  console.log('RESIZED');
                                })
                                .catch(function(response){
                                  console.log('FAILED RESIZE');
                                  revertFunc();
                                });
                            // appointmentsService.$save(resizedEvent)
                            //     .$promise(function(response){   
                            //         console.log(response.data); 
                            //     })
                            //     .catch(function(response){
                            //         revertFunc();
                            //     });
                        },
        // eventClick: function(event, jsEvent, view){
        // },
        // eventResize: function(event, delta, revertFunc){
        //                     var resizedEvent = {_id : event._id,
        //                                         start : event.start.format(),
        //                                         end   : event.end.format(),
        //                                         title : event.title};
        //                     appointmentsService.updateAppointment(resizedEvent)
        //                         .then(function(response){ 
        //                             event.color = response.color;
        //                             // console.log('eventResize then ');
        //                             // console.log('response ' + response.data);   
        //                         })
        //                         .catch(function(response){
        //                             // console.log('eventResize catch ');
        //                             // console.log('response ' + response.data); 
        //                             revertFunc();
        //                         });
        // },
        eventResize: function(event, delta, revertFunc){
                            var resizedEvent = {_id : event._id,
                                                start : event.start.format(),
                                                end   : event.end.format(),
                                                title : event.title};
                            appointmentsService.update(resizedEvent).$promise.then(function(){
                              console.log('UPDATED');
                            })
                            .catch(function(response){
                              console.log('FAILED UPDATE');
                              revertFunc();
                            });

                                // .then(function(response){ 
                                //     event.color = response.color;
                                //     // console.log('eventResize then ');
                                //     // console.log('response ' + response.data);   
                                // })
                                // .catch(function(response){
                                //     // console.log('eventResize catch ');
                                //     // console.log('response ' + response.data); 
                                //     revertFunc();
                                // });
        },
        slotMinutes: '00:15:00',
        snapDuration: '00:30:00',
        slotLabelInterval: '00:15:00',
        displayEventEnd: true,
        viewSubSlotLabel:true,
        minTime: '08:00:00',
        maxTime: '19:00:00',
        contentHeight: 'auto',
        eventRender: function(event, element) { 
           element.find(".fc-bg").css("pointer-events","none");
           // var newElement = "<div id='events-layer' class='fc-transparent' style='position:absolute;top:-1px;right:0em;height:1em;z-index:100' ><button type='button' id='btnDeleteEvent' class='btn btn-block btn-primary btn-flat glyphicon glyphicon-remove-sign'></button></div>";
           var newElement = "<div id='events-layer' class='fc-transparent' style='position:absolute;top:-1px;right:0em;height:1em;z-index:100' ><span id='btnDeleteEvent' class='glyphicon glyphicon-remove-sign'></span></div>";
           element.append(newElement);
           
           element.find("#btnDeleteEvent").click(function(){
                appointmentsService.delete({_id: event._id}).$promise.then(function(){
                  console.log('DELETED');
                  removeCalendarEvent(event);
                })
                .catch(function(response){
                  console.log('FAILED DELETE');
                });
                
                // appointmentsService.deleteAppointment({_id: event._id}).then(function(response){
                //     removeCalendarEvent(event);
                // });

           });
         }
});

$(document).ready(function() {
  var bottomDifference = $('#container')[0].getBoundingClientRect().bottom - $('.fc-slats')[0].getBoundingClientRect().bottom;
  var currentHeight = $( ".fc-slats > table" ).css( "height");
  //console.log("Current: ", currentHeight);
  //console.log("Bottom: ", bottomDifference);
  var newHeight = parseInt(currentHeight) + bottomDifference;
   $( ".fc-slats > table" ).css( "height", newHeight );
});
	
}]);

hiamsApp.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, event) {

  $scope.event = event;

  $scope.ok = function () {
    $scope.event.success = true;
    $uibModalInstance.close($scope.event);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

