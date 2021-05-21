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

  def countDown(data)
    ActionCable.server.broadcast "picbroad_channel_#{params['room']}", count: data['count'], current_order: data['current_order']
  end

  def turn(data)
    room = Room.find(data['room_id'])
    room.update(current_drawing_number: data['current_order'])
    room.update(rotation: data['rotation'])
    room.update(th_turn: data['th_turn'])
    room.update(last_picname: data['picname'])
    if data['th_turn'] > 2 #data['th_turn']は今のターン+1
      # puts "if文再突入"
      last_order = data['th_turn'].to_i - 2
      room_name = room.room_name
      last_picture = Picture.find_by(in_room_order: last_order, room_name: room_name)
      # puts last_picture.picname
      # puts last_picture.length
      # puts last_picture.points
      # puts "ここまでおけい！！！"
      if data['judge'] == 1
        # puts "じゃっじ１のとき"
        # puts last_picture.points
        last_picture.update(points: last_picture.points + (last_picture.length**2)*2)
        # puts last_picture.points
      else
        # puts "じゃっじ０のとき"
        # puts last_picture.points
        failed_points = (last_picture.length**2)/2
        last_picture.update(points: last_picture.points + failed_points.floor)
        # puts last_picture.points
      end
    end
    ActionCable.server.broadcast "picbroad_channel_#{params['room']}", current_order: data['current_order'], turnflag: data['turnflag'], room_id: data['room_id'], rotation: data['rotation'], th_turn: data['th_turn'], picname: data['picname']
    # ActionCable.server.broadcast "picbroad_channel_#{params['room']}", current_order: data['current_order'], turnflag: data['turnflag'], room_id: data['room_id'], rotation: data['rotation'], th_turn: data['th_turn'], picname: data['picname']
  end

  def finish(data)
    # puts "いまのたーん"
    # puts data['th_turn']
    last_order = data['th_turn'].to_i - 1 #こっちのdata['th_turn']は現在のターン
    # puts "まえのたーん"
    # puts last_order
    # puts "るーむねーむ"
    # puts data['roomname']
    last_picture = Picture.find_by(in_room_order: last_order, room_name: data['roomname'])
    # puts last_picture.picname
    if data['prejudge'] == 1
      # puts "まえのじゃっじが１のとき"
      # points1 = (data['length']**2)*2
      # puts last_picture.points
      last_picture.update(points: last_picture.points + (last_picture.length**2)*2)
      # puts last_picture.points
    else
      # puts "まえのじゃっじが０のとき"
      # rawpoints = (data['length']**2)/2
      # points1 = rawpoints.floor
      # puts last_picture.points
      failed_points = (last_picture.length**2)/2
      last_picture.update(points: last_picture.points + failed_points.floor)
      # puts last_picture.points
    end

    # puts "さいしゅうけいさん"
    # players = User.where(roomname: data['roomname'])
    # players.each do |p|
    #   total_score = Picture.where(room_name: p.roomname, user_id: p.id).sum(:points)
    #   puts p.username
    #   puts total_score
    #   p.update(personal_points: total_score)
    #   puts p.personal_points
    # end
    # puts "最終計算終了"
    ActionCable.server.broadcast "picbroad_channel_#{params['room']}", finish: data['finish'], roomname: data['roomname']
  end
end