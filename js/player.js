define(function(require) {
    var _ = require('underscore'),
        util = require('util'),
        loader = require('core/loader'),
        Entity = require('core/entity'),
        Bullet = require('bullet'),
        Tileset = require('core/tileset');

    function Player(engine) {
        Entity.call(this, engine);
        return _.extend(this, {
            vy: 0,
            standing: false,
            tileset: new Tileset(loader.get('player'), 16, 16, 0, 0, {}),
            frame: 0,
            tile: 0,
            dir: util.RIGHT,
            bounding_box: {left: 4, top: 0, right: 11, bottom: 15}
        });
    }

    _.extend(Player.prototype, Entity.prototype, {
        anim: function() {
            if (this.standing) {
                // Standing still
                if (!this.moving) {
                    this.tile = 0;
                    this.frame = 0;
                } else {
                    this.frame++;
                    if (this.frame > 7) this.frame = 0;
                    if (this.frame < 4) {
                        this.tile = 0;
                    } else {
                        this.tile = 1;
                    }
                }
            } else {
                this.tile = 2;
            }

            if (this.dir === util.LEFT) {
                this.tile += 3;
            }
        },
        tick: function() {
            var kb = this.engine.kb,
                dx = 0, dy = 0;

            if (kb.keys[kb.RIGHT]) {dx += 1; this.dir = util.RIGHT;}
            if (kb.keys[kb.LEFT]) {dx -= 1; this.dir = util.LEFT;}
            this.moving = dx !== 0;

            this.vy += 0.1;
            if (this.vy > 4) this.vy = 4;

            var xcol = this.engine.collides(this.collision_box(dx, 0)),
                ycol = this.engine.collides(this.collision_box(0, Math.ceil(this.vy)));
            this.standing = (this.vy > 0 && ycol.solid);

            if (this.standing) {
                if (kb.keys[kb.A]) {
                    document.getElementById('jump').play();
                    this.vy = -3;
                } else {
                    this.vy = 0;
                    this.y = ycol.stand - (this.bounding_box.bottom + 1);
                }
            }

            if(kb.pressed(kb.SPACE)) {
                this.engine.add_entity(new Bullet(this.engine,
                                                  this.x + (this.dir == util.LEFT ? 0 : 16),
                                                  this.y + 8,
                                                  1.0,
                                                  this.dir));
                document.getElementById('shoot').play();
            }

            if (!xcol.solid) this.x += dx;
            this.y += this.vy;
        },

        render: function(ctx) {
            this.anim();
            this.tileset.drawTile(ctx, this.tile, this.x, this.y);
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
