var stadiumEditor = angular.module('stadiumEditor', []);

stadiumEditor.directive('background',['$rootScope', function ($rootScope) {

    return {
        restrict: 'E',
        require: '^stadium',
        replace:true,
        link: function (scope, element, attrs, controllerInstance) {
            var leftfield = controllerInstance.svg.rect(-500,-250,495,500);
            var rightfield = controllerInstance.svg.rect(5,-250,490,500);

            leftfield.attr({fill:"#0f0", stroke: "#fff", strokeWidth : 10});
            rightfield.attr({fill:"#0f0", stroke: "#fff", strokeWidth : 10});

            var smallTick = controllerInstance.svg.path("M0,0 L20,0 L20,20 L0,20 Z");
            smallTick.attr({
                strokeWidth : 0.5,
                stroke      : "#00f",
                fill        : "#eee",
                "fill-opacity" : 0.5
            });
            var smallPattern = smallTick.pattern(0,0,20,20);

            var tick = controllerInstance.svg.path("M0,0 L200,0 L200,200 L0,200 Z");
            tick.attr({
                strokeWidth : 1,
                stroke      : "#00f",
                fill        : smallPattern,
                "fill-opacity" : 0.5
            });
            var p = tick.pattern(0,0,200,200);

            var rect = controllerInstance.svg.rect(-1000,-1000,2000,2000);
            rect.attr({
                fill: p,
                stroke: "#000",
                strokeWidth: 1
            });
            var Panning = function() {
                    this.onStart = function (x, y, ev) {
                    this.startX = scope.zoom.centerX;
                    this.startY = scope.zoom.centerY;
                }
                this.moveCenter = function (dx, dy, ev, x, y) {
                    console.log("drag " + dy);
                    scope.zoom.centerX = this.startX - dx;
                    scope.zoom.centerY = this.startY - dy;
                    scope.$apply();
                }
            }
            var pan = new Panning();
            rect.altDrag(pan.moveCenter, pan.onStart);


        }
    }
}]);

stadiumEditor.directive('stadium',['$rootScope', function ($rootScope) {

    return {
        restrict: 'E',
        scope: {
            data    : '=data',
            zoom    : '=zoom'
        },
        transclude: true,
        replace:true,
        template: '<svg id="paper" width="800" height="800"  ng-transclude></svg>',
        controller: function ($scope) {
            this.svg = Snap("#paper");
            this.registeredBlocks = [];
            this.register = function(blockScope) {
                console.log("registered block " + blockScope.block.name);
                this.registeredBlocks.push(blockScope);
            };
            this.unSelectAllBlocks = function() {
                angular.forEach(this.registeredBlocks, function(blockScope) {
                    blockScope.unselectBlock();
                });
            };
            //this.svg.attr({stroke : "#f00"});


        },
        link: function (scope, element, attrs, controllerInstance) {
            scope.$watch("zoom", function() {
                console.log("Zoomlevel changed");
                var width =  (2000/(scope.zoom.level/100));
                var height = (2000/(scope.zoom.level/100));
                var x = scope.zoom.centerX - (width/2);
                var y = scope.zoom.centerY - (height/2);

                var viewbox = ""+ Math.round(x)+" "+Math.round(y)+" "+Math.round(width)+" "+Math.round(height);
                console.log("viewbox " + viewbox);
                controllerInstance.svg.attr({viewBox: viewbox, preserveAspectRatio: "none"});
            }, true);



        }
    }
}]);









