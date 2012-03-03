define(function(require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        util = require('util');

    // take care of playing a bunch of sounds
    function Sounds() {
        _.extend(this, {
            TRACKS: 16,

            current_player: 0
        });

        // Spawn tracks.
        for (var i = 0; i < this.TRACKS; i++) {
            $('body').append($('<audio>').attr('id', 'snd-' + i))
        }
    }

    _.extend(Sounds.prototype, {
        get_next_player: function(){
            var player = document.getElementById('snd-' + this.current_player);

            this.current_player++;
            this.current_player %= this.TRACKS;

            return player;
        },

        // Play an audio file.
        // src can either be the path to an audio file or the name
        // of a sound resource from resources.json.
        play: function(src){
            var player = this.get_next_player(),
                preloaded = $('audio#preload-' + src);

            if (preloaded.length) {
                player.src = preloaded.attr('src');
            } else {
                player.src = src;
            }

            player.play();
        }

    });

    return Sounds;
});
