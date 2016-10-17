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
            this.$notebookList = $("<div></div>").addClass("list_container");
            this.$notebookHeader = $("<div class='row list_header'><ul class='breadcrumb'></ul></div>").appendTo(this.$notebookList);

            this.$breadcrumbs = this.$notebookHeader.find('.breadcrumb');

            IPFileSelector.__super__.render.apply(this, arguments);
            var that = this;
            $(this.el).append(this.$notebookList);

            this.model.on('msg:custom', this.handleMsg, this);
            this.home_path = this.model.get('home_path');

            // trigger first change
            this.change_path(this.home_path);
            this.current_path = this.home_path;
            this.current_path_changed();


            this.listenTo(this.model, 'change:current_path', this.current_path_changed, this);
            this.listenTo(this.model, 'change:subdirs', this.subdirs_changed, this);
            var msg = { 'type' : 'init' };
            this.send(msg);
        },

        handleMsg: function(msg) {
        },

        path_click: function(e) {
            var path = $(this).attr('data-path');
            e.data.context.change_path.apply(e.data.context, [ path ]);
        },

        change_path: function(path) {
            this.model.set("current_path", path);
            this.model.save_changes();
        },

        current_path_changed: function() {
            this.current_path = this.model.get('current_path');
            this.$breadcrumbs.html("");
            this.$home = $("<li><a href='#' data-path='" + this.home_path + "'><i class='fa fa-home'></i></a></li>").appendTo(this.$breadcrumbs);
            var crumbs = this.current_path.substring(this.home_path.length).split('/');
            var crumbpath = this.home_path;
            for (var index in crumbs) {
                if (crumbs[index].length > 0) {
                    crumbpath = crumbpath + "/" + crumbs[index];
                    this.$newrow = $("<li><a href='#' data-path='" + crumbpath + "'>" + crumbs[index] + "</a></li>").appendTo(this.$breadcrumbs);
                }
            }
            this.$breadcrumbs.find("a").click({ context : this }, this.path_click);
        },

        subdirs_changed: function() {
            $("[data-type='folder']").remove();
            this.subdirs = this.model.get("subdirs");
            var subdir_elements = [ ];
            for (var i in this.subdirs) {
                var subdir = this.subdirs[i];
                var $row = $("<div data-type='folder'></div>").addClass("list_item").addClass("row");
                var $container = $("<div class='col-md-12'></div>").appendTo($row);
                var $checkbox = $("<input type='checkbox' />").appendTo($container);
                var $icon = $("<i class='item_icon folder_icon icon-fixed-width'></i>").appendTo($container);
                var $item = $("<a class='item_link' href='#' data-path='" + subdir + "'><span class='item_name'>" + subdir.substring(this.current_path.length) + "</span></a>").appendTo($container);
                $item.click({ context : this }, this.path_click);
                $row.prepend($("::before"));
                $row.append($("::after"));
                subdir_elements.push($row);
            }
            this.$notebookHeader.after(subdir_elements);
        }
    });

    return {
        IPFileSelector: IPFileSelector
    }
});
