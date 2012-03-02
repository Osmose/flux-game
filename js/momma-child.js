define(function(require) {
    var _ = require('underscore'),
        Enemy = require('enemy'),
        util = require('util');

    function MommaChild(engine, x, y) {
        Enemy.call(this, engine, x, y);
        return _.extend(this, {
            bounding_box: {left:0, top:0, right:5, bottom:5}
        });
    }

    _.extend(MommaChild.prototype, Enemy.prototype, {
        tick: function() {
            Enemy.prototype.tick.call(this);
        },

        render: function(ctx, x, y) {
            ctx.fillStyle = 'blue';
            ctx.fillRect(this.x+this.bounding_box.left - x,
                         this.y+this.bounding_box.top - y, 
                         this.bounding_box.right,
                         this.bounding_box.bottom);   
        }
    });

    return MommaChild;
});