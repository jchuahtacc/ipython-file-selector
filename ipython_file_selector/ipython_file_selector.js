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
            this.selected = this.model.get('selected');
            if (!this.selected) {
                this.selected = { };
            }

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

        checkbox_click: function(e) {
            var $container = $(this).parent("div");
            var path = $container.find('a').attr('data-path');
            var checked = $(this).prop('checked');
            var type = $container.parent("div").attr('data-type');
            var that = e.data.context;
            
            var subpath = path.substring(that.home_path.length + 1);
            var crumbs = subpath.split('/');
            var ref = that.selected;
            if (checked) {
                for (var i in crumbs) {
                    if (i == crumbs.length - 1) {
                        ref[crumbs[i]] = true;
                    } else {
                        if (ref[crumbs[i]] == undefined || ref[crumbs[i]] == true) {
                            ref[crumbs[i]] = { };
                        }
                        ref = ref[crumbs[i]];
                    }
                }
            } else {
                for (var i in crumbs) {
                    if (i == crumbs.length - 1 && ref[crumbs[i]] != undefined) {
                        delete ref[crumbs[i]];
                    } else {
                        if (ref[crumbs[i]] != undefined && ref[crumbs[i]] != true) {
                            ref = ref[crumbs[i]]
                        }
                    }
                }
            }
            console.log("selected", that.selected);
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

        path_selected: function(path) {
            var subpath = path.substring(this.home_path.length + 1);
            var crumbs = subpath.split('/');
            var ref = this.selected;
            for (var i in crumbs) {
                if (i == crumbs.length - 1) {
                    return ref[crumbs[i]] != undefined;
                } else {
                    if (ref[crumbs[i]] != undefined) {
                        ref = ref[crumbs[i]];
                    }
                }
            }
            return false;
        },

        refresh_directory: function() {
            $("[data-type='parent']").remove();
            if (this.current_path != this.home_path) {
                var crumbs = this.current_path.substring(this.home_path.length).split('/');
                var crumbpath = this.home_path;
                for (var i = 1; i < crumbs.length - 1; i = i + 1) {
                    crumbpath = crumbpath + "/" + crumbs[i];
                }
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
                var checked = this.path_selected(subdir);
                var $row = $("<div data-type='folder'></div>").addClass("list_item").addClass("row");
                var $container = $("<div class='col-md-12'></div>").appendTo($row);
                var $checkbox = $("<input type='checkbox' />").appendTo($container);
                $checkbox.prop('checked', checked);
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
                var checked = this.path_selected(subfile);
                var $row = $("<div data-type='file'></div>").addClass("list_item").addClass("row");
                var $container = $("<div class='col-md-12'></div>").appendTo($row);
                var $checkbox = $("<input type='checkbox' />").appendTo($container);
                $checkbox.prop('checked', checked);
                var $icon = $("<i class='item_icon file_icon icon-fixed-width'></i>").appendTo($container);
                subfile_display = subfile.substring(this.current_path.length + 1);
                var $item = $("<a class='item_link' href='#' data-path='" + subfile + "'><span class='item_name'>" + subfile_display  + "</span></a>").appendTo($container);
                $row.prepend($("::before"));
                $row.append($("::after"));
                $row.appendTo(this.$notebookList);
            }
            this.$notebookList.find("input:checkbox").click({ context : this }, this.checkbox_click);
        }
    });

    return {
        IPFileSelector: IPFileSelector
    }
});
