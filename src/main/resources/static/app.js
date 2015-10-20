/**
 * 
 */

var angularApp = angular.module('demoApp',['ngRoute', 'ngResource','spring-data-rest','ui.bootstrap','ngSanitize']); 
angularApp.run(['$rootScope', function($rootScope) {
	$rootScope.page = {};
	$rootScope.alerts = [];
	
	$rootScope.addAlert = function(alert) {
		$rootScope.alerts.push(alert);
	  };

	  $rootScope.closeAlert = function(index) {
		  $rootScope.alerts.splice(index, 1);
	  };
	
	  $rootScope.generateErrorList = function(errors) {
		  var status='', properties=[];
			for (var i = 0, l=errors.length; i < l; i++) {
				status+= errors[i].property;
				status+= ":";
				status+= errors[i].message;
				status+= "<br />";
				/*
				 * errors[i].entity
				 * errors[i].message
				 * errors[i].invalidValue
				 * errors[i].property
				 */
				properties.push(errors[i].property);
			}
		  
		  return {
			  status:status,
			  properties:properties 
		  };
	};
	
}]);

angularApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/',{templateUrl: 'partials', controller : 'PostsCtrl'})
		.when('/comments/:id',{templateUrl: 'partials/comments', controller : 'CommentsCtrl'})
		.otherwise({redirectTo: '/'});
}]);
