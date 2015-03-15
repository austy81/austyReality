
angular.module('realityApp')
    .controller('headerController', ['$scope', 'user', function ($scope, user) {

        $scope.user = user;
        
    }]);
