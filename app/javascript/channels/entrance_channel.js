import consumer from "./consumer"

const appEntrance = consumer.subscriptions.create("EntranceChannel", {
  connected() {
  },

  disconnected() {
  },

  received(data) {
    if (data['userid'] === $('#user_info').data('user_id')){
      window.location.pathname = "rooms/" + data['roomname'] + "/lounge"
    }
    function ajaxUpdate(url, element) {
      url = url + '?ver=' + new Date().getTime();
      var ajax = new XMLHttpRequest;
      ajax.open('GET', url, true);
      ajax.onload = function () {
          element.innerHTML = ajax.responseText;
      };
      ajax.send(null);
    }
    var url = "ajax.html.erb";
    var div = document.getElementById('ajaxreload');
    function broadcast() {
        ajaxUpdate(url, div);
    };
    broadcast();
  },

  join: function(roomname, userid) {
    return this.perform('join', {roomname: roomname, userid: userid});
  },
});

// onloadイベントが発火しない。。
// document.addEventListener("DOMContentLoaded", function(){
//   console.log($("#in_room").attr("class"));
//   if($("#in_room").attr("class") === "boo!"){
//     console.log("not in room!");
//   }
// });
// window.onload = function() {
  window.addEventListener("keypress", function(e) {
    if (e.keyCode === 13) {
      // rails のほうでルーム名入力ミスの通知ができなかったらこっちで分岐書きたい
      appEntrance.join(e.target.value, $('#user_info').data('user_id'));
      e.target.value = '';
      e.preventDefault();
    }
  });
// };

