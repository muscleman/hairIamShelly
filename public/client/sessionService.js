hiamsApp.factory('sessionService', ['$window', function($window){
	var localStorage = $window.localStorage;

	var sessionService = {
		getItem: function(key){
			return angular.fromJson(localStorage.getItem(key));
		},
		setItem: function(key, value){
			return localStorage.setItem(key, angular.toJson(value));
		},
		removeItem: function(key){
			return localStorage.removeItem(key);
		},
		isAnonymous: false
	};
	return sessionService;
}]);