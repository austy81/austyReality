angular.module('realityApp')
    .controller('realityCreateController', [
        '$scope', '$http', 'realityConstants', '$upload', 'user', 'uiGmapGoogleMapApi', 'uiGmapIsReady',
        function($scope, $http, realityConstants, $upload, user, uiGmapGoogleMapApi, uiGmapIsReady) {

            //defaults
            $scope.disposition = 0;
            $scope.dealType = 0;

            $scope.createReality = function() {
                var data = {
                    DealType: $scope.dealType,
                    Disposition: $scope.disposition,
                    Region: $scope.region,
                    City: $scope.city,
                    Locality: $scope.locality,
                    Street: $scope.street,
                    StreetNumber: $scope.streetNumber,
                    Price: $scope.price,
                    DealDescription: $scope.dealDescription,
                    RealityUserId: user.userId,
                    Latitude: $scope.latitude,
                    Longitude: $scope.longitude
                }

                var url = realityConstants.webApiURLReality;
                $http.post(url, data)
                    .success(function(realityId) {
                        $scope.uploadFiles($scope.storedFiles, realityId);
                        alert('success');
                    })
                    .error(function(err) {
                        alert(err.ExceptionMessage);
                    });
            };

            $scope.storedFiles = [];

            $scope.$watch('files', function(files) {
                if (files && files.length) {
                    for (var i = 0; i < files.length; i++) {
                        $scope.storedFiles.push(files[i]);
                    }
                }
            });

            $scope.uploadFiles = function(files, realityId) {
                if (files && files.length) {
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        $upload.upload({
                            url: 'api/Image',
                            headers: { 'realityId': realityId },
                            file: file
                        }).progress(function(evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                        }).success(function(data, status, headers, config) {
                            console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                        });
                    }
                }
            };

            var events = {
                places_changed: function(searchBox) {

                }
            };

            $scope.marker = { latitude: 50.011, longitude: 15.311 };
            $scope.markerOptions = {
                draggable: true
            };

            uiGmapGoogleMapApi.then(function(maps) {
                $scope.bounds = new maps.LatLngBounds();
                var myLatLng = new maps.LatLng($scope.marker.latitude, $scope.marker.longitude);
                $scope.bounds.extend(myLatLng);
                
                $scope.map = {
                    center:
                        {
                            latitude: $scope.bounds.getCenter().lat(),
                            longitude: $scope.bounds.getCenter().lng()
                        },
                    zoom: 7
                };
                $scope.map.options = {  };

            });

            $scope.control = {};

            //uiGmapIsReady.promise().then((function(maps) {
            //    $scope.control.getGMap().fitBounds($scope.bounds);
            //}));

            //$scope.refreshMap = function() {
            //    $scope.control.refresh({ latitude: $scope.bounds.getCenter().lat(), longitude: $scope.bounds.getCenter().lng() });
            //};

            //$scope.streetZoom = function() {
            //    $scope.control.getGMap().setZoom(7);
            //};

        }
    ]);