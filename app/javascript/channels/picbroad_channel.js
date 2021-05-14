import consumer from "./consumer"

// $(document).on('turbolinks:load', function() {
document.addEventListener("DOMContentLoaded", function(){

  // const canvas = document.querySelector('#draw-area');
  // const ctx = canvas.getContext('2d');

  const appPicpost = consumer.subscriptions.create({channel: 'PicbroadChannel', room: $('#user_info').data('room_name') }, {
    connected() {
      // Called when the subscription is ready for use on the server
    },

    disconnected() {
      // Called when the subscription has been terminated by the server
    },

    received(data) {
      console.log("received");
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
      window.setTimeout(broadcast, 3000);
    },

    reflect: function(reflecting) {
      return this.perform('reflect',  {
        reflecting: reflecting
      });
    },
  });


  window.onload = function() {
    $('#picpost-btn').on('click', function() {
      // document.getElementById('picpost-btn').textContent = '送信中...';
      // この辺のidはhtml確認
      const canvas = document.querySelector('#draw-area');
      let rawdata = canvas.toDataURL();
      function getNowYMDhmsStr(){
        const date = new Date()
        const Y = date.getFullYear()
        const M = ("00" + (date.getMonth()+1)).slice(-2)
        const D = ("00" + date.getDate()).slice(-2)
        const h = ("00" + date.getHours()).slice(-2)
        const m = ("00" + date.getMinutes()).slice(-2)
        const s = ("00" + date.getSeconds()).slice(-2)
        return Y + M + D + h + m + s
      }
      let currenttime = getNowYMDhmsStr()
      $.ajax({
          type: 'post',
          url: '/picpost',
          data: {picture: {time : currenttime, room_name: $('#user_info').data('room_name'), user_id: $('#user_info').data('user_id'), base64: rawdata}},
          success: function(data){
            // $("#delete_button").click();
          }
      });
      // function broadreflect() {
        appPicpost.reflect(0);
      // };
      // window.setTimeout(broadreflect, 1000);
    });
  };

});
// });