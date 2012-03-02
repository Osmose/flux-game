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

            setTimeout(function() {
                document.getElementById('wonderful').play();
            }, 300);
        });
    });
});
