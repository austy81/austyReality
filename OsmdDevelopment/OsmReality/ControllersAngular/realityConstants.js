angular.module('realityApp')
    .factory('realityConstants', function () {
        var baseUrl = 'http://localhost:52410/api';
        //var baseUrl = 'http://austerlitz.azurewebsites.net/api';
        return {
            webApiURLReality: baseUrl + '/Reality',
            webApiURLUser: baseUrl + '/User',
            blobStorageSmallImageUrl: 'https://austerlitz.blob.core.windows.net/img-small',
            blobStorageNormalImageUrl: 'https://austerlitz.blob.core.windows.net/img-normal'
        }

    });