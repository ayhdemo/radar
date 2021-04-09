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
//
//
//= require_self

$(function () {
    'use strict';
    let el = $('body');

    Layout.init(); // init layout

    let $tbl_chains = el.find('#tbl-chains');
    $tbl_chains.bootstrapTable({
        showRefresh: true,
        clickToSelect: true,
        responseHandler: function(res) {
            var selections = $.map($tbl_chains.bootstrapTable('getSelections'), function (row) {
                return row.id
            });
            $.each(res.data, function (i, row) {
                row.state = $.inArray(row.id, selections) !== -1;
            });
            return res;
        },
        columns: [
            {
                checkbox: true,
                formatter: function (val, row) {
                    return row.state
                }
            },
            {
                field: 'chain_type',
                title: '模板名称',
            },
            {
                field: 'chain_uuid',
                title: 'Chain ID',
            },
            {
                field: 'interval',
                title: '调度间隔(s)',
            },
            {
                field: 'enabled',
                title: '状态',
                formatter: (val, row) => {
                    if(val)
                        return `<strong class="text-success">启用</strong>`
                    else
                        return `<strong class="text-warning">禁用</strong>`
                }
            },
            {
                title: '操作',
                events: {
                    'click .disable': (e, value, row, idx) => {
                        disableChain(row)
                    },
                    'click .enable': (e, value, row, idx) => {
                        enableChain(row)
                    },
                    'click .edit': (e, val, row, idx) => {

                    }
                },
                formatter: (idx, row) => {
                    let disable = [
                        '<a class="btn default btn-xs purple disable">',
                        '<i class="fa fa-ban"></i> 禁用',
                        '</a>',
                    ].join('');
                    let enable  = [
                        '<a class="btn default btn-xs green enable">',
                        '<i class="fa fa-power-off"></i> 启用',
                        '</a>',
                    ].join('');
                    let edit    = [
                        `<a href="/admin/chains/${row.id}/edit" class="btn default btn-xs black edit">`,
                        '<i class="fa fa-edit"></i> 编辑',
                        '</a>'
                    ].join('');
                    let manage_assets = [
                        `<a href="/admin/chains/${row.id}/chain_assets" class="btn default btn-xs green edit">`,
                        '<i class="fa fa-dollar"></i> 管理资产',
                        '</a>'
                    ].join('');
                    let manage_accounts = [
                        `<a href="/admin/chains/${row.id}/chain_accounts" class="btn default btn-xs green edit">`,
                        '<i class="fa fa-users"></i> 管理账户',
                        '</a>'
                    ].join('');
                    return [
                        '<div class="btn-group">',
                        edit,
                        manage_accounts,
                        manage_assets,
                        row.enabled ? disable : enable,
                        '</div>'
                    ].join('')
                },
            }
        ]
    });

    let $btn_disable_chains = el.find('#btn-disable_chains');
    let $btn_enable_chains = el.find('#btn-enable_chains');
    /**
     * 表格记录 (un)check 事件监听器
     * @param row 行数据
     * @param $element 行DOM
     */
    function onCheckChange(row, $element) {
        if($tbl_chains.bootstrapTable('getSelections').length) {
            $btn_disable_chains.attr('disabled', false);
            $btn_enable_chains.attr('disabled', false);
        } else {
            $btn_disable_chains.attr('disabled', 'disabled');
            $btn_enable_chains.attr('disabled', 'disabled');
        }
    }

    [
        'check.bs.table',
        'uncheck.bs.table',
        'refresh.bs.table',
        'check-all.bs.table',
        'uncheck-all.bs.table'
    ].forEach((evt) => {
        $tbl_chains.on(evt, onCheckChange);
    });

    $btn_disable_chains.on('click', (e) => {
        let rows        = $tbl_chains.bootstrapTable('getSelections');
        if(!rows.length)
            return;
        disableChain(rows);
    });

    $btn_enable_chains.on('click', (e) => {
        let rows        = $tbl_chains.bootstrapTable('getSelections');
        if(!rows.length)
            return;
        enableChain(rows)
    });

    function disableChain(chain_list) {
        if (! (chain_list instanceof Array)) {
            chain_list = [chain_list]
        }
        chain_list = chain_list.filter(chain => chain.enabled).map(chain => chain.chain_type);
        $.post(
            '/admin/chains/disable',
            {chain_types: chain_list},
        ).done(
            (res) => {
                $tbl_chains.bootstrapTable('refresh', false)
            }
        )
    }
    function enableChain(chain_list) {
        if (! (chain_list instanceof Array)) {
            chain_list = [chain_list]
        }
        chain_list = chain_list.filter(chain => false === chain.enabled).map(chain => chain.chain_type);
        $.post(
            '/admin/chains/enable',
            {chain_types: chain_list},
        ).done(
            (res) => {
                $tbl_chains.bootstrapTable('refresh', false)
            }
        )
    }
});
