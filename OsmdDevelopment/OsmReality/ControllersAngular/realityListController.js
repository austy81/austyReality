angular.module('realityApp')
    .controller('realityListController', [
        '$scope', '$http', '$location', '$modal', '$routeParams', 'realityConstants', 'uiGmapGoogleMapApi', 'uiGmapIsReady', function($scope, $http, $location, $modal, $routeParams, realityConstants, uiGmapGoogleMapApi, uiGmapIsReady) {

            $scope.init = function() {
                $scope.searchReality();
            }

            $scope.searchReality = function() {
                $scope.getDataFromServer($scope.searchParams());
            }

            $scope.searchParamsDisposition = [true, true, true, true, true, true];
            $scope.searchParamsKitchen = [true, true];
            $scope.searchParamsCity = "";
            $scope.searchParamsLocality = "";
            $scope.searchParamsPriceFrom = 0;
            $scope.searchParamsPriceTo = 1000000;

            $scope.loading = true;

            $scope.searchParams = function() {
                return {
                    Dispositions: getSelectedDispositions(),
                    Kitchen: $scope.searchParamsKitchen,
                    City: $scope.searchParamsCity,
                    Locality: $scope.searchParamsLocality,
                    PriceFrom: $scope.searchParamsPriceFrom,
                    PriceTo: $scope.searchParamsPriceTo
                }
            };

            var getSelectedDispositions = function() {
                var dispositions = [];

                for (var i = 0; i <= $scope.searchParamsDisposition.length; i++)
                    if ($scope.searchParamsDisposition[i]) dispositions.push(i);

                return dispositions;
            }

            $scope.realityListLength = function() {
                if ($scope.realityList != undefined)
                    return $scope.realityList.length;
                else
                    return 0;
            };

            $scope.realityList = null;
            $scope.selectedReality = null;
            $scope.blobStorageSmallImageUrl = realityConstants.blobStorageSmallImageUrl;

            $scope.selectReality = function(selectedReality) {
                $scope.selectedReality = selectedReality;
                $scope.openRealityDetail('lg');
            }

            $scope.openRealityDetail = function(size) {
                var modalInstance = $modal.open({
                    templateUrl: 'realityDetailPopup',
                    controller: 'realityDetailController',
                    size: size,
                    resolve: {
                        selectedReality: function() {
                            return $scope.selectedReality;
                        }
                    }
                });
            };

            $scope.getDataFromServer = function(searchParams) {
                var url = realityConstants.webApiURLReality;
                $scope.loading = true;
                $http(
                    {
                        url: url,
                        method: "GET",
                        params: searchParams
                    }).success(function(data) {
                        if (data.constructor === Array) {
                            $scope.realityList = data;
                            $scope.markers = [];
                            data.forEach(function(item) {
                                $scope.markers.push({ id: item.RealityId, longitude: item.Longitude, latitude: item.Latitude });
                            });
                            $scope.loading = false;
                        };
                    })
                    .error(function(msg) {
                        alert(msg.ExceptionMessage);
                        $scope.loading = false;
                    });
            };

            //https://angular-ui.github.io/angular-google-maps/#!/
            var centerOfCR = { latitude: 50.011, longitude: 15.311 };

            $scope.markers = [];

            uiGmapGoogleMapApi.then(function(maps) {

                $scope.map = {
                    center: centerOfCR,
                    zoom: 7
                };
                $scope.map.options = {};

                applyMapBounds();

            });

            var applyMapBounds = function() {
                //var bounds = new $scope.map.control.getGMap().LatLngBounds();
                //for (var i = 0; i < $scope.markers.length; i++) {
                //    var geoCode = new $scope.map.control.getGMap().LatLng($scope.markers[i].latitude, $scope.markers[i].longitude);
                //    bounds.extend(geoCode);
                //}

                //$scope.map.control.fitBounds(bounds);
            };

            //$scope.map.control = {};

            //uiGmapIsReady.promise().then((function(maps) {
            //    $scope.map.control.getGMap().fitBounds($scope.bounds);
            //}));

            //$scope.refreshMap = function() {
            //    $scope.map.control.refresh({ latitude: $scope.bounds.getCenter().lat(), longitude: $scope.bounds.getCenter().lng() });
            //};

            //$scope.streetZoom = function() {
            //    $scope.map.control.getGMap().setZoom(7);
            //};

        }
    ]);