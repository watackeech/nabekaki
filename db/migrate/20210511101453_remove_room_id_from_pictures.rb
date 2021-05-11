class RemoveRoomIdFromPictures < ActiveRecord::Migration[6.1]
  def change
    remove_column :pictures, :room_id, :integer
  end
end
