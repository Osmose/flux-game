define(function(require) {
    var _ = require('underscore'),

        Entity = require('entity');

    function Textbox(engine, text, text2, endDelay) {
        Entity.call(this, engine);
        _.extend(this, {
            text: text || '',
            text2: text2 || '',
            pos: 0,
            speed: 4, // Frames per character
            counter: 0,
            endDelay: endDelay || 120,
            bounding_box: {left: 0, top: 0, right: 0, bottom: 0}
        });
    }

    _.extend(Textbox.prototype, Entity.prototype, {
        tick: function() {
            if (this.pos < (this.text.length + this.text2.length)) {
                if (this.counter <= 0) {
                    this.counter = this.speed;
                    this.pos++;
                    engine.play('talk');
                }
                this.counter--;
            } else {
                this.endDelay--;
                if (this.endDelay <= 0) {
                    engine.remove_entity(this);
                }
            }
        },
        render: function(ctx, cx, cy) {
            ctx.fillStyle = '#000000';
            ctx.fillRect(20, 12, 200, 32);
            ctx.font = '8px "04b03Regular"';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(this.text.slice(0, this.pos), 24, 24);
            if (this.pos >= this.text.length) {
                ctx.fillText(this.text2.slice(0, this.pos - this.text.length), 24, 36);
            }
        }
    });

    return Textbox;
});
