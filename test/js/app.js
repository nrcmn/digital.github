angular.module('conference', ['firebase', 'router'])

    .run(function ($rootScope, $http){
        $http.get('http/questions.json').success(function (data) {
            $rootScope.questions = data;
        })
    })

    .controller('MainCtrl', function ($scope, $http) {
        console.log('Hello world');

        $scope.answers = {}

        $scope.sendIt = function () {
            console.log($scope.answers);

            $http({
                method: 'POST',
                url: 'https://strap.firebaseio.com/.json',
                data: $scope.answers
            })
            .success(function (data) {
                console.log(data);
            })
            .error(function (data) {
                console.log(data);
            });
        }
    })

    .controller('TextEditCtrl', function ($scope, $http) {
        var firepadRef = new Firebase('https://strap-editor.firebaseio.com/');
        var codeMirror = CodeMirror(document.getElementById('firepad'), { lineWrapping: true });
        var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror,
            { richTextShortcuts: true, richTextToolbar: true, defaultText: 'Hello, World!' });
    })

    .controller('AboutCtrl', function ($scope) {
        console.log('About page');
    })
