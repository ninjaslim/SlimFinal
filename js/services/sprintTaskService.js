

angular.module('slim').service('sprintTaskService', function ($http) {

    var sprintTaskService = {
        loadDummyData : function () {
           return  $http.get("data/data.json");
        }
    };
  return sprintTaskService;

});