<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<div ng-hide="loading">
	<div class="row">
		<div class="col-md-4">
			<uib-pagination total-items="page.totalElements" max-size="5"
				class="pagination-sm" items-per-page="page.size"
				boundary-links="true" rotate="false" ng-change="pageChanged()"
				ng-model="page.number"></uib-pagination>
		</div>
		<div class="col-md-1"><label>Size:</label>
			<input type="number" class="form-control" ng-model="page.size" ng-change="pageChanged()">
		</div>
	</div>
	<div>
		<form  ng-submit="addCriteria()">
			<%-- properties --%>
			<select name="selectedField" id="selectedField" ng-model="selectedField" ng-options="option.value for option in criteriaField">
	    	</select>
	    	
	    	<%--operation --%>
			<select ng-show="selectedField.type != undefined && selectedField.type.indexOf('number') != -1" name="selectedOperation" id="selectedOperation" ng-model="selectedOperation" ng-options="option.value for option in criteriaOperation">
	    	</select>
	    	<span ng-show="selectedField.type != undefined && selectedField.type.indexOf('text') != -1"> contains </span>
	    	<span ng-show="selectedField.type != undefined && selectedField.type.indexOf('entity') != -1"> is </span>
	    	
	    	<%-- value --%>
	    	<input ng-show="selectedField.type != undefined && selectedField.type.indexOf('entity') == -1" type="text" ng-model="selectedValue">
	    	
			<select ng-show="selectedField.type != undefined && selectedField.id== 'category'" name="selectedEntity" id="selectedEntity" ng-model="selectedEntity" ng-options="option.name for option in categories">
	    	</select>
	    	
	    	<input ng-show="selectedField.type != undefined" type="submit" value="add">
    	</form>
		<ul  class="list-group">
			<li  ng-repeat="criteria in criterias"  class="list-group-item">
				{{criteria.field.value}} 
				{{criteria.operation.value}} 
				{{criteria.value.value != undefined ? criteria.value.value : criteria.value.name != undefined ? criteria.value.name : ''}}
				<button type="button" class="close" data-dismiss="alert" aria-label="Close" ng-click="supressCriteria($index)"><span aria-hidden="true">&times;</span></button>
			</li>
		</ul>
	</div>
	
	<div  ng-repeat="post in posts">
	 	<ng-post data="post" ></ng-post>
		<hr />
	</div>
</div>