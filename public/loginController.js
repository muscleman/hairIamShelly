hiamsApp.controller('loginController', ['$scope', '$http', 'sessionService', function ($scope, $http, sessionService) {

	$scope.credentials = {email : '',
						  password : ''};

	// when submitting the add form, send the text to the node API
	$scope.login = function() {
		$http.post('/api/authenticate', $scope.credentials)
			.then(function(response) {
				if (response.status === 200){
				console.log(response.data);
				sessionService.setItem('hairiamshelly', response.data);
				window.location.href = '/home';
				}
			})
			.catch(function(response) {
				//console.log('Error: ' + response.data);
				sessionService.removeItem('hairiamshelly');
			});
	};
}]);