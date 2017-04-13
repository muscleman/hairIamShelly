// hiamsApp.factory('appointmentsService', ['$resource', 'authenticationInterceptor', function($resource, authenticationInterceptor){
// 	return $resource('/api/appointments', 
// 		{},
// 		{
// 			'list': {method: 'POST', isArray: true, interceptor: authenticationInterceptor}
// 		}
// 	);
// }]);

hiamsApp.factory('appointmentsService', ['$resource', 'authenticationInterceptor', function($resource, authenticationInterceptor){
	return $resource('/api/appointment', 
		{},
		{
			'list': {method: 'POST', isArray: true, interceptor: authenticationInterceptor},
			'update': {method: 'PUT', interceptor: authenticationInterceptor}
		}
	);
}]);