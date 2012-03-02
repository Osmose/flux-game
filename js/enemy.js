define(function(require) {
    var _ = require('underscore'),
        util = require('util');
        loader = require('core/loader'),
        Entity = require('core/entity'),
        Tileset = require('core/tileset');

    function Enemy(engine, x, y, dir, speed) {
        Entity.call(this, engine);
        return _.extend(this, {
            dir: dir,
            speed: speed,
            x: x,
            y: y,
            name: 'enemy',
            tileset: new Tileset(loader.get('enemy'), 16, 16, 0, 0, {}),
            frame: 0,
            tile: 0,
            dir: dir,
            bounding_box: {left: 4, top: 0, right: 11, bottom: 15},
            vy: 0,
            standing: false,
            frame: 0,
            tile: 0,
            shooting: false,
            has_laser: false
        });
    }

    _.extend(Enemy.prototype, Entity.prototype, {
        anim: function() {
            this.tile = 2;

            this.frame++;
            if (this.frame > 7) this.frame = 0;
            if (this.frame >= 0) {
                if (this.frame < 4) {
                    this.tile = 0;
                } else {
                    this.tile = 1;
                }
            }

            if (this.dir === util.RIGHT) {
                this.tile += 4;
            }
        },

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

            if (this.dir === util.LEFT || this.dir === util.RIGHT) {
                this.x = (this.dir === util.LEFT) ? this.x - this.speed : this.x + this.speed;
            }
            if (this.dir === util.DOWN || this.dir === util.UP) {
                this.y = (this.dir === util.DOWN) ? this.y - this.speed : this.y + this.speed;
            }
        },

        render: function(ctx, x, y) {
            this.anim();
            this.tileset.drawTile(ctx, this.tile, this.x - x, this.y - y);
        },

        collide: function(object) {
            if (object.name !== 'player') {
                if (this.dir === util.LEFT || this.dir === util.RIGHT) {
                    this.dir = (this.dir === util.LEFT) ? util.RIGHT : util.LEFT;
                } else {
                    this.dir = (this.dir === util.DOWN) ? util.UP : util.DOWN;
                }
            }
        }
    });

    return Enemy;
});
