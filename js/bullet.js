define(function(require) {
    var _ = require('underscore'),
        Entity = require('core/entity');

    function Bullet(engine, x, y) {
        Entity.call(this, engine);
        this.x = x;
        this.y = y;
    }

    _.extend(Bullet.prototype, Entity.prototype, {
        tick: function() {
            this.x += 0.5;
        },
        
        render: function(ctx) {
            ctx.fillStyle = '#AABBDD';
            ctx.fillRect(this.x, this.y, 16, 16);
        }
    });

    return Bullet;
});
