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
      if(data['picreload'] === 0){
        function ajaxUpdate(url, element) {
          url = url + '?ver=' + new Date().getTime();
          var ajax = new XMLHttpRequest;
          ajax.open('GET', url, true);
          ajax.onload = function () {
              element.innerHTML = ajax.responseText;
          };
          ajax.send(null);
        };
        var url = $('#user_info').data('room_name') + "/picajax.html.erb";
        var div = document.getElementById('picreload');
        function broadcast() {
            ajaxUpdate(url, div);
        };
        window.setTimeout(broadcast, 2000);
      }else if(data['turnflag'] === 0){
        $("#current_draw_number").removeAttr("class");
        $("#current_draw_number").attr({class : String(data['current_order'])});
        $("#current_rotation").removeAttr("class");
        $("#current_rotation").attr({class : String(data['rotation'])});
        function myturnAjax(url, element) {
          url = url + '?ver=' + new Date().getTime();
          var ajax = new XMLHttpRequest;
          ajax.open('GET', url, true);
          ajax.onload = function () {
              element.innerHTML = ajax.responseText;
          };
          ajax.send(null);
        };
        var url = $('#user_info').data('room_name') + "/myturnajax.html.erb";
        var div = document.getElementById('btn-reload');
        myturnAjax(url, div);
      }else if(data['finish'] === 0){
        window.location.pathname = "rooms/" + data['roomname'] + "/results"
      }
    },


    picreload: function(picreloading) {
      return this.perform('picreload',  {
        picreloading: picreloading
      });
    },
    turn: function(current_order, turnflag, room_id, rotation) {
      return this.perform('turn',  {
        current_order: current_order,
        turnflag: turnflag,
        room_id: room_id,
        rotation: rotation
      });
    },

    finish: function(finish, roomname) {
      return this.perform('finish',  {
        finish: finish,
        roomname: roomname
      });
    }
  });


  let next_order = 0
  let rotation = Number($('#current_rotation').attr("class"))

  function ordinal_rotation(){
    if (Number($('#user_info').data('randorder')) + 1 === Number($('#user_info').data('player_amount'))){
      next_order = 0
      rotation += 1
    }else{
      next_order = Number($('#user_info').data('randorder')) + 1
      rotation = Number($('#current_rotation').attr("class"))
    }
  };

  function last_rotation(){
    if (Number($('#user_info').data('randorder')) + 1 === Number($('#user_info').data('player_amount'))){
      console.log("finish!!!");
      appPicpost.finish(0, $('#user_info').data('roomname'));
    }else{
      next_order = Number($('#user_info').data('randorder')) + 1
      rotation = Number($('#current_rotation').attr("class"))
    }
  };

  window.onload = function() {
    const elem = document.getElementById('btn-reload');
    const config = {
      attributes: true,
      childList: true,
      characterData: true
    };
    var observer = new MutationObserver(function(){
      console.log(rotation);
      $('#turn-btn').on('click', function() {
        if(Number($('#user_info').data('player_amount')) < 3){ //2人以下で遊ぶ場合
          if(Number($('#current_rotation').attr("class")) < 3){ //二周以下の処理
            ordinal_rotation();
          }else{ //最終周の処理
            last_rotation();
          };
        }else if (Number($('#user_info').data('player_amount')) < 5){ //3人以上4人以下で遊ぶ場合
          if(Number($('#current_rotation').attr("class")) < 2){//1周目の処理
            ordinal_rotation
          }else{//2周目(最終周)の処理
            last_rotation();
          };
        }else{ //5人以上で遊ぶ場合
          last_rotation();
        };
        console.log(rotation);
        appPicpost.turn(next_order, 0, $('#user_info').data('room_id'), rotation);
      });
      console.log('DOMが変化しました');
    });
    observer.observe(elem, config);
    $('#picpost-btn').on('click', function() {
      // document.getElementById('picpost-btn').textContent = '送信中...';
      // この辺のidはhtml確認
      const canvas = document.querySelector('#draw-area');
      let rawdata = canvas.toDataURL();
      function getNowYMDhmsStr(){
        const date = new Date();
        const Y = date.getFullYear();
        const M = ("00" + (date.getMonth()+1)).slice(-2);
        const D = ("00" + date.getDate()).slice(-2);
        const h = ("00" + date.getHours()).slice(-2);
        const m = ("00" + date.getMinutes()).slice(-2);
        const s = ("00" + date.getSeconds()).slice(-2);
        return Y + M + D + h + m + s
      };
      let currenttime = getNowYMDhmsStr();
      $.ajax({
          type: 'post',
          url: '/picpost',
          data: {picture: {time : currenttime, room_name: $('#user_info').data('room_name'), user_id: $('#user_info').data('user_id'), base64: rawdata}},
          success: function(data){
            // $("#delete_button").click();
          }
      });
      // function broadreflect() {
        appPicpost.picreload(0);
      // };
      // window.setTimeout(broadreflect, 1000);
    });
  };

});
// });