/**
 * 
 */

var angularApp = angular.module('demoApp',['ngRoute', 'ngResource','spring-data-rest','ui.bootstrap','ngSanitize','pascalprecht.translate']); 
angularApp.run(['$rootScope', 'LocaleFactory','$translate', function($rootScope, localeFactory,$translate) {
	$rootScope.page = {};
	$rootScope.alerts = [];
	$rootScope.locales= [];
	$rootScope.locale= "";
	

	
	localeFactory.find().then(function(locales) {
		$rootScope.locales = locales;
	}, function(result) {
		alert(result);
	});
	
	localeFactory.getCurrent().then(function(current) {
		$rootScope.locale = current;
		$translate.use($rootScope.locale);
	}, function(result) {
		alert(result);
	});
	
	$rootScope.toggled = function(open) {
		//alert(open);
	}
	$rootScope.setLocale = function (locale) {
		localeFactory.change(locale).then(function(current) {
			$rootScope.locale = current;
			$translate.use($rootScope.locale);
		}, function(result) {
			alert(result);
		});
	}
	
	
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

angularApp.config(['$routeProvider', '$translateProvider',function($routeProvider, 	$translateProvider) {
	$routeProvider
		.when('/',{templateUrl: 'partials', controller : 'PostsCtrl'})
		.when('/comments/:id',{templateUrl: 'directives/comments.html', controller : 'CommentsCtrl'})
		.otherwise({redirectTo: '/'});
	
	$translateProvider.useUrlLoader('locales/current');
}]);
