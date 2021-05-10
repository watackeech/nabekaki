class LoungeChannel < ApplicationCable::Channel
  def subscribed
    stream_from "lounge_channel_#{params['room']}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def start(data)
    User.where(roomname: data['roomname']).each do |player|
      player.update(randnum: rand(64))
    end
    ActionCable.server.broadcast "lounge_channel_#{params['room']}", roomname: data['roomname'], game: data['game']
  end

  # def leave(data)
  #   User.find(data['userid']).update(roomname: nil)
  #   ActionCable.server.broadcast 'lounge_channel', roomname: data['roomname'], userid: data['userid'], leaving: data['leaving']
  # end
end
