//= require bootbox/bootbox
//= require select2/js/select2
//
//
//= require_self


;
(function($, window, document, undefined) {
    var comDialog, localMap;

    var ArticleAddon = function(el, opts) {
        this.el = el;
        this.defaults = {};
        this.options = $.extend({}, this.defaults, opts);
    };


    ArticleAddon.prototype = {
        init: function() {
            var me = this,
                el = me.el;

            if (el.attr('data-initialized') == 'true') {
                return me;
            }

            // me.initDialog();
            me.bindEvents();

            el.attr('data-initialized', 'true');
            window.COMS = window.COMS || [];
            el.attr('data-guid', window.COMS.length);
            window.COMS.push(me);
            return me;
        },
        /**
         * 事件绑定
         * @return {[type]} [description]
         */
        bindEvents: function() {
            var me = this,
                el = me.el;



            /**
             * [description]
             * @param  {[type]}     description]
             * @return {[type]}     [description]
             */
            el.on('click', '.article-addon-ft .btn-add', function(e) {
                e.preventDefault();
                me.initDialog({
                    isEdit: false
                });
            });


            /**
             * 编辑
             * @param  {[type]}     [description]
             * @param  {[type]}     [description]
             * @param  {[type]}     [description]
             * @return {[type]}     [description]
             */
            el.on('click', '.com-addon .btn-edit', function(e) {
                e.preventDefault();

                var elCurrentTarget = $(e.currentTarget),
                    elAddon = elCurrentTarget.parents('.com-addon');

                me.initDialog({
                    isEdit: true,
                    type: elAddon.attr('data-type'),
                    id: elAddon.attr('data-id'),
                    text: elAddon.find('.title').text()
                });
            });


            /**
             * 浮层显示回调
             * @param  {[type]}     [description]
             * @return {[type]}     [description]
             */
            $('body').on('shown.bs.modal', '.bootbox', function(e) {
                e.preventDefault();

                var elCurrentTarget = $(e.currentTarget),
                    type = $('.bootbox').find('[name="type"]').val();

                elCurrentTarget.removeAttr('tabindex');
                $('.bootbox').find('.form-group:not(.type)').hide();
                $('.bootbox').find('.form-group.' + type).show();
                me.initSelect($('[name="' + type + '"]'));
            });


            /**
             * 删除
             * @param  {[type]}     [description]
             * @param  {[type]}     [description]
             * @param  {[type]}     [description]
             * @return {[type]}     [description]
             */
            el.on('click', '.com-addon .btn-delete', function(e) {
                e.preventDefault();

                var elCurrentTarget = $(e.currentTarget),
                    elAddon = elCurrentTarget.parents('.com-addon');

                $.ajax({
                    url: '/admin/post_relateds/' + elAddon.attr('data-id'),
                    type: 'DELETE',
                    dataType: 'json',
                    data: {},
                    success: function(ret) {
                        if (ret && ret.status) {
                            elAddon.remove();
                        }
                    },
                    error: function(xhr) {

                    }
                })
            });

            /**
             * 切换类别
             * @param  {[type]}     [description]
             * @return {[type]}     [description]
             */
            $('body').on('change', '.bootbox [name="type"]', function(e) {
                e.preventDefault();

                var elCurrentTarget = $(e.currentTarget),
                    type = elCurrentTarget.val();

                $('.bootbox').find('.form-group:not(.type)').hide();
                $('.bootbox').find('.form-group.' + type).show();
                $('[name="' + type + '"]').is('select') && me.initSelect($('[name="' + type + '"]'));
            });
        },

        /**
         * 初始化dialog
         * @return {[type]} [description]
         */
        initDialog: function(option) {
            var me = this,
                el = me.el,
                dialogHtml = '';

            $('.bootbox').remove();

            dialogHtml = '<form action="#" class="new-addon form-horizontal">\
                            <input type="hidden" name="post_id" value="' + el.attr('data-articleId') + '" />\
                            <div class="form-group type">\
                                <label for="" class="col-md-2 control-label">类型</label>\
                                <div class="col-md-8">\
                                    <select name="type" class="form-control">\
                                        <option value="article">相关文章</option>\
                                    </select>\
                                </div>\
                            </div>\
                            <div class="form-group article">\
                                <label for="" class="col-md-2 control-label">相关文章</label>\
                                <div class="col-md-8">\
                                    <select name="article" class="form-control">\
                                    </select>\
                                </div>\
                            </div>\
                        </form>';


            comDialog = bootbox.dialog({
                locale: 'zh_CN',
                title: "添加文章附属内容",
                message: dialogHtml,
                buttons: {
                    success: {
                        label: "保存",
                        className: "btn-success",
                        callback: function(e) {
                            var elCurrentTarget = $(e.currentTarget),
                                elForm = $('.bootbox .new-addon'),
                                elBootbox = elCurrentTarget.parents('.bootbox'),
                                type = elBootbox.find('[name="type"]').val(),
                                locname = elBootbox.find('.map [name="locname"]').val(),
                                map = elBootbox.find('.map [name="map"]').val();


                            if (option.isEdit) {
                                $.ajax({
                                    url: '/admin/post_relateds/update_post_related?id=' + option.id,
                                    type: 'POST',
                                    dataType: 'json',
                                    data: elForm.serialize(),
                                    success: function(ret) {
                                        if (ret && ret.status) {
                                            var data = ret.data,
                                                elAddonList = el.find('.addon-list');

                                            elAddonList.find('[data-id="' + option.id + '"]').replaceWith(data.html);
                                        } else {

                                        }
                                    },
                                    error: function(xhr) {

                                    }
                                });
                            } else {
                                $.ajax({
                                    url: '/admin/post_relateds/create_post_related',
                                    type: 'POST',
                                    dataType: 'json',
                                    data: elForm.serialize(),
                                    success: function(ret) {
                                        if (ret && ret.status) {
                                            var data = ret.data,
                                                elAddonList = el.find('.addon-list');

                                            elAddonList.append(data.html);
                                        } else {

                                        }
                                    },
                                    error: function(xhr) {

                                    }
                                })
                            }

                            if (type != 'map' || (type == 'map' && locname && map)) {
                                return true;
                            }

                            alert('位置和坐标不能为空');
                            return false;
                        }
                    }
                }
            });


            if (!option || !option.type) {

            } else {
                $('.bootbox').find('[name="type"]').val(option.type);
                // if (data.type == 'article') {
                //     $('.bootbox').find('[name="article"]').html('<option value="' + data.id + '" selected="selected">' + data.text + '</option>');
                // } else if (data.type == 'paper') {
                //     $('.bootbox').find('[name="paper"]').html('<option value="' + data.id + '" selected="selected">' + data.text + '</option>');
                // }
            }
        },


        /**
         * 初始化select
         * @param  {[type]} elSelect [description]
         * @return {[type]}          [description]
         */
        initSelect: function(elSelect) {
            var me = this,
                el = me.el;

            if (!elSelect.attr('data-select2')) {
                elSelect.select2({
                    ajax: {
                        url: '/admin/post_relateds/query_post_related',
                        dataType: 'json',
                        delay: 250,
                        cache: true,
                        data: function(params) {
                            return {
                                search: params.term,
                                type: $('[name="type"]').val(),
                                post_id: el.attr('data-articleId'),
                            }
                        },
                        processResults: function(ret) {
                            if (ret && ret.status) {
                                var data = ret.data;

                                data = data.map(function(item) {
                                    return {
                                        id: item.id,
                                        text: item.title
                                    }
                                });

                                return {
                                    results: data
                                }
                            }
                        }
                    }
                });

                elSelect.attr('data-select2', true);
            }
        }
    }

    $.fn.ArticleAddon = function(opts) {
        var me = this,
            el = me.el,
            comArticleAddon;

        // 如果没有被初始化过
        if (!(el && el.length && el.attr('data-initialized') != 'true')) {
            comArticleAddon = new ArticleAddon(this, opts);
        }

        return comArticleAddon.init();
    }
})(window.jQuery || window.Zepto, window, document);
