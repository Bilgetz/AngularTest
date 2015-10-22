/**
 * 
 */

var authModule = angular.module('auth', ['ngAnimate','ui.bootstrap']);


authModule.config(['$httpProvider',function($httpProvider) {
	$httpProvider.interceptors.push('authInterceptor');
}]);

