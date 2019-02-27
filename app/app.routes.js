app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/home", {
            templateUrl: appPath + "/home/home.html",
            controller: "homeController"
        })
        .otherwise({
            templateUrl: appPath + "/home/home.html",
            controller: "homeController"
        });
});