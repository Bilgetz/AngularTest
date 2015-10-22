/**
 * 
 */

authModule.factory('$auth', ['$q','$http','$rootScope',function($q,$http,$rootScope) {
	var auth = {
		authenticated : false,
		loginPath:'/login',
		logoutPath:'/logout',
		homePath:'/',
		user:{},
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
			
			var httpPromise = $http.get('user', config).then(function(response) {
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
		}
	}
	return auth;
}]);