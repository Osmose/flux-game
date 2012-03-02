define(function(require) {
    var _ = require('underscore'),
        Entity = require('core/entity'),
        util = require('util');

    function Bullet(engine, x, y, speed, dir) {
        Entity.call(this, engine);
        return _.extend(this, {
            x: x,
            y: y,
            speed: speed,
            dir: dir,
            bounding_box: {left:0, top:0, right:5, bottom:5}
        });
    }

    _.extend(Bullet.prototype, Entity.prototype, {
        tick: function() {
            this.x += this.speed * (this.dir == util.LEFT ? -1 : 1);

            var c = this.engine.collides({left: this.x + this.bounding_box.left,
                                          right: this.x + this.bounding_box.right,
                                          top: this.y + this.bounding_box.top,
                                          bottom: this.y + this.bounding_box.bottom});
            if(c.solid) {
                this.engine.tilemaps['first'].map[c.y][c.x] = 0;
                return false;
            };
        },
        
        render: function(ctx, x, y) {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x - x, this.y - y, 5, 5);
        }
    });

    return Bullet;
});
