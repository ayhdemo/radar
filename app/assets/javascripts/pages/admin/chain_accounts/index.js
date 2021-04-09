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
//= require remarkable-bootstrap-notify/bootstrap-notify
//= require common/my-notify
//
//= require_self

$(function () {
    'use strict';
    let el = $('body');

    // Metronic.init(); // init metronic core componets
    Layout.init(); // init layout
    // Demo.init(); // init demo features

    let is_erc20         = false;
    let $tbl_chain_accounts = el.find('#tbl-chain_accounts');
    $tbl_chain_accounts.bootstrapTable({
        showRefresh: true,
        clickToSelect: true,
        responseHandler: function(res) {
            var selections = $.map($tbl_chain_accounts.bootstrapTable('getSelections'), function (row) {
                return row.id
            });
            $.each(res.data, function (i, row) {
                row.state = $.inArray(row.id, selections) !== -1;
            });

            if(res.data.length && res.data[0].chain_type == 'erc20') {
                is_erc20 = true;
                $tbl_chain_accounts.bootstrapTable('hideColumn', 'chain_asset_id');
                $tbl_chain_accounts.bootstrapTable('hideColumn', 'chain_asset_name');
            }

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
                title: '所属模板',
            },
            {
                field: 'account_id',
                title: '账户 ID',
            },
            {
                field: 'account_name',
                title: '账户 Name',
            },
            {
                field: 'chain_asset_id',
                title: '监听资产 ID',
            },
            {
                field: 'next_seq_no',
                title: '待处理OP序号',
            },
            {
                field: 'chain_asset_name',
                title: '监听资产 Name',
            },
            {
                field: 'in_enabled',
                title: '允许转入',
                formatter: (val, row) => {
                    if(val)
                        return `<strong class="text-success">是</strong>`
                    else
                        return `<strong class="text-warning">否</strong>`
                }
            },
            {
                field: 'out_enabled',
                title: '允许转出',
                formatter: (val, row) => {
                    if(val)
                        return `<strong class="text-success">是</strong>`
                    else
                        return `<strong class="text-warning">否</strong>`
                }
            },
            {
                title: '操作',
                events: {
                    'click .disable-in': (e, value, row, idx) => {
                        disableAccount(row, 'in')
                    },
                    'click .disable-out': (e, value, row, idx) => {
                        disableAccount(row, 'out')
                    },
                    'click .enable-in': (e, value, row, idx) => {
                        enableAccount(row, 'in')
                    },
                    'click .enable-out': (e, value, row, idx) => {
                        enableAccount(row, 'out')
                    },
                    'click .edit': (e, val, row, idx) => {

                    }
                },
                formatter: (idx, row) => {
                    let disable_in = [
                        '<a class="btn default btn-xs purple disable-in">',
                        '<i class="fa fa-ban"></i> 禁止转入',
                        '</a>',
                    ].join('');
                    let enable_in  = [
                        '<a class="btn default btn-xs green enable-in">',
                        '<i class="fa fa-power-off"></i> 允许转入',
                        '</a>',
                    ].join('');
                    let disable_out = [
                        '<a class="btn default btn-xs purple disable-out">',
                        '<i class="fa fa-ban"></i> 禁止转出',
                        '</a>',
                    ].join('');
                    let enable_out  = [
                        '<a class="btn default btn-xs green enable-out">',
                        '<i class="fa fa-power-off"></i> 允许转出',
                        '</a>',
                    ].join('');
                    return [
                        row.in_enabled ? disable_in : enable_in,
                        row.out_enabled ? disable_out : enable_out,
                    ].join('')
                },
            }
        ]
    });

    let $mdl_add_account    = el.find('#mdl-add_account');
    let $btn_add_account    = el.find('#btn-add_account');
    $btn_add_account.on('click', function (e) {
        $mdl_add_account.modal('show');
    });

    // 搜索账户
    let $account_id         = el.find('#chain_account_account_id');
    let $account_name       = el.find('#chain_account_account_name');
    $account_id.on('change', function(e) {
        let account_id = $(this).val();
        $account_name.prop('readonly', true);
        $.post(
            'search_account',
            {account_id},
        ).done(
            (res) => {
                let data = {};
                if(res.code === 200) {
                    data = res.data;
                }
                $account_id.val(data.account_id);
                $account_name.val(data.account_name);
                $account_name.prop('readonly', false);
            }
        ).fail(function(res) {
            console.error(res);
            MyNotify.error(res.msg);
            $account_name.prop('readonly', false);
        });
    });
    $account_name.on('change', function(e) {
        let account_name = $(this).val();
        $account_id.prop('readonly', true);
        $.post(
            'search_account',
            {account_name},
        ).done(
            (res) => {
                let data = {};
                if(res.code === 200) {
                    data = res.data;
                }
                $account_id.val(data.account_id);
                $account_name.val(data.account_name);
                $account_id.prop('readonly', false);
            }
        ).fail(function(res) {
            // alert('Error: ' + res.responseText);
            console.error(res);
            MyNotify.error(res.msg);
            $account_id.prop('readonly', false);
        });
    });

    let $frm_account = el.find('#frm-account');
    el.find('#btn-save_new_account').on('click', function (e) {
        $(this).button('loading');
        if(! $frm_account[0].checkValidity()) {
            MyNotify.error('请完成表单');
            return;
        }
        let form_data = {};
        $frm_account.serializeArray().map(function(x){form_data[x.name] = x.value;});
        $.post(
            'chain_accounts',
            form_data,
        ).done(
            (res) => {
                console.log(res);
                $(this).button('reset');
                if(res.code !== 200) {
                    console.error(res.msg);
                    MyNotify.error(res.msg);
                } else {
                    console.log(res.msg);
                    $account_id.val('');
                    $account_name.val('');
                    $tbl_chain_accounts.bootstrapTable('refresh', false);
                    MyNotify.success('添加账户成功');
                }
            }
        ).fail(function(res) {
            // alert('Error: ' + res.responseText);
            $(this).button('reset');
            console.error(res)
        });
    });

    let $btn_disable_accounts_in    = el.find('#btn-disable_accounts_in');
    let $btn_enable_accounts_in     = el.find('#btn-enable_accounts_in');
    let $btn_disable_accounts_out   = el.find('#btn-disable_accounts_out');
    let $btn_enable_accounts_out    = el.find('#btn-enable_accounts_out');
    /**
     * 表格记录 (un)check 事件监听器
     * @param row 行数据
     * @param $element 行DOM
     */
    function onCheckChange(row, $element) {
        if($tbl_chain_accounts.bootstrapTable('getSelections').length) {
            el.find('#toolbar').find('button').attr('disabled', false);
        } else {
            el.find('#toolbar').find('button').attr('disabled', 'disabled');
        }
    }

    [
        'check.bs.table',
        'uncheck.bs.table',
        'refresh.bs.table',
        'check-all.bs.table',
        'uncheck-all.bs.table'
    ].forEach((evt) => {
        $tbl_chain_accounts.on(evt, onCheckChange);
    });

    $btn_disable_accounts_in.on('click', (e) => {
        let rows        = $tbl_chain_accounts.bootstrapTable('getSelections');
        if(!rows.length)
            return;
        disableAccount(rows, 'in')
    });
    $btn_disable_accounts_out.on('click', (e) => {
        let rows        = $tbl_chain_accounts.bootstrapTable('getSelections');
        if(!rows.length)
            return;
        disableAccount(rows, 'out')
    });
    $btn_enable_accounts_in.on('click', (e) => {
        let rows        = $tbl_chain_accounts.bootstrapTable('getSelections');
        if(!rows.length)
            return;
        enableAccount(rows, 'in')
    });
    $btn_enable_accounts_out.on('click', (e) => {
        let rows        = $tbl_chain_accounts.bootstrapTable('getSelections');
        if(!rows.length)
            return;
        enableAccount(rows, 'out')
    });

    function disableAccount(account_list, type) {
        if (! (account_list instanceof Array)) {
            account_list = [account_list]
        }
        let key = `${type}_enabled`;
        account_list = account_list.filter( account => account[key]).map(account => account.id);
        $.post(
            'chain_accounts/disable',
            {account_ids: account_list, type},
        ).done(
            (res) => {
                $tbl_chain_accounts.bootstrapTable('refresh', false)
            }
        )
    }
    function enableAccount(account_list, type) {
        if (! (account_list instanceof Array)) {
            account_list = [account_list]
        }
        let key = `${type}_enabled`;
        account_list = account_list.filter( account => false === account[key]).map(account => account.id);
        $.post(
            'chain_accounts/enable',
            {account_ids: account_list, type},
        ).done(
            (res) => {
                console.log(res)
                $tbl_chain_accounts.bootstrapTable('refresh', false)
            }
        )
    }
});
