/**
 * 
 */

authModule.factory('$auth', ['$q','$http','$rootScope','$uibModal',function($q,$http,$rootScope,$uibModal) {
	var auth = {
		authenticated : false,
		loginPath:'/login',
		logoutPath:'/logout',
		homePath:'/',
		user:{},
		modalTitle:'title',
	  	modalUsername:'name',
	  	modalPassword:'password',
	  	modalOk:'ok',
	  	modalCancel:'cancel',
	  	modalErrorMessage : 'error',
		init : function(homePath, loginPath, logoutPath) {
			auth.homePath = homePath;
			auth.loginPath = loginPath;
			auth.logoutPath = logoutPath;
		},
		clear: function() {
			auth.authenticated = false;
			//do the logout
		},
		login: function(credentials) {
			var deferred = $q.defer();
			
			var config = credentials ? { headers  : {authorization : "Basic "
		        + btoa(credentials.username + ":" + credentials.password)
			}} : {};
			
			var httpPromise = $http.get('login', config).then(function(response) {
				auth.user = response.data;
				auth.authenticated = true;
				$rootScope.$broadcast('loggedIn',auth.user);
				deferred.resolve(auth.user);
			}, function(response) {
				var result;
				if(response.data != undefined && response.data.errors != undefined) {
					result = response.data.errors;
				} else  {
					result = [{property: 'Cannot connect ' , message:  response.statusText }];
				}
				deferred.reject(result);
			});
			
			return deferred.promise;
		},
		logout : function() {
			var deferred = $q.defer();
			$http.post('logout', {}).then(function(response) {
				auth.authenticated = false;
				$rootScope.$broadcast('loggedOut');
				deferred.resolve(response);
			}, function (response) {
				var result;
				auth.authenticated = false;
				if(response.data != undefined && response.data.errors != undefined) {
					result = response.data.errors;
				} else  {
					result = [{property: 'Cannot logout ' , message:  response.statusText }];
				}
				$rootScope.$broadcast('loggedOut');
				deferred.reject(result);
			});
			return deferred.promise;
		},
		showModalLogin : function() {
			
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
				    			title: auth.modalTitle,
				    		  	username: auth.modalUsername,
				    		  	password: auth.modalPassword,
				    		  	ok: auth.modalOk,
				    		  	cancel: auth.modalCancel,
				    		  	error: auth.modalErrorMessage
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
		}
	}
	return auth;
}]);


