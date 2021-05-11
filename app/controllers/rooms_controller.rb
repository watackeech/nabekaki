class RoomsController < ApplicationController
  before_action :authenticate_user!

  def index
    @user = User.find(current_user.id)
  end

  def new
    @room = Room.new
    @user = User.find(current_user.id)
  end

  def create
    room = Room.new(room_params)
    room.user_id = current_user.id
    if room.save
      redirect_to :action => "join"
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
    @image = Picture.new
    @images = Picture.where(room_name: params[:room_name])
  end

  # ajax通信用のアクション
  def ajax
    render layout: false
    @images = Picture.all
  end

  def picajax
    render layout: false
    @room = Room.find_by(room_name: params[:room_name])
    @images = Picture.all
  end
  # def showjax
  #   render layout: false
  #   @user = User.find(current_user.id)
  # end


  private
    def room_params
      params.require(:room).permit(:room_name)
    end
end
