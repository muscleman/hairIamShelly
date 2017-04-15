hiamsApp.factory('appointmentsService', ['$resource', 'authenticationInterceptor', function($resource, authenticationInterceptor){
	return $resource('/api/appointment', 
		{},
		{
			'list': {method: 'POST', isArray: true, interceptor: authenticationInterceptor},
			'update': {method: 'PUT', interceptor: authenticationInterceptor},
			'query' : {method: 'GET', isArray: true, interceptor: authenticationInterceptor}
		}
	);
}]);