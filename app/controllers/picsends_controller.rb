class PicsendsController < ApplicationController
    def yay
        @images = Picture.all
        @image = Picture.new
    end

    def new
        @image = Picture.new
    end

    def create
        image = Picture.new(picture_params)
        if image.save
            return
        else
            return
        end
    end

    private
    def picture_params
      params.require(:picture).permit(:image, :user_id, :room_name)
    end

end