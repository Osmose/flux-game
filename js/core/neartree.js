define(function(require) {
    var _ = require('underscore');
    
    function Neartree() {
        this.boxes = {};
    }

    _.extend(Neartree.prototype, {
        clear: function() {
            this.boxes = {};
        },

        add: function(x, y, obj) {
            var s = x + '-' + y;
            if(!this.boxes[s]) {
                this.boxes[s] = [];
            }
            this.boxes[s].push(obj);
        },

        get: function(x, y) {
            return this.boxes[x + '-' + y];
        }
    });

    return Neartree;
});