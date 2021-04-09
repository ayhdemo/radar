//= require bootbox/bootbox
//= require select2/js/select2
//= require components/admin/table-ajax/index
//
//
//= require_self


;
(function($, window, document, undefined) {
    var comDialog, localMap;

    var TopicAddon = function(el, opts) {
        this.el = el;
        this.defaults = {};
        this.options = $.extend({}, this.defaults, opts);
    };


    TopicAddon.prototype = {
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
            el.on('click', '.topic-addon-ft .btn-add', function(e) {
                e.preventDefault();
                me.initDialog({
                    isEdit: false
                });
                me.initSelect({
                    elSelect:$('.modal-content .topic_select'),
                    isEditTopic:false
                });
            });


            /**
             * 编辑
             * @param  {[type]}     [description]
             * @param  {[type]}     [description]
             * @param  {[type]}     [description]
             * @return {[type]}     [description]
             */
            el.on('click', '.com-addon-topic .btn-edit', function(e) {
                e.preventDefault();

                var elCurrentTarget = $(e.currentTarget),
                    elAddon = elCurrentTarget.parents('.com-addon-topic');

                me.initDialog({
                    isEdit: true,
                    type: elAddon.attr('data-type'),
                    id: elAddon.attr('data-id'),
                    text: elAddon.find('.title').text()
                });

                me.initSelect({
                    elSelect:$('.modal-content .topic_select'),
                    isEditTopic:true,
                    topicId:elAddon.attr('data-id')
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
                // $('.bootbox').find('.form-group:not(.type)').hide();
                // $('.bootbox').find('.form-group.' + type).show();

                 
            });


            /**
             * 删除
             * @param  {[type]}     [description]
             * @param  {[type]}     [description]
             * @param  {[type]}     [description]
             * @return {[type]}     [description]
             */
            el.on('click', '.com-addon-topic .btn-delete', function(e) {
                e.preventDefault();

                var elCurrentTarget = $(e.currentTarget),
                    elPostId=$('.com-topic-addon').attr('data-articleId'),
                    elAddon = elCurrentTarget.parents('.com-addon-topic');

                $.ajax({
                    url: '/admin/topic_posts/' + elAddon.attr('data-id'),
                    type: 'DELETE',
                    dataType: 'json',
                    data: {
                        post_id:elPostId,
                    },
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
            // $('body').on('change', '.bootbox [name="type"]', function(e) {
            //     e.preventDefault();

            //     var elCurrentTarget = $(e.currentTarget),
            //         type = elCurrentTarget.val();

            //     $('.bootbox').find('.form-group:not(.type)').hide();
            //     $('.bootbox').find('.form-group.' + type).show();
            //     //$('[name="' + type + '"]').is('select') && me.initSelect($('.form-control'));
            // });
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
                            <input type="hidden" name="topic_id" value="' + el.attr('data-articleId') + '" />\
                            <div class="form-group type">\
                                <label for="" class="col-md-2 control-label">类型</label>\
                                <div class="col-md-8">\
                                    <select name="type" class="form-control topic_select">\
                                        <option>Topic</option>\
                                    </select>\
                                </div>\
                            </div>\
                            <div class="table-container">\
                                <table class="com-datatable-ajax table table-striped table-bordered table-hover">\
                                    <thead>\
                                        <tr role="row" class="heading">\
                                            <th class="table-checkbox" width="6%">\
                                                <input type="checkbox" class="group-checkable"/>\
                                            </th>\
                                            <th>subTopic</th>\
                                        </tr>\
                                    </thead>\
                                    <tbody></tbody>\
                                </table>\
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
                                elPostId=$('.com-topic-addon').attr('data-articleId'),
                                selectedTopicId=$('.modal-content .topic_select').val(),
                                selectedSubtopicId=function(){
                                    var arr=[];
                                    $("input[name='subTopicId']:checked").each(function(){
                                        arr.push(this.value)
                                    })
                                    return arr;
                                }
                                type = elBootbox.find('[name="type"]').val();
                                // locname = elBootbox.find('.map [name="locname"]').val(),
                                // map = elBootbox.find('.map [name="map"]').val();


                            if (option.isEdit) {
                                $.ajax({
                                    url: '/admin/topic_posts/update_topic_post?id=' + option.id,
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                        post_id:elPostId,
                                        topic_id:selectedTopicId,
                                        selected_subtopics:selectedSubtopicId
                                    },
                                    success: function(ret) {
                                        if (ret && ret.status) {
                                            var data = ret.data,
                                                elAddonList = el.find('.topic-addon-list');

                                            elAddonList.find('[data-id="' + option.id + '"]').replaceWith(data.html);
                                        } else {

                                        }
                                    },
                                    error: function(xhr) {

                                    }
                                });
                            } else {
                                $.ajax({
                                    url: '/admin/topic_posts/create_topic_post',
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                        post_id:elPostId,
                                        topic_id:selectedTopicId,
                                        selected_subtopics:selectedSubtopicId
                                    },
                                    success: function(ret) {
                                        if (ret && ret.status) {
                                            var data = ret.data,
                                                elAddonList = el.find('.topic-addon-list');

                                            elAddonList.append(data.html);
                                        } else {

                                        }
                                    },
                                    error: function(xhr) {

                                    }
                                })
                            }

                            return true;
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
        initSelect: function(option) {
            var me = this,
                el = me.el;

            var isEditTopic=option.isEditTopic,
                elSelect=option.elSelect;

            var postId=$('.com-topic-addon').attr('data-articleId');

            if (!elSelect.attr('data-select2')) {
                elSelect.select2({
                    width: '300px',
                    ajax: {
                        //此url为获取topic选项列表,方式为get
                        url: '/admin/topic_posts/query_topic_post',
                        dataType: 'json',
                        delay: 250,
                        cache: true,
                        data:function(params){
                            if (isEditTopic){
                                return {
                                    actionType:"edit",
                                    id:option.topicId
                                }
                            }else{
                                return {
                                    actionType:"new",
                                    post_id:postId
                                }
                            }
                        },
                        processResults: function(ret) {
                            if (ret && ret.status) {
                                var data = ret.topics;

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
                }).on('change',function(){
                    me.initDataTable(this.value)
                });

                elSelect.attr('data-select2', true);
            }
        },
        /**
         * [initDataTable description]
         * @params [elTopicId]以此作为标识，构造对应每个topic的相应subTopic表请求地址
         * @return {[type]} [description]
         */
        initDataTable:function(elTopicId){
            var me = this,
                el = me.el;

            TableAjax.init($('.modal-body .com-datatable-ajax'),{
                //subTopic列表,其中根据参数topicId获取该
                ajax:{
                    url:"/admin/topic_posts/query_subtopic_post",
                    type:"GET",
                    data:{
                        topic_id:elTopicId
                    },
                    dataSrc:"subtopics"
                },
                columns:[{
                    "targets": [0],
                    "data": "id",
                    "render": function(data, type, full) {
                        return "<input type=\"checkbox\" name=\"subTopicId\" value=\"" + data + "\">";
                    }
                },{
                    "targets": [1],
                    "orderable": false,
                    "data": "title",
                    "name": "title"
                }],
                bPaginate:false,
                searching: false,
                bDestroy: true,
                bInfo:false

            })
        }
    }

    $.fn.TopicAddon = function(opts) {
        var me = this,
            el = me.el,
            comTopicAddon;

        // 如果没有被初始化过
        if (!(el && el.length && el.attr('data-initialized') != 'true')) {
            comTopicAddon = new TopicAddon(this, opts);
        }

        return comTopicAddon.init();
    }
})(window.jQuery || window.Zepto, window, document);
