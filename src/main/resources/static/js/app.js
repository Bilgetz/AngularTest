/**
 * 
 */

if('serviceWorker' in navigator) {
	navigator.serviceWorker.register('service-worker.js').then(function(registration) {
		console.log('SW ok ^^' , registration.scope);
		
		// navigator.serviceWorker.addEventListener('message',
		// function(event){
			// un message venant du SW
		// console.log(event.data);
		// });
		// je post un message a mon SW
		// ca peut etre n'importe quel objet
		if(navigator.serviceWorker.controller != null) {
			// registration.active.postMessage({command: 'forceUpdate',
			// foobar: 42});
			console.log('SW actif');
		} else {
			console.log('SW pas actif');
		}
		
	}).catch(function(err){
		console.log('SW KO ><' , err);
	});
} else {
	console.log('pas de WS :/');
}


var angularApp = angular.module('demoApp',['ngAnimate','ngRoute', 'ngResource','spring-data-rest','ui.bootstrap','ngSanitize','pascalprecht.translate', 'auth']); 
angularApp.run(['$rootScope', 'LocaleFactory','$translate','$auth','DbCategoryFactory','DbPostFactory', 
                function($rootScope, localeFactory,$translate,$auth, DbCategoryFactory,DbPostFactory) {
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
	

	
	var onreadyTranslate = function() {
		$translate('message.login').then(function (translation) {
			$auth.modalTitle=translation;
		});
		$translate('message.username').then(function (translation) {
			$auth.modalUsername=translation;
		});
		$translate('message.password').then(function (translation) {
			$auth.modalPassword=translation;
		});
		$translate('message.login').then(function (translation) {
			$auth.modalOk=translation;
		});
		$translate('message.cancel').then(function (translation) {
			$auth.modalCancel=translation;
		});
		$translate('error.login').then(function (translation) {
			$auth.modalErrorMessage=translation;
		});
	};
	
	localeFactory.getCurrent().then(function(current) {
		$rootScope.locale = current;
		$translate.use($rootScope.locale);
		$translate.onReady(onreadyTranslate);
	}, function(result) {
		alert(result);
	});
	
	$rootScope.setLocale = function (locale) {
		localeFactory.change(locale).then(function(current) {
			$rootScope.locale = current;
			$translate.use($rootScope.locale);
			$translate.onReady(onreadyTranslate);
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
	
	$auth.initServiceWorker();
    
	if(window.SharedWorker) {
		var myWorker = new SharedWorker("js/shared_worker.js");
		myWorker.port.start();
		myWorker.port.onmessage = function(e) {
			if(e.data.command != undefined && e.data.command  == 'initOk') {
				DbPostFactory.init();
				DbCategoryFactory.init();
			} else if(e.data.command != undefined && e.data.command  == 'message') {
				$rootScope.$apply(function() {
					$rootScope.alerts.push(e.data.value);
				});
			} else {
				console.log('message from worker' + e.data);
			}
		}
	}

	
	
}]);

angularApp.config(['$routeProvider', '$translateProvider','$httpProvider',function($routeProvider, 	$translateProvider,$httpProvider) {
	$routeProvider
		.when('/',{templateUrl: 'directives/posts.html', controller : 'PostsCtrl'})
		.when('/comments/:id',{templateUrl: 'directives/comments.html', controller : 'CommentsCtrl'})
		.otherwise({redirectTo: '/'});
	
	$translateProvider.useUrlLoader('locales/current');
	//for spring security
	$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
}]);
