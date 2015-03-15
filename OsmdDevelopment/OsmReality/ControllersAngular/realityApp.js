angular.module('realityApp', ['ngRoute', 'ui.bootstrap', 'angularFileUpload'])
    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.
        when('/realityList', {
            templateUrl: 'Views/RealityList.html',
            controller: 'realityListController'
        }).
        when('/realityList/:realityId', {
            templateUrl: 'Views/RealityList.html',
            controller: 'realityListController'
        }).
        when('/realityCreate', {
            templateUrl: 'Views/RealityCreate.html',
            controller: 'realityCreateController'
        }).
        otherwise({
            redirectTo: '/realityList'
        });

    }]);
