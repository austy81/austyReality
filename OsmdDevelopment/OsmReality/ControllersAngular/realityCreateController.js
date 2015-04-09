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
                    Latitude: $scope.marker.latitude,
                    Longitude: $scope.marker.longitude
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

            var centerOfCR = { latitude: 50.011, longitude: 15.311 };
            $scope.marker = centerOfCR;
            $scope.markerOptions = {
                draggable: true
            };

            $scope.address = {};

            var events = {
                place_changed: function (searchBox) {
                    var place = searchBox.getPlace();
                    if (place) {
                        if (place.address_components) {

                            $scope.streetNumber = '';
                            $scope.street = '';
                            $scope.locality = '';
                            $scope.city = '';
                            $scope.region = '';

                            place.address_components.forEach(function (component) {
                                if (component.types) {
                                    //premise -- 612
                                    if (component.types.indexOf('street_number') > -1) {
                                        $scope.streetNumber = component.long_name;
                                    }
                                    if (component.types.indexOf('route') > -1) {
                                        $scope.street = component.long_name;
                                    } 
                                    if (component.types.indexOf('neighborhood') > -1) {
                                        $scope.locality = component.long_name;
                                    } 
                                    if (component.types.indexOf('sublocality') > -1) {
                                        $scope.city = component.long_name;
                                    }
                                    if (component.types.indexOf('locality') > -1) {
                                        $scope.region = component.long_name;
                                    }

                                }
                            });
                        }
                        if (place.geometry) {
                            if (place.geometry.location) {
                                $scope.marker.longitude = place.geometry.location.B;
                                $scope.marker.latitude = place.geometry.location.k;
                                $scope.recenterMap(17);
                            }

                        }

                    }
                }
            }
            $scope.searchbox = { //https://developers.google.com/maps/documentation/javascript/reference#SearchBox
                template: 'searchbox.tpl.html',
                parentdiv: 'searchboxParent',
                //position: 'top-left',
                events: events,
                options: {
                    autocomplete: true, //https://developers.google.com/maps/documentation/javascript/reference#Autocomplete
                    //types: ['(cities)'],  //https://developers.google.com/places/supported_types
                    componentRestrictions: { country: 'cz' }
                }
            }

            uiGmapGoogleMapApi.then(function() {
                $scope.recenterMap(7);
                $scope.map.options = {};

            });

            //$scope.control = {};

            //uiGmapIsReady.promise().then((function(maps) {
            //    $scope.control.getGMap().fitBounds($scope.bounds);
            //}));

            //$scope.refreshMap = function() {
            //    $scope.control.refresh({ latitude: $scope.bounds.getCenter().lat(), longitude: $scope.bounds.getCenter().lng() });
            //};

            $scope.recenterMap = function (targetZoom) {

                $scope.map =
                {
                    center:
                    {
                        latitude: $scope.marker.latitude,
                        longitude: $scope.marker.longitude
                    },
                    zoom: targetZoom
                };
            };

        }
    ]);