define(function(require) {
    var _ = require('underscore'),
        $ = require('jquery');

    return {
        LEFT: 4, WEST: 4,
        RIGHT: 1, EAST: 1,
        UP: 2, NORTH: 2,
        DOWN: 3, SOUTH: 3,

        // Gets an attribute on an object, returning a default value if the
        // attribute does not exist
        oget: function(obj, attr, def) {
            if (def === undefined) {
                def = '';
            }

            if (!_.isEmpty(obj) && obj.hasOwnProperty(attr)) {
                return obj[attr];
            } else {
                return def;
            }
        },

        // Initializes a canvas with the given width, height, and scale.
        // If not canvas is given, creates and returns a new canvas.
        canvas: function(width, height, scale, canvas) {
            if (canvas === undefined) canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            canvas.width = width * scale;
            canvas.height = height * scale;
            ctx.scale(scale, scale);
            ctx.mozImageSmoothingEnabled = false;

            return canvas;
        },

        // Render a map (double array) to a canvas using the given tileset
        renderMap: function(ctx, map, tileset, x, y, width, height) {
            for (var ty = 0; ty < height; ty++) {
                for (var tx = 0; tx < width; tx++) {
                    tileset.drawTile(ctx, map[ty][tx], x + (tx * tileset.tw),
                                     y + (ty * tileset.th));
                }
            }
        },

        // Maps direction numbers to string names. Used for serialization.
        directionToString: function(direction) {
            switch (direction) {
            case this.WEST: return 'west';
            case this.EAST: return 'east';
            case this.NORTH: return 'north';
            case this.SOUTH: return 'south';
            }

            return undefined;
        },

        // Maps direction numbers to box side names.
        dirToBoxSide: function(direction) {
            switch (direction) {
            case this.WEST: return 'left';
            case this.EAST: return 'right';
            case this.NORTH: return 'top';
            case this.SOUTH: return 'bottom';
            }

            return undefined;
        },

        // Checks if two boxes are colliding
        // Boxes are objects with keys: left, right, top, bottom
        box_collision: function(box1, box2) {
            if (box1.right <= box2.left) return false;
            if (box1.left > box2.right) return false;
            if (box1.bottom <= box2.top) return false;
            if (box1.top > box2.bottom) return false;

            return true;
        },

        // Checks if one box contains another.
        // Returns the broken side, or null if contained.
        box_contains: function(box, container) {
            if (box.left < container.left) return this.LEFT;
            if (box.right > container.right) return this.RIGHT;
            if (box.top < container.top) return this.UP;
            if (box.bottom > container.bottom) return this.DOWN;

            return null;
        },

        // Empty function
        noop: function() {},

        // Render a string using the given tileset.
        // Wraps text after `wrap` characters.
        text: function(ctx, fontTileset, text, x, y, wrap) {
            var fx = x,
                fy = y;
            for (var k = 0; k < text.length; k++) {
                fontTileset.drawTile(ctx, text.charCodeAt(k), fx, fy);
                fx += fontTileset.tw;

                // Wrap text
                if (k !== 0 && (k % wrap) === 0) {
                    fx = x;
                    fy += fontTileset.th;
                }
            }
        },

        // Gets the position of the mouse in tiles from a mouse event handler.
        mouseTilePos: function(elem, event, tw, th) {
            var offset = $(elem).offset(),
                x = event.pageX - offset.left,
                y = event.pageY - offset.top,
                tx = Math.floor(x / tw),
                ty = Math.floor(y / th);
            return {tx: tx, ty: ty};
        }
    };
});
