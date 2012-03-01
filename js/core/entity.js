define(function(require) {
    var _ = require('underscore');

    function Entity(engine) {
        _.extend(this, {
            engine: engine,
            x: 0,
            y: 0,
            bounding_box: {left: 0, top: 0, right: 16, bottom: 16}
        });
    }

    _.extend(Entity.prototype, {
        tick: function() {
            throw 'not implemented';
        },

        render: function(ctx) {
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