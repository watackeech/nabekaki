class LoungeChannel < ApplicationCable::Channel
  def subscribed
    stream_from "lounge_channel_#{params['room']}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def start(data)
    Room.where(room_name: data['roomname']).update(rand_first_character: data['rand_first_character'])
    Room.where(room_name: data['roomname']).update(rand_last_character: data['rand_last_character'])
    User.where(roomname: data['roomname']).each do |player|
      player.update(randnum: rand(64))
    end
    x = 0
    User.where(roomname: data['roomname']).order(:randnum).each do |bigtetsu|
      bigtetsu.update(randorder: x)
      x += 1
    end



    ActionCable.server.broadcast "lounge_channel_#{params['room']}", roomname: data['roomname'], game: data['game'], rand_first_character: data['rand_first_character']
  end

  # def deleteroom(data)
  #   # if Room.created_time + 10 < Time.now
  #     ActionCable.server.broadcast "lounge_channel_#{params['room']}", roomname: data['roomname']
  #   # else

  #   # end
  # end

  # def leave(data)
  #   User.find(data['userid']).update(roomname: nil)
  #   ActionCable.server.broadcast 'lounge_channel', roomname: data['roomname'], userid: data['userid'], leaving: data['leaving']
  # end
end
