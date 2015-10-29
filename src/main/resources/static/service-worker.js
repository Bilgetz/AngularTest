/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
 * https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
 * A voir :
 * http://www.w3.org/TR/appmanifest/
 */

var CURRENT_CACHE = 'test-angular-shred-worker-1',
urlToCache = [
              './',
              'css/bootstrap-theme.min.css',
              'css/bootstrap.min.css',
              'directives/comment-edit.html',
              'directives/comment.html',
              'directives/comments.html',
              'directives/filtering.html',
              'directives/modules/auth-menu.html',
              'directives/modules/login.html',
              'directives/paging.html',
              'directives/post.html',
              'directives/posts.html',
              'js/app.js','js/controllers.js','js/directives.js','js/modules/controllers.js',
              'js/modules/directives.js','js/modules/main.js','js/modules/services.js',
              'js/services.js',
              'lib/angular-animate.min.js','lib/angular-resource.1.4.7.min.js',
              'lib/angular-route.min.1.4.7.js','lib/angular-sanitize.min.js',
              'lib/angular-spring-data-rest.0.4.3.min.js','lib/angular-spring-data-rest.js',
              'lib/angular-translate-loader-url.min.js','lib/angular-translate.min.js',
              'lib/angular.1.4.7.min.js','lib/bootstrap.js','lib/bootstrap.min.js',
              'lib/restangular.1.4.0.min.js','lib/ui-bootstrap-tpls-0.14.2.min.js',
              'lib/underscore.1.8.3-min.js'
              ];


self.addEventListener('install', function(event) {
	console.log('install SW');
	//lors de l'install
	//ajout du caches
	event.waitUntil(
			caches.open(CURRENT_CACHE).then(function(cache) {
				console.log('installation du cache SW');
				return cache.addAll(urlToCache);
			})
	);
});


self.addEventListener('activate', function(event) {
	console.log('activate SW');
  // Active worker won't be treated as activated until promise resolves successfully.
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
    	console.log('cacheNames ', cacheNames);
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (CURRENT_CACHE != cacheName) {
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          } else {
        	  caches.open(CURRENT_CACHE).then(function(cache) {
        		  cache.keys().then(function(response) {
        		    response.forEach(function(element, index, array) {
        		    	if(element.referrer.indexOf("http") === 0) {
	        		    	var find =false;
	        		    	for (var i = 0, l = urlToCache.length; i < l && !find; i++) {
	        		    		find = (element.url.indexOf(urlToCache[i]) != -1);
							}
	        		    	if(!find){
	        		    		console.log('Deleting out of url cache:', element.url, element.referrer);
	        		    		cache.delete(element);
	        		    	} 
        		    	}
        		    });
        		  });
        		})
          }
        })
      );
    })
  );
});



self.addEventListener('fetch', function(event) {
	  //console.log('Handling fetch event for', event.request.url, event.request.referrer);
	  
	  event.respondWith(
	  new Promise(function(resolve, reject) {
		  var absoluteUrl = event.request.url.substring(event.request.referrer.length);
		  if(absoluteUrl.length > 0 && absoluteUrl.indexOf('rest') === 0 || absoluteUrl.indexOf('local') === 0) {
			  //c'est une request rest
			  //ou une tentative de recupere le local
			  // fetch puis cache
			  //console.error('rest ou local :', absoluteUrl);
			  resolve(fetch(event.request).then(function(response) {
				  //console.error('rest ou local fetch ok  :', absoluteUrl);
				  // fetch ok, on met en cache
				  caches.open(CURRENT_CACHE).then(function(cache) {
		        		//console.log('Put in cache' , absoluteUrl);
		        		cache.add(event.request, response);
					});
				  return response;
			  }).catch(function(error) {
				  //console.error('rest ou local fetch ko  :', absoluteUrl);
				  return caches.match(event.request).then(function(response) {
					  if (response) {
						  	//console.error('rest ou local cache ok :', absoluteUrl);
					        return response;
				      } else {
				    	  //console.error('rest ou local  failed:', error);
				    	  return Promise.reject(error);
				      }
				  })
			  })
			  ); 
		  } else {
			  //cache puis fetch
			  resolve(caches.match(event.request).then(function(response) {
				  if (response) {
					  //console.error('Autre, cache ok :', absoluteUrl);
			        return response;
			      }
				  return fetch(event.request).then(function(response) {
					  //console.error('Autre, fetch ok :', absoluteUrl);
					  return response;
				  })
			  }).catch(function(error) {
			        //console.error('Autre, failed:', error);
			        return Promise.reject(error);
			  })
			  );
			  
		  }//fin if/else
	  })//fin promise	  
	  )//fin response with
});

/***
 * Methode de reception message client vers worker
 */
self.addEventListener('message', function(event) {
	console.log('### message recu ####', JSON.stringify(event.data));
	
	//on recoit un message !
	//ca peut permettre de mettre a jour son cache ^^
	if(event.data.command == 'forceUpdate') {
		console.log('foobar est a ', event.data.foobar);
	}
	console.log('from : ' + event.data.origin);
	
	if(event.data.origin == 'angular-auth') {
		console.log('from angular auth ! ');
		clients.matchAll().then(function(clients) {
			clients.forEach(function(client) {
				//on peut envoyer au clients des objects egalement 
				client.postMessage(event.data);
			})
		});
	}
	if(event.data.command == 'resetCache') {
		console.log('reset du cache!');
  	  caches.open(CURRENT_CACHE).then(function(cache) {
		  cache.keys().then(function(response) {
		    response.forEach(function(element, index, array) {
		    		cache.delete(element);
		    });
		  });
		  return cache.addAll(urlToCache);
		})
	}
	
});

