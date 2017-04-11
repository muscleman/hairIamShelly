hiamsApp.controller('loginController', ['$scope', '$http', 'sessionService', 'resourceService', function ($scope, $http, sessionService, resourceService) {

	$scope.credentials = {email : '',
						  password : ''};

	$scope.error = '';

	// when submitting the add form, send the text to the node API
	$scope.login = function() {
		// $http.post('/api/authenticate', $scope.credentials)
		// 	.then(function(response) {
		// 		if (response.status === 200){
		// 		//console.log(response.data);
		// 		sessionService.setItem('hairiamshelly', response.data);
		// 		window.location.href = '/home';
		// 		}
		// 	})
		// 	.catch(function(response) {
		// 		$scope.error = response.data.message;
		// 		sessionService.removeItem('hairiamshelly');
		// 	});

		resourceService.list($scope.credentials).$promise
			.then(function(response) {
				if (response.status === 200){
				//console.log(response.data);
				sessionService.setItem('hairiamshelly', response.data);
				window.location.href = '/home';
				}
			})
			.catch(function(response) {
				$scope.error = response.data.message;
				sessionService.removeItem('hairiamshelly');
			});

	};

	$scope.register = function(){
		window.location.href = '/register';
	};

}]);