
hiamsApp.service('appointmentsService', ['$http', function ($http) {
	
	var addAppointment = function(event){
		return $http.post('/api/addAppointment', event);
	};

	var updateAppointment = function(event){
		return $http.post('/api/updateAppointment', event);
	};

	var readAppointment = function(){
		return null;
	};

	var readAppointments = function(start, end, timezone, callback){
		
		$http.post('/api/appointments').then(function(response){
			callback(response.data);
		});
	};

	var deleteAppointment = function(_id){
		return $http.post('/api/deleteAppointment', _id);
	};


	return {
		addAppointment : addAppointment,
		readAppointment : readAppointment,
		readAppointments : readAppointments,
		deleteAppointment : deleteAppointment,
		updateAppointment : updateAppointment
	};
}]);