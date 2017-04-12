hiamsApp.factory('appointmentsService', ['$resource', 'authenticationInterceptor', function($resource, authenticationInterceptor){
	return $resource('/api/appointments', 
		{},
		{
			'list': {method: 'POST', isArray: true, interceptor: authenticationInterceptor}
		}
	);
}]);