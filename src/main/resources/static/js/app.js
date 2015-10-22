/**
 * 
 */

var angularApp = angular.module('demoApp',['ngAnimate','ngRoute', 'ngResource','spring-data-rest','ui.bootstrap','ngSanitize','pascalprecht.translate']); 
angularApp.run(['$rootScope', 'LocaleFactory','$translate', function($rootScope, localeFactory,$translate) {
	$rootScope.page = {};
	$rootScope.alerts = [];
	$rootScope.locales= [];
	$rootScope.locale= "";
	$rootScope.authenticated = false;

	
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

angularApp.config(['$routeProvider', '$translateProvider','$httpProvider',function($routeProvider, 	$translateProvider,$httpProvider) {
	$routeProvider
		.when('/',{templateUrl: 'partials', controller : 'PostsCtrl'})
		.when('/comments/:id',{templateUrl: 'directives/comments.html', controller : 'CommentsCtrl'})
		.when('/login', {templateUrl : 'directives/login.html', controller : 'LoginCtrl'})
		.otherwise({redirectTo: '/'});
	
	$translateProvider.useUrlLoader('locales/current');
	//for spring security
	$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
}]);
