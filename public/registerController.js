hiamsApp.controller('registerController', ['authenticationService', function (authenticationService) {

	this.credentials = {firstName : '',
						  lastName : '', 
						  email : '',
						  password : ''};

	this.error = '';

	// when submitting the add form, send the text to the node API
	this.register = function() {
		authenticationService.register(this.credentials).$promise
			.then(function(response) {
				if (response.status === 200){
					window.location.href = '/home';
				}
			})
			.catch(function(response) {
				this.error = response.data.message;
			});
	};
}]);