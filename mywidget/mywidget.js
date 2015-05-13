define(['jquery', 'widgets/js/widget'], function($, widget) {
    var MyWidgetView = widget.DOMWidgetView.extend({
        render: function() {
            MyWidgetView.__super__.render.apply(this, arguments);
            this._count_changed();
            this.listenTo(this.model, 'change:count', this._count_changed, this);
        },

        _count_changed: function() {
            var old_value = this.model.previous('count');
            var new_value = this.model.get('count');
            $(this.el).text(String(old_value) + ' -> ' + String(new_value));
        }
    });

    return {
        MyWidgetView: MyWidgetView
    }
});
