//= require medium-editor/dist/js/medium-editor
//= require handlebars/handlebars.runtime.min
//= require jquery-sortable/jquery-sortable.min
//= require blueimp-file-upload/vendor/jquery.ui.widget
//= require blueimp-file-upload/jquery.iframe-transport
//= require blueimp-file-upload/jquery.fileupload
//= require medium-editor-insert-plugin/dist/js/medium-editor-insert-plugin
//= require toastr/toastr


$(function() {
    var el = $('body'),
        elRichtextEditor, editor;


    //配置toastr
    toastr.options = {
        'showDuration': '1000',
        'hideDuration': '1000',
        'timeOut': '2000',
        'extendedTimeOut': '1000',
    }


    editor = new MediumEditor(".com-richtext-editor", {
        imageDragging: false,
        buttonLabels: "fontawesome",
        toolbar: {
            buttons: ["orderedlist", "unorderedlist", "h2", "quote", "bold", "italic", "anchor", "justifyLeft", "justifyCenter", "justifyRight"],
            updateOnEmptySelection: true
        },
        placeholder: {
            text: '正文内容'
        },
        paste: {
            forcePlainText: false,
            cleanPastedHTML: true
        },
        extensions: {}
    });


    $(".com-richtext-editor").mediumInsert({
        editor: editor,
        addons: {
            // 定制化模板
            "images": {
                preview: false,
                fileUploadOptions: {
                    paramName: "imgFile",
                    url: "/kindeditor/upload?dir=image",
                    acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                    maxFileSize: 2 * 1024 * 1024,
                    add: function(e, data) {
                        alert(1);
                    }
                }
            }
        }
    });


    // 绑定下一步事件
    $(".com-richtext-editor").on("InsertPlugin::next", function(e) {
        var elRichtextEditor = el.find('textarea.com-richtext-editor'),
            html = elRichtextEditor.val(),
            elWrapper = $('<div></div>');

        // 过滤h1,h2标签
        html = html.replace(/<(h1|h2)/ig, "<h3");
        html = html.replace(/(h1|h2)>/ig, "h3>");

        // 设置外链的rel属性
        elWrapper.html(html)
        elWrapper.find('a').each(function(i, link) {
            var elLink = $(link),
                url = elLink.attr('href');

            if (url && url.indexOf('qdaily.com') == -1) {
                elLink.attr('rel', 'nofollow');
            }
        })

        html = elWrapper.html();
        elRichtextEditor.val(html);

        el.find('.form-action .btn-primary').trigger('click');
    });

    // 绑定保存事件
    $(".com-richtext-editor").on("InsertPlugin::save", function(e) {
        var id = location.href.match(/\/\d+\//ig)[0].match(/\d+/)[0];

        $.ajax({
            url: '/admin/articles/' + id + '/auto_save',
            type: 'PUT',
            dataType: 'json',
            data: {
                'post[article_attributes][content]': el.find('textarea.com-richtext-editor').val()
            },
            success: function() {
                toastr.success('保存成功');
            },
            error: function() {
                toastr.error('保存失败');
            },
        });
    });


    //ctrl + s 触发保存
    $(window).keydown(function(e) {
        if ((e.metaKey || e.ctrlKey) && e.which == 83) {
            $("div.com-richtext-editor").trigger('InsertPlugin::save');

            e.preventDefault();
            e.stopPropagation();
        } else {
            return true;
        }
    });


    //动态创建按钮
    if (el.hasClass('medium_editor')) {
        el.find('.editor-body').append('<div class="reset-button">重置</div>');
    };

});
