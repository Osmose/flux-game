define(function(require) {
    var _ = require('underscore'),
        util = require('util');

    function Player(engine) {
        _.extend(this, {
            engine: engine,

            x: 0,
            y: 0,
            vy: 0,
            standing: false,

            bounding_box: {left: 0, top: 0, right: 16, bottom: 16}
        });
    }

    _.extend(Player.prototype, {
        tick: function() {
            var kb = this.engine.kb,
                dx = 0, dy = 0;

            if (kb.keys[kb.RIGHT]) dx += 1;
            if (kb.keys[kb.LEFT]) dx -= 1;

            this.vy += 0.1;
            if (this.vy > 4) this.vy = 4;

            var xcol = this.engine.collides(this.collision_box(dx, 0)),
                ycol = this.engine.collides(this.collision_box(0, this.vy));
            this.standing = (ycol.boundary !== false &&
                             ycol.boundary.side === util.DOWN);

            if (this.standing) {
                if (kb.keys[kb.A]) {
                    this.vy = -3;
                } else {
                    this.vy = 0;
                    this.y = ycol.boundary.pos - this.bounding_box.bottom;
                }
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
