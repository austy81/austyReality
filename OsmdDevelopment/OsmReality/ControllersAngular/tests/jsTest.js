/// <reference path="../../scripts/angular.js" />
/// <reference path="../../scripts/angular-mocks.js" />
/// <reference path="../../scripts/jasmine.js" />
/// <reference path="../../scripts/angular-ui/ui-bootstrap.js" />
/// <reference path="../../scripts/angular-route.js" />

/// <reference path="../realityControllers.js" />


describe('realityListController', function () {
    beforeEach(module('realityAppControllers'));

    var $controller;

    beforeEach(inject(function (_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    describe('$scope.realityListLength', function () {
        var $scope, $http, $anchorScroll, $location, $modal, $routeParams, controller;
        $routeParams = { realityId: 1 };
        $scope = {};

        beforeEach(function () {
            $scope = {};
            controller = $controller('realityListController', { $scope: $scope, $http: $http, $anchorScroll: $anchorScroll, $location: $location, $modal: $modal, $routeParams: $routeParams });
        });

        it('len is 0 undefined', function () {
            expect($scope.realityListLength()).toEqual(0);
        });

        it('len is 0 empty list', function () {
            $scope.realityList = [];
            expect($scope.realityListLength()).toEqual(0);
        });

        it('len is 2', function () {
            $scope.realityList = ['', ''];
            expect($scope.realityListLength()).toEqual(2);
        });

    });
});
