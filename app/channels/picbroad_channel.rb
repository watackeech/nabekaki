class PicbroadChannel < ApplicationCable::Channel
  def subscribed
    stream_from "picbroad_channel_#{params['room']}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def picreload(data)
    ActionCable.server.broadcast "picbroad_channel_#{params['room']}", picreloading: data['picreloading']
  end

  def turn(data)
    Room.find(data['room_id']).update(current_drawing_number: data['current_order'])
    Room.find(data['room_id']).update(rotation: data['rotation'])
    ActionCable.server.broadcast "picbroad_channel_#{params['room']}", current_order: data['current_order'], turnflag: data['turnflag'], room_id: data['room_id'], rotation: data['rotation']
  end

  def finish(data)
    x = 1
    Picture.where(room_name: data['roomname']).order(:id).each do |p|
      p.update(in_room_order: x)
      x += 1
    end
    ActionCable.server.broadcast "picbroad_channel_#{params['room']}", finish: data['finish'], roomname: data['roomname']
  end
end
