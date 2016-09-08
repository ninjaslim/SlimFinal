angular.module('slim').service('geolocationService', function ($q) {
    
    
    var geolocationService = {
        getlocation: function () {       
            var deferred = $q.defer();
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    
                    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    var geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results[0]) {
                                for (var i = 0; i < results[0].address_components.length; i++) {
                                    var shortname = results[0].address_components[i].short_name;
                                    var longname = results[0].address_components[i].long_name;
                                    var type = results[0].address_components[i].types;
                                    if (type.indexOf("country") != -1) {
                                        if (null != longname) {
                                            deferred.resolve(longname);
                                        }
                                        else {
                                            deferred.resolve(shortname);
                                        }
                                    }
                                }
                            }
                        }
                    });
                });
            } else {
                deferred.reject('Geolocation is not supported');
            }
            return deferred.promise;
        }
    };
    return geolocationService;
   
});