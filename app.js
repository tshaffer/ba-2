angular
    .module('brightauthor', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {

            $routeProvider

                .when('/', {
                    templateUrl: 'brightauthor.html',
                    controller: 'brightauthorCtrl'
                })
     }]
);

