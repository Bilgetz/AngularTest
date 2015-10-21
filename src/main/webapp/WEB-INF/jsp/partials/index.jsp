<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<div ng-hide="loading">
	<ng-paging page="page" page-changed="pageChanged()"  ></ng-paging>
	<ng-filtering criteria-field="criteriaField" sub-resources="subResources" criterias ="criterias" criteria-changed="pageChanged()"  ></ng-filtering>
	
	
	<div  ng-repeat="post in posts">
	 	<ng-post data="post" ></ng-post>
		<hr />
	</div>
</div>