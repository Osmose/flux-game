define(function(require) {
    var _ = require('underscore');

    function Entity(engine, x, y) {
        _.extend(this, {
            uid: _.uniqueId(),
            engine: engine,
            type: 'entity',
            image: null,
            x: x,
            y: y,
            bounding_box: null
        });
    }

    _.extend(Entity.prototype, {
        tick: function() {
            // Override in subclass
        },

        render: function(ctx, x, y) {
            if (this.image !== null) {
                ctx.drawImage(this.image, this.x - x, this.y - y);
            }
        },

        collide: function(ctx, x, y) {
            // Override in subclass
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
