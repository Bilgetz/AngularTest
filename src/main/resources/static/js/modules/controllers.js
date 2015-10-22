/**
 * 
 */

authModule.controller('AuthLoginModalCtrl',['$scope','$modalInstance', 'modalMessage' ,AuthLoginModalCtrl]);
function AuthLoginModalCtrl($scope, $modalInstance, modalMessage) {
	$scope.credentials = {};
	$scope.modalMessage = modalMessage;
	$scope.ok = function() {
		$modalInstance.close($scope.credentials);
		$scope.credentials = {};
	}
	$scope.cancel = function() {
		 $scope.credentials = {};
		 $modalInstance.dismiss('cancel');
	}
}