/**
 * 
 */

authModule.factory('$auth', ['$q','$http','$rootScope','$uibModal',function($q,$http,$rootScope,$uibModal) {
	var auth = {
		authenticated : false,
		loginPath:'user',
		logoutPath:'logout',
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
			
			var httpPromise = $http.get(auth.loginPath, config).then(function(response) {
				auth.user = response.data;
				auth.authenticated = true;
				$rootScope.$broadcast('loggedIn',auth.user);
				deferred.resolve(auth.user);
			}, function(response) {
				var result;
				auth.authenticated = false;
				$rootScope.$broadcast('loggedOut');
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
			$http.post(auth.logoutPath, {}).then(function(response) {
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
			var deferred = $q.defer();
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
				
				var deferred = $q.defer();
				
				modalInstance.result.then(function(credentials) {
					auth.login(credentials).then(function(user) {
						//on est deja inscrit a l'event. mais faut prevenir que le login est ok
						return deferred.resolve('close');
					}, function() {
						//login KO, ben on redemande
						return showModal(true);
					});
				}, function() {
					//cancel modal
					return deferred.reject('close');
				});
				
				return deferred.promise;
			}

			return showModal(false);
		}
	}
	return auth;
}]);

authModule.factory('authInterceptor', ['$q', '$injector',function($q,$injector) {
	  var interceptor = {
	    // optional method
	   'responseError': function(response) {
		   var $auth = $injector.get('$auth');
		   if(response.config.url != $auth.loginPath &&
				   response.config.url != $auth.logoutPath &&
				   response.status == 401 ) {
			   //si c'est un 401 ( acces non authorise)
			   // et que c'est pas un login ou un logout
			   
			   if(!$auth.authenticated) {
				   //si on n'est pas authentifie
				   return interceptor.getRelogPromise($auth,response);
			   } else {
				   //on devrait etre authentifier.
				   //ben verifions!
				   var deferred = $q.defer();
				   $auth.login().then(function() {
					   // on etais bien authentifier, c'est un probleme de droit.
					   return deferred.reject(response);
				   }, function() {
					   // en fin de compte, on etais pas autentifier ^^'
					   return deferred.resolve(interceptor.getRelogPromise($auth,response));
				   });
				   return deferred.promise;
			   }
			   
		   }
	      return $q.reject(response);
	    },
	  	getRelogPromise: function($auth,response) {
		   var deferred = $q.defer();
		   $auth.showModalLogin().then(function() {
			   //cool, on est log !
			   //on retente et hop !
			   var $http = $injector.get('$http');
			   return deferred.resolve($http(response.config)); 
		   }, function() {
			//utilisateur n'as pas voulu se log, on rejete donc la demande
			return deferred.reject(response);
		   });
		   return deferred.promise;
		}
	  };
	  return interceptor;
	}]);
