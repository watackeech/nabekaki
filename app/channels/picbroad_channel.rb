class PicbroadChannel < ApplicationCable::Channel
  def subscribed
    stream_from "picbroad_channel_#{params['room']}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def reflect(data)
    ActionCable.server.broadcast "picbroad_channel_#{params['room']}", reflecting: data['reflecting']
  end
end
