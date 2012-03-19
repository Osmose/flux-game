define(function(require) {
    var _ = require('underscore'),
        loader = require('core/loader'),
        util = require('util');

    function Radio() {
        var self = this;
        _.extend(this, {
            path: 'assets/audio/radio/',
            curSong: 0,
            songs: _.shuffle([
                loader.get('music0'),
                loader.get('music1'),
                loader.get('music2'),
                loader.get('music3'),
                loader.get('music4'),
                loader.get('music5')
            ]),
            snd_static: loader.get('static')
        });

        // Bind post-playback events
        _.each(this.songs, function(song) {
            song.addEventListener('ended', self.playstatic.bind(self), true);
            song.volume = 0.5;
        });
    }

    _.extend(Radio.prototype, {
        start: function() {
            this.playstatic();
        },
        playstatic: function() {
            var self = this;
            this.snd_static.play();
            setTimeout(function() {
                self.curSong++;
                if (self.curSong >= self.songs.length) {
                    self.curSong = 0;
                }

                util.audio.fade(self.snd_static, self.songs[self.curSong],
                                1500, 200);
            }, 3000);
        },
        playnext: function() {
            this.curSong++;
            if (this.curSong >= this.songs.length) {
                this.curSong = 0;
            }

            this.songs[this.curSong].play();
        }
    });

    return Radio;
});
