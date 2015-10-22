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
		}, controller : ['$scope','$auth','$uibModal','$rootScope',function($scope, $auth,$uibModal,$rootScope) {
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
			
			//function for show the modal.
			var showModal = function(haveError) {
				var modalInstance = $uibModal.open({
				      animation: false,
				      templateUrl: 'directives/modules/login.html',
				      controller: 'AuthLoginModalCtrl',
				      size: '',
				      resolve: {
				    	  modalMessage: function () {
				    		  var message = {
				    			title: $scope.modalTitle,
				    		  	username: $scope.modalUsername,
				    		  	password: $scope.modalPassword,
				    		  	ok: $scope.modalOk,
				    		  	cancel: $scope.modalCancel,
				    		  	error: $scope.modalErrorMessage
				    		  }
				            return message;
				          },
				          logInError : function() {
							return haveError;
						}
				      }
				    });
				return modalInstance;
			}
			
			
			
			$scope.login = function() {
				
				var modalInstance = showModal(false);
				
				modalInstance.result.then(function(credentials) {
					$auth.login(credentials).then(function(user) {
						//on est deja inscrit a l'event.
					}, function() {
						showModal(true);
					});
				}, function() {
					//cancel modal
				});
			};
			$scope.logout = function() {
				$auth.logout();
			};
		}]
	}
}]);
