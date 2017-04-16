hiamsApp.controller('clientsController', ['$scope', 'client', function ($scope, client) {


	$scope.clientProfile = 'client profile';
	$scope.stylistOnly = 'for stylist use only';
	$scope.clientHistory = 'client history';
	$scope.client = {};

	$scope.refresh = function(){

		client.list().$promise.then(function(response){
			if(angular.isArray(response.data) && angular.isDefined(response.data[0]))
			{
				$scope.client = response.data[0];
			}	
		})
		.catch(function(response){
			console.log('Error: ' + response);
		});

		// clientsService.readClients().then(function(response){
		// 	if(angular.isArray(response.data) && angular.isDefined(response.data[0]))
		// 	{
		// 		$scope.client = response.data[0];
		// 	}	
		// })
		// .catch(function(response){
		// 	console.log('Error: ' + response);
		// });
	};

	// when submitting the add form, send the text to the node API
	$scope.addClient = function() {
		// clientsService.addClient($scope.client).then(function(response){
		// 	$scope.client = {};	
		// 	$scope.client = response.data;
		// })
		// .catch(function(response){
		// 	console.log('Error: ' + response);
		// });

		client.save($scope.client).$promise.then(function(response){
			$scope.client = {};	
			$scope.client = response;
		})
		.catch(function(response){
			console.log('Error: ' + response);
		});
	};

	$scope.updateClient = function() {
		// clientsService.updateClient($scope.client).then(function(response){
		// 	$scope.client = {};	
		// 	$scope.client = response.data;
		// })
		// .catch(function(response){
		// 	console.log('Error: ' + response);
		// });

		client.update($scope.client).$promise.then(function(response){
			$scope.client = {};	
			$scope.client = response.data;
		})
		.catch(function(response){
			console.log('Error: ' + response);
		});
	};

	// delete a todo after checking it
	$scope.deleteClient= function(id) {
		// clientsService.deleteClient().then(function(response){
		// 	$scope.client = {};	
		// })
		// .catch(function(response){
		// 	console.log('Error: ' + response);
		// });

		client.delete().$promise.then(function(response){
			$scope.client = {};	
		})
		.catch(function(response){
			console.log('Error: ' + response);
		});

	};


}]);


