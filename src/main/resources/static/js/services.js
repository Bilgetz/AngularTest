/**
 * 
 */

angularApp.factory('PostFactory', ['$http','$q','SpringDataRestAdapter' ,PostFactory ]);

function PostFactory($http, $q, SpringDataRestAdapter) {
	var factory = {
		posts : false,
		find : function(page, limit, criterias,subToLoad) {
			var deferred = $q.defer();
			var search='';
			for (var i = 0, l = criterias.length; i < l; i++) {
				search+= criterias[i].field.id + criterias[i].operation.id + criterias[i].value.id + ',' 
			}
			var url = 'posts/search/findByCriteria?page='+ (page -1) + '&size=' +limit;
			if(criterias.length > 0 ) {
				url += '&search=' + search;
			}
			
			var httpPromise = $http.get(url);
			SpringDataRestAdapter.process(httpPromise, subToLoad).then(function (processedResponse) {
				var posts = processedResponse._embeddedItems != undefined ? processedResponse._embeddedItems : [];
				processedResponse.page.number++;
				for (var i = 0, l=posts.length; i < l; i++) {
					if(posts[i].comments != undefined && posts[i].comments._embeddedItems != undefined) {
						posts[i].comments = posts[i].comments._embeddedItems ;
					}
					if(posts[i].category != undefined && posts[i].category._embeddedItems != undefined) {
						posts[i].category = posts[i].category._embeddedItems ;
					}
				}
				factory.posts = posts;
				deferred.resolve({
					posts :processedResponse._embeddedItems,
					page : processedResponse.page
				});
	        },function(response, status) {
	        	var responseText = response != undefined ? response.statusText : 'no response';
				deferred.reject('error on loading' + responseText);
			});
			
			return deferred.promise;
		},
		get : function(id, subToLoad) {
			var deferred = $q.defer();
			var httpPromise = $http.get('posts/' +id);
			SpringDataRestAdapter.process(httpPromise, subToLoad).then(function (processedResponse) {
				var post = processedResponse;
				if(post.comments != undefined && post.comments._embeddedItems != undefined) {
					post.comments = post.comments._embeddedItems ;
				}
				if(post.category != undefined && post.category._embeddedItems != undefined) {
					post.category = post.category._embeddedItems ;
				}
				deferred.resolve(post);
	        },function(response, status) {
	        	var responseText = response != undefined ? response.statusText : 'no response';
				deferred.reject('error on loading' + responseText);
			});
			
			
			return deferred.promise;
		}
	};
	
	//var fact2 = angular.copy(factory);
	return factory;

}

angularApp.factory('CommentFactory', ['$http','$q','SpringDataRestAdapter' ,CommentFactory ]);

function CommentFactory($http, $q, SpringDataRestAdapter) {
	var factory = {
		add : function (newComment,post) {
			var deferred = $q.defer();
			
			newComment.post = post._links.self.href;
			
			var data = angular.toJson(newComment);
			
			$http.post('comments/', data).then(function(response) {
				deferred.resolve(response);
			}, function (response) {
				var result;
				if(response != undefined && response.data != undefined && response.data.errors != undefined) {
					result = response.data.errors;
				} else  {
					var responseText = response != undefined ? response.statusText : 'no response';
					result = [{property: 'Cannot save ' , message:  responseText }];
				}
				deferred.reject(result );
			});
			return deferred.promise;
		},
		edit : function (comment) {
			var deferred = $q.defer();
			var data = angular.toJson(comment);
			$http.put('comments/' + comment.id, data).then(function(response) {
				deferred.resolve(response);
			}, function (response) {
				var result;
				if(response != undefined &&  response.data != undefined && response.data.errors != undefined) {
					result = response.data.errors;
				} else  {
					var responseText = response != undefined ? response.statusText : 'no response';
					result = [{property: 'Cannot save ' , message:  responseText }];
				}
				deferred.reject(result);
			});
			return deferred.promise;
		},
		deleteEntity: function (comment) {
			var deferred = $q.defer();
			$http.delete('comments/' + comment.id).then(function(response) {
				deferred.resolve(response);
			}, function (response) {
				var result;
				if(response != undefined && response.data != undefined && response.data.errors != undefined) {
					result = response.data.errors;
				} else  {
					var responseText = response != undefined ? response.statusText : 'no response';
					result = [{property: 'Cannot delete ' , message:  responseText }];
				}
				deferred.reject(result);
			});
			return deferred.promise;
		}
	};
	
	//var fact2 = angular.copy(factory);
	return factory;
}


angularApp.factory('CategoryFactory', ['$http','$q','SpringDataRestAdapter' ,CategoryFactory ]);

function CategoryFactory($http, $q, SpringDataRestAdapter) {
	var factory = {
			find : function(page, limit, criterias) {
				var deferred = $q.defer();
				var httpPromise = $http.get('categories/?size=99');
				SpringDataRestAdapter.process(httpPromise).then(function (processedResponse) {
					deferred.resolve({
						categories :processedResponse._embeddedItems,
						page : processedResponse.page
					});
		        },function(response, status) {
		        	var responseText = response != undefined ? response.statusText : 'no response';
					deferred.reject('error on loading' + responseText);
				});
				
				return deferred.promise;
			}
	}
	return factory;
}

angularApp.factory('LocaleFactory', ['$http','$q',LocaleFactory ]);

function LocaleFactory($http, $q, SpringDataRestAdapter) {
	var factory = {
			find : function(page, limit, criterias) {
				var deferred = $q.defer();
				var httpPromise = $http.get('locales').then(function(response) {
					deferred.resolve(response.data);
				}, function(response, status) {
					var responseText = (response != undefined ? response.statusText : 'no response');
					deferred.reject('error on loading' + responseText);
				});
				return deferred.promise;
			},
			getCurrent : function() {
				var deferred = $q.defer();
				var httpPromise = $http.get('locale').then(function(response) {
					deferred.resolve(response.data);
				}, function(response, status) {
					var responseText = (response != undefined ? response.statusText : 'no response');
					deferred.reject('error on loading' + responseText);
				});
				return deferred.promise;
			}, change: function (locale) {
				var deferred = $q.defer();
				var httpPromise = $http.get('locale?lang='+ locale).then(function(response) {
					deferred.resolve(response.data);
				}, function(response, status) {
					var responseText = (response != undefined ? response.statusText : 'no response');
					deferred.reject('error on loading' + responseText);
				});
				return deferred.promise;
			},
	}
	return factory;
}

