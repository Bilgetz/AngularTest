/**
 * */
angularApp.directive('ngPost', function() {
	return {
		restrict : 'E',
		templateUrl: 'directives/post.html',
		scope : {
			data :'='
		}
	}
});

angularApp.directive('ngComments', function() {
	return {
		restrict : 'E',
		templateUrl: 'directives/comments.html',
		scope : {
			title : '@',
			comments :'=',
			newComment : '=',
			editComment : '&',
			deleteComment : '&',
			edit : '&',
			add : '&',
		}
	}
});


angularApp.directive('ngComment', function() {
	return {
		restrict : 'E',
		templateUrl: 'directives/comment.html',
		scope : {
			data :'='
		}
	}
});

angularApp.directive('ngCommentEdit', function() {
	return {
		restrict : 'E',
		templateUrl: 'directives/comment-edit.html',
		scope : {
			data :'=',
			save : '&',
			error: '='
		}
	}
});

angularApp.directive('ngPaging', function() {
	return {
		restrict : 'E',
		templateUrl: 'directives/paging.html',
		scope : {
			page :'=',
			pageChanged : '&'
		}
	}
});

angularApp.directive('ngFiltering', function() {
	return {
		restrict : 'E',
		templateUrl: 'directives/filtering.html',
		scope : {
			criteriaField :'=',
			subResources :'=',
			criterias :'=',
			criteriaChanged : '&'
		}, controller : function($scope) {
			
			$scope.selectedField= {};
			$scope.selectedOperation= {};
			$scope.selectedValue= "";
			$scope.selectedEntity= {};
			$scope.criteriaOperation = [{id: ":", value:"="}, {id: "<", value:"inf"}, {id: ">", value:"sup"}];
			
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
				$scope.criteriaChanged();
			}
			
			$scope.supressCriteria = function(index) {
				$scope.criterias.splice(index, 1);
				$scope.criteriaChanged();
			} 
		}
	}
});

