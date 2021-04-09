/**
 * utils工具函数，提供基础的辅助函数
 */
;
(function($, window, document, undefined) {
    $.fn.utils = {
        getComponentInstance: function(selector) {
            var guid;

            if (typeof selector == 'undefined') {
                return null;
            }

            if (typeof selector == 'string') {
                selector = $(selector);
            }
            selector = selector.eq(0);

            guid = selector.attr('data-guid');

            return window.COMS[guid];
        }
    };
})(window.jQuery || window.Zepto, window, document);
