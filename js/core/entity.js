define(function(require) {
    var _ = require('underscore');

    function Entity(engine) {
        _.extend(this, {
            uid: _.uniqueId(),
            engine: engine,
            x: 0,
            y: 0,
            bounding_box: {left: 0, top: 0, right: 15, bottom: 15}
        });
    }

    _.extend(Entity.prototype, {
        tick: function() {
        },

        render: function(ctx, x, y) {
            throw 'not implemented';
        },

        collide: function(ctx, x, y) {
            throw 'not implemented';
        },

        collision_box: function(dx, dy) {
            return {
                left: this.x + dx + this.bounding_box.left,
                right: this.x + dx + this.bounding_box.right,
                top: this.y + dy + this.bounding_box.top,
                bottom: this.y + dy + this.bounding_box.bottom
            };
        }
    });

    return Entity;
});
