var hiamsApp = angular.module('hiamsApp', ['ui.router', 
											'ui.bootstrap', 
											'ngResource',
											// 'ngAnimate'
											]);


hiamsApp.constant('_', _);

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


// hiamsApp.component('clients', {
// 	//bindings: {allClients: '<'},
// 	// template: '<ul>' +
// 	// 		  '	<li ng-repeat="client in clientsController.allClients>' +
// 	// 		  ' 	<a ui-sref="client({clientId: client._id})">' +
// 	// 		  '			{{client.firstName}}' +
// 	// 		  '		</a>' +
// 	// 		  '	</li>' +
// 	// 		  '</ul>',	
// 	template: '<div>' +
// 			  '<h4>In Component</h4>' +
// 			  '<ul>' +
// 			  '	<li ng-repeat="client in allClients">' +
// 			  '			{{client.firstName}}' +
// 			  '	</li>' +
// 			  '</ul>' +
// 			  '</div>',	
// 	// resolve: {
// 	// 			clientsService : 'clientsService',
// 	// 			allClients : function(clientsService) {

// 	// 				// var d = clientsService.query().$promise;
//  //     //                    d.then(function(r){
//  //     //                        console.log(r.data[0]);
//  //     //                        return r.data[0];
//  //     //                    });
// 	// 				return clientsService.query().$promise;
// 	// 			}
// 	// 		}
	
// 	controller: function($scope, clientsService){
// 		clientsService.query().$promise.then(function(response){
// 			$scope.allClients = response.data;
// 		});
// 	}
// });




hiamsApp.component('clients', {
	bindings: {clients: '<'},
	template: '<div class="flex-h">' +
			  '    <div class="clients">' +
			  '        <h4>Some Clients:</h4>' +
			  '        <ul>' +
			  '	           <li ng-repeat="client in $ctrl.clients">' +
			  '                <a ui-sref-active="active" ui-sref=".client({ clientId: client._id })">' +
              '                    {{client.firstName}}' +
              '                </a>' +
			  '	           </li>' +
			  '        </ul>' +
			  '    </div>' +
			  '    <ui-view class="view-side-form"></ui-view>' +
              '</div>',	
});

hiamsApp.component('client', {
	bindings: {client: '<'},
	template: '<h3>A client!</h3>' +
  
            '<div>Name: {{$ctrl.client.firstName}}</div>' +
            '<div>Id: {{$ctrl.client._id}}</div>' +
            '<div>Email: {{$ctrl.client.email}}</div>' +
            '<div>Address: {{$ctrl.client.address}}</div>',
});


hiamsApp.component('login',{
	templateUrl: 'login.html',
	controller: 'loginController'
});

hiamsApp.component('logout', {
	controller: function($state, sessionService){
				sessionService.removeItem('hairiamshelly');
				$state.transitionTo('login', null);
			}
});

hiamsApp.component('register',{
	templateUrl: 'register.html',
	controller: 'registerController'
});

hiamsApp.component('profile',{
	bindings: {client: '='},
	scope: {},
	templateUrl: 'profile.html',
	controller: 'profileController',
});

hiamsApp.component('appointments',{
	templateUrl: 'appointments.html',
	controller: 'appointmentsController'
});


hiamsApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){

	$httpProvider.interceptors.push('sessionInjector');
	//$httpProvider.interceptors.push('AuthHttpResponseInterceptor');

	$urlRouterProvider.otherwise('/login');
	
	$stateProvider
		.state('login', {
			url: '/login',
			component: 'login'
			// templateUrl: 'login.html',
			// controller: 'loginController'
		}).state('logout', {
			url: '/logout',
			component: 'logout',
			// controller: function($scope, sessionService){
			// 	sessionService.removeItem('hairiamshelly');
			// }
		}).state('register', {
			url: '/register',
			component: 'register'
			// templateUrl: 'register.html',
			// controller: 'registerController'
		}).state('home',{
			url: '/home',
			templateUrl: 'home.html'
		}).state('profile', {
			url: '/profile',
			component: 'profile',
			resolve: {
				client : function($q, $state, clientsService){
					return clientsService.get().$promise;
				}
			}
			// templateUrl: 'profile.html',
			// controller: 'profileController'
		}).state('appointments', {
			url: '/appointments',
			component: 'appointments'
			// templateUrl: 'appointments.html',
			// controller: 'appointmentsController'
		}).state('clients', {
			url: '/clients',
			component: 'clients',
			resolve: {
				        clients : function(clientsService) {
				            return clientsService.query().$promise.then(function(response){
				            	return response.data;
				            });
				        }

				    }
		}).state('clients.client', {
			url: '/{clientId}',
			component: 'client',
				resolve: {
						client : function(clients, $stateParams, _){
							return _.find(clients, function(client){
								return client._id === $stateParams.clientId;
							});
						}
				}
		});

	
	$locationProvider.html5Mode(true);
}]);
