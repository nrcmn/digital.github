angular.module('DialogApp', [])

.controller('mainCtrl', function ($scope, $http) {

    $scope.disable = true;
    $scope.voteClass = 'no-border'

    $scope.clickStar = function () {
        $scope.disable = false;
        $scope.voteClass = 'color-' + this.vote.value;
    }

    $scope.submit = function () {
        if(localStorage.dialog_id != undefined){
            $scope.result = 'Вы уже проголосовали!';
            $scope.disable = true;
            return false;
        }
        else{
            $scope.disable = true;
        }

        $http({
            method: 'POST',
            url: 'https://dialog-app.firebaseio.com/.json',
            data: {
                value: $scope.vote.value
            }
        })
        .success(function (data) {
            localStorage.dialog_id = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            $scope.result = 'Спасибо за голос!';
        })
        .error(function (data) {
            $scope.result = 'Что-то пошло нет так, попробуйте еще раз';
            $scope.disable = false;
        });
    }
})
