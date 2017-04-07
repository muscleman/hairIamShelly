hiamsApp.controller('profileController', ['$scope', '$http', 'clientsService', function ($scope, $http, clientsService) {


	$scope.clientProfile = 'my profile';
	$scope.client = {};
	$scope.today = function() {
		$scope.dt = new Date();
	};
	
	$scope.today();

	$scope.clear = function() {
		$scope.dt = null;
	};

	$scope.inlineOptions = {
		customClass: getDayClass,
		minDate: new Date(),
		showWeeks: true
	};

	$scope.dateOptions = {
		dateDisabled: disabled,
		formatYear: 'yy',
		maxDate: new Date(2020, 5, 22),
		minDate: new Date(),
		startingDay: 1
	};

	// Disable weekend selection
	function disabled(data) {
		var date = data.date,
	  	mode = data.mode;
		return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
	}

	$scope.toggleMin = function() {
		$scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
		$scope.dateOptions.minDate = $scope.inlineOptions.minDate;
	};

	$scope.toggleMin();

	$scope.open1 = function() {
		$scope.popup1.opened = true;
	};

	$scope.setDate = function(year, month, day) {
		$scope.dt = new Date(year, month, day);
	};

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];
	$scope.altInputFormats = ['M!/d!/yyyy'];

	$scope.popup1 = {
		opened: false
	};

	$scope.popup2 = {
		opened: false
	};

	var tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	var afterTomorrow = new Date();
	afterTomorrow.setDate(tomorrow.getDate() + 1);
	$scope.events = [
	{
	  date: tomorrow,
	  status: 'full'
	},
	{
	  date: afterTomorrow,
	  status: 'partially'
	}
	];

	function getDayClass(data) {
		var date = data.date,
	  	mode = data.mode;
		if (mode === 'day') {
	  		var dayToCheck = new Date(date).setHours(0,0,0,0);

		  	for (var i = 0; i < $scope.events.length; i++) {
		    	var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

			    if (dayToCheck === currentDay) {
			    	return $scope.events[i].status;
			    }
			}
		}
		return '';
	}

	$scope.refresh = function(){
		clientsService.readClient().then(function(response){
			if(angular.isDefined(response.data))
			{
				$scope.client = response.data;
			}	
		})
		.catch(function(response){
			console.log('Error: ' + response);
		});
	};

// var address = '11099 County Rd 657';

// $scope.getLocation = function(val) {
//     	return $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + 
//             address + '&key=AIzaSyBZVOSPh0Z4mv9jljJWzZNSug6upuec7Sg'
//     	).then(function(response){
//       		return response.data.results.map(function(item){
//        			 return item.formatted_address;
//       			});
//     		});
//   };

	$scope.getLocation = function(val) {
    	return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
			params: {
			address: val,
			 sensor: false
			}
    	}).then(function(response){
      		return response.data.results.map(function(item){
       			 return item.formatted_address;
      			});
    		});
  };

  $scope.modelOptions = {
    debounce: {
      default: 500,
      blur: 250
    },
    getterSetter: true
  };


	// // when submitting the add form, send the text to the node API
	// $scope.addClient = function() {
	// 	clientsService.addClient($scope.client).then(function(response){
	// 		$scope.client = {};	
	// 		$scope.client = response.data;
	// 	})
	// 	.catch(function(response){
	// 		console.log('Error: ' + response);
	// 	});
	// };

	$scope.updateClient = function() {
		clientsService.updateClient($scope.client).then(function(response){
			$scope.client = {};	
			$scope.client = response.data;
		})
		.catch(function(response){
			console.log('Error: ' + response);
		});
	};

	// // delete a todo after checking it
	// $scope.deleteClient= function(id) {
	// 	clientsService.deleteClient().then(function(response){
	// 		$scope.client = {};	
	// 	})
	// 	.catch(function(response){
	// 		console.log('Error: ' + response);
	// 	});
	// };


}]);

