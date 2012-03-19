define(function(require) {
    var _ = require('underscore'),
        $ = require('jquery');

    // Loads resources and handles callbacks to trigger when loading is
    // complete.
    function Loader(path) {
        this.resources = {};
        this.loadingCallback = false;
        this.path = path || '';
    }

    // Attached to Image objects to generate flipped versions.
    function flipped(horizontal, vertical) {
        var index = (horizontal ? 1 : 0) + (vertical ? 2 : 0);
        if (!('_flipped' in this)) {
            this._flipped = [null, null, null, null];
        }

        if (this._flipped[index] === null) {
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');
            canvas.width = this.width;
            canvas.height = this.height;

            var tw = (horizontal ? this.width : 0),
                th = (vertical ? this.height : 0),
                sx = (horizontal ? -1 : 1),
                sy = (vertical ? -1 : 1);
            ctx.translate(tw, th);
            ctx.scale(sx, sy);
            ctx.drawImage(this, 0, 0);

            this._flipped[index] = canvas;
        }

        return this._flipped[index];
    }

    _.extend(Loader.prototype, {
        // Assign a callback to run when all resources are loaded.
        onload: function(callback) {
            if (this.isLoadingComplete()) {
                callback();
            } else {
                this.loadingCallback = callback;
            }
        },

        // Load a plain image file.
        loadImage: function(url, id) {
            var img = new Image();
            this.resources[id] = {res: img, loaded: false};
            img.onload = this._done_loading(id);
            img.flipped = flipped;
            img.src = this._path(url);
        },

        // Load a JSON file.
        loadJSON: function(url, id) {
            var self = this;

            this.resources[id] = {res: null, loaded: false};
            $.getJSON(this._path(url), function(data) {
                self.resources[id].res = data;
                self._done_loading(id)();
            });
        },

        // Preload a sound.
        loadSound: function(url, id) {
            var snd = new Audio();
            this.resources[id] = {res: snd, loaded: false};
            snd.addEventListener('canplaythrough', this._done_loading(id), true);
            snd.setAttribute('id', 'preload-' + id);
            snd.src = this._path(url);
        },

        // Load a JSON file that lists other resources to load.
        loadResources: function(url) {
            var self = this;

            this.resources[url] = {res: undefined, loaded: false};
            $.getJSON(this._path(url), function(data) {
                if (data.hasOwnProperty('images')) {
                    _.each(data.images, self.loadImage.bind(self));
                }

                if (data.hasOwnProperty('json')) {
                    _.each(data.json, self.loadJSON.bind(self));
                }

                if (data.hasOwnProperty('sounds')) {
                    _.each(data.sounds, self.loadSound.bind(self));
                }

                self._done_loading(url)();
                delete self.resources[url];
            });
        },

        // Generate a path based on the prefix passed into the constructor.
        _path: function(url) {
            return this.path + url;
        },

        // Utility that handles triggering the onload callback.
        _done_loading: function(id) {
            var self = this;
            return function() {
                self.resources[id].loaded = true;
                if (self.loadingCallback && self.isLoadingComplete()) {
                    self.loadingCallback();
                    self.loadingCallback = false;
                }
            };
        },

        // Check if all resources are loaded.
        isLoadingComplete: function() {
            for (var k in this.resources) {
                if (this.resources.hasOwnProperty(k) &&
                    !this.resources[k].loaded){
                    return false;
                }
            }

            return true;
        },

        // Get a single loaded resource.
        get: function(id) {
            if (this.resources.hasOwnProperty(id)) {
                return this.resources[id].res;
            }

            return undefined;
        }
    });

    // TODO: Figure out a better place for the asset path
    return new Loader('assets/');
});
