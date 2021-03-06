angular.module('slim', ['dndLists', 'chart.js']).controller('slimController', function($scope, sprintTaskService, geolocationService) {


    $scope.labels = ["To Do", "In Progress", "Done"];
    $scope.data = [];
    $scope.days = ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"];
    $scope.burnDownData = [35, 33, 30, 28, 28];
    $scope.series = ["BurnDown"];

    $scope.initController = function() {
        sprintTaskService.loadDummyData().then(function(response) {
            $scope.models = response.data;
            $scope.todo = $scope.models.lists['To Do'];
            $scope.progress = $scope.models.lists['In Progress'];
            $scope.done = $scope.models.lists.Done;
            $scope.drawChart();
        });
    };

    $scope.getClass = function(listName) {
        if (listName === 'To Do') {
            return 'todo';
        } else if (listName === 'In Progress') {
            return 'inprogress';
        } else {
            return 'done';
        }
    };

    $scope.deleteFromList = function(list, item) {
        for (var i = 0; i < list.length; i++) {
            var itemInList = list[i];
            if (itemInList.label === item.label) {
                list.splice(i, 1);
                break;
            }
        }
    };

    $scope.getDroppedElement = function($index, item, list, listName) {
        // list.splice($index, 1, item);
        if (item.type === 'todo') {
            $scope.deleteFromList($scope.todo, item);
            // $scope.todo.splice($index, 1);
        } else if (item.type === 'progress') {
            $scope.deleteFromList($scope.progress, item);
            //$scope.progress.splice($index, 1);
        } else {
            $scope.deleteFromList($scope.done, item);
            // $scope.done.splice($index, 1);
        }

        if (listName === 'To Do') {
            item.type = 'todo';
            $scope.todo.splice($index, 0, item);
        } else if (listName === 'In Progress') {
            item.type = 'progress';
            $scope.progress.splice($index, 0, item);
        } else {
            item.type = 'done';
            $scope.done.splice($index, 0, item);

        }
        $scope.drawChart();
        $scope.updateBurnDown();
    };

    $scope.updateBurnDown = function() {
        $scope.burnDownData[$scope.burnDownData.length - 1] = $scope.total - $scope.doneEstimate;

    };

    $scope.getEstimate = function(list) {
        var estimate = 0;
        for (var i = 0; i < list.length; i++) {
            estimate += list[i].Estimation;
        }
        return estimate;
    };

    $scope.getTotal = function() {
        return $scope.toDoEstimate + $scope.inProgressEstimate + $scope.doneEstimate;
    };

    $scope.drawChart = function() {

        $scope.toDoEstimate = $scope.getEstimate($scope.todo);
        $scope.inProgressEstimate = $scope.getEstimate($scope.progress);
        $scope.doneEstimate = $scope.getEstimate($scope.done);
        $scope.total = $scope.getTotal();

        $scope.data[0] = $scope.toDoEstimate;
        $scope.data[1] = $scope.inProgressEstimate;
        $scope.data[2] = $scope.doneEstimate;
    }

    $scope.dataMoved = function($index, item, list) {
        list.splice($index, 1);
    };


    // Generate initial model
    //for (var i = 1; i <= 3; ++i) {
    //   $scope.models.lists.A.push({ label: "Item A" + i });
    //   $scope.models.lists.B.push({ label: "Item B" + i });
    // }

    // Model to JSON for demo purpose
    $scope.$watch('models', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

    var locationPromise = geolocationService.getlocation();
    locationPromise.then(function(longname) {
        $scope.location = longname;
    }, function(shortname) {
        $scope.location = shortname;
    });

});