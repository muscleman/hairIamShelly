var hiamsApp = angular.module('hiamsApp', ['ui.router', 'ui.bootstrap']);

hiamsApp.factory('sessionService', ['$window', function($window){
	var localStorage = $window.localStorage;

	var sessionService = {
		getItem: function(key){
			return angular.fromJson(localStorage.getItem(key));
		},
		setItem: function(key, value){
			return localStorage.setItem(key, angular.toJson(value));
		},
		removeItem: function(key){
			return localStorage.removeItem(key);
		},
		isAnonymous: false
	};
	return sessionService;
}]);

// hiamsApp.factory('sessionInjector', ['sessionService', function(sessionService) {  
//     var sessionInjector = {
//         request: function(config) {
//         	if (config.url != '//maps.googleapis.com/maps/api/geocode/json'){
// 	        	console.log(config.url);
// 	        	var token = {};
// 	        	if (sessionService.getItem('hairiamshelly') !== null)
// 	        	{
// 	        		token = sessionService.getItem('hairiamshelly').token;
// 	        	    config.headers['x-session-token'] = token;
// 	        	}
// 	        }
//             return config;
//         }
//     };
//     return sessionInjector;
// }]);


hiamsApp.factory('sessionInjector', ['sessionService', function(sessionService) {  
    var sessionInjector = {
        request: function(config) {
        	console.log(config.headers);
        	if (config.headers.Authorization === 'Bearer'){
        		if (sessionService.getItem('hairiamshelly') !== null)
	        	{
        			config.headers.Authorization = 'Bearer ' + sessionService.getItem('hairiamshelly').token;
        		}
        	}
            return config;
        }
    };
    return sessionInjector;
}]);

hiamsApp.factory('AuthHttpResponseInterceptor', ['$q', '$location', 'sessionService', function ($q, $location, sessionService) {

	return {
		response: function(response){
			if (response.status === 401){
				console.log('Response 401');
			}
			return response || $q.when(response);
		},
		responseError: function(rejection){
			if (rejection.status === 401){
				//console.log('Response Error 401', rejection);
				$location.path('/login').search('returnUrl', $location.path());
			}
			return $q.reject(rejection);
		}
	};
}]);


hiamsApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){

	$httpProvider.interceptors.push('sessionInjector');
	$httpProvider.interceptors.push('AuthHttpResponseInterceptor');

	$urlRouterProvider.otherwise('/login');
	
	$stateProvider
		.state('login', {
			url: '/login',
			templateUrl: 'login.html',
			controller: 'loginController'
		}).state('logout', {
			url: '/login',
			controller: function($scope, sessionService){
				sessionService.removeItem('hairiamshelly');
				//$route.reload();
			}
		}).state('register', {
			url: '/register',
			templateUrl: 'register.html',
			controller: 'registerController'
		}).state('home',{
			url: '/home',
			templateUrl: 'home.html'
		}).state('clients', {
			url: '/clients',
			templateUrl: 'clients.html',
			controller: 'clientsController'
		}).state('profile', {
			url: '/profile',
			templateUrl: 'profile.html',
			controller: 'profileController'
		}).state('appointments', {
			url: '/appointments',
			templateUrl: 'appointments.html',
			controller: 'appointmentsController'
		});


	
	$locationProvider.html5Mode(true);
}]);


// angular.module('app', ['ngResource']).
//   factory('resourceInterceptor', function() {
//     return {
//       response: function(response) {
//         console.log('response intercepted: ', response);
//       }
//     }
//   }).
//   factory('resourceService', ['$resource', 'resourceInterceptor', function($resource, resourceInterceptor) {
//     return $resource(":name", 
//         {}, 
//         {
//             'list': {method: 'GET', isArray: false, interceptor: resourceInterceptor}
//         }
//     );
//   }]).
//   run(['resourceService', '$http', function(resourceService, $http) {
//     resourceService.list({name: 'list.json'}); // <= intercepted
//     $http.get('list.json'); // <= not intercepted
//   }]);

