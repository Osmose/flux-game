define(['underscore'], function(_) {
    function KeyboardControls() {
        var self = this;
        this.keys = {};
        this._pressed = {};

        _.extend(self, {
            'LEFT' : 37,
            'UP' : 38,
            'RIGHT' : 39,
            'DOWN' : 40,
            'A': 68,
            'B': 70,
            'SPACE': 32,
        });

        this.letter = function(l) {
            return self.keys[l.toUpperCase().charCodeAt(0)];
        };

        this.pressed = function(code) {
            return !!self._pressed[code];
        };

        this.tick = function() {
            self._pressed = {};
        };

        function setKey(code, status) {
            if (code) {
                if(!self.keys[code]) {
                    self._pressed[code] = status;
                }

                self.keys[code] = status;
            }
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
