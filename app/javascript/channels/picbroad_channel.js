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
      // console.log("received");
      // console.log(data['turnflag']);
      if(data['current_order'] != $('#user_info').data('randorder')){
        if(data['count']){ //undefined除外処理
          // console.log("im drawing");
          $("#count-down").text(String(data['count']))
          if(data['count'] <= 10) {
            $('#count-down').css('color','red');
          }else{
            $('#count-down').css('color','black');
          }
        }else{
          $("#count-down").text(String(0))
          $('#count-down').css('color','red');
        }
      }
      // console.log("currentorder-finished");
      if(data['turnflag'] == 0){
        // console.log("entered turnflag");
        $("#current_draw_number").removeAttr("class");
        $("#current_draw_number").attr({class : String(data['current_order'])});
        $("#current_rotation").removeAttr("class");
        $("#current_rotation").attr({class : String(data['rotation'])});
        $("#th_turn").removeAttr("class");
        $("#th_turn").attr({class : String(data['th_turn'])});
        $("#last_picname").removeAttr("class");
        $("#last_picname").attr({class : String(data['picname'])});
        if(String($('#user_info').data('randorder')) === $("#current_draw_number").attr("class")){
          $("#can_you_draw").removeAttr("class");
          $("#can_you_draw").attr({class : "yes"})
        }else{
          $("#can_you_draw").removeAttr("class");
          $("#can_you_draw").attr({class : "no"})
        }
        function ajaxUpdate(url, element) {
          url = url + '?ver=' + new Date().getTime();
          var ajax = new XMLHttpRequest;
          ajax.open('GET', url, true);
          ajax.onload = function () {
              element.innerHTML = ajax.responseText;
          };
          ajax.send(null);
        };
        let turn_count = Number($("#turn-count").html());
        // console.log(turn_count);
        turn_count -= 1
        $('#turn-count').text(String(turn_count));

        var url = $('#user_info').data('room_name') + "/myturnajax.html.erb";
        var div = document.getElementById('btn-reload');
        var url_for_pic = $('#user_info').data('room_name') + "/picajax.html.erb";
        var div_for_pic = document.getElementById('picreload');
        function broadcast() {
          ajaxUpdate(url, div);
          ajaxUpdate(url_for_pic, div_for_pic);
        };
        window.setTimeout(broadcast, 3000);
      }else if(data['finish'] === 0){
        // console.log("game has finished!!!");
        function toResult(){
          window.location.pathname = "rooms/" + data['roomname'] + "/results"
          // console.log("movecancel");
        };
        window.setTimeout(toResult, 500);
      }
    },

    // picreload: function(picreloading) {
    //   return this.perform('picreload',  {
    //     picreloading: picreloading
    //   });
    // },
    turn: function(current_order, turnflag, room_id, rotation, th_turn, picname, judge) {
      return this.perform('turn',  {
        current_order: current_order,
        turnflag: turnflag,
        room_id: room_id,
        rotation: rotation,
        th_turn: th_turn,
        picname: picname,
        judge: judge
      });
    },

    countDown: function(count, current_order){
      return this.perform('countDown',  {
        count: count,
        current_order: current_order,
      });
    },

    finish: function(finish, roomname, prejudge, lastjudge, length, th_turn, room_id) {
      return this.perform('finish',  {
        finish: finish,
        roomname: roomname,
        prejudge: prejudge,
        lastjudge: lastjudge,
        length: length,
        th_turn: th_turn,
        room_id: room_id
      });
    }
  });

  let next_order = 0
  let rotation = Number($('#current_rotation').attr("class"))
  let th_turn = Number($('#th_turn').attr("class"))
  let last_picname = $('#last_picname').attr("class")
  let last_character = last_picname.slice( -1 )
  let judge = 0
  let points = 0

  function postPicture(){
    // const canvas = document.querySelector('#draw-area');
    let rawdata = canvas.toDataURL();
    // let picname = $('#picname_form').val()
    $.ajax({
        type: 'post',
        url: '/picpost',
        data: {picture: {image: rawdata,
          room_name: $('#user_info').data('room_name'),
          user_id: $('#user_info').data('user_id'),
          picname: $('#picname_form').val(),
          length: $('#picname_form').val().length,
          judge: judge,
          points: points,
          in_room_order: Number($('#th_turn').attr("class"))}},
        // success: function(data){
        //   clearInterval(countDown);
        // }
    });
  };
  function ordinal_rotation(){
    // console.log("entered ordinal rotation function");
    if (Number($('#user_info').data('randorder')) + 1 === Number($('#user_info').data('player_amount'))){
      // console.log("last turn in the rotation");
      next_order = 0
      rotation += 1
    }else{
      // console.log("normal turn in the rotation");
      next_order = Number($('#user_info').data('randorder')) + 1
      rotation = Number($('#current_rotation').attr("class"))
    }
    $('#turn-btn').text('...');
    postPicture();
    th_turn = Number($('#th_turn').attr("class")) + 1
    appPicpost.turn(next_order, 0, $('#user_info').data('room_id'), rotation, th_turn, $('#picname_form').val(), judge);
    // console.log("appPicpost.turn ends here");
  };

  function last_rotation(){
    if (Number($('#user_info').data('randorder')) + 1 === Number($('#user_info').data('player_amount'))){
      // console.log("finish!!!");
      let prejudge = judge
      lastCharacter($('#picname_form').val());
      makeJudge($('#rand_last_character').attr("class"));
      let lastjudge = judge
      let current_length = $('#picname_form').val().length
      // console.log(prejudge);
      // console.log(lastjudge);
      let points1 = 0;
      let points2 = 0;
      if (prejudge == 1){
        points1 = (current_length**2)*2
      }else{
        points1 = Math.floor((current_length**2)/2)
      }
      if (lastjudge == 1){
        points2 = (current_length**2)*2
      }else{
        points2 = Math.floor((current_length**2)/2)
      }
      points = points1 + points2
      // console.log(points);
      postPicture();
      $('#turn-btn').text('ゲーム終了!...');
      function finishgame(){
        appPicpost.finish(0, $('#user_info').data('room_name'), prejudge, lastjudge, $('#picname_form').val().length, Number($('#th_turn').attr("class")), $('#user_info').data('room_id'));
      }
      window.setTimeout(finishgame, 3000);
    }else{
      next_order = Number($('#user_info').data('randorder')) + 1;
      rotation = Number($('#current_rotation').attr("class"));
      th_turn = Number($('#th_turn').attr("class")) + 1;
      $('#turn-btn').text('...');
      postPicture();
      appPicpost.turn(next_order, 0, $('#user_info').data('room_id'), rotation, th_turn, $('#picname_form').val(), judge);
    }
  };

  function gameMaster(){
    if(Number($('#user_info').data('player_amount')) < 3){ //2人以下で遊ぶ場合
      if(Number($('#current_rotation').attr("class")) < 3){ //2周以下の処理 ####################必ず直す
        // console.log("before ordinal rotation");
        ordinal_rotation();
      }else{ //最終周の処理
        last_rotation();
      };
    }else if (Number($('#user_info').data('player_amount')) < 5){ //3人以上4人以下で遊ぶ場合
      // console.log("3 players mode");
      if(Number($('#current_rotation').attr("class")) < 2){//1周目の処理
        // console.log("ordinal rotation 1st");
        ordinal_rotation();
      }else{//2周目(最終周)の処理
        // console.log("last rotation");
        last_rotation();
      };
    }else{ //5人以上で遊ぶ場合
      last_rotation();
    };
  };

  function isHiragana(str){
    str = (str==null)?"":str;
    if(str.match(/^[ぁ-んー・]*$/)){    //"ー"の後ろの文字は全角スペースです。
      return true;
    }else{
      return false;
    }
  }

  function irregularLastLetter(str){
    str = (str==null)?"":str;
    if(str.match(/^[ぁぃぅぇぉゃゅょっんー]*$/)){    //"ー"の後ろの文字は全角スペースです。
      return true;
    }else{
      return false;
    }
  }

  function lastCharacter(character){
    last_character = character;
    if(Number($('#th_turn').attr("class")) == 1){
      // console.log("this is first turn");
      last_character = $('#rand_first_character').attr("class")
    }else{
      if(irregularLastLetter(last_character.slice( -1 ))){
        // console.log("irregular pattern");
        last_character = last_character.slice( -1 )
        if(last_character == "ん"){
          let length_of_picname = character.length
          last_picname = character
          last_character = last_picname.substr(length_of_picname - 2, 1 )
          if(irregularLastLetter(last_character)){
            if(last_character == "ゃ"){
            last_character = "や"
            }else if(last_character == "ゅ"){
              last_character = "ゆ"
            }else if(last_character == "ょ"){
              last_character = "よ"
            }else if(last_character == "ー"){
              let length_of_picname = character.length
              last_picname = character
              last_character = last_picname.substr(length_of_picname - 3, 1 )
            }else if(last_character == "ぁ"){
              last_character = "あ"
            }else if(last_character == "ぃ"){
              last_character = "い"
            }else if(last_character == "ぅ"){
              last_character = "う"
            }else if(last_character == "ぇ"){
              last_character = "え"
            }else if(last_character == "ぉ"){
              last_character = "お"
            };
          };
        }else if(last_character == "ゃ"){
          last_character = "や"
        }else if(last_character == "ゅ"){
          last_character = "ゆ"
        }else if(last_character == "ょ"){
          last_character = "よ"
        }else if(last_character == "ー"){
          let length_of_picname = character.length
          last_picname = character
          last_character = last_picname.substr(length_of_picname - 2, 1 )
        }else if(last_character == "ぁ"){
          last_character = "あ"
        }else if(last_character == "ぃ"){
          last_character = "い"
        }else if(last_character == "ぅ"){
          last_character = "う"
        }else if(last_character == "ぇ"){
          last_character = "え"
        }else if(last_character == "ぉ"){
          last_character = "お"
        }else if(last_character == "っ"){
          let length_of_picname = character.length
          last_picname = character
          last_character = last_picname.substr(length_of_picname - 2, 1 )
        }
      }else{
        // console.log("normal")
        last_character = character.slice( -1 )
        // console.log(last_character);
      }
      // console.log("最後の文字は" + last_character);
    }
  };

  function makeJudge(word){
    if(word.slice(0, 1) == last_character){
      judge = 1
      // console.log("you got right!!");
      points = ($('#picname_form').val().length ** 2) * 2
      // console.log(points);
    }else{
      judge = 0
      // console.log("booooo");
      points = Math.floor(($('#picname_form').val().length ** 2) / 2)
      // console.log(points);
    }
  }

  window.onload = function() {
    const elem = document.getElementById('btn-reload');
    const config = {
      attributes: true,
      childList: true,
      characterData: true
    };
    var observer = new MutationObserver(function(){
      const canvas = document.querySelector('#draw-area');
      const ctx = canvas.getContext('2d');
      // ctx.fillStyle = "white"; //#############################################################################
      ctx.clearRect(0,0,canvas.width, canvas.height);
      $('.current-players').css('background-color','#F8DF77');
      $('#'+$("#current_draw_number").attr("class")+'th-player').css('background-color','#FF4E62');

      if(String($('#user_info').data('randorder')) === $("#current_draw_number").attr("class")){
        // console.log("you can draw");
        $("#can_you_draw").removeAttr("class");
        $("#can_you_draw").attr({class : "yes"})
        let count = 60;
        let countDown = setInterval(function(){
          count -= 1
          appPicpost.countDown(count, $("#current_draw_number").attr("class"));
          $("#count-down").text(String(count))
          if(count <= 0) {
            appPicpost.countDown(count, $("#current_draw_number").attr("class"));
            $("#can_you_draw").removeAttr("class");
            $("#can_you_draw").attr({class : "no"})
            clearInterval(countDown);
          }else if(count <= 10){
            $('#count-down').css('color','red');
          }else{
            $('#count-down').css('color','black');
          }
        },1000);
        $('#turn-btn').on('click', function() {
          if(isHiragana($('#picname_form').val()) && $('#picname_form').val().length>0){
            lastCharacter($('#last_picname').attr("class"));
            makeJudge($('#picname_form').val());
            // console.log("before certification");
            if(confirm("【" + $('#picname_form').val() + "】（" + String($('#picname_form').val().length) + "文字）でほんとにおっけー？")){
              // console.log("click verify");
              gameMaster();
              $("#can_you_draw").removeAttr("class");
              $("#can_you_draw").attr({class : "no"})
              clearInterval(countDown);
            }
          }else{
            alert("ひらがなをにゅうりょくしよう！");
            // $("#wordcount").text(String($('#picname_form').val().length) + "文字")
          }
        });
        // $("#picname_form").keyup(function(event) {
        //   $("#wordcount").text(String($('#picname_form').val().length) + "文字")
        // });
        $("#picname_form").keydown(function(event) {
          if (event.key === "Enter"){
            if(isHiragana($('#picname_form').val()) && $('#picname_form').val().length>0){
              lastCharacter($('#last_picname').attr("class"));
              makeJudge($('#picname_form').val());
              // console.log("click ver before certification");
              if(confirm("【" + $('#picname_form').val() + "】（" + String($('#picname_form').val().length) + "文字）でほんとにおっけー？")){
                // console.log("enter verify");
                event.preventDefault();
                gameMaster();
                $("#can_you_draw").removeAttr("class");
                $("#can_you_draw").attr({class : "no"});
                clearInterval(countDown);
              }
            }else{
              alert("ひらがなでにゅうりょくしよう！");
              // $("#wordcount").text(String($('#picname_form').val().length) + "文字")
            };
          };
        });
      }else{
        $("#can_you_draw").removeAttr("class");
        $("#can_you_draw").attr({class : "no"})
      }

      // console.log('DOMが変化しました');
    });
    observer.observe(elem, config);
  };

});