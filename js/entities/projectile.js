define(function(require) {
    var _ = require('underscore'),
        loader = require('core/loader'),
        util = require('util'),

        Entity = require('entity');

    function Projectile(engine, x, y, speed, dir) {
        Entity.call(this, engine, x, y);
        return _.extend(this, {
            type: 'projectile',
            speed: speed,
            dir: dir
        });
    }

    _.extend(Projectile.prototype, Entity.prototype, {
        tick: function() {
            this.x += this.speed * (this.dir == util.LEFT ? -1 : 1);
            return true;
        }
    });

    return Projectile;
});
