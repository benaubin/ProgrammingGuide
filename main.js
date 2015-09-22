var app = angular.module('a-better-programming-guide',[]);
app.controller('IndexCtrl', function($rootScope, $scope){
    $rootScope.showAnswers = false;
    $scope.usePrompt = function(fake_console, meta, code){
        console.log(meta.prompt.join('.'))
        if(meta.prompt && meta.prompt.join('.') == "Number 1.Number 2" && code.contains('+')){
            return true;
        }
    }
});
app.directive('tryOutBox', function() {
    return {
        restrict: 'E',
        scope: {
            answer: '@',
            solved: '=',
            solution: '=',
            solvedBy: '=',
            log: '=?'
        },
        templateUrl: 'tryoutbox.html',
        controller: function($scope, $rootScope){
            $rootScope.$watch('showAnswers',function(){
                console.log($rootScope.showAnswers)
                if($rootScope.showAnswers){
                    $scope.code = $scope.answer;
                    $scope.solved = false;
                } else if(!$scope._solved) {
                    $scope.solved = false;
                    $scope.code = "";
                }
            })
            $scope.solve = function(){
                $scope.solved = true;
                $scope._solved = true;
            }
            var fake_console = {
                line: 0,
                log: function(message){
                    $scope.log.push(message);
                    console.line++;
                }
            }
            var fake_prompt = function(message){
                $scope.meta.prompt.push(message)
            }
            $scope.executeCode = function(code){
                console.line = 0;
                $scope.result = "";
                $scope.log = [];
                $scope.meta = {prompt: []};
                try {
                    (eval("(function a(console, prompt, p){" + code + ";p();})"))(fake_console, fake_prompt, function(){
                        if($scope.solution && ($scope.log.join(".") == $scope.solution.join("."))){
                            $scope.solve();
                        } else if($scope.answer == $scope.code){
                            $scope.solve();
                        } else if($scope.solvedBy && $scope.solvedBy(fake_console, $scope.meta, $scope.code)){
                            $scope.solve();
                        } else if(!($scope.answer || $scope.solution) && $scope.log[0]){
                            $scope.solve();
                        } else {
                            $scope._solved = false;
                        }
                        if($scope._solved){
                            $scope.meta.prompt.forEach(function(message){
                                prompt(message)
                            })
                        }
                    });
                } catch (e) {
                    fake_console.log(e.message);
                }
            }
        }
    };
});