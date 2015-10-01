var app = angular.module('a-better-programming-guide',[]);
app.controller('IndexCtrl', function($rootScope, $scope){
    $rootScope.showAnswers = false;
    $scope.usePrompt = function(fake_console, meta, code){
    }
});
app.config(function($sceProvider) {
  $sceProvider.enabled(false);
});
app.directive('tryOutBox', function() {
    return {
        restrict: 'E',
        scope: {
            log: '=?'
        },
        templateUrl: 'tryoutbox.html',
        controller: function($scope, $rootScope){
            var fake_console = {
                line: 0,
                log: function(message){
                    $scope.log.push(message);
                    console.line++;
                }
            }
            $scope.executeCode = function(code){
                console.line = 0;
                $scope.log = [];
                try {
                    (eval("(function a(console){" + code + ";p();})"))(fake_console);
                } catch (e) {
                    fake_console.log(e.message);
                }
            }
        }
    };
});
app.directive('htmlTryOut', function() {
    return {
        restrict: 'E',
        templateUrl: 'htmltryout.html'
    };
});