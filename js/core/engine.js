define(function(require) {
    var _ = require('underscore'),
        util = require('util'),
        loader = require('core/loader'),

        KeyboardControls = require('core/keyboardcontrols'),

        Player = require('player'),
        Enemy = require('enemy'),
        Momma = require('momma'),
        Sounds = require('core/sounds'),
        Tileset = require('core/tileset'),
        Tilemap = require('core/tilemap'),
        Neartree = require('core/neartree');

    var requestFrame = (function() {
        return window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            function(callback) {
                setTimeout(callback, 30);
            };
    })();

    function get_bounding_points(e) {
        return (
            [[e.x+e.bounding_box.left, e.y+e.bounding_box.top],
             [e.x+e.bounding_box.right, e.y+e.bounding_box.top],
             [e.x+e.bounding_box.left, e.y+e.bounding_box.bottom],
             [e.x+e.bounding_box.right, e.y+e.bounding_box.bottom]]
        );
    }

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
            neartree: new Neartree(),

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
        this.removes = [];
        this.player = new Player(this);
        this.add_entity(this.player);

        // Add enemies.
        enemies = loader.get('enemies');
        for (var i in enemies) {
            this.add_entity(new Enemy(this, enemies[i].x, enemies[i].y,
                                            enemies[i].dir, enemies[i].speed));
        }

        this.sounds = new Sounds();

        // Load tilemaps
        var maps = loader.get('maps');
        _.each(maps, function(map, id) {
            self.tilemaps[id] = new Tilemap(self, self.tileset, map);
            _.each(map.backgrounds, function(bg, bid) {
                self.tilemaps[id].backgrounds[bid] = loader.get(bg);
            });
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
            var neartree = this.neartree;
            neartree.clear();
            this.removes = []

            for(var i=0, len=this.entities.length; i<len; i++) {
                var e = this.entities[i];
                if(e.tick() === false) {
                    this.removes.push(e);
                }
                else {
                    e._bb = {left: e.x + e.bounding_box.left,
                             right: e.x + e.bounding_box.right,
                             top: e.y + e.bounding_box.top,
                             bottom: e.y + e.bounding_box.bottom};
                    var points = get_bounding_points(e);
                    for(var x=0; x<points.length; x++) {
                        var point = points[x];
                        neartree.add(Math.round(point[0]/128),
                                     Math.round(point[1]/128),
                                     e);
                    }
                }
            }

            for(var i=0, len=this.entities.length; i<len; i++) {
                this.check_collisions(this.entities[i]);
            }

            var queue = [];
            for(var i=0, len=this.entities.length; i<len; i++) {
                var remove = false;
                var e = this.entities[i];

                for(var j=0; j<this.removes.length; j++) {
                    if(e == this.removes[j]) {
                        remove = true;
                    }
                }

                if(!remove) {
                    queue.push(e);
                }
            }

            this.entities = queue;
            this.kb.tick();
        },

        check_collisions: function(e) {
            var points = get_bounding_points(e);
            for(var i=0; i<points.length; i++) {
                var point = points[i];
                var objs = this.neartree.get(Math.round(point[0]/128),
                                             Math.round(point[1]/128));
                if(objs) {
                    for(var x=0; x<objs.length; x++) {
                        if(objs[x] != e &&
                           e._bb &&
                           util.box_collision(e._bb, objs[x]._bb)) {
                            e.collide(objs[x]);
                            return;
                        }
                    }
                }
            }
        },

        // Render the screen.
        render: function() {
            var self = this;

            this.centerCamera();
            this.tilemaps[this.tilemap_id].render(this.ctx, this.camera.x,
                                                  this.camera.y);
            for (var i=0, len=this.entities.length; i<len; i++) {
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

        add_entity: function(ent) {
            this.entities.push(ent);
        },

        remove_entity: function(ent) {
            this.removes.push(ent);
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

        play: function(src){
            this.sounds.play(src);
        },

        // Start the game loop.
        startGame: function() {
            this.running = true;
            this.loop();
        }
    });

    return Engine;
});
