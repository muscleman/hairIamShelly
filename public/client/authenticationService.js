hiamsApp.factory('authenticationInterceptor', ['$q', '$location', 'sessionService', function($q, $location, sessionService){
	var storageKey = 'hairiamshelly';
	return {
		response: function(response){
			if (response.status === 401){
				console.log('response 401');
				sessionService.removeItem(storageKey);
			} else if (response.status === 200){
				if (response.data !== undefined && response.data.token !== undefined )
				{
					sessionService.setItem(storageKey, response.data);
				}
			}
			return response || $q.when(response);
		},
		responseError: function(response){
			if (response.status === 401){
				$location.path('/login').search('returnUrl', $location.path());
			}
			return $q.reject(response);
		},
		request: function(config) {
			console.log('Adding Bearer');
			//if (sessionService.getItem('hairiamshelly') !== null)
    		//{
				config.headers.Authorization = 'Bearer ' + sessionService.getItem('hairiamshelly').token;
			//}
            return config;
        }
	};
}]);

hiamsApp.factory('authenticationService', ['$resource', 'authenticationInterceptor', function($resource, authenticationInterceptor){
	return $resource(':name', 
		{},
		{
			'authenticate': {url: '/api/authenticate', method: 'POST', isArray: false, interceptor: authenticationInterceptor}
		}
	);
}]);