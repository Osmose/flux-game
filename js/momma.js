define(function(require) {
    var _ = require('underscore'),
        Enemy = require('enemy'),
        util = require('util');

    function Momma(engine, x, y) {
        Enemy.call(this, engine, x, y);
    }

    _.extend(Momma.prototype, Enemy.prototype, {
        tick: function() {
            Enemy.prototype.tick.call(this);
        },

        render: function(ctx, x, y) {
            ctx.fillStyle = 'blue';
            ctx.fillRect(this.x - x, this.y - y, 16, 16);   
        },

        collide: function(obj) {
            if(obj.name == 'bullet') {
                this.engine.add_entity(new Momma(this.engine,
                                                 100, 256));
            }
        }
    });

    return Momma;
});