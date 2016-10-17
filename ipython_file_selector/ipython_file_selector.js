if (IPython.version[0] === '4' && parseInt(IPython.version[2]) >= 2) {
    var path = 'jupyter-js-widgets';
} else {
    var path = 'widgets/js/widget';
    if (IPython.version[0] !== '3') {
        path = 'nbextensions/widgets/' + path;
    }
}

define(['jquery', path ], function($, widget) {
    var IPFileSelector = widget.DOMWidgetView.extend({
        render: function() {
            var count = 0;
            IPFileSelector.__super__.render.apply(this, arguments);
            var that = this;
            $button = $('<button>click</button>');
            $button.click(function() {
                count = count + 1;
                that.model.set('count', count);
                that.model.save_changes();
            });
            $(this.el).append($button);
            this.model.on('msg:custom', this.handleMsg, this);
            this.listenTo(this.model, 'change:current_path', this.current_path_changed, this);
            var msg = { 'type' : 'init' };
            this.send(msg);
        },

        handleMsg: function(msg) {
            console.log(msg);
        },

        current_path_changed: function() {
            console.log("current_path", this.model.get('current_path'));
        }

    });

    return {
        IPFileSelector: IPFileSelector
    }
});
