app.controller('homeController', ['$scope', 'wikipediaService', '$timeout', function ($scope, wikipediaService, $timeout) {

    $scope.init = function () {
        // GET request to fetch the results of the List Of Inventors page.
        wikipediaService.getInventions().then(function successCallback(resp) {

            // Storing the final (parsed) object into the $scope variable for displaying.
            $scope.result = resp;
            $('.loader-parent').addClass('d-none');
        }, function errorCallback(resp) {
            console.log('Error: ' + resp);
        });
    }

    //TODO: Fix filter. It is currently not working.

}]);