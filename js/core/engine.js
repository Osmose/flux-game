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
            tilemap_id: 'first',

            camera: {
                x: 0,
                y: 0
            }
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
        this.player = new Player(this);
        this.add_entity(this.player);

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
            var removes = [];
            for(var i=0, len=this.entities.length; i<len; i++) {
                var e = this.entities[i];
                if(e.tick() === false) {
                    removes.push(e);
                }
            }

            var queue = [];
            for(var i=0, len=this.entities.length; i<len; i++) {
                var remove = false;
                for(var j=0; j<removes.length; j++) {
                    if(this.entities[i] == removes[j]) {
                        remove = true;
                    }
                }

                if(!remove) {
                    queue.push(this.entities[i]);
                }
            }

            this.entities = queue;
            this.kb.tick();
        },

        // Render the screen.
        render: function() {
            var self = this;

            this.ctx.fillStyle = '#FFFF8B';
            this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

            this.centerCamera();
            this.tilemaps[this.tilemap_id].render(this.ctx, this.camera.x,
                                                  this.camera.y);
            for(var i=0, len=this.entities.length; i<len; i++) {
                this.entities[i].render(this.ctx, this.camera.x, this.camera.y);
            }
        },

        // Center camera on player
        centerCamera: function() {
            var maxLeft = 0,
                maxRight = (this.curTilemap().width * 16) - this.WIDTH,
                maxTop = 0,
                maxBottom = (this.curTilemap().height * 16) - this.HEIGHT;

            this.camera.x = this.player.x - ((this.WIDTH / 2) - 8);
            this.camera.y = this.player.y - ((this.HEIGHT / 2) - 8);

            this.camera.x = Math.max(this.camera.x, maxLeft);
            this.camera.x = Math.min(this.camera.x, maxRight);
            this.camera.y = Math.max(this.camera.y, maxTop);
            this.camera.y = Math.min(this.camera.y, maxBottom);
        },

        curTilemap: function() {
            return this.tilemaps[this.tilemap_id];
        },

        // Add an entity
        add_entity: function(ent) {
            this.entities.push(ent);
        },

        // Check if the given box collides with other objects
        // in the game.
        collides: function(box) {
            var stand = 9999,
                solid = false;

            /*var contains = util.box_contains(box, this.collision_box);
            if (contains !== null) {
                stand = Math.min(stand, this.collision_box[util.dirToBoxSide(contains)]);
                solid = true;
            }*/

            var tilemap = this.tilemaps[this.tilemap_id],
                tcol = tilemap.collides(box);
            if (tcol.solid) {
                stand = Math.min(stand, tcol.stand);
                solid = true;
            }

            return {
                solid: solid,
                stand: stand,
                x: tcol.x,
                y: tcol.y
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
