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
            IPFileSelector.__super__.render.apply(this, arguments);
            $(this.el).text("Hello world");
            this.model.on('msg:custom', this.handleMsg, this);
            var msg = { 'type' : 'init' };
            this.send(msg);
        },

        handleMsg: function(msg) {
            console.log(msg);
        }

    });

    return {
        IPFileSelector: IPFileSelector
    }
});
