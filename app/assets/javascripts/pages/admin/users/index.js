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
    var el = $('body');

    // Metronic.init(); // init metronic core componets
    // Layout.init(); // init layout
    // Demo.init(); // init demo features

    var $tbl_users = el.find('#tbl-users');
    $tbl_users.bootstrapTable({
        columns: [
            {
                checkbox: true,
            },
            {
                field: 'id',
                title: 'ID',
                visible: false
                // sortable: true
            },
            {
                field: 'username',
                title: '用户名',
            },
            {
                field: 'email',
                title: '邮箱',
            },
            {
                field: 'genre',
                title: '类型',
            },
            {
                title: '操作',
                // events: {
                //     'click .delete': function (e, value, row, idx) {
                //         deleteUser(row.id)
                //     },
                //     'click .edit': function (e, val, row, idx) {
                //         window.location = userEditLink(row.id)
                //     }
                // },
                formatter: function (value, row, index) {
                    return [
                        '<a href="/admin/users/' + row.id + '/edit" class="btn default btn-xs purple delete">' +
                        '<i class="fa fa-edit"></i> 编辑' +
                        '</a>' +
                        '<a href="/admin/users/' + row.id + '/password" class="btn default btn-xs black edit">' +
                        '<i class="fa fa-edit"></i> 修改密码' +
                        '</a>'
                    ].join('')
                },
            }
        ]
    });

    /**
     * 表格记录 (un)check 事件监听器
     * @param row 行数据
     * @param $element 行DOM
     */
    function onCheckChange(row, $element) {
        if($tbl_users.bootstrapTable('getSelections').length) {
            el.find('#btn-delete_users').attr('disabled', false);
        } else {
            el.find('#btn-delete_users').attr('disabled', 'disabled');
        }
    }

    $tbl_users.on('check.bs.table', onCheckChange);
    $tbl_users.on('uncheck.bs.table', onCheckChange);

    /**
     * 用户类型状态筛选
     */
    el.on('change', 'input[name="genre"]', function () {
        var genre = el.find('input[name="genre"]:checked').val();
        $tbl_users.bootstrapTable("resetSearch", genre === '3' ? '管理员' : '')
    });

    /**
     * 批量删除按钮
     */
    el.on('click', '#btn-delete_users', function (e) {
        if(! confirm("确认删除？")) return;
        e.preventDefault();
        var selection = $tbl_users.bootstrapTable('getSelections');
        if(! selection.length) {
            return
        }
        var ids = selection.map(function (ele) {
            return ele.id
        });
        el.find('#ipt-ids').val('[' + ids + ']');
        el.find('#frm-tbl_actions').submit();
        el.find('#ipt-ids').val('');
    })
});
