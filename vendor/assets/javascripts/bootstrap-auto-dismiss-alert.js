/*!
 * Bootstrap Auto-dismiss alerts
 * Mario Juárez <mario@mjp.one>
 * https://github.com/mariomka/bootstrap-auto-dismiss-alert
 * Licensed under the MIT license
 */

;(function ($) {

    'use strict';
    //应该在ready之后执行--chen bin
    $(function () {
        $('.alert[data-auto-dismiss]').each(function (index, element) {
            var $element = $(element),
                timeout  = $element.data('auto-dismiss') || 5000;

            setTimeout(function () {
                $element.alert('close');
            }, timeout);
        });
    })

})(jQuery);