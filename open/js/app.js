angular.module('DialogApp', [])

.controller('mainCtrl', function ($scope, $http) {

    if(localStorage.dialog_id != undefined){
        $scope.result = 'Спасибо! Вы уже голосовали';

        $scope.vote = {
            value: localStorage.dialog_val
        };

        $scope.disable = true;
        $scope.starDisable = true;
        $scope.voteClass = 'color-' + localStorage.dialog_val;
    }
    else{
        $scope.disable = true;
        $scope.voteClass = 'no-border'
        $scope.starDisable = false;
    }

    $scope.clickStar = function (e) {
        $scope.disable = false;
        $scope.voteClass = 'color-' + this.vote.value;
    }

    // $scope.submit = function () {
        $scope.disable = true;
        $scope.starDisable = true;
        $scope.result = 'Выполняю операцию...';
        $scope.resultClass = 'yellow';

        $http({
            method: 'POST',
            url: 'https://dialog-app-load-test.firebaseio.com/.json',
            data: {
                value: Math.floor(Math.random() * (10 - 1 + 1)) + 1
            }
        })
        .success(function (data) {
            // localStorage.dialog_id = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            // localStorage.dialog_val = $scope.vote.value;

            $scope.result = 'Спасибо! Ваш голос обработан';
            $scope.disable = true;
            $scope.starDisable = true;
            $scope.resultClass = 'green';
        })
        .error(function (data) {
            $scope.result = 'Что-то нет так :-( Попробуйте ещё раз';
            $scope.disable = false;
            $scope.starDisable = false;
            $scope.resultClass = 'red';
        });
    // }
})
