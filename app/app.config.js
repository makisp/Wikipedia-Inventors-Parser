app.config(['$compileProvider', '$httpProvider', '$locationProvider', function ($compileProvider, $httpProvider, $locationProvider) {

    // Disable debug info in dom tree (slight performance boost).
    /* $compileProvider.debugInfoEnabled(false);
    $compileProvider.commentDirectivesEnabled(false);
    $compileProvider.cssClassDirectivesEnabled(false);
    $httpProvider.useLegacyPromiseExtensions = false; */
    // $locationProvider.html5Mode({
    //     enabled: true,
    //     requireBase: false
    // });
}]);