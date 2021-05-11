import consumer from "./consumer"

const appLounge = consumer.subscriptions.create({channel: 'LoungeChannel', room: $('#room_info').data('room_name') }, {
  connected() {
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    if(data['game'] === 0 && $('#room_info').data('room_name') === data['roomname']){
      window.location.pathname = "rooms/" + data['roomname']
    }
  },

  start: function(roomname, game) {
    return this.perform('start', {roomname: roomname, game: game});
  }
});

window.addEventListener('load', function () {
  $('#start-btn').on('click', function() {
    appLounge.start($('#room_info').data('room_name'), 0)
  });
});
