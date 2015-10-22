/**
 * 
 */

authModule.directive('ngAuthMenu', [function() {
	return {
		restrict : 'E',
		templateUrl: 'directives/modules/auth-menu.html',
		scope : {
			addedClass :'@',
			loginLinkMessage : '@',
			logoutLinkMessage: '@',
			modalTitle: '@',
			modalUsername: '@',
			modalPassword: '@',
			modalOk: '@',
			modalCancel: '@',
			modalErrorMessage: '@'
		}, controller : ['$scope','$auth','$rootScope',function($scope, $auth,$rootScope) {
			$scope.user={};
			$scope.authenticated= false;
			// event register
			$rootScope.$on('loggedIn', function (event,user) {
				$scope.user= user;
				$scope.authenticated= true;
	        });
			$rootScope.$on('loggedOut', function () {
				$scope.user= {};
				$scope.authenticated= false;
	        });
			
			// try get the user in case he already logged.
			$auth.login();
			
			$scope.login = function() {
				$auth.showModalLogin();
			};
			$scope.logout = function() {
				$auth.logout();
			};
		}]
	}
}]);
