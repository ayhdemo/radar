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

$(function () {
    'use strict';

    Layout.init(); // init layout

    let mylib = window.mylib;
    var el = $('body');

    $('#btn-submit-ss-settings').click(function(e) {
        e.preventDefault();
        var change_set = []
        $('.rader_ss_setting').each((function(idx, $setting) {
            var $rader_value = $('.rader-value', $setting);
            var key = $rader_value.data('key');
            var default_val = $rader_value.data('default').toString();
            var val = $rader_value.val();

            if (val !== default_val) {
                change_set.push([key,val])
            }
        }))
        
        if (change_set.length == 0)
            return

        $.ajax({
            url: '/admin/rader_settings/batch_update',
            method: 'put',
            data: {change_set},
            success: function(data) {
                alert('更新成功')
                location.reload();
            },
            error: function(err) {
                console.error(err)
                alert('更新失败')
            }
        })
    })
    $('#btn-submit-fanyan-settings').click(function(e) {
        e.preventDefault();
        var change_set = []

        var $rader_value = $('#pinggu_pramas_setting_value');
        var key = $rader_value.data('key');
        var default_val = $rader_value.data('default').toString();
        var val = $rader_value.val();

        if (val !== default_val) {
            change_set.push([key,val])
        }

        if (change_set.length == 0)
            return

        $.ajax({
            url: '/admin/rader_settings/batch_update',
            method: 'put',
            data: {change_set},
            success: function(data) {
                alert('更新成功')
                location.reload();
            },
            error: function(err) {
                console.error(err)
                alert('更新失败')
            }
        })
    })

    var $pinggu_pramas_setting_value = $('#pinggu_pramas_setting_value');
    $pinggu_pramas_setting_value.on('keyup', updateMatrix); //keyup事件更符合逻辑；change事件需要更换焦点，或者enter or tab；

    var $tbl_fanyan_matrix = $('#tbl-fanyan-matrix');
    updateMatrix()

    function updateMatrix() {
        var matrix = [];
        var matrix_str = $pinggu_pramas_setting_value.val();
        var reg = /\d+[^,]*\/[^,]*\d+/gi
        var matrix_hot = matrix_str.replaceAll(/[ \[\]]/g, '').split(',');

        if(matrix_hot.length != 13 * 13) {
            return;
        }

        var size = 13;
        for (var i=0; i<matrix_hot.length; i+=size) {
            matrix.push(matrix_hot.slice(i,i+size));
        }
        var html_str = matrix.map(row => {
            var tr = row.map(cell => {
                return `<td>${cell}</td>`
            }).join('')

            return `<tr>${tr}</tr>`;
        }).join('');

        $('tbody', $tbl_fanyan_matrix).html(html_str);
    }
});
