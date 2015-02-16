/**
* router Module
*
* Description
*/
angular.module('router', ['EOapp'])

.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider

    	// private clients tab
		.state('users', {
			url: '/users/start',
			templateUrl: 'templates/main.html'
		})
		.state('content', {
			url: '/users/{pageId}',
			templateUrl: 'templates/main.html'
		})

		// premium clients tab
		.state('premium', {
			url: '/premium',
			templateUrl: 'templates/premium.message.html'
		})
		.state('premiumMain', {
			url: '/premium/{pageId}',
			templateUrl: 'templates/main.html'
		})

		// business clients tab
		.state('business', {
			url: '/business/start',
			templateUrl: 'templates/main.html'
		})
		.state('businessContent', {
			url: '/business/{pageId}',
			templateUrl: 'templates/main.html'
		})

		// end page with check image
		.state('end', {
			url: '/end',
			templateUrl: 'templates/end.html'
		})

	$urlRouterProvider.otherwise('/users/start');

})