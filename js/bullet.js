define(function(require) {
    var _ = require('underscore'),
        Entity = require('core/entity'),
        util = require('util');

    function Bullet(engine, x, y, speed, dir, alt) {
        Entity.call(this, engine);
        return _.extend(this, {
            x: x,
            y: y,
            speed: speed,
            dir: dir,
            grenade: alt,
            bounding_box: {left:0, top:0, right:5, bottom:5}
        });
    }

    _.extend(Bullet.prototype, Entity.prototype, {
        tick: function() {
            this.x += this.speed * (this.dir == util.LEFT ? -1 : 1);

            if(this._bb) {
                var c = this.engine.collides(this._bb);
                if(c.solid) {
                    this.engine.tilemaps['first'].map[c.y][c.x] = 0;
                    if (this.grenade) {
                        this.engine.tilemaps['first'].map[c.y][c.x+1] = 0;
                        this.engine.tilemaps['first'].map[c.y+1][c.x] = 0;
                        this.engine.tilemaps['first'].map[c.y-1][c.x] = 0;
                    }
                    return false;
                };
            }
            return true;
        },

        render: function(ctx, x, y) {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x - x, this.y - y, 5, 5);
            if (!this.grenade) {
                ctx.fillStyle = 'green';
                ctx.fillRect(this.x - x, this.y - y, 2, 2);
            } else {
                ctx.fillStyle = 'red';
                ctx.fillRect(this.x - x, this.y - y, 10, 10);

            }
        },

        collide: function(obj) {
            this.engine.remove_entity(obj);
            this.engine.remove_entity(this);
        }
    });

    return Bullet;
});
