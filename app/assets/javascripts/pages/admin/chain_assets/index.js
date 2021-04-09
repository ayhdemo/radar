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
    let $btn_add_account = el.find('#btn-add_account');

    ////////////////////////////////
    // 资产表格初始化
    ////////////////////////////////
    let $tbl_assets = el.find('#tbl-assets');
    $tbl_assets.bootstrapTable({
        showRefresh: true,
        clickToSelect: true,
        responseHandler: function(res) {
            var selections = $.map($tbl_assets.bootstrapTable('getSelections'), function (row) {
                return row.id
            });
            $.each(res.data, function (i, row) {
                row.state = $.inArray(row.id, selections) !== -1;
            });

            if(res.data.length && res.data[0].chain_type === 'erc20') {
                is_erc20 = true;
                $tbl_assets.bootstrapTable('hideColumn', 'asset_name');
                $tbl_assets.bootstrapTable('hideColumn', 'monitor_accounts');
                $tbl_assets.bootstrapTable('hideColumn', 'out_account_name');
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
                valign: 'middle',
            },
            {
                field: 'asset_id',
                title: '资产ID',
                valign: 'middle',
            },
            {
                field: 'asset_name',
                title: '资产名称',
                valign: 'middle',
            },
            {
                field: 'asset_alias',
                title: '资产别名',
                valign: 'middle',
            },
            {
                field: 'precision',
                title: '资产精度',
                valign: 'middle',
            },
            {
                field: 'asset_next_seq_no',
                title: '待处理区块',
                valign: 'middle',
            },
            {
                title: '监听账户',
                field: 'monitor_accounts',
                valign: 'middle',
                formatter: (val, row) => {
                    if(row.monitor_accounts.length)
                        return row.monitor_accounts.map(acc => {
                            return [
                                '<span class="account">',
                                `<span class="account-name">${acc.account_name}</span>`,
                                '<span class="clue">_</span>',
                                `<span class="account-id">${acc.account_id}</span>`,
                                '</span>'
                            ].join('')
                        }).join(' ');
                    else
                        return ''
                }
            },
            {
                field: 'out_account_id',
                title: '转出账户ID',
                valign: 'middle',
            },
            {
                field: 'out_account_name',
                title: '转出账户名称',
                valign: 'middle',
            },
            {
                field: 'enabled',
                title: '状态',
                valign: 'middle',
                formatter: (val, row) => {
                    if(val)
                        return `<strong class="text-success">启用</strong>`
                    else
                        return `<strong class="text-warning">禁用</strong>`
                }
            },
            {
                title: '操作',
                valign: 'middle',
                events: {
                    'click .disable': (e, value, row, idx) => {
                        disableAsset(row)
                    },
                    'click .enable': (e, value, row, idx) => {
                        enableAsset(row)
                    },
                    'click .edit-monitor-accounts': (e, value, row, idx) => {
                        //todo 载入账户
                        el.find("#mdl-monitor_accounts").modal('show');
                        load_asset_monitor_account(row.id);
                        $btn_add_account.data('chain_asset_id', row.id);
                    },
                    'click .edit': (e, val, row, idx) => {
                        el.find('#asset_update_asset_name').html(row.asset_name);
                        el.find('#btn-save_update_asset').data('chain_asset_id', row.id);

                        el.find('#edit_chain_asset_asset_alias').val(row.asset_alias);
                        $("#edit_chain_asset_out_account_id option").prop('selected', false);

                        $("#edit_chain_asset_out_account_id option").filter(function() {
                            return $(this).text() == row.out_account_name;
                        }).prop('selected', true);

                        el.find('#mdl-asset_update').modal('show');
                    }
                },
                formatter: (idx, row) => {
                    let disable = [
                        '<a class="btn default btn-xs purple disable">',
                        '<i class="fa fa-ban"></i> 禁用',
                        '</a>',
                    ].join('');
                    let enable = [
                        '<a class="btn default btn-xs green enable">',
                        '<i class="fa fa-power-off"></i> 启用',
                        '</a>',
                    ].join('');
                    let out_account   = [
                        `<button class="btn default btn-xs black edit">`,
                        '<i class="fa fa-edit"></i> 编辑',
                        '</button>'
                    ].join('');
                    let monitor_accounts = [
                        `<button class="btn default btn-xs black edit-monitor-accounts">`,
                        '<i class="fa fa-users"></i> 转入账户',
                        '</button>'
                    ].join('');
                    return [
                        is_erc20 ? '' : monitor_accounts,
                        out_account,
                        row.enabled ? disable : enable,
                    ].join('')
                },
            }
        ]
    });

    // 模态框事件绑定
    let $mdl_add_asset = el.find('#mdl-add_asset');
    let $btn_add_asset = el.find('#btn-add_asset');
    $btn_add_asset.on('click', () => {
        $mdl_add_asset.modal('toggle');
    });

    let $mdl_update_asset = el.find('#mdl-asset_update');

    let $chain_asset_asset_id   = el.find('#chain_asset_asset_id');
    let $chain_asset_asset_name = el.find('#chain_asset_asset_name');
    let $chain_asset_precision  = el.find('#chain_asset_precision');
    // 搜索资产
    $chain_asset_asset_id.on('change', function(e) {
        let asset_id = $(this).val().trim();
        if(! asset_id.length)
            return;
        $chain_asset_asset_name.prop('readonly', true);
        $.post(
            'search_asset',
            {asset_id}
        ).done(
            (res) => {
                let data = {};
                if(res.code === 404) {
                    MyNotify.error(`资产 ${asset_id} 不存在`)
                }
                if(res.code === 200) {
                    data = res.data;
                }
                $chain_asset_asset_id.val(data.asset_id);
                $chain_asset_asset_name.val(data.asset_name);
                $chain_asset_precision.val(data.precision);

                $chain_asset_asset_name.prop('readonly', false);
            }
        ).fail(function (res) {
            // alert('Error: ' + res.responseText);
            console.error(res);
            $chain_asset_asset_name.prop('readonly', false);
        });
    });
    $chain_asset_asset_name.on('change', function(e) {
        let asset_name = $(this).val().trim();
        if(! asset_name.length)
            return;
        $chain_asset_asset_id.prop('readonly', true);
        $.post(
            'search_asset',
            {asset_name}
        ).done(
            (res) => {
                let data = {};
                if(res.code === 200) {
                    data = res.data;
                }
                try {
                    if(data.asset_id.trim().length === 0) {
                        MyNotify.info(`资产[${asset_id}]不存在`)
                    }
                } catch (e) {}
                $chain_asset_asset_id.val(data.asset_id);
                $chain_asset_asset_name.val(data.asset_name);
                $chain_asset_precision.val(data.precision);

                $chain_asset_asset_id.prop('readonly', false);
            }
        ).fail(function (res) {
            // alert('Error: ' + res.responseText);
            consyole.error(res);
            $chain_asset_asset_id.prop('readonly', false);
        });
    });

    // 搜索账户
    let $out_account_id     = el.find('#chain_asset_out_account_id');
    let $out_account_name   = el.find('#chain_asset_out_account_name');
    $out_account_id.on('change', function(e) {
        let account_id = $(this).val().trim();
        if(! account_id.length)
            return;
        $.post(
            'search_account',
            {account_id}
        ).done(
            (res) => {
                let data = {};
                if (res.code === 200) {
                    data = res.data;
                }
                $out_account_name.val(data.account_name);
            }
        ).fail(function (res) {
            // alert('Error: ' + res.responseText);
            console.error(res)
        });
    });

    ////////////////////////////////
    // 更改资产信息
    ////////////////////////////////
    let $out_account_id_edit    = el.find('#edit_chain_asset_out_account_id');
    let $out_account_name_edit  = el.find('#edit_chain_asset_out_account_name');
    $out_account_id_edit.on('change', function(e) {
        let account_id = $(this).val().trim();
        if(! account_id.length)
            return;
        $.post(
            'search_account',
            {account_id}
        ).done(
            (res) => {
                let data = {};
                if (res.code === 200) {
                    data = res.data;
                }
                $out_account_name_edit.val(data.account_name);
            }
        ).fail(function (res) {
            // alert('Error: ' + res.responseText);
            console.error(res)
        });
    });
    $out_account_name_edit.on('change', function(e) {
        let account_id = $(this).val().trim();
        if(! account_id.length)
            return;
        $.post(
            'search_account',
            {account_id}
        ).done(
            (res) => {
                let data = {};
                if (res.code === 200) {
                    data = res.data;
                }
                $out_account_name_edit.val(data.account_name);
            }
        ).fail(function (res) {
            // alert('Error: ' + res.responseText);
            console.error(res)
        });
    });

    let $frm_asset = el.find('#frm-asset');
    el.find('#btn-save_new_asset').on('click', function (e) {
        if(! el.find('#frm-asset')[0].checkValidity()) {
            MyNotify.error('请完成表单');
            return;
        }
        let form_data = {};
        $(this).button('loading');
        $frm_asset.serializeArray().map(function(x){form_data[x.name] = x.value;});
        $.post(
            'chain_assets',
            form_data,
        ).done(
            (res) => {
                $(this).button('reset');
                if(res.code !== 200){
                    console.error(res.msg);
                    MyNotify.error(res.msg);
                }
                else {
                    $tbl_assets.bootstrapTable('refresh', false);
                    $mdl_add_asset.modal('hide');
                    MyNotify.success('添加资产成功');
                }
            }
        ).fail((res) => {
            // alert('Error: ' + res.responseText);
            $(this).button('reset');
            console.error(res);
            MyNotify.error(res.msg);
        });
    });

    let $frm_asset_update = el.find("#frm-asset_update");
    el.find('#btn-save_update_asset').on('click', function (e) {
        if(! $frm_asset_update[0].checkValidity()) {
            MyNotify.error('请完成表单');
            return;
        }
        $(this).button('loading');
        let form_data = {};
        $frm_asset_update.serializeArray().map(function(x){form_data[x.name] = x.value;});
        $.ajax({
            url:    'chain_assets/'+$(this).data('chain_asset_id'),
            data:   form_data,
            method: 'PATCH',
        }).then(
            (res) => {
                console.log(this);
                $(this).button('reset');
                if(res.code !== 200)
                    console.error(res.msg);
                else {
                    $tbl_assets.bootstrapTable('refresh', false);
                    $mdl_update_asset.modal('hide');
                    MyNotify.success('修改资产成功');
                }
            }
        ).fail(
            (res) => {
                // alert('Error: ' + res.responseText);
                $(this).button('reset');
                console.error(res);
                MyNotify.error(res.msg);
            }
        );
    });

    ////////////////////////////////
    // 修改监听账户
    ////////////////////////////////
    let $select_account = el.find("#select_account");

    // 获取账户列表
    function reload_accounts() {
        $.get('chain_accounts/more_chain_account').done(res => {
            let options = res.data.map(option => {
                return {
                    id: option.id,
                    text: [option.account_name, option.account_id].join('_'),
                    disabled: option.in_enabled === false
                }
            });

            $select_account.select2({
                debug: true,
                placeholder: '选择账户',
                data: options,
            });
        })
    }

    reload_accounts();

    el.find('.monitor-account-list').on('click', '.monitor-account', function (e) {
        $(this).toggleClass('selected');
    });

    let $monitor_account_list = el.find('#monitor-account-list');
    let account_template = function(name, account_id, id) {
        return `<div class="col-sm-6 col-md-3">
            <span class="monitor-account" data-account-id="${id}">
                <span class="account-name">${name}</span>_<span class="account-id">${account_id}</span>
                <span class="account-appendix"><i class="fa fa-check"></i></span>
            </span>
        </div>`
    };

    $btn_add_account.on('click', function (e) {
        let account = get_selected_account();
        if(! account)
            return;
        $(this).button('loading');
        let chain_asset_id = $btn_add_account.data('chain_asset_id');
        $.post(`chain_assets/${chain_asset_id}/monitor_account`, {
            account_id: account.id
        }).done(
            res => {
                $(this).button('reset');
                if(res.code !== 200) return;
                let account = res.data;
                MyNotify.success('添加监听账户成功');
                $monitor_account_list.append($(
                    account_template(account.account_name, account.account_id, account.id)
                ));
            }
        ).fail(
            res => {
                console.log(res);
                $(this).button('reset');
                MyNotify.success(res.msg);
            }
        );
    });

    function get_selected_account() {
        let option = $select_account.find(':selected');
        if(! option.length)
            return null;
        let id = option.val();
        let account = option.text().split('_');
        return {
            id: id,
            account_id: account[1],
            account_name: account[0],
        }
    }

    function disableAsset(asset_list) {
        if (! (asset_list instanceof Array)) {
            asset_list = [asset_list]
        }
        asset_list = asset_list.filter( asset => asset.enabled).map(account => account.id);
        $.post(
            'chain_assets/disable',
            {asset_ids: asset_list},
        ).done(
            (res) => {
                $tbl_assets.bootstrapTable('refresh', false)
            }
        )
    }
    function enableAsset(asset_list) {
        if (! (asset_list instanceof Array)) {
            asset_list = [asset_list]
        }
        asset_list = asset_list.filter( asset => false === asset.enabled).map(account => account.id);
        $.post(
            'chain_assets/enable',
            {asset_ids: asset_list},
        ).done(
            (res) => {
                $tbl_assets.bootstrapTable('refresh', false)
            }
        )
    }

    function load_asset_monitor_account(asset_id) {
        $.get(`chain_assets/${asset_id}/more_monitor_account`).done(res => {
            $monitor_account_list.html('');
            if(res.code !== 200)
                return;
            res.data.forEach(account => {
                $monitor_account_list.append($(
                    account_template(account.account_name, account.account_id, account.id)
                ));
            });
            console.log(res)
        }).fail(res => {

        })
    }
});
