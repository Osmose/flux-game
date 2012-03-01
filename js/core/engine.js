define(function(require) {
    var _ = require('underscore'),
        util = require('util'),
        loader = require('core/loader'),

        KeyboardControls = require('core/keyboardcontrols'),

        Player = require('player'),
        Tileset = require('core/tileset'),
        Tilemap = require('core/tilemap');

    var requestFrame = (function() {
        return window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            function(callback) {
                setTimeout(callback, 30);
            };
    })();

    // Handles the game loop, timing, and dispatching processing and rendering
    // to the active tilemap, entities, and player.
    function Engine(game_data) {
        var self = this;
        _.extend(this, {
            WIDTH: 160,
            HEIGHT: 144,
            SCALE: 3,

            kb: new KeyboardControls(),
            running: false,
            tilemaps: {},
            tileset: new Tileset(loader.get('tileset'), 16, 16, 0, 0, {}),
            tilemap_id: 'first'
        });

        // Bind the engine to the loop function used as a callback
        // in request frame.
        this.bound_loop = this.loop.bind(this);

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = this.WIDTH * this.SCALE;
        this.canvas.height = this.HEIGHT * this.SCALE;
        this.ctx.scale(this.SCALE, this.SCALE);
        this.ctx.mozImageSmoothingEnabled = false;

        this.collision_box = {left: 0, top: 0, right: this.WIDTH,
                              bottom: this.HEIGHT};

        this.entities = [];
        this.add_entity(new Player(this));

        // Load tilemaps
        var maps = loader.get('maps');
        _.each(maps, function(map, id) {
            self.tilemaps[id] = new Tilemap(self, self.tileset, map);
        });

        document.getElementById('game').appendChild(this.canvas);
    }

    _.extend(Engine.prototype, {
        // Process and render a single frame, and schedule another loop
        // for the next frame.
        loop: function() {
            this.tick();
            this.render();
            if (this.running) {
                requestFrame(this.bound_loop, this.canvas);
            }
        },

        // Process one frame of behavior.
        tick: function() {
            for(var i=0, len=this.entities.length; i<len; i++) {
                this.entities[i].tick();
            }
        },

        // Render the screen.
        render: function() {
            var self = this;

            this.ctx.fillStyle = '#FFFF8B';
            this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

            this.tilemaps[this.tilemap_id].render(this.ctx);

            for(var i=0, len=this.entities.length; i<len; i++) {
                this.entities[i].render(this.ctx);
            }
        },

        // Add an entity
        add_entity: function(ent) {
            this.entities.push(ent);
        },

        // Check if the given box collides with other objects
        // in the game.
        collides: function(box) {
            var contains = util.box_contains(box, this.collision_box),
                boundary = false,
                solid = false;
            if (contains !== null) {
                boundary = {
                    side: contains,
                    pos: this.collision_box[util.dirToBoxSide(contains)]
                };
                solid = true;
            }

            return {
                solid: solid,
                boundary: boundary
            };
        },

        // Start the game loop.
        startGame: function() {
            this.running = true;
            this.loop();
        }
    });

    return Engine;
});
