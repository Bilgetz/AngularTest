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

