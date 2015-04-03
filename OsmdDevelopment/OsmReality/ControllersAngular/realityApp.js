angular.module('realityApp', ['ngRoute', 'ui.bootstrap', 'angularFileUpload', 'uiGmapgoogle-maps'])
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

    }])
    .config(function (uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyD3-AQivwtRIpI7_UHBeQPhaI9kVX-tVPI',
            v: '3.17',
            libraries: 'places,geometry,visualization'
        });
    });
