import consumer from "./consumer"

// $(document).on('turbolinks:load', function() {
document.addEventListener("DOMContentLoaded", function(){

  const canvas = document.querySelector('#draw-area');
  const ctx = canvas.getContext('2d');

  const appPicpost = consumer.subscriptions.create({channel: 'PicbroadChannel', room: $('#user_info').data('room_name') }, {
    connected() {
      // Called when the subscription is ready for use on the server
    },

    disconnected() {
      // Called when the subscription has been terminated by the server
    },

    received(data) {
      if(data['turnflag'] === 0){
        console.log("received!");
        $("#current_draw_number").removeAttr("class");
        $("#current_draw_number").attr({class : String(data['current_order'])});
        $("#current_rotation").removeAttr("class");
        $("#current_rotation").attr({class : String(data['rotation'])});
        function ajaxUpdate(url, element) {
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
        var url_for_pic = $('#user_info').data('room_name') + "/picajax.html.erb";
        var div_for_pic = document.getElementById('picreload');
        function broadcast() {
        　ajaxUpdate(url, div);
          ajaxUpdate(url_for_pic, div_for_pic);
          const canvas = document.querySelector('#draw-area');
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
        window.setTimeout(broadcast, 3000);
        console.log("pic rendered!");
      }else if(data['finish'] === 0){
        function toResult(){
          window.location.pathname = "rooms/" + data['roomname'] + "/results"
        };
        window.setTimeout(toResult, 500);
      }
    },

    // picreload: function(picreloading) {
    //   return this.perform('picreload',  {
    //     picreloading: picreloading
    //   });
    // },
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


  function postPicture(){
    // const canvas = document.querySelector('#draw-area');
    let rawdata = canvas.toDataURL();
    let picname = "picnametest"
    $.ajax({
        type: 'post',
        url: '/picpost',
        data: {picture: {image: rawdata, room_name: $('#user_info').data('room_name'), user_id: $('#user_info').data('user_id'), picname: picname}},
        success: function(data){
          // $("#delete_button").click();
        }
    });
  }
  function ordinal_rotation(){
    if (Number($('#user_info').data('randorder')) + 1 === Number($('#user_info').data('player_amount'))){
      next_order = 0
      rotation += 1
    }else{
      next_order = Number($('#user_info').data('randorder')) + 1
      rotation = Number($('#current_rotation').attr("class"))
    }
    $('#turn-btn').text('送信中!...');
    postPicture();
    appPicpost.turn(next_order, 0, $('#user_info').data('room_id'), rotation);
  };

  function last_rotation(){
    if (Number($('#user_info').data('randorder')) + 1 === Number($('#user_info').data('player_amount'))){
      console.log("finish!!!");
      postPicture();
      $('#turn-btn').text('ゲーム終了!...');
      function finishgame(){
        appPicpost.finish(0, $('#user_info').data('room_name'));
      }
      window.setTimeout(finishgame, 3000);
    }else{
      next_order = Number($('#user_info').data('randorder')) + 1
      rotation = Number($('#current_rotation').attr("class"))
      $('#turn-btn').text('送信中!...');
      postPicture();
      appPicpost.turn(next_order, 0, $('#user_info').data('room_id'), rotation);
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
      });
      console.log('DOMが変化しました');
    });
    observer.observe(elem, config);
    // $('#picpost-btn').on('click', function() {
    //   // document.getElementById('picpost-btn').textContent = '送信中...';
    //   // この辺のidはhtml確認
    //   const canvas = document.querySelector('#draw-area');
    //   let rawdata = canvas.toDataURL();
    //   $.ajax({
    //       type: 'post',
    //       url: '/picpost',
    //       data: {picture: {image: rawdata, room_name: $('#user_info').data('room_name'), user_id: $('#user_info').data('user_id'), picname: picname}},
    //       success: function(data){
    //         // $("#delete_button").click();
    //       }
    //   });
    //   // function broadreflect() {
    //   appPicpost.picreload(0);
    //   console.log("sending now");
    //   // };
    //   // window.setTimeout(broadreflect, 1000);
    // });
    // function postPicture(){
    //   // const canvas = document.querySelector('#draw-area');
    //   let rawdata = canvas.toDataURL();
    //   let picname = "picnametest"
    //   $.ajax({
    //       type: 'post',
    //       url: '/picpost',
    //       data: {picture: {image: rawdata, room_name: $('#user_info').data('room_name'), user_id: $('#user_info').data('user_id'), picname: picname}},
    //       success: function(data){
    //         // $("#delete_button").click();
    //       }
    //   });
    // }
  };

});
// });