

window.addEventListener('load', function () {
    function ajaxUpdate(url, element) {
        url = url + '?ver=' + new Date().getTime();
        var ajax = new XMLHttpRequest;
        ajax.open('GET', url, true);
        ajax.onload = function () {
            element.innerHTML = ajax.responseText;
        };
        ajax.send(null);
    }

    var url = $('#user_info').data('room_name') + "/picajax.html.erb";
    var div = document.getElementById('picreload');
    function broadcast() {
        ajaxUpdate(url, div);
    };
    broadcast();

    var url2 = $('#user_info').data('room_name') + "/myturnajax.html.erb";
    var div2 = document.getElementById('btn-reload');
    ajaxUpdate(url2, div2);
});