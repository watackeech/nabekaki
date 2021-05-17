class PicpostController < ApplicationController

    include CarrierwaveBase64Uploader

    def create
        picture = Picture.new(picture_params)
        theString64 = params[:picture][:image]
        # picture.image = base64_conversion(theString64, params[:picture][:time])
        picture.image = base64_conversion(theString64)
        picture.room_name = params[:picture][:room_name]
        picture.user_id = params[:picture][:user_id]
        picture.picname = params[:picture][:picname]
        picture.in_room_order = params[:picture][:in_room_order]
        picture.length = params[:picture][:length]
        picture.judge = params[:picture][:judge]
        picture.points = params[:picture][:points]
        picture.save
    end

    private
        def picture_params
            params.require(:picture).permit(:image, :user_id, :room_name, :picname, :in_room_order, :length, :judge, :points)
        end
end









# def create
#     require 'base64'
#     require 'stringio'
#     picture = Picture.new(picture_params)
#     theString64 = params[:picture][:testtext]
#     picture.image = Base64.decode64(theString64)
#     picture.test = params[:picture][:test]
#     picture.room_name = params[:picture][:room_name]
#     picture.user_id = params[:picture][:user_id]
#     # File.open('imageBase64.png', 'wb') do|f|
#     #     f.write(Base64.decode64(theString64))
#     # end
#     # picture.testtext = params[:picture][:testtext]
#     # @picture.image = params['picture']['image']
#     if picture.save
#         return
#     else
#         return
#     end
# end