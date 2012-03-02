define(function(require) {
    var _ = require('underscore'),
        Entity = require('core/entity'),
        util = require('util');

    function Door(engine, x, y, level) {
        Entity.call(this, engine);
        return _.extend(this, {
            level: level,
            x: x,
            y: y,
            bounding_box: {left:0, top:0, right:5, bottom:5}
        });
    }

    _.extend(Door.prototype, Entity.prototype, {
        render: function(ctx, x, y) {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x - x, this.y - y, 10, 10);
        },

        collide: function(obj) {
            if (obj.name == 'player') {
                this.engine.change_level(this.level);
            }
        }
    });

    return Door;
});
