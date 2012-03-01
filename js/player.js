define(function(require) {
    var _ = require('underscore'),
        util = require('util'),
        Entity = require('core/entity'),
        Bullet = require('bullet');

    function Player(engine) {
        Entity.call(this, engine);
        return _.extend(this, {
            vy: 0,
            standing: false
        });
    }

    _.extend(Player.prototype, Entity.prototype, {
        tick: function() {
            var kb = this.engine.kb,
                dx = 0, dy = 0;

            if (kb.keys[kb.RIGHT]) dx += 1;
            if (kb.keys[kb.LEFT]) dx -= 1;

            this.vy += 0.1;
            if (this.vy > 4) this.vy = 4;

            var xcol = this.engine.collides(this.collision_box(dx, 0)),
                ycol = this.engine.collides(this.collision_box(0, Math.ceil(this.vy)));
            this.standing = (this.vy > 0 && ycol.solid);

            if (this.standing) {
                if (kb.keys[kb.A]) {
                    this.vy = -3;
                } else {
                    this.vy = 0;
                    this.y = ycol.stand - (this.bounding_box.bottom + 1);
                }
            }

            if(kb.keys[kb.SPACE]) {
                this.engine.add_entity(new Bullet(this.engine, this.x, this.y));
            }

            if (!xcol.solid) this.x += dx;
            this.y += this.vy;
        },

        render: function(ctx) {
            ctx.fillStyle = '#000000';
            ctx.fillRect(this.x, this.y, 16, 16);
        },

        collision_box: function(dx, dy) {
            return {
                left: this.x + dx + this.bounding_box.left,
                right: this.x + dx + this.bounding_box.right,
                top: this.y + dy + this.bounding_box.top,
                bottom: this.y + dy + this.bounding_box.bottom
            };
        }
    });

    return Player;
});
