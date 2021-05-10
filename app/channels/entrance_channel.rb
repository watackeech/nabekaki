class EntranceChannel < ApplicationCable::Channel
  def subscribed
    stream_from "entrance_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def join(data)
    if Room.where(room_name: data['roomname']).exists?
      User.find(data['userid']).update(roomname: data['roomname'])
      ActionCable.server.broadcast 'entrance_channel', roomname: data['roomname'], userid: data['userid'], roomname: data['roomname']
    else
      return
    end
  end
end
