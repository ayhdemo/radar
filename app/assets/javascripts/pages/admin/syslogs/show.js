//= require jquery
//= require jquery_ujs
//= require bootstrap/js/bootstrap.min
//= require moment/moment
//
//
//= require components/admin/common/metronic
//= require components/admin/common/layout
//= require components/admin/common/index
//= require components/admin/table-ajax/index
//
//
//= require bootstrap-table.min
//= require bootstrap-table-zh-CN.min
//= require clipboard.min
//
//= require remarkable-bootstrap-notify/bootstrap-notify
//= require common/my-notify
//= require common/lib
//
//= require cable.js
//
//= require_self


$(function () {
    'use strict';

    Layout.init(); // init layout

    let mylib = window.mylib;
    var el = $('body');

    var $tbl_syslog = $('#tbl-syslog');
    $tbl_syslog.bootstrapTable({
        pagination: false,
        columns: [
            {
                title: '创建时间',
                field: 'created_at',
                valign: 'middle',
                width: 200
            },
            {
                title: '信号ID',
                field: "sig_id",
                valign: 'middle',
                width: 80
            },
            {
                title: "日志类型",
                field: "log_type",
                valign: "middle",
                width: 100
            },
            {
                title: '日志内容',
                field: 'content',
                valign: 'middle'
            }
        ]
    })

    var syslogs_data = $('#syslogs-data').data('json');

    if(syslogs_data) {
        console.log(syslogs_data)
        $('#tbl-syslog').bootstrapTable('append',syslogs_data)
    
    }

});
