hiamsApp.controller('loginController', ['$scope', '$http', 'authenticationService', function ($scope, $http, authenticationService) {

	$scope.credentials = {email : '',
						  password : ''};

	$scope.error = '';

	// when submitting the add form, send the text to the node API
	$scope.login = function() {
		authenticationService.authenticate($scope.credentials).$promise
			.then(function(response) {
				if (response.status === 200){
				window.location.href = '/home';
				}
			})
			.catch(function(response) {
				$scope.error = response.data.message;
			});

	};

	$scope.register = function(){
		window.location.href = '/register';
	};

}]);