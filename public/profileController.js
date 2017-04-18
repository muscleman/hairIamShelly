hiamsApp.controller('profileController', ['$http', 'clientsService', '_', function ($http, clientsService, _) {

	var vm = this;

	this.clientProfile = 'my profile';
	this.today = function() {
		this.dob = new Date();
	};

	
	this.today();

	this.clear = function() {
		this.dob = null;
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

	// this.setDate = function(year, month, day) {
	// 	this.dob = new Date(year, month, day);
	// };

	this.setDate = function(year, month, day) {
		this.dob = new Date(vm.client.dob);
	};

	this.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	this.format = vm.formats[0];
	this.altInputFormats = ['M!/d!/yyyy'];

	this.popup1 = {
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

	this.getLocation = function(val) {
    	return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
			params: {
			address: val,
			 sensor: false
			}
    	}).then(function(response){
      		return response.data.results.map(function(item){
      			var result = _.find(item.address_components, function(address){
      				return typeof _.find(address.types, function(a){
      					return a === 'locality';
      				}) === 'string';
      			});

      			vm.client.city = result.long_name;

      			result = _.find(item.address_components, function(address){
      				return typeof _.find(address.types, function(a){
      					return a === 'administrative_area_level_1';
      				}) === 'string';
      			});
      			vm.client.state = result.short_name;

      			result = _.find(item.address_components, function(address){
      				return typeof _.find(address.types, function(a){
      					return a === 'postal_code';
      				}) === 'string';
      			});
      			vm.client.zip = result.long_name;

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


	this.updateClient = function() {
		vm.client.dob = this.dob;
		clientsService.update(vm.client).$promise.then(function(response){
			//vm.client = {};	
			//vm.client = response.data;
		})
		.catch(function(response){
			console.log('Error: ' + response);
		});
	};

}]);


