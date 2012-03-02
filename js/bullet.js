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
            this.y += Math.random() * 10 - 5;
        },
        
        render: function(ctx) {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, this.y, 2, 2);
        }
    });

    return Bullet;
});
