/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
 * https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
 * A voir :
 * http://www.w3.org/TR/appmanifest/
 */

var CURRENT_CACHE = 'mon-site-v1',
urlToCache = ['/demo/css/bootstrap.min.css', '/demo/posts/2/','/demo/posts/2/category'];


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
	//lors de l'activation
	console.log('activate SW');
	//menage ancien cache !
});
/*
self.addEventListener('fetch', function(event) {
	console.log('request !!', event);
//	if(event.request.url.match('/category')) {
		event.respondWith(fetch(event.request).then(function(response){
			console.log('response ');
			return response;
		}).catch(function(eroor) {
			console.error('request eoor');
			throw error;
		}));
//	} else {
//		event.respondWith(caches.match(event.request));
//	}
		//on peut recup tous les clients ( onglets sous FF )
//		clients.getAll().then(function(clients) {
//			clients.forEach(function(client) {
//				//on peut envoyer au clients des objects egalement 
//				client.postMessage({command: 'disconect'});
//			})
//		});
});
*/

self.addEventListener('fetch', function(event) {
	  console.log('Handling fetch event for', event.request.url);

	  event.respondWith(
	    caches.match(event.request).then(function(response) {
	      if (response) {
	        console.log('Found response in cache:', response);

	        return response;
	      }
	      console.log('No response found in cache. About to fetch from network...');

	      return fetch(event.request).then(function(response) {
	        console.log('Response from network is:', response);

	        return response;
	      }).catch(function(error) {
	        console.error('Fetching failed:', error);

	        throw error;
	      });
	    })
	  );
	});


self.addEventListener('message', function(event) {
	//on recoit un message !
	//ca peut permettre de mettre a jour son cache ^^
	if(event.data.command == 'forceUpdate') {
		console.log('foobar est a ', event.data.foobar);
	}
	clients.getAll().then(function(clients) {
		clients.forEach(function(client) {
			//on peut envoyer au clients des objects egalement 
			client.postMessage({command: 'disconect'});
		})
	});
	
});

