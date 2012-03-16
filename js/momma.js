define(function(require) {
    var _ = require('underscore'),
        Entity = require('entity'),
        MommaChild = require('momma-child'),
        util = require('util');

    function Momma(engine, x, y, dir, speed) {
        Entity.call(this, engine, x, y, dir);
        _.extend(this, {
            x: x,
            y: y,
            speed: speed
        });
    }

    _.extend(Momma.prototype, Entity.prototype, {
        tick: function() {
            this.x -= this.speed;
        },

        render: function(ctx, x, y) {
            ctx.fillStyle = 'blue';
            ctx.fillRect(this.x - x, this.y - y, 16, 16);
        },

        collide: function(obj) {
            if(obj.name == 'bullet') {
                var start_x = this.x - 10;
                this.engine.add_entity(
                    new MommaChild(this.engine,
                                   start_x + Math.random()*7, 256,
                                   Math.random() > .5 ? util.LEFT : util.RIGHT,
                                   1.0)
                );
                this.engine.add_entity(
                    new MommaChild(this.engine,
                                   start_x + 10 + Math.random()*7, 256,
                                   Math.random() > .5 ? util.LEFT : util.RIGHT,
                                   1.0)
                );
                this.engine.add_entity(
                    new MommaChild(this.engine,
                                   start_x + 20 + Math.random()*7, 256,
                                   Math.random() > .5 ? util.LEFT : util.RIGHT,
                                  1.0)
                );
            }
        }
    });

    return Momma;
});
