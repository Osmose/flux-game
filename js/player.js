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
            bounding_box: {left: 4, top: 0, right: 11, bottom: 15},
            shooting: false,
            has_laser: false,
            num_jumps: 2,
            health: 3,
            taking_damage: false,
            _taking_damage_frame: 8
        });
    }

    _.extend(Player.prototype, Entity.prototype, {
        anim: function() {
            if (this.standing) {
                if (this.shooting) {
                    this.tile = 3;
                    this.frame = -8;
                } else if (!this.moving) {
                    this.tile = 0;
                    this.frame = 0;
                } else {
                    this.frame++;
                    if (this.frame > 7) this.frame = 0;
                    if (this.frame >= 0) {
                        if (this.frame < 4) {
                            this.tile = 0;
                        } else {
                            this.tile = 1;
                        }
                    }
                }
            } else {
                this.tile = 2;
            }

            if (this.dir === util.LEFT) {
                this.tile += 4;
            }
        },
        take_damage: function(amount) {
            if (this.taking_damage === true) {
                return;
            }

            this.taking_damage = true;
            if (amount === undefined) {
                amount = 1;
            }

            this.health -= amount;

            // Don't take damage for the next second.
            var player = this;
            setTimeout(function() {
                player.taking_damage = false;
                player._taking_damage_frame = 8;
            }, 1000);
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

            if (ycol.solid) {
                this.vy = 0;
                this.y = ycol.stand - (this.bounding_box.bottom + 1);
                this.num_jumps = 0;
            }

            if (kb.pressed(kb.A) && this.num_jumps < 2) {
                engine.play("assets/audio/jump.ogg");
                this.num_jumps++;
                this.vy = -3;
            } 

            if (kb.pressed(kb.SPACE) || kb.pressed(kb.B)) {
                this.shooting = true;
                var grenade = kb.pressed(kb.SPACE);
                this.engine.add_entity(new Bullet(this.engine,
                                                  this.x + (this.dir == util.LEFT ? 0 : 16),
                                                  this.y + 8,
                                                  4.0,
                                                  this.dir, grenade, this.has_laser));
                if (grenade) {
                    engine.play("assets/audio/grenade.ogg");
                } else {
                    engine.play("assets/audio/shoot.ogg");
                }
            } else {
                this.shooting = false;
            }

            if (!xcol.solid) this.x += dx;
            this.y += this.vy;

            // Bang bang you're dead.
            if (this.health < 1) {
                this.engine.remove_entity(this);
            }
        },

        render: function(ctx, x, y) {
            if (this.taking_damage === true) {
                this._taking_damage_frame--;
                if (this._taking_damage_frame < 0) {
                    if (this._taking_damage_frame < -8) {
                        this._taking_damage_frame = 8;
                    }
                    return;
                }
            }

            this.anim();
            this.tileset.drawTile(ctx, this.tile, this.x - x, this.y - y);
        },

        collide: function(obj) {
            if (obj.name === 'enemy') {
                this.take_damage();
            }
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
