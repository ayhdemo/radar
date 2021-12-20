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
        return '搜索条件： 国名、地名、型号、体制、用途..'
    };
    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['zh-CN']);
}();

var process_status_trans = {
    'new':                                      '新交易',
    'auto_out_processing':                      '处理中',
    'auto_out_processed':                       '待确认',
    'auto_out_confirmed':                       '已完成',
    'auto_out_err_bad_address':                 '目标地址非法',
    'auto_out_err_gw_disabled':                 '交易对未启用',
    'auto_out_err_out_chain_disabled':          '转出链未启用',
    'auto_out_err_out_to_gw':                   '禁止转入充值地址',
    'auto_out_err_asset_unknown':               '未知转出资产',
    'auto_out_err_asset_disabled':              '已禁用转出资产',
    'auto_out_err_out_chain_not_found':         '目标链未知',
    'auto_out_err_out_chain_not_reliable':      '链不可靠',
    'auto_out_err_out_from_account_not_found':  '未知网关转出账户',
    'auto_out_err_out_from_account_disabled':   '禁用网关账户转出',
    'auto_out_err_insufficient_balance':        '网关余额不足',
    'auto_out_err_amount_large_than_in':        '转出金额大于转入',
    'auto_out_err_unknown':                     '自动转出失败',
    'in_err_memo_empty':                        '备注为空',
    'in_err_memo_too_long':                     '备注太长',
    'in_err_memo_bad_format':                   '备注格式错误',
    'in_err_memo_gateway_unknown':              '未知备注交易对',
    'in_err_memo_platform_unknown':             '未知备注链',
    'in_err_memo_asset_disabled':               '已禁用备注资产',
    'in_err_memo_asset_unknown':                '未知备注资产',
    'in_err_amount_too_little':                 '转入金额太小',
    'in_err_eth_not_bind':                      'ETH地址未绑定',
    'in_err_erc20_not_bind':                    'ERC20地址未绑定',
    'in_err_btc_not_bind':                      'BTC地址未绑定',
    'in_err_omni_not_bind':                     'OMNI地址未绑定',
    'in_err_unknown':                           '未知转入错误',
};

let fn_insert_search_option = function () {
    var $search = $('.fixed-table-toolbar .search input');
    var $search_parent = $search.parent();
    var search_option = `
        <!--<select class="form-control" id="sel-in_out">-->
            <!--<option value="">方向: 全部</option>-->
            <!--<option value="in">转入</option>-->
            <!--<option value="out">转出</option>-->
        <!--</select>-->
        <select class="form-control" id="sel-search_option">
            <option value="">类型: 全部</option>
            <option value="txid">交易ID</option>
            <option value="asset">资产</option>
            <option value="account">账户</option>
        </select>
    `;
    $search_parent.prepend($(search_option));
};

