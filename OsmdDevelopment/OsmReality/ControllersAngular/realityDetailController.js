angular.module('realityApp')
    .controller('realityDetailController', ['$scope', '$modalInstance', 'selectedReality', function ($scope, $modalInstance, selectedReality) {
        $scope.selectedReality = selectedReality;
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    }]);