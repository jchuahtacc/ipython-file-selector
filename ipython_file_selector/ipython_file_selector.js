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
            var msg = { 'type' : 'init' };
            this.send(msg);
        },

        handleMsg: function(msg) {
            if (msg['type'] == 'dir_update') {
                this.refresh_directory();
            }
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

        refresh_directory: function() {
            $("[data-type='parent']").remove();
            if (this.current_path != this.home_path) {
                var crumbs = this.current_path.substring(this.home_path.length).split('/');
                var crumbpath = this.home_path;
                for (var i = 1; i < crumbs.length - 1; i = i + 1) {
                    crumbpath = crumbpath + "/" + crumbs[i];
                }
                console.log("parent", crumbpath);
                var $row = $("<div data-type='parent'></div>").addClass("list_item").addClass("row");
                var $container = $("<div class='col-md-12'></div>").appendTo($row);
                var $checkbox = $("<input type='checkbox' style='visibility: hidden;'/>").appendTo($container);
                var $icon = $("<i class='item_icon folder_icon icon-fixed-width'></i>").appendTo($container);
                var $item = $("<a class='item_link' href='#' data-path='" + crumbpath + "'><span class='item_name'>..</span></a>").appendTo($container);
                $item.click({ context : this }, this.path_click);
                $row.prepend($("::before"));
                $row.append($("::after"));
                $row.appendTo(this.$notebookList);
            }
            $("[data-type='folder']").remove();
            $("[data-type='file']").remove();
            this.subdirs = this.model.get("subdirs");
            for (var i in this.subdirs) {
                var subdir = this.subdirs[i];
                var $row = $("<div data-type='folder'></div>").addClass("list_item").addClass("row");
                var $container = $("<div class='col-md-12'></div>").appendTo($row);
                var $checkbox = $("<input type='checkbox' />").appendTo($container);
                var $icon = $("<i class='item_icon folder_icon icon-fixed-width'></i>").appendTo($container);
                var subdir_display = subdir.substring(this.current_path.length + 1) + "/";
                var $item = $("<a class='item_link' href='#' data-path='" + subdir + "'><span class='item_name'>" + subdir_display  + "</span></a>").appendTo($container);
                $item.click({ context : this }, this.path_click);
                $row.prepend($("::before"));
                $row.append($("::after"));
                $row.appendTo(this.$notebookList);
            }
            this.subfiles = this.model.get("subfiles");
            for (var i in this.subfiles) {
                var subfile = this.subfiles[i];
                var $row = $("<div data-type='file'></div>").addClass("list_item").addClass("row");
                var $container = $("<div class='col-md-12'></div>").appendTo($row);
                var $checkbox = $("<input type='checkbox' />").appendTo($container);
                var $icon = $("<i class='item_icon file_icon icon-fixed-width'></i>").appendTo($container);
                subfile_display = subfile.substring(this.current_path.length + 1);
                var $item = $("<a class='item_link' href='#' data-path='" + subfile + "'><span class='item_name'>" + subfile_display  + "</span></a>").appendTo($container);
                $row.prepend($("::before"));
                $row.append($("::after"));
                $row.appendTo(this.$notebookList);
            }
        }
    });

    return {
        IPFileSelector: IPFileSelector
    }
});
