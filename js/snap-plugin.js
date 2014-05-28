/**
 * Created by gijsterhorst on 08/05/14.
 */
Math.toRad = function(angle) {
    return (angle/180)*Math.PI;
};


Snap.plugin( function( Snap, Element, Paper, global ) {
    Element.prototype.altDrag = function(onmove, onstart, onend) {
        this.onstart = onstart || function(x,y, ev) {};
        this.onend = onend || function(ev) {};
        this.onmove = onmove || null;

        this.drag( dragMove, dragStart, dragEnd );
        return this;
    }

    var dragStart = function ( x,y,ev ) {
        var tx, ty;
        var snapInvMatrix = this.transform().diffMatrix.invert();
        snapInvMatrix.e = snapInvMatrix.f = 0;
        tx = snapInvMatrix.x_topleft( x,y ); ty = snapInvMatrix.y_topleft( x,y );

        //this.data('ot', this.transform().local );
        this.onstart(tx,ty)
    }

    var dragMove = function(dx, dy, ev, x, y) {
        var tdx, tdy;
        var snapInvMatrix = this.transform().diffMatrix.invert();
        snapInvMatrix.e = snapInvMatrix.f = 0;
        tdx = snapInvMatrix.x_topleft( dx,dy ); tdy = snapInvMatrix.y_topleft( dx,dy );
        //this.transform(this.data('ot') + "t" + [ tdx, tdy ]);
        if (this.onmove) {
            this.onmove(tdx, tdy, ev, x, y);
        }
    }

    var dragEnd = function(ev) {
        this.onend(ev);
    }


});
