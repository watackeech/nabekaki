import consumer from "./consumer"

const appLounge = consumer.subscriptions.create({channel: 'LoungeChannel', room: $('#room_info').data('room_name') }, {
  connected() {
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    console.log("Game Start!");
    if(data['game'] === 0 && $('#room_info').data('room_name') === data['roomname']){
      window.location.pathname = "rooms/" + data['roomname']
    }
  },

  start: function(roomname, game, rand_first_character, rand_last_character) {
    return this.perform('start', {
      roomname: roomname,
      game: game,
      rand_first_character: rand_first_character,
      rand_last_character: rand_last_character
    });
  },

  // deleteroom: function(roomname) {
  //   return this.perform('deleteroom', {roomname: roomname});
  // }
});

window.addEventListener('load', function () {
  let characters = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわがぎぐげござじずぜぞだづでどばびぶべぼぱぴぷぺぽきいち"
  let initial_rand = Math.floor( Math.random() * (70) );
  let final_rand = Math.floor( Math.random() * (70) );
  $('#start-btn').on('click', function() {
    appLounge.start($('#room_info').data('room_name'), 0, characters.substr(initial_rand, 1), characters.substr(final_rand, 1))
  });
});
