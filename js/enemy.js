define(function(require) {
    var _ = require('underscore'),
        Entity = require('core/entity');

    function Enemy(engine, x, y) {
        Entity.call(this, engine);
        return _.extend(this, {
            x: x,
            y: y,
            name: 'enemy'
        });
    }

    _.extend(Enemy.prototype, Entity.prototype, {
        tick: function() {
            this.x -= .2;
        },

        render: function(ctx, x, y) {
            ctx.fillStyle = 'black';
            ctx.fillRect(this.x - x, this.y - y, 16, 16);
        },

        collide: function() {
        }
    });

    return Enemy;
});