//= require jquery
//= require bootstrap/js/bootstrap.min
//= require moment/moment
//= require bootstrap-table.min
//= require bootstrap-table-zh-CN.min
//
//= require_self


$(function () {
    'use strict';
    let el = $('body');
    Layout.init(); // init layout

    let $tbl_assets = el.find('#tbl-assets');
    $tbl_assets.bootstrapTable({
        columns: [
            {
                checkbox: true
            },
            {
                field: 'chain_type',
                title: '模板名称',
            },
            {
                field: 'asset_id',
                title: 'Asset ID',
            },
            {
                field: 'asset_name',
                title: 'Asset Name',
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
                        // disableChain(row.chain_type)
                    },
                    'click .enable': (e, value, row, idx) => {
                        // enableChain(row.chain_type)
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
                    let enable = [
                        '<a class="btn default btn-xs green enable">',
                        '<i class="fa fa-ban"></i> 启用',
                        '</a>',
                    ].join('');
                    let edit   = [
                        `<a href="/admin/chains/${row.id}/edit" class="btn default btn-xs black edit">`,
                        '<i class="fa fa-edit"></i> 编辑',
                        '</a>'
                    ].join('');
                    return [
                        edit,
                        row.enabled ? disable : enable,
                    ].join('')
                },
            }
        ]
    });

    let $mdl_add_asset = el.find('#mdl-add_asset');
    let $btn_add_asset = el.find('#btn-add_asset');
    $btn_add_asset.on('click', () => {
        $mdl_add_asset.modal('toggle');
    });

    // 搜索资产
    el.find('#asset_id').on('change', function(e) {
        let asset_id = $(this).val();
        $.post(
            'search_asset',
            {asset_id},
        ).done(
            (res) => {
                let data = {};
                if(res.code === 200) {
                    data = res.data;
                }
                el.find('#asset_name').val(data.asset_name);
                el.find('#precision').val(data.precision);
            }
        ).fail(function(res) {
            // alert('Error: ' + res.responseText);
            console.error(res)
        });
    });


    // 搜索账户
    el.find('#out_account_id').on('change', function(e) {
        let account_id = $(this).val();
        $.post(
            'search_account',
            {account_id},
            (res) => {
                let data = {};
                if(res.code === 200) {
                    data = res.data;
                }
                el.find('#out_account_name').val(data.account_name);
            }
        ).fail(function(res) {
            // alert('Error: ' + res.responseText);
            console.error(res)
        });
    });

    el.find('#btn-save_new_asset').on('click', function (e) {
        $(this).button('loading');
        let asset_id = el.find('#asset_id').val();
        if(! el.find('#frm-asset')[0].checkValidity()) {
            MyNotify.error('请完成表单');
            return;
        }
        $.post(
            'chain_assets/create',
            {asset_id},
            (res) => {
                console.log(this);
                if(res.code !== 200)
                    return;
                $(this).button('reset');
            }
        ).fail(function(res) {
            // alert('Error: ' + res.responseText);
            $(this).button('reset');
            console.error(res)
        });
    })
});
