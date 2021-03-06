class RoomsController < ApplicationController
  before_action :authenticate_user!, except: [:index]

  def index
    # require "active_support/time"
    # @user = User.find(current_user.id)
    # room = Room.where("created_time > ?", Time.new - 10)
    # Picture.where(room_name: room).delete_all
    # room.delete_all
  end

  def new
    @room = Room.new
    @user = User.find(current_user.id)
  end

  def create
    room = Room.new(room_params)
    User.find(current_user.id).update(roomname: params[:room][:room_name])
    room.user_id = current_user.id
    room.created_time = Time.new
    if room.save
      redirect_to lounge_path(params[:room][:room_name])
    else
      redirect_to :action => "new"
    end
  end

  def join
    @rooms = Room.all
    @user = User.find(current_user.id)
  end

  def lounge
    @room = Room.find_by(room_name: params[:room_name])
    @user = User.find(current_user.id)
  end

  def show
    @user = User.find(current_user.id)
    @room = Room.find_by(room_name: params[:room_name])
    @players = User.where(roomname: params[:room_name]).order(:randnum)
    @picture = Picture.new
    @images = Picture.where(room_name: params[:room_name])
  end

  # ajax通信用のアクション
  def loungeajax
    render layout: false
  end

  def picajax
    @room = Room.find_by(room_name: params[:room_name])
    @images = Picture.all
    render layout: false
  end
  def myturnajax
    @room = Room.find_by(room_name: params[:room_name])
    render layout: false
    # render :layout => 'forajax'
  end
  # def showjax
  #   render layout: false
  #   @user = User.find(current_user.id)
  # end

  def results
    @pictures = Picture.where(room_name: params[:room_name]).order(:id)
    @players = User.where(roomname: params[:room_name]).order(:randorder)
    @rankings = User.where(roomname: params[:room_name]).order(:score)
    @room = Room.find_by(room_name: params[:room_name])
  end


  private
    def room_params
      params.require(:room).permit(:room_name)
    end
    def picture_params
      params.require(:picture).permit(:image, :user_id, :room_name)
    end
end
