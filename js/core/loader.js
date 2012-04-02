define(function(require) {
    var _ = require('underscore');
    var $ = require('jquery');

    var handlers = require('core/loader/handlers');

    // Loads resources and handles callbacks to trigger when loading is
    // complete.
    function Loader(path) {
        this.resources = {};
        this.handlers = {};
        this.loadingCallbacks = [];
        this.path = path || '';
    }

    _.extend(Loader.prototype, {
        // Assign a callback to run when all resources are loaded.
        onload: function(callback) {
            if (this.isLoadingComplete()) {
                callback();
            } else {
                callback.called = false;
                this.loadingCallbacks.push(callback);
            }
        },

        // Load a JSON file that lists other resources to load.
        loadResources: function(url) {
            var self = this;

            // Add mock resource to block onload callbacks until all resources
            // are processed.
            this.resources[url] = {res: undefined, loaded: false};

            $.getJSON(this._path(url), function(data) {
                // Match sections with handlers and load all resources in those
                // sections.
                _.each(data, function(resources, key) {
                    if (key in self.handlers) {
                        var handler = self.handlers[key];

                        _.each(resources, function(url, id) {
                            self.resources[id] = {res: null, loaded: false};
                            handler.load(id, self._path(url),
                                         self._done_loading(id));
                        });
                    }
                });

                // Remove mock resource.
                self._done_loading(url)();
                delete self.resources[url];
            });
        },

        // Generate a path based on the prefix passed into the constructor.
        _path: function(url) {
            return this.path + url;
        },

        // Utility that handles triggering the onload callbacks.
        _done_loading: function(id) {
            var self = this;

            // Generate a callback that handles marking the resource as loaded
            // and triggering onload callbacks.
            return function(resource) {
                self.resources[id].loaded = true;
                self.resources[id].res = resource;

                _.each(self.loadingCallbacks, function(callback) {
                    if (!callback.called && self.isLoadingComplete()) {
                        callback();
                        callback.called = true;
                    }
                });
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
        },

        register_handler: function(handler, type) {
            this.handlers[type] = handler;
        }
    });

    // TODO: Figure out a better place for the asset path.
    var loader = new Loader('assets/');

    // Register default handlers.
    loader.register_handler(handlers.ImageHandler, 'images');
    loader.register_handler(handlers.JSONHandler, 'json');
    loader.register_handler(handlers.AudioHandler, 'audio');

    return loader;
});
