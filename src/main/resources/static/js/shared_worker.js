/**
 * On passe par un shared worker car un service worker peut etre interompue par le navigateur.
 * rendant le timeout plus apelle des qu'il est interompue.
 * 
 */
var clients = [],db ,request, dataStores = [];

/** reation de la db*/
request = self.indexedDB.open("AngularTestDatabase", 1);
request.onerror = function(event) {
 console.log('error on database', request.errorCode);
};
request.onsuccess = function(event) {
  db = event.target.result;
  
  updateDb();
  //refresh tt les 10 mins
  self.setInterval(updateDb, 1000 * 60 * 10);
  
};

request.onupgradeneeded = function(event) { 
	  var db = event.target.result;
	  console.log('db version: ' + event.oldVersion + ' upgrade to ' + event.newVersion );
	  // Create an objectStore for this database
	  if(event.oldVersion < 1) {
		  var objectStore = db.createObjectStore("lastChange", { keyPath: "name" });
		  
		  var cat = db.createObjectStore("categories", { keyPath: "id" });
		  objectStore.put({name : 'categories', date : '2010/01/01 00:00:01 UTC'});
		  cat.createIndex("self", "_links.self.href", { unique: false });
		  
		  var posts = db.createObjectStore("posts", { keyPath: "id" });
		  posts.createIndex("name", "name", { unique: false });
		  objectStore.put({name : 'posts', date : '2010/01/01 00:00:01 UTC'});
		  
	  }
};
/** fin creation db**/


function updateDb() {
	console.log('shared worker updateDb');

/** met a jour les donnees **/		
	function updateData(data, dataStore) {
		return new Promise(function(resolve, reject) {
				console.log('open transaction for', dataStore);
				var transaction = db.transaction(["lastChange", dataStore], "readwrite");
				var objectStore = transaction.objectStore(dataStore);
				var nbModif = 0;
				if(data != undefined && data._embedded != undefined) {
					nbModif = data._embedded[dataStore].length;
					console.log('insert datas for', dataStore, nbModif);
					for (var j = 0, k=data._embedded[dataStore].length; j < k; j++) {
						//console.log('insert ', JSON.stringify(data._embedded[dataStore][j]));
						var finalObject = data._embedded[dataStore][j];
						objectStore.put(finalObject);
					}
					objectStore = transaction.objectStore("lastChange");
					var today = new Date();
					var dateString = '' + today.getUTCFullYear() + '/'+ ( today.getUTCMonth()+1) + '/' + today.getUTCDate() 
						+ ' ' + today.getUTCHours() + ':' +today.getUTCMinutes() + ':' + today.getUTCSeconds() + ' UTC';
					
					objectStore.put({name : dataStore, date : dateString});
				}
				transaction.oncomplete = function() {
					resolve('ok!' + dataStore);
				};
				transaction.onerror = function(event) {
					reject('ko' + dataStore  +' ' + event);
				};
			});
		}
		
		/** recupere les donnes sur le reseau et met a jour**/
		function fecthAndUpdateData(datastore) {
			return new Promise(function(resolve, reject) {
				var transaction = db.transaction(["lastChange", datastore.store], "readonly");
				//on recupere  le storage des lastChange
				var objectStore = transaction.objectStore("lastChange");
				// on recupe l'entre correspondant a ce qu'on veut aller chercher
				var lastChange = objectStore.get(datastore.store);
				var nbChange = 0;
				lastChange.onsuccess = function(event) {
					var lastDateChange = event.target.result.date;
					var url = '/demo/rest/' + datastore.store + '/search/findByVersionIsAfter?date=' +lastDateChange;
					if(datastore.projection != undefined && datastore.projection != '') {
						url = url + '&projection=' + datastore.projection;
					}
					
					console.log('fetching url :', url)
					fetch(url).then(function(response) {
							response.json().then(function(data) {
							resolve(updateData(data,datastore.store));
						});//response.json().then
					}).catch(function(error) {
						reject('fetch error:',error);
					});
				}
				lastChange.onerror = function(error) {
					reject('error get :',error);
				}
			});
		}
		
		/** retourne une promise qui sera ok quand la liste du datastore dera finie **/
		function chainDataStore(dataStores) {
			return new Promise(function(resolve, reject) {
				var datastore =dataStores.shift();
				console.log('shared worker Promise for ', datastore.store);
				
				fecthAndUpdateData(datastore).then(function(result) {
					console.log(result);
					if(dataStores.length > 0) {
						resolve(chainDataStore(dataStores));
					} else {
						resolve('shared worker finish');
					}
				}
				).catch(function(result) {
					console.log(result);
					reject(result);
				});
			});
		}
		
		// d'abord les referentiels, ensuite les donnéee
		if(dataStores.length ===0 ) {
			dataStores = [{store: 'categories', projection:''},{store: 'posts', projection:'withCategoryId'}];
			chainDataStore(dataStores).then(function() {
				console.log('Update finish without trouble');
			}).catch(function(error) {
				console.log('error on update', error);
			});
		}
		
}

onconnect = function(e) {
	
    var port = e.ports[0];
    clients.push(port);
    var s ='';
//    for ( var iterable_element in e.ports[0]) {
//		s+= iterable_element + ': '+  e.ports[0][iterable_element] + ',\n';
//	}
    console.log('connect !', s);
    
//    for (var i = 0; i < clients.length; i++) {
//    	clients[i].postMessage('un de plus!');
//	}
    
    port.addEventListener('message', function(e) {
      port.postMessage('Oo');
    });

    port.start(); // Required when using addEventListener. Otherwise called implicitly by onmessage setter.
}

