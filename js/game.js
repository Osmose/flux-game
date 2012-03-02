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
            var on = (snd_toggle.html() == "On");
            var soundgarden = document.getElementById('audio');
            if (on) {
                snd_toggle.html("Shhh....");
                soundgarden.play()
            } else {
                snd_toggle.html("On");
                soundgarden.pause()
            }
        });
    });
});

