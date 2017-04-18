hiamsApp.controller('loginController', ['authenticationService', function (authenticationService) {

	this.credentials = {email : '',
						  password : ''};

	this.error = '';

	// when submitting the add form, send the text to the node API
	this.login = function() {
		authenticationService.authenticate(this.credentials).$promise
			.then(function(response) {
				if (response.status === 200){
				window.location.href = '/home';
				}
			})
			.catch(function(response) {
				this.error = response.data.message;
			});

	};

	this.register = function(){
		window.location.href = '/register';
	};

}]);