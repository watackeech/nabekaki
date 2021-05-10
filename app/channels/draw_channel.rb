class DrawChannel < ApplicationCable::Channel
  def subscribed
    stream_from "draw_channel_#{params['room']}"
    # stream_from "some_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def reflect(data)
    ActionCable.server.broadcast "draw_channel_#{params['room']}", color: data['color'], width: data['width'], isDrag: data['isDrag'], currentX: data['currentX'], currentY: data['currentY'], prex: data['prex'], prey: data['prey'], lastTime: data['lastTime']
  end

  def path(data)
    ActionCable.server.broadcast "draw_channel_#{params['room']}", begin: data['begin'], close: data['close']
  end

  def turn(data)
    ActionCable.server.broadcast "draw_channel_#{params['room']}", userid: data['userid'], flag: data['flag']
  end
end
