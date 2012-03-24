define(function(require) {
    var _ = require('underscore'),
        util = require('util'),

        Enemy = require('enemy'),
        Momma = require('momma'),

        Item = require('entities/item'),
        DoubleJump = require('entities/items/double_jump');

    function Tilemap(engine, tileset, map) {
        var self = this;
        _.extend(this, {
            tileset: tileset,
            map: map.map,
            solid: map.solid,
            entities: [],
            backgrounds: [],
            bgcolor: map.bgcolor,
            x: 0,
            y: 0
        });

        this.height = this.map.length;
        this.width = this.map[0].length;

        _.each(map.items, function(item) {
            var item_cls = null;
            switch (item.type) {
            case 'double_jump':
                item_cls = DoubleJump;
            }

            if (item_cls !== null) {
                self.add_entity(new item_cls(engine, self, item.x, item.y));
            }
        });

        _.each(map.enemies, function(enemy) {
            var type = Enemy;

            if (enemy.type == 'momma') {
                type = Momma;
            }

            self.add_entity(new type(engine, enemy.x, enemy.y, enemy.dir,
                                     enemy.speed));
        });
    }

    _.extend(Tilemap.prototype, {
        render: function(ctx, x, y) {
            this.renderBackground(ctx, this.x - x, this.y - y);
            util.renderMap(ctx, this.map, this.tileset, this.x - x, this.y - y,
                           this.width, this.height);
        },

        // Render parallaxy backgroung image(s).
        renderBackground: function(ctx, x, y) {
            if (this.bgcolor) {
                ctx.fillStyle = this.bgcolor;
                ctx.fillRect(0, 0, engine.canvas.width, engine.canvas.height);
            }

            // bg 0 stays put, all others move.
            // FIXME: This probably looks ridiculous with more than 2 layers.
            for (var i = 0; i < this.backgrounds.length; i++) {
                var img = this.backgrounds[i];
                var ty = engine.HEIGHT - img.height + i * .5 * (engine.camera.maxBottom + y);
                for (var tx = i * x; tx < engine.canvas.height; tx += img.width) {
                    ctx.drawImage(img, tx, ty, img.width, img.height);
                }
            }
        },

        // Check which tiles a box collides with.
        collides: function(box) {
            var bounds = this.getContainingTiles(box),
                collides = {
                    solid: false,
                    stand: 9999
                };
            for (var ty = bounds.top; ty <= bounds.bottom; ty++) {
                for (var tx = bounds.left; tx <= bounds.right; tx++) {
                    var t = this.map[ty][tx];
                    if (_.include(this.solid, t)) {
                        collides.solid = true;
                        collides.stand = Math.min(collides.stand, ty * 16);
                        collides.x = tx;
                        collides.y = ty;
                    }
                }
            }

            return collides;
        },

        // Calculate the bounding box for which tiles are colliding with
        // the given box.
        getContainingTiles: function(box) {
            // Bound units are tiles, inclusive
            return {
                left: Math.max(0, Math.floor(box.left / this.tileset.tw)),
                top: Math.max(0, Math.floor(box.top / this.tileset.th)),
                right: Math.min(this.width - 1,
                                Math.floor(box.right / this.tileset.tw)),
                bottom: Math.min(this.height - 1,
                                 Math.floor(box.bottom / this.tileset.th))
            };
        },

        add_entity: function(entity) {
            this.entities.push(entity);
        },

        remove_entity: function(entity) {
            this.entities = _.reject(this.entities, function(e) {
                return e.uid === entity.uid;
            });
        }
    });

    return Tilemap;
});
