angular
    .module('brightauthor', ['ngRoute', 'ui.grid', 'ui.grid.cellNav'])

    .config(['$routeProvider', function ($routeProvider) {

            $routeProvider

                .when('/', {
                    templateUrl: 'brightauthor.html',
                    controller: 'brightauthorCtrl'
                })
     }]
);

