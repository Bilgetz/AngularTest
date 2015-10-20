<div  ng-hide="loading">
	<h1>{{title}}</h1>
	
	<div ng-repeat="comment in comments">
		<p>
			<ng-comment data="comment"></ng-comment>
			<a  ng-click="editComment(comment)">Edit comment</a>
			<a  ng-click="deleteComment(comment,$index)">Delete comment</a>
		</p>
	</div>
	<div ng-show="newComment.id">
 	<ng-comment-edit  data="newComment" save="edit()" error="editError"></ng-comment-edit>
	</div>
	<div ng-hide="newComment.id">
	<ng-comment-edit  data="newComment" save="add()" error="editError"></ng-comment-edit>
	</div>

</div>
<a href="#/">Revenir au articles</a>