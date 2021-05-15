class AddRotationToRooms < ActiveRecord::Migration[6.1]
  def change
    add_column :rooms, :rotation, :integer, default: 1
  end
end
