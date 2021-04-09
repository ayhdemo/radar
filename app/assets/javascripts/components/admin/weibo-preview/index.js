//
//
//= require_self


;
(function($, window, document, undefined) {
    var WeiboPreview = function(el, opts) {
        this.el = el;
        this.defaults = {};
        this.options = $.extend({}, this.defaults, opts);
    }


    WeiboPreview.prototype = {
        init: function() {
            var me = this,
                el = me.el;

            me.bindEvents();

            window.COMS = window.COMS || [];
            el.attr('data-initialized', 'true');
            el.attr('data-guid', window.COMS.length);
            window.COMS.push(me);

            return me;
        },
        bindEvents: function() {
            var me = this,
                el = me.el;

        },

        /**
         * 刷新预览
         * @return {[type]} [description]
         */
        refreshPreview: function(title, excerpt, image) {
            var me = this,
                el = me.el,
                reader = new FileReader();

            el.find('.weibo-preview-hd').html(title + '&nbsp;<a href="#">网页链接</a>&nbsp;' + excerpt);

            if (window.VBArray) {
                el.find('.weibo-preview-bd').html('<span>你的浏览器不支持预览</span>');
            } else {
                reader.readAsDataURL(image);
                reader.onload = function(e) {
                    el.find('.weibo-preview-bd img').attr('src', this.result);
                }
            }
        }
    }

    $.fn.WeiboPreview = function(opts) {
        var comWeiboPreview;

        return this.each(function() {
            var elNode = $(this);

            if (elNode.attr('data-initialized') == 'true') {
                return;
            }

            comWeiboPreview = new WeiboPreview(elNode, opts);
            comWeiboPreview.init();
        });
    }
})(window.jQuery || window.Zepto, window, document);
