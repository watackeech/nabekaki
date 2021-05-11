class AddRoomnameToPictures < ActiveRecord::Migration[6.1]
  def change
    add_column :pictures, :user_id, :integer
    add_column :pictures, :room_id, :integer
  end
end
