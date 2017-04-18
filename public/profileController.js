hiamsApp.controller('profileController', ['$http', 'clientsService', function ($http, clientsService) {

	var vm = this;
	this.clientProfile = 'my profile';
	// vm.client = {};
	this.today = function() {
		this.dt = new Date();
	};
	
	this.today();

	this.clear = function() {
		this.dt = null;
	};

	this.inlineOptions = {
		customClass: this.getDayClass,
		minDate: new Date(),
		showWeeks: true
	};

	this.dateOptions = {
		dateDisabled: this.disabled,
		formatYear: 'yy',
		maxDate: new Date(2020, 5, 22),
		minDate: new Date(),
		startingDay: 1
	};

	// Disable weekend selection
	this.disabled = function(data) {
		var date = data.date,
	  	mode = data.mode;
		return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
	};

	this.toggleMin = function() {
		this.inlineOptions.minDate = this.inlineOptions.minDate ? null : new Date();
		this.dateOptions.minDate = this.inlineOptions.minDate;
	};

	this.toggleMin();

	this.open1 = function() {
		this.popup1.opened = true;
	};

	this.setDate = function(year, month, day) {
		this.dt = new Date(year, month, day);
	};

	this.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	this.format = vm.formats[0];
	this.altInputFormats = ['M!/d!/yyyy'];

	this.popup1 = {
		opened: false
	};

	this.popup2 = {
		opened: false
	};

	var tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	var afterTomorrow = new Date();
	afterTomorrow.setDate(tomorrow.getDate() + 1);
	this.events = [
	{
	  date: tomorrow,
	  status: 'full'
	},
	{
	  date: afterTomorrow,
	  status: 'partially'
	}
	];

	this.getDayClass = function (data) {
		var date = data.date,
	  	mode = data.mode;
		if (mode === 'day') {
	  		var dayToCheck = new Date(date).setHours(0,0,0,0);

		  	for (var i = 0; i < this.events.length; i++) {
		    	var currentDay = new Date(this.events[i].date).setHours(0,0,0,0);

			    if (dayToCheck === currentDay) {
			    	return this.events[i].status;
			    }
			}
		}
		return '';
	};

	// this.refresh = function(){
	// 	//clientsService.query().$promise.then(function(response){
	// 	clientsService.get().$promise.then(function(response){
	// 		// console.log(response);
	// 		//if(response.status === 200 && angular.isDefined(response.data))
	// 		//{
	// 			vm.client = response;
	// 		//}	
	// 	})
	// 	.catch(function(response){
	// 		console.log('Error: ' + response.data);
	// 	});
	// };


	this.getLocation = function(val) {
    	return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
			params: {
			address: val,
			 sensor: false
			}
    	}).then(function(response){
      		return response.data.results.map(function(item){
      			//console.log(item.address_components);
      			 //vm.address_component = item.address_components;
      			 //vm.client.city = item.address_components[2].long_name;
       			 return item.formatted_address;
      			});
    		});
  	};

	vm.modelOptions = {
		debounce: {
  			default: 500,
	  		blur: 250
		},
		getterSetter: true
	};


	// // when submitting the add form, send the text to the node API
	// vm.addClient = function() {
	// 	clientsService.addClient(vm.client).then(function(response){
	// 		vm.client = {};	
	// 		vm.client = response.data;
	// 	})
	// 	.catch(function(response){
	// 		console.log('Error: ' + response);
	// 	});
	// };

	this.updateClient = function() {
		// console.log(vm.client);
		clientsService.update(vm.client).$promise.then(function(response){
			//vm.client = {};	
			//vm.client = response.data;
		})
		.catch(function(response){
			console.log('Error: ' + response);
		});
	};

	// // delete a todo after checking it
	// vm.deleteClient= function(id) {
	// 	clientsService.deleteClient().then(function(response){
	// 		vm.client = {};	
	// 	})
	// 	.catch(function(response){
	// 		console.log('Error: ' + response);
	// 	});
	// };


}]);


