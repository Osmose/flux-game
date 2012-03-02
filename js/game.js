require.config({
    paths: {
        underscore: 'lib/underscore',
        jquery: 'lib/jquery'
    }
});

require(['jquery', 'core/engine', 'core/loader'],
function($, Engine, loader) {
    $(function() {
        loader.loadResources('resources.json');

        loader.onload(function() {
            var engine = window.engine = new Engine();
            engine.startGame();
        });

        var snd_toggle = $('#snd_toggle');
        snd_toggle.click(function () {
            var on = (snd_toggle.html() == "Turn sound on");
            var soundgarden = document.getElementById('audio');
            window.localStorage.setItem("music", (on) ? 'on' : 'off');
            if (on) {
                snd_toggle.html("Turn sound off");
                soundgarden.play();
            } else {
                snd_toggle.html("Turn sound on");
                soundgarden.pause();
            }
        });

        if (!window.localStorage.getItem("music")) {
            window.localStorage.setItem("music", 'on');
        }

        if (window.localStorage.getItem("music") === 'on') {
            snd_toggle.html("Turn sound off");
            document.getElementById('audio').play();
        }
    });
});

