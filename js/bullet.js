define(function(require) {
    var _ = require('underscore'),
        Entity = require('core/entity'),
        util = require('util');

    function Bullet(engine, x, y, speed, dir) {
        Entity.call(this, engine);
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.dir = dir;
    }

    _.extend(Bullet.prototype, Entity.prototype, {
        tick: function() {
            this.x += this.speed * (this.dir == util.LEFT ? -1 : 1);
        },
        
        render: function(ctx, x, y) {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x - x, this.y - y, 2, 2);
        }
    });

    return Bullet;
});
