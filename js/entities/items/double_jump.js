define(function(require) {
    var _ = require('underscore'),

        Item = require('entities/item');

    function DoubleJump(engine, tilemap, x, y) {
        Item.call(this, engine, tilemap, x, y, 'dbl_jump');
    }

    _.extend(DoubleJump.prototype, Item.prototype, {
        item: function(player) {
            player.powerups.double_jump = true;
        }
    });

    return DoubleJump;
});
