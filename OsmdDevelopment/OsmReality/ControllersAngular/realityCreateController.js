angular.module('realityApp')
.controller('realityCreateController', ['$scope', '$http', 'realityConstants', '$upload', 'user', function ($scope, $http, realityConstants, $upload, user) {

    //defaults
    $scope.disposition = 0;
    $scope.dealType = 0;

    $scope.createReality = function () {
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
            RealityUserId: user.userId
        }

        var url = realityConstants.webApiURLReality;
        $http.post(url, data)
            .success(function (realityId) {
                $scope.uploadFiles($scope.storedFiles, realityId);
                alert('success');
            })
            .error(function (err) {
                alert(err.ExceptionMessage);
            });
    };

    $scope.storedFiles = [];

    $scope.$watch('files', function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                $scope.storedFiles.push(files[i]);
            }
        }
    });

    $scope.uploadFiles = function (files, realityId) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $upload.upload({
                    url: 'api/Image',
                    headers: { 'realityId': realityId },
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                });
            }
        }
    };
}]);