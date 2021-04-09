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


//= require remarkable-bootstrap-notify/bootstrap-notify
//
//= require common/my-notify
//= require common/lib
//
//= require_self

$(function () {
    'use strict';
    let el = $('body');

    // Metronic.init(); // init metronic core componets
    Layout.init(); // init layout
    // Demo.init(); // init demo features

    //网关列表
    let $tbl_gateways = el.find('#tbl-gateways');
    var $mdl_edit_gateway = el.find('#mdl-edit_gateway');
    $tbl_gateways.bootstrapTable({
        showRefresh: true,
        clickToSelect: true,
        responseHandler: function(res) {
            var selections = $.map($tbl_gateways.bootstrapTable('getSelections'), function (row) {
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
                title: '链',
                formatter: (val, row) => {
                    return row.from_asset.chain_type;
                }
            },
            {
                title: '资产名称',
                formatter: (val, row) => {
                    return [
                        `<b>${row.from_asset.asset_alias || row.from_asset.asset_name}</b>`,
                        // '_',
                        // mylib.compactString(row.from_asset.asset_id, 12)
                    ].join('');
                }
            },
            // {
            //     title: '转出账户ID',
            //     formatter: (val, row) => {
            //         return row.from_asset.out_account_id;
            //     }
            // },
            // {
            //     title: '转出账户Name',
            //     formatter: (val, row) => {
            //         return row.from_asset.out_account_name;
            //     }
            // },
            {
                title: '',
                formatter: (val, row) => {
                    return '<i class="fa fa-arrow-right"></i>'
                }
            },
            {
                title: '链',
                formatter: (val, row) => {
                    return row.to_asset.chain_type;
                }
            },
            {
                title: '资产',
                formatter: (val, row) => {
                    return [
                        `<b>${row.to_asset.asset_alias || row.to_asset.asset_name}</b>`,
                        // '_',
                        // mylib.compactString(row.to_asset.asset_id, 12)
                    ].join('');
                }
            },
            {
                title: '转出账户',
                formatter: (val, row) => {
                    return [
                        `<b>${row.to_asset.out_account_name}</b>`,
                        // '_',
                        // mylib.compactString(row.to_asset.out_account_id, 12)
                    ].join('');
                }
            },
            {
                field: 'fee',
                title: '手续费',
                formatter: (val, row) => {
                    if(row.fee_percent_mode)
                        return val + '%';
                    else
                        return val
                }
            },
            {
                title: '最小转出 <i class="fa fa-question-circle" style="cursor: pointer;" title="扣除手续费后"></i>',
                field: 'min_out_amount'
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
                        disableGateway(row)
                    },
                    'click .enable': (e, value, row, idx) => {
                        enableGateway(row)
                    },
                    'click .edit': (e, value, row, idx) => {
                        populate_frm_edit_gateway(row);
                        $mdl_edit_gateway.modal('show');
                    },
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
                    let edit  = [
                        '<a class="btn default btn-xs default edit">',
                        '<i class="fa fa-pencil"></i> 编辑',
                        '</a>',
                    ].join('');
                    return [
                        edit,
                        row.enabled ? disable : enable,
                    ].join('')
                },
            }
        ]
    });

    let $btn_disable_gateways = el.find('#btn-disable_gateways');
    let $btn_enable_gateways = el.find('#btn-enable_gateways');
    /**
     * 表格记录 (un)check 事件监听器
     * @param row 行数据
     * @param $element 行DOM
     */
    function onCheckChange(row, $element) {
        if($tbl_gateways.bootstrapTable('getSelections').length) {
            $btn_disable_gateways.attr('disabled', false);
            $btn_enable_gateways.attr('disabled', false);
        } else {
            $btn_disable_gateways.attr('disabled', 'disabled');
            $btn_enable_gateways.attr('disabled', 'disabled');
        }
    }

    [
        'check.bs.table',
        'uncheck.bs.table',
        'refresh.bs.table',
        'check-all.bs.table',
        'uncheck-all.bs.table',
    ].forEach((evt) => {
        $tbl_gateways.on(evt, onCheckChange);
    });

    $btn_disable_gateways.on('click', (e) => {
        let rows        = $tbl_gateways.bootstrapTable('getSelections');
        if(!rows.length)
            return;
        disableGateway(rows);
    });

    $btn_enable_gateways.on('click', (e) => {
        let rows        = $tbl_gateways.bootstrapTable('getSelections');
        if(!rows.length)
            return;
        enableGateway(rows)
    });

    function disableGateway(gateway_list) {
        if (! (gateway_list instanceof Array)) {
            gateway_list = [gateway_list]
        }
        let ids = gateway_list.filter(gateway => gateway.enabled).map(gateway => gateway.id);
        $.post(
            'chain_gateways/disable',
            {ids},
        ).done(
            (res) => {
                $tbl_gateways.bootstrapTable('refresh', false)
            }
        ).fail(reason => {
            console.error(reason)
        })
    }
    function enableGateway(gateway_list) {
        if (! (gateway_list instanceof Array)) {
            gateway_list = [gateway_list]
        }
        let ids = gateway_list.filter(gateway => false === gateway.enabled).map(gateway => gateway.id);
        $.post(
            'chain_gateways/enable',
            {ids},
        ).done(
            (res) => {
                $tbl_gateways.bootstrapTable('refresh', false)
            }
        ).fail(reason => {
            console.error(reason)
        })
    }

    // 添加网关
    var $mdl_add_gateway = el.find('#mdl-add_gateway');
    el.find('#btn-add_gateway').click(function (e) {
        $mdl_add_gateway.modal('show');
    });

    // 保存
    var $frm_add_gateway = el.find('#frm-gateway');
    el.find("#btn-save_gateway").click(function (e) {
        var from = el.find('#add_chain_gateway_from_asset_id').val();
        var to   = el.find('#add_chain_gateway_to_asset_id').val();
        if(!(from.length && to.length)) {
            return MyNotify.error('请选择资产');
        }
        if(from === to) {
            return MyNotify.error('请选择不同的资产');
        }

        $.post(
            $frm_add_gateway.attr('action'),
            $frm_add_gateway.serialize()
        ).done(res => {
            if(res.code === 200) {
                $tbl_gateways.bootstrapTable('refresh', false)
                MyNotify.success(res.msg);
            } else {
                console.error(res);
                MyNotify.error(res.msg);
            }
        }).fail(reason => {
            console.error(reason)
        })
    });

    var $btn_edit_gateway = $('#btn-edit_gateway');
    function populate_frm_edit_gateway(row) {
        $btn_edit_gateway.data('gateway-id', row.id);
        $('#edit_chain_gateway_from_asset_id').val(row.from_asset.id);
        $('#edit_chain_gateway_to_asset_id').val(row.to_asset.id);
        $('#edit_chain_gateway_min_out_amount').val(row.min_out_amount);
        $('#edit_chain_gateway_fee').val(row.fee);
        $('#edit_chain_gateway_fee_percent_mode').prop('checked', row.fee_percent_mode);
        $('#edit_chain_gateway_enabled').prop('checked', row.enabled);
    }

    var $frm_edit_gateway = el.find('#frm-edit_gateway');
    $btn_edit_gateway.click(function (e) {
        var gateway_id  = $btn_edit_gateway.data('gatewayId');
        if (undefined   === gateway_id || gateway_id.toString().trim().length === 0) {
            return MyNotify.error('未选定记录');
        }
        if(! $frm_edit_gateway[0].checkValidity()) {
            MyNotify.error('请完成表单');
            return;
        }
        gateway_id      = gateway_id.toString().trim();
        $.ajax({
            method: 'PATCH',
            url: $frm_edit_gateway.attr('action') + '/' + gateway_id,
            data: $frm_edit_gateway.serialize(),
        }).done(res => {
            if(res.code === 200) {
                $tbl_gateways.bootstrapTable('refresh', false);
                $mdl_edit_gateway.modal('hide');
                MyNotify.success(res.msg);
            } else {
                console.error(res);
                MyNotify.error(res.msg);
            }
        }).fail(reason => {
            console.error(reason)
        })
    })
});
