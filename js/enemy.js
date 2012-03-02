define(function(require) {
    var _ = require('underscore'),
        Entity = require('core/entity')
        util = require('util');

    function Enemy(engine, x, y) {
        Entity.call(this, engine);
        return _.extend(this, {
            dir: util.LEFT,
            x: x,
            y: y,
            name: 'enemy'
        });
    }

    _.extend(Enemy.prototype, Entity.prototype, {
        tick: function() {
            var dx = 0,
                dy = 0;

            if (this.dir === util.RIGHT) {dx += 1;}
            if (this.dir === util.LEFT) {dx -= 1;}
            this.moving = dx !== 0;

            this.vy += 0.1;
            if (this.vy > 4) this.vy = 4;

            var xcol = this.engine.collides(this.collision_box(dx, 0)),
                ycol = this.engine.collides(this.collision_box(0, Math.ceil(this.vy)));

            if (xcol.solid === true || ycol.solid === true) {
                this.collide({});
            }

            this.x = (this.dir === util.LEFT) ? this.x - .2 : this.x + .2;
        },

        render: function(ctx, x, y) {
            ctx.fillStyle = 'black';
            ctx.fillRect(this.x - x, this.y - y, 16, 16);
        },

        collide: function(object) {
            if (object.name !== 'player') {
                this.dir = (this.dir === util.LEFT) ? util.RIGHT : util.LEFT;
            }
        }
    });

    return Enemy;
});
