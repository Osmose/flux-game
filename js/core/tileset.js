define(function(require) {
    var _ = require('underscore');

    // Handles grabbing specific tiles from a tileset
    function Tileset(img, tileWidth, tileHeight, xGap, yGap, anim) {
        _.extend(this, {
            img: img,
            tw: tileWidth,
            th: tileHeight,
            xGap: xGap,
            yGap: yGap,
            img_tw: Math.floor(img.width / (tileWidth + xGap)),
            img_th: Math.floor(img.height / (tileHeight + yGap)),
            anim: anim
        });
    }

    _.extend(Tileset.prototype, {
        drawTile: function(ctx, tilenum, x, y) {
            var tilepos = this.getTilePos(tilenum);
            ctx.drawImage(this.img,
                          tilepos.x, tilepos.y, this.tw, this.th,
                          x, y, this.tw, this.th);
        },

        // Return the tilenum at the given position.
        getTilenum: function(tx, ty) {
            if (tx > this.img_tw || ty > this.img_th) {
                return null;
            }

            return (ty * this.img_tw) + tx;
        },

        // Return the pixel position for the given tile number.
        getTilePos: function(tilenum) {
            var ty = Math.floor(tilenum / this.img_tw),
                tx = tilenum % this.img_tw;

            return {
                x: (tx * this.tw) + (tx * this.xGap),
                y: (ty * this.th) + (ty * this.yGap)
            };
        },

        // Return a Canvas object of the requested tile.
        getTileCanvas: function(tilenum) {
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');

            canvas.width = this.tw;
            canvas.height = this.th;
            this.drawTile(ctx, tilenum, 0, 0);

            return canvas;
        }
    });

    return Tileset;
});
