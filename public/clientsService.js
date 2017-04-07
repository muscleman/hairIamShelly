hiamsApp.service('clientsService', ['$http', function ($http) {
	
	var addClient = function(client){
		return $http.post('/api/addClient', client);
	};

	var updateClient = function(client){
		return $http.post('/api/updateClient', client);
	};

	var readClient = function(){
		return $http.get('/api/readClient');
	};

	var readClients = function(){
		
		return $http.get('/api/readClients');
	};

	var deleteClient = function(){
		return $http.post('/api/deleteClient');
	};


	return {
		addClient : addClient,
		readClient : readClient,
		readClients : readClients,
		deleteClient : deleteClient,
		updateClient : updateClient
	};
}]);