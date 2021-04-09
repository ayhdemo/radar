//= require jquery
//= require jquery_ujs
//= require bootstrap/js/bootstrap.min
//= require bootstrap-fileinput/bootstrap-fileinput
//= require jquery-validation/js/jquery.validate.min.js
//= require jquery-validation/js/additional-methods.min.js
//= require jquery-validation/js/localization/messages_zh
//
//
//= require components/admin/datepicker/index
//= require components/admin/common/metronic
//= require components/admin/common/layout
//= require components/admin/common/index
//
//
//= require_self



$(function() {
    var el = $('body'),
        elForm = el.find('form.user-form-validate');

    Metronic.init(); // init metronic core componets
    Layout.init(); // init layout
    Demo.init(); // init demo features
    ComponentsPickers.init(); // init date-picker


    elForm.validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        ignore: "", // validate all fields including form hidden input
        rules: {
            'user[username]': {
                required: true
            },
            'user[email]': {
                required: true,
                email: true
            },
            'user[password]': {
                required: true,
                minlength: 8
            },
            'user[password_confirmation]': {
                required: true,
                minlength: 8,
                equalTo: "#user_password"
            }
        },

        highlight: function(element) { // hightlight error inputs
            $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
        },

        unhighlight: function(element) { // revert the change done by hightlight
            $(element).closest('.form-group').removeClass('has-error'); // set error class to the control group
        },

        success: function(label) {
            label.closest('.form-group').removeClass('has-error'); // set success class to the control group
        },

        submitHandler: function(form) {
            form[0].submit(); // submit the form
        }
    });
});
