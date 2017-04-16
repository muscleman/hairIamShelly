var hiamsApp = angular.module('hiamsApp', ['ui.router', 
											'ui.bootstrap', 
											'ngResource'
											]);



hiamsApp.factory('sessionInjector', ['sessionService', function(sessionService) {  
    var sessionInjector = {
        request: function(config) {
        	if (config.url != '//maps.googleapis.com/maps/api/geocode/json'){
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


// hiamsApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){

// 	$httpProvider.interceptors.push('sessionInjector');
// 	//$httpProvider.interceptors.push('AuthHttpResponseInterceptor');

// 	$urlRouterProvider.otherwise('/login');
	
// 	$stateProvider
// 		.state('login', {
// 			url: '/login',
// 			templateUrl: 'login.html',
// 			controller: 'loginController'
// 		}).state('logout', {
// 			url: '/login',
// 			controller: function($scope, sessionService){
// 				sessionService.removeItem('hairiamshelly');
// 				//$route.reload();
// 			}
// 		}).state('register', {
// 			url: '/register',
// 			templateUrl: 'register.html',
// 			controller: 'registerController'
// 		}).state('home',{
// 			url: '/home',
// 			templateUrl: 'home.html'
// 		}).state('profile', {
// 			url: '/profile',
// 			templateUrl: 'profile.html',
// 			controller: 'profileController'
// 		}).state('appointments', {
// 			url: '/appointments',
// 			templateUrl: 'appointments.html',
// 			controller: 'appointmentsController'
// 		}).state('clients', {
// 			url: '/clients',
// 			templateUrl: 'clients.html',
// 			controller: 'clientsController'
// 		}).state('clients.client', {
// 			url: '/{clientId}',
// 			component : 'client'
// 			// templateUrl: 'clients.html',
// 			// controller: 'clientsController'
// 		});


	
// 	$locationProvider.html5Mode(true);
// }]);


hiamsApp.component('myclients', {
	bindings: {allClients: '<'},
	template: '<h4>myclients</h4>'
	// template: '<ul>' +
	// 		  '	<li ng-repeat="person in $ctrl.allClients">' +
	// 		  ' 	<a ui-sref="person({clientId: person._id})">' +
	// 		  '			{{person.firstName}}' +
	// 		  '		</a>' +
	// 		  '	</li>' +
	// 		  '</ul>',	
});

hiamsApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){

	$httpProvider.interceptors.push('sessionInjector');
	//$httpProvider.interceptors.push('AuthHttpResponseInterceptor');

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
		}).state('profile', {
			url: '/profile',
			templateUrl: 'profile.html',
			controller: 'profileController'
		}).state('appointments', {
			url: '/appointments',
			templateUrl: 'appointments.html',
			controller: 'appointmentsController'
		}).state('clients', {
			abstract: true,
			url: '/clients',
			templateUrl: 'clients.html',
		}).state('clients.list', {
			url: '/list',
			component: 'myclients',
			resolve: {
				allClients : function(clientsService) {
					return clientsService.list().$promise;
				}
			},
		});
		// .state('clients.detail', {
		// 	url: '/detail',
		// 	//template: '<ui-view/>',
		// });


	
	$locationProvider.html5Mode(true);
}]);


// hiamsApp.component('client', {
// 	template: '',
// 	controller: 'clientsController',
// });
