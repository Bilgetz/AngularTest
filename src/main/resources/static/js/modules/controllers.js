/**
 * 
 */

authModule.controller('AuthLoginModalCtrl',['$scope','$modalInstance', 'modalMessage', 'logInError' ,AuthLoginModalCtrl]);
function AuthLoginModalCtrl($scope, $modalInstance, modalMessage, logInError) {
	$scope.credentials = {};
	$scope.modalMessage = modalMessage;
	$scope.error =logInError;
	$scope.ok = function() {
		$modalInstance.close($scope.credentials);
		$scope.credentials = {};
	}
	$scope.cancel = function() {
		 $scope.credentials = {};
		 $modalInstance.dismiss('cancel');
	}
}