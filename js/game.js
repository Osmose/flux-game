require.config({
    paths: {
        underscore: 'lib/underscore',
        jquery: 'lib/jquery'
    }
});

require(['jquery', 'core/engine', 'core/loader'],
function($, Engine, loader) {
    $(function() {
        var engine = window.engine = new Engine();
        loader.loadResources('resources.json');

        loader.onload(function() {
            engine.startGame();
        });
    });
});
