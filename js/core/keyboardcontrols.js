define(['underscore'], function(_) {
    function KeyboardControls() {
        var self = this;
        this.keys = {};

        _.extend(self, {
            'LEFT' : 37,
            'UP' : 38,
            'RIGHT' : 39,
            'DOWN' : 40,
            'A': 68,
            'B': 70
        });

        this.letter = function(l) {
            return self.keys[l.toUpperCase().charCodeAt(0)];
        };

        function setKey(code, status) {
            if (code) self.keys[code] = status;
        }

        window.addEventListener('keydown', function(e) {
            setKey(e.keyCode, true);
        });
        window.addEventListener('keyup', function(e) {
            setKey(e.keyCode, false);
        });
    };

    return KeyboardControls;
});
