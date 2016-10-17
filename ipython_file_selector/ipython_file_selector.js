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
            var msg = { 'type' : 'init' };
            this.send(msg);
        },

    });

    return {
        IPFileSelector: IPFileSelector
    }
});
