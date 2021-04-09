// - 移除tag的属性
// - 移除内联样式
// - 移除class及id
// - 移除多余的&nbsp;
// - 移除空标签
// - 移除只包含&nbsp的空标签
// - 移除span标签
// - 移除评论



(function() {
    var cleanReplacements = [
        // 过滤掉无用的代码
        [new RegExp(/<!--[\s\S]*?-->/ig), ''],
        [new RegExp(/<\?[\s\S]*?\?>/ig), ''],

        // 替换div标签为p标签
        [new RegExp(/\n*<div/gi), '<p'],
        [new RegExp(/<\/div>\n*/gi), '</p>']
    ];


    function cleanHTML(HTML) {
        var replacements = cleanReplacements,
            i, len;

        for (i = 0; i < replacements.length; i += 1) {
            HTML = HTML.replace(replacements[i][0], replacements[i][1]);
        }


        console.log(HTML);
        return HTML;
    }
})
