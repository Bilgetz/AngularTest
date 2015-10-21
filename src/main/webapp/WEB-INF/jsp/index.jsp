<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="css/bootstrap.min.css">
<!-- Optional theme -->
<link rel="stylesheet" href="css/bootstrap-theme.min.css">
<style type="text/css">
 /* http://angular-ui.github.io/bootstrap/ */
	.nav, .pagination, .carousel, .panel-title a { cursor: pointer; }
</style>
<title>Test angular avec Spring data rest</title>
</head>
<body ng-app="demoApp">
<!-- http://www.grafikart.fr/formations/angularjs -->
	<header class="navbar navbar-default navbar-fixed-top navbar-inner">
	<div class="container">
	<div class="nav navbar-nav navbar-right btn-group" uib-dropdown  on-toggle="toggled(open)">
      <button id="split-button" type="button" class="btn btn-danger">{{locale}}</button>
      <button type="button" class="btn btn-danger" uib-dropdown-toggle>
        <span class="caret"></span>
        <span class="sr-only">Split button!</span>
      </button>
      <ul class="uib-dropdown-menu" role="menu" aria-labelledby="split-button">
        <li role="menuitem" ng-repeat="choice in locales" ng-click="setLocale(choice)"><a href>{{choice}}</a></li>
      </ul>
    </div>
	</div>
	</header>
	<div style="height: 50px"> </div>

	<div ng-show="loading">{{ 'message.loading' | translate }}</div>
	<uib-alert ng-repeat="alert in alerts" type="{{alert.type}}" close="closeAlert($index)" dismiss-on-timeout="5000" >
	<div ng-bind-html="alert.msg"></div>	
	</uib-alert>
	<div ng-view></div>
<script type="text/javascript" src="lib/angular.1.4.7.min.js"></script>
<script type="text/javascript" src="lib/angular-route.min.1.4.7.js"></script>
<script type="text/javascript" src="lib/angular-resource.1.4.7.min.js"></script>
<script type="text/javascript" src="lib/angular-spring-data-rest.0.4.3.min.js"></script>
<script type="text/javascript" src="lib/underscore.1.8.3-min.js"></script>
<script type="text/javascript" src="lib/ui-bootstrap-tpls-0.14.2.min.js"></script>
<script type="text/javascript" src="lib/angular-sanitize.min.js"></script>
<script type="text/javascript" src="lib/angular-translate.min.js"></script>
<script type="text/javascript" src="lib/angular-translate-loader-url.min.js"></script>

<script type="text/javascript" src="app.js"></script>
<script type="text/javascript" src="services.js"></script>
<script type="text/javascript" src="controllers.js"></script>
<script type="text/javascript" src="directives.js"></script>
</body>
</html>