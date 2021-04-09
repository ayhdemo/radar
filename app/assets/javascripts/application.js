//= require jquery
//= require bootstrap/js/bootstrap.min
//= require bootstrap-auto-dismiss-alert


$(function () {
    let el = $('body');
    el.find('#btn-stop_scheduler,#btn-start_scheduler').click(e => {
        e.preventDefault();
        let $target = $(e.target);
        let text    = $target.text();
        let url     = $target.data('href');
        if(confirm(`【${text}】 \n确认执行操作 ？`)) {
            $.ajax(url)
                .then(res => {
                    console.log(res);
                    location.reload()
                })
                .fail(reason => {
                    console.log(reason);
                })
        }
    })
});

// Function to download data to a file
window.download = function(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
};