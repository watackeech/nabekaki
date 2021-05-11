function ajaxUpdate(url, element) {
    url = url + '?ver=' + new Date().getTime();
    var ajax = new XMLHttpRequest;
    ajax.open('GET', url, true);
    ajax.onload = function () {
        element.innerHTML = ajax.responseText;
    };
    ajax.send(null);
}


window.addEventListener('load', function () {
    var url = $('#user_info').data('room_name') + "/picajax.html.erb";
    var div = document.getElementById('picreload');
    function broadcast() {
        ajaxUpdate(url, div);
    };
    broadcast();
});