hiamsApp.controller('clientsController', ['$scope', '$http', 'clientsService', function ($scope, $http, clientsService) {


	$scope.clientProfile = 'client profile';
	$scope.stylistOnly = 'for stylist use only';
	$scope.clientHistory = 'client history';
	$scope.client = {};

	$scope.refresh = function(){
		clientsService.readClients().then(function(response){
			if(angular.isArray(response.data) && angular.isDefined(response.data[0]))
			{
				$scope.client = response.data[0];
			}	
		})
		.catch(function(response){
			console.log('Error: ' + response);
		});
	};

	// when submitting the add form, send the text to the node API
	$scope.addClient = function() {
		// $http.post('/api/clients', $scope.client)
		// 	.then(function(response) {
		// 		$scope.client = {}; // clear the form so our user is ready to enter another
		// 		$scope.client = response.data;
		// 		console.log(response.data);
		// 	})
		// 	.catch(function(response) {
		// 		console.log('Error: ' + response.data);
		// 	});
		clientsService.addClient($scope.client).then(function(response){
			$scope.client = {};	
			$scope.client = response.data;
		})
		.catch(function(response){
			console.log('Error: ' + response);
		});
	};

	$scope.updateClient = function() {
		clientsService.updateClient($scope.client).then(function(response){
			$scope.client = {};	
			$scope.client = response.data;
		})
		.catch(function(response){
			console.log('Error: ' + response);
		});
	};

	// delete a todo after checking it
	$scope.deleteClient= function(id) {
		// $http.delete('/api/clients/' + id)
		// 	.then(function(response) {
		// 		$scope.client = response.data;
		// 	})
		// 	.catch(function(response) {
		// 		console.log('Error: ' + response.data);
		// 	});

		clientsService.deleteClient().then(function(response){
			$scope.client = {};	
		})
		.catch(function(response){
			console.log('Error: ' + response);
		});
	};


}]);
