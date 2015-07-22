/**
 * Created by Salifukayta on 07/07/2015.
 */

'use strict';

cloudApp.factory('cityGeolocService', ['$q', '$ionicPlatform', '$cordovaGeolocation', 'citiesService', 'gettextCatalog', function ($q, $ionicPlatform, $cordovaGeolocation, citiesService, gettextCatalog) {

    function getCityInformation(cityToSearch, callback) {
        // get city information for raining radar
        citiesService.searchOne(cityToSearch.name, cityToSearch.country)
            .then(function (city) {
                callback(null, city);
            })
            .catch(function (err) {
                console.log(err);
                callback(err, null);
            });
    }

    function getReverseGeoCoding(position, callback) {
        // get reverse geo-coding for city name
        citiesService.reverseCoding(position)
            .then(function(cityToSearch) {
                callback(null, cityToSearch);
            })
            .catch(function(err) {
                console.log(err);
                callback(err, null);
            });
    }

    function getCurrentPosition (x, callback) {
        // get position geo-localisation
        //TODO enableHighAccuracy test to true
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation.getCurrentPosition(posOptions)
            .then(function (position) {
                callback(null, position);
            }, function (err) {
                console.log(err.message);
                callback(gettextCatalog.getString("Please check your GPS is enabled"), null);
            });
    }

    var serviceAPI = {
        getGeolocCity: function () {
            var deferred = $q.defer();
            $ionicPlatform.ready(function () {
                var getPositionThenCity = async.compose(getCityInformation, getReverseGeoCoding, getCurrentPosition);
                getPositionThenCity(null, function (err, result) {
                    if (result != null) {
                        console.log(result);
                        deferred.resolve(result);
                    } else {
                        console.log("Error: " + err);
                        deferred.reject(err);
                    }
                });
            });
            return deferred.promise;
        },
    };

    return serviceAPI;
}]);