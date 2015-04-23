angular.module('dialogApp', ["firebase"])

    .controller('DialogCtrl',['$scope', function ($scope) {
        $scope.vote = {
            value: 1
        }

        $scope.sendContent = function () {
            if(localStorage.getItem('dialog_id') != null){
                $scope.result = 'Вы уже проголосовали :(';
                return false;
            }

            var myFirebaseRef = new Firebase("https://dialog-app.firebaseio.com/");

            myFirebaseRef.push({
                value: Number($scope.vote.value)
            })

            localStorage['dialog_id'] = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

            $scope.result = 'Красавец, отичный голос! ;)'
        }
    }])
