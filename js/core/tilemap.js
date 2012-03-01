define(function(require) {
    var _ = require('underscore'),
        util = require('util');

    function Tilemap(engine, tileset, map) {
        _.extend(this, {
            tileset: tileset,
            map: map,
            x: 0,
            y: 0
        });

        this.height = map.length;
        this.width = map[0].length;
    }

    _.extend(Tilemap.prototype, {
        render: function(ctx) {
            util.renderMap(ctx, this.map, this.tileset, this.x, this.y,
                           this.width, this.height);
        }
    });

    return Tilemap;
});
