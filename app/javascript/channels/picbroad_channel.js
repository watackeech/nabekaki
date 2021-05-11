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
      appPicpost.reflect(0)
    });
  };

});
// });