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
    $('[data-toggle="tooltip"]').tooltip()
});

$(function () {
    'use strict';
    let el = $('body');

    // Metronic.init(); // init metronic core componets
    Layout.init(); // init layout

    // ===============CLI 状态================
    let $tbl_gateway_status = null;
    el.find('#reload-status').click(function() {
        if($tbl_gateway_status) {
            $tbl_gateway_status.bootstrapTable('refresh');
            return;
        }
        this.innerHTML = '<i class="fa fa-refresh"></i> <span> 刷新</span>';
        $tbl_gateway_status = el.find('#tbl-gateway_status');
        $tbl_gateway_status.bootstrapTable({
            rowStyle: function rowStyle(row, index) {
                if (row.status.code === 0 && row.status.locked === false)
                    return {
                        classes: 'status-normal',
                    };
                return {
                    classes: 'status-error',
                }
            },
            columns: [
                {
                    field: 'id',
                    title: '#',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    field: 'chain_type',
                    title: 'Chain',
                    valign: 'middle'
                },
                {
                    title: 'Locked',
                    valign: 'middle',
                    formatter: function (idx, row) {
                        if(row.status['locked'] === null)
                            return '未知';

                        let locked = row.status['locked'];
                        let locked_cn = ['否', '是'][+locked];
                        let msg = locked ? '[请解锁]' : '';
                        return [locked_cn, msg].join('');
                    },
                },
                {
                    title: '测试命令',
                    valign: 'middle',
                    formatter: function (idx, row) {
                        return row.status['cmd']
                    },
                },
                {
                    field: 'msg',
                    title: '响应',
                    formatter: function (idx, row) {
                        let msg = row.status['msg'].toString();
                        return msg.slice(0,60) + (msg.length > 60 ? '...' : '');
                    },
                    valign: 'middle'
                },
            ],
        });
    });


    // ===============网关余额================
    let $tbl_gw_account_balance;
    el.find('#reload-balance').click(function() {
        if($tbl_gw_account_balance) {
            $tbl_gw_account_balance.bootstrapTable('refresh');
            return;
        }

        this.innerHTML = '<i class="fa fa-refresh"></i> <span> 刷新</span>';
        $tbl_gw_account_balance = el.find('#tbl-gw_account_balance');
        $tbl_gw_account_balance.bootstrapTable({
            rowStyle: function rowStyle(row, index) {
                if(row.asset.enabled === false) {
                    return { classes: 'status-disabled text-muted' };
                }
                switch (row.asset.chain_type) {
                    case 'eth':
                        if (row.balance < 0.2)
                            return { classes: 'status-error' };
                        break;
                    case 'erc20':
                        if (row.balance < 1000 || row.eth_balance < 0.2)
                            return { classes: 'status-error' };
                        break;
                    case 'btc':
                        if (row.balance < 0.1)
                            return { classes: 'status-error' };
                        break;
                    case 'omni':
                        if (row.balance < 100 || row.btc_balance < 0.1)
                            return { classes: 'status-error' };
                        break;
                }

                return { classes: 'status-normal' }
            },
            columns: [
                {
                    field: 'id',
                    title: '#',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    title: '链',
                    valign: 'middle',
                    formatter: function (idx, row) {
                        return row.asset.chain_type
                    },
                },
                {
                    title: '账户',
                    valign: 'middle',
                    formatter: function (idx, row) {
                        return row.asset.out_account_name
                    },
                },
                {
                    title: '资产',
                    valign: 'middle',
                    formatter: function (idx, row) {
                        return row.asset.asset_alias.trim() || row.asset.asset_name
                    },
                },
                {
                    title: '余额',
                    valign: 'middle',
                    formatter: function (idx, row) {
                        let balance = row.balance === -1 ? '获取余额失败' : row.balance;

                        if(row.asset.chain_type === 'erc20') {
                            return balance + ` [ETH: ${row.eth_balance}]`
                        } else if(row.asset.chain_type === 'omni') {
                            return balance + ` [BTC: ${row.btc_balance}]`
                        } else {
                            return balance
                        }
                    },
                },
                {
                    title: '状态',
                    formatter: function (idx, row) {
                        return ['未启用', '已启用'][+row.asset.enabled]
                    },
                    valign: 'middle'
                },
            ],
        });
    });

    el.find('#btn-submit_gas_price').click(function () {
        if(! this.checkValidity()) {
            return MyNotify.error('请完成表单');
        }

        let form = $(this).parents('form');

        let url  = form.attr('action');
        let data = form.serialize();
        $.ajax(url, {
            method: 'PATCH',
            data,
            success: function (res) {
                if (res.code === 0) {
                    MyNotify.success('修改成功')
                } else {
                    MyNotify.error('修改失败');
                }
            },
            error: function (e) {
                console.error(e);
                MyNotify.error('网络错误');
            }
        })
    });

    // ===========推荐Gas值===========
    $.ajax('/admin/gateway_status/proposed_gas', {
        success: (res) => {
            if(res.code !== 0)
                return MyNotify.error('获取gas失败');
            el.find('#ipt_proposed_price').val(res.data / (Math.pow(10, 9)));
        },
        error: (e) => {
            console.error(e);
            MyNotify.error('网络错误');
        }
    })
});
