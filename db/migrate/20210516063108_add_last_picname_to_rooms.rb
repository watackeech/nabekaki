class AddLastPicnameToRooms < ActiveRecord::Migration[6.1]
  def change
    add_column :rooms, :last_picname, :string
  end
end
