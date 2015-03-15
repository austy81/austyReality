angular.module('realityApp')
.controller('realityListController', ['$scope', '$http', '$location', '$modal', '$routeParams', 'realityConstants', function ($scope, $http, $location, $modal, $routeParams, realityConstants) {

        $scope.init = function () {
            //$routeParams.realityId
            $scope.initializeMap();
            $scope.searchReality();
        }

        $scope.searchReality = function () {
            $scope.getDataFromServer($scope.searchParams());
        }

        $scope.searchParamsDisposition = [ true, true, true, true, true, true ];
        $scope.searchParamsCity = "";
        $scope.searchParamsLocality = "";
        $scope.searchParamsPriceFrom = 0;
        $scope.searchParamsPriceTo = 1000000;

        $scope.searchParams = function () {
            return {
                Dispositions: getSelectedDispositions(),
                City: $scope.searchParamsCity,
                Locality: $scope.searchParamsLocality,
                PriceFrom: $scope.searchParamsPriceFrom,
                PriceTo: $scope.searchParamsPriceTo
            }
        };

        var getSelectedDispositions = function () {
            var dispositions = [];

            for (var i = 0; i <= $scope.searchParamsDisposition.length; i++)
                if ($scope.searchParamsDisposition[i]) dispositions.push(i);

            return dispositions;
        }

        $scope.realityListLength = function () {
            if ($scope.realityList != undefined)
                return $scope.realityList.length;
            else
                return 0;
        };

        $scope.realityList = null;
        $scope.selectedReality = null;
        $scope.blobStorageSmallImageUrl = realityConstants.blobStorageSmallImageUrl;

        $scope.selectReality = function (selectedReality) {
            $scope.selectedReality = selectedReality;
            $scope.openRealityDetail('lg');
        }

        $scope.openRealityDetail = function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'realityDetailPopup',
                controller: 'realityDetailController',
                size: size,
                resolve: {
                    selectedReality: function () {
                        return $scope.selectedReality;
                    }
                }
            });
        };

        /*Google map*/
        $scope.initializeMap = function () {
            $scope.geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(50.011, 15.311);
            var mapOptions = {
                zoom: 7,
                center: latlng
            }
            $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        }

        $scope.showOnMap = function (reality) {
            $scope.codeAddress(reality, 17, true);
        }

        $scope.showAllOnMap = function () {
            for (i = 0; i < $scope.realityList.length; i++) {
                $scope.codeAddress($scope.realityList[i], 12, (i == $scope.realityList.length - 1));
            }
        }

        $scope.codeAddress = function (reality, zoom, moveFocus) {
            var address = reality.City + ', ' + reality.Street + ' ' + reality.StreetNumber;
            $scope.geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (moveFocus) {
                        $scope.map.panTo(results[0].geometry.location);
                        $scope.map.setZoom(zoom);
                    }

                    var marker = new google.maps.Marker({
                        map: $scope.map,
                        position: results[0].geometry.location
                    });
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });
        }

        $scope.getDataFromServer = function (searchParams) {
            var url = realityConstants.webApiURLReality;
            $http(
            {
                url: url,
                method: "GET",
                params: searchParams
            }).success(function (data) {
                if (data.constructor === Array)
                    $scope.realityList = data;
                else
                    $scope.realityList = [data];
                $scope.showAllOnMap();
            })
            .error(function (msg) {
                alert(msg.ExceptionMessage);
            });
        }
    }]);