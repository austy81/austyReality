
angular.module('realityApp')
    .controller('loginController', ['$scope', 'realityConstants', 'authService', 'user', function ($scope, realityConstants, authService, user) {

        $scope.emailInput;
        $scope.passwordInput;
        $scope.user = user;

        $scope.login = function () {
            var email = $scope.emailInput;
            var password = $scope.passwordInput;

            $scope.passwordInput = '';

            var promise = authService.login(email, password).then(function () {
                $scope.emailInput = '';
            }, function (reason) {
                alert('Failed: ' + reason);
            });
        };

        $scope.logout = function () {
            authService.logOut();
        };
    }]);
