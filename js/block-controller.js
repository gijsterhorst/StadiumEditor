/**
 * Created by gijsterhorst on 14/05/14.
 */
var coordinate = function(x, y) {
    var that = {};
    that.x = Math.floor(x);
    that.y = Math.floor(y);
    that.toString = function() {
        return "" + Math.floor(x) + "," + Math.floor(y);
    };

    return that;
};

var block = function(spec) {
    // spec contains name, previousBlock ,x, y, width, height, angle

    var that = {};
    var name = spec.name || "new block";
    var angle = spec.angle || 0;
    var previousBlock = spec.previousBlock || null;
    var topleft = coordinate(spec.x || 0, spec.y || 0);
    var topright = coordinate(0, 0);
    var bottomright = coordinate(0, 0);
    var bottomleft = coordinate(0,0);
    var height = spec.height;
    var width = spec.width || 10;


    var totalAngle = 0;
    var centerOfRotation = coordinate(0,0);
    var radius = 0;
    var selected = false;
    var priceLevel = spec.priceLevel || {"level" : "undefined", "color": "#fff"};



    var setup = function() {
        if (previousBlock) {
            topleft = previousBlock.topright();
            bottomleft = previousBlock.bottomright();
            totalAngle = previousBlock.totalAngle() + angle;
            radius = previousBlock.radius();
            centerOfRotation = previousBlock.centerOfRotation();
        } else {
            bottomleft = coordinate(spec.x, spec.y + spec.height);
            totalAngle = angle;
        }
        if (angle === 0) {
            // perform setup for a non-corner block
            topright    = coordinate(topleft.x    + width * Math.cos(Math.toRad(totalAngle)), topleft.y + width * Math.sin(Math.toRad(totalAngle)));
            bottomright = coordinate(bottomleft.x + width * Math.cos(Math.toRad(totalAngle)), bottomleft.y + width * Math.sin(Math.toRad(totalAngle)));
            // the radius and centerofRotation will be used by corner blocks that are connected
            // directly to this one.
            // the radius will be equal to the distance to the middle of the field, where y=0
            radius = Math.abs(bottomright.y);
            centerOfRotation = coordinate(bottomright.x, bottomright.y + radius);

        } else {
            bottomright = coordinate (
                    centerOfRotation.x + radius * Math.cos(Math.toRad(totalAngle - 90)),
                    centerOfRotation.y + radius * Math.sin(Math.toRad(totalAngle - 90))
                );

            topright = coordinate (
                    centerOfRotation.x + (radius + height) * Math.cos(Math.toRad(totalAngle - 90)),
                    centerOfRotation.y + (radius + height) * Math.sin(Math.toRad(totalAngle - 90))
                );
            console.log("topright =" + topright.toString());
        }
    };

    that.getCorners = function () {
        return {
            "topleft"       :{"x": topleft.x - 10   , "y": topleft.y - 10    , "width": 20, "height": 20 },
            "topright"      :{"x": topright.x -10   , "y": topright.y -10    , "width": 20, "height": 20 },
            "bottomleft"    :{"x": bottomleft.x - 10, "y": bottomleft.y - 10 , "width": 20, "height": 20 },
            "bottomright"   :{"x": bottomright.x -10, "y": bottomright.y -10 , "width": 20, "height": 20 }
        }
    };

    that.getAddButtonPos = function() {
        return coordinate(( topright.x + bottomright.x ) / 2, ( topright.y + bottomright.y ) / 2 );
    };

    that.path = function () {
        var path = "M" + topleft.toString();
        if (angle === 0) {
            path += "L" + topright.toString();
            path += "L" + bottomright.toString();
            path += "L" + bottomleft.toString();
            path += "L" + topleft.toString();

        } else {
            path += "A" + (radius + height) + "," + (radius + height) + " 0, 0, 1, " + topright.toString();
            path += "L" + bottomright.toString();
            path += "M" + topleft.toString();
            path += "L" + bottomleft.toString();
            path += "A" + radius + "," + radius + " 0, 0, 1, " + bottomright.toString();
        }
        return path;
    };
    that.topleft = function() {return topleft};
    that.topright = function() {return topright};
    that.bottomright = function() {return bottomright};
    that.bottomleft = function() {return bottomleft};
    that.radius = function() {return radius};
    that.totalAngle = function() {return totalAngle};
    that.centerOfRotation = function() {return centerOfRotation};


    that.style = function() {
        var style = {fill: "#fff" , stroke: "#000", strokeWidth: 1,opacity : 1};
        style.fill = priceLevel.color;
        style.strokeWidth = selected ? 3 : 1;
        return style;

    };



    that.move = function (x, y) {
        topleft = coordinate(x, y);
        setup();
    };
    setup();
    return that;
};



stadiumEditor.controller('BlockCtrl', function($scope) {
    $scope.blocks = [];

    $scope.blocks.push( block({ "name" : "101",
                                "x" :  -500,
                                "y" :  -360,
                                "width" : 100,
                                "height":  70 }));

    $scope.zoom = { level : 100, centerX : 0, centerY : 0};

    $scope.priceLevels = [{"level" :"duur", "color" : "#f00"}, {"level" :"middel", "color" : "#0f0"}, {"level" :"goedkoop", "color" : "#00f"} ];


    $scope.create = function(blockName, angle, priceLevel) {
        // first find the selected block, because the new block has to be connected to it
        var selectedBlock = null;
        angular.forEach($scope.blocks, function(block) {
            if (block.selected) {
                selectedBlock = block;
            }
        });
        if (selectedBlock) {
            // a block was found. Now calculate its shape, on the basis of its width and angle
            var newBlock = block({ "name" : blockName,
                                   "previousBlock" : selectedBlock,
                                   "width" : 100,
                                   "height" : 70,
                                   "angle" : parseInt(angle),
                                   "priceLevel" : priceLevel
                                  });
            $scope.blocks.push(newBlock);
        } else {
            console.error("No block was selected while adding a new one!");
        }
    };
    $scope.zoomIn = function() {
        $scope.zoom.level = $scope.zoom.level + 25;
    };
    $scope.zoomOut = function() {
        $scope.zoom.level = $scope.zoom.level - 25;
    };

});