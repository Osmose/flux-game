require.config({
    paths: {
        underscore: 'lib/underscore',
        jquery: 'lib/jquery'
    }
});

require(['jquery', 'underscore', 'util', 'core/loader', 'core/tilemap', 'core/tileset'],
function($, _, util, loader, Tilemap, Tileset) {
    var curtilemap_id = 'first',
        tilemaps = {},
        tileset = null,
        $map = null,
        $palette = null,
        $code = null,
        curTile = 0;

    $(function() {
        $map = $('#map');
        $palette = $('#palette');
        $code = $('#code');

        // Bind painting
        function paint(e) {
            var p = util.mouseTilePos(this, e, 48, 48);
            curTilemap().map[p.ty][p.tx] = curTile;
            refreshMap();

            $code.val(JSON.stringify(curTilemap().map));
        };

        var drawing = false;
        $map.mousedown(function(e) {
            drawing = true;
            paint.call(this, e);
        }).mousemove(function(e) {
            if (drawing) {
                paint.call(this, e);
            }
        }).mouseup(function(e) {
            drawing = false;
        });

        $palette.click(function(e) {
            var p = util.mouseTilePos(this, e, 48, 48),
                tilenum = tileset.getTilenum(p.tx, p.ty);
            curTile = tilenum;
            refreshPalette();
        });

        loader.loadResources('resources.json');

        loader.onload(function() {
            tileset = new Tileset(loader.get('tileset'), 16, 16, 0, 0, {});

            _.each(loader.get('maps'), function(map, id) {
                tilemaps[id] = new Tilemap(null, tileset, map);
            });

            init('first');
        });
    });

    function init(tilemap_id) {
        var tilemap = curTilemap(),
            map = $map.get(0),
            palette = $palette.get(0);
        util.canvas(tilemap.width * 16, tilemap.height * 16, 3, map);
        util.canvas(16 * 8, 16 * 4, 3, palette);

        refreshPalette();
        refreshMap();
    }

    function refreshMap() {
        var ctx = $map.get(0).getContext('2d'),
            tilemap = curTilemap();
        ctx.fillStyle = '#FFFF8B';
        ctx.fillRect(0, 0, tilemap.width * 16, tilemap.height * 16);
        tilemap.render(ctx, 0, 0);
    }

    function refreshPalette() {
        var canvas = $palette.get(0),
            ctx = canvas.getContext('2d'),
            tilepos = tileset.getTilePos(curTile);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tileset.img, 0, 0);
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 1;
        ctx.strokeRect(tilepos.x, tilepos.y, 16, 16);
    }

    function curTilemap() {
        return tilemaps[curtilemap_id];
    }
});
