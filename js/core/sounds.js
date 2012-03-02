define(function(require) {
    var _ = require('underscore'),
        util = require('util');

    // take care of playing a bunch of sounds
    function Sounds() {
        this.current_player = 1;
    }

    _.extend(Sounds.prototype, {
        get_next_player: function(){
            this.current_player++;
            if (this.current_player >= 16)
                this.current_player = 1;

            return document.getElementById('sound-contain-' + this.current_player);
        },
        play: function(src){
            var player = this.get_next_player();
            player.src = src;
            player.play();
        }

    });

    return Sounds;
});
