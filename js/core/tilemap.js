define(function(require) {
    var _ = require('underscore'),
        util = require('util');

    function Tilemap(engine, tileset, map) {
        _.extend(this, {
            tileset: tileset,
            map: map.map,
            solid: map.solid,
            x: 0,
            y: 0
        });

        this.height = this.map.length;
        this.width = this.map[0].length;
    }

    _.extend(Tilemap.prototype, {
        render: function(ctx, x, y) {
            util.renderMap(ctx, this.map, this.tileset, this.x - x, this.y - y,
                           this.width, this.height);
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
                    switch (this.map[ty][tx]) {
                    case 1:
                        collides.solid = true;
                        collides.stand = Math.min(collides.stand, ty * 16);
                        collides.x = tx;
                        collides.y = ty;
                        break;
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
        }
    });

    return Tilemap;
});
