angular.module('router', ['ui.router'])

    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/text-editor");

        $stateProvider
            .state('main', {
                url: "/vote",
                templateUrl: "templates/main.html"
            })

            .state('textEditor', {
                url: "/text-editor",
                templateUrl: "templates/editor.html"
            })

            .state('about', {
                url: "/about",
                templateUrl: "templates/about.html"
            })
    })
