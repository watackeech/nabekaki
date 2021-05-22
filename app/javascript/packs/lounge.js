
document.addEventListener("DOMContentLoaded", function(){
    window.addEventListener('load', function () {
    // console.log("loading");
    function ajaxUpdate(url, element) {

        // urlを加工し、キャッシュされないurlにする。
        url = url + '?ver=' + new Date().getTime();

        // ajaxオブジェクト生成
        var ajax = new XMLHttpRequest;

        // ajax通信open
        ajax.open('GET', url, true);

        // ajax返信時の処理
        ajax.onload = function () {

            // ajax返信から得たHTMLでDOM要素を更新
            element.innerHTML = ajax.responseText;
        };

        // ajax開始
        ajax.send(null);
    }
    var url ="loungeajax.html.erb";

    var div = document.getElementById('lounge-ajaxreload');

    function selfload() {
        ajaxUpdate(url, div);
    };
    selfload();

    });
});