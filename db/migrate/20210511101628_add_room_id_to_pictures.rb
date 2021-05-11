class AddRoomIdToPictures < ActiveRecord::Migration[6.1]
  def change
    add_column :pictures, :room_name, :string
  end
end