$(function () {
    'use strict';

    Layout.init(); // init layout

    let mylib = window.mylib;
    var el = $('body');

    let $chk_failed     = el.find("#chk-trx_failed"),
        $chk_unhandled  = el.find("#chk-trx_unhandled");

    let $only_unhandled = new URLSearchParams(location.search).get('only_unhandled');
    let only_unhandled  = $only_unhandled != null && $only_unhandled.length > 0 && $only_unhandled !== 'false';
    if(only_unhandled) {
        $chk_unhandled.prop('checked', true)
    }

    // var gw_accounts = {};
    // el.find('#gw-accounts').data('gw-accounts').forEach(acc => {
    //     var key = [acc.chain_type, acc.asset_id, acc.out_account_id].join('_');
    //     gw_accounts[key] = true
    // });

    var $modal_his_comment = el.find('#mdl-his_comment');
    var $tbl_his = el.find('#tbl-gw_his');
    $tbl_his.bootstrapTable({
        clickToSelect: true,
        pagination: true,
        paginationLoop: true,
        pageSize: 25,
        pageList: [10, 25, 50, 100],
        sidePagination: 'server',
        showRefresh: true,
        uniqueId: 'id',
        // rowStyle: function rowStyle(row, index) {
        //     if(true)
        //         return {
        //             classes: 'tx-deposit',
        //         };
        //     return {
        //         classes: 'tx-withdraw',
        //     }
        // },
        queryParams: function(params) {
            let sel_in_out      = $("#sel-in_out").val(),
                sel_search_opt  = $("#sel-search_option").val();

            if(params.search) {
                if (sel_in_out && sel_in_out.length)
                    params.in_out = sel_in_out;

                if (sel_search_opt && sel_search_opt.length)
                    params.search_opt = sel_search_opt;
            }

            let opt_failed      = $chk_failed.is(':checked'),
                opt_unhandled   = $chk_unhandled.is(':checked');
            if(!(opt_failed || opt_unhandled))
                return params;
            if(opt_unhandled) {
                params.only_unhandled = true;
                return params;
            }
            if (opt_failed) {
                params.only_failed = true;
                return params;
            }
        },
        detailFormatter: function (index, row) {
            function generateItem(key, val, width) {
                if(!width) {
                    width = {xs: 12,md: 2}
                }
                return `<div class="his-detail col-xs-${width.xs} col-md-${width.md}"> <span class="key">${key}: </span><span class="value">${val || '无'}</span></div>`
            }
            return [
                {
                    title: '目标名',
                    field: "radarName",
                     width: {
                        xs: 12,
                        md: 12
                    },
                },
                {
                    field: 'searchLast',
                    title: '侦查结束时间',
                    formatter: function (idx, row) {
                        return " " + row.searchLast
                    },
                    width: {
                        xs: 12,
                        md: 12
                    },
                },
                {
                    title: '载频',
                    field: "rfAverage",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: '载频最大值',
                    field: "rfMax",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: '载频最小值',
                    field: "rfMin",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: '载频类型',
                    field: "rfType",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: 'PRI',
                    field: "priAverage",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: 'PRI最大值',
                    field: "priMax",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: 'PRI最小值',
                    field: "priMin",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: 'PRI类型',
                    field: "priType",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: '脉宽',
                    field: "pwAverage",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: '脉宽最大值',
                    field: "pwMax",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: '脉宽最小值',
                    field: "pwMin",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: '脉宽类型',
                    field: "pwType",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: '带宽BW',
                    field: "bw",
                     width: {
                        xs: 12,
                        md: 12
                    },
                },
                {
                    title: '泛网络信息',
                    field: "netInfo",
                     width: {
                        xs: 12,
                        md: 12
                    },
                },
                // {
                //     field: 'out_amount',
                //     title: '转出数额',
                //     valign: 'middle'
                // },
                // {
                //     field: 'out_block',
                //     title: '转出区块',
                //     formatter: function (idx, row) {
                //         if(row.out_block)
                //             return [
                //                 row.out_block,
                //                 row.out_trx_in_block,
                //                 row.out_op_in_trx,
                //             ].join('_');
                //         else
                //             return null
                //     }
                // },
                // {
                //     field: 'out_nonce',
                //     title: '转出Nonce',
                // },
                // {
                //     field: 'out_memo',
                //     title: '转出备注',
                //     width: {
                //         xs: 6,
                //         md: 4
                //     }
                // },
                // {
                //     field: 'out_from_account_name',
                //     title: '网关转出',
                //     formatter: function (idx, row) {
                //         try {
                //             row.out_from_account_name.length > 0;
                //             row.out_to_account_name.length   > 0;
                //             return [
                //                 mylib.account_url_template(row.out_from_account_name, row.to_chain_type),
                //                 mylib.account_url_template(row.out_to_account_name, row.to_chain_type),
                //             ].join(' -> ');
                //         } catch (e) {
                //             return ''
                //         }
                //     },
                //     width: {
                //         xs: 12,
                //         md: 12,
                //     }
                // },
                // {
                //     field: 'out_trx_id',
                //     title: '转出交易ID',
                //     width: {
                //         xs: 12,
                //         md: 12
                //     },
                //     formatter: function (value, row) {
                //         return [
                //             mylib.tx_url_template(row.out_trx_id, row.to_chain_type, false)
                //         ].join('')
                //     },
                // },
                // {
                //     field: 'comment',
                //     title: '人工标注',
                //     width: {
                //         xs: 12,
                //         md: 12
                //     },
                //     formatter: function (value, row) {
                //         var comment = row.comment.trim();
                //         if(comment.length) {
                //             return [
                //                 '<div style="white-space: pre">',
                //                 comment,
                //                 '</div>'
                //             ].join('')
                //         } else {
                //             return ''
                //         }
                //     },
                // },
                // {
                //     field: 'out_info',
                //     title: '错误详情(若有)',
                //     width: {
                //         xs: 12,
                //         md: 12
                //     },
                //     formatter: function (value, row) {
                //         var out_info = (row.out_info || '').trim();
                //         if(out_info.length) {
                //             return [
                //                 '<div style="white-space: pre">',
                //                 out_info,
                //                 '</div>'
                //             ].join('')
                //         } else {
                //             return ''
                //         }
                //     },
                // },
            ].map(function (item) {
                var val = row[item.field];
                if (typeof(item.formatter) === 'function')
                    val = item.formatter(index, row);
                return generateItem(item.title, val, item.width)
            }).join('')
        },
        columns: [
            {
                checkbox: true
            },
            {
                title: '编号',
                field: 'id',
                valign: 'middle'
            },
            {
                title: 'sn',
                field: "sn",
                valign: 'middle'
            },
            {
                title: '侦查时间',
                field: "searchFirst",
                valign: 'middle'
            },
            {
                field: 'ownNation',
                title: '国名',
                valign: 'middle'
            },
            {
                field: 'addr',
                title: '地名',
                valign: 'middle'
            },
            {
                field: 'radarName',
                title: '型号',
                valign: 'middle'
            },
            {
                field: 'lon',
                title: '经度',
                valign: 'middle'
            },
            {
                field: 'lat',
                title: '纬度',
                valign: 'middle'
            },
            {
                field: 'radarSys',
                title: '技术体制',
                valign: 'middle'
            },
            {
                field: 'radarUseage',
                title: '雷达用途',
                valign: 'middle'
            },
            {
                field: 'radarWorkMode',
                title: '工作模式',
                valign: 'middle'
            },
           {
                field: 'event',
                title: '事件状态',
                valign: 'middle'
            },
            // {
            //     field: 'targetType',
            //     title: '目标类型',
            //     valign: 'middle'
            // },
            // {
            //     field: 'radarGroup',
            //     title: '群目标类型',
            //     valign: 'middle'
            // },
            // {
            //     field: 'networkType',
            //     title: '组网分析方式',
            //     valign: 'middle',
            //     formatter: (value, row) => {
            //         if(value != null && row.network_id){
            //             console.log(row)
            //             return  [
            //                 value,
            //                 `<a class="link" href="/admin/sigs/?network_id=${row.network_id}">`,
            //                 '(查看组网)',
            //                 '</a>'
            //             ].join('')

            //         }
            //     },
            // },
            // {
            //     field: 'level',
            //     title: '威胁等级',
            //     valign: 'middle'
            // },
            // {
            //     field: 'in_decrypted_memo',
            //     title: '状态',
            //     valign: 'middle'
            // },
            // {
            //     title: '操作',
            //     events: {
            //         'click .manual-comment': (e, value, row, idx) => {
            //             el.find('#sig_id').val(row.id);
            //             el.find('#history_comment').val(row.comment);
            //             $modal_his_comment.modal('show')
            //         },
            //     },
            //     valign: 'middle',
            //     formatter: (idx, row) => {
            //         let manual_comment = [
            //             '<a class="btn default btn-xs purple manual-comment">',
            //             '<i class="fa fa-pencil"></i> 标记',
            //             '</a>',
            //         ].join('');
            //         let manual_comment_exists = [
            //             '<a class="btn default btn-xs blue manual-comment">',
            //             '<i class="fa fa-edit"></i> 专家评估',
            //             '</a>',
            //         ].join('');
            //         if(row.process_status !== 'auto_out_confirmed') {
            //             return '' === row.comment ? manual_comment : manual_comment_exists;
            //         }
            //         return '';
            //     },
            // }
        ]
    });










    var $tbl_his1 = el.find('#tbl-gw_his1');
    $tbl_his1.bootstrapTable({
        clickToSelect: true,
        pagination: true,
        paginationLoop: true,
        pageSize: 25,
        pageList: [10, 25, 50, 100],
        sidePagination: 'server',
        showRefresh: true,
        uniqueId: 'id',
        queryParams: function(params) {
            let sel_in_out      = $("#sel-in_out").val(),
                sel_search_opt  = $("#sel-search_option").val();

            if(params.search) {
                if (sel_in_out && sel_in_out.length)
                    params.in_out = sel_in_out;

                if (sel_search_opt && sel_search_opt.length)
                    params.search_opt = sel_search_opt;
            }

            let opt_failed      = $chk_failed.is(':checked'),
                opt_unhandled   = $chk_unhandled.is(':checked');
            if(!(opt_failed || opt_unhandled))
                return params;
            if(opt_unhandled) {
                params.only_unhandled = true;
                return params;
            }
            if (opt_failed) {
                params.only_failed = true;
                return params;
            }
        },
        detailFormatter: function (index, row) {
            function generateItem(key, val, width) {
                if(!width) {
                    width = {xs: 12,md: 2}
                }
                return `<div class="his-detail col-xs-${width.xs} col-md-${width.md}"> <span class="key">${key}: </span><span class="value">${val || '无'}</span></div>`
            }
            return [
                {
                    title: '目标名',
                    field: "radarName",
                     width: {
                        xs: 12,
                        md: 12
                    },
                },
                {
                    field: 'searchLast',
                    title: '侦查结束时间',
                    formatter: function (idx, row) {
                        return " " + row.searchLast
                    },
                    width: {
                        xs: 12,
                        md: 12
                    },
                },
                {
                    title: '载频',
                    field: "rfAverage",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: '载频最大值',
                    field: "rfMax",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: '载频最小值',
                    field: "rfMin",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: '载频类型',
                    field: "rfType",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: 'PRI',
                    field: "priAverage",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: 'PRI最大值',
                    field: "priMax",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: 'PRI最小值',
                    field: "priMin",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: 'PRI类型',
                    field: "priType",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: '脉宽',
                    field: "pwAverage",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: '脉宽最大值',
                    field: "pwMax",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: '脉宽最小值',
                    field: "pwMin",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: '脉宽类型',
                    field: "pwType",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: '带宽BW',
                    field: "bw",
                     width: {
                        xs: 12,
                        md: 12
                    },
                },
                {
                    title: '泛网络信息',
                    field: "netInfo",
                     width: {
                        xs: 12,
                        md: 12
                    },
                },
            ].map(function (item) {
                var val = row[item.field];
                if (typeof(item.formatter) === 'function')
                    val = item.formatter(index, row);
                return generateItem(item.title, val, item.width)
            }).join('')
        },
        columns: [
            {
                checkbox: true
            },
            {
                title: '编号',
                field: 'id',
                valign: 'middle'
            },
            {
                title: 'sn',
                field: "sn",
                valign: 'middle'
            },
            {
                title: '侦查时间',
                field: "searchFirst",
                valign: 'middle'
            },
            {
                field: 'ownNation',
                title: '国名',
                valign: 'middle'
            },
            {
                field: 'addr',
                title: '地名',
                valign: 'middle'
            },
            {
                field: 'radarName',
                title: '型号',
                valign: 'middle'
            },
            {
                field: 'lon',
                title: '经度',
                valign: 'middle'
            },
            {
                field: 'lat',
                title: '纬度',
                valign: 'middle'
            },
            {
                field: 'radarSys',
                title: '技术体制',
                valign: 'middle'
            },
            {
                field: 'radarUseage',
                title: '雷达用途',
                valign: 'middle'
            },
            {
                field: 'radarWorkMode',
                title: '工作模式',
                valign: 'middle'
            },
           {
                field: 'event',
                title: '事件状态',
                valign: 'middle'
            }
        ]
    });










    $tbl_his.on('dbl-click-row.bs.table', function (e, row, $ele, field) {
        var index = $ele.data('index');
        var is_in_detail_view = $ele.next().hasClass('detail-view');
        if(is_in_detail_view)
            $tbl_his.bootstrapTable("collapseRow", index);
        else
            $tbl_his.bootstrapTable("expandRow", index);
    });

    fn_insert_search_option();

    el.find('#btn-save_his_comment').click(function (e) {
        var sig_id  = el.find('#sig_id').val();
        var $form   = el.find('#frm-history');
        var action  = $form.attr('action');
        if('' === sig_id) return;

        $.post(
            `${action}/${sig_id}/update_comment`,
            $form.serialize()
        ).then(res => {
            // console.log(res);
            var record = res.data;
            if(record) {
                var record_data = {id: record.id, row: record};
                $tbl_his.bootstrapTable("updateByUniqueId", record_data);
                $modal_his_comment.modal('hide');
            } else {
                alert('更新失败');
                console.error(res)
            }
        }).fail(reason => {
            console.error(reason);
        })
    });

    // 标注的模板
    el.find('#btn-set_default_comment').click(function (e) {
        var template = [
            '处理结果: 已重发/已退回',
            '目标账户: ',
            '转出金额: ',
            '交易的ID: ',
            '转出时间: ',
        ].join('\n');
        el.find("#history_comment").val(template)
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
    el.find('#btn-expand').click();

    /////////////////导出选中记录/////////////////
    let get_selected_records = function() {
        let rows = $tbl_his.bootstrapTable('getAllSelections');
        if(rows.length)
            return rows;
        else {
            MyNotify.error('未选择需要导出的记录');
            return false
        }
    };

    let $ipt_clipboard   = el.find('#ipt-clipboard');
    let $btn_export_file = el.find("#btn-export_file");
    let $btn_export_clip = el.find("#btn-export_clipboard");
    $btn_export_file.click(function () {
        let selections = get_selected_records();
        if(! selections) return;

        let data = format_export_data(selections);
        download(data, '充提记录.csv', 'text/plain');
    });
    $btn_export_clip.on('click', function () {
        let selections = get_selected_records();
        if(! selections) return;

        $ipt_clipboard.val(format_export_data(selections));
    });

    let column_to_export = {
        chain_type: ['Chain', row => [row.from_chain_type, row.to_chain_type].join(' -> '), 14],
        from_to:    ['From -> To', row => [row.from_account_name, row.monitor_account_name].join(' -> '), 88],
        in_amount:  ['转入金额', row => [row.in_amount, row.in_asset_alias.length && row.in_asset_alias || row.in_asset_name].join(' '), 40],
        in_decrypted_memo:  ['备注',           null, 48],
        in_block_num:       ['转入块号',        null, 10],
        in_trx_id:          ['转入交易ID',      null, 68],
        out_amount:         ['转出金额',        null, 20],
        process_status:     ['状态', row => process_status_trans[row.process_status] || row.process_status]
    };

    function format_export_data(rows) {
        let format_row = (row) => {
            return Object.keys(column_to_export).map(key => {
                let val = column_to_export[key];
                let res = null;
                if(val[1]) {
                    res = val[1](row)
                } else {
                    res = row[key];
                }
                if(val[2]) {
                    let res_len = res.length;
                    let diff    = val[2] - res_len;
                    diff > 0    && (res = ' '.repeat(diff) + res);
                }

                return res;
            }).join(', ')
        };
        let format_header = () => {
            return Object.keys(column_to_export).map(key => {
                let val = column_to_export[key];
                let res = val[0];
                if(val[2]) {
                    let res_len = res.split('').map(chr => {
                        if(/[ ->1-9A-Za-z]/.test(chr))
                            return 1;
                        else
                            return 2;
                    }).reduce( (a,b) => a+b);
                    let diff    = val[2] - res_len;
                    diff > 0    && (res = ' '.repeat(diff) + res);
                }
                return res;
            }).join(', ')
        };

        let formatted_data = rows.map( row => {
            return format_row(row)
        }).join('\n');

        return [format_header(), formatted_data].join('\n')
    }

    let clipboard = new ClipboardJS('#btn-export_clipboard', {
        text: function(trigger) {
            return $ipt_clipboard.val();
        }
    });
    clipboard.on('success', function(e) {
        if ($ipt_clipboard.val().length > 0)
            MyNotify.success('导出成功');
    });
    clipboard.on('error', function(e) {
        MyNotify.error('导出失败');
        console.error('Action:' + e.action);
        console.error('Trigger:' + e.trigger);
    });

    $chk_failed.on('change', function (e) {
        $tbl_his.bootstrapTable('refresh');
    });
    $chk_unhandled.on('change', function (e) {
        $tbl_his.bootstrapTable('refresh');
    })
});
