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


authModule.directive('ngHasAnyRole', ['ngIfDirective', '$auth','$rootScope',function(ngIfDirective, $auth,$rootScope) {
	var ngIf = ngIfDirective[0];

	  return {
	    transclude: ngIf.transclude,
	    priority: ngIf.priority,
	    terminal: ngIf.terminal,
	    restrict: ngIf.restrict,
	    scope:{},
	    link: function($scope, $element, $attr) {
	    	$scope.authenticated = $auth.authenticated;
	    	$rootScope.$on('loggedIn', function (event,user) {
	    		$scope.authenticated= true;
	        });
	    	$rootScope.$on('loggedOut', function () {
	    		$scope.authenticated= false;
	        });
	      $scope.checkAuthorities= function() {
	    	  return $auth.hasRole($attr['ngHasAnyRole']);
	      }
	      
	      $attr.ngIf = "authenticated && checkAuthorities()";
	      
	      ngIf.link.apply(ngIf, arguments);
	    }
	  };
}]);
authModule.directive('ngHasNotRole', ['ngIfDirective', '$auth','$rootScope',function(ngIfDirective, $auth,$rootScope) {
	var ngIf = ngIfDirective[0];
	
	return {
		transclude: ngIf.transclude,
		priority: ngIf.priority,
		terminal: ngIf.terminal,
		restrict: ngIf.restrict,
		scope:{},
		link: function($scope, $element, $attr) {
			$scope.authenticated = $auth.authenticated;
			$rootScope.$on('loggedIn', function (event,user) {
				$scope.authenticated= true;
			});
			$rootScope.$on('loggedOut', function () {
				$scope.authenticated= false;
			});
			$scope.checkAuthorities= function() {
				return $auth.hasRole($attr['ngHasNotRole']);
			}
			
			$attr.ngIf = "!(authenticated && checkAuthorities())";
			
			ngIf.link.apply(ngIf, arguments);
		}
	};
}]);
