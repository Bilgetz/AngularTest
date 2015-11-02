/**
 * 
 */

var AngularTestDataBaseVersion = 1;


angularApp.factory('DbPostFactory', ['$q',DbPostFactory ]);

function DbPostFactory($q) {
	var factory = {
			db : null,
			find : function(page, limit, criterias,subToLoad) {
				var deferred = $q.defer();
				
				var transaction = factory.db.transaction('posts', 'readonly');
				var objectStore = transaction.objectStore('posts');
				var posts = [];
				var index= [];
				var indexValue= [];
				var filterOption = {
						state : '',
						note: '',
						category: '',
						name: '',
						content:''
				};
				for ( var i=0, l = criterias.length; i<l  ;i++) {
						filterOption[criterias[i].field.id] = criterias[i].value;
				}

				if(filterOption.state != '' && filterOption.category != '' ) {
					var myIndex = objectStore.index('stateAndCategorie');
					myIndex.openCursor(IDBKeyRange.only([filterOption.state.id,filterOption.category.id])).onsuccess = onsucessResult
				} else if(filterOption.state != ''){
					var myIndex = objectStore.index('state');
					myIndex.openCursor(IDBKeyRange.only(filterOption.state.id)).onsuccess = onsucessResult
				} else if(filterOption.category != '' ){
					var myIndex = objectStore.index('idCategory');
					myIndex.openCursor(IDBKeyRange.only(filterOption.category.id)).onsuccess = onsucessResult
				} else {
					objectStore.openCursor().onsuccess = onsucessResult;
				}
				
					function onsucessResult(event) {
					  var cursor = event.target.result;
					  if (cursor) {
						  // TODO do filter for note, name, content
						  posts.push(cursor.value);
						  cursor.continue();
					  }
					  else {
						  var count = posts.length;
						  var pageJson = {size: limit,
								  totalElements : count,
								  totalPages: (count/limit),
								  number:page};
						  var finalPosts = posts.slice((page-1)*limit, page*limit);
						  factory.getCategoryOfPosts(finalPosts).then(function(result) {
							  deferred.resolve({
								  posts : finalPosts,
									page : pageJson
								});
						  }, function(error) {
							  deferred.reject(error);
						  });
						  
						  
					  }
					};
				
				return deferred.promise;
			},
			getCategoryOfPosts : function(posts) {
				var i=-1;
				var l = posts.length;
				
				if(l == 0) {
					return 0;
				}
				
				function resolvePost() {
					i++;
					if(i>=l) {
						return i;
					} else {
						var deferred = $q.defer();
						factory.getCategoryOfPost(posts[i]).then(function() {
							deferred.resolve(resolvePost());
						}, function(error) {
							deferred.reject(error);
						});
						return deferred.promise;
					}
				};
				
				return resolvePost();
			},
			getCategoryOfPost : function(post) {
				var deferred = $q.defer();
				
				var transaction = factory.db.transaction('categories', 'readonly');
				var objectStore = transaction.objectStore('categories');
				var getCategrory = objectStore.get(post.idCategory);
				getCategrory.onsuccess = function(event) {
					post.category = event.target.result;
					deferred.resolve(post.category);
				}
				getCategrory.onerror = function(event) {
					deferred.reject("error get category " + post.idCategory);
				}
				
				
				return deferred.promise;
			},
			isAvaible: function() {
				return (factory.db != null);
			},
			init: function() {
				if(window.indexedDB != undefined) {
					var request = window.indexedDB.open("AngularTestDatabase", AngularTestDataBaseVersion);
					request.onerror = function(event) {
						 console.log('error on database', request.errorCode);
					};
					request.onsuccess = function(event) {
						factory.db = event.target.result;
					};
				}
			}
	}
	
	return factory;
}


angularApp.factory('RestPostFactory', ['$http','$q','SpringDataRestAdapter' ,RestPostFactory ]);

function RestPostFactory($http, $q, SpringDataRestAdapter) {
	var factory = {
			find : function(page, limit, criterias,subToLoad) {
				var deferred = $q.defer();
				var search='';
				for (var i = 0, l = criterias.length; i < l; i++) {
					search+= criterias[i].field.id + criterias[i].operation.id + criterias[i].value.id + ',' 
				}
				var url = 'rest/posts/search/findByCriteria?page='+ (page -1) + '&size=' +limit;
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
			}
	}
	return factory;
}

angularApp.factory('PostFactory', ['DbPostFactory','RestPostFactory' ,PostFactory ]);

function PostFactory(DbPostFactory, RestPostFactory) {
	var factory = {
		posts : false,
		find : function(page, limit, criterias,subToLoad) {
			if(DbPostFactory.isAvaible()) {
				return DbPostFactory.find(page, limit, criterias);
			} else {
				return RestPostFactory.find(page, limit, criterias);
			}
		},
		get : function(id, subToLoad) {
			var deferred = $q.defer();
			var httpPromise = $http.get('rest/posts/' +id);
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
			
			$http.post('rest/comments/', data).then(function(response) {
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
			$http.put('rest/comments/' + comment.id, data).then(function(response) {
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
			$http.delete('rest/comments/' + comment.id).then(function(response) {
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
angularApp.factory('DbCategoryFactory', ['$q',DbCategoryFactory ]);
function DbCategoryFactory($q) {
	var factory = {
			db: null,
			find : function(page, limit, criterias) {
				var deferred = $q.defer();
				var transaction = factory.db.transaction('categories', 'readonly');
				var objectStore = transaction.objectStore('categories');
				var categories = [];
				
				objectStore.openCursor().onsuccess = function(event) {
					  var cursor = event.target.result;
					  if (cursor) {
						  categories.push(cursor.value);
					    cursor.continue();
					  }
					  else {
						  page = {size: 20,
								  totalElements : categories.length,
								  totalPages:1,
								  number:0};
						  deferred.resolve({
								categories : categories,
								page : page
							});
					  }
					};
				
				return deferred.promise;
			},
			isAvaible: function() {
				return (factory.db != null);
			},
			init : function() {
				if(window.indexedDB != undefined) {
					var request = window.indexedDB.open("AngularTestDatabase", AngularTestDataBaseVersion);
					request.onerror = function(event) {
						 console.log('error on database', request.errorCode);
					};
					request.onsuccess = function(event) {
						factory.db = event.target.result;
					};
				}
			}
	}
	
	return factory;
}

angularApp.factory('RestCategoryFactory', ['$http','$q','SpringDataRestAdapter' ,RestCategoryFactory ]);
function RestCategoryFactory($http, $q, SpringDataRestAdapter) {
	var factory = {
			find : function(page, limit, criterias) {
				var deferred = $q.defer();
				var httpPromise = $http.get('rest/categories/?size=99');
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

angularApp.factory('CategoryFactory', ['DbCategoryFactory','RestCategoryFactory' ,CategoryFactory ]);
function CategoryFactory(DbCategoryFactory, RestCategoryFactory) {
	var factory = {
			find : function(page, limit, criterias) {
				if(DbCategoryFactory.isAvaible()) {
					return DbCategoryFactory.find(page, limit, criterias);
				} else {
					return RestCategoryFactory.find(page, limit, criterias);
				}

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

