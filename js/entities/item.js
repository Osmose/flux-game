define(function(require) {
    var _ = require('underscore'),
        loader = require('core/loader'),

        Entity = require('entity');

    function Item(engine, tilemap, x, y, graphic_id) {
        _.extend(this, {
            uid: _.uniqueId(),
            engine: engine,
            tilemap: tilemap,
            x: x,
            y: y,
            graphic: loader.get(graphic_id),
            bounding_box: {left: 1, right: 15, top: 0, bottom: 15}
        });
    }

    _.extend(Item.prototype, Entity.prototype, {
        render: function(ctx, x, y) {
            ctx.drawImage(this.graphic, this.x - x, this.y - y);
        },
        collide: function(object) {
            if (object.name === 'player') {
                this.item(object);
                this.engine.remove_entity(this);
                this.tilemap.remove_entity(this);
            }
        },
        item: function(player) {
            throw 'Not implemented!';
        }
    });

    return Item;
});
