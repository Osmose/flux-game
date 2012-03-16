define(function(require) {
    var _ = require('underscore'),
        util = require('util'),
        loader = require('core/loader'),
        Entity = require('entity'),
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
            standing: false,
            frame: 0,
            tile: 0,
            shooting: false,
            has_laser: false
        });
    }

    _.extend(Enemy.prototype, Entity.prototype, {
        anim: function() {
            this.frame++;
            if (this.frame > 15) this.frame = 0;
            if (this.frame < 7) {
                this.tile = 0;
            } else {
                this.tile = 1;
            }

            if (this.dir === util.LEFT) {
                this.tile += 2;
            }
        },

        tick: function() {
            var dx = 0,
                dy = 0;

            if (this.dir === util.RIGHT) {dx += this.speed;}
            if (this.dir === util.LEFT) {dx -= this.speed;}
            if (this.dir === util.UP) {dy -= this.speed;}
            if (this.dir === util.DOWN) {dy += this.speed;}

            var xcol = this.engine.collides(this.collision_box(dx, 0)),
                ycol = this.engine.collides(this.collision_box(0, dy));

            if (xcol.solid === true) dx = 0;
            if (ycol.solid === true) dy = 0;

            if (xcol.solid === true || ycol.solid === true) {
                if (this.dir === util.LEFT || this.dir === util.RIGHT) {
                    this.dir = (this.dir === util.LEFT) ? util.RIGHT : util.LEFT;
                } else {
                    this.dir = (this.dir === util.DOWN) ? util.UP : util.DOWN;
                }
            }

            this.x += dx;
            this.y += dy;
        },

        render: function(ctx, x, y) {
            this.anim();
            this.tileset.drawTile(ctx, this.tile, this.x - x, this.y - y);
        },

        collide: function(object) {
            if (object.name == 'enemy') {
                engine.play('clunk');
            }

        }
    });

    return Enemy;
});
