define(function(require) {
    var $ = require('jquery');

    var BaseHandler = {
        // Used to load a resource. Once the resource is loaded, callback
        // should be executed with the complete resource as an argument.
        load: function(id, url, callback) {
            var self = this;

            // By default, download as text and pass to process.
            $.ajax({
                url: url,
                dataType: 'text'
            }).done(function(data) {
                var result = self.process(id, url, data);
                callback(result);
            }).fail(function() {
                throw 'Error loading resource: ' + id;
            });
        },

        // Processes a loaded resource. Used for simple handlers that don't
        // need complex loading logic. May not be called if load is overridden.
        process: function(id, url, data) {
            return data;
        }
    };

    return BaseHandler;
});
