//= require jquery
//= require jquery_ujs
//= require bootstrap/js/bootstrap.min
//= require jquery-validation/js/jquery.validate.min
//= require uniform/jquery.uniform.min
//= require jquery-validation/js/jquery.validate.min.js
//= require jquery-validation/js/additional-methods.min.js
//= require jquery-validation/js/localization/messages_zh
//
//
//= require components/admin/datepicker/index
//= require components/admin/devise/login
//= require components/admin/common/metronic
//= require components/admin/common/layout
//= require components/admin/common/index
//
//
//= require_self



$(function() {
	var el = $('body');

    Metronic.init(); // init metronic core components
    Layout.init(); // init current layout
    //Login.init();
    Demo.init();
});
