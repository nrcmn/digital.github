/**
* EOapp Module
*
* Description
*/
angular.module('EOapp', ['ui.router', 'router', 'ngAnimate'])

	.controller('NavCtrl', ['$scope', '$rootScope', '$http', '$location', '$state', function ($scope, $rootScope, $http, $location, $state){
		
		$scope.topNav = 1; // check private tab
		$scope.navLoc = $location.path(); // check location
		// document.querySelector('.main').className = 'main border-left';

		window.addEventListener("hashchange", function () {
			
			// top navigation logic
			tab = $location.path().split('/')[1];
			
			if(tab == 'users'){
				$scope.topNav = 1;
				$scope.$apply();
			}
			else if(tab == 'premium'){
				$scope.topNav = 2;
				$scope.$apply();
			}
			else if(tab == 'business'){
				$scope.topNav = 3;
				$scope.$apply();
			}

			// add or delete border in main block
			var nodes = document.body.querySelectorAll('input');
			function checkSelector () {
				if(nodes[0].checked == true){
					document.querySelector('.main').className = 'main border-left';
					return true;
				}
				else if(nodes[nodes.length-1].checked == true){
					document.querySelector('.main').className = 'main border-right';
					return true;
				}
				else if(nodes[0].checked == false){
					document.querySelector('.main').className = 'main';
				}
			}
			checkSelector();

			// bottom navigation logic
			$scope.navLoc = $location.path(); // check location
			
			if($scope.navLoc == '/premium'){
				$scope.nextPage = 'visible';
			}
			else{
				$scope.nextPage = 'hidden';	
			}

			$scope.backStartLock = $location.path().split('/').pop(); // block back button in all tabs, which is 'start'

			$scope.$apply();

			$scope.back = function () {
				history.back();
			}

		}, false);

		$scope.comeInStart = function () {
			$state.go(tab);
		}
	}])

	.controller('MainContentCtrl', ['$scope', '$rootScope', '$http', '$location', '$state', function ($scope, $rootScope, $http, $location, $state){

		// when JSON file have end link
		if($location.path().split('/').pop() == 'end'){
			$state.go('end'); // template with draft
		}

		$scope.loc = $location.path(); // check location

		$http({
			method: 'GET',
			// url: 'https://raw.githubusercontent.com/Beeline-Digital/eo-app/master/www/http/app.json'
			url:'http/app.json'
		})
		.success(function (data) {
			$rootScope.buttonsContent = data;
		})
	}])

	.controller('EndCtrl', ['$timeout', '$state', function ($timeout, $state){
		// this timeout returns user to the starting point - first page of private tab
		$timeout(function(){
			$state.go('users')
		}, 2500);
	}])