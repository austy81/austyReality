angular.module('realityApp')
    .controller('realityListController', [
        '$scope', '$http', '$location', '$modal', '$routeParams', 'realityConstants', 'uiGmapGoogleMapApi', function($scope, $http, $location, $modal, $routeParams, realityConstants, uiGmapGoogleMapApi) {

            $scope.init = function() {
                //$routeParams.realityId
                $scope.searchReality();
            }

            $scope.searchReality = function() {
                $scope.getDataFromServer($scope.searchParams());
            }

            $scope.searchParamsDisposition = [true, true, true, true, true, true];
            $scope.searchParamsCity = "";
            $scope.searchParamsLocality = "";
            $scope.searchParamsPriceFrom = 0;
            $scope.searchParamsPriceTo = 1000000;

            $scope.searchParams = function() {
                return {
                    Dispositions: getSelectedDispositions(),
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
                $http(
                    {
                        url: url,
                        method: "GET",
                        params: searchParams
                    }).success(function(data) {
                        if (data.constructor === Array)
                            $scope.realityList = data;
                        else
                            $scope.realityList = [data];
                        $scope.showAllOnMap();
                    })
                    .error(function(msg) {
                        alert(msg.ExceptionMessage);
                    });
            };

            //https://angular-ui.github.io/angular-google-maps/#!/
            $scope.map = { center: { latitude: 50.011, longitude: 15.311 }, zoom: 7 };
            $scope.mapMarkers = [];
            $scope.options = {
                scrollwheel: false
            };


            $scope.showAllOnMap = function() {
                $scope.mapMarkers = [];
                for (var i = 0; i < $scope.realityList.length; i++) {
                    $scope.addMapMarker($scope.realityList[i], 12, (i == $scope.realityList.length - 1));
                }
            }

            $scope.addMapMarker = function(reality, zoom, moveFocus) {
                var address = reality.City + ', ' + reality.Street + ' ' + reality.StreetNumber;
                //todo fix this
                var marker = { "id": 2, "latitude": 15, "longitude": 30, "showWindow": true };

                $scope.mapMarkers.push(marker);
            }
        }
    ]);