var stadiumEditor = angular.module('stadiumEditor', []);
stadiumEditor.controller('BlockCtrl', function($scope) {
    $scope.blocks = [{name: '101' , x:100 , y:100 },
                     {name: '102' , x:200 , y:200}
                    ];
    $scope.create = function(block) {
        block.x = 400;
        block.y = 300;
        $scope.blocks.push(angular.copy(block));
    }

});
stadiumEditor.directive('block',['$rootScope', function ($rootScope) {

    return {
        restrict: 'E',
        scope: {
            name: '@',
            x: '@x',
            y: '@y'
        },
        require: '^stadium',
        replace:true,
        link: function (scope, element, attrs, controllerInstance) {
            var paper = controllerInstance.svg;
            var x = parseInt(scope.x);
            var y = parseInt(scope.y);

            var rect = paper.rect(x,y,100,50);
            rect.attr({
                fill: "#f00",
                stroke: "#000",
                strokeWidth: 1,
                opacity:1
            });

            var text = paper.text(x+1,y+10, scope.name).attr({ fontSize: '10px', opacity: 1});

            var block = paper.group(rect, text);

            block.drag();
            block.click(function() {
                rect.attr({
                    fill: "#f00",
                    stroke: "#fff",
                    strokeWidth: 2,
                    opacity:1
                })
            })



        }
    }
}]);

stadiumEditor.directive('background',['$rootScope', function ($rootScope) {

    return {
        restrict: 'E',
        require: '^stadium',
        replace:true,
        link: function (scope, element, attrs, controllerInstance) {
            var rect = controllerInstance.svg.rect(0,0,800,600);
            rect.attr({
                fill: "#999",
                stroke: "#000",
                strokeWidth: 1
            })
        }
    }
}]);

stadiumEditor.directive('stadium',['$rootScope', function ($rootScope) {

    return {
        restrict: 'E',
        scope: { data : '=data'},
        transclude: true,
        replace:true,
        template: '<svg id="paper" width="800" height="600" ng-transclude></svg>',
        controller: function ($scope) {
            this.svg = Snap("#paper");


        },
        link: function (scope, element, attrs, controllerInstance) {




        }
    }
}]);









