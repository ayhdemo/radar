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
//
//= require_self

// 利用翻译文件-更改搜索框内容
!function changeSearchPlaceholder() {
    $.fn.bootstrapTable.locales["zh-CN"].formatSearch = function () {
        return '账户名 地址'
    };
    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['zh-CN']);
}();

$(function () {
    'use strict';

    Layout.init(); // init layout

    let mylib = window.mylib;
    var el = $('body');

    var $tbl_bind_maps = el.find('#tbl-bind_maps');
    $tbl_bind_maps.bootstrapTable({
        clickToSelect: true,
        pagination: true,
        paginationLoop: true,
        pageSize: 25,
        pageList: [10, 25, 50, 100],
        sidePagination: 'server',
        showRefresh: true,
        uniqueId: 'id',
        columns: [
            {
                checkbox: true
            },
            {
                title: '#',
                field: 'id',
                valign: 'middle'
            },
            {
                title: '链',
                field: 'chain_type',
                valign: 'middle'
            },
            {
                title: '账户ID',
                field: 'account_id',
                valign: 'middle'
            },
            {
                title: '账户名',
                field: 'account_name',
                valign: 'middle'
            },
            {
                title: '地址',
                field: 'eth_address',
                formatter: (val, row) => {
                    return mylib.account_url_template(val, 'erc20')
                },
                valign: 'middle'
            },
            {
                title: '绑定时间',
                field: 'updated_at',
                valign: 'middle',
                formatter: function (val, row_data) {
                    return moment(new Date(val)).format('YYYY/MM/DD HH:mm:ss')
                }
            },
        ]
    });

    //全屏
    el.find('#btn-expand').click(function (e) {
        $(this).hide();
        el.find('#btn-compress').show();
        el.find('#his-container').removeClass('container');
        el.find('#his-container').addClass('container-fluid');
    });
    //取消全屏
    el.find('#btn-compress').click(function (e) {
        $(this).hide();
        el.find('#btn-expand').show();
        el.find('#his-container').addClass('container');
        el.find('#his-container').removeClass('container-fluid');
    });
});
