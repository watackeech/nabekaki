window.addEventListener("keypress", function(e) {
    if (e.keyCode === 13) {
      // rails のほうでルーム名入力ミスの通知ができなかったらこっちで分岐書きたい
    //   $("#new_room").submit();
      console.log($('#new_room_name').val());

      e.preventDefault();
      $.ajax({
        type: 'post',
        url: '/rooms',
        data: {room: {
          // image: rawdata,
            room_name: $('#room_room_name').val(),
          // user_id: $('#user_info').data('user_id'),
          // picname: $('#picname_form').val(),
          // length: $('#picname_form').val().length,
          // judge: judge,
          // points: points,
        //   in_room_order: Number($('#th_turn').attr("class"))
        }},
        // success: function(data){
        //   // $("#delete_button").click();
        // }
      });

    //   e.target.value = '';
    }
});