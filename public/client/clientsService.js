hiamsApp.factory('clientsService', ['$resource', 'authenticationInterceptor', function($resource, authenticationInterceptor){
	return $resource('/api/client', 
		{},
		{
			'query': {method: 'GET', url: '/api/clients', isArray: true, interceptor: authenticationInterceptor},
			'update': {method: 'PUT', interceptor: authenticationInterceptor}
		}
	);
}]);