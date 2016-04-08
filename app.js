angular
    .module('brightauthor', ['ngRoute', 'ui.grid', 'ui.grid.cellNav', 'ui.bootstrap'])

    .config(['$routeProvider', function ($routeProvider) {

            $routeProvider

                .when('/', {
                    templateUrl: 'brightauthor.html',
                    controller: 'brightauthorCtrl'
                })
     }]
);

