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

window.addEventListener('load', function () {

    var url = "ajax.html.erb";

    var div = document.getElementById('ajaxreload');

    function selfload() {
        ajaxUpdate(url, div);
        console.log("ajaxtest!");
    };
    selfload();

});