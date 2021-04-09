;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'), require('bootstrap-notify'));
    } else {
        root.MyNotify = factory(root.jQuery);
    }
}(this, function ($) {
    class MyNotify {

    }

    var base_config = {
        // type:           'danger',
        mouse_over:     'pause',
        z_index:        99031,
        allow_dismiss:  true,
        newest_on_top:  true,
        delay:          3000,
        timer:          1000,
        animate: {
            enter:  'animated fadeInRight',
            exit:   'animated fadeOutRight'
        }
    };

    var danger_config   = $.extend({}, base_config);
    danger_config.type  = 'danger';

    var success_config  = $.extend({}, base_config);
    success_config.type = 'success';

    var info_config     = $.extend({}, base_config);
    info_config.type    = 'info';

    MyNotify.error = function (msg) {
        $.notify({
            // options
            icon: 'fa fa-frown',
            title: '',
            message: msg,
        }, danger_config);
    };

    MyNotify.success = function (msg) {
        $.notify({
            // options
            icon: 'fa fa-grin',
            title: '',
            message: msg,
        }, success_config);
    };

    MyNotify.info = function (msg) {
        $.notify({
            // options
            icon: 'fa fa-meh',
            title: '注意: ',
            message: msg,
        }, info_config);
    };

    return MyNotify;
}));