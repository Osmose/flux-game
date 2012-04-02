define(function(require, exports) {
    var _ = require('underscore');
    var util = require('util');

    var BaseHandler = require('core/loader/base_handler');

    // Loads images.
    exports.ImageHandler = util.object(BaseHandler);
    _.extend(exports.ImageHandler, {
        // Attached to Image objects to generate flipped versions.
        flipped: function(horizontal, vertical) {
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
        },
        load: function(id, url, callback) {
            var img = new Image();
            img.onload = function() {
                callback(img);
            };
            img.flipped = this.flipped;
            img.src = url;
        }
    });

    // Loads JSON files
    exports.JSONHandler = util.object(BaseHandler)
    _.extend(exports.JSONHandler, {
        process: function(id, url, data) {
            return JSON.parse(data);
        }
    });

    // Loads audio into <audio> tags.
    exports.AudioHandler = util.object(BaseHandler);
    _.extend(exports.AudioHandler, {
        load: function(id, url, callback) {
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() {
                callback(audio);
            }, true);
            audio.setAttribute('id', 'preload-' + id);
            audio.src = url;
        }
    });
});
