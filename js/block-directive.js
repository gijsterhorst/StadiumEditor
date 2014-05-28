/**
 * Created by gijsterhorst on 10/05/14.
 */

var t2m = {};

t2m.DragUtil = function(block, angularScope ) {

    var that = this;
    this.start = function (x, y, ev) {
        that.startX = block.x_topleft;
        that.startY = block.y_topleft;
    };
    this.move = function (dx, dy, ev, x, y) {
        block.move(that.startX + dx, that.startY + dy);
        angularScope.$apply();
    };
};

t2m.ResizeUtil = function( block, corner, angularScope ) {

    var that = this;
    this.start = function (x, y, ev) {
        that.originalWidth = block.width;
        that.originalHeight = block.height;
        that.originalX = block.x_topleft;
        that.originalY = block.y_topleft;

    };
    this.move = function (dx, dy, ev, x, y) {
        if (corner === "topleft") {
            block.x_topleft = that.originalX +dx;
            block.y_topleft = that.originalY +dy;
            block.width = that.originalWidth - dx;
            block.height = that.originalHeight - dy;

        }
        if (corner === "bottomright") {
            block.width = that.originalWidth + dx;
            block.height = that.originalHeight + dy;
        }
        if (corner === "topright") {
            block.width = that.originalWidth + dx;
            block.height = that.originalHeight - dy;
            block.y_topleft = that.originalY + dy;

        }
        if (corner === "bottomleft") {
            block.x_topleft = that.originalX +dx;
            block.width = that.originalWidth - dx;
            block.height = that.originalHeight + dy;

        }

        angularScope.$apply();
    };
};


stadiumEditor.directive('block',['$rootScope', function ($rootScope) {

    return {
        restrict: 'E',
        scope: {
            block : '='
        },
        require: '^stadium',
        replace:true,
        link: function (scope, element, attrs, controllerInstance) {
            var fontsize = 15 * scope.$parent.zoom.level;
            var paper    = controllerInstance.svg;

            //scope.rect = paper.rect(scope.block.x_topleft,scope.block.y_topleft,scope.block.width,scope.block.height);
            console.log(scope.block.path());
            scope.rect = paper.path(scope.block.path());
            scope.rect.attr(scope.block.style());
            console.log(scope.block.style());
            scope.dragHandle =[];
            scope.addBlockButton = null;
            scope.$watch("block", function() {

                scope.rect.attr({"path": scope.block.path()});
                if (scope.block.selected) {

                    scope.rect.attr(scope.block.style());
                    // add Add button, if not already there
                    if (!scope.addBlockButton) {
                        var addButtonPos = scope.block.getAddButtonPos();
                        scope.addBlockButton = paper.circle(addButtonPos.x,addButtonPos.y, 25);
                        scope.addBlockButton.attr(t2m.selectedBlockStyle);
                        scope.addBlockButton.click(function() {
                            console.log("add block");
                            angular.element('#newBlockModal').modal({show:true});

                        })
                    } else {
                        var addButtonPos = scope.block.getAddButtonPos();
                        scope.addBlockButton.attr({"cx" :addButtonPos.x, "cy" : addButtonPos.y });
                    }

                    var corners = scope.block.getCorners();
                    for (corner in corners) {
                        var coordinates = corners[corner];

                        if (!scope.dragHandle[corner]) {
                            scope.dragHandle[corner] = paper.rect(coordinates.x, coordinates.y, coordinates.width, coordinates.height);
                            scope.dragHandle[corner].attr({"fill": "#fff", "stroke": "#000"});
                            var resizeUtil = new t2m.ResizeUtil(scope.block, corner, scope);
                            scope.dragHandle[corner].altDrag(resizeUtil.move, resizeUtil.start);
                        } else {
                            scope.dragHandle[corner].attr({"x": coordinates.x, "y": coordinates.y});
                        }
                    }
                } else {
                    if (scope.addBlockButton) {
                        scope.addBlockButton.remove();
                        scope.addBlockButton = null;
                    }
                    var corners = scope.block.getCorners();
                    for (corner in corners) {
                        if (scope.dragHandle[corner]) {
                           scope.dragHandle[corner].remove();
                        }
                    }
                    scope.rect.attr(scope.block.style());
                    scope.dragHandle = [];
                }
            },true);

            var drag = new t2m.DragUtil(scope.block, scope);
            scope.rect.altDrag( drag.move, drag.start );

            controllerInstance.register(scope);

            scope.unselectBlock = function() {
                console.log("unselecting block" + scope.block.name);
                if (scope.block.selected) {
                    scope.block.selected = false;
                    scope.$apply();
                }
            };


            scope.selectBlock = function() {
                console.log('click '+scope.block.name +"  > " + scope.block.selected );
                controllerInstance.unSelectAllBlocks();
                scope.block.selected = true;
                scope.$apply();
            };
            scope.rect.click( scope.selectBlock );

        }
    }
}]);
