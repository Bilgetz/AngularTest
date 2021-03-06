/**
 * 
 * 
 */

angularApp.controller('PostsCtrl',['$scope','$rootScope', 'PostFactory','CategoryFactory',PostsCtrl]);

function PostsCtrl($scope,$rootScope,  $PostFactory, $CategoryFactory) {
	$rootScope.loading = true;

	$scope.criterias = [];
	$scope.criteriaField = [{id: "name", value:"name of post", type: "text"},
	                        {id: "content", value:"content of post", type: "text"},
	                        {id: "note", value:"note of post", type: "number"},
	                        {id: "etat", value:"etat of post", type: "entity"},
	                        {id: "category", value:"category of post", type: "entity"}];
	$scope.criteriaOperation = [{id: ":", value:"="}, {id: "<", value:"inf"}, {id: ">", value:"sup"}];
	$scope.subResources = { category : [] , etat: []}
	
	$CategoryFactory.find().then(function(result) {
		$scope.subResources.category = result.categories;
	}, function(msg) {
		alert(msg);
	});
	
	$scope.subResources.etat = [{id:'VALID', name: 'VALID'}, {id:'OBSOLETE', name: 'OBSOLETE'}];
	
	
	$scope.pageChanged = function() {
		$PostFactory.find($scope.page.number, $scope.page.size,$scope.criterias,['category']).then(function(result) {
			$scope.posts = result.posts;
			$rootScope.page = result.page;
			$rootScope.loading = false;
		}, function(msg) {
			alert(msg);
			$rootScope.loading = false;
		});
	}
	$scope.supressCriteria = function(index) {
		$scope.criterias.splice(index, 1);
		$scope.pageChanged();
	}
	$scope.addCriteria = function() {
		
		if($scope.selectedField.type == 'number') {
			$scope.criterias.push({field : $scope.selectedField , operation : $scope.selectedOperation, value:{ id: $scope.selectedValue , value:$scope.selectedValue }});
		} else if($scope.selectedField.type == 'text'){
			$scope.criterias.push({field : $scope.selectedField , operation : {id:':', value:'contains'}, value:{ id: $scope.selectedValue , value:$scope.selectedValue }});
		} else if($scope.selectedField.type == 'entity'){
			$scope.criterias.push({field : $scope.selectedField , operation : {id:':', value:'is'}, value:$scope.selectedEntity });
		}

		$scope.selectedField= {};
		$scope.selectedOperation= {};
		$scope.selectedValue = "";
		$scope.pageChanged();
		
	}
	
	
	$scope.pageChanged();
}

angularApp.controller('CommentsCtrl',['$scope','$rootScope' ,'PostFactory','CommentFactory' ,  '$routeParams', CommentsCtrl]);
function CommentsCtrl($scope,$rootScope, $PostFactory,$CommentFactory,$routeparams) {
	$rootScope.loading = true;
	$scope.newComment = {};
	
	$PostFactory.get($routeparams.id,['comments','category']).then(function(post) {
		$scope.comments =post.comments;
		$scope.title =post.name;
		$scope.post = post;
		$rootScope.loading = false;
	}, function() {
		alert(msg);
		$rootScope.loading = false;
	});
	
	$scope.add = function() {
		$CommentFactory.add($scope.newComment,$scope.post).then (function(response) {
				// ajouté sur le serveur
				$scope.comments.push(response.data);
				$rootScope.addAlert({type:'success', msg:'comments added'});
				$scope.newComment= {};
				$scope.editError= [];
			}, function(errors) {
				//erreur lors de la sauvegarde
				var err= $rootScope.generateErrorList(errors);
				$scope.editError=  err.properties;
				$rootScope.addAlert({type:'danger', msg:'comments not added cause:<br />'+ err.status });
				
			}
		);
	};
	
	$scope.edit = function() {
		$CommentFactory.edit($scope.newComment).then (function() {
			$rootScope.addAlert({type:'success', msg:'comments saved'});
			$scope.newComment= {};
			$scope.editError= [];
		}, function(errors) {
			//erreur lors de la sauvegarde
			var err= $rootScope.generateErrorList(errors);
			$scope.editError=  err.properties;
			$rootScope.addAlert({type:'danger', msg:'comments not saved cause:<br />'+ err.status });
		});
	};
	
	$scope.editComment = function(comment) {
		$scope.newComment = comment;
		$scope.editError= [];
	}
	
	$scope.deleteComment = function(comment, index) {
		$CommentFactory.deleteEntity(comment).then (function() {
			$rootScope.addAlert({type:'success', msg:'comments deleted'});
			$scope.comments.splice(index,1);
		}, function(errors) {
			//erreur lors de la sauvegarde
			var err= $rootScope.generateErrorList(errors);
			$rootScope.addAlert({type:'danger', msg:'comments deleted cause:<br />'+ err.status });
		});
		
		$scope
		
	}
}

