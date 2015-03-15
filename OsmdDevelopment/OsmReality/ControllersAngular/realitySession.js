angular.module('realityApp')
    .factory('user', function () {

        var userFactory = {
            isAuth: false,
            userId: 0,
            userName: "",
            token: null
        };
        return userFactory;
    })
 
angular.module('realityApp')
    .factory('authService', ['$http', '$q', 'realityConstants', 'user',
        function ($http, $q, realityConstants, user) {

        var authServiceFactory = {};

        var _authentication = user;

        var _saveRegistration = function (registration) {

            _logOut();

            return $http.post(realityConstants.webApiURLUser, registration).then(function (response) {
                return response;
            });
        };

        var _login = function (userName, password) {

            var urlParams = "?username=" + userName + "&password=" + password;

            var deferred = $q.defer();

            $http.get(realityConstants.webApiURLUser + urlParams, undefined, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (loginData) {

                //todo save to cookie

                _authentication.isAuth = true;
                _authentication.userId = loginData.Id;
                _authentication.userName = loginData.UserName;
                _authentication.token = loginData.Token;

                deferred.resolve(loginData);

            }).error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });

            return deferred.promise;
        };

        var _logOut = function () {

            $http.get(realityConstants.webApiURLUser + '?SessionId=' + _authentication.token, undefined, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

            //save to cookie

            _authentication.isAuth = false;
            _authentication.userId = 0;
            _authentication.userName = "";
            _authentication.token = null;

        };

        var _fillAuthData = function () {

            var authData; // get form cookie
            if (authData) {
                _authentication.isAuth = true;
                _authentication.userId = authData.UserId;
                _authentication.userName = authData.UserName;
                _authentication.token = authData.Token;
            }
        }

        authServiceFactory.saveRegistration = _saveRegistration;
        authServiceFactory.login = _login;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;

        return authServiceFactory;
}]);


angular.module('realityApp')
    .factory('sessionInjector', ['user', function (user) {
        var sessionInjector = {
            request: function (config) {
                config.headers['x-session-token'] = user.token; //TODO: send correct token
                return config;
            }
        };
        return sessionInjector;
    }]);
//*
//angular.module('realityApp')
//    .factory('sessionRecoverer', ['$q', '$injector', function ($q, $injector) {
//        var sessionRecoverer = {
//            responseError: function (response) {
//                // Session has expired
//                if (response.status == 419) {
//                    var SessionService = $injector.get('SessionService');
//                    var $http = $injector.get('$http');
//                    var deferred = $q.defer();

//                    // Create a new session (recover the session)
//                    // We use login method that logs the user in using the current credentials and
//                    // returns a promise
//                    SessionService.login().then(deferred.resolve, deferred.reject);

//                    // When the session recovered, make the same backend call again and chain the request
//                    return deferred.promise.then(function () {
//                        return $http(response.config);
//                    });
//                }
//                return $q.reject(response);
//            }
//        };
//        return sessionRecoverer;
//    }]);
//    */

angular.module('realityApp')
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('sessionInjector');
        //$httpProvider.interceptors.push('sessionRecoverer');
    }]);