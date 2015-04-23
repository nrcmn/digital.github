angular.module('dialogApp', ["firebase"])

    .controller('DialogCtrl',['$scope', '$http', function ($scope, $http) {
        $scope.vote = {
            value: 1
        }

        $scope.sendContent = function () {
            if(localStorage.getItem('dialog_id') != null){
                $scope.result = 'Вы уже проголосовали :(';
                return false;
            }

            $http({
                method: 'POST',
                url: 'https://dialog-app.firebaseio.com/.json',
                data:{
                    value: Number($scope.vote.value)
                },
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            .success(function (data) {
                $scope.result = 'Красавец, отичный голос! ;)'
                // localStorage['dialog_id'] = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            })
            .error(function (data) {
                $scope.result = 'Произошла ошибка, попробуйте еще раз!'
            })
        }
    }])
