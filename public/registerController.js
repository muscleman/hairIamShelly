hiamsApp.controller('registerController', ['$scope', '$http', 'sessionService', function ($scope, $http, sessionService) {

	$scope.credentials = {firstName : '',
						  lastName : '', 
						  email : '',
						  password : ''};

	$scope.error = '';

	// when submitting the add form, send the text to the node API
	$scope.register = function() {
		$http.post('/api/register', $scope.credentials)
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
}]);