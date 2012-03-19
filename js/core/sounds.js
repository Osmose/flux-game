define(function(require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        util = require('util'),
        loader = require('core/loader');

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
        play: function(id) {
            var player = this.get_next_player(),
                audio = loader.get(id),
                src = id;

            if (audio !== undefined) {
                src = audio.src;
            }

            player.src = src;
            player.play();
        },

        // Play an audio file, but do not play again while it's playing.
        // src can only be a sound resource name from resources.json.
        play_once: function(id) {
            loader.get(id).play();
        }

    });

    return Sounds;
});
